import { create } from "./util.js";

export let vehicleList;
export let selectedVehicle;

export function openModal() {
  const vehicleModalContainer = document.getElementById(
    "vehicle-modal-container"
  );
  vehicleModalContainer.style.display = "block";
}

export function closeModal() {
  const vehicleModalContainer = document.getElementById(
    "vehicle-modal-container"
  );
  vehicleModalContainer.style.display = "none";
}

export async function initializeVehicleList() {
  vehicleList = await getVehicleList();
  updateVehicleList();
}

async function getVehicleList() {
  try {
    const response = await fetch(`http://localhost:3000/vehicles`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return [];
  }
}

async function fetchVehicleDetails(vehicle) {
  const vehicleId = vehicle.id;
  
  try {
    const response = await fetch(`http://localhost:3000/vehicle?vehicleId=${vehicleId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return null;
  }
}

async function updateVehicleList() {
  const vehicleListContainer = document.getElementById(
    "vehicle-list-container"
  );

  vehicleList.forEach((vehicle) => {
    createVehicleThumbnail(vehicleListContainer, vehicle);
  });
}

function createVehicleThumbnail(container, vehicle) {
  let vehicleContainer = create("div", container, null, "vehicle-container");
  let image = create("img", vehicleContainer, null, "vehicle-thumbnail");
  image.src = vehicle.media;

  let detailsContainer = create(
    "div",
    vehicleContainer,
    null,
    "vehicle-details-container"
  );
  create("span", detailsContainer, vehicle.model, "vehicle-model");
  create("span", detailsContainer, vehicle.make, "vehicle-make");

  vehicleContainer.addEventListener("click", () => {
    handleVehicleSelection(vehicle);
  });
}

async function handleVehicleSelection(vehicle) {
  const selectedVehicleContainer = document.getElementById(
    "selected-vehicle-container"
  );

  if (!selectedVehicle) {
    const selectButton = document.getElementById("openModalVehicleBtn");
    selectButton.style.display = "none";
    selectedVehicleContainer.style.display = "block";
  }

  selectedVehicle = await fetchVehicleDetails(vehicle);

  /* show vehicle informations */
  displaySelectedVehicle()
}


function displaySelectedVehicle(){
  const selectedVehicleContainer = document.getElementById(
    "selected-vehicle-container"
  );

  selectedVehicleContainer.innerHTML = "";

  const image = create("img", selectedVehicleContainer, null, "vehicle-thumbnail");
  image.src = selectedVehicle.media;

  const detailsContainer = create("div", selectedVehicleContainer, null, "vehicle-details");

  create("h2", detailsContainer, `${selectedVehicle.make} ${selectedVehicle.model}`, null, null);

  create("p", detailsContainer, `Batterie utilisable: ${selectedVehicle.battery.usable_kwh} kWh`, null, null);
  create("p", detailsContainer, `Autonomie estimée: ${selectedVehicle.battery.range} km`, null, null);

  create("p", detailsContainer, `Charge rapide: ${selectedVehicle.battery.fast_charging_support ? "Oui" : "Non"}`, null, null);

  const performanceContainer = create("div", detailsContainer);
  performanceContainer.innerHTML = `
    <p><strong>Performances :</strong></p>
    <ul>
      <li>Accélération (0-100 km/h): ${selectedVehicle.performance.acceleration} s</li>
      <li>Vitesse maximale: ${selectedVehicle.performance.top_speed} km/h</li>
    </ul>
  `;

  selectedVehicleContainer.addEventListener("click", () => {
    openModal();
  });

  closeModal();
}