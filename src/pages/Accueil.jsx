import AnimedButton from "../components/AnimedButton";
import useAnimedButton from "../hooks/useAnimedButton";
import Fade from "../components/Fade";
import { useEffect, useState } from "react";

export default function Accueil() {
  const { animeLetter, handleKeydown, areValid } = useAnimedButton();

  const colorLetter = ["#0A8754", "#EA3C76", "#CD8987", "#4C6085", "#F46036", "#004BA8"];
  const boxShadows = colorLetter.map((color) => `1px 3px 4px 5px ${color}`);

  const [applyValidBoxShadow, setApplyValidBoxShadow] = useState(false);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  useEffect(() => {
    if (areValid) {
      const timer = setTimeout(() => {
        setApplyValidBoxShadow(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setApplyValidBoxShadow(false);
    }
  }, [areValid]);

  return (
    <div className={areValid ? "" : ""}>
      {["L", "K", "Q", "M", "L", "R"].map((char, index) => (
        <AnimedButton
          char={char}
          key={index}
          areValid={areValid}
          isActive={animeLetter[index]}
          color={colorLetter[index]}
          boxShadow={boxShadows[index]}
          applyValidBoxShadow={applyValidBoxShadow}
          validBoxShadow={`3px 3px 4px 0px ${colorLetter[index]}`}
        />
      ))}
      <Fade areValid={areValid}>Appuyez sur les touches du clavier pour continuer...</Fade>
    </div>
  );
}

// h-screen max-w-6xl mx-auto max-h-96 flex flex-row justify-center items-center
