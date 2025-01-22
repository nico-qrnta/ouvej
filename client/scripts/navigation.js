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
        handleNewPath(data)
      })
      .catch((error) => console.error("Error fetching route:", error));
  } else {
    alert("Please set both origin and destination.");
  }
}

function handleNewPath(route) {
  const polylineString = route.geometry;

  const decodedPath = L.Polyline.fromEncoded(polylineString).getLatLngs();

  const routeLine = L.polyline(decodedPath, { color: "blue" }).addTo(map);
  map.fitBounds(routeLine.getBounds());
}
