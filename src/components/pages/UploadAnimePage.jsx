import { useState } from "react";
import {
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
  Image,
} from "@nextui-org/react";
import { CloseSVG, UploadImageSVG } from "../svg";
import useFetch from "../../hooks/useFetch";

export default function UploadAnime() {
  const { postData } = useFetch("http://localhost:3000/animes");

  const [isLoadingPostData, setIsLoadingPostData] = useState(false);

  const [sinopsisValue, setSinopsisValue] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [animeUrl, setAnimeUrl] = useState("");
  const [animeName, setAnimeName] = useState("");

  //! Inputs Files
  const [mobileImageFile, setMobileImageFile] = useState(null);
  const [mobileImagePreview, setMobileImagePreview] = useState(null);

  const [desktopImageFile, setDesktopImageFile] = useState(null);
  const [desktopImagePreview, setDesktopImagePreview] = useState(null);

  const handleMobileImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMobileImageFile(file);
      setMobileImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDesktopImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setDesktopImageFile(file);
      setDesktopImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDesktopImageDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (
      file &&
      (file.type.includes("image/webp") ||
        file.type.includes("image/jpeg") ||
        file.type.includes("image/png"))
    ) {
      setDesktopImageFile(file);
      setDesktopImagePreview(URL.createObjectURL(file));
    } else {
      console.log("El archivo arrastrado no es una imagen válida.");
    }
  };

  const handleMobileImageDrop = (event) => {
    event.preventDefault();

    const file = event.dataTransfer.files[0];
    if (
      file &&
      (file.type.includes("image/webp") ||
        file.type.includes("image/jpeg") ||
        file.type.includes("image/png"))
    ) {
      setMobileImageFile(file);
      setMobileImagePreview(URL.createObjectURL(file));
    } else {
      console.log("El archivo arrastrado no es una imagen válida.");
    }
  };

  const clearMobileImage = () => {
    setMobileImageFile(null);
    setMobileImagePreview(null);
  };

  const clearDesktopImage = () => {
    setDesktopImageFile(null);
    setDesktopImagePreview(null);
  };

  //!...

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
      .replace(/[^a-z0-9\s-]/g, "")
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

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
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
        },
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
      setIsLoadingPostData(false);
      window.location.reload();
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
      className="m-4 flex max-w-md flex-col gap-4 rounded-lg border border-red-500 p-6 shadow md:mx-auto"
    >
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
            <span className="text-small text-default-400">
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
        isRequired
      >
        <SelectItem onClick={() => setSelectedType("series")} value="series">
          Series
        </SelectItem>
        <SelectItem onClick={() => setSelectedType("movie")} value="movie">
          Movie
        </SelectItem>
      </Select>
      <div>
        <label
          htmlFor="mobile-image"
          className="flex h-10 w-full items-center justify-center rounded-md bg-pink-600 text-white"
          onDragOver={(e) => e.preventDefault()}
          onDrag={(e) => e.preventDefault()}
          onDrop={handleMobileImageDrop}
        >
          Subir imagen formato móvil
        </label>
        <input
          className="hidden"
          type="file"
          id="mobile-image"
          name="mobile-image"
          onChange={handleMobileImageChange}
          accept=".webp, .jpg, .png"
          required
        />
      </div>
      {mobileImagePreview && (
        <div className="relative">
          <Image
            className="w-1/2"
            src={mobileImagePreview}
            alt="Mobile Image Preview"
          />
          <Button
            className="absolute right-2 top-2 z-10"
            onClick={clearMobileImage}
            isIconOnly
            color="secondary"
            variant="faded"
            aria-label="Eliminar imagen formato móvil"
          >
            <CloseSVG />
          </Button>
        </div>
      )}
      <div
        className="flex flex-col items-center rounded-md p-4 outline-dashed"
        onDragOver={(e) => e.preventDefault()}
        onDrag={(e) => e.preventDefault()}
        onDrop={handleDesktopImageDrop}
      >
        <span className="w-24">
          <UploadImageSVG />
        </span>
        <p className="px-4 text-center font-tektur font-bold">
          Arrastra y suelta la imagen en dimensiones{" "}
          <span className="underline">desktop</span> aquí
        </p>
        <span>o</span>
        <label
          htmlFor="desktop-image"
          className="flex h-10 w-full items-center justify-center rounded-md bg-purple-600 font-tektur font-bold tracking-widest text-white underline decoration-white decoration-wavy"
        >
          Busca el archivo
        </label>
        <p>desde tu dispositivo</p>
        <input
          className="hidden"
          type="file"
          id="desktop-image"
          name="desktop-image"
          onChange={handleDesktopImageChange}
          accept=".webp, .jpg, .png"
          required
        />
      </div>
      {desktopImagePreview && (
        <div className="relative">
          <Image src={desktopImagePreview} alt="Desktop Image Preview" />
          <Button
            className="absolute right-2 top-2 z-10"
            onClick={clearDesktopImage}
            isIconOnly
            color="secondary"
            variant="faded"
            aria-label="Eliminar imagen formato desktop"
          >
            <CloseSVG />
          </Button>
        </div>
      )}
      <Select
        label="Género/s :"
        color="secondary"
        variant="underlined"
        value={selectedGenres}
        selectionMode="multiple"
        isRequired
      >
        {availableGenres.map((genre) => (
          <SelectItem
            onClick={() => handleGenreChange({ target: { value: genre } })}
            color="default"
            variant="solid"
            key={genre}
            value={genre}
          >
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
          type="submit"
        >
          Agregando Anime
        </Button>
      ) : (
        <Button className="p-2" color="secondary" variant="solid" type="submit">
          Agregar Anime
        </Button>
      )}
    </form>
  );
}
