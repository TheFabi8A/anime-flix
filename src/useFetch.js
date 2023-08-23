import { useEffect, useState } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    setLoadingData(true);
    fetch(url)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => setError(error))
      .finally(() => setLoadingData(false));
  }, [url]);

  const postData = async (formData, uploadImages = false) => {
    try {
      if (uploadImages > 0) {
        const imagesResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!imagesResponse.ok) {
          throw new Error("Error uploading images");
        }

        const imagesData = await imagesResponse.json();
        formData.images = imagesData;
      }

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
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
      console.log("Error Response:", await error.response.json()); // Muestra el cuerpo de la respuesta en caso de error
      throw error;
    }
  };

  return { data, loadingData, error, postData };
}
