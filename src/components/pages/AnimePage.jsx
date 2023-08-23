import { Chip } from "@nextui-org/react";

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
      <div className="max-w-5xl mx-auto p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-tektur">{animeName}</h1>
        <div className="flex gap-2 uppercase flex-wrap">
          {genres.map((genre, index) => {
            return (
              <Chip
                className="rounded-md"
                color="secondary"
                variant="shadow"
                key={genre}>
                {genre}
              </Chip>
            );
          })}
        </div>
        <p className="whitespace-pre-wrap">{animeSinopsis}</p>
      </div>
    </>
  );
};

export default AnimePage;
