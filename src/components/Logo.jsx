import { useEffect, useRef } from "react";
import useAnimedButton from "../hooks/useAnimedButton.js";
import AnimLetter from "./AnimLetter.jsx";

export default function Logo() {
  const { logoArray, isValid, handleKeydown, colorLetter } = useAnimedButton();

  const mesRefs = useRef([]);

  function setRef(index) {
    return (element) => {
        mesRefs.current[index] = element
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);

    return () => {
        window.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  return (
    <div className="h-screen flex justify-center items-center">
      {logoArray.map((letter, index) => (
        <AnimLetter key={index + 1} index={index} char={letter} color={colorLetter[index]} isValid={isValid[index]} setRef={setRef(index)}/>
      ))}
    </div>
  );
}
