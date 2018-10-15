"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var css_keyframes_player_1 = require("../../../src/render/css_keyframes/css_keyframes_player");
var web_animations_driver_1 = require("../../../src/render/web_animations/web_animations_driver");
var web_animations_player_1 = require("../../../src/render/web_animations/web_animations_player");
{
    describe('WebAnimationsDriver', function () {
        if (isNode)
            return;
        describe('when web-animations are not supported natively', function () {
            it('should return an instance of a CssKeyframePlayer if scrubbing is not requested', function () {
                var element = createElement();
                var driver = makeDriver();
                driver.overrideWebAnimationsSupport(false);
                var player = driver.animate(element, [], 1000, 1000, '', [], false);
                expect(player instanceof css_keyframes_player_1.CssKeyframesPlayer).toBeTruthy();
            });
            it('should return an instance of a WebAnimationsPlayer if scrubbing is not requested', function () {
                var element = createElement();
                var driver = makeDriver();
                driver.overrideWebAnimationsSupport(false);
                var player = driver.animate(element, [], 1000, 1000, '', [], true);
                expect(player instanceof web_animations_player_1.WebAnimationsPlayer).toBeTruthy();
            });
        });
        describe('when web-animations are supported natively', function () {
            it('should return an instance of a WebAnimationsPlayer if scrubbing is not requested', function () {
                var element = createElement();
                var driver = makeDriver();
                driver.overrideWebAnimationsSupport(true);
                var player = driver.animate(element, [], 1000, 1000, '', [], false);
                expect(player instanceof web_animations_player_1.WebAnimationsPlayer).toBeTruthy();
            });
            it('should return an instance of a WebAnimationsPlayer if scrubbing is requested', function () {
                var element = createElement();
                var driver = makeDriver();
                driver.overrideWebAnimationsSupport(true);
                var player = driver.animate(element, [], 1000, 1000, '', [], true);
                expect(player instanceof web_animations_player_1.WebAnimationsPlayer).toBeTruthy();
            });
        });
    });
}
function makeDriver() {
    return new web_animations_driver_1.WebAnimationsDriver();
}
function createElement() {
    return document.createElement('div');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfZHJpdmVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfZHJpdmVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrRkFBMEY7QUFFMUYsa0dBQTZGO0FBQzdGLGtHQUE2RjtBQUU3RjtJQUNFLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtRQUM5QixJQUFJLE1BQU07WUFBRSxPQUFPO1FBRW5CLFFBQVEsQ0FBQyxnREFBZ0QsRUFBRTtZQUN6RCxFQUFFLENBQUMsZ0ZBQWdGLEVBQUU7Z0JBQ25GLElBQU0sT0FBTyxHQUFHLGFBQWEsRUFBRSxDQUFDO2dCQUNoQyxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0RSxNQUFNLENBQUMsTUFBTSxZQUFZLHlDQUFrQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsa0ZBQWtGLEVBQUU7Z0JBQ3JGLElBQU0sT0FBTyxHQUFHLGFBQWEsRUFBRSxDQUFDO2dCQUNoQyxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLDRCQUE0QixDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUMzQyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsTUFBTSxZQUFZLDJDQUFtQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyw0Q0FBNEMsRUFBRTtZQUNyRCxFQUFFLENBQUMsa0ZBQWtGLEVBQUU7Z0JBQ3JGLElBQU0sT0FBTyxHQUFHLGFBQWEsRUFBRSxDQUFDO2dCQUNoQyxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN0RSxNQUFNLENBQUMsTUFBTSxZQUFZLDJDQUFtQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsOEVBQThFLEVBQUU7Z0JBQ2pGLElBQU0sT0FBTyxHQUFHLGFBQWEsRUFBRSxDQUFDO2dCQUNoQyxJQUFNLE1BQU0sR0FBRyxVQUFVLEVBQUUsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLDRCQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNyRSxNQUFNLENBQUMsTUFBTSxZQUFZLDJDQUFtQixDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDN0QsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFFRDtJQUNFLE9BQU8sSUFBSSwyQ0FBbUIsRUFBRSxDQUFDO0FBQ25DLENBQUM7QUFFRDtJQUNFLE9BQU8sUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QyxDQUFDIn0=