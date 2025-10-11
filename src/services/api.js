var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var GroceriesApiError = /** @class */ (function (_super) {
    __extends(GroceriesApiError, _super);
    function GroceriesApiError(msg) {
        return _super.call(this, msg) || this;
    }
    return GroceriesApiError;
}(Error));
export { GroceriesApiError };
var GroceriesApiAuthError = /** @class */ (function (_super) {
    __extends(GroceriesApiAuthError, _super);
    function GroceriesApiAuthError(msg) {
        return _super.call(this, msg) || this;
    }
    return GroceriesApiAuthError;
}(GroceriesApiError));
export { GroceriesApiAuthError };
function getUrl() {
    if (process.env.NODE_ENV === 'development') {
        return 'http://localhost:8000';
    }
    return "".concat(window.location.origin, "/groceries/api");
}
function getToken() {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('accessToken');
    }
    return null;
}
function call(method_1, path_1) {
    return __awaiter(this, arguments, void 0, function (method, path, body) {
        var headers, token, opts;
        if (body === void 0) { body = null; }
        return __generator(this, function (_a) {
            headers = new Headers();
            token = getToken();
            if (token) {
                headers.append('Authorization', "Bearer ".concat(token));
            }
            opts = {
                method: method,
                headers: headers
            };
            if (body) {
                opts.body = JSON.stringify(body);
                headers.append('Content-Type', 'application/json');
            }
            return [2 /*return*/, fetch("".concat(getUrl()).concat(path), opts)
                    .then(function (resp) {
                    if (resp.status === 401) {
                        throw new GroceriesApiAuthError('Unauthorized');
                    }
                    if (!resp.ok) {
                        throw new GroceriesApiError(resp.statusText);
                    }
                    return resp;
                })
                    .then(function (resp) { return resp.status != 204 ? resp.json() : ""; })
                    .catch(function (err) {
                    if (err instanceof GroceriesApiAuthError) {
                        throw err;
                    }
                    throw new GroceriesApiError(err.message || 'API Error');
                })];
        });
    });
}
export function getItems() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, call('GET', '/items')];
        });
    });
}
export function createItem(item) {
    return __awaiter(this, void 0, void 0, function () {
        var id, data;
        return __generator(this, function (_a) {
            id = item.id, data = __rest(item, ["id"]);
            return [2 /*return*/, call('POST', '/items', data)];
        });
    });
}
export function updateItem(item) {
    return __awaiter(this, void 0, void 0, function () {
        var id, data;
        return __generator(this, function (_a) {
            id = item.id, data = __rest(item, ["id"]);
            return [2 /*return*/, call('PUT', "/items/".concat(item.id), data)];
        });
    });
}
export function deleteItem(item) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, call('DELETE', "/items/".concat(item.id))];
        });
    });
}
export function batchDeleteItems(ids) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, call('POST', '/items:batchDelete', ids)];
        });
    });
}
export function getFeatures() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, call('GET', '/features')];
        });
    });
}
export function updateFeature(feature) {
    return __awaiter(this, void 0, void 0, function () {
        var id, data;
        return __generator(this, function (_a) {
            id = feature.id, data = __rest(feature, ["id"]);
            return [2 /*return*/, call('PUT', "/features/".concat(feature.id), data)];
        });
    });
}
//# sourceMappingURL=api.js.map