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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { Box, Button, Checkbox, LoadingOverlay, SegmentedControl, Textarea, TextInput } from "@mantine/core";
import { forwardRef, useEffect, useRef, useState } from "react";
import * as api from "../../services/api";
export function IngredientParser(_a) {
    var finished = _a.finished;
    var _b = __read(useState('paste'), 2), inputMode = _b[0], setInputMode = _b[1];
    var _c = __read(useState(''), 2), pasteInput = _c[0], setPasteInput = _c[1];
    var _d = __read(useState(''), 2), linkInput = _d[0], setLinkInput = _d[1];
    var _e = __read(useState(null), 2), errorMessage = _e[0], setErrorMessage = _e[1];
    var _f = __read(useState([]), 2), parsedIngredients = _f[0], setParsedIngredients = _f[1];
    var _g = __read(useState(false), 2), loading = _g[0], setLoading = _g[1];
    var ingredientListRef = useRef(null);
    useEffect(function () {
        if (parsedIngredients.length > 0 && ingredientListRef.current) {
            ingredientListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [parsedIngredients]);
    var parseIngredients = function () {
        setErrorMessage(null);
        setLoading(true);
        var input = inputMode === 'paste' ? pasteInput : linkInput;
        var method = inputMode === 'paste' ? api.parseIngredientsWithText : api.parseIngredientsWithUrl;
        if (!input) {
            setErrorMessage("Input cannot be empty.");
            setLoading(false);
            return;
        }
        method(input)
            .then(function (ingredients) {
            setParsedIngredients(ingredients);
            setLoading(false);
        })
            .catch(function (err) {
            setErrorMessage("Error parsing ingredients: " + err.message);
            setLoading(false);
        });
    };
    return (<Box pos="relative">
      <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} loaderProps={{ type: 'dots' }}/>
      <h2>AI Ingredient Parser</h2>
      <p>Either paste a recipe below, or a link to a recipe.</p>
      <div>
        <SegmentedControl value={inputMode} onChange={setInputMode} data={[
            { label: 'Paste Recipe', value: 'paste' },
            { label: 'Recipe Link', value: 'link' },
        ]}/>
      </div>
      <div style={{ marginTop: 20 }}>
        {inputMode === 'paste' ?
            <Textarea placeholder="Paste your recipe here..." rows={10} style={{ width: '100%', marginTop: 10 }} value={pasteInput} onChange={function (event) { return setPasteInput(event.currentTarget.value); }}/>
            :
                <TextInput type="text" placeholder="Enter recipe URL here..." style={{ width: '100%', marginTop: 10 }} value={linkInput} onChange={function (event) { return setLinkInput(event.currentTarget.value); }}/>}
      </div>
      <div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>
      <div>
        <Button style={{ marginTop: 20 }} onClick={parseIngredients}>Parse Ingredients</Button>
      </div>
      {parsedIngredients.length > 0 && <IngredientListDisplay ref={ingredientListRef} ingredients={parsedIngredients} setLoading={setLoading} finished={finished}/>}
    </Box>);
}
var IngredientListDisplay = forwardRef(function IngredientListDisplay(_a, ref) {
    var _this = this;
    var ingredients = _a.ingredients, setLoading = _a.setLoading, finished = _a.finished;
    var _b = __read(useState(new Set()), 2), selectedIndicies = _b[0], setSelectedIndices = _b[1];
    var handleCheckboxChange = function (index) {
        var newSet = new Set(selectedIndicies);
        if (newSet.has(index)) {
            newSet.delete(index);
        }
        else {
            newSet.add(index);
        }
        setSelectedIndices(newSet);
    };
    var handleSubmit = function () { return __awaiter(_this, void 0, void 0, function () {
        var selectedIndicies_1, selectedIndicies_1_1, index, e_1_1, error_1;
        var e_1, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    setLoading(true);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 7, 8, 9]);
                    selectedIndicies_1 = __values(selectedIndicies), selectedIndicies_1_1 = selectedIndicies_1.next();
                    _b.label = 3;
                case 3:
                    if (!!selectedIndicies_1_1.done) return [3 /*break*/, 6];
                    index = selectedIndicies_1_1.value;
                    return [4 /*yield*/, api.createItem({
                            id: null,
                            description: ingredients[index].name,
                            section: ingredients[index].cat,
                            checked: false
                        })];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    selectedIndicies_1_1 = selectedIndicies_1.next();
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 9];
                case 7:
                    e_1_1 = _b.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 9];
                case 8:
                    try {
                        if (selectedIndicies_1_1 && !selectedIndicies_1_1.done && (_a = selectedIndicies_1.return)) _a.call(selectedIndicies_1);
                    }
                    finally { if (e_1) throw e_1.error; }
                    return [7 /*endfinally*/];
                case 9:
                    setLoading(false);
                    finished();
                    return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    setLoading(false);
                    // Optionally, show an error message to the user here
                    console.error("Failed to add one or more ingredients:", error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    return (<div ref={ref} style={{ marginTop: 50 }}>
        <h3>Parsed Ingredients</h3>
        <p>Check all ingredients you want to add to the list</p>
        {ingredients.map(function (ingredient, index) { return (<div key={index} style={{ marginBottom: 5 }}>
            <Checkbox type="checkbox" checked={selectedIndicies.has(index)} label={ingredient.name} onChange={function () { return handleCheckboxChange(index); }}/>
          </div>); })}
        <Button style={{ marginTop: 20 }} onClick={handleSubmit}>Add Selected Ingredients to List</Button>
      </div>);
});
//# sourceMappingURL=IngredientParser.jsx.map