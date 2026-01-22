import type { StateType } from "@/lib/react-utils";
import type { SetStateAction } from "react";
import { createContext } from "react";

export const CardHoverContext = createContext<StateType<string | null>>([
  null,
  (_: SetStateAction<string | null>) => {
    throw new Error("mrow");
  },
]);
