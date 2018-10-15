"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An injectable service that produces an animation sequence programmatically within an
 * Angular component or directive.
 * Provided by the `BrowserAnimationsModule` or `NoopAnimationsModule`.
 *
 * @usageNotes
 *
 * To use this service, add it to your component or directive as a dependency.
 * The service is instantiated along with your component.
 *
 * Apps do not typically need to create their own animation players, but if you
 * do need to, follow these steps:
 *
 * 1. Use the `build()` method to create a programmatic animation using the
 * `animate()` function. The method returns an `AnimationFactory` instance.
 *
 * 2. Use the factory object to create an `AnimationPlayer` and attach it to a DOM element.
 *
 * 3. Use the player object to control the animation programmatically.
 *
 * For example:
 *
 * ```ts
 * // import the service from BrowserAnimationsModule
 * import {AnimationBuilder} from '@angular/animations';
 * // require the service as a dependency
 * class MyCmp {
 *   constructor(private _builder: AnimationBuilder) {}
 *
 *   makeAnimation(element: any) {
 *     // first define a reusable animation
 *     const myAnimation = this._builder.build([
 *       style({ width: 0 }),
 *       animate(1000, style({ width: '100px' }))
 *     ]);
 *
 *     // use the returned factory object to create a player
 *     const player = myAnimation.create(element);
 *
 *     player.play();
 *   }
 * }
 * ```
 *
 */
var AnimationBuilder = /** @class */ (function () {
    function AnimationBuilder() {
    }
    return AnimationBuilder;
}());
exports.AnimationBuilder = AnimationBuilder;
/**
 * A factory object returned from the `AnimationBuilder`.`build()` method.
 *
 */
var AnimationFactory = /** @class */ (function () {
    function AnimationFactory() {
    }
    return AnimationFactory;
}());
exports.AnimationFactory = AnimationFactory;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX2J1aWxkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL3NyYy9hbmltYXRpb25fYnVpbGRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNIO0lBQUE7SUFRQSxDQUFDO0lBQUQsdUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJxQiw0Q0FBZ0I7QUFVdEM7OztHQUdHO0FBQ0g7SUFBQTtJQVVBLENBQUM7SUFBRCx1QkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVnFCLDRDQUFnQiJ9