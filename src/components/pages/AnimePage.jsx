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
        className="relative bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            isMobileView ? animeImageMobile : animeImageDesktop
          }')`,
        }}
      >
        <span className="absolute h-full w-full backdrop-blur-sm backdrop-brightness-50"></span>
        <picture className="relative w-full shrink-0">
          <source srcSet={animeImageMobile} media="(max-width: 767px)" />
          <img
            className="md:max-w-screen-[930px] mx-auto w-1/2 object-scale-down md:max-h-[35vh] 2xl:max-h-[60vh]"
            src={animeImageDesktop}
            alt={`${animeName} portada`}
          />
        </picture>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 p-4">
        <h1 className="font-tektur text-2xl">{animeName}</h1>
        <div className="flex flex-wrap gap-2 uppercase">
          {genres.map((genre, index) => {
            return (
              <Chip
                className="rounded-md"
                color="secondary"
                variant="shadow"
                key={genre}
              >
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
