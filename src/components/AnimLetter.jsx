import Button from "../assets/svg/Button.svg";
import ButtonPressed from "../assets/svg/ButtonPressed.svg";

export default function AnimLetter({ char, index, setRef, isValid, color }) {
  return (
    <button
      className="relative mx-8 w-[100px] h-[100px] rounded-xl"
      style={{boxShadow : `2px 2px 2px ${color}`}}
      id={index}
      ref={setRef}
      data-letter={isValid}
    >
      <div className="flex justify-center items-center">
        <img
          className=""
          src={isValid ? ButtonPressed : Button}
          alt="image d'un bouton intéractif"
        />
        <span
          className="absolute rounded-xl text-6xl mr-1 mb-2"
          style={{ color: color }}
        >
          {char}
        </span>
      </div>
    </button>
  );
}
