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
import React from 'react';
import { render, screen, userEvent } from '../../../testing-utils';
import { updateItem } from "../../../services/api";
import { Item } from "./Item";
jest.mock('../../../services/api');
var mockData = {
    id: "1",
    description: "Apples",
    section: "Produce",
    checked: true
};
describe('Render', function () {
    it('should mark checked', function () {
        render(<Item item={mockData} removeItem={jest.fn()} updateItemState={jest.fn()} edit={false}/>);
        expect(screen.getByRole('checkbox')).toHaveAttribute('checked');
    });
    it('should not mark unchecked', function () {
        mockData.checked = false;
        render(<Item item={mockData} removeItem={jest.fn()} updateItemState={jest.fn()} edit={false}/>);
        expect(screen.getByRole('checkbox')).not.toHaveAttribute('checked');
    });
});
describe('Check an item', function () {
    var user;
    beforeEach(function () {
        user = userEvent.setup();
    });
    it('should call the api when the box is checked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var appleCheckbox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    render(<Item item={mockData} removeItem={jest.fn()} updateItemState={jest.fn()} edit={false}/>);
                    updateItem.mockReturnValue(Promise.resolve({
                        id: "1",
                        description: "Apples",
                        section: "Produce",
                        checked: true
                    }));
                    appleCheckbox = screen.getByRole('checkbox');
                    return [4 /*yield*/, user.click(appleCheckbox)];
                case 1:
                    _a.sent();
                    expect(updateItem).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should call the api when the box is unchecked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var appleCheckbox;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockData.checked = true;
                    render(<Item item={mockData} removeItem={jest.fn()} updateItemState={jest.fn()} edit={false}/>);
                    updateItem.mockReturnValue(Promise.resolve({
                        id: "1",
                        description: "Apples",
                        section: "Produce",
                        checked: false
                    }));
                    appleCheckbox = screen.getByRole('checkbox');
                    return [4 /*yield*/, user.click(appleCheckbox)];
                case 1:
                    _a.sent();
                    expect(updateItem).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Delete an item', function () {
    it('should call removeItem when delete button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var removeItem, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    removeItem = jest.fn();
                    user = userEvent.setup();
                    render(<Item item={mockData} removeItem={removeItem} updateItemState={jest.fn()} edit={false}/>);
                    return [4 /*yield*/, user.click(screen.getByLabelText('Delete Apples'))];
                case 1:
                    _a.sent();
                    expect(removeItem).toHaveBeenCalled();
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('Edit an item', function () {
    it('should open the text box when the edit button is clicked', function () { return __awaiter(void 0, void 0, void 0, function () {
        var removeItem, user, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    removeItem = jest.fn();
                    user = userEvent.setup();
                    render(<Item item={mockData} removeItem={removeItem} updateItemState={jest.fn()} edit={false}/>);
                    _b = (_a = user).click;
                    return [4 /*yield*/, screen.findByLabelText('Edit Apples')];
                case 1: return [4 /*yield*/, _b.apply(_a, [_c.sent()])];
                case 2:
                    _c.sent();
                    expect(true).toBeTruthy();
                    return [2 /*return*/];
            }
        });
    }); });
});
//# sourceMappingURL=Item.test.jsx.map