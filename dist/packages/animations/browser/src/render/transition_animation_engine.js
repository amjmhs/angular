/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import { AUTO_STYLE, NoopAnimationPlayer, ɵAnimationGroupPlayer as AnimationGroupPlayer, ɵPRE_STYLE as PRE_STYLE } from '@angular/animations';
import { ElementInstructionMap } from '../dsl/element_instruction_map';
import { ENTER_CLASSNAME, LEAVE_CLASSNAME, NG_ANIMATING_CLASSNAME, NG_ANIMATING_SELECTOR, NG_TRIGGER_CLASSNAME, NG_TRIGGER_SELECTOR, copyObj, eraseStyles, setStyles } from '../util';
import { getOrSetAsInMap, listenOnPlayer, makeAnimationEvent, normalizeKeyframes, optimizeGroupPlayer } from './shared';
/** @type {?} */
const QUEUED_CLASSNAME = 'ng-animate-queued';
/** @type {?} */
const QUEUED_SELECTOR = '.ng-animate-queued';
/** @type {?} */
const DISABLED_CLASSNAME = 'ng-animate-disabled';
/** @type {?} */
const DISABLED_SELECTOR = '.ng-animate-disabled';
/** @type {?} */
const STAR_CLASSNAME = 'ng-star-inserted';
/** @type {?} */
const STAR_SELECTOR = '.ng-star-inserted';
/** @type {?} */
const EMPTY_PLAYER_ARRAY = [];
/** @type {?} */
const NULL_REMOVAL_STATE = {
    namespaceId: '',
    setForRemoval: false,
    setForMove: false,
    hasAnimation: false,
    removedBeforeQueried: false
};
/** @type {?} */
const NULL_REMOVED_QUERIED_STATE = {
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
export const REMOVAL_FLAG = '__ng_removed';
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
export class StateValue {
    /**
     * @param {?} input
     * @param {?=} namespaceId
     */
    constructor(input, namespaceId = '') {
        this.namespaceId = namespaceId;
        /** @type {?} */
        const isObj = input && input.hasOwnProperty('value');
        /** @type {?} */
        const value = isObj ? input['value'] : input;
        this.value = normalizeTriggerValue(value);
        if (isObj) {
            /** @type {?} */
            const options = copyObj(/** @type {?} */ (input));
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
    /**
     * @return {?}
     */
    get params() { return /** @type {?} */ (this.options.params); }
    /**
     * @param {?} options
     * @return {?}
     */
    absorbOptions(options) {
        /** @type {?} */
        const newParams = options.params;
        if (newParams) {
            /** @type {?} */
            const oldParams = /** @type {?} */ ((this.options.params));
            Object.keys(newParams).forEach(prop => {
                if (oldParams[prop] == null) {
                    oldParams[prop] = newParams[prop];
                }
            });
        }
    }
}
if (false) {
    /** @type {?} */
    StateValue.prototype.value;
    /** @type {?} */
    StateValue.prototype.options;
    /** @type {?} */
    StateValue.prototype.namespaceId;
}
/** @type {?} */
export const VOID_VALUE = 'void';
/** @type {?} */
export const DEFAULT_STATE_VALUE = new StateValue(VOID_VALUE);
export class AnimationTransitionNamespace {
    /**
     * @param {?} id
     * @param {?} hostElement
     * @param {?} _engine
     */
    constructor(id, hostElement, _engine) {
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
    listen(element, name, phase, callback) {
        if (!this._triggers.hasOwnProperty(name)) {
            throw new Error(`Unable to listen on the animation trigger event "${phase}" because the animation trigger "${name}" doesn\'t exist!`);
        }
        if (phase == null || phase.length == 0) {
            throw new Error(`Unable to listen on the animation trigger "${name}" because the provided event is undefined!`);
        }
        if (!isTriggerEventValid(phase)) {
            throw new Error(`The provided animation trigger event "${phase}" for the animation trigger "${name}" is not supported!`);
        }
        /** @type {?} */
        const listeners = getOrSetAsInMap(this._elementListeners, element, []);
        /** @type {?} */
        const data = { name, phase, callback };
        listeners.push(data);
        /** @type {?} */
        const triggersWithStates = getOrSetAsInMap(this._engine.statesByElement, element, {});
        if (!triggersWithStates.hasOwnProperty(name)) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + name);
            triggersWithStates[name] = DEFAULT_STATE_VALUE;
        }
        return () => {
            // the event listener is removed AFTER the flush has occurred such
            // that leave animations callbacks can fire (otherwise if the node
            // is removed in between then the listeners would be deregistered)
            this._engine.afterFlush(() => {
                /** @type {?} */
                const index = listeners.indexOf(data);
                if (index >= 0) {
                    listeners.splice(index, 1);
                }
                if (!this._triggers[name]) {
                    delete triggersWithStates[name];
                }
            });
        };
    }
    /**
     * @param {?} name
     * @param {?} ast
     * @return {?}
     */
    register(name, ast) {
        if (this._triggers[name]) {
            // throw
            return false;
        }
        else {
            this._triggers[name] = ast;
            return true;
        }
    }
    /**
     * @param {?} name
     * @return {?}
     */
    _getTrigger(name) {
        /** @type {?} */
        const trigger = this._triggers[name];
        if (!trigger) {
            throw new Error(`The provided animation trigger "${name}" has not been registered!`);
        }
        return trigger;
    }
    /**
     * @param {?} element
     * @param {?} triggerName
     * @param {?} value
     * @param {?=} defaultToFallback
     * @return {?}
     */
    trigger(element, triggerName, value, defaultToFallback = true) {
        /** @type {?} */
        const trigger = this._getTrigger(triggerName);
        /** @type {?} */
        const player = new TransitionAnimationPlayer(this.id, triggerName, element);
        /** @type {?} */
        let triggersWithStates = this._engine.statesByElement.get(element);
        if (!triggersWithStates) {
            addClass(element, NG_TRIGGER_CLASSNAME);
            addClass(element, NG_TRIGGER_CLASSNAME + '-' + triggerName);
            this._engine.statesByElement.set(element, triggersWithStates = {});
        }
        /** @type {?} */
        let fromState = triggersWithStates[triggerName];
        /** @type {?} */
        const toState = new StateValue(value, this.id);
        /** @type {?} */
        const isObj = value && value.hasOwnProperty('value');
        if (!isObj && fromState) {
            toState.absorbOptions(fromState.options);
        }
        triggersWithStates[triggerName] = toState;
        if (!fromState) {
            fromState = DEFAULT_STATE_VALUE;
        }
        /** @type {?} */
        const isRemoval = toState.value === VOID_VALUE;
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
                const errors = [];
                /** @type {?} */
                const fromStyles = trigger.matchStyles(fromState.value, fromState.params, errors);
                /** @type {?} */
                const toStyles = trigger.matchStyles(toState.value, toState.params, errors);
                if (errors.length) {
                    this._engine.reportError(errors);
                }
                else {
                    this._engine.afterFlush(() => {
                        eraseStyles(element, fromStyles);
                        setStyles(element, toStyles);
                    });
                }
            }
            return;
        }
        /** @type {?} */
        const playersOnElement = getOrSetAsInMap(this._engine.playersByElement, element, []);
        playersOnElement.forEach(player => {
            // only remove the player if it is queued on the EXACT same trigger/namespace
            // we only also deal with queued players here because if the animation has
            // started then we want to keep the player alive until the flush happens
            // (which is where the previousPlayers are passed into the new palyer)
            if (player.namespaceId == this.id && player.triggerName == triggerName && player.queued) {
                player.destroy();
            }
        });
        /** @type {?} */
        let transition = trigger.matchTransition(fromState.value, toState.value, element, toState.params);
        /** @type {?} */
        let isFallbackTransition = false;
        if (!transition) {
            if (!defaultToFallback)
                return;
            transition = trigger.fallbackTransition;
            isFallbackTransition = true;
        }
        this._engine.totalQueuedPlayers++;
        this._queue.push({ element, triggerName, transition, fromState, toState, player, isFallbackTransition });
        if (!isFallbackTransition) {
            addClass(element, QUEUED_CLASSNAME);
            player.onStart(() => { removeClass(element, QUEUED_CLASSNAME); });
        }
        player.onDone(() => {
            /** @type {?} */
            let index = this.players.indexOf(player);
            if (index >= 0) {
                this.players.splice(index, 1);
            }
            /** @type {?} */
            const players = this._engine.playersByElement.get(element);
            if (players) {
                /** @type {?} */
                let index = players.indexOf(player);
                if (index >= 0) {
                    players.splice(index, 1);
                }
            }
        });
        this.players.push(player);
        playersOnElement.push(player);
        return player;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    deregister(name) {
        delete this._triggers[name];
        this._engine.statesByElement.forEach((stateMap, element) => { delete stateMap[name]; });
        this._elementListeners.forEach((listeners, element) => {
            this._elementListeners.set(element, listeners.filter(entry => { return entry.name != name; }));
        });
    }
    /**
     * @param {?} element
     * @return {?}
     */
    clearElementCache(element) {
        this._engine.statesByElement.delete(element);
        this._elementListeners.delete(element);
        /** @type {?} */
        const elementPlayers = this._engine.playersByElement.get(element);
        if (elementPlayers) {
            elementPlayers.forEach(player => player.destroy());
            this._engine.playersByElement.delete(element);
        }
    }
    /**
     * @param {?} rootElement
     * @param {?} context
     * @param {?=} animate
     * @return {?}
     */
    _signalRemovalForInnerTriggers(rootElement, context, animate = false) {
        // emulate a leave animation for all inner nodes within this node.
        // If there are no animations found for any of the nodes then clear the cache
        // for the element.
        this._engine.driver.query(rootElement, NG_TRIGGER_SELECTOR, true).forEach(elm => {
            // this means that an inner remove() operation has already kicked off
            // the animation on this element...
            if (elm[REMOVAL_FLAG])
                return;
            /** @type {?} */
            const namespaces = this._engine.fetchNamespacesByElement(elm);
            if (namespaces.size) {
                namespaces.forEach(ns => ns.triggerLeaveAnimation(elm, context, false, true));
            }
            else {
                this.clearElementCache(elm);
            }
        });
    }
    /**
     * @param {?} element
     * @param {?} context
     * @param {?=} destroyAfterComplete
     * @param {?=} defaultToFallback
     * @return {?}
     */
    triggerLeaveAnimation(element, context, destroyAfterComplete, defaultToFallback) {
        /** @type {?} */
        const triggerStates = this._engine.statesByElement.get(element);
        if (triggerStates) {
            /** @type {?} */
            const players = [];
            Object.keys(triggerStates).forEach(triggerName => {
                // this check is here in the event that an element is removed
                // twice (both on the host level and the component level)
                if (this._triggers[triggerName]) {
                    /** @type {?} */
                    const player = this.trigger(element, triggerName, VOID_VALUE, defaultToFallback);
                    if (player) {
                        players.push(player);
                    }
                }
            });
            if (players.length) {
                this._engine.markElementAsRemoved(this.id, element, true, context);
                if (destroyAfterComplete) {
                    optimizeGroupPlayer(players).onDone(() => this._engine.processLeaveNode(element));
                }
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    prepareLeaveAnimationListeners(element) {
        /** @type {?} */
        const listeners = this._elementListeners.get(element);
        if (listeners) {
            /** @type {?} */
            const visitedTriggers = new Set();
            listeners.forEach(listener => {
                /** @type {?} */
                const triggerName = listener.name;
                if (visitedTriggers.has(triggerName))
                    return;
                visitedTriggers.add(triggerName);
                /** @type {?} */
                const trigger = this._triggers[triggerName];
                /** @type {?} */
                const transition = trigger.fallbackTransition;
                /** @type {?} */
                const elementStates = /** @type {?} */ ((this._engine.statesByElement.get(element)));
                /** @type {?} */
                const fromState = elementStates[triggerName] || DEFAULT_STATE_VALUE;
                /** @type {?} */
                const toState = new StateValue(VOID_VALUE);
                /** @type {?} */
                const player = new TransitionAnimationPlayer(this.id, triggerName, element);
                this._engine.totalQueuedPlayers++;
                this._queue.push({
                    element,
                    triggerName,
                    transition,
                    fromState,
                    toState,
                    player,
                    isFallbackTransition: true
                });
            });
        }
    }
    /**
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    removeNode(element, context) {
        /** @type {?} */
        const engine = this._engine;
        if (element.childElementCount) {
            this._signalRemovalForInnerTriggers(element, context, true);
        }
        // this means that a * => VOID animation was detected and kicked off
        if (this.triggerLeaveAnimation(element, context, true))
            return;
        /** @type {?} */
        let containsPotentialParentTransition = false;
        if (engine.totalAnimations) {
            /** @type {?} */
            const currentPlayers = engine.players.length ? engine.playersByQueriedElement.get(element) : [];
            // when this `if statement` does not continue forward it means that
            // a previous animation query has selected the current element and
            // is animating it. In this situation want to continue forwards and
            // allow the element to be queued up for animation later.
            if (currentPlayers && currentPlayers.length) {
                containsPotentialParentTransition = true;
            }
            else {
                /** @type {?} */
                let parent = element;
                while (parent = parent.parentNode) {
                    /** @type {?} */
                    const triggers = engine.statesByElement.get(parent);
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
            engine.afterFlush(() => this.clearElementCache(element));
            engine.destroyInnerAnimations(element);
            engine._onRemovalComplete(element, context);
        }
    }
    /**
     * @param {?} element
     * @param {?} parent
     * @return {?}
     */
    insertNode(element, parent) { addClass(element, this._hostClassName); }
    /**
     * @param {?} microtaskId
     * @return {?}
     */
    drainQueuedTransitions(microtaskId) {
        /** @type {?} */
        const instructions = [];
        this._queue.forEach(entry => {
            /** @type {?} */
            const player = entry.player;
            if (player.destroyed)
                return;
            /** @type {?} */
            const element = entry.element;
            /** @type {?} */
            const listeners = this._elementListeners.get(element);
            if (listeners) {
                listeners.forEach((listener) => {
                    if (listener.name == entry.triggerName) {
                        /** @type {?} */
                        const baseEvent = makeAnimationEvent(element, entry.triggerName, entry.fromState.value, entry.toState.value);
                        (/** @type {?} */ (baseEvent))['_data'] = microtaskId;
                        listenOnPlayer(entry.player, listener.phase, baseEvent, listener.callback);
                    }
                });
            }
            if (player.markedForDestroy) {
                this._engine.afterFlush(() => {
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
        return instructions.sort((a, b) => {
            /** @type {?} */
            const d0 = a.transition.ast.depCount;
            /** @type {?} */
            const d1 = b.transition.ast.depCount;
            if (d0 == 0 || d1 == 0) {
                return d0 - d1;
            }
            return this._engine.driver.containsElement(a.element, b.element) ? 1 : -1;
        });
    }
    /**
     * @param {?} context
     * @return {?}
     */
    destroy(context) {
        this.players.forEach(p => p.destroy());
        this._signalRemovalForInnerTriggers(this.hostElement, context);
    }
    /**
     * @param {?} element
     * @return {?}
     */
    elementContainsData(element) {
        /** @type {?} */
        let containsData = false;
        if (this._elementListeners.has(element))
            containsData = true;
        containsData =
            (this._queue.find(entry => entry.element === element) ? true : false) || containsData;
        return containsData;
    }
}
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
export class TransitionAnimationEngine {
    /**
     * @param {?} bodyNode
     * @param {?} driver
     * @param {?} _normalizer
     */
    constructor(bodyNode, driver, _normalizer) {
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
        this.onRemovalComplete = (element, context) => { };
    }
    /**
     * \@internal
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    _onRemovalComplete(element, context) { this.onRemovalComplete(element, context); }
    /**
     * @return {?}
     */
    get queuedPlayers() {
        /** @type {?} */
        const players = [];
        this._namespaceList.forEach(ns => {
            ns.players.forEach(player => {
                if (player.queued) {
                    players.push(player);
                }
            });
        });
        return players;
    }
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    createNamespace(namespaceId, hostElement) {
        /** @type {?} */
        const ns = new AnimationTransitionNamespace(namespaceId, hostElement, this);
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
    }
    /**
     * @param {?} ns
     * @param {?} hostElement
     * @return {?}
     */
    _balanceNamespaceList(ns, hostElement) {
        /** @type {?} */
        const limit = this._namespaceList.length - 1;
        if (limit >= 0) {
            /** @type {?} */
            let found = false;
            for (let i = limit; i >= 0; i--) {
                /** @type {?} */
                const nextNamespace = this._namespaceList[i];
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
    }
    /**
     * @param {?} namespaceId
     * @param {?} hostElement
     * @return {?}
     */
    register(namespaceId, hostElement) {
        /** @type {?} */
        let ns = this._namespaceLookup[namespaceId];
        if (!ns) {
            ns = this.createNamespace(namespaceId, hostElement);
        }
        return ns;
    }
    /**
     * @param {?} namespaceId
     * @param {?} name
     * @param {?} trigger
     * @return {?}
     */
    registerTrigger(namespaceId, name, trigger) {
        /** @type {?} */
        let ns = this._namespaceLookup[namespaceId];
        if (ns && ns.register(name, trigger)) {
            this.totalAnimations++;
        }
    }
    /**
     * @param {?} namespaceId
     * @param {?} context
     * @return {?}
     */
    destroy(namespaceId, context) {
        if (!namespaceId)
            return;
        /** @type {?} */
        const ns = this._fetchNamespace(namespaceId);
        this.afterFlush(() => {
            this.namespacesByHostElement.delete(ns.hostElement);
            delete this._namespaceLookup[namespaceId];
            /** @type {?} */
            const index = this._namespaceList.indexOf(ns);
            if (index >= 0) {
                this._namespaceList.splice(index, 1);
            }
        });
        this.afterFlushAnimationsDone(() => ns.destroy(context));
    }
    /**
     * @param {?} id
     * @return {?}
     */
    _fetchNamespace(id) { return this._namespaceLookup[id]; }
    /**
     * @param {?} element
     * @return {?}
     */
    fetchNamespacesByElement(element) {
        /** @type {?} */
        const namespaces = new Set();
        /** @type {?} */
        const elementStates = this.statesByElement.get(element);
        if (elementStates) {
            /** @type {?} */
            const keys = Object.keys(elementStates);
            for (let i = 0; i < keys.length; i++) {
                /** @type {?} */
                const nsId = elementStates[keys[i]].namespaceId;
                if (nsId) {
                    /** @type {?} */
                    const ns = this._fetchNamespace(nsId);
                    if (ns) {
                        namespaces.add(ns);
                    }
                }
            }
        }
        return namespaces;
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} value
     * @return {?}
     */
    trigger(namespaceId, element, name, value) {
        if (isElementNode(element)) {
            /** @type {?} */
            const ns = this._fetchNamespace(namespaceId);
            if (ns) {
                ns.trigger(element, name, value);
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} parent
     * @param {?} insertBefore
     * @return {?}
     */
    insertNode(namespaceId, element, parent, insertBefore) {
        if (!isElementNode(element))
            return;
        /** @type {?} */
        const details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            details.setForRemoval = false;
            details.setForMove = true;
            /** @type {?} */
            const index = this.collectedLeaveElements.indexOf(element);
            if (index >= 0) {
                this.collectedLeaveElements.splice(index, 1);
            }
        }
        // in the event that the namespaceId is blank then the caller
        // code does not contain any animation code in it, but it is
        // just being called so that the node is marked as being inserted
        if (namespaceId) {
            /** @type {?} */
            const ns = this._fetchNamespace(namespaceId);
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
    }
    /**
     * @param {?} element
     * @return {?}
     */
    collectEnterElement(element) { this.collectedEnterElements.push(element); }
    /**
     * @param {?} element
     * @param {?} value
     * @return {?}
     */
    markElementAsDisabled(element, value) {
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
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} context
     * @return {?}
     */
    removeNode(namespaceId, element, context) {
        if (!isElementNode(element)) {
            this._onRemovalComplete(element, context);
            return;
        }
        /** @type {?} */
        const ns = namespaceId ? this._fetchNamespace(namespaceId) : null;
        if (ns) {
            ns.removeNode(element, context);
        }
        else {
            this.markElementAsRemoved(namespaceId, element, false, context);
        }
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?=} hasAnimation
     * @param {?=} context
     * @return {?}
     */
    markElementAsRemoved(namespaceId, element, hasAnimation, context) {
        this.collectedLeaveElements.push(element);
        element[REMOVAL_FLAG] = {
            namespaceId,
            setForRemoval: context, hasAnimation,
            removedBeforeQueried: false
        };
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @param {?} name
     * @param {?} phase
     * @param {?} callback
     * @return {?}
     */
    listen(namespaceId, element, name, phase, callback) {
        if (isElementNode(element)) {
            return this._fetchNamespace(namespaceId).listen(element, name, phase, callback);
        }
        return () => { };
    }
    /**
     * @param {?} entry
     * @param {?} subTimelines
     * @param {?} enterClassName
     * @param {?} leaveClassName
     * @param {?=} skipBuildAst
     * @return {?}
     */
    _buildInstruction(entry, subTimelines, enterClassName, leaveClassName, skipBuildAst) {
        return entry.transition.build(this.driver, entry.element, entry.fromState.value, entry.toState.value, enterClassName, leaveClassName, entry.fromState.options, entry.toState.options, subTimelines, skipBuildAst);
    }
    /**
     * @param {?} containerElement
     * @return {?}
     */
    destroyInnerAnimations(containerElement) {
        /** @type {?} */
        let elements = this.driver.query(containerElement, NG_TRIGGER_SELECTOR, true);
        elements.forEach(element => this.destroyActiveAnimationsForElement(element));
        if (this.playersByQueriedElement.size == 0)
            return;
        elements = this.driver.query(containerElement, NG_ANIMATING_SELECTOR, true);
        elements.forEach(element => this.finishActiveQueriedAnimationOnElement(element));
    }
    /**
     * @param {?} element
     * @return {?}
     */
    destroyActiveAnimationsForElement(element) {
        /** @type {?} */
        const players = this.playersByElement.get(element);
        if (players) {
            players.forEach(player => {
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
    }
    /**
     * @param {?} element
     * @return {?}
     */
    finishActiveQueriedAnimationOnElement(element) {
        /** @type {?} */
        const players = this.playersByQueriedElement.get(element);
        if (players) {
            players.forEach(player => player.finish());
        }
    }
    /**
     * @return {?}
     */
    whenRenderingDone() {
        return new Promise(resolve => {
            if (this.players.length) {
                return optimizeGroupPlayer(this.players).onDone(() => resolve());
            }
            else {
                resolve();
            }
        });
    }
    /**
     * @param {?} element
     * @return {?}
     */
    processLeaveNode(element) {
        /** @type {?} */
        const details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval) {
            // this will prevent it from removing it twice
            element[REMOVAL_FLAG] = NULL_REMOVAL_STATE;
            if (details.namespaceId) {
                this.destroyInnerAnimations(element);
                /** @type {?} */
                const ns = this._fetchNamespace(details.namespaceId);
                if (ns) {
                    ns.clearElementCache(element);
                }
            }
            this._onRemovalComplete(element, details.setForRemoval);
        }
        if (this.driver.matchesElement(element, DISABLED_SELECTOR)) {
            this.markElementAsDisabled(element, false);
        }
        this.driver.query(element, DISABLED_SELECTOR, true).forEach(node => {
            this.markElementAsDisabled(element, false);
        });
    }
    /**
     * @param {?=} microtaskId
     * @return {?}
     */
    flush(microtaskId = -1) {
        /** @type {?} */
        let players = [];
        if (this.newHostElements.size) {
            this.newHostElements.forEach((ns, element) => this._balanceNamespaceList(ns, element));
            this.newHostElements.clear();
        }
        if (this.totalAnimations && this.collectedEnterElements.length) {
            for (let i = 0; i < this.collectedEnterElements.length; i++) {
                /** @type {?} */
                const elm = this.collectedEnterElements[i];
                addClass(elm, STAR_CLASSNAME);
            }
        }
        if (this._namespaceList.length &&
            (this.totalQueuedPlayers || this.collectedLeaveElements.length)) {
            /** @type {?} */
            const cleanupFns = [];
            try {
                players = this._flushAnimations(cleanupFns, microtaskId);
            }
            finally {
                for (let i = 0; i < cleanupFns.length; i++) {
                    cleanupFns[i]();
                }
            }
        }
        else {
            for (let i = 0; i < this.collectedLeaveElements.length; i++) {
                /** @type {?} */
                const element = this.collectedLeaveElements[i];
                this.processLeaveNode(element);
            }
        }
        this.totalQueuedPlayers = 0;
        this.collectedEnterElements.length = 0;
        this.collectedLeaveElements.length = 0;
        this._flushFns.forEach(fn => fn());
        this._flushFns = [];
        if (this._whenQuietFns.length) {
            /** @type {?} */
            const quietFns = this._whenQuietFns;
            this._whenQuietFns = [];
            if (players.length) {
                optimizeGroupPlayer(players).onDone(() => { quietFns.forEach(fn => fn()); });
            }
            else {
                quietFns.forEach(fn => fn());
            }
        }
    }
    /**
     * @param {?} errors
     * @return {?}
     */
    reportError(errors) {
        throw new Error(`Unable to process animations due to the following failed trigger transitions\n ${errors.join('\n')}`);
    }
    /**
     * @param {?} cleanupFns
     * @param {?} microtaskId
     * @return {?}
     */
    _flushAnimations(cleanupFns, microtaskId) {
        /** @type {?} */
        const subTimelines = new ElementInstructionMap();
        /** @type {?} */
        const skippedPlayers = [];
        /** @type {?} */
        const skippedPlayersMap = new Map();
        /** @type {?} */
        const queuedInstructions = [];
        /** @type {?} */
        const queriedElements = new Map();
        /** @type {?} */
        const allPreStyleElements = new Map();
        /** @type {?} */
        const allPostStyleElements = new Map();
        /** @type {?} */
        const disabledElementsSet = new Set();
        this.disabledNodes.forEach(node => {
            disabledElementsSet.add(node);
            /** @type {?} */
            const nodesThatAreDisabled = this.driver.query(node, QUEUED_SELECTOR, true);
            for (let i = 0; i < nodesThatAreDisabled.length; i++) {
                disabledElementsSet.add(nodesThatAreDisabled[i]);
            }
        });
        /** @type {?} */
        const bodyNode = this.bodyNode;
        /** @type {?} */
        const allTriggerElements = Array.from(this.statesByElement.keys());
        /** @type {?} */
        const enterNodeMap = buildRootMap(allTriggerElements, this.collectedEnterElements);
        /** @type {?} */
        const enterNodeMapIds = new Map();
        /** @type {?} */
        let i = 0;
        enterNodeMap.forEach((nodes, root) => {
            /** @type {?} */
            const className = ENTER_CLASSNAME + i++;
            enterNodeMapIds.set(root, className);
            nodes.forEach(node => addClass(node, className));
        });
        /** @type {?} */
        const allLeaveNodes = [];
        /** @type {?} */
        const mergedLeaveNodes = new Set();
        /** @type {?} */
        const leaveNodesWithoutAnimations = new Set();
        for (let i = 0; i < this.collectedLeaveElements.length; i++) {
            /** @type {?} */
            const element = this.collectedLeaveElements[i];
            /** @type {?} */
            const details = /** @type {?} */ (element[REMOVAL_FLAG]);
            if (details && details.setForRemoval) {
                allLeaveNodes.push(element);
                mergedLeaveNodes.add(element);
                if (details.hasAnimation) {
                    this.driver.query(element, STAR_SELECTOR, true).forEach(elm => mergedLeaveNodes.add(elm));
                }
                else {
                    leaveNodesWithoutAnimations.add(element);
                }
            }
        }
        /** @type {?} */
        const leaveNodeMapIds = new Map();
        /** @type {?} */
        const leaveNodeMap = buildRootMap(allTriggerElements, Array.from(mergedLeaveNodes));
        leaveNodeMap.forEach((nodes, root) => {
            /** @type {?} */
            const className = LEAVE_CLASSNAME + i++;
            leaveNodeMapIds.set(root, className);
            nodes.forEach(node => addClass(node, className));
        });
        cleanupFns.push(() => {
            enterNodeMap.forEach((nodes, root) => {
                /** @type {?} */
                const className = /** @type {?} */ ((enterNodeMapIds.get(root)));
                nodes.forEach(node => removeClass(node, className));
            });
            leaveNodeMap.forEach((nodes, root) => {
                /** @type {?} */
                const className = /** @type {?} */ ((leaveNodeMapIds.get(root)));
                nodes.forEach(node => removeClass(node, className));
            });
            allLeaveNodes.forEach(element => { this.processLeaveNode(element); });
        });
        /** @type {?} */
        const allPlayers = [];
        /** @type {?} */
        const erroneousTransitions = [];
        for (let i = this._namespaceList.length - 1; i >= 0; i--) {
            /** @type {?} */
            const ns = this._namespaceList[i];
            ns.drainQueuedTransitions(microtaskId).forEach(entry => {
                /** @type {?} */
                const player = entry.player;
                /** @type {?} */
                const element = entry.element;
                allPlayers.push(player);
                if (this.collectedEnterElements.length) {
                    /** @type {?} */
                    const details = /** @type {?} */ (element[REMOVAL_FLAG]);
                    // move animations are currently not supported...
                    if (details && details.setForMove) {
                        player.destroy();
                        return;
                    }
                }
                /** @type {?} */
                const nodeIsOrphaned = !bodyNode || !this.driver.containsElement(bodyNode, element);
                /** @type {?} */
                const leaveClassName = /** @type {?} */ ((leaveNodeMapIds.get(element)));
                /** @type {?} */
                const enterClassName = /** @type {?} */ ((enterNodeMapIds.get(element)));
                /** @type {?} */
                const instruction = /** @type {?} */ ((this._buildInstruction(entry, subTimelines, enterClassName, leaveClassName, nodeIsOrphaned)));
                if (instruction.errors && instruction.errors.length) {
                    erroneousTransitions.push(instruction);
                    return;
                }
                // even though the element may not be apart of the DOM, it may
                // still be added at a later point (due to the mechanics of content
                // projection and/or dynamic component insertion) therefore it's
                // important we still style the element.
                if (nodeIsOrphaned) {
                    player.onStart(() => eraseStyles(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }
                // if a unmatched transition is queued to go then it SHOULD NOT render
                // an animation and cancel the previously running animations.
                if (entry.isFallbackTransition) {
                    player.onStart(() => eraseStyles(element, instruction.fromStyles));
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    skippedPlayers.push(player);
                    return;
                }
                // this means that if a parent animation uses this animation as a sub trigger
                // then it will instruct the timeline builder to not add a player delay, but
                // instead stretch the first keyframe gap up until the animation starts. The
                // reason this is important is to prevent extra initialization styles from being
                // required by the user in the animation.
                instruction.timelines.forEach(tl => tl.stretchStartingKeyframe = true);
                subTimelines.append(element, instruction.timelines);
                /** @type {?} */
                const tuple = { instruction, player, element };
                queuedInstructions.push(tuple);
                instruction.queriedElements.forEach(element => getOrSetAsInMap(queriedElements, element, []).push(player));
                instruction.preStyleProps.forEach((stringMap, element) => {
                    /** @type {?} */
                    const props = Object.keys(stringMap);
                    if (props.length) {
                        /** @type {?} */
                        let setVal = /** @type {?} */ ((allPreStyleElements.get(element)));
                        if (!setVal) {
                            allPreStyleElements.set(element, setVal = new Set());
                        }
                        props.forEach(prop => setVal.add(prop));
                    }
                });
                instruction.postStyleProps.forEach((stringMap, element) => {
                    /** @type {?} */
                    const props = Object.keys(stringMap);
                    /** @type {?} */
                    let setVal = /** @type {?} */ ((allPostStyleElements.get(element)));
                    if (!setVal) {
                        allPostStyleElements.set(element, setVal = new Set());
                    }
                    props.forEach(prop => setVal.add(prop));
                });
            });
        }
        if (erroneousTransitions.length) {
            /** @type {?} */
            const errors = [];
            erroneousTransitions.forEach(instruction => {
                errors.push(`@${instruction.triggerName} has failed due to:\n`); /** @type {?} */
                ((instruction.errors)).forEach(error => errors.push(`- ${error}\n`));
            });
            allPlayers.forEach(player => player.destroy());
            this.reportError(errors);
        }
        /** @type {?} */
        const allPreviousPlayersMap = new Map();
        /** @type {?} */
        const animationElementMap = new Map();
        queuedInstructions.forEach(entry => {
            /** @type {?} */
            const element = entry.element;
            if (subTimelines.has(element)) {
                animationElementMap.set(element, element);
                this._beforeAnimationBuild(entry.player.namespaceId, entry.instruction, allPreviousPlayersMap);
            }
        });
        skippedPlayers.forEach(player => {
            /** @type {?} */
            const element = player.element;
            /** @type {?} */
            const previousPlayers = this._getPreviousPlayers(element, false, player.namespaceId, player.triggerName, null);
            previousPlayers.forEach(prevPlayer => {
                getOrSetAsInMap(allPreviousPlayersMap, element, []).push(prevPlayer);
                prevPlayer.destroy();
            });
        });
        /** @type {?} */
        const replaceNodes = allLeaveNodes.filter(node => {
            return replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements);
        });
        /** @type {?} */
        const postStylesMap = new Map();
        /** @type {?} */
        const allLeaveQueriedNodes = cloakAndComputeStyles(postStylesMap, this.driver, leaveNodesWithoutAnimations, allPostStyleElements, AUTO_STYLE);
        allLeaveQueriedNodes.forEach(node => {
            if (replacePostStylesAsPre(node, allPreStyleElements, allPostStyleElements)) {
                replaceNodes.push(node);
            }
        });
        /** @type {?} */
        const preStylesMap = new Map();
        enterNodeMap.forEach((nodes, root) => {
            cloakAndComputeStyles(preStylesMap, this.driver, new Set(nodes), allPreStyleElements, PRE_STYLE);
        });
        replaceNodes.forEach(node => {
            /** @type {?} */
            const post = postStylesMap.get(node);
            /** @type {?} */
            const pre = preStylesMap.get(node);
            postStylesMap.set(node, /** @type {?} */ (Object.assign({}, post, pre)));
        });
        /** @type {?} */
        const rootPlayers = [];
        /** @type {?} */
        const subPlayers = [];
        /** @type {?} */
        const NO_PARENT_ANIMATION_ELEMENT_DETECTED = {};
        queuedInstructions.forEach(entry => {
            const { element, player, instruction } = entry;
            // this means that it was never consumed by a parent animation which
            // means that it is independent and therefore should be set for animation
            if (subTimelines.has(element)) {
                if (disabledElementsSet.has(element)) {
                    player.onDestroy(() => setStyles(element, instruction.toStyles));
                    player.disabled = true;
                    player.overrideTotalTime(instruction.totalTime);
                    skippedPlayers.push(player);
                    return;
                }
                /** @type {?} */
                let parentWithAnimation = NO_PARENT_ANIMATION_ELEMENT_DETECTED;
                if (animationElementMap.size > 1) {
                    /** @type {?} */
                    let elm = element;
                    /** @type {?} */
                    const parentsToAdd = [];
                    while (elm = elm.parentNode) {
                        /** @type {?} */
                        const detectedParent = animationElementMap.get(elm);
                        if (detectedParent) {
                            parentWithAnimation = detectedParent;
                            break;
                        }
                        parentsToAdd.push(elm);
                    }
                    parentsToAdd.forEach(parent => animationElementMap.set(parent, parentWithAnimation));
                }
                /** @type {?} */
                const innerPlayer = this._buildAnimation(player.namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap);
                player.setRealPlayer(innerPlayer);
                if (parentWithAnimation === NO_PARENT_ANIMATION_ELEMENT_DETECTED) {
                    rootPlayers.push(player);
                }
                else {
                    /** @type {?} */
                    const parentPlayers = this.playersByElement.get(parentWithAnimation);
                    if (parentPlayers && parentPlayers.length) {
                        player.parentPlayer = optimizeGroupPlayer(parentPlayers);
                    }
                    skippedPlayers.push(player);
                }
            }
            else {
                eraseStyles(element, instruction.fromStyles);
                player.onDestroy(() => setStyles(element, instruction.toStyles));
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
        subPlayers.forEach(player => {
            /** @type {?} */
            const playersForElement = skippedPlayersMap.get(player.element);
            if (playersForElement && playersForElement.length) {
                /** @type {?} */
                const innerPlayer = optimizeGroupPlayer(playersForElement);
                player.setRealPlayer(innerPlayer);
            }
        });
        // the reason why we don't actually play the animation is
        // because all that a skipped player is designed to do is to
        // fire the start/done transition callback events
        skippedPlayers.forEach(player => {
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
        for (let i = 0; i < allLeaveNodes.length; i++) {
            /** @type {?} */
            const element = allLeaveNodes[i];
            /** @type {?} */
            const details = /** @type {?} */ (element[REMOVAL_FLAG]);
            removeClass(element, LEAVE_CLASSNAME);
            // this means the element has a removal animation that is being
            // taken care of and therefore the inner elements will hang around
            // until that animation is over (or the parent queried animation)
            if (details && details.hasAnimation)
                continue;
            /** @type {?} */
            let players = [];
            // if this element is queried or if it contains queried children
            // then we want for the element not to be removed from the page
            // until the queried animations have finished
            if (queriedElements.size) {
                /** @type {?} */
                let queriedPlayerResults = queriedElements.get(element);
                if (queriedPlayerResults && queriedPlayerResults.length) {
                    players.push(...queriedPlayerResults);
                }
                /** @type {?} */
                let queriedInnerElements = this.driver.query(element, NG_ANIMATING_SELECTOR, true);
                for (let j = 0; j < queriedInnerElements.length; j++) {
                    /** @type {?} */
                    let queriedPlayers = queriedElements.get(queriedInnerElements[j]);
                    if (queriedPlayers && queriedPlayers.length) {
                        players.push(...queriedPlayers);
                    }
                }
            }
            /** @type {?} */
            const activePlayers = players.filter(p => !p.destroyed);
            if (activePlayers.length) {
                removeNodesAfterAnimationDone(this, element, activePlayers);
            }
            else {
                this.processLeaveNode(element);
            }
        }
        // this is required so the cleanup method doesn't remove them
        allLeaveNodes.length = 0;
        rootPlayers.forEach(player => {
            this.players.push(player);
            player.onDone(() => {
                player.destroy();
                /** @type {?} */
                const index = this.players.indexOf(player);
                this.players.splice(index, 1);
            });
            player.play();
        });
        return rootPlayers;
    }
    /**
     * @param {?} namespaceId
     * @param {?} element
     * @return {?}
     */
    elementContainsData(namespaceId, element) {
        /** @type {?} */
        let containsData = false;
        /** @type {?} */
        const details = /** @type {?} */ (element[REMOVAL_FLAG]);
        if (details && details.setForRemoval)
            containsData = true;
        if (this.playersByElement.has(element))
            containsData = true;
        if (this.playersByQueriedElement.has(element))
            containsData = true;
        if (this.statesByElement.has(element))
            containsData = true;
        return this._fetchNamespace(namespaceId).elementContainsData(element) || containsData;
    }
    /**
     * @param {?} callback
     * @return {?}
     */
    afterFlush(callback) { this._flushFns.push(callback); }
    /**
     * @param {?} callback
     * @return {?}
     */
    afterFlushAnimationsDone(callback) { this._whenQuietFns.push(callback); }
    /**
     * @param {?} element
     * @param {?} isQueriedElement
     * @param {?=} namespaceId
     * @param {?=} triggerName
     * @param {?=} toStateValue
     * @return {?}
     */
    _getPreviousPlayers(element, isQueriedElement, namespaceId, triggerName, toStateValue) {
        /** @type {?} */
        let players = [];
        if (isQueriedElement) {
            /** @type {?} */
            const queriedElementPlayers = this.playersByQueriedElement.get(element);
            if (queriedElementPlayers) {
                players = queriedElementPlayers;
            }
        }
        else {
            /** @type {?} */
            const elementPlayers = this.playersByElement.get(element);
            if (elementPlayers) {
                /** @type {?} */
                const isRemovalAnimation = !toStateValue || toStateValue == VOID_VALUE;
                elementPlayers.forEach(player => {
                    if (player.queued)
                        return;
                    if (!isRemovalAnimation && player.triggerName != triggerName)
                        return;
                    players.push(player);
                });
            }
        }
        if (namespaceId || triggerName) {
            players = players.filter(player => {
                if (namespaceId && namespaceId != player.namespaceId)
                    return false;
                if (triggerName && triggerName != player.triggerName)
                    return false;
                return true;
            });
        }
        return players;
    }
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @return {?}
     */
    _beforeAnimationBuild(namespaceId, instruction, allPreviousPlayersMap) {
        /** @type {?} */
        const triggerName = instruction.triggerName;
        /** @type {?} */
        const rootElement = instruction.element;
        /** @type {?} */
        const targetNameSpaceId = instruction.isRemovalTransition ? undefined : namespaceId;
        /** @type {?} */
        const targetTriggerName = instruction.isRemovalTransition ? undefined : triggerName;
        for (const timelineInstruction of instruction.timelines) {
            /** @type {?} */
            const element = timelineInstruction.element;
            /** @type {?} */
            const isQueriedElement = element !== rootElement;
            /** @type {?} */
            const players = getOrSetAsInMap(allPreviousPlayersMap, element, []);
            /** @type {?} */
            const previousPlayers = this._getPreviousPlayers(element, isQueriedElement, targetNameSpaceId, targetTriggerName, instruction.toState);
            previousPlayers.forEach(player => {
                /** @type {?} */
                const realPlayer = /** @type {?} */ (player.getRealPlayer());
                if (realPlayer.beforeDestroy) {
                    realPlayer.beforeDestroy();
                }
                player.destroy();
                players.push(player);
            });
        }
        // this needs to be done so that the PRE/POST styles can be
        // computed properly without interfering with the previous animation
        eraseStyles(rootElement, instruction.fromStyles);
    }
    /**
     * @param {?} namespaceId
     * @param {?} instruction
     * @param {?} allPreviousPlayersMap
     * @param {?} skippedPlayersMap
     * @param {?} preStylesMap
     * @param {?} postStylesMap
     * @return {?}
     */
    _buildAnimation(namespaceId, instruction, allPreviousPlayersMap, skippedPlayersMap, preStylesMap, postStylesMap) {
        /** @type {?} */
        const triggerName = instruction.triggerName;
        /** @type {?} */
        const rootElement = instruction.element;
        /** @type {?} */
        const allQueriedPlayers = [];
        /** @type {?} */
        const allConsumedElements = new Set();
        /** @type {?} */
        const allSubElements = new Set();
        /** @type {?} */
        const allNewPlayers = instruction.timelines.map(timelineInstruction => {
            /** @type {?} */
            const element = timelineInstruction.element;
            allConsumedElements.add(element);
            /** @type {?} */
            const details = element[REMOVAL_FLAG];
            if (details && details.removedBeforeQueried)
                return new NoopAnimationPlayer(timelineInstruction.duration, timelineInstruction.delay);
            /** @type {?} */
            const isQueriedElement = element !== rootElement;
            /** @type {?} */
            const previousPlayers = flattenGroupPlayers((allPreviousPlayersMap.get(element) || EMPTY_PLAYER_ARRAY)
                .map(p => p.getRealPlayer()))
                .filter(p => {
                /** @type {?} */
                const pp = /** @type {?} */ (p);
                return pp.element ? pp.element === element : false;
            });
            /** @type {?} */
            const preStyles = preStylesMap.get(element);
            /** @type {?} */
            const postStyles = postStylesMap.get(element);
            /** @type {?} */
            const keyframes = normalizeKeyframes(this.driver, this._normalizer, element, timelineInstruction.keyframes, preStyles, postStyles);
            /** @type {?} */
            const player = this._buildPlayer(timelineInstruction, keyframes, previousPlayers);
            // this means that this particular player belongs to a sub trigger. It is
            // important that we match this player up with the corresponding (@trigger.listener)
            if (timelineInstruction.subTimeline && skippedPlayersMap) {
                allSubElements.add(element);
            }
            if (isQueriedElement) {
                /** @type {?} */
                const wrappedPlayer = new TransitionAnimationPlayer(namespaceId, triggerName, element);
                wrappedPlayer.setRealPlayer(player);
                allQueriedPlayers.push(wrappedPlayer);
            }
            return player;
        });
        allQueriedPlayers.forEach(player => {
            getOrSetAsInMap(this.playersByQueriedElement, player.element, []).push(player);
            player.onDone(() => deleteOrUnsetInMap(this.playersByQueriedElement, player.element, player));
        });
        allConsumedElements.forEach(element => addClass(element, NG_ANIMATING_CLASSNAME));
        /** @type {?} */
        const player = optimizeGroupPlayer(allNewPlayers);
        player.onDestroy(() => {
            allConsumedElements.forEach(element => removeClass(element, NG_ANIMATING_CLASSNAME));
            setStyles(rootElement, instruction.toStyles);
        });
        // this basically makes all of the callbacks for sub element animations
        // be dependent on the upper players for when they finish
        allSubElements.forEach(element => { getOrSetAsInMap(skippedPlayersMap, element, []).push(player); });
        return player;
    }
    /**
     * @param {?} instruction
     * @param {?} keyframes
     * @param {?} previousPlayers
     * @return {?}
     */
    _buildPlayer(instruction, keyframes, previousPlayers) {
        if (keyframes.length > 0) {
            return this.driver.animate(instruction.element, keyframes, instruction.duration, instruction.delay, instruction.easing, previousPlayers);
        }
        // special case for when an empty transition|definition is provided
        // ... there is no point in rendering an empty animation
        return new NoopAnimationPlayer(instruction.duration, instruction.delay);
    }
}
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
export class TransitionAnimationPlayer {
    /**
     * @param {?} namespaceId
     * @param {?} triggerName
     * @param {?} element
     */
    constructor(namespaceId, triggerName, element) {
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
    setRealPlayer(player) {
        if (this._containsRealPlayer)
            return;
        this._player = player;
        Object.keys(this._queuedCallbacks).forEach(phase => {
            this._queuedCallbacks[phase].forEach(callback => listenOnPlayer(player, phase, undefined, callback));
        });
        this._queuedCallbacks = {};
        this._containsRealPlayer = true;
        this.overrideTotalTime(player.totalTime);
        (/** @type {?} */ (this)).queued = false;
    }
    /**
     * @return {?}
     */
    getRealPlayer() { return this._player; }
    /**
     * @param {?} totalTime
     * @return {?}
     */
    overrideTotalTime(totalTime) { (/** @type {?} */ (this)).totalTime = totalTime; }
    /**
     * @param {?} player
     * @return {?}
     */
    syncPlayerEvents(player) {
        /** @type {?} */
        const p = /** @type {?} */ (this._player);
        if (p.triggerCallback) {
            player.onStart(() => /** @type {?} */ ((p.triggerCallback))('start'));
        }
        player.onDone(() => this.finish());
        player.onDestroy(() => this.destroy());
    }
    /**
     * @param {?} name
     * @param {?} callback
     * @return {?}
     */
    _queueEvent(name, callback) {
        getOrSetAsInMap(this._queuedCallbacks, name, []).push(callback);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDone(fn) {
        if (this.queued) {
            this._queueEvent('done', fn);
        }
        this._player.onDone(fn);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onStart(fn) {
        if (this.queued) {
            this._queueEvent('start', fn);
        }
        this._player.onStart(fn);
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    onDestroy(fn) {
        if (this.queued) {
            this._queueEvent('destroy', fn);
        }
        this._player.onDestroy(fn);
    }
    /**
     * @return {?}
     */
    init() { this._player.init(); }
    /**
     * @return {?}
     */
    hasStarted() { return this.queued ? false : this._player.hasStarted(); }
    /**
     * @return {?}
     */
    play() { !this.queued && this._player.play(); }
    /**
     * @return {?}
     */
    pause() { !this.queued && this._player.pause(); }
    /**
     * @return {?}
     */
    restart() { !this.queued && this._player.restart(); }
    /**
     * @return {?}
     */
    finish() { this._player.finish(); }
    /**
     * @return {?}
     */
    destroy() {
        (/** @type {?} */ (this)).destroyed = true;
        this._player.destroy();
    }
    /**
     * @return {?}
     */
    reset() { !this.queued && this._player.reset(); }
    /**
     * @param {?} p
     * @return {?}
     */
    setPosition(p) {
        if (!this.queued) {
            this._player.setPosition(p);
        }
    }
    /**
     * @return {?}
     */
    getPosition() { return this.queued ? 0 : this._player.getPosition(); }
    /**
     * \@internal
     * @param {?} phaseName
     * @return {?}
     */
    triggerCallback(phaseName) {
        /** @type {?} */
        const p = /** @type {?} */ (this._player);
        if (p.triggerCallback) {
            p.triggerCallback(phaseName);
        }
    }
}
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
    let currentValues;
    if (map instanceof Map) {
        currentValues = map.get(key);
        if (currentValues) {
            if (currentValues.length) {
                /** @type {?} */
                const index = currentValues.indexOf(value);
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
                const index = currentValues.indexOf(value);
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
    const oldValue = element.style.display;
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
    const cloakVals = [];
    elements.forEach(element => cloakVals.push(cloakElement(element)));
    /** @type {?} */
    const failedElements = [];
    elementPropsMap.forEach((props, element) => {
        /** @type {?} */
        const styles = {};
        props.forEach(prop => {
            /** @type {?} */
            const value = styles[prop] = driver.computeStyle(element, prop, defaultStyle);
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
    let i = 0;
    elements.forEach(element => cloakElement(element, cloakVals[i++]));
    return failedElements;
}
/**
 * @param {?} roots
 * @param {?} nodes
 * @return {?}
 */
function buildRootMap(roots, nodes) {
    /** @type {?} */
    const rootMap = new Map();
    roots.forEach(root => rootMap.set(root, []));
    if (nodes.length == 0)
        return rootMap;
    /** @type {?} */
    const NULL_NODE = 1;
    /** @type {?} */
    const nodeSet = new Set(nodes);
    /** @type {?} */
    const localRootMap = new Map();
    /**
     * @param {?} node
     * @return {?}
     */
    function getRoot(node) {
        if (!node)
            return NULL_NODE;
        /** @type {?} */
        let root = localRootMap.get(node);
        if (root)
            return root;
        /** @type {?} */
        const parent = node.parentNode;
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
    nodes.forEach(node => {
        /** @type {?} */
        const root = getRoot(node);
        if (root !== NULL_NODE) {
            /** @type {?} */ ((rootMap.get(root))).push(node);
        }
    });
    return rootMap;
}
/** @type {?} */
const CLASSES_CACHE_KEY = '$$classes';
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
        const classes = element[CLASSES_CACHE_KEY];
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
        let classes = element[CLASSES_CACHE_KEY];
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
        let classes = element[CLASSES_CACHE_KEY];
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
    optimizeGroupPlayer(players).onDone(() => engine.processLeaveNode(element));
}
/**
 * @param {?} players
 * @return {?}
 */
function flattenGroupPlayers(players) {
    /** @type {?} */
    const finalPlayers = [];
    _flattenGroupPlayersRecur(players, finalPlayers);
    return finalPlayers;
}
/**
 * @param {?} players
 * @param {?} finalPlayers
 * @return {?}
 */
function _flattenGroupPlayersRecur(players, finalPlayers) {
    for (let i = 0; i < players.length; i++) {
        /** @type {?} */
        const player = players[i];
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
    const k1 = Object.keys(a);
    /** @type {?} */
    const k2 = Object.keys(b);
    if (k1.length != k2.length)
        return false;
    for (let i = 0; i < k1.length; i++) {
        /** @type {?} */
        const prop = k1[i];
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
    const postEntry = allPostStyleElements.get(element);
    if (!postEntry)
        return false;
    /** @type {?} */
    let preEntry = allPreStyleElements.get(element);
    if (preEntry) {
        postEntry.forEach(data => /** @type {?} */ ((preEntry)).add(data));
    }
    else {
        allPreStyleElements.set(element, postEntry);
    }
    allPostStyleElements.delete(element);
    return true;
}
//# sourceMappingURL=transition_animation_engine.js.map