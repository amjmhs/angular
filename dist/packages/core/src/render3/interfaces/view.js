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
/** *
 * Size of LViewData's header. Necessary to adjust for it when setting slots.
  @type {?} */
export const HEADER_OFFSET = 16;
/** @type {?} */
export const TVIEW = 0;
/** @type {?} */
export const PARENT = 1;
/** @type {?} */
export const NEXT = 2;
/** @type {?} */
export const QUERIES = 3;
/** @type {?} */
export const FLAGS = 4;
/** @type {?} */
export const HOST_NODE = 5;
/** @type {?} */
export const BINDING_INDEX = 6;
/** @type {?} */
export const DIRECTIVES = 7;
/** @type {?} */
export const CLEANUP = 8;
/** @type {?} */
export const CONTEXT = 9;
/** @type {?} */
export const INJECTOR = 10;
/** @type {?} */
export const RENDERER = 11;
/** @type {?} */
export const SANITIZER = 12;
/** @type {?} */
export const TAIL = 13;
/** @type {?} */
export const CONTAINER_INDEX = 14;
/** @type {?} */
export const CONTENT_QUERIES = 15;
/**
 * `LViewData` stores all of the information needed to process the instructions as
 * they are invoked from the template. Each embedded view and component view has its
 * own `LViewData`. When processing a particular view, we set the `viewData` to that
 * `LViewData`. When that view is done processing, the `viewData` is set back to
 * whatever the original `viewData` was before (the parent `LViewData`).
 *
 * Keeping separate state for each view facilities view insertion / deletion, so we
 * don't have to edit the data array based on which views are present.
 * @record
 */
export function LViewData() { }
/** @enum {number} */
const LViewFlags = {
    /**
       * Whether or not the view is in creationMode.
       *
       * This must be stored in the view rather than using `data` as a marker so that
       * we can properly support embedded views. Otherwise, when exiting a child view
       * back into the parent view, `data` will be defined and `creationMode` will be
       * improperly reported as false.
       */
    CreationMode: 1,
    /** Whether this view has default change detection strategy (checks always) or onPush */
    CheckAlways: 2,
    /** Whether or not this view is currently dirty (needing check) */
    Dirty: 4,
    /** Whether or not this view is currently attached to change detection tree. */
    Attached: 8,
    /**
       *  Whether or not the init hooks have run.
       *
       * If on, the init hooks haven't yet been run and should be executed by the first component that
       * runs OR the first cR() instruction that runs (so inits are run for the top level view before
       * any embedded views).
       */
    RunInit: 16,
    /** Whether or not this view is destroyed. */
    Destroyed: 32,
};
export { LViewFlags };
/**
 * The static data for an LView (shared between all templates of a
 * given type).
 *
 * Stored on the template function as ngPrivateData.
 * @record
 */
export function TView() { }
/**
 * ID for inline views to determine whether a view is the same as the previous view
 * in a certain position. If it's not, we know the new view needs to be inserted
 * and the one that exists needs to be removed (e.g. if/else statements)
 *
 * If this is -1, then this is a component view or a dynamically created view.
 * @type {?}
 */
TView.prototype.id;
/**
 * The template function used to refresh the view of dynamically created views
 * and components. Will be null for inline views.
 * @type {?}
 */
TView.prototype.template;
/**
 * A function containing query-related instructions.
 * @type {?}
 */
TView.prototype.viewQuery;
/**
 * Pointer to the `TNode` that represents the root of the view.
 *
 * If this is a `TNode` for an `LViewNode`, this is an embedded view of a container.
 * We need this pointer to be able to efficiently find this node when inserting the view
 * into an anchor.
 *
 * If this is a `TNode` for an `LElementNode`, this is the TView of a component.
 * @type {?}
 */
TView.prototype.node;
/**
 * Whether or not this template has been processed.
 * @type {?}
 */
TView.prototype.firstTemplatePass;
/**
 * Static data equivalent of LView.data[]. Contains TNodes.
 * @type {?}
 */
TView.prototype.data;
/**
 * The binding start index is the index at which the data array
 * starts to store bindings only. Saving this value ensures that we
 * will begin reading bindings at the correct point in the array when
 * we are in update mode.
 * @type {?}
 */
TView.prototype.bindingStartIndex;
/**
 * Index of the host node of the first LView or LContainer beneath this LView in
 * the hierarchy.
 *
 * Necessary to store this so views can traverse through their nested views
 * to remove listeners and call onDestroy callbacks.
 *
 * For embedded views, we store the index of an LContainer's host rather than the first
 * LView to avoid managing splicing when views are added/removed.
 * @type {?}
 */
TView.prototype.childIndex;
/**
 * Selector matches for a node are temporarily cached on the TView so the
 * DI system can eagerly instantiate directives on the same node if they are
 * created out of order. They are overwritten after each node.
 *
 * <div dirA dirB></div>
 *
 * e.g. DirA injects DirB, but DirA is created first. DI should instantiate
 * DirB when it finds that it's on the same node, but not yet created.
 *
 * Even indices: Directive defs
 * Odd indices:
 *   - Null if the associated directive hasn't been instantiated yet
 *   - Directive index, if associated directive has been created
 *   - String, temporary 'CIRCULAR' token set while dependencies are being resolved
 * @type {?}
 */
TView.prototype.currentMatches;
/**
 * Directive and component defs that have already been matched to nodes on
 * this view.
 *
 * Defs are stored at the same index in TView.directives[] as their instances
 * are stored in LView.directives[]. This simplifies lookup in DI.
 * @type {?}
 */
TView.prototype.directives;
/**
 * Full registry of directives and components that may be found in this view.
 *
 * It's necessary to keep a copy of the full def list on the TView so it's possible
 * to render template functions without a host component.
 * @type {?}
 */
TView.prototype.directiveRegistry;
/**
 * Full registry of pipes that may be found in this view.
 *
 * The property is either an array of `PipeDefs`s or a function which returns the array of
 * `PipeDefs`s. The function is necessary to be able to support forward declarations.
 *
 * It's necessary to keep a copy of the full def list on the TView so it's possible
 * to render template functions without a host component.
 * @type {?}
 */
TView.prototype.pipeRegistry;
/**
 * Array of ngOnInit and ngDoCheck hooks that should be executed for this view in
 * creation mode.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.initHooks;
/**
 * Array of ngDoCheck hooks that should be executed for this view in update mode.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.checkHooks;
/**
 * Array of ngAfterContentInit and ngAfterContentChecked hooks that should be executed
 * for this view in creation mode.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.contentHooks;
/**
 * Array of ngAfterContentChecked hooks that should be executed for this view in update
 * mode.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.contentCheckHooks;
/**
 * Array of ngAfterViewInit and ngAfterViewChecked hooks that should be executed for
 * this view in creation mode.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.viewHooks;
/**
 * Array of ngAfterViewChecked hooks that should be executed for this view in
 * update mode.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.viewCheckHooks;
/**
 * Array of ngOnDestroy hooks that should be executed when this view is destroyed.
 *
 * Even indices: Directive index
 * Odd indices: Hook function
 * @type {?}
 */
TView.prototype.destroyHooks;
/**
 * Array of pipe ngOnDestroy hooks that should be executed when this view is destroyed.
 *
 * Even indices: Index of pipe in data
 * Odd indices: Hook function
 *
 * These must be stored separately from directive destroy hooks because their contexts
 * are stored in data.
 * @type {?}
 */
TView.prototype.pipeDestroyHooks;
/**
 * When a view is destroyed, listeners need to be released and outputs need to be
 * unsubscribed. This cleanup array stores both listener data (in chunks of 4)
 * and output data (in chunks of 2) for a particular view. Combining the arrays
 * saves on memory (70 bytes per array) and on a few bytes of code size (for two
 * separate for loops).
 *
 * If it's a native DOM listener being stored:
 * 1st index is: event name to remove
 * 2nd index is: index of native element in LView.data[]
 * 3rd index is: index of wrapped listener function in LView.cleanupInstances[]
 * 4th index is: useCapture boolean
 *
 * If it's a renderer2 style listener or ViewRef destroy hook being stored:
 * 1st index is: index of the cleanup function in LView.cleanupInstances[]
 * 2nd index is: null
 *
 * If it's an output subscription or query list destroy hook:
 * 1st index is: output unsubscribe function / query list destroy function
 * 2nd index is: index of function context in LView.cleanupInstances[]
 * @type {?}
 */
TView.prototype.cleanup;
/**
 * A list of directive and element indices for child components that will need to be
 * refreshed when the current view has finished its check.
 *
 * Even indices: Directive indices
 * Odd indices: Element indices (adjusted for LViewData header offset)
 * @type {?}
 */
TView.prototype.components;
/**
 * A list of indices for child directives that have host bindings.
 *
 * Even indices: Directive indices
 * Odd indices: Element indices
 *
 * Element indices are NOT adjusted for LViewData header offset because
 * they will be fed into instructions that expect the raw index (e.g. elementProperty)
 * @type {?}
 */
TView.prototype.hostBindings;
/**
 * A list of indices for child directives that have content queries.
 *
 * Even indices: Directive indices
 * Odd indices: Starting index of content queries (stored in CONTENT_QUERIES) for this directive
 * @type {?}
 */
TView.prototype.contentQueries;
/**
 * RootContext contains information which is shared for all components which
 * were bootstrapped with {\@link renderComponent}.
 * @record
 */
export function RootContext() { }
/**
 * A function used for scheduling change detection in the future. Usually
 * this is `requestAnimationFrame`.
 * @type {?}
 */
RootContext.prototype.scheduler;
/**
 * A promise which is resolved when all components are considered clean (not dirty).
 *
 * This promise is overwritten every time a first call to {\@link markDirty} is invoked.
 * @type {?}
 */
RootContext.prototype.clean;
/**
 * RootComponents - The components that were instantiated by the call to
 * {\@link renderComponent}.
 * @type {?}
 */
RootContext.prototype.components;
/** @typedef {?} */
var HookData;
export { HookData };
/** @typedef {?} */
var TData;
export { TData };
/** @typedef {?} */
var CurrentMatchesList;
export { CurrentMatchesList };
/** @type {?} */
export const unusedValueExportToPlacateAjd = 1;
//# sourceMappingURL=view.js.map