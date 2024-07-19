export default function Fade(props) {
  return (
    <div className="self-end mt-6 text-xl animate-opacityBounce">
      <span>{props.children}</span>
    </div>
  );
}
