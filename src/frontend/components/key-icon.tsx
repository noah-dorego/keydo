import { Key } from "@/frontend/types.ts";
import { Card } from "./ui/card.tsx";

type KeyIconProps = {
  children: Key;
};

export function KeyIcon({ children }: KeyIconProps) {
  return <Card className="py-1 px-2 font-bold">{children}</Card>;
}
