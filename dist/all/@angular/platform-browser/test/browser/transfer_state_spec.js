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
var platform_browser_1 = require("@angular/platform-browser");
var transfer_state_1 = require("@angular/platform-browser/src/browser/transfer_state");
var dom_tokens_1 = require("@angular/platform-browser/src/dom/dom_tokens");
(function () {
    function removeScriptTag(doc, id) {
        var existing = doc.getElementById(id);
        if (existing) {
            doc.body.removeChild(existing);
        }
    }
    function addScriptTag(doc, appId, data) {
        var script = doc.createElement('script');
        var id = appId + '-state';
        script.id = id;
        script.setAttribute('type', 'application/json');
        script.textContent = transfer_state_1.escapeHtml(JSON.stringify(data));
        // Remove any stale script tags.
        removeScriptTag(doc, id);
        doc.body.appendChild(script);
    }
    describe('TransferState', function () {
        var APP_ID = 'test-app';
        var doc;
        var TEST_KEY = transfer_state_1.makeStateKey('test');
        var DELAYED_KEY = transfer_state_1.makeStateKey('delayed');
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [
                    platform_browser_1.BrowserModule.withServerTransition({ appId: APP_ID }),
                    platform_browser_1.BrowserTransferStateModule,
                ]
            });
            doc = testing_1.TestBed.get(dom_tokens_1.DOCUMENT);
        });
        afterEach(function () { removeScriptTag(doc, APP_ID + '-state'); });
        it('is initialized from script tag', function () {
            addScriptTag(doc, APP_ID, { test: 10 });
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            expect(transferState.get(TEST_KEY, 0)).toBe(10);
        });
        it('is initialized to empty state if script tag not found', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            expect(transferState.get(TEST_KEY, 0)).toBe(0);
        });
        it('supports adding new keys using set', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, 20);
            expect(transferState.get(TEST_KEY, 0)).toBe(20);
            expect(transferState.hasKey(TEST_KEY)).toBe(true);
        });
        it('supports setting and accessing value \'0\' via get', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, 0);
            expect(transferState.get(TEST_KEY, 20)).toBe(0);
            expect(transferState.hasKey(TEST_KEY)).toBe(true);
        });
        it('supports setting and accessing value \'false\' via get', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, false);
            expect(transferState.get(TEST_KEY, true)).toBe(false);
            expect(transferState.hasKey(TEST_KEY)).toBe(true);
        });
        it('supports setting and accessing value \'null\' via get', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, null);
            expect(transferState.get(TEST_KEY, 20)).toBe(null);
            expect(transferState.hasKey(TEST_KEY)).toBe(true);
        });
        it('supports removing keys', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, 20);
            transferState.remove(TEST_KEY);
            expect(transferState.get(TEST_KEY, 0)).toBe(0);
            expect(transferState.hasKey(TEST_KEY)).toBe(false);
        });
        it('supports serialization using toJson()', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, 20);
            expect(transferState.toJson()).toBe('{"test":20}');
        });
        it('calls onSerialize callbacks when calling toJson()', function () {
            var transferState = testing_1.TestBed.get(platform_browser_1.TransferState);
            transferState.set(TEST_KEY, 20);
            var value = 'initial';
            transferState.onSerialize(DELAYED_KEY, function () { return value; });
            value = 'changed';
            expect(transferState.toJson()).toBe('{"test":20,"delayed":"changed"}');
        });
    });
    describe('escape/unescape', function () {
        it('works with all escaped characters', function () {
            var testString = '</script><script>alert(\'Hello&\' + "World");';
            var testObj = { testString: testString };
            var escaped = transfer_state_1.escapeHtml(JSON.stringify(testObj));
            expect(escaped).toBe('{&q;testString&q;:&q;&l;/script&g;&l;script&g;' +
                'alert(&s;Hello&a;&s; + \\&q;World\\&q;);&q;}');
            var unescapedObj = JSON.parse(transfer_state_1.unescapeHtml(escaped));
            expect(unescapedObj['testString']).toBe(testString);
        });
    });
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXJfc3RhdGVfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3BsYXRmb3JtLWJyb3dzZXIvdGVzdC9icm93c2VyL3RyYW5zZmVyX3N0YXRlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxpREFBOEM7QUFDOUMsOERBQW1HO0FBQ25HLHVGQUFzSDtBQUN0SCwyRUFBc0U7QUFFdEUsQ0FBQztJQUNDLHlCQUF5QixHQUFhLEVBQUUsRUFBVTtRQUNoRCxJQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLElBQUksUUFBUSxFQUFFO1lBQ1osR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDaEM7SUFDSCxDQUFDO0lBRUQsc0JBQXNCLEdBQWEsRUFBRSxLQUFhLEVBQUUsSUFBUTtRQUMxRCxJQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLElBQU0sRUFBRSxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7UUFDNUIsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsQ0FBQyxDQUFDO1FBQ2hELE1BQU0sQ0FBQyxXQUFXLEdBQUcsMkJBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFdEQsZ0NBQWdDO1FBQ2hDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFFekIsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBTSxNQUFNLEdBQUcsVUFBVSxDQUFDO1FB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