import {
  map,
  displayChargingStationMarker,
  clearChargingStationMarkers,
  clearPolyline,
} from "./map.js";
import { selectedVehicle } from "./vehicle.js";
import { formatDuration } from "./util.js";

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

  if (!selectedVehicle) {
    alert("Veuillez sélectionner un véhicule.");
    return;
  }

  fetch(`${CONFIG.BASE_API_URL}/route`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates: [
        [originCoordinates.lon, originCoordinates.lat],
        [destinationCoordinates.lon, destinationCoordinates.lat],
      ],
      vehicle_autonomy: selectedVehicle.battery.range,
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
    displayChargingStationMarker(chargingStation.lat, chargingStation.lon);
  });

  displayPathInformations(route.summary);
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

function displayPathInformations(informations) {
  showItineraryDetails();

  const spanDistance = document.querySelector(".distance");
  const spanTotalPrice = document.querySelector(".total-price");
  const spanTotalDuration = document.querySelector(".total-duration");
  const spanNbStops = document.querySelector(".nb-stops");
  const spanDurationRecharging = document.querySelector(".duration-recharging");
  const spanMinPerKwh = document.querySelector(".min-per-kwh");
  const spanPricePerKwh = document.querySelector(".price-per-kwh");
  const spanPriceAvgSpeed = document.querySelector(".avg-speed");

  spanDistance.innerHTML = informations.total_distance;
  spanTotalPrice.innerHTML = informations.total_price;
  spanTotalDuration.innerHTML = formatDuration(informations.total_duration);
  spanNbStops.innerHTML = informations.nb_stops;
  spanDurationRecharging.innerHTML =
    informations.nb_stops > 0
      ? formatDuration(informations.duration_recharge)
      : "Non";
  spanMinPerKwh.innerHTML = informations.min_per_kwh;
  spanPricePerKwh.innerHTML = informations.price_per_kwh;
  spanPriceAvgSpeed.innerHTML = informations.avg_speed;
}

export function hideItineraryDetails() {
  const container = document.querySelector(".itinerary-details-container");
  container.style.display = "none";
}

function showItineraryDetails() {
  const container = document.querySelector(".itinerary-details-container");
  container.style.display = "flex";
}
