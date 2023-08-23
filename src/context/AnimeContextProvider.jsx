import { createContext } from "react";

export const AnimeContext = createContext();

export default function AnimeContextProvider({ children }) {
  const pepito = "pepito";

  return (
    <AnimeContext.Provider value={{ pepito }}>{children}</AnimeContext.Provider>
  );
}
