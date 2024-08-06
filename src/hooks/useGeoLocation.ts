import { useState } from "react";

type Location = [number, number];

export function useGeoLocation(dafaultLocation: Location | null = null) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [geoLocation, setGeoLocation] = useState<Location | null>(
    dafaultLocation
  );
  const [error, setError] = useState<string>("");

  function getLocation() {
    setError("");
    if (!navigator.geolocation)
      setError("Your browser doesn't support getting geo-location.");

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      function (position) {
        setGeoLocation([position.coords.latitude, position.coords.longitude]);
      },
      function (error) {
        setError(error.message);
      }
    );
    setIsLoading(false);
  }

  return { geoLocation, isLoading, error, getLocation };
}
