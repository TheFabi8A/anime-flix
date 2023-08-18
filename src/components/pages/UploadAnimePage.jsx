import { useState } from "react";
import { useFetch } from "@useFetch";

export default function UploadAnime() {
  const { postData } = useFetch("https://api-anime-flix.vercel.app/animes");

  const [sinopsisValue, setSinopsisValue] = useState("");
  const [selectedType, setSelectedType] = useState("series");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [animeUrl, setAnimeUrl] = useState("");
  const [animeName, setAnimeName] = useState("");
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [desktopImageFile, setDesktopImageFile] = useState(null);

  const availableGenres = [
    "Action",
    "Music",
    "Shonen",
    "Adventure",
    "Romance",
    "Slice of life",
    "Comedy",
    "Sci Fi",
    "Sports",
    "Drama",
    "Seinen",
    "Supernatural",
    "Fantasy",
    "Shojo",
    "Thriller",
  ];

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const cleanText = (text) => {
    return text.replace(/[^a-zA-Z0-9\s]/g, "");
  };

  const handleSinopsisChange = (event) => {
    setSinopsisValue(event.target.value);
  };

  const handleAnimeUrlChange = (event) => {
    const inputText = event.target.value;
    const formattedText = inputText
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setAnimeUrl(formattedText);
  };

  const handleGenreChange = (event) => {
    const { value } = event.target;
    setSelectedGenres((prevSelectedGenres) => {
      if (prevSelectedGenres.includes(value)) {
        return prevSelectedGenres.filter((genre) => genre !== value);
      } else {
        return [...prevSelectedGenres, value];
      }
    });
  };

  const handleAnimeNameChange = (event) => {
    const inputText = event.target.value;
    const cleanedText = cleanText(inputText);
    setAnimeName(cleanedText);
  };

  const handleMobileImageChange = (event) => {
    setMobileImageFile(event.target.files[0]);
  };

  const handleDesktopImageChange = (event) => {
    setDesktopImageFile(event.target.files[0]);
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    formData.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Error uploading image to Cloudinary");
      }

      const imageData = await response.json();
      return imageData.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageDesktopUrl = "";
      let imageMobileUrl = "";

      if (mobileImageFile && desktopImageFile) {
        imageMobileUrl = await uploadImageToCloudinary(mobileImageFile);
        imageDesktopUrl = await uploadImageToCloudinary(desktopImageFile);
      }

      const animeData = {
        "anime-url": animeUrl,
        "anime-name": animeName,
        sinopsis: sinopsisValue,
        type: selectedType,
        genres: selectedGenres,
        "image-mobile": imageMobileUrl,
        "image-desktop": imageDesktopUrl,
      };

      await postData(animeData, false);
      window.location.reload(true);
    } catch (error) {
      console.error("Error adding new anime:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      action="https://api-anime-flix.vercel.app/animes"
      method="POST"
      className="max-w-md mx-auto p-6 rounded-lg shadow border border-red-500">
      <label htmlFor="anime-url" className="block mb-2 font-semibold">
        Anime URL: [ English ]
      </label>
      <input
        type="text"
        id="anime-url"
        name="anime-url"
        className="w-full text-black px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-500"
        value={animeUrl}
        onChange={handleAnimeUrlChange}
        required
      />

      <label htmlFor="anime-name" className="block mt-4 mb-2 font-semibold">
        Anime Name:
      </label>
      <input
        type="text"
        id="anime-name"
        name="anime-name"
        className="w-full px-4 py-2 rounded border text-black focus:outline-none focus:ring-2 focus:ring-red-500"
        value={animeName}
        onChange={handleAnimeNameChange}
        required
      />

      <label htmlFor="sinopsis" className="block mt-4 mb-2 font-semibold">
        Sinopsis:
      </label>
      <textarea
        value={sinopsisValue}
        onChange={handleSinopsisChange}
        id="sinopsis"
        name="sinopsis"
        className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
        required></textarea>

      <label htmlFor="type" className="block mt-4 mb-2 font-semibold">
        Type: (Series / Movie):
      </label>
      <select
        value={selectedType}
        onChange={handleTypeChange}
        id="type"
        name="type"
        className="w-full px-4 py-2 text-black rounded border focus:outline-none focus:ring-2 focus:ring-red-500"
        required>
        <option value="series">Series</option>
        <option value="movie">Movie</option>
      </select>

      <label htmlFor="mobile-image" className="block mt-4 mb-2 font-semibold">
        Mobile Image:
      </label>
      <input
        type="file"
        id="mobile-image"
        name="mobile-image"
        onChange={handleMobileImageChange}
        className="w-full py-2 border focus:outline-none focus:ring-2 focus:ring-red-500"
        accept="image/*"
        required
      />

      <label htmlFor="desktop-image" className="block mt-4 mb-2 font-semibold">
        Desktop Image:
      </label>
      <input
        type="file"
        id="desktop-image"
        name="desktop-image"
        className="w-full py-2 border focus:outline-none focus:ring-2 focus:ring-red-500"
        accept="image/*"
        onChange={handleDesktopImageChange}
        required
      />

      <div className="mt-4 mb-2 font-semibold">Genres:</div>
      <div className="flex flex-wrap gap-2">
        {availableGenres.map((genre) => (
          <button
            type="button"
            key={genre}
            onClick={() => handleGenreChange({ target: { value: genre } })}
            className={`px-2 py-1 rounded border ${
              selectedGenres.includes(genre)
                ? "bg-red-500 text-white"
                : "bg-white text-black"
            }`}>
            {genre}
          </button>
        ))}
      </div>
      <button
        type="submit"
        className="mt-6 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-red-500">
        Modificar Anime
      </button>
    </form>
  );
}
