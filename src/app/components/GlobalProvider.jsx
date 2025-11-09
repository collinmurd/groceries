"use client";
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import '@mantine/core/styles.css';
import { MantineProvider, Center, Loader } from "@mantine/core";
import { useState, useEffect } from "react";
import { FeaturesContext, FeatureSet, ToggleFeatureContext } from "../../context/featuresContext";
import { AuthProvider, useAuth } from "../../context/authContext";
import { getFeatures, updateFeature, GroceriesApiAuthError } from "../../services/api";
import ErrorHandler from "./ErrorHandler";
import { SetErrorContext } from "../../context/errorContext";
import { LockScreen } from "./LockScreen";
export default function GlobalProvider(_a) {
    var children = _a.children;
    return (<AuthProvider>
      <GlobalProvidersInner>{children}</GlobalProvidersInner>
    </AuthProvider>);
}
function GlobalProvidersInner(_a) {
    var _this = this;
    var children = _a.children;
    var _b = useAuth(), isAuthenticated = _b.isAuthenticated, authLoading = _b.isLoading;
    var _c = __read(useState([]), 2), features = _c[0], setFeatures = _c[1];
    var _d = __read(useState(null), 2), error = _d[0], setError = _d[1];
    var featureSet = new FeatureSet(features);
    function toggleFeature(name) {
        var feature = features.find(function (f) { return f.name === name; });
        if (feature) {
            feature.enabled = !feature.enabled;
            updateFeature(feature)
                .then(function (_) { return setFeatures(__spreadArray([], __read(features), false)); })
                .catch(function (e) {
                if (e instanceof GroceriesApiAuthError) {
                    // Auth errors are handled by showing lock screen
                    return;
                }
                console.log("Failed to update feature: ".concat(e));
            });
        }
    }
    var loadFeatures = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isAuthenticated)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, getFeatures()];
                case 2:
                    data = _a.sent();
                    setFeatures(data);
                    setError(null); // Clear any previous errors on success
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    if (e_1 instanceof GroceriesApiAuthError) {
                        // Auth errors are handled by showing lock screen
                        return [2 /*return*/];
                    }
                    // For other errors (like CORS/network), show a more user-friendly message
                    console.error('Failed to load features:', e_1);
                    setError("Unable to connect to server. Please make sure the server is running and try refreshing the page.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // retrieve features and make them globally available to the app
    useEffect(function () {
        loadFeatures();
    }, [isAuthenticated]);
    return (<MantineProvider defaultColorScheme="auto">
      {authLoading ? (<Center style={{ minHeight: '100vh' }}>
          <Loader size="lg"/>
        </Center>) : !isAuthenticated ? (<LockScreen />) : (<ErrorHandler error={error}>
          <SetErrorContext.Provider value={setError}>
            <FeaturesContext.Provider value={featureSet}>
              <ToggleFeatureContext.Provider value={toggleFeature}>
                <div id="root">{children}</div>
              </ToggleFeatureContext.Provider>
            </FeaturesContext.Provider>
          </SetErrorContext.Provider>
        </ErrorHandler>)}
    </MantineProvider>);
}
//# sourceMappingURL=GlobalProvider.jsx.map