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
  return data.routes[0]; // On suppose qu'on récupère le premier itinéraire
}

export async function fetchChargingStations(lat, lon, radius = 5000) {
  const response = await fetch(
    `https://odre.opendatasoft.com/api/explore/v2.1/catalog/datasets/bornes-irve/records?limit=100&where=within_distance(geo_point_borne, geom'POINT(${lon} ${lat})', 20km)`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch charging stations");
  }

  const data = await response.json();
  console.log("data ", data);
  return data.results.map((record) => ({
    lat: record.geo_point_borne.lat,
    lon: record.geo_point_borne.lon,
    name: record.n_amenageur,
  }));
}

// Fonction pour ajouter des bornes de recharge selon l'autonomie
export async function addChargingStationsToRoute(route, vehicleAutonomy) {
  const totalDistance = route.summary.distance / 1000;
  const routeCoordinates = polyline.decode(route.geometry);
  const chargingStops = [];

  let remainingDistance = totalDistance;
  let currentSegmentStart = routeCoordinates[0];
  let lastStop = currentSegmentStart;

  console.log("routeCoordinates", routeCoordinates);

  while (remainingDistance > 0) {
    const segmentDistance = Math.min(vehicleAutonomy * 0.8, remainingDistance);
    const segmentEnd =
      routeCoordinates[
        Math.floor((segmentDistance / totalDistance) * routeCoordinates.length)
      ];

    console.log("segment end ", segmentEnd);

    const [lat, lon] = segmentEnd;
    const chargingStations = await fetchChargingStations(lat, lon, 5000);

    if (chargingStations.length > 0) {
      chargingStops.push(...chargingStations);
    }

    remainingDistance -= segmentDistance;
    lastStop = segmentEnd;
  }

  return {
    routeWithCharging: routeCoordinates,
    chargingStops,
  };
}
