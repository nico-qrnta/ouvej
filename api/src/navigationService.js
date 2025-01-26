import dotenv from "dotenv";
dotenv.config();

export const fetchRoute = async (coordinates) => {
  const endpoint = "https://api.openrouteservice.org/v2/directions/driving-car";

  const data = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: process.env.OPENROUTE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      coordinates,
    }),
  });

  const responseData = await data.json();
  console.log(responseData);

  return responseData.routes[0];
};
