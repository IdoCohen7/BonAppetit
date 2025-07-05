import { API_BASE_URL } from "../../config/apiConfig";
export function getOptimizedRouteWithSDK(placeIds, departureTimeISO) {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps) {
      return reject(new Error("Google Maps SDK not loaded"));
    }

    const directionsService = new window.google.maps.DirectionsService();

    const origin = { lat: 32.34275660731343, lng: 34.91205864972199 };
    const waypoints = placeIds.map(id => ({
      location: { placeId: id },
      stopover: true,
    }));

    directionsService.route(
      {
        origin,
        destination: origin,
        waypoints,
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true,
      },
      (result, status) => {
        if (status !== "OK") {
          reject(new Error("Directions failed: " + status));
          return;
        }

        const legs = result.routes[0].legs;
        const waypointOrder = result.routes[0].waypoint_order;
        const departure = new Date(departureTimeISO);
        let cumulativeSeconds = 0;

        const steps = waypointOrder.map((index, i) => {
          const leg = legs[i + 1]; // leg[0] = origin → first point
          const durationSec = leg?.duration?.value || 0;
          cumulativeSeconds += durationSec;

          return {
            placeId: placeIds[index],
            eta: new Date(departure.getTime() + cumulativeSeconds * 1000),
            durationText: leg?.duration?.text || "",
            durationSec,
          };
        });

        resolve(steps);
      }
    );
  });
}
