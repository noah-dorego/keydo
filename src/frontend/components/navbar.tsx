import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu.tsx";

import { Link, useNavigate } from "react-router";
import { FaGear, FaHouse } from "react-icons/fa6";
import { ThemeToggle } from "./theme-toggle.tsx";
import { Button } from "./ui/button.tsx";

import keydoLogo from "../assets/keydo_logo_dark.svg";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between w-screen p-2 px-4">
      <Link to="/">
        <img src={keydoLogo} className="w-12 h-12" alt="Keydo logo" />
      </Link>
      <NavigationMenu className="">
        <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
            <ThemeToggle />
        </NavigationMenuItem>
        <NavigationMenuItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/')}
              className="w-10 h-10"
              title="Home"
            >
              <FaHouse size={16} />
            </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate('/settings')}
              className="w-10 h-10"
              title="Settings"
            >
              <FaGear size={16} />
            </Button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
