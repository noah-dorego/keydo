import { Key } from "@/frontend/types.ts";
import { Card } from "./ui/card.tsx";
import { KeyIcon } from "./key-icon.tsx";
import React from "react";

type ShortcutRowProps = {
  keys: Key[];
  action: string;
};

export function ShortcutRow({ keys, action }: ShortcutRowProps) {
  return (
    <Card className="mb-4">
      <div className="flex items-center">
        <div className="flex items-center gap-2 p-2">
          {keys.map((key, index) => (
            <React.Fragment key={index}>
              <KeyIcon>{key}</KeyIcon>
              {index < keys.length - 1 && " + "}
            </React.Fragment>
          ))}
        </div>
        <div>{action}</div>
      </div>
    </Card>
  );
}
