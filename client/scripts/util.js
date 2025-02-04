export function create(
  tagName,
  container,
  text = null,
  classs = null,
  id = null
) {
  let element = document.createElement(tagName);
  container.appendChild(element);
  if (text) element.appendChild(document.createTextNode(text));
  if (classs) element.classList.add(classs);
  if (id) element.id = id;
  return element;
}

export function formatDuration(minutes) {
  if (minutes < 1) return "moins d'une minute";

  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);
  const mins = Math.floor(minutes % 60);

  let result = [];
  if (days > 0) result.push(`${days}j`);
  if (hours > 0) result.push(`${hours}h`);
  if (mins > 0 || result.length === 0) result.push(`${mins}min`);

  return result.join(" ");
}
