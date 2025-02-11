import { useSearchParams } from "react-router-dom";

export function useUrlLocation() {
  const [searchParams] = useSearchParams();
  const mapLat = searchParams.get("lat");
  const mapLng = searchParams.get("lng");
  if (mapLat === null || mapLng === null || isNaN(+mapLat) || isNaN(+mapLng))
    return { mapLat: null, mapLng: null };
  return { mapLat: +mapLat, mapLng: +mapLng };
}
