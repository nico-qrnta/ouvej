import { initMap } from './scripts/map.js';
import { debounce, getInputSuggestions, updateSuggestions } from './scripts/suggestions.js';
import { fetchPath } from './scripts/navigation.js'
import { initializeVehicleList, openModal, closeModal } from './scripts/vehicle.js'; 

(() => {
  const map = initMap();
  initializeVehicleList();
})()

const autocompleteInput = debounce(async (event, containerId) => {
  const query = event.target.value;
  const suggestions = await getInputSuggestions(query);
  updateSuggestions(suggestions, containerId);
}, 300);

document.getElementById('departInput').addEventListener('input', (event) => {
  autocompleteInput(event, 'departSuggestions');
});

document.getElementById('destinationInput').addEventListener('input', (event) => {
  autocompleteInput(event, 'destinationSuggestions');
});

document.getElementById('getRouteBtn').addEventListener('click', () => {
  fetchPath();
});

document.getElementById('openModalVehicleBtn').addEventListener('click', () => {
  openModal();
});

document.getElementById('closeModalVehicleBtn').addEventListener('click', () => {
  closeModal();
});

window.addEventListener("load", () => {
  const departInput = document.getElementById("departInput");
  const destinationInput = document.getElementById("destinationInput");

  if (departInput) {
    departInput.value = "";
    delete departInput.dataset.coordinates;
  }

  if (destinationInput) {
    destinationInput.value = "";
    delete destinationInput.dataset.coordinates;
  }
});