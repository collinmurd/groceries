var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
var AuthContext = createContext({
    token: null,
    isAuthenticated: false,
    login: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/];
    }); }); },
    logout: function () { },
    error: null,
    rememberDevice: false,
    setRememberDevice: function () { },
});
export var useAuth = function () { return useContext(AuthContext); };
function getApiUrl() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8000';
    }
    return "".concat(window.location.origin, "/groceries/api");
}
export var AuthProvider = function (_a) {
    var children = _a.children;
    var _b = __read(useState(null), 2), token = _b[0], setToken = _b[1];
    var _c = __read(useState(null), 2), error = _c[0], setError = _c[1];
    var _d = __read(useState(true), 2), rememberDevice = _d[0], setRememberDevice = _d[1];
    useEffect(function () {
        if (typeof window !== 'undefined') {
            var stored = localStorage.getItem('accessToken');
            var shouldRemember = localStorage.getItem('rememberDevice') !== 'false';
            if (stored && shouldRemember) {
                setToken(stored);
            }
            setRememberDevice(shouldRemember);
        }
    }, []);
    var login = function (pin) { return __awaiter(void 0, void 0, void 0, function () {
        var response, errorData, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch("".concat(getApiUrl(), "/auth/login"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ pin: pin }),
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || 'Login failed');
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    data = _a.sent();
                    setToken(data.accessToken);
                    if (typeof window !== 'undefined') {
                        if (rememberDevice) {
                            localStorage.setItem('accessToken', data.accessToken);
                        }
                        localStorage.setItem('rememberDevice', rememberDevice.toString());
                    }
                    return [3 /*break*/, 7];
                case 6:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Login failed');
                    throw err_1;
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var logout = function () {
        setToken(null);
        setError(null);
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
        }
    };
    return (<AuthContext.Provider value={{
            token: token,
            isAuthenticated: !!token,
            login: login,
            logout: logout,
            error: error,
            rememberDevice: rememberDevice,
            setRememberDevice: setRememberDevice
        }}>
      {children}
    </AuthContext.Provider>);
};
//# sourceMappingURL=authContext.jsx.map