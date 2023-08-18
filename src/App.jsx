import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { AnimePage, HomePage, UploadAnimePage } from "./components";
import { useFetch } from "@useFetch";

export default function App() {
  const { data } = useFetch("http://localhost:3000/animes");

  return (
    <BrowserRouter>
      <header className="w-full h-16 bg-black">
        <Link to={"/upload-anime"}>Nuevo Video</Link>
        <Link to={"/"}>Volver al inicio</Link>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload-anime" element={<UploadAnimePage />} />
          {data?.map((anime) => (
            <Route
              key={anime["anime-url"]}
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
