export default function Fade({ children, areValid }) {
  return (
    <div className={areValid ? "duration-1000 hidden" : "self-center pl-56 text-xl animate-opacityBounce"}>
      <span className="font-josefin text-xl ">{children}</span>
    </div>
  );
}
