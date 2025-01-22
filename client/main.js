import { initMap } from './scripts/map.js';
import { debounce, getInputSuggestions, updateSuggestions } from './scripts/suggestions.js';
import { fetchPath } from './scripts/navigation.js'
 
const map = initMap();

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
