// Custom hook to fetch weather using services/weatherService.js
import { useState, useEffect } from "react";
import { getWeatherByCity } from "../services/weatherService";

export default function useFetchWeather(city) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetch = async () => {
      setLoading(true);
      try {
        const d = await getWeatherByCity(city);
        if (mounted) setData(d);
      } catch (err) {
        if (mounted) setError(err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetch();

    return () => {
      mounted = false;
    };
  }, [city]);

  return { data, loading, error };
}
