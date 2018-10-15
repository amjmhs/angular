"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _nextReferenceId = 0;
var MetadataOverrider = /** @class */ (function () {
    function MetadataOverrider() {
        this._references = new Map();
    }
    /**
     * Creates a new instance for the given metadata class
     * based on an old instance and overrides.
     */
    MetadataOverrider.prototype.overrideMetadata = function (metadataClass, oldMetadata, override) {
        var props = {};
        if (oldMetadata) {
            _valueProps(oldMetadata).forEach(function (prop) { return props[prop] = oldMetadata[prop]; });
        }
        if (override.set) {
            if (override.remove || override.add) {
                throw new Error("Cannot set and add/remove " + core_1.ɵstringify(metadataClass) + " at the same time!");
            }
            setMetadata(props, override.set);
        }
        if (override.remove) {
            removeMetadata(props, override.remove, this._references);
        }
        if (override.add) {
            addMetadata(props, override.add);
        }
        return new metadataClass(props);
    };
    return MetadataOverrider;
}());
exports.MetadataOverrider = MetadataOverrider;
function removeMetadata(metadata, remove, references) {
    var removeObjects = new Set();
    var _loop_1 = function (prop) {
        var removeValue = remove[prop];
        if (removeValue instanceof Array) {
            removeValue.forEach(function (value) { removeObjects.add(_propHashKey(prop, value, references)); });
        }
        else {
            removeObjects.add(_propHashKey(prop, removeValue, references));
        }
    };
    for (var prop in remove) {
        _loop_1(prop);
    }
    var _loop_2 = function (prop) {
        var propValue = metadata[prop];
        if (propValue instanceof Array) {
            metadata[prop] = propValue.filter(function (value) { return !removeObjects.has(_propHashKey(prop, value, references)); });
        }
        else {
            if (removeObjects.has(_propHashKey(prop, propValue, references))) {
                metadata[prop] = undefined;
            }
        }
    };
    for (var prop in metadata) {
        _loop_2(prop);
    }
}
function addMetadata(metadata, add) {
    for (var prop in add) {
        var addValue = add[prop];
        var propValue = metadata[prop];
        if (propValue != null && propValue instanceof Array) {
            metadata[prop] = propValue.concat(addValue);
        }
        else {
            metadata[prop] = addValue;
        }
    }
}
function setMetadata(metadata, set) {
    for (var prop in set) {
        metadata[prop] = set[prop];
    }
}
function _propHashKey(propName, propValue, references) {
    var replacer = function (key, value) {
        if (typeof value === 'function') {
            value = _serializeReference(value, references);
        }
        return value;
    };
    return propName + ":" + JSON.stringify(propValue, replacer);
}
function _serializeReference(ref, references) {
    var id = references.get(ref);
    if (!id) {
        id = "" + core_1.ɵstringify(ref) + _nextReferenceId++;
        references.set(ref, id);
    }
    return id;
}
function _valueProps(obj) {
    var props = [];
    // regular public props
    Object.keys(obj).forEach(function (prop) {
        if (!prop.startsWith('_')) {
            props.push(prop);
        }
    });
    // getters
    var proto = obj;
    while (proto = Object.getPrototypeOf(proto)) {
        Object.keys(proto).forEach(function (protoProp) {
            var desc = Object.getOwnPropertyDescriptor(proto, protoProp);
            if (!protoProp.startsWith('_') && desc && 'get' in desc) {
                props.push(protoProp);
            }
        });
    }
    return props;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YWRhdGFfb3ZlcnJpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3Rlc3Rpbmcvc3JjL21ldGFkYXRhX292ZXJyaWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUFzRDtBQU90RCxJQUFJLGdCQUFnQixHQUFHLENBQUMsQ0FBQztBQUV6QjtJQUFBO1FBQ1UsZ0JBQVcsR0FBRyxJQUFJLEdBQUcsRUFBZSxDQUFDO0lBMEIvQyxDQUFDO0lBekJDOzs7T0FHRztJQUNILDRDQUFnQixHQUFoQixVQUNJLGFBQXFDLEVBQUUsV0FBYyxFQUFFLFFBQTZCO1FBQ3RGLElBQU0sS0FBSyxHQUFjLEVBQUUsQ0FBQztRQUM1QixJQUFJLFdBQVcsRUFBRTtZQUNmLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJLElBQUssT0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQVMsV0FBWSxDQUFDLElBQUksQ0FBQyxFQUF0QyxDQUFzQyxDQUFDLENBQUM7U0FDcEY7UUFFRCxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDaEIsSUFBSSxRQUFRLENBQUMsTUFBTSxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7Z0JBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMsK0JBQTZCLGlCQUFTLENBQUMsYUFBYSxDQUFDLHVCQUFvQixDQUFDLENBQUM7YUFDNUY7WUFDRCxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQztRQUNELElBQUksUUFBUSxDQUFDLE1BQU0sRUFBRTtZQUNuQixjQUFjLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsSUFBSSxRQUFRLENBQUMsR0FBRyxF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