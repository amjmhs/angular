"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var router_1 = require("@angular/router");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var events_1 = require("../src/events");
var router_scroller_1 = require("../src/router_scroller");
describe('RouterScroller', function () {
    it('defaults to disabled', function () {
        var events = new rxjs_1.Subject();
        var router = {
            events: events,
            parseUrl: function (url) { return new router_1.DefaultUrlSerializer().parse(url); },
            triggerEvent: function (e) { return events.next(e); }
        };
        var viewportScroller = jasmine.createSpyObj('viewportScroller', ['getScrollPosition', 'scrollToPosition', 'scrollToAnchor', 'setHistoryScrollRestoration']);
        setScroll(viewportScroller, 0, 0);
        var scroller = new router_scroller_1.RouterScroller(router, router);
        expect(scroller.options.scrollPositionRestoration).toBe('disabled');
        expect(scroller.options.anchorScrolling).toBe('disabled');
    });
    describe('scroll to top', function () {
        it('should scroll to the top', function () {
            var _a = createRouterScroller({ scrollPositionRestoration: 'top', anchorScrolling: 'disabled' }), events = _a.events, viewportScroller = _a.viewportScroller;
            events.next(new router_1.NavigationStart(1, '/a'));
            events.next(new router_1.NavigationEnd(1, '/a', '/a'));
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
            events.next(new router_1.NavigationStart(2, '/a'));
            events.next(new router_1.NavigationEnd(2, '/b', '/b'));
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
            events.next(new router_1.NavigationStart(3, '/a', 'popstate'));
            events.next(new router_1.NavigationEnd(3, '/a', '/a'));
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
        });
    });
    describe('scroll to the stored position', function () {
        it('should scroll to the stored position on popstate', function () {
            var _a = createRouterScroller({ scrollPositionRestoration: 'enabled', anchorScrolling: 'disabled' }), events = _a.events, viewportScroller = _a.viewportScroller;
            events.next(new router_1.NavigationStart(1, '/a'));
            events.next(new router_1.NavigationEnd(1, '/a', '/a'));
            setScroll(viewportScroller, 10, 100);
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
            events.next(new router_1.NavigationStart(2, '/b'));
            events.next(new router_1.NavigationEnd(2, '/b', '/b'));
            setScroll(viewportScroller, 20, 200);
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
            events.next(new router_1.NavigationStart(3, '/a', 'popstate', { navigationId: 1 }));
            events.next(new router_1.NavigationEnd(3, '/a', '/a'));
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([10, 100]);
        });
    });
    describe('anchor scrolling', function () {
        it('should work (scrollPositionRestoration is disabled)', function () {
            var _a = createRouterScroller({ scrollPositionRestoration: 'disabled', anchorScrolling: 'enabled' }), events = _a.events, viewportScroller = _a.viewportScroller;
            events.next(new router_1.NavigationStart(1, '/a#anchor'));
            events.next(new router_1.NavigationEnd(1, '/a#anchor', '/a#anchor'));
            expect(viewportScroller.scrollToAnchor).toHaveBeenCalledWith('anchor');
            events.next(new router_1.NavigationStart(2, '/a#anchor2'));
            events.next(new router_1.NavigationEnd(2, '/a#anchor2', '/a#anchor2'));
            expect(viewportScroller.scrollToAnchor).toHaveBeenCalledWith('anchor2');
            viewportScroller.scrollToAnchor.calls.reset();
            // we never scroll to anchor when navigating back.
            events.next(new router_1.NavigationStart(3, '/a#anchor', 'popstate'));
            events.next(new router_1.NavigationEnd(3, '/a#anchor', '/a#anchor'));
            expect(viewportScroller.scrollToAnchor).not.toHaveBeenCalled();
            expect(viewportScroller.scrollToPosition).not.toHaveBeenCalled();
        });
        it('should work (scrollPositionRestoration is enabled)', function () {
            var _a = createRouterScroller({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }), events = _a.events, viewportScroller = _a.viewportScroller;
            events.next(new router_1.NavigationStart(1, '/a#anchor'));
            events.next(new router_1.NavigationEnd(1, '/a#anchor', '/a#anchor'));
            expect(viewportScroller.scrollToAnchor).toHaveBeenCalledWith('anchor');
            events.next(new router_1.NavigationStart(2, '/a#anchor2'));
            events.next(new router_1.NavigationEnd(2, '/a#anchor2', '/a#anchor2'));
            expect(viewportScroller.scrollToAnchor).toHaveBeenCalledWith('anchor2');
            viewportScroller.scrollToAnchor.calls.reset();
            // we never scroll to anchor when navigating back
            events.next(new router_1.NavigationStart(3, '/a#anchor', 'popstate', { navigationId: 1 }));
            events.next(new router_1.NavigationEnd(3, '/a#anchor', '/a#anchor'));
            expect(viewportScroller.scrollToAnchor).not.toHaveBeenCalled();
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([0, 0]);
        });
    });
    describe('extending a scroll service', function () {
        it('work', testing_1.fakeAsync(function () {
            var _a = createRouterScroller({ scrollPositionRestoration: 'disabled', anchorScrolling: 'disabled' }), events = _a.events, viewportScroller = _a.viewportScroller, router = _a.router;
            router.events
                .pipe(operators_1.filter(function (e) { return e instanceof events_1.Scroll && !!e.position; }), operators_1.switchMap(function (p) {
                // can be any delay (e.g., we can wait for NgRx store to emit an event)
                var r = new rxjs_1.Subject();
                setTimeout(function () {
                    r.next(p);
                    r.complete();
                }, 1000);
                return r;
            }))
                .subscribe(function (e) { viewportScroller.scrollToPosition(e.position); });
            events.next(new router_1.NavigationStart(1, '/a'));
            events.next(new router_1.NavigationEnd(1, '/a', '/a'));
            setScroll(viewportScroller, 10, 100);
            events.next(new router_1.NavigationStart(2, '/b'));
            events.next(new router_1.NavigationEnd(2, '/b', '/b'));
            setScroll(viewportScroller, 20, 200);
            events.next(new router_1.NavigationStart(3, '/c'));
            events.next(new router_1.NavigationEnd(3, '/c', '/c'));
            setScroll(viewportScroller, 30, 300);
            events.next(new router_1.NavigationStart(4, '/a', 'popstate', { navigationId: 1 }));
            events.next(new router_1.NavigationEnd(4, '/a', '/a'));
            testing_1.tick(500);
            expect(viewportScroller.scrollToPosition).not.toHaveBeenCalled();
            events.next(new router_1.NavigationStart(5, '/a', 'popstate', { navigationId: 1 }));
            events.next(new router_1.NavigationEnd(5, '/a', '/a'));
            testing_1.tick(5000);
            expect(viewportScroller.scrollToPosition).toHaveBeenCalledWith([10, 100]);
        }));
    });
    function createRouterScroller(_a) {
        var scrollPositionRestoration = _a.scrollPositionRestoration, anchorScrolling = _a.anchorScrolling;
        var events = new rxjs_1.Subject();
        var router = {
            events: events,
            parseUrl: function (url) { return new router_1.DefaultUrlSerializer().parse(url); },
            triggerEvent: function (e) { return events.next(e); }
        };
        var viewportScroller = jasmine.createSpyObj('viewportScroller', ['getScrollPosition', 'scrollToPosition', 'scrollToAnchor', 'setHistoryScrollRestoration']);
        setScroll(viewportScroller, 0, 0);
        var scroller = new router_scroller_1.RouterScroller(router, viewportScroller, { scrollPositionRestoration: scrollPositionRestoration, anchorScrolling: anchorScrolling });
        scroller.init();
        return { events: events, viewportScroller: viewportScroller, router: router };
    }
    function setScroll(viewportScroller, x, y) {
        viewportScroller.getScrollPosition.and.returnValue([x, y]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVyX3Njcm9sbGVyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9yb3V0ZXIvdGVzdC9yb3V0ZXJfc2Nyb2xsZXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGlEQUFzRDtBQUN0RCwwQ0FBa0c7QUFDbEcsNkJBQTZCO0FBQzdCLDRDQUFpRDtBQUVqRCx3Q0FBcUM7QUFDckMsMERBQXNEO0FBRXRELFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN6QixFQUFFLENBQUMsc0JBQXNCLEVBQUU7UUFDekIsSUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFPLEVBQWUsQ0FBQztRQUMxQyxJQUFNLE1BQU0sR0FBUTtZQUNsQixNQUFNLFFBQUE7WUFDTixRQUFRLEVBQUUsVUFBQyxHQUFRLElBQUssT0FBQSxJQUFJLDZCQUFvQixFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFyQyxDQUFxQztZQUM3RCxZQUFZLEVBQUUsVUFBQyxDQUFNLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFkLENBQWM7U0FDekMsQ0FBQztRQUVGLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FDekMsa0JBQWtCLEVBQ2xCLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbEMsSUFBTSxRQUFRLEdBQUcsSUFBSSxnQ0FBYyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVwRCxNQUFNLENBQUUsUUFBZ0IsQ0FBQyxPQUFPLENBQUMseUJBQXlCLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0UsTUFBTSxDQUFFLFFBQWdCLENB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QyxDQUFDLENBQUMsQ0FBQztZQUVsRixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVyQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVyQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUVyQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksd0JBQWUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFDLFlBQVksRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekUsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFhLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBRTlDLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNWLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1lBRWpFLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSx3QkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUMsWUFBWSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztZQUN6RSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQWEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7WUFFOUMsY0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ1gsTUFBTSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1RSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7SUFHSCw4QkFBOEIsRUFHN0I7WUFIOEIsd0RBQXlCLEVBQUUsb0NBQWU7UUFJdkUsSUFBTSxNQUFNLEdBQUcsSUFBSSxjQUFPLEVBQWUsQ0FBQztRQUMxQyxJQUFNLE1BQU0sR0FBUTtZQUNsQixNQUFNLFFBQUE7WUFDTixRQUFRLEVBQUUsVUFBQyxHQUFRLElBQUssT0FBQSxJQUFJLDZCQUFvQixFQUFFLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFyQyxDQUFxQztZQUM3RCxZQUFZLEVBQUUsVUFBQyxDQUFNLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFkLENBQWM7U0FDekMsQ0FBQztRQUVGLElBQU0sZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FDekMsa0JBQWtCLEVBQ2xCLENBQUMsbUJBQW1CLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLEVBQUUsNkJBQTZCLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFbEMsSUFBTSxRQUFRLEdBQ1YsSUFBSSxnQ0FBYyxDQUFDLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxFQUFDLHlCQUF5QiwyQkFBQSxFQUFFLGVBQWUsaUJBQUEsRUFBQyxDQUFDLENBQUM7UUFDL0YsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBRWhCLE9BQU8sRUFBQyxNQUFNLFFBQUEsRUFBRSxnQkFBZ0Isa0JBQUEsRUFBRSxNQUFNLFFBQUEsRUFBQyxDQUFDO0lBQzVDLENBQUM7SUFFRCxtQkFBbUIsZ0JBQXFCLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDNUQsZ0JBQWdCLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyJ9