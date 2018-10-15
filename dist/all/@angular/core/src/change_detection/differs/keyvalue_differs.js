"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("../../di");
/**
 * A repository of different Map diffing strategies used by NgClass, NgStyle, and others.
 *
 */
var KeyValueDiffers = /** @class */ (function () {
    function KeyValueDiffers(factories) {
        this.factories = factories;
    }
    KeyValueDiffers.create = function (factories, parent) {
        if (parent) {
            var copied = parent.factories.slice();
            factories = factories.concat(copied);
        }
        return new KeyValueDiffers(factories);
    };
    /**
     * Takes an array of {@link KeyValueDifferFactory} and returns a provider used to extend the
     * inherited {@link KeyValueDiffers} instance with the provided factories and return a new
     * {@link KeyValueDiffers} instance.
     *
     * @usageNotes
     * ### Example
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {@link KeyValueDiffer} available.
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     KeyValueDiffers.extend([new ImmutableMapDiffer()])
     *   ]
     * })
     * ```
     */
    KeyValueDiffers.extend = function (factories) {
        return {
            provide: KeyValueDiffers,
            useFactory: function (parent) {
                if (!parent) {
                    // Typically would occur when calling KeyValueDiffers.extend inside of dependencies passed
                    // to bootstrap(), which would override default pipes instead of extending them.
                    throw new Error('Cannot extend KeyValueDiffers without a parent injector');
                }
                return KeyValueDiffers.create(factories, parent);
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[KeyValueDiffers, new di_1.SkipSelf(), new di_1.Optional()]]
        };
    };
    KeyValueDiffers.prototype.find = function (kv) {
        var factory = this.factories.find(function (f) { return f.supports(kv); });
        if (factory) {
            return factory;
        }
        throw new Error("Cannot find a differ supporting object '" + kv + "'");
    };
    return KeyValueDiffers;
}());
exports.KeyValueDiffers = KeyValueDiffers;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5dmFsdWVfZGlmZmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9rZXl2YWx1ZV9kaWZmZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0JBQTREO0FBd0c1RDs7O0dBR0c7QUFDSDtJQU1FLHlCQUFZLFNBQWtDO1FBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFBQyxDQUFDO0lBRXhFLHNCQUFNLEdBQWIsVUFBaUIsU0FBa0MsRUFBRSxNQUF3QjtRQUMzRSxJQUFJLE1BQU0sRUFBRTtZQUNWLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEM7UUFDRCxPQUFPLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUNJLHNCQUFNLEdBQWIsVUFBaUIsU0FBa0M7UUFDakQsT0FBTztZQUNMLE9BQU8sRUFBRSxlQUFlO1lBQ3hCLFVBQVUsRUFBRSxVQUFDLE1BQXVCO2dCQUNsQyxJQUFJLENBQUMsTUFBTSxFQUFFO29CQUNYLDBGQUEwRjtvQkFDMUYsZ0ZBQWdGO29CQUNoRixNQUFNLElBQUksS0FBSyxDQUFDLHlEQUF5RCxDQUFDLENBQUM7aUJBQzVFO2dCQUNELE9BQU8sZUFBZSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkQsQ0FBQztZQUNELDZGQUE2RjtZQUM3RixJQUFJLEVBQUUsQ0FBQyxDQUFDLGVBQWUsRUFBRSxJQUFJLGFBQVEsRUFBRSxFQUFFLElBQUksYUFBUSxFQUFFLENBQUMsQ0FBQztTQUMxRCxDQUFDO0lBQ0osQ0FBQztJQUVELDhCQUFJLEdBQUosVUFBSyxFQUFPO1FBQ1YsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDO1FBQ3pELElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxPQUFPLENBQUM7U0FDaEI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLDZDQUEyQyxFQUFFLE1BQUcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUEzREQsSUEyREM7QUEzRFksMENBQWUifQ==