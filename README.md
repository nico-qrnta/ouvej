# Documentation de l'API Ouvej

Ouvej application réalisée pour INFO802

**Elève :** QUARANTA Nicolas - M1 INFO

## Liens

Application : https://salmon-bush-05fea8403.4.azurestaticapps.net/

API REST : https://ouvej-api.azurewebsites.net/

API SOAP : https://ouvej-soap.azurewebsites.net/?wsdl

## Introduction

L'API Ouvej fournit plusieurs services liés aux véhicules, aux itinéraires et aux suggestions de planification. Cette API est construite avec Express et prend en charge les requêtes JSON.

## Endpoints

### 1. Récupération de la liste des véhicules

**GET** `/vehicles`

#### Paramètres de requête :

| Nom      | Type     | Description                    | Valeur par défaut |
| -------- | -------- | ------------------------------ | ----------------- |
| `page`   | `int`    | Numéro de la page (pagination) | `0`               |
| `size`   | `int`    | Nombre de véhicules par page   | `10`              |
| `search` | `string` | Terme de recherche facultatif  | `""`              |

#### Réponse :

```json
[
  {
    "id": "5f043d88bc262f1627fc032b",
    "make": "Audi",
    "model": "e-tron Sportback",
    "media": "https://cars.chargetrip.io/60a51a62956f020a6712c7a4-fff290f5c62a451cc7f62933482d2f921a9e757a.png"
  }
]
```

---

### 2. Récupération des détails d'un véhicule

**GET** `/vehicle`

#### Paramètres de requête :

| Nom         | Type     | Description           |
| ----------- | -------- | --------------------- |
| `vehicleId` | `string` | ID du véhicule requis |

#### Réponses :

- **200 OK** : Retourne les détails du véhicule

```json
{
  "make": "Audi",
  "model": "e-tron Sportback",
  "media": "https://cars.chargetrip.io/60a51a62956f020a6712c7a4.png",
  "battery": {
    "usable_kwh": 64.7,
    "range": 290,
    "fast_charging_support": true
  },
  "performance": {
    "acceleration": 6.8,
    "top_speed": 190
  }
}
```

- **400 Bad Request** :

```json
{ "error": "Le champ 'vehicleId' est requis." }
```

- **500 Internal Server Error** : Erreur serveur

---

### 3. Suggestions de planification

**GET** `/suggestion`

#### Paramètres de requête :

| Nom      | Type     | Description               |
| -------- | -------- | ------------------------- |
| `search` | `string` | Terme de recherche requis |

#### Réponses :

- **200 OK** : Retourne des suggestions

```json
[
  {
    "place_id": 80594606,
    "licence": "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
    "osm_type": "relation",
    "osm_id": 74386,
    "lat": "45.5662672",
    "lon": "5.9203636",
    "class": "boundary",
    "type": "administrative",
    "place_rank": 16,
    "importance": 0.6173708707664438,
    "addresstype": "town",
    "name": "Chambéry",
    "display_name": "Chambéry, Savoie, Auvergne-Rhône-Alpes, France métropolitaine, 73000, France",
    "boundingbox": ["45.5480625", "45.6164340", "5.8712335", "5.9414391"]
  }
]
```

- **400 Bad Request** :

```json
{ "error": "Le champ 'search' est requis." }
```

- **500 Internal Server Error** : Erreur serveur

---

### 4. Calcul d'un itinéraire

**POST** `/route`

#### Corps de la requête :

```json
{
  "coordinates": [
    [48.8566, 2.3522],
    [45.764, 4.8357]
  ],
  "vehicle_autonomy": 300
}
```

#### Paramètres requis :

| Nom                | Type    | Description                                         |
| ------------------ | ------- | --------------------------------------------------- |
| `coordinates`      | `array` | Tableau de minimum 2 paires `[latitude, longitude]` |
| `vehicle_autonomy` | `int`   | Autonomie du véhicule en kilomètres                 |

#### Réponses :

- **200 OK** : Retourne les données d'itinéraire

```json
{
    "summary": {
        "total_distance": 742.14,
        "duration_travel_min": 742.14,
        "avg_speed": 60,
        "nb_stops": 5,
        "duration_recharge": 150,
        "min_per_kwh": 0.3,
        "total_duration": 892.14,
        "total_price": 100,
        "price_per_kwh": 0.2
    },
    "chargingStations": [
        {
            "lat": 45.5346056,
            "lon": 5.6714725,
            "name": "SEDI"
        },
        ...
    ],
    "routePointsPolyline": [
        [
            45.56632,
            5.92044
        ],
        ...
    ]
}
```

- **400 Bad Request** :

```json
{ "error": "Le champ 'coordinates' est requis." }
```

```json
{ "error": "Le champ 'vehicle_autonomy' est requis." }
```

- **500 Internal Server Error** : Erreur serveur

---

### 5. Page d'accueil

**GET** `/`

#### Réponse :

```text
Bienvenue sur l'api de Ouvej !
```

---

## Exécution

# Tutoriel de lancement du projet Ouvej

Ce guide explique comment lancer l'application Node.js et le service SOAP en Python dans le projet **Ouvej**.

## 1. Prérequis

Nécessite :

- **Node.js** v18 LTS
- **Python 3** v3.11

## 2. Installation et configuration

### 2.1 Cloner le projet

```bash
git clone git@github.com:nico-qrnta/ouvej.git
cd ouvej/
```

### 2.2 Configuration des variables d'environnement

Crée un fichier `.env` dans `ouvej/api/` :

```
CHARGETRIP_PROJECT_ID=
CHARGETRIP_APP_ID=
OPENROUTE_API_KEY=
SOAP_WSDL_URL=http://localhost:5000?wsdl
```

## 3. Lancement de l'API Node.js

### 3.1 Installation des dépendances

```bash
cd ouvej/api/
npm install
```

### 3.2 Démarrage de l'API

```bash
npm start
```

L'API sera accessible sur `http://localhost:3000`

## 4. Lancement du service SOAP en Python

### 4.1 Création d'un environnement virtuel (optionnel mais recommandé)

```bash
cd ouvej/soap/
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
```

### 4.2 Installation des dépendances

```bash
pip install -r requirements.txt
```

### 4.3 Démarrage du service SOAP

```bash
python main.py
```

L'API SOAP sera accessible sur `http://localhost:5000?wsdl`

## 5. Lancement de l'application web

### 5.1 Définir l'url de l'API

```bash
cd ./client/
```

modifier le fichier config.js

```js
const CONFIG = {
  BASE_API_URL: "http://localhost:3000",
};
```

### 5.2 Accéder au site

Site web statique donc accessible directement.
