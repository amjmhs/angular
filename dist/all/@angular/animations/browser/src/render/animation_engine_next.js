"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animation_ast_builder_1 = require("../dsl/animation_ast_builder");
var animation_trigger_1 = require("../dsl/animation_trigger");
var shared_1 = require("./shared");
var timeline_animation_engine_1 = require("./timeline_animation_engine");
var transition_animation_engine_1 = require("./transition_animation_engine");
var AnimationEngine = /** @class */ (function () {
    function AnimationEngine(bodyNode, _driver, normalizer) {
        var _this = this;
        this.bodyNode = bodyNode;
        this._driver = _driver;
        this._triggerCache = {};
        // this method is designed to be overridden by the code that uses this engine
        this.onRemovalComplete = function (element, context) { };
        this._transitionEngine = new transition_animation_engine_1.TransitionAnimationEngine(bodyNode, _driver, normalizer);
        this._timelineEngine = new timeline_animation_engine_1.TimelineAnimationEngine(bodyNode, _driver, normalizer);
        this._transitionEngine.onRemovalComplete = function (element, context) {
            return _this.onRemovalComplete(element, context);
        };
    }
    AnimationEngine.prototype.registerTrigger = function (componentId, namespaceId, hostElement, name, metadata) {
        var cacheKey = componentId + '-' + name;
        var trigger = this._triggerCache[cacheKey];
        if (!trigger) {
            var errors = [];
            var ast = animation_ast_builder_1.buildAnimationAst(this._driver, metadata, errors);
            if (errors.length) {
                throw new Error("The animation trigger \"" + name + "\" has failed to build due to the following errors:\n - " + errors.join("\n - "));
            }
            trigger = animation_trigger_1.buildTrigger(name, ast);
            this._triggerCache[cacheKey] = trigger;
        }
        this._transitionEngine.registerTrigger(namespaceId, name, trigger);
    };
    AnimationEngine.prototype.register = function (namespaceId, hostElement) {
        this._transitionEngine.register(namespaceId, hostElement);
    };
    AnimationEngine.prototype.destroy = function (namespaceId, context) {
        this._transitionEngine.destroy(namespaceId, context);
    };
    AnimationEngine.prototype.onInsert = function (namespaceId, element, parent, insertBefore) {
        this._transitionEngine.insertNode(namespaceId, element, parent, insertBefore);
    };
    AnimationEngine.prototype.onRemove = function (namespaceId, element, context) {
        this._transitionEngine.removeNode(namespaceId, element, context);
    };
    AnimationEngine.prototype.disableAnimations = function (element, disable) {
        this._transitionEngine.markElementAsDisabled(element, disable);
    };
    AnimationEngine.prototype.process = function (namespaceId, element, property, value) {
        if (property.charAt(0) == '@') {
            var _a = shared_1.parseTimelineCommand(property), id = _a[0], action = _a[1];
            var args = value;
            this._timelineEngine.command(id, element, action, args);
        }
        else {
            this._transitionEngine.trigger(namespaceId, element, property, value);
        }
    };
    AnimationEngine.prototype.listen = function (namespaceId, element, eventName, eventPhase, callback) {
        // @@listen
        if (eventName.charAt(0) == '@') {
            var _a = shared_1.parseTimelineCommand(eventName), id = _a[0], action = _a[1];
            return this._timelineEngine.listen(id, element, action, callback);
        }
        return this._transitionEngine.listen(namespaceId, element, eventName, eventPhase, callback);
    };
    AnimationEngine.prototype.flush = function (microtaskId) {
        if (microtaskId === void 0) { microtaskId = -1; }
        this._transitionEngine.flush(microtaskId);
    };
    Object.defineProperty(AnimationEngine.prototype, "players", {
        get: function () {
            return this._transitionEngine.players
                .concat(this._timelineEngine.players);
        },
        enumerable: true,
        configurable: true
    });
    AnimationEngine.prototype.whenRenderingDone = function () { return this._transitionEngine.whenRenderingDone(); };
    return AnimationEngine;
}());
exports.AnimationEngine = AnimationEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2VuZ2luZV9uZXh0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9yZW5kZXIvYW5pbWF0aW9uX2VuZ2luZV9uZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBU0Esc0VBQStEO0FBQy9ELDhEQUF3RTtBQUl4RSxtQ0FBOEM7QUFDOUMseUVBQW9FO0FBQ3BFLDZFQUF3RTtBQUV4RTtJQVNFLHlCQUNZLFFBQWEsRUFBVSxPQUF3QixFQUN2RCxVQUFvQztRQUZ4QyxpQkFRQztRQVBXLGFBQVEsR0FBUixRQUFRLENBQUs7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtRQU5uRCxrQkFBYSxHQUFzQyxFQUFFLENBQUM7UUFFOUQsNkVBQTZFO1FBQ3RFLHNCQUFpQixHQUFHLFVBQUMsT0FBWSxFQUFFLE9BQVksSUFBTSxDQUFDLENBQUM7UUFLNUQsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksdURBQXlCLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUN0RixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksbURBQXVCLENBQUMsUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVsRixJQUFJLENBQUMsaUJBQWlCLENBQUMsaUJBQWlCLEdBQUcsVUFBQyxPQUFZLEVBQUUsT0FBWTtZQUNsRSxPQUFBLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO1FBQXhDLENBQXdDLENBQUM7SUFDL0MsQ0FBQztJQUVELHlDQUFlLEdBQWYsVUFDSSxXQUFtQixFQUFFLFdBQW1CLEVBQUUsV0FBZ0IsRUFBRSxJQUFZLEVBQ3hFLFFBQWtDO1FBQ3BDLElBQU0sUUFBUSxHQUFHLFdBQVcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO1FBQzFDLElBQUksT0FBTyxHQUFHLElBQUks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