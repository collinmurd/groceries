import { useEffect } from "react";
export function useExitOnEscape(callback) {
    useEffect(function () {
        var handleEscape = function (e) {
            if ((e.key === "Escape" || e.key === "Enter")) {
                callback();
            }
            ;
        };
        window.addEventListener('keydown', handleEscape);
        return function () { window.removeEventListener('keydown', handleEscape); };
    });
}
//# sourceMappingURL=hooks.jsx.map