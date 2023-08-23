import { useState } from "react";
import { useFetch } from "@useFetch";
import { Button, Input, Textarea, Select, SelectItem } from "@nextui-org/react";

export default function UploadAnime() {
  const { postData } = useFetch("http://localhost:3000/animes");

  const [isLoadingPostData, setIsLoadingPostData] = useState(false);

  const [sinopsisValue, setSinopsisValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
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

  const cleanText = (text) => {
    if (text.startsWith("-")) {
      text = text.slice(1);
    }
    return text.replace(/[^a-zA-Z0-9\s]/g, "");
  };

  const handleSinopsisChange = (event) => {
    setSinopsisValue(event.target.value);
  };

  const handleAnimeUrlChange = (event) => {
    const inputText = event.target.value;
    const formattedText = inputText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Allow only letters, numbers, spaces, and hyphens
      .replace(/^[ -]+/, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setAnimeUrl(formattedText);
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
    setIsLoadingPostData(true);

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
      window.location.reload();
      setIsLoadingPostData(false);
    } catch (error) {
      setIsLoadingPostData(false);
      console.error("Error adding new anime:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      action="http://localhost:3000/animes"
      method="POST"
      className="max-w-md md:mx-auto p-6 rounded-lg shadow border border-red-500 m-4">
      <Input
        color="secondary"
        label="Anime URL : [ English ]"
        placeholder="Ejemplo: bocchi-the-rock"
        variant="underlined"
        type="text"
        id="anime-url"
        name="anime-url"
        value={animeUrl}
        onChange={handleAnimeUrlChange}
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">
              {`https://animeflix/${
                selectedType.length > 0 ? selectedType + "/" : ""
              }`}
            </span>
          </div>
        }
        isRequired
      />
      <Input
        color="secondary"
        variant="underlined"
        label="Anime Name :"
        type="text"
        id="anime-name"
        name="anime-name"
        value={animeName}
        placeholder="Ejemplo: Bocchi The Rock"
        onChange={handleAnimeNameChange}
        isRequired
      />
      <Textarea
        color="secondary"
        variant="underlined"
        label="Sinopsis :"
        placeholder="Escribe la sinopsis"
        value={sinopsisValue}
        onChange={handleSinopsisChange}
        id="sinopsis"
        name="sinopsis"
        description="¡A resumir se ha dicho! Danos una sinopsis de ese anime para cautivar a quienes lo vean. Tu toque personal hace la diferencia."
        isRequired
      />
      <Select
        label="Type: ( Series / Movie )"
        color="secondary"
        variant="underlined"
        value={selectedType}
        id="type"
        name="type"
        isRequired>
        <SelectItem onClick={() => setSelectedType("series")} value="series">
          Series
        </SelectItem>
        <SelectItem onClick={() => setSelectedType("movie")} value="movie">
          Movie
        </SelectItem>
      </Select>
      <Input
        label="Mobile Image :"
        color="secondary"
        variant="underlined"
        type="file"
        id="mobile-image"
        name="mobile-image"
        onChange={handleMobileImageChange}
        accept="image/*"
        isRequired
      />
      <Input
        variant="underlined"
        color="secondary"
        label="Desktop Image :"
        type="file"
        id="desktop-image"
        name="desktop-image"
        accept="image/*"
        onChange={handleDesktopImageChange}
        isRequired
      />
      <Select
        label="Género/s :"
        color="secondary"
        variant="underlined"
        value={selectedGenres}
        selectionMode="multiple"
        isRequired>
        {availableGenres.map((genre) => (
          <SelectItem
            onClick={() => handleGenreChange({ target: { value: genre } })}
            color="default"
            variant="solid"
            key={genre}
            value={genre}>
            {genre}
          </SelectItem>
        ))}
      </Select>
      <p className="text-small text-default-500">
        Géneros seleccionados: {Array.from(selectedGenres).join(", ")}
      </p>
      {isLoadingPostData ? (
        <Button
          isLoading
          className="p-2"
          color="primary"
          variant="solid"
          type="submit">
          Agregando Anime
        </Button>
      ) : (
        <Button className="p-2" color="primary" variant="solid" type="submit">
          Agregar Anime
        </Button>
      )}
    </form>
  );
}
