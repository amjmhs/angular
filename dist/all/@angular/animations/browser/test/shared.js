"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var animations_1 = require("@angular/animations");
var animation_ast_builder_1 = require("../src/dsl/animation_ast_builder");
var animation_trigger_1 = require("../src/dsl/animation_trigger");
var mock_animation_driver_1 = require("../testing/src/mock_animation_driver");
function makeTrigger(name, steps, skipErrors) {
    if (skipErrors === void 0) { skipErrors = false; }
    var driver = new mock_animation_driver_1.MockAnimationDriver();
    var errors = [];
    var triggerData = animations_1.trigger(name, steps);
    var triggerAst = animation_ast_builder_1.buildAnimationAst(driver, triggerData, errors);
    if (!skipErrors && errors.length) {
        var LINE_START = '\n - ';
        throw new Error("Animation parsing for the " + name + " trigger have failed:" + LINE_START + errors.join(LINE_START));
    }
    return animation_trigger_1.buildTrigger(name, triggerAst);
}
exports.makeTrigger = makeTrigger;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3Qvc2hhcmVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsa0RBQTRDO0FBRzVDLDBFQUFtRTtBQUNuRSxrRUFBNEU7QUFDNUUsOEVBQXlFO0FBRXpFLHFCQUNJLElBQVksRUFBRSxLQUFVLEVBQUUsVUFBMkI7SUFBM0IsMkJBQUEsRUFBQSxrQkFBMkI7SUFDdkQsSUFBTSxNQUFNLEdBQUcsSUFBSSwyQ0FBbUIsRUFBRSxDQUFDO0lBQ3pDLElBQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztJQUN6QixJQUFNLFdBQVcsR0FBRyxvQkFBTyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6QyxJQUFNLFVBQVUsR0FBRyx5Q0FBaUIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBZSxDQUFDO0lBQ2hGLElBQUksQ0FBQyxVQUFVLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtRQUNoQyxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUM7UUFDM0IsTUFBTSxJQUFJLEtBQUssQ0FDWCwrQkFBNkIsSUFBSSw2QkFBd0IsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFHLENBQUMsQ0FBQztLQUN0RztJQUNELE9BQU8sZ0NBQVksQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQVpELGtDQVlDIn0=