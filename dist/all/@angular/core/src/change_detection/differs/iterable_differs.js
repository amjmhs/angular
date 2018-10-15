"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var defs_1 = require("../../di/defs");
var metadata_1 = require("../../di/metadata");
var default_iterable_differ_1 = require("../differs/default_iterable_differ");
/**
 * A repository of different iterable diffing strategies used by NgFor, NgClass, and others.
 *
 */
var IterableDiffers = /** @class */ (function () {
    function IterableDiffers(factories) {
        this.factories = factories;
    }
    IterableDiffers.create = function (factories, parent) {
        if (parent != null) {
            var copied = parent.factories.slice();
            factories = factories.concat(copied);
        }
        return new IterableDiffers(factories);
    };
    /**
     * Takes an array of {@link IterableDifferFactory} and returns a provider used to extend the
     * inherited {@link IterableDiffers} instance with the provided factories and return a new
     * {@link IterableDiffers} instance.
     *
     * @usageNotes
     * ### Example
     *
     * The following example shows how to extend an existing list of factories,
     * which will only be applied to the injector for this component and its children.
     * This step is all that's required to make a new {@link IterableDiffer} available.
     *
     * ```
     * @Component({
     *   viewProviders: [
     *     IterableDiffers.extend([new ImmutableListDiffer()])
     *   ]
     * })
     * ```
     */
    IterableDiffers.extend = function (factories) {
        return {
            provide: IterableDiffers,
            useFactory: function (parent) {
                if (!parent) {
                    // Typically would occur when calling IterableDiffers.extend inside of dependencies passed
                    // to
                    // bootstrap(), which would override default pipes instead of extending them.
                    throw new Error('Cannot extend IterableDiffers without a parent injector');
                }
                return IterableDiffers.create(factories, parent);
            },
            // Dependency technically isn't optional, but we can provide a better error message this way.
            deps: [[IterableDiffers, new metadata_1.SkipSelf(), new metadata_1.Optional()]]
        };
    };
    IterableDiffers.prototype.find = function (iterable) {
        var factory = this.factories.find(function (f) { return f.supports(iterable); });
        if (factory != null) {
            return factory;
        }
        else {
            throw new Error("Cannot find a differ supporting object '" + iterable + "' of type '" + getTypeNameForDebugging(iterable) + "'");
        }
    };
    IterableDiffers.ngInjectableDef = defs_1.defineInjectable({
        providedIn: 'root',
        factory: function () { return new IterableDiffers([new default_iterable_differ_1.DefaultIterableDifferFactory()]); }
    });
    return IterableDiffers;
}());
exports.IterableDiffers = IterableDiffers;
function getTypeNameForDebugging(type) {
    return type['name'] || typeof type;
}
exports.getTypeNameForDebugging = getTypeNameForDebugging;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmFibGVfZGlmZmVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL2NoYW5nZV9kZXRlY3Rpb24vZGlmZmVycy9pdGVyYWJsZV9kaWZmZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQStDO0FBQy9DLDhDQUFxRDtBQUVyRCw4RUFBZ0Y7QUEySGhGOzs7R0FHRztBQUNIO0lBVUUseUJBQVksU0FBa0M7UUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztJQUFDLENBQUM7SUFFeEUsc0JBQU0sR0FBYixVQUFjLFNBQWtDLEVBQUUsTUFBd0I7UUFDeEUsSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO1lBQ2xCLElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDeEMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEM7UUFFRCxPQUFPLElBQUksZUFBZSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQW1CRztJQUNJLHNCQUFNLEdBQWIsVUFBYyxTQUFrQztRQUM5QyxPQUFPO1lBQ0wsT0FBTyxFQUFFLGVBQWU7WUFDeEIsVUFBVSxFQUFFLFVBQUMsTUFBdUI7Z0JBQ2xDLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ1gsMEZBQTBGO29CQUMxRixLQUFLO29CQUNMLDZFQUE2RTtvQkFDN0UsTUFBTSxJQUFJLEtBQUssQ0FBQyx5REFBeUQsQ0FBQyxDQUFDO2lCQUM1RTtnQkFDRCxPQUFPLGVBQWUsQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ25ELENBQUM7WUFDRCw2RkFBNkY7WUFDN0YsSUFBSSxFQUFFLENBQUMsQ0FBQyxlQUFlLEVBQUUsSUFBSSxtQkFBUSxFQUFFLEVBQUUsSUFBSSxtQkFBUSxFQUFFLENBQUMsQ0FBQztTQUMxRCxDQUFDO0lBQ0osQ0FBQztJQUVELDhCQUFJLEdBQUosVUFBSyxRQUFhO1FBQ2hCLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO1FBQy9ELElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtZQUNuQixPQUFPLE9BQU8sQ0FBQztTQUNoQjthQUFNO1lBQ0wsTUFBTSxJQUFJLEtBQUssQ0FDWCw2Q0FBMkMsUUFBUSxtQkFBYyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsTUFBRyxDQUFDLENBQUM7U0FDNUc7SUFDSCxDQUFDO0lBakVNLCtCQUFlLEdBQUcsdUJBQWdCLENBQUM7UUFDeEMsVUFBVSxFQUFFLE1BQU07UUFDbEIsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLGVBQWUsQ0FBQyxDQUFDLElBQUksc0RBQTRCLEVBQUUsQ0FBQyxDQUFDLEVBQXpELENBQXlEO0tBQ3pFLENBQUMsQ0FBQztJQStETCxzQkFBQztDQUFBLEFBbkVELElBbUVDO0FBbkVZLDBDQUFlO0FBcUU1QixpQ0FBd0MsSUFBUztJQUMvQyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLElBQUksQ0FBQztBQUNyQyxDQUFDO0FBRkQsMERBRUMifQ==