"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuItem
      className="w-full"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <div>
        <Sun className="h-[1.2rem] w-[1.2rem] text-neutral-800 dark:hidden dark:text-neutral-200" />
        <Moon className="hidden h-[1.2rem] w-[1.2rem] text-neutral-800 dark:block dark:text-neutral-200" />
      </div>
      <span className="text-neutral-800 dark:hidden dark:text-neutral-200">
        Light
      </span>
      <span className="hidden text-neutral-800 dark:block dark:text-neutral-200">
        Dark
      </span>
    </DropdownMenuItem>
  );
}
