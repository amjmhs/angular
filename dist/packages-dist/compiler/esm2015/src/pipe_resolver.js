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
import { createPipe } from './core';
import { findLast } from './directive_resolver';
import { resolveForwardRef, stringify } from './util';
/**
 * Resolve a `Type` for {\@link Pipe}.
 *
 * This interface can be overridden by the application developer to create custom behavior.
 *
 * See {\@link Compiler}
 */
export class PipeResolver {
    /**
     * @param {?} _reflector
     */
    constructor(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    isPipe(type) {
        /** @type {?} */
        const typeMetadata = this._reflector.annotations(resolveForwardRef(type));
        return typeMetadata && typeMetadata.some(createPipe.isTypeOf);
    }
    /**
     * Return {\@link Pipe} for a given `Type`.
     * @param {?} type
     * @param {?=} throwIfNotFound
     * @return {?}
     */
    resolve(type, throwIfNotFound = true) {
        /** @type {?} */
        const metas = this._reflector.annotations(resolveForwardRef(type));
        if (metas) {
            /** @type {?} */
            const annotation = findLast(metas, createPipe.isTypeOf);
            if (annotation) {
                return annotation;
            }
        }
        if (throwIfNotFound) {
            throw new Error(`No Pipe decorator found on ${stringify(type)}`);
        }
        return null;
    }
}
if (false) {
    /** @type {?} */
    PipeResolver.prototype._reflector;
}
//# sourceMappingURL=pipe_resolver.js.map