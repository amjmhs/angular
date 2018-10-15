/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Information needed to compile a directive for the render3 runtime.
 * @record
 */
export function R3DirectiveMetadata() { }
/**
 * Name of the directive type.
 * @type {?}
 */
R3DirectiveMetadata.prototype.name;
/**
 * An expression representing a reference to the directive itself.
 * @type {?}
 */
R3DirectiveMetadata.prototype.type;
/**
 * Number of generic type parameters of the type itself.
 * @type {?}
 */
R3DirectiveMetadata.prototype.typeArgumentCount;
/**
 * A source span for the directive type.
 * @type {?}
 */
R3DirectiveMetadata.prototype.typeSourceSpan;
/**
 * Dependencies of the directive's constructor.
 * @type {?}
 */
R3DirectiveMetadata.prototype.deps;
/**
 * Unparsed selector of the directive, or `null` if there was no selector.
 * @type {?}
 */
R3DirectiveMetadata.prototype.selector;
/**
 * Information about the content queries made by the directive.
 * @type {?}
 */
R3DirectiveMetadata.prototype.queries;
/**
 * Mappings indicating how the directive interacts with its host element (host bindings,
 * listeners, etc).
 * @type {?}
 */
R3DirectiveMetadata.prototype.host;
/**
 * Information about usage of specific lifecycle events which require special treatment in the
 * code generator.
 * @type {?}
 */
R3DirectiveMetadata.prototype.lifecycle;
/**
 * A mapping of input field names to the property names.
 * @type {?}
 */
R3DirectiveMetadata.prototype.inputs;
/**
 * A mapping of output field names to the property names.
 * @type {?}
 */
R3DirectiveMetadata.prototype.outputs;
/**
 * Whether or not the component or directive inherits from another class
 * @type {?}
 */
R3DirectiveMetadata.prototype.usesInheritance;
/**
 * Information needed to compile a component for the render3 runtime.
 * @record
 */
export function R3ComponentMetadata() { }
/**
 * Information about the component's template.
 * @type {?}
 */
R3ComponentMetadata.prototype.template;
/**
 * Information about the view queries made by the component.
 * @type {?}
 */
R3ComponentMetadata.prototype.viewQueries;
/**
 * A map of pipe names to an expression referencing the pipe type which are in the scope of the
 * compilation.
 * @type {?}
 */
R3ComponentMetadata.prototype.pipes;
/**
 * A map of directive selectors to an expression referencing the directive type which are in the
 * scope of the compilation.
 * @type {?}
 */
R3ComponentMetadata.prototype.directives;
/**
 * Information needed to compile a query (view or content).
 * @record
 */
export function R3QueryMetadata() { }
/**
 * Name of the property on the class to update with query results.
 * @type {?}
 */
R3QueryMetadata.prototype.propertyName;
/**
 * Whether to read only the first matching result, or an array of results.
 * @type {?}
 */
R3QueryMetadata.prototype.first;
/**
 * Either an expression representing a type for the query predicate, or a set of string selectors.
 * @type {?}
 */
R3QueryMetadata.prototype.predicate;
/**
 * Whether to include only direct children or all descendants.
 * @type {?}
 */
R3QueryMetadata.prototype.descendants;
/**
 * An expression representing a type to read from each matched node, or null if the node itself
 * is to be returned.
 * @type {?}
 */
R3QueryMetadata.prototype.read;
/**
 * Output of render3 directive compilation.
 * @record
 */
export function R3DirectiveDef() { }
/** @type {?} */
R3DirectiveDef.prototype.expression;
/** @type {?} */
R3DirectiveDef.prototype.type;
/**
 * Output of render3 component compilation.
 * @record
 */
export function R3ComponentDef() { }
/** @type {?} */
R3ComponentDef.prototype.expression;
/** @type {?} */
R3ComponentDef.prototype.type;
//# sourceMappingURL=api.js.map