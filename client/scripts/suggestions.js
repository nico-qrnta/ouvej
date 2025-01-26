import { setStartMarker, setEndMarker } from "./map.js";
import {
  setOriginCoordinates,
  setDestinationCoordinates,
} from "./navigation.js";

export async function getInputSuggestions(query) {
  if (!query) {
    return [];
  }

  try {
    const response = await fetch(
      `http://localhost:3000/suggestion?search=${query}`
    );
    return await response.json();
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
}

export function updateSuggestions(suggestions, containerId) {
  const suggestionsContainer = document.getElementById(containerId);

  clearSuggestions(containerId);

  if (suggestions.length === 0) {
    suggestionsContainer.style.border = "none";
    return;
  }
  suggestionsContainer.style.border = "1px solid rgb(212, 212, 212)";

  suggestions.forEach((suggestion) => {
    const div = document.createElement("div");
    div.className = "suggestion";
    div.textContent = suggestion.display_name;
    div.onclick = () => selectSuggestion(containerId, suggestion);
    suggestionsContainer.appendChild(div);
  });
}

export function clearSuggestions(containerId) {
  const suggestionsContainer = document.getElementById(containerId);

  suggestionsContainer.style.border = "none";
  suggestionsContainer.innerHTML = "";
}

export function selectSuggestion(containerId, location) {
  const inputId =
    containerId === "departSuggestions" ? "departInput" : "destinationInput";
  const input = document.getElementById(inputId);

  input.value = location.display_name;

  clearSuggestions(containerId);

  if (inputId === "departInput") {
    setOriginCoordinates(location);
    setStartMarker(location);
  } else {
    setDestinationCoordinates(location);
    setEndMarker(location);
  }
}

export function debounce(callback, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => callback.apply(context, args), delay);
  };
}
