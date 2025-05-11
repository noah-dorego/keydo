import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu.tsx";

import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

import keydoLogo from "../assets/keydo_logo_dark.svg";

export function NavBar() {
  return (
    <div className="flex justify-between w-screen p-2 pr-3">
      <a href="https://react.dev" target="_blank">
        <img src={keydoLogo} className="w-12 h-12" alt="React logo" />
      </a>
      <NavigationMenu className="">
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <div className="rounded-full bg-black w-8 h-8 flex justify-center items-center">
              <FaPlus size={16} color="white" />
            </div>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link to="/settings" title="Settings">
              <div className="rounded-full bg-black w-8 h-8 flex justify-center items-center">
                <FaGear size={16} color="white" />
              </div>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
