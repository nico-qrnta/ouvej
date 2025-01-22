export const fetchPlanSuggestion = async (search) => {

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${search}`
  );

  const data = await response.json();

  return data;
};
