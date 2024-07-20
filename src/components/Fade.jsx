export default function Fade(props) {
  return (
    <div className="self-end  text-xl animate-opacityBounce">
      <span className="font-josefin">{props.children}</span>
    </div>
  );
}
