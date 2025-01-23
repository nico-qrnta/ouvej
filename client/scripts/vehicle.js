import { create } from "./util.js";

export let vehicleList;
export let selectedVehicle;

export function openModal(){
  const vehicleModalContainer = document.getElementById("vehicle-modal-container");
  vehicleModalContainer.style.display = "block";
}

export function closeModal(){
  const vehicleModalContainer = document.getElementById("vehicle-modal-container");
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

async function updateVehicleList() {
  const vehicleListContainer = document.getElementById("vehicle-list-container");

  vehicleList.forEach(vehicle => {
    createVehicleThumbnail(vehicleListContainer, vehicle)
  });
}


function createVehicleThumbnail(container, vehicle){
  let vehicleContainer = create("div", container, null, "vehicle-container");
  let image = create("img", vehicleContainer, null, "vehicle-thumbnail");
  image.src = vehicle.media;

  let detailsContainer = create("div", vehicleContainer, null, "vehicle-details-container");
  create("span", detailsContainer, vehicle.model, "vehicle-model");
  create("span", detailsContainer, vehicle.make, "vehicle-make");
}

