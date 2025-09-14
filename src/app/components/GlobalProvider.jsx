"use client";
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
import { MantineProvider } from "@mantine/core";
import { useState, useEffect } from "react";
import { FeaturesContext, FeatureSet, ToggleFeatureContext } from "../../context/featuresContext";
import { getFeatures, updateFeature } from "../../services/api";
import ErrorHandler from "./ErrorHandler";
import { SetErrorContext } from "../../context/errorContext";
export default function GlobalProvider(_a) {
    var children = _a.children;
    var _b = __read(useState([]), 2), features = _b[0], setFeatures = _b[1];
    var _c = __read(useState(null), 2), error = _c[0], setError = _c[1]; // central error state
    var featureSet = new FeatureSet(features);
    function toggleFeature(name) {
        var feature = features.find(function (f) { return f.name === name; });
        if (feature) {
            feature.enabled = !feature.enabled;
            updateFeature(feature)
                .then(function (_) { return setFeatures(__spreadArray([], __read(features), false)); })
                .catch(function (e) { return console.log("Failed to update feature: ".concat(e)); });
        }
    }
    // retrieve features and make them globally available to the app
    useEffect(function () {
        getFeatures()
            .then(function (data) {
            setFeatures(data);
        })
            .catch(function (_) { return setError("Failed to get features... try again later"); });
    }, []);
    return (<MantineProvider defaultColorScheme="auto">
      <ErrorHandler error={error}>
        <SetErrorContext.Provider value={setError}>
          <FeaturesContext.Provider value={featureSet}>
            <ToggleFeatureContext.Provider value={toggleFeature}>
              <div id="root">{children}</div>
            </ToggleFeatureContext.Provider>
          </FeaturesContext.Provider>
        </SetErrorContext.Provider>
      </ErrorHandler>
    </MantineProvider>);
}
//# sourceMappingURL=GlobalProvider.jsx.map