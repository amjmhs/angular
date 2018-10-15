"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var resource_loading_1 = require("../../metadata/resource_loading");
var util_1 = require("../../util");
var environment_1 = require("./environment");
var fields_1 = require("./fields");
var module_1 = require("./module");
var util_2 = require("./util");
/**
 * Compile an Angular component according to its decorator metadata, and patch the resulting
 * ngComponentDef onto the component type.
 *
 * Compilation may be asynchronous (due to the need to resolve URLs for the component template or
 * other resources, for example). In the event that compilation is not immediate, `compileComponent`
 * will enqueue resource resolution into a global queue and will fail to return the `ngComponentDef`
 * until the global queue has been resolved with a call to `resolveComponentResources`.
 */
function compileComponent(type, metadata) {
    var def = null;
    // Metadata may have resources which need to be resolved.
    resource_loading_1.maybeQueueResolutionOfComponentResources(metadata);
    Object.defineProperty(type, fields_1.NG_COMPONENT_DEF, {
        get: function () {
            if (def === null) {
                if (resource_loading_1.componentNeedsResolution(metadata)) {
                    var error = ["Component '" + util_1.stringify(type) + "' is not resolved:"];
                    if (metadata.templateUrl) {
                        error.push(" - templateUrl: " + util_1.stringify(metadata.templateUrl));
                    }
                    if (metadata.styleUrls && metadata.styleUrls.length) {
                        error.push(" - styleUrls: " + JSON.stringify(metadata.styleUrls));
                    }
                    error.push("Did you run and wait for 'resolveComponentResources()'?");
                    throw new Error(error.join('\n'));
                }
                // The ConstantPool is a requirement of the JIT'er.
                var constantPool = new compiler_1.ConstantPool();
                // Parse the template and check for errors.
                var template = compiler_1.parseTemplate(metadata.template, "ng://" + util_1.stringify(type) + "/template.html", {
                    preserveWhitespaces: metadata.preserveWhitespaces || false,
                });
                if (template.errors !== undefined) {
                    var errors = template.errors.map(function (err) { return err.toString(); }).join(', ');
                    throw new Error("Errors during JIT compilation of template for " + util_1.stringify(type) + ": " + errors);
                }
                // Compile the component metadata, including template, into an expression.
                // TODO(alxhub): implement inputs, outputs, queries, etc.
                var res = compiler_1.compileComponentFromMetadata(__assign({}, directiveMetadata(type, metadata), { template: template, directives: new Map(), pipes: new Map(), viewQueries: [] }), constantPool, compiler_1.makeBindingParser());
                def = compiler_1.jitExpression(res.expression, environment_1.angularCoreEnv, "ng://" + type.name + "/ngComponentDef.js", constantPool);
                // If component compilation is async, then the @NgModule annotation which declares the
                // component may execute and set an ngSelectorScope property on the component type. This
                // allows the component to patch itself with directiveDefs from the module after it finishes
                // compiling.
                if (hasSelectorScope(type)) {
                    module_1.patchComponentDefWithScope(def, type.ngSelectorScope);
                }
            }
            return def;
        },
    });
}
exports.compileComponent = compileComponent;
function hasSelectorScope(component) {
    return component.ngSelectorScope !== undefined;
}
/**
 * Compile an Angular directive according to its decorator metadata, and patch the resulting
 * ngDirectiveDef onto the component type.
 *
 * In the event that compilation is not immediate, `compileDirective` will return a `Promise` which
 * will resolve when compilation completes and the directive becomes usable.
 */
function compileDirective(type, directive) {
    var def = null;
    Object.defineProperty(type, fields_1.NG_DIRECTIVE_DEF, {
        get: function () {
            if (def === null) {
                var constantPool = new compiler_1.ConstantPool();
                var sourceMapUrl = "ng://" + (type && type.name) + "/ngDirectiveDef.js";
                var res = compiler_1.compileDirectiveFromMetadata(directiveMetadata(type, directive), constantPool, compiler_1.makeBindingParser());
                def = compiler_1.jitExpression(res.expression, environment_1.angularCoreEnv, sourceMapUrl, constantPool);
            }
            return def;
        },
    });
}
exports.compileDirective = compileDirective;
function extendsDirectlyFromObject(type) {
    return Object.getPrototypeOf(type.prototype) === Object.prototype;
}
exports.extendsDirectlyFromObject = extendsDirectlyFromObject;
/**
 * Extract the `R3DirectiveMetadata` for a particular directive (either a `Directive` or a
 * `Component`).
 */
function directiveMetadata(type, metadata) {
    // Reflect inputs and outputs.
    var propMetadata = util_2.getReflect().propMetadata(type);
    var host = extractHostBindings(metadata, propMetadata);
    var inputsFromMetadata = parseInputOutputs(metadata.inputs || []);
    var outputsFromMetadata = parseInputOutputs(metadata.outputs || []);
    var inputsFromType = {};
    var outputsFromType = {};
    var _loop_1 = function (field) {
        if (propMetadata.hasOwnProperty(field)) {
            propMetadata[field].forEach(function (ann) {
                if (isInput(ann)) {
                    inputsFromType[field] = ann.bindingPropertyName || field;
                }
                else if (isOutput(ann)) {
                    outputsFromType[field] = ann.bindingPropertyName || field;
                }
            });
        }
    };
    for (var field in propMetadata) {
        _loop_1(field);
    }
    return {
        name: type.name,
        type: new compiler_1.WrappedNodeExpr(type),
        typeArgumentCount: 0,
        selector: metadata.selector,
        deps: util_2.reflectDependencies(type), host: host,
        inputs: __assign({}, inputsFromMetadata, inputsFromType),
        outputs: __assign({}, outputsFromMetadata, outputsFromType),
        queries: [],
        lifecycle: {
            usesOnChanges: type.prototype.ngOnChanges !== undefined,
        },
        typeSourceSpan: null,
        usesInheritance: !extendsDirectlyFromObject(type),
    };
}
function extractHostBindings(metadata, propMetadata) {
    // First parse the declarations from the metadata.
    var _a = compiler_1.parseHostBindings(metadata.host || {}), attributes = _a.attributes, listeners = _a.listeners, properties = _a.properties, animations = _a.animations;
    if (Object.keys(animations).length > 0) {
        throw new Error("Animation bindings are as-of-yet unsupported in Ivy");
    }
    var _loop_2 = function (field) {
        if (propMetadata.hasOwnProperty(field)) {
            propMetadata[field].forEach(function (ann) {
                if (isHostBinding(ann)) {
                    properties[ann.hostPropertyName || field] = field;
                }
                else if (isHostListener(ann)) {
                    listeners[ann.eventName || field] = field + "(" + (ann.args || []).join(',') + ")";
                }
            });
        }
    };
    // Next, loop over the properties of the object, looking for @HostBinding and @HostListener.
    for (var field in propMetadata) {
        _loop_2(field);
    }
    return { attributes: attributes, listeners: listeners, properties: properties };
}
function isInput(value) {
    return value.ngMetadataName === 'Input';
}
function isOutput(value) {
    return value.ngMetadataName === 'Output';
}
function isHostBinding(value) {
    return value.ngMetadataName === 'HostBinding';
}
function isHostListener(value) {
    return value.ngMetadataName === 'HostListener';
}
function parseInputOutputs(values) {
    return values.reduce(function (map, value) {
        var _a = value.split(',').map(function (piece) { return piece.trim(); }), field = _a[0], property = _a[1];
        map[field] = property || field;
        return map;
    }, {});
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9qaXQvZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7QUFFSCw4Q0FBaVE7QUFHalEsb0VBQW1IO0FBR25ILG1DQUFxQztBQUVyQyw2Q0FBNkM7QUFDN0MsbUNBQTREO0FBQzVELG1DQUFvRDtBQUNwRCwrQkFBdUQ7QUFNdkQ7Ozs7Ozs7O0dBUUc7QUFDSCwwQkFBaUMsSUFBZSxFQUFFLFFBQW1CO0lBQ25FLElBQUksR0FBRyxHQUFRLElBQUksQ0FBQztJQUNwQix5REFBeUQ7SUFDekQsMkRBQXdDLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDbkQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUseUJBQWdCLEVBQUU7UUFDNUMsR0FBRyxFQUFFO1lBQ0gsSUFBSSxHQUFHLEtBQUssSUFBSSxFQUFFO2dCQUNoQixJQUFJLDJDQUF3QixDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN0QyxJQUFNLEtBQUssR0FBRyxDQUFDLGdCQUFjLGdCQUFTLENBQUMsSUFBSSxDQUFDLHVCQUFvQixDQUFDLENBQUM7b0JBQ2xFLElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRTt3QkFDeEIsS0FBSyxDQUFDLElBQUksQ0FBQyxxQkFBbUIsZ0JBQVMsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFHLENBQUMsQ0FBQztxQkFDbEU7b0JBQ0QsSUFBSSxRQUFRLENBQUMsU0FBUyxJQUFJLFFBQVEsQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO3dCQUNuRCxLQUFLLENBQUMsSUFBSSxDQUFDLG1CQUFpQixJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUcsQ0FBQyxDQUFDO3FCQUNuRTtvQkFDRCxLQUFLLENBQUMsSUFBSSxDQUFDLHlEQUF5RCxDQUFDLENB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