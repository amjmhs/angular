"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var animations_1 = require("@angular/animations");
var animation_ast_builder_1 = require("../dsl/animation_ast_builder");
var animation_timeline_builder_1 = require("../dsl/animation_timeline_builder");
var element_instruction_map_1 = require("../dsl/element_instruction_map");
var util_1 = require("../util");
var shared_1 = require("./shared");
var EMPTY_INSTRUCTION_MAP = new element_instruction_map_1.ElementInstructionMap();
var TimelineAnimationEngine = /** @class */ (function () {
    function TimelineAnimationEngine(bodyNode, _driver, _normalizer) {
        this.bodyNode = bodyNode;
        this._driver = _driver;
        this._normalizer = _normalizer;
        this._animations = {};
        this._playersById = {};
        this.players = [];
    }
    TimelineAnimationEngine.prototype.register = function (id, metadata) {
        var errors = [];
        var ast = animation_ast_builder_1.buildAnimationAst(this._driver, metadata, errors);
        if (errors.length) {
            throw new Error("Unable to build the animation due to the following errors: " + errors.join("\n"));
        }
        else {
            this._animations[id] = ast;
        }
    };
    TimelineAnimationEngine.prototype._buildPlayer = function (i, preStyles, postStyles) {
        var element = i.element;
        var keyframes = shared_1.normalizeKeyframes(this._driver, this._normalizer, element, i.keyframes, preStyles, postStyles);
        return this._driver.animate(element, keyframes, i.duration, i.delay, i.easing, [], true);
    };
    TimelineAnimationEngine.prototype.create = function (id, element, options) {
        var _this = this;
        if (options === void 0) { options = {}; }
        var errors = [];
        var ast = this._animations[id];
        var instructions;
        var autoStylesMap = new Map();
        if (ast) {
            instructions = animation_timeline_builder_1.buildAnimationTimelines(this._driver, element, ast, util_1.ENTER_CLASSNAME, util_1.LEAVE_CLASSNAME, {}, {}, options, EMPTY_INSTRUCTION_MAP, errors);
            instructions.forEach(function (inst) {
                var styles = shared_1.getOrSetAsInMap(autoStylesMap, inst.element, {});
                inst.postStyleProps.forEach(function (prop) { return styles[prop] = null; });
            });
        }
        else {
            errors.push('The requested animation doesn\'t exist or has already been destroyed');
            instructions = [];
        }
        if (errors.length) {
            throw new Error("Unable to create the animation due to the following errors: " + errors.join("\n"));
        }
        autoStylesMap.forEach(function (styles, element) {
            Object.keys(styles).forEach(function (prop) { styles[prop] = _this._driver.computeStyle(element, prop, animations_1.AUTO_STYLE); });
        });
        var players = instructions.map(function (i) {
            var styles = autoStylesMap.get(i.element);
            return _this._buildPlayer(i, {}, styles);
        });
        var player = shared_1.optimizeGroupPlayer(players);
        this._playersById[id] = player;
        player.onDestroy(function () { return _this.destroy(id); });
        this.players.push(player);
        return player;
    };
    TimelineAnimationEngine.prototype.destroy = function (id) {
        var player = this._getPlayer(id);
        player.destroy();
        delete this._playersById[id];
        var index = this.players.indexOf(player);
        if (index >= 0) {
            this.players.splice(index, 1);
        }
    };
    TimelineAnimationEngine.prototype._getPlayer = function (id) {
        var player = this._playersById[id];
        if (!player) {
            throw new Error("Unable to find the timeline player referenced by " + id);
        }
        return player;
    };
    TimelineAnimationEngine.prototype.listen = function (id, element, eventName, callback) {
        // triggerName, fromState, toState are all ignored for timeline animations
        var baseEvent = shared_1.makeAnimationEvent(element, '', '', '');
        shared_1.listenOnPlayer(this._getPlayer(id), eventName, baseEvent, callback);
        return function () { };
    };
    TimelineAnimationEngine.prototype.command = function (id, element, command, args) {
        if (command == 'register') {
            this.register(id, args[0]);
            return;
        }
        if (command == 'create') {
            var options = (args[0] || {});
            this.create(id, element, options);
            return;
        }
        var player = this._getPlayer(id);
        switch (command) {
            case 'play':
                player.play();
                break;
            case 'pause':
                player.pause();
                break;
            case 'reset':
                player.reset();
                break;
            case 'restart':
                player.restart();
                break;
            case 'finish':
                player.finish();
                break;
            case 'init':
                player.init();
                break;
            case 'setPosition':
                player.setPosition(parseFloat(args[0]));
                break;
            case 'destroy':
                this.destroy(id);
                break;
        }
    };
    return TimelineAnimationEngine;
}());
exports.TimelineAnimationEngine = TimelineAnimationEngine;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZWxpbmVfYW5pbWF0aW9uX2VuZ2luZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2FuaW1hdGlvbnMvYnJvd3Nlci9zcmMvcmVuZGVyL3RpbWVsaW5lX2FuaW1hdGlvbl9lbmdpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCxrREFBd0k7QUFHeEksc0VBQStEO0FBQy9ELGdGQUEwRTtBQUUxRSwwRUFBcUU7QUFFckUsZ0NBQXlEO0FBR3pELG1DQUFzSDtBQUV0SCxJQUFNLHFCQUFxQixHQUFHLElBQUksK0NBQXFCLEVBQUUsQ0FBQztBQUUxRDtJQUtFLGlDQUNXLFFBQWEsRUFBVSxPQUF3QixFQUM5QyxXQUFxQztRQUR0QyxhQUFRLEdBQVIsUUFBUSxDQUFLO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFDOUMsZ0JBQVcsR0FBWCxXQUFXLENBQTBCO1FBTnpDLGdCQUFXLEdBQStDLEVBQUUsQ0FBQztRQUM3RCxpQkFBWSxHQUFvQyxFQUFFLENBQUM7UUFDcEQsWUFBTyxHQUFzQixFQUFFLENBQUM7SUFJYSxDQUFDO0lBRXJELDBDQUFRLEdBQVIsVUFBUyxFQUFVLEVBQUUsUUFBK0M7UUFDbEUsSUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLHlDQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlELElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUNqQixNQUFNLElBQUksS0FBSyxDQUNYLGdFQUE4RCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBRyxDQUFDLENBQUM7U0FDeEY7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVPLDhDQUFZLEdBQXBCLFVBQ0ks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