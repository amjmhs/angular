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
//# sourceMappingURL=util.js.map