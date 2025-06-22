import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu.tsx";

import { Link, useNavigate } from "react-router-dom";
import { FaGear } from "react-icons/fa6";

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
            <button 
              className="rounded-full bg-black w-8 h-8 flex justify-center items-center"
              title="Settings"
              aria-label="Settings"
              onClick={() => navigate('/settings')}
            >
              <FaGear size={16} color="white" />
            </button>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
