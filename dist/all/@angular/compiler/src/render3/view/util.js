"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var o = require("../../output/output_ast");
/** Name of the temporary to use during data binding */
exports.TEMPORARY_NAME = '_t';
/** Name of the context parameter passed into a template function */
exports.CONTEXT_NAME = 'ctx';
/** Name of the RenderFlag passed into a template function */
exports.RENDER_FLAGS = 'rf';
/** The prefix reference variables */
exports.REFERENCE_PREFIX = '_r';
/** The name of the implicit context reference */
exports.IMPLICIT_REFERENCE = '$implicit';
/** Name of the i18n attributes **/
exports.I18N_ATTR = 'i18n';
exports.I18N_ATTR_PREFIX = 'i18n-';
/** I18n separators for metadata **/
exports.MEANING_SEPARATOR = '|';
exports.ID_SEPARATOR = '@@';
/**
 * Creates an allocator for a temporary variable.
 *
 * A variable declaration is added to the statements the first time the allocator is invoked.
 */
function temporaryAllocator(statements, name) {
    var temp = null;
    return function () {
        if (!temp) {
            statements.push(new o.DeclareVarStmt(exports.TEMPORARY_NAME, undefined, o.DYNAMIC_TYPE));
            temp = o.variable(name);
        }
        return temp;
    };
}
exports.temporaryAllocator = temporaryAllocator;
function unsupported(feature) {
    if (this) {
        throw new Error("Builder " + this.constructor.name + " doesn't support " + feature + " yet");
    }
    throw new Error("Feature " + feature + " is not supported yet");
}
exports.unsupported = unsupported;
function invalid(arg) {
    throw new Error("Invalid state: Visitor " + this.constructor.name + " doesn't handle " + o.constructor.name);
}
exports.invalid = invalid;
function asLiteral(value) {
    if (Array.isArray(value)) {
        return o.literalArr(value.map(asLiteral));
    }
    return o.literal(value, o.INFERRED_TYPE);
}
exports.asLiteral = asLiteral;
function conditionallyCreateMapObjectLiteral(keys) {
    if (Object.getOwnPropertyNames(keys).length > 0) {
        return mapToExpression(keys);
    }
    return null;
}
exports.conditionallyCreateMapObjectLiteral = conditionallyCreateMapObjectLiteral;
function mapToExpression(map, quoted) {
    if (quoted === void 0) { quoted = false; }
    return o.literalMap(Object.getOwnPropertyNames(map).map(function (key) { return ({ key: key, quoted: quoted, value: asLiteral(map[key]) }); }));
}
exports.mapToExpression = mapToExpression;
/**
 *  Remove trailing null nodes as they are implied.
 */
function trimTrailingNulls(parameters) {
    while (o.isNull(parameters[parameters.length - 1])) {
        parameters.pop();
    }
    return parameters;
}
exports.trimTrailingNulls = trimTrailingNulls;
function getQueryPredicate(query, constantPool) {
    if (Array.isArray(query.predicate)) {
        return constantPool.getConstLiteral(o.literalArr(query.predicate.map(function (selector) { return o.literal(selector); })));
    }
    else {
        return query.predicate;
    }
}
exports.getQueryPredicate = getQueryPredicate;
function noop() { }
exports.noop = noop;
var DefinitionMap = /** @class */ (function () {
    function DefinitionMap() {
        this.values = [];
    }
    DefinitionMap.prototype.set = function (key, value) {
        if (value) {
            this.values.push({ key: key, value: value, quoted: false });
        }
    };
    DefinitionMap.prototype.toLiteralMap = function () { return o.literalMap(this.values); };
    return DefinitionMap;
}());
exports.DefinitionMap = DefinitionMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9yZW5kZXIzL3ZpZXcvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILDJDQUE2QztBQUs3Qyx1REFBdUQ7QUFDMUMsUUFBQSxjQUFjLEdBQUcsSUFBSSxDQUFDO0FBRW5DLG9FQUFvRTtBQUN2RCxRQUFBLFlBQVksR0FBRyxLQUFLLENBQUM7QUFFbEMsNkRBQTZEO0FBQ2hELFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQztBQUVqQyxxQ0FBcUM7QUFDeEIsUUFBQSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFFckMsaURBQWlEO0FBQ3BDLFFBQUEsa0JBQWtCLEdBQUcsV0FBVyxDQUFDO0FBRTlDLG1DQUFtQztBQUN0QixRQUFBLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFDbkIsUUFBQSxnQkFBZ0IsR0FBRyxPQUFPLENBQUM7QUFFeEMsb0NBQW9DO0FBQ3ZCLFFBQUEsaUJBQWlCLEdBQUcsR0FBRyxDQUFDO0FBQ3hCLFFBQUEsWUFBWSxHQUFHLElBQUksQ0FBQztBQUVqQzs7OztHQUlHO0FBQ0gsNEJBQW1DLFVBQXlCLEVBQUUsSUFBWTtJQUN4RSxJQUFJLElBQUksR0FBdUIsSUFBSSxDQUFDO0lBQ3BDLE9BQU87UUFDTCxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ1QsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsc0JBQWMsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7WUFDakYsSUFBSSxHQUFHLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDekI7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUMsQ0FBQztBQUNKLENBQUM7QUFURCxnREFTQztBQUdELHFCQUE0QixPQUFlO0lBQ3pD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