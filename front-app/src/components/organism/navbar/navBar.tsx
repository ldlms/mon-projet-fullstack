import NavLink from "../../atoms/navLink/navLink.tsx";
import { NavBarProps } from "../../atoms/types/types.tsx";

const NavBar: React.FC<NavBarProps> = ({ items, activeHref, className }) => {
  return (
    <nav className={`flex space-x-4 ${className}`}>
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          isActive={activeHref === item.href}
          isDisabled={item.isDisabled}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default NavBar;
