import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, [url]);

  const postData = async (formData) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("New data added:", responseData);
      setData((prevData) => [...prevData, responseData]);
      return responseData;
    } catch (error) {
      console.error("Error adding new data:", error);
      throw error;
    }
  };

  return { data, loading, error, postData };
}
