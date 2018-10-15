"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var change_detection_util_1 = require("../../change_detection/change_detection_util");
var PRIVATE_PREFIX = '__ngOnChanges_';
/**
 * The NgOnChangesFeature decorates a component with support for the ngOnChanges
 * lifecycle hook, so it should be included in any component that implements
 * that hook.
 *
 * If the component or directive uses inheritance, the NgOnChangesFeature MUST
 * be included as a feature AFTER {@link InheritDefinitionFeature}, otherwise
 * inherited properties will not be propagated to the ngOnChanges lifecycle
 * hook.
 *
 * Example usage:
 *
 * ```
 * static ngComponentDef = defineComponent({
 *   ...
 *   inputs: {name: 'publicName'},
 *   features: [NgOnChangesFeature]
 * });
 * ```
 */
function NgOnChangesFeature(definition) {
    var declaredToMinifiedInputs = definition.declaredInputs;
    var proto = definition.type.prototype;
    var _loop_1 = function (declaredName) {
        if (declaredToMinifiedInputs.hasOwnProperty(declaredName)) {
            var minifiedKey = declaredToMinifiedInputs[declaredName];
            var privateMinKey_1 = PRIVATE_PREFIX + minifiedKey;
            // Walk the prototype chain to see if we find a property descriptor
            // That way we can honor setters and getters that were inherited.
            var originalProperty = undefined;
            var checkProto = proto;
            while (!originalProperty && checkProto &&
                Object.getPrototypeOf(checkProto) !== Object.getPrototypeOf(Object.prototype)) {
                originalProperty = Object.getOwnPropertyDescriptor(checkProto, minifiedKey);
                checkProto = Object.getPrototypeOf(checkProto);
            }
            var getter = originalProperty && originalProperty.get;
            var setter_1 = originalProperty && originalProperty.set;
            // create a getter and setter for property
            Object.defineProperty(proto, minifiedKey, {
                get: getter ||
                    (setter_1 ? undefined : function () { return this[privateMinKey_1]; }),
                set: function (value) {
                    var simpleChanges = this[PRIVATE_PREFIX];
                    if (!simpleChanges) {
                        simpleChanges = {};
                        // Place where we will store SimpleChanges if there is a change
                        Object.defineProperty(this, PRIVATE_PREFIX, { value: simpleChanges, writable: true });
                    }
                    var isFirstChange = !this.hasOwnProperty(privateMinKey_1);
                    var currentChange = simpleChanges[declaredName];
                    if (currentChange) {
                        currentChange.currentValue = value;
                    }
                    else {
                        simpleChanges[declaredName] =
                            new change_detection_util_1.SimpleChange(this[privateMinKey_1], value, isFirstChange);
                    }
                    if (isFirstChange) {
                        // Create a place where the actual value will be stored and make it non-enumerable
                        Object.defineProperty(this, privateMinKey_1, { value: value, writable: true });
                    }
                    else {
                        this[privateMinKey_1] = value;
                    }
                    if (setter_1)
                        setter_1.call(this, value);
                }
            });
        }
    };
    for (var declaredName in declaredToMinifiedInputs) {
        _loop_1(declaredName);
    }
    // If an onInit hook is defined, it will need to wrap the ngOnChanges call
    // so the call order is changes-init-check in creation mode. In subsequent
    // change detection runs, only the check wrapper will be called.
    if (definition.onInit != null) {
        definition.onInit = onChangesWrapper(definition.onInit);
    }
    definition.doCheck = onChangesWrapper(definition.doCheck);
}
exports.NgOnChangesFeature = NgOnChangesFeature;
function onChangesWrapper(delegateHook) {
    return function () {
        var simpleChanges = this[PRIVATE_PREFIX];
        if (simpleChanges != null) {
            this.ngOnChanges(simpleChanges);
            this[PRIVATE_PREFIX] = null;
        }
        if (delegateHook)
            delegateHook.apply(this);
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmdfb25jaGFuZ2VzX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL25nX29uY2hhbmdlc19mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0ZBQTBFO0FBSTFFLElBQU0sY0FBYyxHQUFHLGdCQUFnQixDQUFDO0FBUXhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUJHO0FBQ0gsNEJBQXNDLFVBQW1DO0lBQ3ZFLElBQU0sd0JBQXdCLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQztJQUMzRCxJQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQzs0QkFDN0IsWUFBWTtRQUNyQixJQUFJLHdCQUF3QixDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUN6RCxJQUFNLFdBQVcsR0FBRyx3QkFBd0IsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUMzRCxJQUFNLGVBQWEsR0FBRyxjQUFjLEdBQUcsV0FBVyxDQUFDO1lBRW5ELG1FQUFtRTtZQUNuRSxpRUFBaUU7WUFDakUsSUFBSSxnQkFBZ0IsR0FBaUMsU0FBUyxDQUFDO1lBQy9ELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztZQUN2QixPQUFPLENBQUMsZ0JBQWdCLElBQUksVUFBVTtnQkFDL0IsTUFBTSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsS0FBSyxNQUFNLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRTtnQkFDcEYsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDNUUsVUFBVSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDaEQ7WUFFRCxJQUFNLE1BQU0sR0FBRyxnQkFBZ0IsSUFBSSxnQkFBZ0IsQ0FBQyxHQUFHLENBQUM7WUFDeEQsSUFBTSxRQUFNLEdBQUcsZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDO1lBRXhELDBDQUEwQztZQUMxQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUU7Z0JBQ3hDLEdBQUcsRUFBRSxNQUFNO29CQUNQLENBQUMsUUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQW1DLE9BQU8sSUFBSSxDQUFDLGVBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzRixHQUFHLEVBQUgsVUFBK0IsS0FBUTtvQkFDckMsSUFBSSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO29CQUN6QyxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUNsQixhQUFhLEdBQUcsRUFBRSxDQUFDO3dCQUNuQiwrREFBK0Q7d0JBQy9ELE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLGNBQWMsRUFBRSxFQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxDQUFDLENBQUM7cUJBQ3JGO29CQUVELElBQU0sYUFBYSxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFhLENBQUMsQ0FBQztvQkFDMUQsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUVsRCxJQUFJLGFBQWEsRUFBRTt3QkFDakIsYUFBYSxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUM7cUJBQ3BDO3lCQUFNO3dCQUNMLGFBQWEsQ0FBQyxZQUFZLENBQUM7NEJBQ3ZCLElBQUksb0NBQVksQ0FBQyxJQUFJLENBQUMsZUFBYSxDQUFDLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO3FCQUNqRTtvQkFFRCxJQUFJLGFBQWEsRUFBRTt3QkFDakIsa0ZBQWtGO3dCQUNsRixNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxlQUFhLEVBQUUsRUFBQyxLQUFLLE9BQUEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztxQkFDckU7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLGVBQWEsQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDN0I7b0JBRUQsSUFBSSxRQUFNO3dCQUFFLFFBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2QyxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBbkRELEtBQUssSUFBTSxZQUFZLElBQUksd0JBQXdCO2dCQUF4QyxZQUFZO0tBbUR0QjtJQUVELDBFQUEwRTtJQUMxRSwwRUFBMEU7SUFDMUUsZ0VBQWdFO0lBQ2hFLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxJQUFJLEVBQUU7UUFDN0IsVUFBVSxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDekQ7SUFFRCxVQUFVLENBQUMsT0FBTyxHQUFHLGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1RCxDQUFDO0FBaEVELGdEQWdFQztBQUVELDBCQUEwQixZQUFpQztJQUN6RCxPQUFPO1FBQ0wsSUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzNDLElBQUksYUFBYSxJQUFJLElBQUksRUFBRTtZQUN6QixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2hDLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFDRCxJQUFJLFlBQVk7WUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUMsQ0FBQztBQUNKLENBQUMifQ==