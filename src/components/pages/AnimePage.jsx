/*eslint-disable */
import React from "react";

const AnimePage = ({
  animeName,
  animeSinopsis,
  genres,
  animeImageDesktop,
  animeImageMobile,
}) => {
  const isMobileView = window.innerWidth <= 767;

  //TODO -> Aún no agrego el grid para los episodios
  //! -> Nombre del anime con ... al final [ solo debe contar con 1 sola línea ]
  //! -> T[Número del temporada] - [ Nombre del episodio ]
  //! -> todo lo anterior + sinopsis al hacer hover en el contenedor del episodio
  //! + botón [ REPRODUCIR T[Número de temporada] E [Número de episodio] ]

  return (
    <>
      <div
        className="bg-cover relative bg-center"
        style={{
          backgroundImage: `url('${
            isMobileView ? animeImageMobile : animeImageDesktop
          }')`,
        }}>
        <span className="absolute w-full h-full backdrop-blur-sm backdrop-brightness-50"></span>
        <picture className="w-full shrink-0 relative">
          <source srcSet={animeImageMobile} media="(max-width: 767px)" />
          <img
            className="w-1/2 mx-auto md:max-w-screen-[930px] md:max-h-[35vh] 2xl:max-h-[60vh] object-scale-down"
            src={animeImageDesktop}
            alt={`${animeName} portada`}
          />
        </picture>
      </div>
      <div className="max-w-5xl mx-auto">
        <h1>{animeName}</h1>
        <div className="flex gap-2 uppercase flex-wrap">
          {genres.map((genre, index) => {
            return (
              <em
                className="not-italic block bg-red-500 text-sm px-2 py-1"
                key={genre}>
                {genre}
              </em>
            );
          })}
        </div>
        <p className="whitespace-pre-wrap">{animeSinopsis}</p>
      </div>
    </>
  );
};

export default AnimePage;
