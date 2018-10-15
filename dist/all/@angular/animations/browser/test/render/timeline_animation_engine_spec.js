"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_style_normalizer_1 = require("../../src/dsl/style_normalization/animation_style_normalizer");
var shared_1 = require("../../src/render/shared");
var timeline_animation_engine_1 = require("../../src/render/timeline_animation_engine");
var mock_animation_driver_1 = require("../../testing/src/mock_animation_driver");
(function () {
    var defaultDriver = new mock_animation_driver_1.MockAnimationDriver();
    function makeEngine(body, driver, normalizer) {
        return new timeline_animation_engine_1.TimelineAnimationEngine(body, driver || defaultDriver, normalizer || new animation_style_normalizer_1.NoopAnimationStyleNormalizer());
    }
    // these tests are only mean't to be run within the DOM
    if (isNode)
        return;
    describe('TimelineAnimationEngine', function () {
        var element;
        beforeEach(function () {
            mock_animation_driver_1.MockAnimationDriver.log = [];
            element = document.createElement('div');
            document.body.appendChild(element);
        });
        afterEach(function () { return document.body.removeChild(element); });
        it('should animate a timeline', function () {
            var engine = makeEngine(shared_1.getBodyNode());
            var steps = [animations_1.style({ height: 100 }), animations_1.animate(1000, animations_1.style({ height: 0 }))];
            expect(mock_animation_driver_1.MockAnimationDriver.log.length).toEqual(0);
            invokeAnimation(engine, element, steps);
            expect(mock_animation_driver_1.MockAnimationDriver.log.length).toEqual(1);
        });
        it('should not destroy timeline-based animations after they have finished', function () {
            var engine = makeEngine(shared_1.getBodyNode());
            var log = [];
            function capture(value) {
                return function () { log.push(value); };
            }
            var steps = [animations_1.style({ height: 0 }), animations_1.animate(1000, animations_1.style({ height: 500 }))];
            var player = invokeAnimation(engine, element, steps);
            player.onDone(capture('done'));
            player.onDestroy(capture('destroy'));
            expect(log).toEqual([]);
            player.finish();
            expect(log).toEqual(['done']);
            player.destroy();
            expect(log).toEqual(['done', 'destroy']);
        });
        it('should normalize the style values that are animateTransitioned within an a timeline animation', function () {
            var engine = makeEngine(shared_1.getBodyNode(), defaultDriver, new SuffixNormalizer('-normalized'));
            var steps = [
                animations_1.style({ width: '333px' }),
                animations_1.animate(1000, animations_1.style({ width: '999px' })),
            ];
            var player = invokeAnimation(engine, element, steps);
            expect(player.keyframes).toEqual([
                { 'width-normalized': '333px-normalized', offset: 0 },
                { 'width-normalized': '999px-normalized', offset: 1 }
            ]);
        });
        it('should normalize `*` values', function () {
            var driver = new SuperMockDriver();
            var engine = makeEngine(shared_1.getBodyNode(), driver);
            var steps = [
                animations_1.style({ width: '*' }),
                animations_1.animate(1000, animations_1.style({ width: '999px' })),
            ];
            var player = invokeAnimation(engine, element, steps);
            expect(player.keyframes).toEqual([{ width: '*star*', offset: 0 }, { width: '999px', offset: 1 }]);
        });
    });
})();
function invokeAnimation(engine, element, steps, id) {
    if (id === void 0) { id = 'id'; }
    engine.register(id, steps);
    return engine.create(id, element);
}
var SuffixNormalizer = /** @class */ (function (_super) {
    __extends(SuffixNormalizer, _super);
    function SuffixNormalizer(_suffix) {
        var _this = _super.call(this) || this;
        _this._suffix = _suffix;
        return _this;
    }
    SuffixNormalizer.prototype.normalizePropertyName = function (propertyName, errors) {
        return propertyName + this._suffix;
    };
    SuffixNormalizer.prototype.normalizeStyleValue = function (userProvidedProperty, normalizedProperty, value, errors) {
        return value + this._suffix;
    };
    return SuffixNormalizer;
}(animation_style_normalizer_1.AnimationStyleNormalizer));
var SuperMockDriver = /** @class */ (function (_super) {
    __extends(SuperMockDriver, _super);
    function SuperMockDriver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SuperMockDriver.prototype.computeStyle = function (element, prop, defaultValue) { return '*star*'; };
    return SuperMockDriver;
}(mock_animation_driver_1.MockAnimationDriver));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYW5pbWF0aW9ucy9icm93c2VyL3Rlc3QvcmVuZGVyL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmVfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBc0U7QUFFdEUsMkdBQW9JO0FBRXBJLGtEQUFvRDtBQUNwRCx3RkFBbUY7QUFDbkYsaUZBQWlHO0FBRWpHLENBQUM7SUFDQyxJQUFNLGFBQWEsR0FBRyxJQUFJLDJDQUFtQixFQUFFLENBQUM7SUFFaEQsb0JBQW9CLElBQVMsRUFBRSxNQUF3QixFQUFFLFVBQXFDO1FBQzVGLE9BQU8sSUFBSSxtREFBdUIsQ0FDOUIsSUFBSSxFQUFFLE1BQU0sSUFBSSxhQUFhLEVBQUUsVUFBVSxJQUFJLElBQUkseURBQTRCLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFFRCx1REFBdUQ7SUFDdkQsSUFBSSxNQUFNO1FBQUUsT0FBTztJQUVuQixRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsSUFBSSxPQUFZLENBQUM7UUFFakIsVUFBVSxDQUFDO1lBQ1QsMkNBQW1CLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztZQUM3QixPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztRQUVILFNBQVMsQ0FBQyxjQUFNLE9BQUEsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQWxDLENBQWtDLENBQUMsQ0FBQztRQUVwRCxFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsSUFBTSxNQUFNLEdBQUcsVUFBVSxD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