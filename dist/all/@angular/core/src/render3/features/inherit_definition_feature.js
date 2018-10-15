"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sets properties on a target object from a source object, but only if
 * the property doesn't already exist on the target object.
 * @param target The target to set properties on
 * @param source The source of the property keys and values to set
 */
function fillProperties(target, source) {
    for (var key in source) {
        if (source.hasOwnProperty(key) && !target.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
}
/**
 * Determines if a definition is a {@link ComponentDefInternal} or a {@link DirectiveDefInternal}
 * @param definition The definition to examine
 */
function isComponentDef(definition) {
    var def = definition;
    return typeof def.template === 'function';
}
function getSuperType(type) {
    return Object.getPrototypeOf(type.prototype).constructor;
}
/**
 * Merges the definition from a super class to a sub class.
 * @param definition The definition that is a SubClass of another directive of component
 */
function InheritDefinitionFeature(definition) {
    var superType = getSuperType(definition.type);
    var superDef = undefined;
    var _loop_1 = function () {
        if (isComponentDef(definition)) {
            superDef = superType.ngComponentDef || superType.ngDirectiveDef;
        }
        else {
            if (superType.ngComponentDef) {
                throw new Error('Directives cannot inherit Components');
            }
            superDef = superType.ngDirectiveDef;
        }
        if (superDef) {
            // Merge inputs and outputs
            fillProperties(definition.inputs, superDef.inputs);
            fillProperties(definition.declaredInputs, superDef.declaredInputs);
            fillProperties(definition.outputs, superDef.outputs);
            // Merge hostBindings
            var prevHostBindings_1 = definition.hostBindings;
            var superHostBindings_1 = superDef.hostBindings;
            if (superHostBindings_1) {
                if (prevHostBindings_1) {
                    definition.hostBindings = function (directiveIndex, elementIndex) {
                        superHostBindings_1(directiveIndex, elementIndex);
                        prevHostBindings_1(directiveIndex, elementIndex);
                    };
                }
                else {
                    definition.hostBindings = superHostBindings_1;
                }
            }
            // Inherit hooks
            // Assume super class inheritance feature has already run.
            definition.afterContentChecked =
                definition.afterContentChecked || superDef.afterContentChecked;
            definition.afterContentInit = definition.afterContentInit || superDef.afterContentInit;
            definition.afterViewChecked = definition.afterViewChecked || superDef.afterViewChecked;
            definition.afterViewInit = definition.afterViewInit || superDef.afterViewInit;
            definition.doCheck = definition.doCheck || superDef.doCheck;
            definition.onDestroy = definition.onDestroy || superDef.onDestroy;
            definition.onInit = definition.onInit || superDef.onInit;
            // Run parent features
            var features = superDef.features;
            if (features) {
                for (var _i = 0, features_1 = features; _i < features_1.length; _i++) {
                    var feature = features_1[_i];
                    if (feature && feature !== InheritDefinitionFeature) {
                        feature(definition);
                    }
                }
            }
        }
        else {
            // Even if we don't have a definition, check the type for the hooks and use those if need be
            var superPrototype = superType.prototype;
            if (superPrototype) {
                definition.afterContentChecked =
                    definition.afterContentChecked || superPrototype.afterContentChecked;
                definition.afterContentInit =
                    definition.afterContentInit || superPrototype.afterContentInit;
                definition.afterViewChecked =
                    definition.afterViewChecked || superPrototype.afterViewChecked;
                definition.afterViewInit = definition.afterViewInit || superPrototype.afterViewInit;
                definition.doCheck = definition.doCheck || superPrototype.doCheck;
                definition.onDestroy = definition.onDestroy || superPrototype.onDestroy;
                definition.onInit = definition.onInit || superPrototype.onInit;
            }
        }
        superType = Object.getPrototypeOf(superType);
    };
    while (superType && !superDef) {
        _loop_1();
    }
}
exports.InheritDefinitionFeature = InheritDefinitionFeature;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5oZXJpdF9kZWZpbml0aW9uX2ZlYXR1cmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3NyYy9yZW5kZXIzL2ZlYXR1cmVzL2luaGVyaXRfZGVmaW5pdGlvbl9mZWF0dXJlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBTUg7Ozs7O0dBS0c7QUFDSCx3QkFBd0IsTUFBK0IsRUFBRSxNQUErQjtJQUN0RixLQUFLLElBQU0sR0FBRyxJQUFJLE1BQU0sRUFBRTtRQUN4QixJQUFJLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdELE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDM0I7S0FDRjtBQUNILENBQUM7QUFDRDs7O0dBR0c7QUFDSCx3QkFBMkIsVUFBNEQ7SUFFckYsSUFBTSxHQUFHLEdBQUcsVUFBcUMsQ0FBQztJQUNsRCxPQUFPLE9BQU8sR0FBRyxDQUFDLFFBQVEsS0FBSyxVQUFVLENBQUM7QUFDNUMsQ0FBQztBQUVELHNCQUFzQixJQUFlO0lBRW5DLE9BQU8sTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDO0FBQzNELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxrQ0FDSSxVQUFnRTtJQUNsRSxJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLElBQUksUUFBUSxHQUFrRSxTQUFTLENBQUM7O1FBR3RGLElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzlCLFFBQVEsR0FBRyxTQUFTLENBQUMsY0FBYyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUM7U0FDakU7YUFBTTtZQUNMLElBQUksU0FBUyxD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