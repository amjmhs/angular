"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * Entry point for all animation APIs of the animation package.
 */
var animation_builder_1 = require("./animation_builder");
exports.AnimationBuilder = animation_builder_1.AnimationBuilder;
exports.AnimationFactory = animation_builder_1.AnimationFactory;
var animation_metadata_1 = require("./animation_metadata");
exports.AUTO_STYLE = animation_metadata_1.AUTO_STYLE;
exports.animate = animation_metadata_1.animate;
exports.animateChild = animation_metadata_1.animateChild;
exports.animation = animation_metadata_1.animation;
exports.group = animation_metadata_1.group;
exports.keyframes = animation_metadata_1.keyframes;
exports.query = animation_metadata_1.query;
exports.sequence = animation_metadata_1.sequence;
exports.stagger = animation_metadata_1.stagger;
exports.state = animation_metadata_1.state;
exports.style = animation_metadata_1.style;
exports.transition = animation_metadata_1.transition;
exports.trigger = animation_metadata_1.trigger;
exports.useAnimation = animation_metadata_1.useAnimation;
var animation_player_1 = require("./players/animation_player");
exports.NoopAnimationPlayer = animation_player_1.NoopAnimationPlayer;
__export(require("./private_export"));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvc3JjL2FuaW1hdGlvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7QUFFSDs7OztHQUlHO0FBQ0gseURBQXVFO0FBQS9ELCtDQUFBLGdCQUFnQixDQUFBO0FBQUUsK0NBQUEsZ0JBQWdCLENBQUE7QUFFMUMsMkRBQXFwQjtBQUE3b0IsMENBQUEsVUFBVSxDQUFBO0FBQTRkLHVDQUFBLE9BQU8sQ0FBQTtBQUFFLDRDQUFBLFlBQVksQ0FBQTtBQUFFLHlDQUFBLFNBQVMsQ0FBQTtBQUFFLHFDQUFBLEtBQUssQ0FBQTtBQUFFLHlDQUFBLFNBQVMsQ0FBQTtBQUFFLHFDQUFBLEtBQUssQ0FBQTtBQUFFLHdDQUFBLFFBQVEsQ0FBQTtBQUFFLHVDQUFBLE9BQU8sQ0FBQTtBQUFFLHFDQUFBLEtBQUssQ0FBQTtBQUFFLHFDQUFBLEtBQUssQ0FBQTtBQUFFLDBDQUFBLFVBQVUsQ0FBQTtBQUFFLHVDQUFBLE9BQU8sQ0FBQTtBQUFFLDRDQUFBLFlBQVksQ0FBQTtBQUMzbUIsK0RBQWdGO0FBQXZELGlEQUFBLG1CQUFtQixDQUFBO0FBRTVDLHNDQUFpQyJ9