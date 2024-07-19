import AnimedButton from "../components/AnimedButton";
import useAnimedButton from "../hooks/useAnimedButton";
import { useEffect } from "react";

export default function Accueil() {
  const { animeLetter, handleKeydown } = useAnimedButton();

  const colorLetter = ["#0A8754", "#EA3C76", "#CD8987", "#4C6085", "#F46036", "#004BA8"];
  const boxShadows = colorLetter.map((color) => `0px 4px 150px ${color}`);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  return (
    <div>
      {["L", "K", "Q", "M", "L", "R"].map((char, index) => (
        <AnimedButton char={char} key={index} isActive={animeLetter[index]} color={colorLetter[index]} boxShadow={boxShadows[index]} />
      ))}
    </div>
  );
}
