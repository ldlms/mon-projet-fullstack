import { useLocation } from "react-router-dom";
import NavBar from "../../organism/navbar/navBar.tsx";

const items = [
  { label: "Mes Deck", href: "/" },
  { label: "Card synergy", href: "/" },
];

const Header = () => {
  const location = useLocation();

  return (
    <header>
      <NavBar items={items} activeHref={location.pathname} />
    </header>
  );
};

export default Header;