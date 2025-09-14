import { createContext } from "react";
var FeatureSet = /** @class */ (function () {
    function FeatureSet(features) {
        this.features = [];
        this.features = features;
    }
    FeatureSet.prototype.getAllFeatures = function () {
        return this.features;
    };
    FeatureSet.prototype.check = function (name) {
        var feature = this.features.find(function (f) { return f.name === name; });
        return feature ? feature.enabled : false;
    };
    return FeatureSet;
}());
export { FeatureSet };
export var FeaturesContext = createContext(new FeatureSet([]));
export var ToggleFeatureContext = createContext(function (_) { console.log("ToggleFeatureContext not provided"); });
//# sourceMappingURL=featuresContext.js.map