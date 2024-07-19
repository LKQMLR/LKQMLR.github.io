import Accueil from "./pages/Accueil";
import Fade from "./components/Fade";

export default function App() {
  return (
    <div className=" h-screen flex items-center">
      <div className=" max-w-6xl mx-auto min-h-96 flex flex-col justify-center items-center">
        <Accueil />
        <Fade>Appuyez sur les touches du clavier pour continuer...</Fade>
      </div>
    </div>
  );
}
