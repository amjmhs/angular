"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animation_1 = require("./dsl/animation");
exports.ɵAnimation = animation_1.Animation;
var animation_style_normalizer_1 = require("./dsl/style_normalization/animation_style_normalizer");
exports.ɵAnimationStyleNormalizer = animation_style_normalizer_1.AnimationStyleNormalizer;
exports.ɵNoopAnimationStyleNormalizer = animation_style_normalizer_1.NoopAnimationStyleNormalizer;
var web_animations_style_normalizer_1 = require("./dsl/style_normalization/web_animations_style_normalizer");
exports.ɵWebAnimationsStyleNormalizer = web_animations_style_normalizer_1.WebAnimationsStyleNormalizer;
var animation_driver_1 = require("./render/animation_driver");
exports.ɵAnimationDriver = animation_driver_1.AnimationDriver;
exports.ɵNoopAnimationDriver = animation_driver_1.NoopAnimationDriver;
var animation_engine_next_1 = require("./render/animation_engine_next");
exports.ɵAnimationEngine = animation_engine_next_1.AnimationEngine;
var css_keyframes_driver_1 = require("./render/css_keyframes/css_keyframes_driver");
exports.ɵCssKeyframesDriver = css_keyframes_driver_1.CssKeyframesDriver;
var css_keyframes_player_1 = require("./render/css_keyframes/css_keyframes_player");
exports.ɵCssKeyframesPlayer = css_keyframes_player_1.CssKeyframesPlayer;
var shared_1 = require("./render/shared");
exports.ɵcontainsElement = shared_1.containsElement;
exports.ɵinvokeQuery = shared_1.invokeQuery;
exports.ɵmatchesElement = shared_1.matchesElement;
exports.ɵvalidateStyleProperty = shared_1.validateStyleProperty;
var web_animations_driver_1 = require("./render/web_animations/web_animations_driver");
exports.ɵWebAnimationsDriver = web_animations_driver_1.WebAnimationsDriver;
exports.ɵsupportsWebAnimations = web_animations_driver_1.supportsWebAnimations;
var web_animations_player_1 = require("./render/web_animations/web_animations_player");
exports.ɵWebAnimationsPlayer = web_animations_player_1.WebAnimationsPlayer;
var util_1 = require("./util");
exports.ɵallowPreviousPlayerStylesMerge = util_1.allowPreviousPlayerStylesMerge;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJpdmF0ZV9leHBvcnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL3ByaXZhdGVfZXhwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsNkNBQXdEO0FBQWhELGlDQUFBLFNBQVMsQ0FBYztBQUMvQixtR0FBMEw7QUFBbEwsaUVBQUEsd0JBQXdCLENBQTZCO0FBQUUscUVBQUEsNEJBQTRCLENBQWlDO0FBQzVILDZHQUF3STtBQUFoSSwwRUFBQSw0QkFBNEIsQ0FBaUM7QUFDckUsOERBQTJIO0FBQW5ILDhDQUFBLGVBQWUsQ0FBb0I7QUFBRSxrREFBQSxtQkFBbUIsQ0FBd0I7QUFDeEYsd0VBQW1GO0FBQTNFLG1EQUFBLGVBQWUsQ0FBb0I7QUFDM0Msb0ZBQXNHO0FBQTlGLHFEQUFBLGtCQUFrQixDQUF1QjtBQUNqRCxvRkFBc0c7QUFBOUYscURBQUEsa0JBQWtCLENBQXVCO0FBQ2pELDBDQUFxTDtBQUE3SyxvQ0FBQSxlQUFlLENBQW9CO0FBQUUsZ0NBQUEsV0FBVyxDQUFnQjtBQUFFLG1DQUFBLGNBQWMsQ0FBbUI7QUFBRSwwQ0FBQSxxQkFBcUIsQ0FBMEI7QUFDNUosdUZBQTJKO0FBQW5KLHVEQUFBLG1CQUFtQixDQUF3QjtBQUFFLHlEQUFBLHFCQUFxQixDQUEwQjtBQUNwRyx1RkFBMEc7QUFBbEcsdURBQUEsbUJBQW1CLENBQXdCO0FBQ25ELCtCQUF5RjtBQUFqRixpREFBQSw4QkFBOEIsQ0FBbUMifQ==