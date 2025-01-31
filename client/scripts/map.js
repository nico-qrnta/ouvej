import { destinationCoordinates, originCoordinates } from "./navigation.js";

export let map;
let startMarker = null;
let endMarker = null;
let chargingStationsMarkers = [];

export function initMap() {
  if (!map) {
    map = L.map("map").setView([46.603354, 1.888334], 6);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  return map;
}

export function displayChargingStationMarker(lat, lon) {
  L.marker([lat, lon]).addTo(map);
}

export function clearChargingStationMarkers() {
  if (chargingStationsMarkers.length > 0) {
    chargingStationsMarkers.forEach(marker => map.removeLayer(marker));
    chargingStationsMarkers.length = 0;
  }
}


export function setStartMarker(location) {
  if (!map) {
    console.error("Map is not initialized.");
    return;
  }

  if (startMarker) {
    map.removeLayer(startMarker);
  }

  startMarker = L.marker([location.lat, location.lon], {
    title: location.name || "Starting Point",
  }).addTo(map);

  if (!isMarkersVisible(originCoordinates, destinationCoordinates)) {
    centerBounds(originCoordinates, destinationCoordinates);
  }
}

export function setEndMarker(location) {
  if (!map) {
    console.error("Map is not initialized.");
    return;
  }

  if (endMarker) {
    map.removeLayer(endMarker);
  }

  endMarker = L.marker([location.lat, location.lon], {
    title: location.name || "Destination",
  }).addTo(map);

  if (!isMarkersVisible(originCoordinates, destinationCoordinates)) {
    centerBounds(originCoordinates, destinationCoordinates);
  }
}

function isMarkersVisible(coord1, coord2) {
  const bounds = map.getBounds();

  if (coord1) {
    const point1 = L.latLng(coord1.lat, coord1.lon);

    console.log(coord1);

    if (!bounds.contains(point1)) {
      return false;
    }
  }

  if (coord2) {
    const point2 = L.latLng(coord2.lat, coord2.lon);
    if (!bounds.contains(point2)) {
      return false;
    }
  }
  console.log("coucou");

  return true;
}

function centerBounds(coord1, coord2) {
  if (coord1 && !coord2) {
    const point1 = L.latLng(coord1.lat, coord1.lon);
    map.setView(point1, map.getZoom(), {
      animate: true,
    });
    return;
  }

  if (!coord1 && coord2) {
    const point2 = L.latLng(coord2.lat, coord2.lon);
    map.setView(point2, map.getZoom(), {
      animate: true,
    });
    return;
  }

  const point1 = L.latLng(coord1.lat, coord1.lon);
  const point2 = L.latLng(coord2.lat, coord2.lon);

  const newBounds = L.latLngBounds(point1, point2);
  map.fitBounds(newBounds, {
    padding: [50, 50],
  });
}
