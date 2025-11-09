// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
// https://mantine.dev/guides/jest/#mock-web-apis
var getComputedStyle = window.getComputedStyle;
window.getComputedStyle = function (elt) { return getComputedStyle(elt); };
window.HTMLElement.prototype.scrollIntoView = function () { };
window.matchMedia = function (query) { return ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
}); };
var ResizeObserver = /** @class */ (function () {
    function ResizeObserver() {
    }
    ResizeObserver.prototype.observe = function () { };
    ResizeObserver.prototype.unobserve = function () { };
    ResizeObserver.prototype.disconnect = function () { };
    return ResizeObserver;
}());
window.ResizeObserver = ResizeObserver;
//# sourceMappingURL=setupTests.js.map