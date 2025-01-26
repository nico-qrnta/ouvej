import { map } from "./map.js";
import { selectedVehicle } from "./vehicle.js";

export let originCoordinates = null;
export let destinationCoordinates = null;

export async function fetchPath() {
  const departInput = document.getElementById("departInput");
  const destinationInput = document.getElementById("destinationInput");

  if (!originCoordinates) {
    alert("Veuillez indiquer le lieu départ.");
    return;
  }

  if (!destinationCoordinates) {
    alert("Veuillez indiquer le lieu d'arrivée.");
    return;
  }

  if (!selectedVehicle) {
    alert("Veuillez sélectionner un véhicule.");
    return;
  }

  fetch("http://localhost:3000/path", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [originCoordinates.lon, originCoordinates.lat],
        [destinationCoordinates.lon, destinationCoordinates.lat],
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      handleNewPath(data);
    })
    .catch((error) => console.error("Error fetching route:", error));
}

function handleNewPath(route) {
  const polylineString = route.geometry;
  if (!polylineString) {
    console.error("No polyline string received from route.");
    return;
  }

  const decodedPolyline = decodePolyline(polylineString);

  if (!map) {
    console.error("Map is not initialized.");
    return;
  }

  if (window.polylineLayer) {
    console.log("Removing existing polyline.");
    map.removeLayer(window.polylineLayer);
  }

  window.polylineLayer = L.polyline(decodedPolyline, { color: "blue" });

  if (window.polylineLayer instanceof L.Polyline) {
    window.polylineLayer.addTo(map);
    map.fitBounds(window.polylineLayer.getBounds());
  } else {
    console.error("Polyline creation failed.");
  }
}

function decodePolyline(encoded) {
  let points = [];
  let index = 0;
  let len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let shift = 0;
    let result = 0;
    let byte;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += deltaLng;

    points.push([lat / 1e5, lng / 1e5]);
  }

  return points;
}

export function setOriginCoordinates(location) {
  removeExistingPolyline();
  originCoordinates = location;
}

export function setDestinationCoordinates(location) {
  removeExistingPolyline();
  destinationCoordinates = location;
}

function removeExistingPolyline() {
  if (window.polylineLayer) {
    map.removeLayer(window.polylineLayer);
  }
}
