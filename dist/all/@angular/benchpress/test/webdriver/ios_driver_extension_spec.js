"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
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
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
var trace_event_factory_1 = require("../trace_event_factory");
{
    testing_internal_1.describe('ios driver extension', function () {
        var log;
        var extension;
        var normEvents = new trace_event_factory_1.TraceEventFactory('timeline', 'pid0');
        function createExtension(perfRecords) {
            if (perfRecords === void 0) { perfRecords = null; }
            if (!perfRecords) {
                perfRecords = [];
            }
            log = [];
            extension =
                index_1.Injector
                    .create([
                    index_1.IOsDriverExtension.PROVIDERS,
                    { provide: index_1.WebDriverAdapter, useValue: new MockDriverAdapter(log, perfRecords) }
                ])
                    .get(index_1.IOsDriverExtension);
            return extension;
        }
        testing_internal_1.it('should throw on forcing gc', function () {
            testing_internal_1.expect(function () { return createExtension().gc(); }).toThrowError('Force GC is not supported on iOS');
        });
        testing_internal_1.it('should mark the timeline via console.time()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeBegin('someName').then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', "console.time('someName');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should mark the timeline via console.timeEnd()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeEnd('someName', null).then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', "console.timeEnd('someName');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should mark the timeline via console.time() and console.timeEnd()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeEnd('name1', 'name2').then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', "console.timeEnd('name1');console.time('name2');"]]);
                async.done();
            });
        }));
        testing_internal_1.describe('readPerfLog', function () {
            testing_internal_1.it('should execute a dummy script before reading them', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                // TODO(tbosch): This seems to be a bug in ChromeDriver:
                // Sometimes it does not report the newest events of the performance log
                // to the WebDriver client unless a script is executed...
                createExtension([]).readPerfLog().then(function (_) {
                    testing_internal_1.expect(log).toEqual([['executeScript', '1+1'], ['logs', 'performance']]);
                    async.done();
                });
            }));
            testing_internal_1.it('should report FunctionCall records as "script"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([durationRecord('FunctionCall', 1, 5)]).readPerfLog().then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.start('script', 1), normEvents.end('script', 5)]);
                    async.done();
                });
            }));
            testing_internal_1.it('should ignore FunctionCalls from webdriver', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([internalScriptRecord(1, 5)]).readPerfLog().then(function (events) {
                    testing_internal_1.expect(events).toEqual([]);
                    async.done();
                });
            }));
            testing_internal_1.it('should report begin time', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([timeBeginRecord('someName', 12)]).readPerfLog().then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.markStart('someName', 12)]);
                    async.done();
                });
            }));
            testing_internal_1.it('should report end timestamps', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([timeEndRecord('someName', 12)]).readPerfLog().then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.markEnd('someName', 12)]);
                    async.done();
                });
            }));
            ['RecalculateStyles', 'Layout', 'UpdateLayerTree', 'Paint', 'Rasterize', 'CompositeLayers']
                .forEach(function (recordType) {
                testing_internal_1.it("should report " + recordType, testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([durationRecord(recordType, 0, 1)])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([
                            normEvents.start('render', 0),
                            normEvents.end('render', 1),
                        ]);
                        async.done();
                    });
                }));
            });
            testing_internal_1.it('should walk children', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([durationRecord('FunctionCall', 1, 5, [timeBeginRecord('someName', 2)])])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([
                        normEvents.start('script', 1), normEvents.markStart('someName', 2),
                        normEvents.end('script', 5)
                    ]);
                    async.done();
                });
            }));
            testing_internal_1.it('should match safari browsers', function () {
                testing_internal_1.expect(createExtension().supports({ 'browserName': 'safari' })).toBe(true);
                testing_internal_1.expect(createExtension().supports({ 'browserName': 'Safari' })).toBe(true);
            });
        });
    });
}
function timeBeginRecord(name, time) {
    return { 'type': 'Time', 'startTime': time, 'data': { 'message': name } };
}
function timeEndRecord(name, time) {
    return { 'type': 'TimeEnd', 'startTime': time, 'data': { 'message': name } };
}
function durationRecord(type, startTime, endTime, children) {
    if (children === void 0) { children = null; }
    if (!children) {
        children = [];
    }
    return { 'type': type, 'startTime': startTime, 'endTime': endTime, 'children': children };
}
function internalScriptRecord(startTime, endTime) {
    return {
        'type': 'FunctionCall',
        'startTime': startTime,
        'endTime': endTime,
        'data': { 'scriptName': 'InjectedScript' }
    };
}
var MockDriverAdapter = /** @class */ (function (_super) {
    __extends(MockDriverAdapter, _super);
    function MockDriverAdapter(_log, _perfRecords) {
        var _this = _super.call(this) || this;
        _this._log = _log;
        _this._perfRecords = _perfRecords;
        return _this;
    }
    MockDriverAdapter.prototype.executeScript = function (script) {
        this._log.push(['executeScript', script]);
        return Promise.resolve(null);
    };
    MockDriverAdapter.prototype.logs = function (type) {
        this._log.push(['logs', type]);
        if (type === 'performance') {
            return Promise.resolve(this._perfRecords.map(function (record) {
                return {
                    'message': JSON.stringify({ 'message': { 'method': 'Timeline.eventRecorded', 'params': { 'record': record } } }, null, 2)
                };
            }));
        }
        else {
            return null;
        }
    };
    return MockDriverAdapter;
}(index_1.WebDriverAdapter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW9zX2RyaXZlcl9leHRlbnNpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC93ZWJkcml2ZXIvaW9zX2RyaXZlcl9leHRlbnNpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrRUFBNEc7QUFFNUcscUNBQStGO0FBQy9GLDhEQUF5RDtBQUV6RDtJQUNFLDJCQUFRLENBQUMsc0JBQXNCLEVBQUU7UUFDL0IsSUFBSSxHQUFVLENBQUM7UUFDZixJQUFJLFNBQTZCLENBQUM7UUFFbEMsSUFBTSxVQUFVLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFN0QseUJBQXlCLFdBQWdDO1lBQWhDLDRCQUFBLEVBQUEsa0JBQWdDO1lBQ3ZELElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ2hCLFdBQVcsR0FBRyxFQUFFLENBQUM7YUFDbEI7WUFDRCxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsU0FBUztnQkFDTCxnQkFBUTtxQkFDSCxNQUFNLENBQUM7b0JBQ04sMEJBQWtCLENBQUMsU0FBUztvQkFDNUIsRUFBQyxPQUFPLEVBQUUsd0JBQWdCLEVBQUUsUUFBUSxFQUFFLElBQUksaUJBQWlCLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxFQUFDO2lCQUMvRSxDQUFDO3FCQUNELEdBQUcsQ0FBQywwQkFBa0IsQ0FBQyxDQUFDO1lBQ2pDLE9BQU8sU0FBUyxDQUFDO1FBQ25CLENBQUM7UUFFRCxxQkFBRSxDQUFDLDRCQUE0QixFQUFFO1lBQy9CLHlCQUFNLENBQUMsY0FBTSxPQUFBLGVBQWUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUF0QixDQUFzQixDQUFDLENBQUMsWUFBWSxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDeEYsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFB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