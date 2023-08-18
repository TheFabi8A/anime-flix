import { useState } from "react";
import { useFetch } from "@useFetch";

export default function UploadAnime() {
  const { postData } = useFetch("http://localhost:3000/animes");

  const [sinopsisValue, setSinopsisValue] = useState("");
  const [mobileImageFileName, setMobileImageFileName] = useState("");
  const [desktopImageFileName, setDesktopImageFileName] = useState("");
  const [selectedType, setSelectedType] = useState("series");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [animeUrl, setAnimeUrl] = useState("");
  const [animeName, setAnimeName] = useState("");
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

  const imagesData = {
    home: {
      desktop: `/slider/desktop/${desktopImageFileName}`,
      mobile: `/slider/mobile/${mobileImageFileName}`,
    },
    page: {
      desktop: `/page/desktop/${desktopImageFileName}`,
      mobile: `/page/mobile/${mobileImageFileName}`,
    },
  };

  const handleMobileImageChange = (event) => {
    const fileName = event.target.files[0]?.name || "";
    setMobileImageFileName(fileName);
  };

  const handleDesktopImageChange = (event) => {
    const fileName = event.target.files[0]?.name || "";
    setDesktopImageFileName(fileName);
  };

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

  const handleSubmit = (event) => {
    event.preventDefault();

    const cleanedAnimeName = cleanText(animeName);

    const animeData = {
      "anime-url": animeUrl,
      "anime-name": cleanedAnimeName,
      sinopsis: sinopsisValue,
      type: selectedType,
      genres: selectedGenres,
      images: imagesData,
    };
    postData(animeData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      action="http://localhost:3000/animes"
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
