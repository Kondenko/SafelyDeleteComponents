var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var deletedComponentPriority = 1;
function walkTree(node) {
    var children, _i, children_1, child;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, node];
            case 1:
                _a.sent();
                children = node.children;
                if (!children) return [3 /*break*/, 5];
                _i = 0, children_1 = children;
                _a.label = 2;
            case 2:
                if (!(_i < children_1.length)) return [3 /*break*/, 5];
                child = children_1[_i];
                return [5 /*yield**/, __values(walkTree(child))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}
function isInstance(instance, component) {
    try {
        return instance && instance.type == "INSTANCE" && instance.masterComponent && instance.masterComponent.id == component.id;
    }
    catch (e) {
        return false;
    }
}
function delay(ms, fn) {
    return new Promise(function (resolve) { return setTimeout(function () { return resolve(fn()); }, ms); });
}
function hasInstances(component) {
    return __awaiter(this, void 0, void 0, function () {
        function find() {
            return __awaiter(this, void 0, void 0, function () {
                var res, node;
                return __generator(this, function (_a) {
                    while (!(res = walker.next()).done) {
                        node = res.value;
                        if (isInstance(node, component)) {
                            return [2 /*return*/, true];
                        }
                        if (++count === 1000) {
                            return [2 /*return*/, delay(50, find)];
                        }
                    }
                    return [2 /*return*/, false];
                });
            });
        }
        var walker, count;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    walker = walkTree(figma.root);
                    count = 0;
                    return [4 /*yield*/, find()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function removeComponent(component) {
    return __awaiter(this, void 0, void 0, function () {
        var messageTextPadding, name_1, shouldBeKept;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    messageTextPadding = "    ";
                    if (!(component != undefined && component.type == "COMPONENT" && !component.removed)) return [3 /*break*/, 4];
                    name_1 = component.name;
                    if (!!component.remote) return [3 /*break*/, 2];
                    return [4 /*yield*/, hasInstances(component)];
                case 1:
                    shouldBeKept = _a.sent();
                    if (shouldBeKept === false) {
                        component.remove();
                        return [2 /*return*/, {
                                message: "\uD83D\uDDD1" + messageTextPadding + name_1 + " deleted",
                                priority: deletedComponentPriority
                            }];
                    }
                    else {
                        return [2 /*return*/, {
                                message: "\uD83D\uDD12" + messageTextPadding + name_1 + " has instances and won't be deleted",
                                priority: 2
                            }];
                    }
                    return [3 /*break*/, 3];
                case 2: return [2 /*return*/, {
                        message: "\uD83D\uDEAB" + messageTextPadding + name_1 + " is read-only",
                        priority: 3
                    }];
                case 3: return [3 /*break*/, 5];
                case 4: return [2 /*return*/, {
                        message: component ? "\u2753" + messageTextPadding + component.name + " is not a component" : "No component selected",
                        priority: 4
                    }];
                case 5: return [2 /*return*/];
            }
        });
    });
}
/* Main logic */
function safeDelete(nodes, onlyReportDeleted) {
    if (onlyReportDeleted === void 0) { onlyReportDeleted = false; }
    Promise.all(nodes.map(function (node) { return removeComponent(node); }))
        .then(function (results) { return showResults(results, onlyReportDeleted); })["catch"](function (err) {
        console.log("Error checking components: " + err);
        figma.closePlugin();
    });
}
function showResults(results, onlyReportDeleted) {
    if (onlyReportDeleted === void 0) { onlyReportDeleted = false; }
    var messages = results
        .sort(function (x, y) { return x.priority - y.priority; })
        .filter(function (res) { return !onlyReportDeleted || res.priority == deletedComponentPriority; });
    if (messages.length == 0) {
        figma.notify("Nothing selected");
    }
    else if (messages.length < 4) {
        Object.values(messages).forEach(function (res) { return figma.notify(res.message); });
        figma.closePlugin();
    }
    else {
        var text = Object.values(messages).map(function (res) { return res.message; }).join("\n\n");
        var style = "\n    white-space: pre-wrap;\n    padding: 8px;\n    line-height: 1.5;\n    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;\n    ";
        figma.showUI("<p style=\"" + style + "\">" + text + "</p>", { width: 500, height: 200 });
    }
}
/* Commands */
switch (figma.command) {
    case "safeDeleteSelection": {
        safeDeleteSelection();
        break;
    }
    case "deleteUnusedComponents": {
        deleteUnusedComponents();
        break;
    }
    default: {
        console.log("Unknown command " + figma.command);
        break;
    }
}
function safeDeleteSelection() {
    safeDelete(figma.currentPage.selection);
}
function deleteUnusedComponents() {
    safeDelete(figma.root.findAll(function (node) { return node.type == "COMPONENT"; }), true);
}
