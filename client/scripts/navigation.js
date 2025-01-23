import { map } from './map.js'; 

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

    let deltaLat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += deltaLat;

    shift = 0;
    result = 0;

    do {
      byte = encoded.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);

    let deltaLng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += deltaLng;

    points.push([lat / 1e5, lng / 1e5]); 
  }

  return points;
}

export async function fetchPath() {
  const departInput = document.getElementById("departInput");
  const destinationInput = document.getElementById("destinationInput");

  if (departInput.value && destinationInput.value) {
    const departCoordinates = JSON.parse(departInput.dataset.coordinates);
    const destinationCoordinates = JSON.parse(
      destinationInput.dataset.coordinates
    );

    fetch("http://localhost:3000/path", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [departCoordinates, destinationCoordinates],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        handleNewPath(data)
      })
      .catch((error) => console.error("Error fetching route:", error));
  } else {
    alert("Please set both origin and destination.");
  }
}

function handleNewPath(route) {
  console.log("Received route:", route); // Log the entire route object

  const polylineString = route.geometry;  // Get the polyline string
  if (!polylineString) {
    console.error("No polyline string received from route.");
    return;
  }

  const decodedPolyline = decodePolyline(polylineString);
  console.log("Decoded polyline:", decodedPolyline);  // Log the decoded polyline

  // Check if the map is available
  if (!map) {
    console.error("Map is not initialized.");
    return;
  }

  // Remove the existing polyline if any
  if (window.polylineLayer) {
    console.log("Removing existing polyline.");
    map.removeLayer(window.polylineLayer);
  }

  // Create the new polyline
  window.polylineLayer = L.polyline(decodedPolyline, { color: 'blue' });

  // Check if polylineLayer is a valid Leaflet polyline object
  if (window.polylineLayer instanceof L.Polyline) {
    console.log("Adding polyline to map.");
    window.polylineLayer.addTo(map);
    
    // Zoom to fit the bounds of the new polyline
    map.fitBounds(window.polylineLayer.getBounds());
  } else {
    console.error("Polyline creation failed.");
  }
}