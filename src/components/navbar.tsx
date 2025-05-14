import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu.tsx";

import { Link } from "react-router-dom";
import { FaGear } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa";

import keydoLogo from "../assets/keydo_logo_dark.svg";

interface NavBarProps {
  openAddShortcutModal: () => void;
}

export function NavBar({ openAddShortcutModal }: NavBarProps) {
  return (
    <div className="flex justify-between w-screen p-2 pr-3">
      <Link to="/">
        <img src={keydoLogo} className="w-12 h-12" alt="Keydo logo" />
      </Link>
      <NavigationMenu className="">
        <NavigationMenuList className="gap-2">
          <NavigationMenuItem>
            <div 
              className="rounded-full bg-black w-8 h-8 flex justify-center items-center cursor-pointer"
              onClick={openAddShortcutModal}
              title="Add new shortcut"
            >
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
