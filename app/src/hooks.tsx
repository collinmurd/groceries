import { useEffect } from "react";

export function useExitOnEscape(callback: Function) {
  useEffect(() => {
    const handleEscape = (e: any) => {
      if ((e.key === "Escape" || e.key === "Enter")) {
        callback();
      };
    }
    window.addEventListener('keydown', handleEscape);

    return () => {window.removeEventListener('keydown', handleEscape)}
  });
}