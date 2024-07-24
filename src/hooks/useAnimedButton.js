import { useState } from "react";

export default function useAnimedButton() {
  const logoArray = ["L", "K", "Q", "M", "L", "R"];
  const colorLetter = ["#0A8754", "#EA3C76", "#CD8987", "#4C6085", "#F46036", "#004BA8"];

  const [isValid, setIsValid] = useState([
    false,
    false,
    false,
    false,
    undefined,
    false,
  ]);

  const areValid = {};

  function handleKeydown(e) {
    const key = e.key.toUpperCase();

    setIsValid((prevState) => {
      const newState = [...prevState];

      if (key === "L") {
        if (prevState[0] !== true) {
          newState[0] = true;
          newState[4] = false;
        } else if (prevState[4] === false) {
          newState[4] = true;
        }
      }

      if (key === "K") {
        if(prevState[1] !== true) {
          newState[1] = true;
        }
      }
      if (key === "Q") {
        if(prevState[2] !== true) {
          newState[2] = true;
        }
      }
      if (key === "M") {
        if(prevState[3] !== true) {
          newState[3] = true;
        }
      }
      if (key === "R") {
        if(prevState[5] !== true) {
          newState[5] = true;
        }
      }
      return newState
    });
  }

  return { logoArray, isValid, handleKeydown, colorLetter };
}
