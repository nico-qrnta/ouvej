import dotenv from "dotenv";
import polyline from "polyline";

dotenv.config();

export async function fetchRoute(coordinates) {
  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/driving-car`,
    {
      method: "POST",
      headers: {
        Authorization: process.env.OPENROUTE_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: coordinates,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch route");
  }

  const data = await response.json();
  return data.routes[0];
}

export async function fetchChargingStations(lat, lon, radius = 5000) {
  const response = await fetch(
    `https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?limit=1&where=within_distance(geo_point_borne, geom'POINT(${lon} ${lat})', 60km)`
  );
  if (!response.ok) {
    throw new Error("Impossible de récupérer les stations de recharge");
  }

  const data = await response.json();
  console.log(data);
  return {
    lat: data.results[0].geo_point_borne.lat,
    lon: data.results[0].geo_point_borne.lon,
    name: data.results[0].n_amenageur,
  };
}

function haversineDistance(coord1, coord2) {
  const R = 6371;
  const toRad = (deg) => deg * (Math.PI / 180);
  let [lat1, lon1] = coord1;
  let [lat2, lon2] = coord2;

  let dLat = toRad(lat2 - lat1);
  let dLon = toRad(lon2 - lon1);

  let a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function extractEndSegmentCoordinates(points, segmentLength) {
  let endSegmentCoordinates = [];
  let segment = [];
  let distance = 0;

  for (let i = 0; i < points.length - 1; i++) {
    let d = haversineDistance(points[i], points[i + 1]);
    if (distance + d >= segmentLength) {
      endSegmentCoordinates.push({
        lat: points[i][0],
        lon: points[i][1],
      });
      segment = [points[i]];
      distance = 0;
    } else {
      segment.push(points[i]);
      distance += d;
    }
  }

  return endSegmentCoordinates;
}

async function findClosestChargingStation(coordinates) {
  return await fetchChargingStations(coordinates.lat, coordinates.lon);
}

export async function findRouteChargingStations(
  originCoordinates,
  destinationCoordinates,
  initialRoute,
  segmentLength
) {
  let finalRoute = initialRoute;
  let finalPointsPolyline = polyline.decode(initialRoute.geometry);
  let waypoints = [];
  let chargingStations = [];

  let endSegmentCoordinates = extractEndSegmentCoordinates(
    finalPointsPolyline,
    segmentLength
  );

  if (endSegmentCoordinates) {
    chargingStations = await Promise.all(
      endSegmentCoordinates.map((endSegment) =>
        findClosestChargingStation(endSegment)
      )
    );

    waypoints = chargingStations.map((waypoint) => [
      waypoint.lon,
      waypoint.lat,
    ]);

    waypoints.unshift(originCoordinates);
    waypoints.push(destinationCoordinates);

    console.log(waypoints);

    finalRoute = await fetchRoute(waypoints);
    finalPointsPolyline = polyline.decode(finalRoute.geometry);
  }

  return {
    chargingStations: chargingStations,
    routePointsPolyline: finalPointsPolyline,
  };
}
