export let map;

export function initMap() {
  if (!map) { 
    map = L.map("map").setView([46.603354, 1.888334], 6);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }

  return map;
}
  