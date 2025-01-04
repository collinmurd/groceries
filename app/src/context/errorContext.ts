import { createContext } from "react";

export const SetErrorContext = createContext<(error: string) => void >(() => {throw new Error("SetErrorContext not provided")} );