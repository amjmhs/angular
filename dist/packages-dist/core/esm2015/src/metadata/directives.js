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
import { ChangeDetectionStrategy } from '../change_detection/constants';
import { R3_COMPILE_COMPONENT, R3_COMPILE_DIRECTIVE, R3_COMPILE_PIPE } from '../ivy_switch';
import { makeDecorator, makePropDecorator } from '../util/decorators';
/**
 * Type of the Directive decorator / constructor function.
 * @record
 */
export function DirectiveDecorator() { }
/** *
 * Type of the Directive metadata.
  @type {?} */
export const Directive = makeDecorator('Directive', (dir = {}) => dir, undefined, undefined, (type, meta) => (R3_COMPILE_DIRECTIVE || (() => { }))(type, meta));
/**
 * Component decorator interface
 *
 * @record
 */
export function ComponentDecorator() { }
/** *
 * Component decorator and metadata.
 *
 * \@usageNotes
 *
 * ### Using animations
 *
 * The following snippet shows an animation trigger in a component's
 * metadata. The trigger is attached to an element in the component's
 * template, using "\@_trigger_name_", and a state expression that is evaluated
 * at run time to determine whether the animation should start.
 *
 * ```typescript
 * \@Component({
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
 * <div \@myTriggerName="expression">...</div>
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
 * \@Annotation
  @type {?} */
export const Component = makeDecorator('Component', (c = {}) => (Object.assign({ changeDetection: ChangeDetectionStrategy.Default }, c)), Directive, undefined, (type, meta) => (R3_COMPILE_COMPONENT || (() => { }))(type, meta));
/**
 * Type of the Pipe decorator / constructor function.
 * @record
 */
export function PipeDecorator() { }
/** *
 *
 *
 * \@Annotation
  @type {?} */
export const Pipe = makeDecorator('Pipe', (p) => (Object.assign({ pure: true }, p)), undefined, undefined, (type, meta) => (R3_COMPILE_PIPE || (() => { }))(type, meta));
/**
 *
 * @record
 */
export function InputDecorator() { }
/** *
 *
 * \@Annotation
  @type {?} */
export const Input = makePropDecorator('Input', (bindingPropertyName) => ({ bindingPropertyName }));
/**
 * Type of the Output decorator / constructor function.
 * @record
 */
export function OutputDecorator() { }
/** *
 *
 * \@Annotation
  @type {?} */
export const Output = makePropDecorator('Output', (bindingPropertyName) => ({ bindingPropertyName }));
/**
 * Type of the HostBinding decorator / constructor function.
 * @record
 */
export function HostBindingDecorator() { }
/** *
 *
 * \@Annotation
  @type {?} */
export const HostBinding = makePropDecorator('HostBinding', (hostPropertyName) => ({ hostPropertyName }));
/**
 * Type of the HostListener decorator / constructor function.
 * @record
 */
export function HostListenerDecorator() { }
/** *
 * Binds a CSS event to a host listener and supplies configuration metadata.
 * Angular invokes the supplied handler method when the host element emits the specified event,
 * and updates the bound element with the result.
 * If the handler method returns false, applies `preventDefault` on the bound element.
 *
 * \@usageNotes
 *
 * The following example declares a directive
 * that attaches a click listener to a button and counts clicks.
 *
 * ```
 * \@Directive({selector: 'button[counting]'})
 * class CountClicks {
 *   numberOfClicks = 0;
 *
 * \@HostListener('click', ['$event.target'])
 *   onClick(btn) {
 *     console.log('button', btn, 'number of clicks:', this.numberOfClicks++);
 *  }
 * }
 *
 * \@Component({
 *   selector: 'app',
 *   template: '<button counting>Increment</button>',
 * })
 * class App {}
 * ```
 *
 * \@Annotation
  @type {?} */
export const HostListener = makePropDecorator('HostListener', (eventName, args) => ({ eventName, args }));
//# sourceMappingURL=directives.js.map