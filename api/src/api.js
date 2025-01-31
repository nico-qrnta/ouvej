import express from "express";
import cors from "cors";
import { fetchVehicleList, fetchVehicleDetails } from "./graphqlService.js";
import { fetchPlanSuggestion } from "./planService.js";
import {
  fetchRoute,
  fetchChargingStations,
  findRouteChargingStations,
} from "./navigationService.js";

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

app.get("/vehicles", async (req, res) => {
  const { page = 0, size = 10, search = "" } = req.query;

  try {
    const vehicles = await fetchVehicleList(Number(page), Number(size), search);
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vehicles" });
  }
});

app.get("/vehicle", async (req, res) => {
  const vehicleId = req.query.vehicleId;

  if (!vehicleId) {
    return res.status(400).json({ error: "Le champ 'vehicleId' est requis." });
  }

  try {
    const vehicleDetails = await fetchVehicleDetails(vehicleId);
    res.json(vehicleDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vehicle details" });
  }
});

app.get("/suggestion", async (req, res) => {
  const search = req.query.search;

  if (!search) {
    return res.status(400).json({ error: "Le champ 'search' est requis." });
  }

  try {
    const suggestions = await fetchPlanSuggestion(search);
    res.json(suggestions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch suggestions" });
  }
});

app.post("/route", async (req, res) => {
  const { coordinates, vehicle_autonomy } = req.body;

  if (!coordinates || coordinates.length < 2) {
    return res.status(400).json({
      error: "Veuillez renseigner des coordonnées valides.",
    });
  }

  if (!vehicle_autonomy) {
    return res.status(400).json({
      error: "Veuillez renseigner le chmap 'vehicle_autonomy' en km",
    });
  }

  try {
    const routeData = await fetchRoute(coordinates);
    const data = await findRouteChargingStations(
      coordinates[0],
      coordinates[1],
      routeData,
      vehicle_autonomy
    );

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: "Une erreur est survenue lors du calcul de l'itinéraire",
    });
  }
});

app.get("/", (req, res) => {
  res.send("Welcome to the Vehicle API");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
