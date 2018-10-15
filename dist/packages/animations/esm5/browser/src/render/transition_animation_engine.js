/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
import { AUTO_STYLE, NoopAnimationPlayer, ɵAnimationGroupPlayer as AnimationGroupPlayer, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
import { ElementInstructionMap } from '../dsl/element_instruction_map';
import { ENTER_CLASSNAME, LEAVE_CLASSNAME, NG_ANIMATING_CLASSNAME, NG_ANIMATING_SELECTOR, NG_TRIGGER_CLASSNAME, NG_TRIGGER_SELECTOR, copyObj, eraseStyles, setStyles } from '../util';
import { getOrSetAsInMap, listenOnPlayer, makeAnimationEvent, normalizeKeyframes, optimizeGroupPlayer } from './shared';
/** @type {?} */
var QUEUED_CLASSNAME = 'ng-animate-queued';
/** @type {?} */
var QUEUED_SELECTOR = '.ng-animate-queued';
/** @type {?} */
var DISABLED_CLASSNAME = 'ng-animate-disabled';
/** @type {?} */
var DISABLED_SELECTOR = '.ng-animate-disabled';
/** @type {?} */
var STAR_CLASSNAME = 'ng-star-inserted';
/** @type {?} */
var STAR_SELECTOR = '.ng-star-inserted';
/** @type {?} */
var EMPTY_PLAYER_ARRAY = [];
/** @type {?} */
var NULL_REMOVAL_STATE = {
    namespaceId: '',
    setForRemoval: false,
    setForMove: false,
    hasAnimation: false,
    removedBeforeQueried: false
};
/** @type {?} */
var NULL_REMOVED_QUERIED_STATE = {
    namespaceId: '',
    setForMove: false,
    setForRemoval: false,
    hasAnimation: false,
    removedBeforeQueried: true
};
/**
 * @record
 */
function TriggerListener() { }
/** @type {?} */
TriggerListener.prototype.name;
/** @type {?} */
TriggerListener.prototype.phase;
/** @type {?} */
TriggerListener.prototype.callback;
/**
 * @record
 */
export function QueueInstruction() { }
/** @type {?} */
QueueInstruction.prototype.element;
/** @type {?} */
QueueInstruction.prototype.triggerName;
/** @type {?} */
QueueInstruction.prototype.fromState;
/** @type {?} */
QueueInstruction.prototype.toState;
/** @type {?} */
QueueInstruction.prototype.transition;
/** @type {?} */
QueueInstruction.prototype.player;
/** @type {?} */
QueueInstruction.prototype.isFallbackTransition;
/** @type {?} */
export var REMOVAL_FLAG = '__ng_removed';
/**
 * @record
 */
export function ElementAnimationState() { }
/** @type {?} */
ElementAnimationState.prototype.setForRemoval;
/** @type {?} */
ElementAnimationState.prototype.setForMove;
/** @type {?} */
ElementAnimationState.prototype.hasAnimation;
/** @type {?} */
ElementAnimationState.prototype.namespaceId;
/** @type {?} */
ElementAnimationState.prototype.removedBeforeQueried;
var StateValue = /** @class */ (function () {
    function StateValue(input, namespaceId) {
        if (namespaceId === void 0) { namespaceId = ''; }
        this.namespaceId = namespaceId;
        /** @type {?} */
        var isObj = input && input.hasOwnProperty('value');
        /** @type {?} */
        var value = isObj ? input['value'] : input;
        this.value = normalizeTriggerValue(value);
        if (isObj) {
            /** @type {?} */
            var options = copyObj(/** @type {?} */ (input));
            delete options['value'];
            this.options = /** @type {?} */ (options);
        }
        else {
            this.options = {};
        }
        if (!this.options.params) {
            this.options.params = {};
        }
    }
    Object.defineProperty(StateValue.prototype, "params", {
        get: /**
         * @return {?}
         */
        function () { return /** @type {?} */ (this.options.params); },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    StateValue.prototype.absorbOptions = /**
     * @param {?} options
     * @return {?}
     */
    function (options) {
        /** @type {?} */
        var newParams = options.params;
        if (newParams) {
            /** @type {?} */
            var oldParams_1 = /** @type {?} */ ((this.options.params));
            Object.keys(newParams).forEach(function (prop) {
                if (oldParams_1[prop] == null) {
                    oldParams_1[prop] = newParams[prop];
                }
            });
        }
    };
    return StateValue;
}());
export { StateValue };
if (false) {
    /** @type {?} */
    StateValue.prototype.value;
    /** @type {?} */
    StateValue.prototype.options;
    /** @type {?} */
    StateValue.prototype.namespaceId;
}
/** @type {?} */
export var VOID_VALUE = 'void';
/** @type {?} */
export var DEFAULT_STATE_VALUE = new StateValue(VOID_VALUE);
var AnimationTransitionNamespace = /** @class */ (function () {
    function AnimationTransitionNamespace(id, hostElement, _engine) {
        this.id = id;
        this.hostElement = hostElement;
        this._engine = _engine;
        this.players = [];
        this._triggers = {};
        this._queue = [];
        this._elementListeners = new Map();
        this._hostClassName = 'ng-tns-' + id;
        addClass(hostElement, this._hostClassName);
    }
    /**
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.listen = /**
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    function (element, name, phase, callback) {
        var _this = this;
        if (!this._triggers.hasOwnProperty(name)) {
            throw new Error("Unable to listen on the animation trigger event \"" + phase + "\" because the animation trigger \"" + name + "\" doesn't exist!");
        }
        if (phase == null || phase.length == 0) {
            throw new Error("Unable to listen on the animation trigger \"" + name + "\" because the provided event is undefined!");
        }
        if (!isTriggerEventValid(phase)) {
            throw new Error("The provided animation trigger event \"" + phase + "\" for the animation trigger \"" + name + "\" is not supported!");
        }
        /** @type {?} */
        var listeners = getOrSetAsInMap(this._elementListeners, element, []);
        /** @type {?} */
        var data = { name: name, phase: phase, callback: callback };
        listeners.push(data);
        /** @type {?} */
        var triggersWithStates = getOrSetAsInMap(this._engine.statesByElement, element, {});
        if (!triggersWithStates.hasOwnProperty(name)) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + name);
            triggersWithStates[name] = DEFAULT_STATE_VALUE;
        }
        return function () {
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            _this._engine.afterFlush(function () {
                /** @type {?} */
                var index = listeners.indexOf(data);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
                if (!_this._triggers[name]) {
                    delete triggersWithStates[name];
                }
            });
        };
    };
    /**
     * @param {?} name
     * @param {?} ast
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.register = /**
     * @param {?} name
     * @param {?} ast
     * @return {?}
     */
    function (name, ast) {
        if (this._triggers[name]) {
            // throw
            return false;
        }
        else {
            this._triggers[name] = ast;
            return true;
        }
    };
    /**
     * @param {?} name
     * @return {?}
     */
    AnimationTransitionNamespace.prototype._getTrigger = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        /** @type {?} */
        var trigger = this._triggers[name];
        if (!trigger) {
            throw new Error("The provided animation trigger \"" + name + "\" has not been registered!");
        }
        return trigger;
    };
    /**
     * @param {?} element
     * @param {?} triggerName
     * @param {?} value
     * @param {?=} defaultToFallback
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.trigger = /**
     * @param {?} element
     * @param {?} triggerName
     * @param {?} value
     * @param {?=} defaultToFallback
     * @return {?}
     */
    function (element, triggerName, value, defaultToFallback) {
        var _this = this;
        if (defaultToFallback === void 0) { defaultToFallback = true; }
        /** @type {?} */
        var trigger = this._getTrigger(triggerName);
        /** @type {?} */
        var player = new TransitionAnimationPlayer(this.id, triggerName, element);
        /** @type {?} */
        var triggersWithStates = this._engine.statesByElement.get(element);
        if (!triggersWithStates) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + triggerName);
            this._engine.statesByElement.set(element, triggersWithStates = {});
        }
        /** @type {?} */
        var fromState = triggersWithStates[triggerName];
        /** @type {?} */
        var toState = new StateValue(value, this.id);
        /** @type {?} */
        var isObj = value && value.hasOwnProperty('value');
        if (!isObj && fromState) {
            toState.absorbOptions(fromState.options);
        }
        triggersWithStates[triggerName] = toState;
        if (!fromState) {
            fromState = DEFAULT_STATE_VALUE;
        }
        /** @type {?} */
        var isRemoval = toState.value === VOID_VALUE;
        // normally this isn't reached by here, however, if an object expression
        // is passed in then it may be a new object each time. Comparing the value
        // is important since that will stay the same despite there being a new object.
        // The removal arc here is special cased because the same element is triggered
        // twice in the event that it contains animations on the outer/inner portions
        // of the host container
        if (!isRemoval && fromState.value === toState.value) {
            // this means that despite the value not changing, some inner params
            // have changed which means that the animation final styles need to be applied
            if (!objEquals(fromState.params, toState.params)) {
                /** @type {?} */
                var errors = [];
                /** @type {?} */
                var fromStyles_1 = trigger.matchStyles(fromState.value, fromState.params, errors);
                /** @type {?} */
                var toStyles_1 = trigger.matchStyles(toState.value, toState.params, errors);
                if (errors.length) {
                    this._engine.reportError(errors);
                }
                else {
                    this._engine.afterFlush(function () {
                        eraseStyles(element, fromStyles_1);
                        setStyles(element, toStyles_1);
                    });
                }
            }
            return;
        }
        /** @type {?} */
        var playersOnElement = getOrSetAsInMap(this._engine.playersByElement, element, []);
        playersOnElement.forEach(function (player) {
            // only remove the player if it is queued on the EXACT same trigger/namespace
            // we only also deal with queued players here because if the animation has
            // started then we want to keep the player alive until the flush happens
            // (which is where the previousPlayers are passed into the new palyer)
            if (player.namespaceId == _this.id && player.triggerName == triggerName && player.queued) {
                player.destroy();
            }
        });
        /** @type {?} */
        var transition = trigger.matchTransition(fromState.value, toState.value, element, toState.params);
        /** @type {?} */
        var isFallbackTransition = false;
        if (!transition) {
            if (!defaultToFallback)
                return;
            transition = trigger.fallbackTransition;
            isFallbackTransition = true;
        }
        this._engine.totalQueuedPlayers++;
        this._queue.push({ element: element, triggerName: triggerName, transition: transition, fromState: fromState, toState: toState, player: player, isFallbackTransition: isFallbackTransition });
        if (!isFallbackTransition) {
            addClass(element, QUEUED_CLASSNAME);
            player.onStart(function () { removeClass(element, QUEUED_CLASSNAME); });
        }
        player.onDone(function () {
            /** @type {?} */
            var index = _this.players.indexOf(player);
            if (index >= 0) {
                _this.players.splice(index, 1);
            }
            /** @type {?} */
            var players = _this._engine.playersByElement.get(element);
            if (players) {
                /** @type {?} */
                var index_1 = players.indexOf(player);
                if (index_1 >= 0) {
                    players.splice(index_1, 1);
                }
            }
        });
        this.players.push(player);
        playersOnElement.push(player);
        return player;
    };
    /**
     * @param {?} name
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.deregister = /**
     * @param {?} name
     * @return {?}
     */
    function (name) {
        var _this = this;
        delete this._triggers[name];
        this._engine.statesByElement.forEach(function (stateMap, element) { delete stateMap[name]; });
        this._elementListeners.forEach(function (listeners, element) {
            _this._elementListeners.set(element, listeners.filter(function (entry) { return entry.name != name; }));
        });
    };
    /**
     * @param {?} element
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.clearElementCache = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        this._engine.statesByElement.delete(element);
        this._elementListeners.delete(element);
        /** @type {?} */
        var elementPlayers = this._engine.playersByElement.get(element);
        if (elementPlayers) {
            elementPlayers.forEach(function (player) { return player.destroy(); });
            this._engine.playersByElement.delete(element);
        }
    };
    /**
     * @param {?} rootElement
     * @param {?} context
     * @param {?=} animate
     * @return {?}
     */
    AnimationTransitionNamespace.prototype._signalRemovalForInnerTriggers = /**
     * @param {?} rootElement
     * @param {?} context
     * @param {?=} animate
     * @return {?}
     */
    function (rootElement, context, animate) {
        var _this = this;
        if (animate === void 0) { animate = false; }
        // emulate a leave animation for all inner nodes within this node.
        // If there are no animations found for any of the nodes then clear the cache
        // for the element.
        this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true).forEach(function (elm) {
            // this means that an inner remove() operation has already kicked off
            // the animation on this element...
            if (elm[REMOVAL_FLAG])
                return;
            /** @type {?} */
            var namespaces = _this._engine.fetchNamespacesByElement(elm);
            if (namespaces.size) {
                namespaces.forEach(function (ns) { return ns.triggerLeaveAnimation(elm, context, false, true); });
            }
            else {
                _this.clearElementCache(elm);
            }
        });
    };
    /**
     * @param {?} element
     * @param {?} context
     * @param {?=} destroyAfterComplete
     * @param {?=} defaultToFallback
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.triggerLeaveAnimation = /**
     * @param {?} element
     * @param {?} context
     * @param {?=} destroyAfterComplete
     * @param {?=} defaultToFallback
     * @return {?}
     */
    function (element, context, destroyAfterComplete, defaultToFallback) {
        var _this = this;
        /** @type {?} */
        var triggerStates = this._engine.statesByElement.get(element);
        if (triggerStates) {
            /** @type {?} */
            var players_1 = [];
            Object.keys(triggerStates).forEach(function (triggerName) {
                // this check is here in the event that an element is removed
                // twice (both on the host level and the component level)
                if (_this._triggers[triggerName]) {
                    /** @type {?} */
                    var player = _this.trigger(element, triggerName, VOID_VALUE, defaultToFallback);
                    if (player) {
                        players_1.push(player);
                    }
                }
            });
            if (players_1.length) {
                this._engine.markElementAsRemoved(this.id, element, true, context);
                if (destroyAfterComplete) {
                    optimizeGroupPlayer(players_1).onDone(function () { return _this._engine.processLeaveNode(element); });
                }
                return true;
            }
        }
        return false;
    };
    /**
     * @param {?} element
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.prepareLeaveAnimationListeners = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        var _this = this;
        /** @type {?} */
        var listeners = this._elementListeners.get(element);
        if (listeners) {
            /** @type {?} */
            var visitedTriggers_1 = new Set();
            listeners.forEach(function (listener) {
                /** @type {?} */
                var triggerName = listener.name;
                if (visitedTriggers_1.has(triggerName))
                    return;
                visitedTriggers_1.add(triggerName);
                /** @type {?} */
                var trigger = _this._triggers[triggerName];
                /** @type {?} */
                var transition = trigger.fallbackTransition;
                /** @type {?} */
                var elementStates = /** @type {?} */ ((_this._engine.statesByElement.get(element)));
                /** @type {?} */
                var fromState = elementStates[triggerName] || DEFAULT_STATE_VALUE;
                /** @type {?} */
                var toState = new StateValue(VOID_VALUE);
                /** @type {?} */
                var player = new TransitionAnimationPlayer(_this.id, triggerName, element);
                _this._engine.totalQueuedPlayers++;
                _this._queue.push({
                    element: element,
                    triggerName: triggerName,
                    transition: transition,
                    fromState: fromState,
                    toState: toState,
                    player: player,
                    isFallbackTransition: true
                });
            });
        }
    };
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.removeNode = /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (element, context) {
        var _this = this;
        /** @type {?} */
        var engine = this._engine;
        if (element.childElementCount) {
            this._signalRemovalForInnerTriggers(element, context, true);
        }
        // this means that a * => VOID animation was detected and kicked off
        if (this.triggerLeaveAnimation(element, context, true))
            return;
        /** @type {?} */
        var containsPotentialParentTransition = false;
        if (engine.totalAnimations) {
            /** @type {?} */
            var currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
            // when this `if statement` does not continue forward it means that
            // a previous animation query has selected the current element and
            // is animating it. In this situation want to continue forwards and
            // allow the element to be queued up for animation later.
            if (currentPlayers && currentPlayers.length) {
                containsPotentialParentTransition = true;
            }
            else {
                /** @type {?} */
                var parent_1 = element;
                while (parent_1 = parent_1.parentNode) {
                    /** @type {?} */
                    var triggers = engine.statesByElement.get(parent_1);
                    if (triggers) {
                        containsPotentialParentTransition = true;
                        break;
                    }
                }
            }
        }
        // at this stage we know that the element will either get removed
        // during flush or will be picked up by a parent query. Either way
        // we need to fire the listeners for this element when it DOES get
        // removed (once the query parent animation is done or after flush)
        this.prepareLeaveAnimationListeners(element);
        // whether or not a parent has an animation we need to delay the deferral of the leave
        // operation until we have more information (which we do after flush() has been called)
        if (containsPotentialParentTransition) {
            engine.markElementAsRemoved(this.id, element, false, context);
        }
        else {
            // we do this after the flush has occurred such
            // that the callbacks can be fired
            engine.afterFlush(function () { return _this.clearElementCache(element); });
            engine.destroyInnerAnimations(element);
            engine._onRemovalComplete(element, context);
        }
    };
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.insertNode = /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    function (element, parent) { addClass(element, this._hostClassName); };
    /**
     * @param {?} microtaskId
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.drainQueuedTransitions = /**
     * @param {?} microtaskId
     * @return {?}
     */
    function (microtaskId) {
        var _this = this;
        /** @type {?} */
        var instructions = [];
        this._queue.forEach(function (entry) {
            /** @type {?} */
            var player = entry.player;
            if (player.destroyed)
                return;
            /** @type {?} */
            var element = entry.element;
            /** @type {?} */
            var listeners = _this._elementListeners.get(element);
            if (listeners) {
                listeners.forEach(function (listener) {
                    if (listener.name == entry.triggerName) {
                        /** @type {?} */
                        var baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
                        (/** @type {?} */ (baseEvent))['_data'] = microtaskId;
                        listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
                    }
                });
            }
            if (player.markedForDestroy) {
                _this._engine.afterFlush(function () {
                    // now we can destroy the element properly since the event listeners have
                    // been bound to the player
                    player.destroy();
                });
            }
            else {
                instructions.push(entry);
            }
        });
        this._queue = [];
        return instructions.sort(function (a, b) {
            /** @type {?} */
            var d0 = a.transition.ast.depCount;
            /** @type {?} */
            var d1 = b.transition.ast.depCount;
            if (d0 == 0 || d1 == 0) {
                return d0 - d1;
            }
            return _this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
        });
    };
    /**
     * @param {?} context
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.destroy = /**
     * @param {?} context
     * @return {?}
     */
    function (context) {
        this.players.forEach(function (p) { return p.destroy(); });
        this._signalRemovalForInnerTriggers(this.hostElement, context);
    };
    /**
     * @param {?} element
     * @return {?}
     */
    AnimationTransitionNamespace.prototype.elementContainsData = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var containsData = false;
        if (this._elementListeners.has(element))
            containsData = true;
        containsData =
            (this._queue.find(function (entry) { return entry.element === element; }) ? true : false) || containsData;
        return containsData;
    };
    return AnimationTransitionNamespace;
}());
export { AnimationTransitionNamespace };
if (false) {
    /** @type {?} */
    AnimationTransitionNamespace.prototype.players;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._triggers;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._queue;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._elementListeners;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._hostClassName;
    /** @type {?} */
    AnimationTransitionNamespace.prototype.id;
    /** @type {?} */
    AnimationTransitionNamespace.prototype.hostElement;
    /** @type {?} */
    AnimationTransitionNamespace.prototype._engine;
}
/**
 * @record
 */
export function QueuedTransition() { }
/** @type {?} */
QueuedTransition.prototype.element;
/** @type {?} */
QueuedTransition.prototype.instruction;
/** @type {?} */
QueuedTransition.prototype.player;
var TransitionAnimationEngine = /** @class */ (function () {
    function TransitionAnimationEngine(bodyNode, driver, _normalizer) {
        this.bodyNode = bodyNode;
        this.driver = driver;
        this._normalizer = _normalizer;
        this.players = [];
        this.newHostElements = new Map();
        this.playersByElement = new Map();
        this.playersByQueriedElement = new Map();
        this.statesByElement = new Map();
        this.disabledNodes = new Set();
        this.totalAnimations = 0;
        this.totalQueuedPlayers = 0;
        this._namespaceLookup = {};
        this._namespaceList = [];
        this._flushFns = [];
        this._whenQuietFns = [];
        this.namespacesByHostElement = new Map();
        this.collectedEnterElements = [];
        this.collectedLeaveElements = [];
        this.onRemovalComplete = function (element, context) { };
    }
    /** @internal */
    /**
     * \@internal
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype._onRemovalComplete = /**
     * \@internal
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (element, context) { this.onRemovalComplete(element, context); };
    Object.defineProperty(TransitionAnimationEngine.prototype, "queuedPlayers", {
        get: /**
         * @return {?}
         */
        function () {
            /** @type {?} */
            var players = [];
            this._namespaceList.forEach(function (ns) {
                ns.players.forEach(function (player) {
                    if (player.queued) {
                        players.push(player);
                    }
                });
            });
            return players;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype.createNamespace = /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    function (namespaceId, hostElement) {
        /** @type {?} */
        var ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
        if (hostElement.parentNode) {
            this._balanceNamespaceList(ns, hostElement);
        }
        else {
            // defer this later until flush during when the host element has
            // been inserted so that we know exactly where to place it in
            // the namespace list
            this.newHostElements.set(hostElement, ns);
            // given that this host element is apart of the animation code, it
            // may or may not be inserted by a parent node that is an of an
            // animation renderer type. If this happens then we can still have
            // access to this item when we query for :enter nodes. If the parent
            // is a renderer then the set data-structure will normalize the entry
            this.collectEnterElement(hostElement);
        }
        return this._namespaceLookup[namespaceId] = ns;
    };
    /**
     * @param {?} ns
     * @param {?} hostElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype._balanceNamespaceList = /**
     * @param {?} ns
     * @param {?} hostElement
     * @return {?}
     */
    function (ns, hostElement) {
        /** @type {?} */
        var limit = this._namespaceList.length - 1;
        if (limit >= 0) {
            /** @type {?} */
            var found = false;
            for (var i = limit; i >= 0; i--) {
                /** @type {?} */
                var nextNamespace = this._namespaceList[i];
                if (this.driver.containsElement(nextNamespace.hostElement, hostElement)) {
                    this._namespaceList.splice(i + 1, 0, ns);
                    found = true;
                    break;
                }
            }
            if (!found) {
                this._namespaceList.splice(0, 0, ns);
            }
        }
        else {
            this._namespaceList.push(ns);
        }
        this.namespacesByHostElement.set(hostElement, ns);
        return ns;
    };
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype.register = /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    function (namespaceId, hostElement) {
        /** @type {?} */
        var ns = this._namespaceLookup[namespaceId];
        if (!ns) {
            ns = this.createNamespace(namespaceId, hostElement);
        }
        return ns;
    };
    /**
     * @param {?} namespaceId
     * @param {?} name
     * @param {?} trigger
     * @return {?}
     */
    TransitionAnimationEngine.prototype.registerTrigger = /**
     * @param {?} namespaceId
     * @param {?} name
     * @param {?} trigger
     * @return {?}
     */
    function (namespaceId, name, trigger) {
        /** @type {?} */
        var ns = this._namespaceLookup[namespaceId];
        if (ns && ns.register(name, trigger)) {
            this.totalAnimations++;
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype.destroy = /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    function (namespaceId, context) {
        var _this = this;
        if (!namespaceId)
            return;
        /** @type {?} */
        var ns = this._fetchNamespace(namespaceId);
        this.afterFlush(function () {
            _this.namespacesByHostElement.delete(ns.hostElement);
            delete _this._namespaceLookup[namespaceId];
            /** @type {?} */
            var index = _this._namespaceList.indexOf(ns);
            if (index >= 0) {
                _this._namespaceList.splice(index, 1);
            }
        });
        this.afterFlushAnimationsDone(function () { return ns.destroy(context); });
    };
    /**
     * @param {?} id
     * @return {?}
     */
    TransitionAnimationEngine.prototype._fetchNamespace = /**
     * @param {?} id
     * @return {?}
     */
    function (id) { return this._namespaceLookup[id]; };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.fetchNamespacesByElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var namespaces = new Set();
        /** @type {?} */
        var elementStates = this.statesByElement.get(element);
        if (elementStates) {
            /** @type {?} */
            var keys = Object.keys(elementStates);
            for (var i = 0; i < keys.length; i++) {
                /** @type {?} */
                var nsId = elementStates[keys[i]].namespaceId;
                if (nsId) {
                    /** @type {?} */
                    var ns = this._fetchNamespace(nsId);
                    if (ns) {
                        namespaces.add(ns);
                    }
                }
            }
        }
        return namespaces;
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    TransitionAnimationEngine.prototype.trigger = /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    function (namespaceId, element, name, value) {
        if (isElementNode(element)) {
            /** @type {?} */
            var ns = this._fetchNamespace(namespaceId);
            if (ns) {
                ns.trigger(element, name, value);
                return true;
            }
        }
        return false;
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    TransitionAnimationEngine.prototype.insertNode = /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    function (namespaceId, element, parent, insertBefore) {
        if (!isElementNode(element))
            return;
        /** @type {?} */
        var details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            details.setForRemoval = false;
            details.setForMove = true;
            /** @type {?} */
            var index = this.collectedLeaveElements.indexOf(element);
            if (index >= 0) {
                this.collectedLeaveElements.splice(index, 1);
            }
        }
        // in the event that the namespaceId is blank then the caller
        // code does not contain any animation code in it, but it is
        // just being called so that the node is marked as being inserted
        if (namespaceId) {
            /** @type {?} */
            var ns = this._fetchNamespace(namespaceId);
            // This if-statement is a workaround for router issue #21947.
            // The router sometimes hits a race condition where while a route
            // is being instantiated a new navigation arrives, triggering leave
            // animation of DOM that has not been fully initialized, until this
            // is resolved, we need to handle the scenario when DOM is not in a
            // consistent state during the animation.
            if (ns) {
                ns.insertNode(element, parent);
            }
        }
        // only *directives and host elements are inserted before
        if (insertBefore) {
            this.collectEnterElement(element);
        }
    };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.collectEnterElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) { this.collectedEnterElements.push(element); };
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    TransitionAnimationEngine.prototype.markElementAsDisabled = /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    function (element, value) {
        if (value) {
            if (!this.disabledNodes.has(element)) {
                this.disabledNodes.add(element);
                addClass(element, DISABLED_CLASSNAME);
            }
        }
        else if (this.disabledNodes.has(element)) {
            this.disabledNodes.delete(element);
            removeClass(element, DISABLED_CLASSNAME);
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype.removeNode = /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    function (namespaceId, element, context) {
        if (!isElementNode(element)) {
            this._onRemovalComplete(element, context);
            return;
        }
        /** @type {?} */
        var ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
        if (ns) {
            ns.removeNode(element, context);
        }
        else {
            this.markElementAsRemoved(namespaceId, element, false, context);
        }
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?=} hasAnimation
     * @param {?=} context
     * @return {?}
     */
    TransitionAnimationEngine.prototype.markElementAsRemoved = /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?=} hasAnimation
     * @param {?=} context
     * @return {?}
     */
    function (namespaceId, element, hasAnimation, context) {
        this.collectedLeaveElements.push(element);
        element[REMOVAL_FLAG] = {
            namespaceId: namespaceId,
            setForRemoval: context, hasAnimation: hasAnimation,
            removedBeforeQueried: false
        };
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationEngine.prototype.listen = /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    function (namespaceId, element, name, phase, callback) {
        if (isElementNode(element)) {
            return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
        }
        return function () { };
    };
    /**
     * @param {?} entry
     * @param {?} subTimelines
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} skipBuildAst
     * @return {?}
     */
    TransitionAnimationEngine.prototype._buildInstruction = /**
     * @param {?} entry
     * @param {?} subTimelines
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} skipBuildAst
     * @return {?}
     */
    function (entry, subTimelines, enterClassName, leaveClassName, skipBuildAst) {
        return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, enterClassName, leaveClassName, entry.fromState.options, entry.toState.options, subTimelines, skipBuildAst);
    };
    /**
     * @param {?} containerElement
     * @return {?}
     */
    TransitionAnimationEngine.prototype.destroyInnerAnimations = /**
     * @param {?} containerElement
     * @return {?}
     */
    function (containerElement) {
        var _this = this;
        /** @type {?} */
        var elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
        elements.forEach(function (element) { return _this.destroyActiveAnimationsForElement(element); });
        if (this.playersByQueriedElement.size == 0)
            return;
        elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
        elements.forEach(function (element) { return _this.finishActiveQueriedAnimationOnElement(element); });
    };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.destroyActiveAnimationsForElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var players = this.playersByElement.get(element);
        if (players) {
            players.forEach(function (player) {
                // special case for when an element is set for destruction, but hasn't started.
                // in this situation we want to delay the destruction until the flush occurs
                // so that any event listeners attached to the player are triggered.
                if (player.queued) {
                    player.markedForDestroy = true;
                }
                else {
                    player.destroy();
                }
            });
        }
    };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.finishActiveQueriedAnimationOnElement = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        /** @type {?} */
        var players = this.playersByQueriedElement.get(element);
        if (players) {
            players.forEach(function (player) { return player.finish(); });
        }
    };
    /**
     * @return {?}
     */
    TransitionAnimationEngine.prototype.whenRenderingDone = /**
     * @return {?}
     */
    function () {
        var _this = this;
        return new Promise(function (resolve) {
            if (_this.players.length) {
                return optimizeGroupPlayer(_this.players).onDone(function () { return resolve(); });
            }
            else {
                resolve();
            }
        });
    };
    /**
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.processLeaveNode = /**
     * @param {?} element
     * @return {?}
     */
    function (element) {
        var _this = this;
        /** @type {?} */
        var details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            // this will prevent it from removing it twice
            element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
            if (details.namespaceId) {
                this.destroyInnerAnimations(element);
                /** @type {?} */
                var ns = this._fetchNamespace(details.namespaceId);
                if (ns) {
                    ns.clearElementCache(element);
                }
            }
            this._onRemovalComplete(element, details.setForRemoval);
        }
        if (this.driver.matchesElement(element, DISABLED_SELECTOR)) {
            this.markElementAsDisabled(element, false);
        }
        this.driver.query(element, DISABLED_SELECTOR, true).forEach(function (node) {
            _this.markElementAsDisabled(element, false);
        });
    };
    /**
     * @param {?=} microtaskId
     * @return {?}
     */
    TransitionAnimationEngine.prototype.flush = /**
     * @param {?=} microtaskId
     * @return {?}
     */
    function (microtaskId) {
        var _this = this;
        if (microtaskId === void 0) { microtaskId = -1; }
        /** @type {?} */
        var players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach(function (ns, element) { return _this._balanceNamespaceList(ns, element); });
            this.newHostElements.clear();
        }
        if (this.totalAnimations && this.collectedEnterElements.length) {
            for (var i = 0; i < this.collectedEnterElements.length; i++) {
                /** @type {?} */
                var elm = this.collectedEnterElements[i];
                addClass(elm, STAR_CLASSNAME);
            }
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            /** @type {?} */
            var cleanupFns = [];
            try {
                players = this._flushAnimations(cleanupFns, microtaskId);
            }
            finally {
                for (var i = 0; i < cleanupFns.length; i++) {
                    cleanupFns[i]();
                }
            }
        }
        else {
            for (var i = 0; i < this.collectedLeaveElements.length; i++) {
                /** @type {?} */
                var element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(function (fn) { return fn(); });
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            /** @type {?} */
            var quietFns_1 = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                optimizeGroupPlayer(players).onDone(function () { quietFns_1.forEach(function (fn) { return fn(); }); });
            }
            else {
                quietFns_1.forEach(function (fn) { return fn(); });
            }
        }
    };
    /**
     * @param {?} errors
     * @return {?}
     */
    TransitionAnimationEngine.prototype.reportError = /**
     * @param {?} errors
     * @return {?}
     */
    function (errors) {
        throw new Error("Unable to process animations due to the following failed trigger transitions\n " + errors.join('\n'));
    };
    /**
     * @param {?} cleanupFns
     * @param {?} microtaskId
     * @return {?}
     */
    TransitionAnimationEngine.prototype._flushAnimations = /**
     * @param {?} cleanupFns
     * @param {?} microtaskId
     * @return {?}
     */
    function (cleanupFns, microtaskId) {
        var _this = this;
        /** @type {?} */
        var subTimelines = new ElementInstructionMap();
        /** @type {?} */
        var skippedPlayers = [];
        /** @type {?} */
        var skippedPlayersMap = new Map();
        /** @type {?} */
        var queuedInstructions = [];
        /** @type {?} */
        var queriedElements = new Map();
        /** @type {?} */
        var allPreStyleElements = new Map();
        /** @type {?} */
        var allPostStyleElements = new Map();
        /** @type {?} */
        var disabledElementsSet = new Set();
        this.disabledNodes.forEach(function (node) {
            disabledElementsSet.add(node);
            /** @type {?} */
            var nodesThatAreDisabled = _this.driver.query(node, QUEUED_SELECTOR, true);
            for (var i_1 = 0; i_1 < nodesThatAreDisabled.length; i_1++) {
                disabledElementsSet.add(nodesThatAreDisabled[i_1]);
            }
        });
        /** @type {?} */
        var bodyNode = this.bodyNode;
        /** @type {?} */
        var allTriggerElements = Array.from(this.statesByElement.keys());
        /** @type {?} */
        var enterNodeMap = buildRootMap(allTriggerElements, this.collectedEnterElements);
        /** @type {?} */
        var enterNodeMapIds = new Map();
        /** @type {?} */
        var i = 0;
        enterNodeMap.forEach(function (nodes, root) {
            /** @type {?} */
            var className = ENTER_CLASSNAME + i++;
            enterNodeMapIds.set(root, className);
            nodes.forEach(function (node) { return addClass(node, className); });
        });
        /** @type {?} */
        var allLeaveNodes = [];
        /** @type {?} */
        var mergedLeaveNodes = new Set();
        /** @type {?} */
        var leaveNodesWithoutAnimations = new Set();
        for (var i_2 = 0; i_2 < this.collectedLeaveElements.length; i_2++) {
            /** @type {?} */
            var element = this.collectedLeaveElements[i_2];
            /** @type {?} */
            var details = /** @type {?} */ (element[REMOVAL_FLAG]);
            if (details && details.setForRemoval) {
                allLeaveNodes.push(element);
                mergedLeaveNodes.add(element);
                if (details.hasAnimation) {
                    this.driver.query(element, STAR_SELECTOR, true).forEach(function (elm) { return mergedLeaveNodes.add(elm); });
                }
                else {
                    leaveNodesWithoutAnimations.add(element);
                }
            }
        }
        /** @type {?} */
        var leaveNodeMapIds = new Map();
        /** @type {?} */
        var leaveNodeMap = buildRootMap(allTriggerElements, Array.from(mergedLeaveNodes));
        leaveNodeMap.forEach(function (nodes, root) {
            /** @type {?} */
            var className = LEAVE_CLASSNAME + i++;
            leaveNodeMapIds.set(root, className);
            nodes.forEach(function (node) { return addClass(node, className); });
        });
        cleanupFns.push(function () {
            enterNodeMap.forEach(function (nodes, root) {
                /** @type {?} */
                var className = /** @type {?} */ ((enterNodeMapIds.get(root)));
                nodes.forEach(function (node) { return removeClass(node, className); });
            });
            leaveNodeMap.forEach(function (nodes, root) {
                /** @type {?} */
                var className = /** @type {?} */ ((leaveNodeMapIds.get(root)));
                nodes.forEach(function (node) { return removeClass(node, className); });
            });
            allLeaveNodes.forEach(function (element) { _this.processLeaveNode(element); });
        });
        /** @type {?} */
        var allPlayers = [];
        /** @type {?} */
        var erroneousTransitions = [];
        for (var i_3 = this._namespaceList.length - 1; i_3 >= 0; i_3--) {
            /** @type {?} */
            var ns = this._namespaceList[i_3];
            ns.drainQueuedTransitions(microtaskId).forEach(function (entry) {
                /** @type {?} */
                var player = entry.player;
                /** @type {?} */
                var element = entry.element;
                allPlayers.push(player);
                if (_this.collectedEnterElements.length) {
                    /** @type {?} */
                    var details = /** @type {?} */ (element[REMOVAL_FLAG]);
                    // move animations are currently not supported...
                    if (details && details.setForMove) {
                        player.destroy();
                        return;
                    }
                }
                /** @type {?} */
                var nodeIsOrphaned = !bodyNode || !_this.driver.containsElement(bodyNode, element);
                /** @type {?} */
                var leaveClassName = /** @type {?} */ ((leaveNodeMapIds.get(element)));
                /** @type {?} */
                var enterClassName = /** @type {?} */ ((enterNodeMapIds.get(element)));
                /** @type {?} */
                var instruction = /** @type {?} */ ((_this._buildInstruction(entry, subTimelines, enterClassName, leaveClassName, nodeIsOrphaned)));
                if (instruction.errors && instruction.errors.length) {
                    erroneousTransitions.push(instruction);
                    return;
                }
                // even though the element may not be apart of the DOM, it may
                // still be added at a later point (due to the mechanics of content
                // projection and/or dynamic component insertion) therefore it's
                // important we still style the element.
                if (nodeIsOrphaned) {
                    player.onStart(function () { return eraseStyles(element, instruction.fromStyles); });
                    player.onDestroy(function () { return setStyles(element, instruction.toStyles); });
                    skippedPlayers.push(player);
                    return;
                }
                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(function () { return eraseStyles(element, instruction.fromStyles); });
                    player.onDestroy(function () { return setStyles(element, instruction.toStyles); });
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(function (tl) { return tl.stretchStartingKeyframe = true; });
                subTimelines.append(element, instruction.timelines);
                /** @type {?} */
                var tuple = { instruction: instruction, player: player, element: element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(function (element) { return getOrSetAsInMap(queriedElements, element, []).push(player); });
                instruction.preStyleProps.forEach(function (stringMap, element) {
                    /** @type {?} */
                    var props = Object.keys(stringMap);
                    if (props.length) {
                        /** @type {?} */
                        var setVal_1 = /** @type {?} */ ((allPreStyleElements.get(element)));
                        if (!setVal_1) {
                            allPreStyleElements.set(element, setVal_1 = new Set());
                        }
                        props.forEach(function (prop) { return setVal_1.add(prop); });
                    }
                });
                instruction.postStyleProps.forEach(function (stringMap, element) {
                    /** @type {?} */
                    var props = Object.keys(stringMap);
                    /** @type {?} */
                    var setVal = /** @type {?} */ ((allPostStyleElements.get(element)));
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(function (prop) { return setVal.add(prop); });
                });
            });
        }
        if (erroneousTransitions.length) {
            /** @type {?} */
            var errors_1 = [];
            erroneousTransitions.forEach(function (instruction) {
                errors_1.push("@" + instruction.triggerName + " has failed due to:\n"); /** @type {?} */
                ((instruction.errors)).forEach(function (error) { return errors_1.push("- " + error + "\n"); });
            });
            allPlayers.forEach(function (player) { return player.destroy(); });
            this.reportError(errors_1);
        }
        /** @type {?} */
        var allPreviousPlayersMap = new Map();
        /** @type {?} */
        var animationElementMap = new Map();
        queuedInstructions.forEach(function (entry) {
            /** @type {?} */
            var element = entry.element;
            if (subTimelines.has(element)) {
                animationElementMap.set(element, element);
                _this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(function (player) {
            /** @type {?} */
            var element = player.element;
            /** @type {?} */
            var previousPlayers = _this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(function (prevPlayer) {
                getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer);
                prevPlayer.destroy();
            });
        });
        /** @type {?} */
        var replaceNodes = allLeaveNodes.filter(function (node) {
            return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
        });
        /** @type {?} */
        var postStylesMap = new Map();
        /** @type {?} */
        var allLeaveQueriedNodes = cloakAndComputeStyles(postStylesMap, this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);
        allLeaveQueriedNodes.forEach(function (node) {
            if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
                replaceNodes.push(node);
            }
        });
        /** @type {?} */
        var preStylesMap = new Map();
        enterNodeMap.forEach(function (nodes, root) {
            cloakAndComputeStyles(preStylesMap, _this.driver, new Set(nodes), allPreStyleElements, PRE_STYLE);
        });
        replaceNodes.forEach(function (node) {
            /** @type {?} */
            var post = postStylesMap.get(node);
            /** @type {?} */
            var pre = preStylesMap.get(node);
            postStylesMap.set(node, /** @type {?} */ (tslib_1.__assign({}, post, pre)));
        });
        /** @type {?} */
        var rootPlayers = [];
        /** @type {?} */
        var subPlayers = [];
        /** @type {?} */
        var NO_PARENT_ANIMATION_ELEMENT_DETECTED = {};
        queuedInstructions.forEach(function (entry) {
            var element = entry.element, player = entry.player, instruction = entry.instruction;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                if (disabledElementsSet.has(element)) {
                    player.onDestroy(function () { return setStyles(element, instruction.toStyles); });
                    player.disabled = true;
                    player.overrideTotalTime(instruction.totalTime);
                    skippedPlayers.push(player);
                    return;
                }
                /** @type {?} */
                var parentWithAnimation_1 = NO_PARENT_ANIMATION_ELEMENT_DETECTED;
                if (animationElementMap.size > 1) {
                    /** @type {?} */
                    var elm = element;
                    /** @type {?} */
                    var parentsToAdd = [];
                    while (elm = elm.parentNode) {
                        /** @type {?} */
                        var detectedParent = animationElementMap.get(elm);
                        if (detectedParent) {
                            parentWithAnimation_1 = detectedParent;
                            break;
                        }
                        parentsToAdd.push(elm);
                    }
                    parentsToAdd.forEach(function (parent) { return animationElementMap.set(parent, parentWithAnimation_1); });
                }
                /** @type {?} */
                var innerPlayer = _this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                if (parentWithAnimation_1 === NO_PARENT_ANIMATION_ELEMENT_DETECTED) {
                    rootPlayers.push(player);
                }
                else {
                    /** @type {?} */
                    var parentPlayers = _this.playersByElement.get(parentWithAnimation_1);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
            }
            else {
                eraseStyles(element, instruction.fromStyles);
                player.onDestroy(function () { return setStyles(element, instruction.toStyles); });
                // there still might be a ancestor player animating this
                // element therefore we will still add it as a sub player
                // even if its animation may be disabled
                subPlayers.push(player);
                if (disabledElementsSet.has(element)) {
                    skippedPlayers.push(player);
                }
            }
        });
        // find all of the sub players' corresponding inner animation player
        subPlayers.forEach(function (player) {
            /** @type {?} */
            var playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                /** @type {?} */
                var innerPlayer = optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don't actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(function (player) {
            if (player.parentPlayer) {
                player.syncPlayerEvents(player.parentPlayer);
            }
            else {
                player.destroy();
            }
        });
        // run through all of the queued removals and see if they
        // were picked up by a query. If not then perform the removal
        // operation right away unless a parent animation is ongoing.
        for (var i_4 = 0; i_4 < allLeaveNodes.length; i_4++) {
            /** @type {?} */
            var element = allLeaveNodes[i_4];
            /** @type {?} */
            var details = /** @type {?} */ (element[REMOVAL_FLAG]);
            removeClass(element, LEAVE_CLASSNAME);
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation)
                continue;
            /** @type {?} */
            var players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                /** @type {?} */
                var queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push.apply(players, queriedPlayerResults);
                }
                /** @type {?} */
                var queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
                for (var j = 0; j < queriedInnerElements.length; j++) {
                    /** @type {?} */
                    var queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push.apply(players, queriedPlayers);
                    }
                }
            }
            /** @type {?} */
            var activePlayers = players.filter(function (p) { return !p.destroyed; });
            if (activePlayers.length) {
                removeNodesAfterAnimationDone(this, element, activePlayers);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        // this is required so the cleanup method doesn't remove them
        allLeaveNodes.length = 0;
        rootPlayers.forEach(function (player) {
            _this.players.push(player);
            player.onDone(function () {
                player.destroy();
                /** @type {?} */
                var index = _this.players.indexOf(player);
                _this.players.splice(index, 1);
            });
            player.play();
        });
        return rootPlayers;
    };
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @return {?}
     */
    TransitionAnimationEngine.prototype.elementContainsData = /**
     * @param {?} namespaceId
     * @param {?} element
     * @return {?}
     */
    function (namespaceId, element) {
        /** @type {?} */
        var containsData = false;
        /** @type {?} */
        var details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval)
            containsData = true;
        if (this.playersByElement.has(element))
            containsData = true;
        if (this.playersByQueriedElement.has(element))
            containsData = true;
        if (this.statesByElement.has(element))
            containsData = true;
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    };
    /**
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationEngine.prototype.afterFlush = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) { this._flushFns.push(callback); };
    /**
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationEngine.prototype.afterFlushAnimationsDone = /**
     * @param {?} callback
     * @return {?}
     */
    function (callback) { this._whenQuietFns.push(callback); };
    /**
     * @param {?} element
     * @param {?} isQueriedElement
     * @param {?=} namespaceId
     * @param {?=} triggerName
     * @param {?=} toStateValue
     * @return {?}
     */
    TransitionAnimationEngine.prototype._getPreviousPlayers = /**
     * @param {?} element
     * @param {?} isQueriedElement
     * @param {?=} namespaceId
     * @param {?=} triggerName
     * @param {?=} toStateValue
     * @return {?}
     */
    function (element, isQueriedElement, namespaceId, triggerName, toStateValue) {
        /** @type {?} */
        var players = [];
        if (isQueriedElement) {
            /** @type {?} */
            var queriedElementPlayers = this.playersByQueriedElement.get(element);
            if (queriedElementPlayers) {
                players = queriedElementPlayers;
            }
        }
        else {
            /** @type {?} */
            var elementPlayers = this.playersByElement.get(element);
            if (elementPlayers) {
                /** @type {?} */
                var isRemovalAnimation_1 = !toStateValue || toStateValue == VOID_VALUE;
                elementPlayers.forEach(function (player) {
                    if (player.queued)
                        return;
                    if (!isRemovalAnimation_1 && player.triggerName != triggerName)
                        return;
                    players.push(player);
                });
            }
        }
        if (namespaceId || triggerName) {
            players = players.filter(function (player) {
                if (namespaceId && namespaceId != player.namespaceId)
                    return false;
                if (triggerName && triggerName != player.triggerName)
                    return false;
                return true;
            });
        }
        return players;
    };
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @return {?}
     */
    TransitionAnimationEngine.prototype._beforeAnimationBuild = /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @return {?}
     */
    function (namespaceId, instruction, allPreviousPlayersMap) {
        /** @type {?} */
        var triggerName = instruction.triggerName;
        /** @type {?} */
        var rootElement = instruction.element;
        /** @type {?} */
        var targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        /** @type {?} */
        var targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        var _loop_1 = function (timelineInstruction) {
            /** @type {?} */
            var element = timelineInstruction.element;
            /** @type {?} */
            var isQueriedElement = element !== rootElement;
            /** @type {?} */
            var players = getOrSetAsInMap(allPreviousPlayersMap, element, []);
            /** @type {?} */
            var previousPlayers = this_1._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(function (player) {
                /** @type {?} */
                var realPlayer = /** @type {?} */ (player.getRealPlayer());
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                player.destroy();
                players.push(player);
            });
        };
        var this_1 = this;
        for (var _i = 0, _a = instruction.timelines; _i < _a.length; _i++) {
            var timelineInstruction = _a[_i];
            _loop_1(timelineInstruction);
        }
        // this needs to be done so that the PRE/POST styles can be
        // computed properly without interfering with the previous animation
        eraseStyles(rootElement, instruction.fromStyles);
    };
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @param {?} skippedPlayersMap
     * @param {?} preStylesMap
     * @param {?} postStylesMap
     * @return {?}
     */
    TransitionAnimationEngine.prototype._buildAnimation = /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @param {?} skippedPlayersMap
     * @param {?} preStylesMap
     * @param {?} postStylesMap
     * @return {?}
     */
    function (namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
        var _this = this;
        /** @type {?} */
        var triggerName = instruction.triggerName;
        /** @type {?} */
        var rootElement = instruction.element;
        /** @type {?} */
        var allQueriedPlayers = [];
        /** @type {?} */
        var allConsumedElements = new Set();
        /** @type {?} */
        var allSubElements = new Set();
        /** @type {?} */
        var allNewPlayers = instruction.timelines.map(function (timelineInstruction) {
            /** @type {?} */
            var element = timelineInstruction.element;
            allConsumedElements.add(element);
            /** @type {?} */
            var details = element[REMOVAL_FLAG];
            if (details && details.removedBeforeQueried)
                return new NoopAnimationPlayer(timelineInstruction.duration, timelineInstruction.delay);
            /** @type {?} */
            var isQueriedElement = element !== rootElement;
            /** @type {?} */
            var previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY)
                .map(function (p) { return p.getRealPlayer(); }))
                .filter(function (p) {
                /** @type {?} */
                var pp = /** @type {?} */ (p);
                return pp.element ? pp.element === element : false;
            });
            /** @type {?} */
            var preStyles = preStylesMap.get(element);
            /** @type {?} */
            var postStyles = postStylesMap.get(element);
            /** @type {?} */
            var keyframes = normalizeKeyframes(_this.driver, _this._normalizer, element, timelineInstruction.keyframes, preStyles, postStyles);
            /** @type {?} */
            var player = _this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
            // this means that this particular player belongs to a sub trigger. It is
            // important that we match this player up with the corresponding (@trigger.listener)
            if (timelineInstruction.subTimeline && skippedPlayersMap) {
                allSubElements.add(element);
            }
            if (isQueriedElement) {
                /** @type {?} */
                var wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
                wrappedPlayer.setRealPlayer(player);
                allQueriedPlayers.push(wrappedPlayer);
            }
            return player;
        });
        allQueriedPlayers.forEach(function (player) {
            getOrSetAsInMap(_this.playersByQueriedElement, player.element, []).push(player);
            player.onDone(function () { return deleteOrUnsetInMap(_this.playersByQueriedElement, player.element, player); });
        });
        allConsumedElements.forEach(function (element) { return addClass(element, NG_ANIMATING_CLASSNAME); });
        /** @type {?} */
        var player = optimizeGroupPlayer(allNewPlayers);
        player.onDestroy(function () {
            allConsumedElements.forEach(function (element) { return removeClass(element, NG_ANIMATING_CLASSNAME); });
            setStyles(rootElement, instruction.toStyles);
        });
        // this basically makes all of the callbacks for sub element animations
        // be dependent on the upper players for when they finish
        allSubElements.forEach(function (element) { getOrSetAsInMap(skippedPlayersMap, element, []).push(player); });
        return player;
    };
    /**
     * @param {?} instruction
     * @param {?} keyframes
     * @param {?} previousPlayers
     * @return {?}
     */
    TransitionAnimationEngine.prototype._buildPlayer = /**
     * @param {?} instruction
     * @param {?} keyframes
     * @param {?} previousPlayers
     * @return {?}
     */
    function (instruction, keyframes, previousPlayers) {
        if (keyframes.length > 0) {
            return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
        }
        // special case for when an empty transition|definition is provided
        // ... there is no point in rendering an empty animation
        return new NoopAnimationPlayer(instruction.duration, instruction.delay);
    };
    return TransitionAnimationEngine;
}());
export { TransitionAnimationEngine };
if (false) {
    /** @type {?} */
    TransitionAnimationEngine.prototype.players;
    /** @type {?} */
    TransitionAnimationEngine.prototype.newHostElements;
    /** @type {?} */
    TransitionAnimationEngine.prototype.playersByElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.playersByQueriedElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.statesByElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.disabledNodes;
    /** @type {?} */
    TransitionAnimationEngine.prototype.totalAnimations;
    /** @type {?} */
    TransitionAnimationEngine.prototype.totalQueuedPlayers;
    /** @type {?} */
    TransitionAnimationEngine.prototype._namespaceLookup;
    /** @type {?} */
    TransitionAnimationEngine.prototype._namespaceList;
    /** @type {?} */
    TransitionAnimationEngine.prototype._flushFns;
    /** @type {?} */
    TransitionAnimationEngine.prototype._whenQuietFns;
    /** @type {?} */
    TransitionAnimationEngine.prototype.namespacesByHostElement;
    /** @type {?} */
    TransitionAnimationEngine.prototype.collectedEnterElements;
    /** @type {?} */
    TransitionAnimationEngine.prototype.collectedLeaveElements;
    /** @type {?} */
    TransitionAnimationEngine.prototype.onRemovalComplete;
    /** @type {?} */
    TransitionAnimationEngine.prototype.bodyNode;
    /** @type {?} */
    TransitionAnimationEngine.prototype.driver;
    /** @type {?} */
    TransitionAnimationEngine.prototype._normalizer;
}
var TransitionAnimationPlayer = /** @class */ (function () {
    function TransitionAnimationPlayer(namespaceId, triggerName, element) {
        this.namespaceId = namespaceId;
        this.triggerName = triggerName;
        this.element = element;
        this._player = new NoopAnimationPlayer();
        this._containsRealPlayer = false;
        this._queuedCallbacks = {};
        this.destroyed = false;
        this.markedForDestroy = false;
        this.disabled = false;
        this.queued = true;
        this.totalTime = 0;
    }
    /**
     * @param {?} player
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.setRealPlayer = /**
     * @param {?} player
     * @return {?}
     */
    function (player) {
        var _this = this;
        if (this._containsRealPlayer)
            return;
        this._player = player;
        Object.keys(this._queuedCallbacks).forEach(function (phase) {
            _this._queuedCallbacks[phase].forEach(function (callback) { return listenOnPlayer(player, phase, undefined, callback); });
        });
        this._queuedCallbacks = {};
        this._containsRealPlayer = true;
        this.overrideTotalTime(player.totalTime);
        (/** @type {?} */ (this)).queued = false;
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.getRealPlayer = /**
     * @return {?}
     */
    function () { return this._player; };
    /**
     * @param {?} totalTime
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.overrideTotalTime = /**
     * @param {?} totalTime
     * @return {?}
     */
    function (totalTime) { (/** @type {?} */ (this)).totalTime = totalTime; };
    /**
     * @param {?} player
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.syncPlayerEvents = /**
     * @param {?} player
     * @return {?}
     */
    function (player) {
        var _this = this;
        /** @type {?} */
        var p = /** @type {?} */ (this._player);
        if (p.triggerCallback) {
            player.onStart(function () { return ((p.triggerCallback))('start'); });
        }
        player.onDone(function () { return _this.finish(); });
        player.onDestroy(function () { return _this.destroy(); });
    };
    /**
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    TransitionAnimationPlayer.prototype._queueEvent = /**
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    function (name, callback) {
        getOrSetAsInMap(this._queuedCallbacks, name, []).push(callback);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.onDone = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        if (this.queued) {
            this._queueEvent('done', fn);
        }
        this._player.onDone(fn);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.onStart = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        if (this.queued) {
            this._queueEvent('start', fn);
        }
        this._player.onStart(fn);
    };
    /**
     * @param {?} fn
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.onDestroy = /**
     * @param {?} fn
     * @return {?}
     */
    function (fn) {
        if (this.queued) {
            this._queueEvent('destroy', fn);
        }
        this._player.onDestroy(fn);
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.init = /**
     * @return {?}
     */
    function () { this._player.init(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.hasStarted = /**
     * @return {?}
     */
    function () { return this.queued ? false : this._player.hasStarted(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.play = /**
     * @return {?}
     */
    function () { !this.queued && this._player.play(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.pause = /**
     * @return {?}
     */
    function () { !this.queued && this._player.pause(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.restart = /**
     * @return {?}
     */
    function () { !this.queued && this._player.restart(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.finish = /**
     * @return {?}
     */
    function () { this._player.finish(); };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.destroy = /**
     * @return {?}
     */
    function () {
        (/** @type {?} */ (this)).destroyed = true;
        this._player.destroy();
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.reset = /**
     * @return {?}
     */
    function () { !this.queued && this._player.reset(); };
    /**
     * @param {?} p
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.setPosition = /**
     * @param {?} p
     * @return {?}
     */
    function (p) {
        if (!this.queued) {
            this._player.setPosition(p);
        }
    };
    /**
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.getPosition = /**
     * @return {?}
     */
    function () { return this.queued ? 0 : this._player.getPosition(); };
    /** @internal */
    /**
     * \@internal
     * @param {?} phaseName
     * @return {?}
     */
    TransitionAnimationPlayer.prototype.triggerCallback = /**
     * \@internal
     * @param {?} phaseName
     * @return {?}
     */
    function (phaseName) {
        /** @type {?} */
        var p = /** @type {?} */ (this._player);
        if (p.triggerCallback) {
            p.triggerCallback(phaseName);
        }
    };
    return TransitionAnimationPlayer;
}());
export { TransitionAnimationPlayer };
if (false) {
    /** @type {?} */
    TransitionAnimationPlayer.prototype._player;
    /** @type {?} */
    TransitionAnimationPlayer.prototype._containsRealPlayer;
    /** @type {?} */
    TransitionAnimationPlayer.prototype._queuedCallbacks;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.destroyed;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.parentPlayer;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.markedForDestroy;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.disabled;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.queued;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.totalTime;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.namespaceId;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.triggerName;
    /** @type {?} */
    TransitionAnimationPlayer.prototype.element;
}
/**
 * @param {?} map
 * @param {?} key
 * @param {?} value
 * @return {?}
 */
function deleteOrUnsetInMap(map, key, value) {
    /** @type {?} */
    var currentValues;
    if (map instanceof Map) {
        currentValues = map.get(key);
        if (currentValues) {
            if (currentValues.length) {
                /** @type {?} */
                var index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                map.delete(key);
            }
        }
    }
    else {
        currentValues = map[key];
        if (currentValues) {
            if (currentValues.length) {
                /** @type {?} */
                var index = currentValues.indexOf(value);
                currentValues.splice(index, 1);
            }
            if (currentValues.length == 0) {
                delete map[key];
            }
        }
    }
    return currentValues;
}
/**
 * @param {?} value
 * @return {?}
 */
function normalizeTriggerValue(value) {
    // we use `!= null` here because it's the most simple
    // way to test against a "falsy" value without mixing
    // in empty strings or a zero value. DO NOT OPTIMIZE.
    return value != null ? value : null;
}
/**
 * @param {?} node
 * @return {?}
 */
function isElementNode(node) {
    return node && node['nodeType'] === 1;
}
/**
 * @param {?} eventName
 * @return {?}
 */
function isTriggerEventValid(eventName) {
    return eventName == 'start' || eventName == 'done';
}
/**
 * @param {?} element
 * @param {?=} value
 * @return {?}
 */
function cloakElement(element, value) {
    /** @type {?} */
    var oldValue = element.style.display;
    element.style.display = value != null ? value : 'none';
    return oldValue;
}
/**
 * @param {?} valuesMap
 * @param {?} driver
 * @param {?} elements
 * @param {?} elementPropsMap
 * @param {?} defaultStyle
 * @return {?}
 */
function cloakAndComputeStyles(valuesMap, driver, elements, elementPropsMap, defaultStyle) {
    /** @type {?} */
    var cloakVals = [];
    elements.forEach(function (element) { return cloakVals.push(cloakElement(element)); });
    /** @type {?} */
    var failedElements = [];
    elementPropsMap.forEach(function (props, element) {
        /** @type {?} */
        var styles = {};
        props.forEach(function (prop) {
            /** @type {?} */
            var value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);
            // there is no easy way to detect this because a sub element could be removed
            // by a parent animation element being detached.
            if (!value || value.length == 0) {
                element[REMOVAL_FLAG] = NULL_REMOVED_QUERIED_STATE;
                failedElements.push(element);
            }
        });
        valuesMap.set(element, styles);
    });
    /** @type {?} */
    var i = 0;
    elements.forEach(function (element) { return cloakElement(element, cloakVals[i++]); });
    return failedElements;
}
/**
 * @param {?} roots
 * @param {?} nodes
 * @return {?}
 */
function buildRootMap(roots, nodes) {
    /** @type {?} */
    var rootMap = new Map();
    roots.forEach(function (root) { return rootMap.set(root, []); });
    if (nodes.length == 0)
        return rootMap;
    /** @type {?} */
    var NULL_NODE = 1;
    /** @type {?} */
    var nodeSet = new Set(nodes);
    /** @type {?} */
    var localRootMap = new Map();
    /**
     * @param {?} node
     * @return {?}
     */
    function getRoot(node) {
        if (!node)
            return NULL_NODE;
        /** @type {?} */
        var root = localRootMap.get(node);
        if (root)
            return root;
        /** @type {?} */
        var parent = node.parentNode;
        if (rootMap.has(parent)) { // ngIf inside @trigger
            // ngIf inside @trigger
            root = parent;
        }
        else if (nodeSet.has(parent)) { // ngIf inside ngIf
            // ngIf inside ngIf
            root = NULL_NODE;
        }
        else { // recurse upwards
            // recurse upwards
            root = getRoot(parent);
        }
        localRootMap.set(node, root);
        return root;
    }
    nodes.forEach(function (node) {
        /** @type {?} */
        var root = getRoot(node);
        if (root !== NULL_NODE) {
            /** @type {?} */ ((rootMap.get(root))).push(node);
        }
    });
    return rootMap;
}
/** @type {?} */
var CLASSES_CACHE_KEY = '$$classes';
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function containsClass(element, className) {
    if (element.classList) {
        return element.classList.contains(className);
    }
    else {
        /** @type {?} */
        var classes = element[CLASSES_CACHE_KEY];
        return classes && classes[className];
    }
}
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function addClass(element, className) {
    if (element.classList) {
        element.classList.add(className);
    }
    else {
        /** @type {?} */
        var classes = element[CLASSES_CACHE_KEY];
        if (!classes) {
            classes = element[CLASSES_CACHE_KEY] = {};
        }
        classes[className] = true;
    }
}
/**
 * @param {?} element
 * @param {?} className
 * @return {?}
 */
function removeClass(element, className) {
    if (element.classList) {
        element.classList.remove(className);
    }
    else {
        /** @type {?} */
        var classes = element[CLASSES_CACHE_KEY];
        if (classes) {
            delete classes[className];
        }
    }
}
/**
 * @param {?} engine
 * @param {?} element
 * @param {?} players
 * @return {?}
 */
function removeNodesAfterAnimationDone(engine, element, players) {
    optimizeGroupPlayer(players).onDone(function () { return engine.processLeaveNode(element); });
}
/**
 * @param {?} players
 * @return {?}
 */
function flattenGroupPlayers(players) {
    /** @type {?} */
    var finalPlayers = [];
    _flattenGroupPlayersRecur(players, finalPlayers);
    return finalPlayers;
}
/**
 * @param {?} players
 * @param {?} finalPlayers
 * @return {?}
 */
function _flattenGroupPlayersRecur(players, finalPlayers) {
    for (var i = 0; i < players.length; i++) {
        /** @type {?} */
        var player = players[i];
        if (player instanceof AnimationGroupPlayer) {
            _flattenGroupPlayersRecur(player.players, finalPlayers);
        }
        else {
            finalPlayers.push(/** @type {?} */ (player));
        }
    }
}
/**
 * @param {?} a
 * @param {?} b
 * @return {?}
 */
function objEquals(a, b) {
    /** @type {?} */
    var k1 = Object.keys(a);
    /** @type {?} */
    var k2 = Object.keys(b);
    if (k1.length != k2.length)
        return false;
    for (var i = 0; i < k1.length; i++) {
        /** @type {?} */
        var prop = k1[i];
        if (!b.hasOwnProperty(prop) || a[prop] !== b[prop])
            return false;
    }
    return true;
}
/**
 * @param {?} element
 * @param {?} allPreStyleElements
 * @param {?} allPostStyleElements
 * @return {?}
 */
function replacePostStylesAsPre(element, allPreStyleElements, allPostStyleElements) {
    /** @type {?} */
    var postEntry = allPostStyleElements.get(element);
    if (!postEntry)
        return false;
    /** @type {?} */
    var preEntry = allPreStyleElements.get(element);
    if (preEntry) {
        postEntry.forEach(function (data) { return ((preEntry)).add(data); });
    }
    else {
        allPreStyleElements.set(element, postEntry);
    }
    allPostStyleElements.delete(element);
    return true;
}
//# sourceMappingURL=transition_animation_engine.js.map