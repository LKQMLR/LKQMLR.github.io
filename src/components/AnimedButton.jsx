import Button from "../assets/svg/Button.svg";
import ButtonPressed from "../assets/svg/ButtonPressed.svg";

export default function AnimedButton({ char, isActive, color, boxShadow, areValid, validBoxShadow, applyValidBoxShadow }) {
  return (
    <button className={`text-6xl ${isActive ? "scale-75 duration-500" : ""} `}>
      <div className="flex justify-center items-center relative">
        <span className={`absolute pt-3 font-josefin font-bold ${isActive ? "" : "opacity-50"}`} style={{ color: color }}>
          {char}
        </span>
        <img
          className={`rounded-2xl  ${isActive ? "transition duration-300 ease-in-out" : ""}`}
          style={isActive ? { boxShadow: applyValidBoxShadow ? validBoxShadow : boxShadow } : {}}
          src={isActive ? ButtonPressed : Button}
          alt=""
        />
      </div>
    </button>
  );
}
