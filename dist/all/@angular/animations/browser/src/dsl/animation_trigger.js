"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var animation_transition_factory_1 = require("./animation_transition_factory");
/**
 * @experimental Animation support is experimental.
 */
function buildTrigger(name, ast) {
    return new AnimationTrigger(name, ast);
}
exports.buildTrigger = buildTrigger;
/**
* @experimental Animation support is experimental.
*/
var AnimationTrigger = /** @class */ (function () {
    function AnimationTrigger(name, ast) {
        var _this = this;
        this.name = name;
        this.ast = ast;
        this.transitionFactories = [];
        this.states = {};
        ast.states.forEach(function (ast) {
            var defaultParams = (ast.options && ast.options.params) || {};
            _this.states[ast.name] = new animation_transition_factory_1.AnimationStateStyles(ast.style, defaultParams);
        });
        balanceProperties(this.states, 'true', '1');
        balanceProperties(this.states, 'false', '0');
        ast.transitions.forEach(function (ast) {
            _this.transitionFactories.push(new animation_transition_factory_1.AnimationTransitionFactory(name, ast, _this.states));
        });
        this.fallbackTransition = createFallbackTransition(name, this.states);
    }
    Object.defineProperty(AnimationTrigger.prototype, "containsQueries", {
        get: function () { return this.ast.queryCount > 0; },
        enumerable: true,
        configurable: true
    });
    AnimationTrigger.prototype.matchTransition = function (currentState, nextState, element, params) {
        var entry = this.transitionFactories.find(function (f) { return f.match(currentState, nextState, element, params); });
        return entry || null;
    };
    AnimationTrigger.prototype.matchStyles = function (currentState, params, errors) {
        return this.fallbackTransition.buildStyles(currentState, params, errors);
    };
    return AnimationTrigger;
}());
exports.AnimationTrigger = AnimationTrigger;
function createFallbackTransition(triggerName, states) {
    var matchers = [function (fromState, toState) { return true; }];
    var animation = { type: 2 /* Sequence */, steps: [], options: null };
    var transition = {
        type: 1 /* Transition */,
        animation: animation,
        matchers: matchers,
        options: null,
        queryCount: 0,
        depCount: 0
    };
    return new animation_transition_factory_1.AnimationTransitionFactory(triggerName, transition, states);
}
function balanceProperties(obj, key1, key2) {
    if (obj.hasOwnProperty(key1)) {
        if (!obj.hasOwnProperty(key2)) {
            obj[key2] = obj[key1];
        }
    }
    else if (obj.hasOwnProperty(key2)) {
        obj[key1] = obj[key2];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyaWdnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9hbmltYXRpb25fdHJpZ2dlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVlBLCtFQUFnRztBQUloRzs7R0FFRztBQUNILHNCQUE2QixJQUFZLEVBQUUsR0FBZTtJQUN4RCxPQUFPLElBQUksZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLENBQUM7QUFGRCxvQ0FFQztBQUVEOztFQUVFO0FBQ0Y7SUFLRSwwQkFBbUIsSUFBWSxFQUFTLEdBQWU7UUFBdkQsaUJBY0M7UUFka0IsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQVk7UUFKaEQsd0JBQW1CLEdBQWlDLEVBQUUsQ0FBQztRQUV2RCxXQUFNLEdBQWdELEVBQUUsQ0FBQztRQUc5RCxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFBLEdBQUc7WUFDcEIsSUFBTSxhQUFhLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2hFLEtBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksbURBQW9CLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM3RSxDQUFDLENBQUMsQ0FBQztRQUVILGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzVDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRTdDLEdBQUcsQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLFVBQUEsR0FBRztZQUN6QixLQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUkseURBQTBCLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUN4RixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxrQkFBa0IsR0FBRyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFRCxzQkFBSSw2Q0FBZTthQUFuQixjQUF3QixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBRXpELDBDQUFlLEdBQWYsVUFBZ0IsWUFBaUIsRUFBRSxTQUFjLEVBQUUsT0FBWSxFQUFFLE1BQTRCO1FBRTNGLElBQU0sS0FBSyxHQUNQLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxFQUFqRCxDQUFpRCxDQUFDLENBQUM7UUFDMUYsT0FBTyxLQUFLLElBQUksSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxzQ0FBVyxHQUFYLFVBQVksWUFBaUIsRUFBRSxNQUE0QixFQUFFLE1BQWE7UUFDeEUsT0FBTyxJQUFJLENBQUMsa0JBQWtCLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQWpDRCxJQWlDQztBQWpDWSw0Q0FBZ0I7QUFtQzdCLGtDQUNJLFdBQW1CLEVBQ25CLE1BQW1EO0lBQ3JELElBQU0sUUFBUSxHQUFHLENBQUMsVUFBQyxTQUFjLEVBQUUsT0FBWSxJQUFLLE9BQUEsSUFBSSxFQUFKLENBQUksQ0FBQyxDQUFDO0lBQzFELElBQU0sU0FBUyxHQUFnQixFQUFDLElBQUksa0JBQWdDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFDLENBQUM7SUFDaEcsSUFBTSxVQUFVLEdBQWtCO1FBQ2hDLElBQUksb0JBQWtDO1FBQ3RDLFNBQVMsV0FBQTtRQUNULFFBQVEsVUFBQTtRQUNSLE9BQU8sRUFBRSxJQUFJO1FBQ2IsVUFBVSxFQUFFLENBQUM7UUFDYixRQUFRLEVBQUUsQ0FBQztLQUNaLENBQUM7SUFDRixPQUFPLElBQUkseURBQTBCLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQsMkJBQTJCLEdBQXlCLEVBQUUsSUFBWSxFQUFFLElBQVk7SUFDOUUsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7S0FDRjtTQUFNLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3ZCO0FBQ0gsQ0FBQyJ9