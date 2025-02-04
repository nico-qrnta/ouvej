import { GraphQLClient } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

const endpoint = "https://api.chargetrip.io/graphql";

const vehicleListQuery = `
query vehicleList($page: Int, $size: Int, $search: String) {
  vehicleList(
    page: $page, 
    size: $size, 
    search: $search, 
  ) {
    id
    naming {
      make
      model
    }
    media {
      image {
        thumbnail_url
      }
    }
  }
}`;

const vehicleDetailsQuery = `
query vehicle($vehicleId: ID!) {
  vehicle(id: $vehicleId) {
    naming {
      make
      model
      chargetrip_version
    }
    media {
      image {
        url
      }
      brand {
        thumbnail_url
      }
    }
    battery {
      usable_kwh
    }
    range {
      best {
        highway
        city
        combined
      }
      worst {
        highway
        city
        combined
      }
      chargetrip_range {
        best
        worst
      }
    }
    routing {
      fast_charging_support
    }
    connectors {
      standard
    }
    performance {
      acceleration
      top_speed
    }
  }
}
`;

const client = new GraphQLClient(endpoint, {
  headers: {
    "x-client-id": process.env.CHARGETRIP_PROJECT_ID,
    "x-app-id": process.env.CHARGETRIP_APP_ID,
  },
});

export const fetchVehicleList = async (page, size, search) => {
  const variables = { page, size, search };
  try {
    const data = await client.request(vehicleListQuery, variables);

    console.log(data);

    const transformedVehicles = data.vehicleList.map((vehicle) => ({
      id: vehicle.id,
      make: vehicle.naming.make,
      model: vehicle.naming.model,
      media: vehicle.media.image.thumbnail_url,
    }));

    return transformedVehicles;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};

export const fetchVehicleDetails = async (vehicleId) => {
  const variables = { vehicleId };
  try {
    const data = await client.request(vehicleDetailsQuery, variables);

    const vehicle = data.vehicle;

    const bestAutonomy = vehicle.range.best.combined;
    const worstAutonomy = vehicle.range.worst.combined;
    const autonomy = (bestAutonomy + worstAutonomy) / 2;

    const transformedVehicle = {
      id: vehicle.id,
      make: vehicle.naming.make,
      model: vehicle.naming.model,
      media: vehicle.media.image.url,
      battery: {
        usable_kwh: vehicle.battery.usable_kwh,
        range: autonomy,
        fast_charging_support: vehicle.routing.fast_charging_support,
      },
      performance: {
        acceleration: vehicle.performance.acceleration,
        top_speed: vehicle.performance.top_speed,
      },
    };

    console.log(transformedVehicle);

    return transformedVehicle;
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    throw error;
  }
};
