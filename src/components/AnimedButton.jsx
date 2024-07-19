import Button from "../assets/svg/Button.svg";
import ButtonPressed from "../assets/svg/ButtonPressed.svg";

export default function AnimedButton({ char, isActive, color, boxShadow }) {
  console.log(boxShadow);
  return (
    <button className={`${isActive ? " text-6xl mx-4" : "  text-6xl mx-4"}`}>
      <div className="flex justify-center items-center">
        <span className="absolute pr-5 pb-3" style={{ color: color }}>
          {char}
        </span>
        <img className="rounded-2xl opacity-75" style={isActive ? { boxShadow: boxShadow } : {}} src={`${isActive ? ButtonPressed : Button}`} alt="" />
      </div>
    </button>
  );
}
