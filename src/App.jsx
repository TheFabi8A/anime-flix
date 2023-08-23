import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AnimePage, HomePage, UploadAnimePage } from "./components";
import { useFetch } from "@useFetch";

export default function App() {
  const { data } = useFetch("http://localhost:3000/animes");

  return (
    <BrowserRouter>
      <header className="flex h-16 w-full items-center justify-between p-2">
        <Link className="font-tektur text-3xl" to={"/"}>
          AnimeFlix
        </Link>
        <Link
          to="/upload-anime"
          className="grid w-max place-items-center rounded-md bg-red-500 p-2"
        >
          Agregar Anime
        </Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload-anime" element={<UploadAnimePage />} />
          {data?.map((anime, index) => (
            <Route
              key={index}
              path={`/${anime?.type}/${anime?.["anime-url"]}`}
              element={
                <AnimePage
                  animeName={anime?.["anime-name"]}
                  animeImageDesktop={anime?.["image-desktop"]}
                  animeImageMobile={anime?.["image-mobile"]}
                  animeSinopsis={anime?.sinopsis}
                  genres={anime?.genres}
                />
              }
            />
          ))}
        </Routes>
      </main>
      <footer></footer>
    </BrowserRouter>
  );
}
