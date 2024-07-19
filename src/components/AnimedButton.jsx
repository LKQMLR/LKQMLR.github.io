import Button from "../assets/svg/Button.svg";
import ButtonPressed from "../assets/svg/ButtonPressed.svg";

export default function AnimedButton({ char, isActive, color, boxShadow }) {
  return (
    <button className="text-6xl mx-4">
      <div className="flex justify-center items-center relative">
        <span className="absolute pr-5 pb-3" style={{ color: color }}>
          {char}
        </span>
        <img
          className={`rounded-2xl opacity-75  ${isActive ? "transition duration-300 ease-in-out" : ""}`}
          style={isActive ? { boxShadow: boxShadow } : {}}
          src={isActive ? ButtonPressed : Button}
          alt=""
        />
      </div>
    </button>
  );
}
