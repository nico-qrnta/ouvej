import { map, displayChargingStationMarker, clearChargingStationMarkers, clearPolyline } from "./map.js";
import { selectedVehicle } from "./vehicle.js";

export let originCoordinates = null;
export let destinationCoordinates = null;

export async function fetchPath() {
  if (!originCoordinates) {
    alert("Veuillez indiquer le lieu départ.");
    return;
  }

  if (!destinationCoordinates) {
    alert("Veuillez indiquer le lieu d'arrivée.");
    return;
  }

  // if (!selectedVehicle) {
  //   alert("Veuillez sélectionner un véhicule.");
  //   return;
  // }

  fetch("http://localhost:3000/route", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [originCoordinates.lon, originCoordinates.lat],
        [destinationCoordinates.lon, destinationCoordinates.lat],
      ],
      vehicle_autonomy: 357,
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
  const decodedPolyline = route.routePointsPolyline;

  if (!map) {
    console.error("Map is not initialized.");
    return;
  }

  clearPolyline();

  window.polylineLayer = L.polyline(decodedPolyline, { color: "#007bff" });
  window.polylineLayer.addTo(map);
  map.fitBounds(window.polylineLayer.getBounds());

  route.chargingStations.forEach((chargingStation) => {
    displayChargingStationMarker(
      chargingStation.lat,
      chargingStation.lon
    );
  });
}

export function setOriginCoordinates(location) {
  removeExistingPolyline();
  clearChargingStationMarkers();
  originCoordinates = location;
}

export function setDestinationCoordinates(location) {
  removeExistingPolyline();
  clearChargingStationMarkers();
  destinationCoordinates = location;
}

function removeExistingPolyline() {
  if (window.polylineLayer) {
    map.removeLayer(window.polylineLayer);
  }
}
