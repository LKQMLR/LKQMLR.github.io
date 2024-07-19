import { useState } from "react";
import keyboardSound from "../assets/audio/keyboardSound.mp3";

export default function useAnimedButton() {
  const [animeLetter, setAnimeLetter] = useState([false, false, false, false, undefined, false]);

  function handleKeydown(e) {
    const key = e.key.toUpperCase();

    const keyboardAudio = new Audio(keyboardSound);
    keyboardAudio.play();
    setAnimeLetter((prevState) => {
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
        newState[1] = true;
      }
      if (key === "Q") {
        newState[2] = true;
      }
      if (key === "M") {
        newState[3] = true;
      }
      if (key === "R") {
        newState[5] = true;
      }

      return newState;
    });
  }

  return { animeLetter, handleKeydown };
}
