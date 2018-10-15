"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("../change_detection/constants");
var ivy_switch_1 = require("../ivy_switch");
var decorators_1 = require("../util/decorators");
/**
 * Type of the Directive metadata.
 */
exports.Directive = decorators_1.makeDecorator('Directive', function (dir) {
    if (dir === void 0) { dir = {}; }
    return dir;
}, undefined, undefined, function (type, meta) { return (ivy_switch_1.R3_COMPILE_DIRECTIVE || (function () { }))(type, meta); });
/**
 * Component decorator and metadata.
 *
 * @usageNotes
 *
 * ### Using animations
 *
 * The following snippet shows an animation trigger in a component's
 * metadata. The trigger is attached to an element in the component's
 * template, using "@_trigger_name_", and a state expression that is evaluated
 * at run time to determine whether the animation should start.
 *
 * ```typescript
 * @Component({
 *   selector: 'animation-cmp',
 *   templateUrl: 'animation-cmp.html',
 *   animations: [
 *     trigger('myTriggerName', [
 *       state('on', style({ opacity: 1 }),
 *       state('off', style({ opacity: 0 }),
 *       transition('on => off', [
 *         animate("1s")
 *       ])
 *     ])
 *   ]
 * })
 * ```
 *
 * ```html
 * <!-- animation-cmp.html -->
 * <div @myTriggerName="expression">...</div>
 * ```
 *
 * ### Preserving whitespace
 *
 * Removing whitespace can greatly reduce AOT-generated code size, and speed up view creation.
 * As of Angular 6, default for `preserveWhitespaces` is false (whitespace is removed).
 * To change the default setting for all components in your application, set
 * the `preserveWhitespaces` option of the AOT compiler.
 *
 * Current implementation removes whitespace characters as follows:
 * - Trims all whitespaces at the beginning and the end of a template.
 * - Removes whitespace-only text nodes. For example,
 * `<button>Action 1</button>  <button>Action 2</button>` becomes
 * `<button>Action 1</button><button>Action 2</button>`.
 * - Replaces a series of whitespace characters in text nodes with a single space.
 * For example, `<span>\n some text\n</span>` becomes `<span> some text </span>`.
 * - Does NOT alter text nodes inside HTML tags such as `<pre>` or `<textarea>`,
 * where whitespace characters are significant.
 *
 * Note that these transformations can influence DOM nodes layout, although impact
 * should be minimal.
 *
 * You can override the default behavior to preserve whitespace characters
 * in certain fragments of a template. For example, you can exclude an entire
 * DOM sub-tree by using the `ngPreserveWhitespaces` attribute:
 *
 * ```html
 * <div ngPreserveWhitespaces>
 *     whitespaces are preserved here
 *     <span>    and here </span>
 * </div>
 * ```
 *
 * You can force a single space to be preserved in a text node by using `&ngsp;`,
 * which is replaced with a space character by Angular's template
 * compiler:
 *
 * ```html
 * <a>Spaces</a>&ngsp;<a>between</a>&ngsp;<a>links.</a>
 * <!-->compiled to be equivalent to:</>
 *  <a>Spaces</a> <a>between</a> <a>links.</a>
 * ```
 *
 * Note that sequences of `&ngsp;` are still collapsed to just one space character when
 * the `preserveWhitespaces` option is set to `false`.
 *
 * ```html
 * <a>before</a>&ngsp;&ngsp;&ngsp;<a>after</a>
 * <!-->compiled to be equivalent to:</>
 *  <a>Spaces</a> <a>between</a> <a>links.</a>
 * ```
 *
 * To preserve sequences of whitespace characters, use the
 * `ngPreserveWhitespaces` attribute.
 *
 * @Annotation
 */
exports.Component = decorators_1.makeDecorator('Component', function (c) {
    if (c === void 0) { c = {}; }
    return (__assign({ changeDetection: constants_1.ChangeDetectionStrategy.Default }, c));
}, exports.Directive, undefined, function (type, meta) { return (ivy_switch_1.R3_COMPILE_COMPONENT || (function () { }))(type, meta); });
/**
 *
 *
 * @Annotation
 */
exports.Pipe = decorators_1.makeDecorator('Pipe', function (p) { return (__assign({ pure: true }, p)); }, undefined, undefined, function (type, meta) { return (ivy_switch_1.R3_COMPILE_PIPE || (function () { }))(type, meta); });
/**
 *
 * @Annotation
 */
exports.Input = decorators_1.makePropDecorator('Input', function (bindingPropertyName) { return ({ bindingPropertyName: bindingPropertyName }); });
/**
 *
 * @Annotation
 */
exports.Output = decorators_1.makePropDecorator('Output', function (bindingPropertyName) { return ({ bindingPropertyName: bindingPropertyName }); });
/**
 *
 * @Annotation
 */
exports.HostBinding = decorators_1.makePropDecorator('HostBinding', function (hostPropertyName) { return ({ hostPropertyName: hostPropertyName }); });
/**
 * Binds a CSS event to a host listener and supplies configuration metadata.
 * Angular invokes the supplied handler method when the host element emits the specified event,
 * and updates the bound element with the result.
 * If the handler method returns false, applies `preventDefault` on the bound element.
 *
 * @usageNotes
 *
 * The following example declares a directive
 * that attaches a click listener to a button and counts clicks.
 *
 * ```
 * @Directive({selector: 'button[counting]'})
 * class CountClicks {
 *   numberOfClicks = 0;
 *
 *   @HostListener('click', ['$event.target'])
 *   onClick(btn) {
 *     console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
 *  }
 * }
 *
 * @Component({
 *   selector: 'app',
 *   template: '<button counting>Increment</button>',
 * })
 * class App {}
 * ```
 *
 * @Annotation
 */
exports.HostListener = decorators_1.makePropDecorator('HostListener', function (eventName, args) { return ({ eventName: eventName, args: args }); });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0aXZlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL21ldGFkYXRhL2RpcmVjdGl2ZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7OztBQUVILDJEQUFzRTtBQUV0RSw0Q0FBMEY7QUFFMUYsaURBQW1GO0FBMlVuRjs7R0FFRztBQUNVLFFBQUEsU0FBUyxHQUF1QiwwQkFBYSxDQUN0RCxXQUFXLEVBQUUsVUFBQyxHQUFtQjtJQUFuQixvQkFBQSxFQUFBLFFBQW1CO0lBQUssT0FBQSxHQUFHO0FBQUgsQ0FBRyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQy9ELFVBQUMsSUFBZSxFQUFFLElBQWUsSUFBSyxPQUFBLENBQUMsaUNBQW9CLElBQUksQ0FBQyxjQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFoRCxDQUFnRCxDQUFDLENBQUM7QUFrTTVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Rkc7QUFDVSxRQUFBLFNBQVMsR0FBdUIsMEJBQWEsQ0FDdEQsV0FBVyxFQUFFLFVBQUMsQ0FBaUI7SUFBakIsa0JBQUEsRUFBQSxNQUFpQjtJQUFLLE9BQUEsWUFBRSxlQUFlLEVBQUUsbUNBQXVCLENBQUMsT0FBTyxJQUFLLENBQUMsRUFBRTtBQUExRCxDQUEwRCxFQUM5RixpQkFBUyxFQUFFLFNBQVMsRUFDcEIsVUFBQyxJQUFlLEVBQUUsSUFBZSxJQUFLLE9BQUEsQ0FBQyxpQ0FBb0IsSUFBSSxDQUFDLGNBQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQWhELENBQWdELENBQUMsQ0FBQztBQXlDNUY7Ozs7R0FJRztBQUNVLFFBQUEsSUFBSSxHQUFrQiwwQkFBYSxDQUM1QyxNQUFNLEVBQUUsVUFBQyxDQUFPLElBQUssT0FBQSxZQUFFLElBQUksRUFBRSxJQUFJLElBQUssQ0FBQyxFQUFFLEVBQXBCLENBQW9CLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFDL0QsVUFBQyxJQUFlLEVBQUUsSUFBVSxJQUFLLE9BQUEsQ0FBQyw0QkFBZSxJQUFJLENBQUMsY0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBM0MsQ0FBMkMsQ0FBQyxDQUFDO0FBa0ZsRjs7O0dBR0c7QUFDVSxRQUFBLEtBQUssR0FDZCw4QkFBaUIsQ0FBQyxPQUFPLEVBQUUsVUFBQyxtQkFBNEIsSUFBSyxPQUFBLENBQUMsRUFBQyxtQkFBbUIscUJBQUEsRUFBQyxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQztBQThCMUY7OztHQUdHO0FBQ1UsUUFBQSxNQUFNLEdBQ2YsOEJBQWlCLENBQUMsUUFBUSxFQUFFLFVBQUMsbUJBQTRCLElBQUssT0FBQSxDQUFDLEVBQUMsbUJBQW1CLHFCQUFBLEVBQUMsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7QUE2QzNGOzs7R0FHRztBQUNVLFFBQUEsV0FBVyxHQUNwQiw4QkFBaUIsQ0FBQyxhQUFhLEVBQUUsVUFBQyxnQkFBeUIsSUFBSyxPQUFBLENBQUMsRUFBQyxnQkFBZ0Isa0JBQUEsRUFBQyxDQUFDLEVBQXBCLENBQW9CLENBQUMsQ0FBQztBQXlCMUY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThCRztBQUNVLFFBQUEsWUFBWSxHQUNyQiw4QkFBaUIsQ0FBQyxjQUFjLEVBQUUsVUFBQyxTQUFrQixFQUFFLElBQWUsSUFBSyxPQUFBLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQyJ9