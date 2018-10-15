/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/** @type {?} */
var EMPTY_ANIMATION_OPTIONS = {};
/**
 * @record
 */
export function AstVisitor() { }
/** @type {?} */
AstVisitor.prototype.visitTrigger;
/** @type {?} */
AstVisitor.prototype.visitState;
/** @type {?} */
AstVisitor.prototype.visitTransition;
/** @type {?} */
AstVisitor.prototype.visitSequence;
/** @type {?} */
AstVisitor.prototype.visitGroup;
/** @type {?} */
AstVisitor.prototype.visitAnimate;
/** @type {?} */
AstVisitor.prototype.visitStyle;
/** @type {?} */
AstVisitor.prototype.visitKeyframes;
/** @type {?} */
AstVisitor.prototype.visitReference;
/** @type {?} */
AstVisitor.prototype.visitAnimateChild;
/** @type {?} */
AstVisitor.prototype.visitAnimateRef;
/** @type {?} */
AstVisitor.prototype.visitQuery;
/** @type {?} */
AstVisitor.prototype.visitStagger;
// unsupported: template constraints.
/**
 * @record
 * @template T
 */
export function Ast() { }
/** @type {?} */
Ast.prototype.type;
/** @type {?} */
Ast.prototype.options;
/**
 * @record
 */
export function TriggerAst() { }
/** @type {?} */
TriggerAst.prototype.type;
/** @type {?} */
TriggerAst.prototype.name;
/** @type {?} */
TriggerAst.prototype.states;
/** @type {?} */
TriggerAst.prototype.transitions;
/** @type {?} */
TriggerAst.prototype.queryCount;
/** @type {?} */
TriggerAst.prototype.depCount;
/**
 * @record
 */
export function StateAst() { }
/** @type {?} */
StateAst.prototype.type;
/** @type {?} */
StateAst.prototype.name;
/** @type {?} */
StateAst.prototype.style;
/**
 * @record
 */
export function TransitionAst() { }
/** @type {?} */
TransitionAst.prototype.matchers;
/** @type {?} */
TransitionAst.prototype.animation;
/** @type {?} */
TransitionAst.prototype.queryCount;
/** @type {?} */
TransitionAst.prototype.depCount;
/**
 * @record
 */
export function SequenceAst() { }
/** @type {?} */
SequenceAst.prototype.steps;
/**
 * @record
 */
export function GroupAst() { }
/** @type {?} */
GroupAst.prototype.steps;
/**
 * @record
 */
export function AnimateAst() { }
/** @type {?} */
AnimateAst.prototype.timings;
/** @type {?} */
AnimateAst.prototype.style;
/**
 * @record
 */
export function StyleAst() { }
/** @type {?} */
StyleAst.prototype.styles;
/** @type {?} */
StyleAst.prototype.easing;
/** @type {?} */
StyleAst.prototype.offset;
/** @type {?} */
StyleAst.prototype.containsDynamicStyles;
/** @type {?|undefined} */
StyleAst.prototype.isEmptyStep;
/**
 * @record
 */
export function KeyframesAst() { }
/** @type {?} */
KeyframesAst.prototype.styles;
/**
 * @record
 */
export function ReferenceAst() { }
/** @type {?} */
ReferenceAst.prototype.animation;
/**
 * @record
 */
export function AnimateChildAst() { }
/**
 * @record
 */
export function AnimateRefAst() { }
/** @type {?} */
AnimateRefAst.prototype.animation;
/**
 * @record
 */
export function QueryAst() { }
/** @type {?} */
QueryAst.prototype.selector;
/** @type {?} */
QueryAst.prototype.limit;
/** @type {?} */
QueryAst.prototype.optional;
/** @type {?} */
QueryAst.prototype.includeSelf;
/** @type {?} */
QueryAst.prototype.animation;
/** @type {?} */
QueryAst.prototype.originalSelector;
/**
 * @record
 */
export function StaggerAst() { }
/** @type {?} */
StaggerAst.prototype.timings;
/** @type {?} */
StaggerAst.prototype.animation;
/**
 * @record
 */
export function TimingAst() { }
/** @type {?} */
TimingAst.prototype.duration;
/** @type {?} */
TimingAst.prototype.delay;
/** @type {?} */
TimingAst.prototype.easing;
/** @type {?|undefined} */
TimingAst.prototype.dynamic;
/**
 * @record
 */
export function DynamicTimingAst() { }
/** @type {?} */
DynamicTimingAst.prototype.strValue;
/** @type {?} */
DynamicTimingAst.prototype.dynamic;
//# sourceMappingURL=animation_ast.js.map