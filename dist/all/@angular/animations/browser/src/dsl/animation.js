"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var animation_ast_builder_1 = require("./animation_ast_builder");
var animation_timeline_builder_1 = require("./animation_timeline_builder");
var element_instruction_map_1 = require("./element_instruction_map");
var Animation = /** @class */ (function () {
    function Animation(_driver, input) {
        this._driver = _driver;
        var errors = [];
        var ast = animation_ast_builder_1.buildAnimationAst(_driver, input, errors);
        if (errors.length) {
            var errorMessage = "animation validation failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        this._animationAst = ast;
    }
    Animation.prototype.buildTimelines = function (element, startingStyles, destinationStyles, options, subInstructions) {
        var start = Array.isArray(startingStyles) ? util_1.normalizeStyles(startingStyles) :
            startingStyles;
        var dest = Array.isArray(destinationStyles) ? util_1.normalizeStyles(destinationStyles) :
            destinationStyles;
        var errors = [];
        subInstructions = subInstructions || new element_instruction_map_1.ElementInstructionMap();
        var result = animation_timeline_builder_1.buildAnimationTimelines(this._driver, element, this._animationAst, util_1.ENTER_CLASSNAME, util_1.LEAVE_CLASSNAME, start, dest, options, subInstructions, errors);
        if (errors.length) {
            var errorMessage = "animation building failed:\n" + errors.join("\n");
            throw new Error(errorMessage);
        }
        return result;
    };
    return Animation;
}());
exports.Animation = Animation;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3NyYy9kc2wvYW5pbWF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBVUEsZ0NBQTBFO0FBRzFFLGlFQUEwRDtBQUMxRCwyRUFBcUU7QUFFckUscUVBQWdFO0FBRWhFO0lBRUUsbUJBQW9CLE9BQXdCLEVBQUUsS0FBNEM7UUFBdEUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDMUMsSUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLHlDQUFpQixDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdEQsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1lBQ2pCLElBQU0sWUFBWSxHQUFHLG1DQUFpQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRyxDQUFDO1lBQzFFLE1BQU0sSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDL0I7UUFDRCxJQUFJLENBQUMsYUFBYSxHQUFHLEdBQUcsQ0FBQztJQUMzQixDQUFDO0lBRUQsa0NBQWMsR0FBZCxVQUNJLE9BQVksRUFBRSxjQUF1QyxFQUNyRCxpQkFBMEMsRUFBRSxPQUF5QixFQUNyRSxlQUF1QztRQUN6QyxJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxzQkFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDckIsY0FBYyxDQUFDO1FBQ3pFLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUMsc0JBQWUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7WUFDeEIsaUJBQWlCLENBQUM7UUFDOUUsSUFBTSxNQUFNLEdBQVEsRUFBRSxDQUFDO1FBQ3ZCLGVBQWUsR0FBRyxlQUFlLElBQUksSUFBSSwrQ0FBcUIsRUFBRSxDQUFDO1FBQ2pFLElBQU0sTUFBTSxHQUFHLG9EQUF1QixDQUNsQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLHNCQUFlLEVBQUUsc0JBQWUsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUN4RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3RDLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNqQixJQUFNLFlBQVksR0FBRyxpQ0FBK0IsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUcsQ0FBQztZQUN4RSxNQUFNLElBQUksS0FBSyxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQS9CRCxJQStCQztBQS9CWSw4QkFBUyJ9