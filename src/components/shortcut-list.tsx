import { FaPlus } from "react-icons/fa6";
import { Button } from "./ui/button.tsx";

export function ShortcutList() {
  return (
    <div className="w-screen px-4">
      <Button className="w-full border-dashed border-gray-500 border-2 bg-transparent text-gray-500 hover:border-none hover:bg-black hover:text-white">
        <FaPlus /> New
      </Button>
      <hr className="my-4 h-2 bg-black rounded-lg"></hr>
    </div>
  );
}
