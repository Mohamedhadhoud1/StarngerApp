import axios from "axios";

export async function fetchNearbyPlacesOSM({
  lat,
  lng,
  radius = 500,
  type = "cafe",
}: {
  lat: number;
  lng: number;
  radius?: number;
  type?: string;
}) {
  try {
    const query = `
      [out:json];
      (
        node["amenity"="${type}"](around:${radius},${lat},${lng});
        way["amenity"="${type}"](around:${radius},${lat},${lng});
        relation["amenity"="${type}"](around:${radius},${lat},${lng});
      );
      out center;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const res = await axios.get(url);
    return res.data.elements || [];
  } catch (err) {
    console.warn("OSM fetch error", err);
    return [];
  }
}