"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web_animations_player_1 = require("../../../src/render/web_animations/web_animations_player");
{
    var element_1;
    var innerPlayer_1 = null;
    beforeEach(function () {
        element_1 = {};
        element_1['animate'] = function () { return innerPlayer_1 = new MockDomAnimation(); };
    });
    describe('WebAnimationsPlayer tests', function () {
        it('should automatically pause the player when created and initialized', function () {
            var keyframes = [
                { opacity: 0, offset: 0 },
                { opacity: 1, offset: 1 },
            ];
            var player = new web_animations_player_1.WebAnimationsPlayer(element_1, keyframes, { duration: 1000 });
            player.init();
            var p = innerPlayer_1;
            expect(p.log).toEqual(['pause']);
            player.play();
            expect(p.log).toEqual(['pause', 'play']);
        });
        it('should not pause the player if created and started before initialized', function () {
            var keyframes = [
                { opacity: 0, offset: 0 },
                { opacity: 1, offset: 1 },
            ];
            var player = new web_animations_player_1.WebAnimationsPlayer(element_1, keyframes, { duration: 1000 });
            player.play();
            var p = innerPlayer_1;
            expect(p.log).toEqual(['play']);
        });
        it('should fire start/done callbacks manually when called directly', function () {
            var log = [];
            var player = new web_animations_player_1.WebAnimationsPlayer(element_1, [], { duration: 1000 });
            player.onStart(function () { return log.push('started'); });
            player.onDone(function () { return log.push('done'); });
            player.triggerCallback('start');
            expect(log).toEqual(['started']);
            player.play();
            expect(log).toEqual(['started']);
            player.triggerCallback('done');
            expect(log).toEqual(['started', 'done']);
            player.finish();
            expect(log).toEqual(['started', 'done']);
        });
    });
}
var MockDomAnimation = /** @class */ (function () {
    function MockDomAnimation() {
        this.log = [];
        this.onfinish = function () { };
        this.position = 0;
        this.currentTime = 0;
    }
    MockDomAnimation.prototype.cancel = function () { this.log.push('cancel'); };
    MockDomAnimation.prototype.play = function () { this.log.push('play'); };
    MockDomAnimation.prototype.pause = function () { this.log.push('pause'); };
    MockDomAnimation.prototype.finish = function () { this.log.push('finish'); };
    MockDomAnimation.prototype.addEventListener = function (eventName, handler) { };
    MockDomAnimation.prototype.dispatchEvent = function (eventName) { };
    return MockDomAnimation;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2FuaW1hdGlvbnNfcGxheWVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvdGVzdC9yZW5kZXIvd2ViX2FuaW1hdGlvbnMvd2ViX2FuaW1hdGlvbnNfcGxheWVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFRQSxrR0FBNkY7QUFFN0Y7SUFDRSxJQUFJLFNBQVksQ0FBQztJQUNqQixJQUFJLGFBQVcsR0FBMEIsSUFBSSxDQUFDO0lBQzlDLFVBQVUsQ0FBQztRQUNULFNBQU8sR0FBRyxFQUFFLENBQUM7UUFDYixTQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsY0FBUSxPQUFPLGFBQVcsR0FBRyxJQUFJLGdCQUFnQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsMkJBQTJCLEVBQUU7UUFDcEMsRUFBRSxDQUFDLG9FQUFvRSxFQUFFO1lBQ3ZFLElBQU0sU0FBUyxHQUFHO2dCQUNoQixFQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztnQkFDdkIsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUM7YUFDeEIsQ0FBQztZQUVGLElBQU0sTUFBTSxHQUFHLElBQUksMkNBQW1CLENBQUMsU0FBTyxFQUFFLFNBQVMsRUFBRSxFQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1lBRTdFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUNkLElBQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQztZQUN4QixNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFFakMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2QsTUFBTSxDQUFD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