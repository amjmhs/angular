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
    testing_internal_1.describe('chrome driver extension', function () {
        var CHROME45_USER_AGENT = '"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2499.0 Safari/537.36"';
        var log;
        var extension;
        var blinkEvents = new trace_event_factory_1.TraceEventFactory('blink.console', 'pid0');
        var v8Events = new trace_event_factory_1.TraceEventFactory('v8', 'pid0');
        var v8EventsOtherProcess = new trace_event_factory_1.TraceEventFactory('v8', 'pid1');
        var chromeTimelineEvents = new trace_event_factory_1.TraceEventFactory('disabled-by-default-devtools.timeline', 'pid0');
        var chrome45TimelineEvents = new trace_event_factory_1.TraceEventFactory('devtools.timeline', 'pid0');
        var chromeTimelineV8Events = new trace_event_factory_1.TraceEventFactory('devtools.timeline,v8', 'pid0');
        var chromeBlinkTimelineEvents = new trace_event_factory_1.TraceEventFactory('blink,devtools.timeline', 'pid0');
        var chromeBlinkUserTimingEvents = new trace_event_factory_1.TraceEventFactory('blink.user_timing', 'pid0');
        var benchmarkEvents = new trace_event_factory_1.TraceEventFactory('benchmark', 'pid0');
        var normEvents = new trace_event_factory_1.TraceEventFactory('timeline', 'pid0');
        function createExtension(perfRecords, userAgent, messageMethod) {
            if (perfRecords === void 0) { perfRecords = null; }
            if (userAgent === void 0) { userAgent = null; }
            if (messageMethod === void 0) { messageMethod = 'Tracing.dataCollected'; }
            if (!perfRecords) {
                perfRecords = [];
            }
            if (userAgent == null) {
                userAgent = CHROME45_USER_AGENT;
            }
            log = [];
            extension = index_1.Injector
                .create([
                index_1.ChromeDriverExtension.PROVIDERS, {
                    provide: index_1.WebDriverAdapter,
                    useValue: new MockDriverAdapter(log, perfRecords, messageMethod)
                },
                { provide: index_1.Options.USER_AGENT, useValue: userAgent }
            ])
                .get(index_1.ChromeDriverExtension);
            return extension;
        }
        testing_internal_1.it('should force gc via window.gc()', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().gc().then(function (_) {
                testing_internal_1.expect(log).toEqual([['executeScript', 'window.gc()']]);
                async.done();
            });
        }));
        testing_internal_1.it('should clear the perf logs and mark the timeline via console.time() on the first call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension().timeBegin('someName').then(function () {
                testing_internal_1.expect(log).toEqual([['logs', 'performance'], ['executeScript', "console.time('someName');"]]);
                async.done();
            });
        }));
        testing_internal_1.it('should mark the timeline via console.time() on the second call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var ext = createExtension();
            ext.timeBegin('someName')
                .then(function (_) {
                log.splice(0, log.length);
                ext.timeBegin('someName');
            })
                .then(function () {
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
        testing_internal_1.it('should normalize times to ms and forward ph and pid event properties', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.complete('FunctionCall', 1100, 5500, null)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.complete('script', 1.1, 5.5, null),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should normalize "tdur" to "dur"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            var event = chromeTimelineV8Events.create('X', 'FunctionCall', 1100, null);
            event['tdur'] = 5500;
            createExtension([event]).readPerfLog().then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.complete('script', 1.1, 5.5, null),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should report FunctionCall events as "script"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('FunctionCall', 0)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.start('script', 0),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should report EvaluateScript events as "script"', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('EvaluateScript', 0)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.start('script', 0),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should report minor gc', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([
                chromeTimelineV8Events.start('MinorGC', 1000, { 'usedHeapSizeBefore': 1000 }),
                chromeTimelineV8Events.end('MinorGC', 2000, { 'usedHeapSizeAfter': 0 }),
            ])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events.length).toEqual(2);
                testing_internal_1.expect(events[0]).toEqual(normEvents.start('gc', 1.0, { 'usedHeapSize': 1000, 'majorGc': false }));
                testing_internal_1.expect(events[1]).toEqual(normEvents.end('gc', 2.0, { 'usedHeapSize': 0, 'majorGc': false }));
                async.done();
            });
        }));
        testing_internal_1.it('should report major gc', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([
                chromeTimelineV8Events.start('MajorGC', 1000, { 'usedHeapSizeBefore': 1000 }),
                chromeTimelineV8Events.end('MajorGC', 2000, { 'usedHeapSizeAfter': 0 }),
            ])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events.length).toEqual(2);
                testing_internal_1.expect(events[0]).toEqual(normEvents.start('gc', 1.0, { 'usedHeapSize': 1000, 'majorGc': true }));
                testing_internal_1.expect(events[1]).toEqual(normEvents.end('gc', 2.0, { 'usedHeapSize': 0, 'majorGc': true }));
                async.done();
            });
        }));
        ['Layout', 'UpdateLayerTree', 'Paint'].forEach(function (recordType) {
            testing_internal_1.it("should report " + recordType + " as \"render\"", testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([
                    chrome45TimelineEvents.start(recordType, 1234),
                    chrome45TimelineEvents.end(recordType, 2345)
                ])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([
                        normEvents.start('render', 1.234),
                        normEvents.end('render', 2.345),
                    ]);
                    async.done();
                });
            }));
        });
        testing_internal_1.it("should report UpdateLayoutTree as \"render\"", testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([
                chromeBlinkTimelineEvents.start('UpdateLayoutTree', 1234),
                chromeBlinkTimelineEvents.end('UpdateLayoutTree', 2345)
            ])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([
                    normEvents.start('render', 1.234),
                    normEvents.end('render', 2.345),
                ]);
                async.done();
            });
        }));
        testing_internal_1.it('should ignore FunctionCalls from webdriver', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('FunctionCall', 0, { 'data': { 'scriptName': 'InjectedScript' } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([]);
                async.done();
            });
        }));
        testing_internal_1.it('should ignore FunctionCalls with empty scriptName', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeTimelineV8Events.start('FunctionCall', 0, { 'data': { 'scriptName': '' } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([]);
                async.done();
            });
        }));
        testing_internal_1.it('should report navigationStart', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chromeBlinkUserTimingEvents.instant('navigationStart', 1234)])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([normEvents.instant('navigationStart', 1.234)]);
                async.done();
            });
        }));
        testing_internal_1.it('should report receivedData', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chrome45TimelineEvents.instant('ResourceReceivedData', 1234, { 'data': { 'encodedDataLength': 987 } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([normEvents.instant('receivedData', 1.234, { 'encodedDataLength': 987 })]);
                async.done();
            });
        }));
        testing_internal_1.it('should report sendRequest', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension([chrome45TimelineEvents.instant('ResourceSendRequest', 1234, { 'data': { 'url': 'http://here', 'requestMethod': 'GET' } })])
                .readPerfLog()
                .then(function (events) {
                testing_internal_1.expect(events).toEqual([normEvents.instant('sendRequest', 1.234, { 'url': 'http://here', 'method': 'GET' })]);
                async.done();
            });
        }));
        testing_internal_1.describe('readPerfLog (common)', function () {
            testing_internal_1.it('should execute a dummy script before reading them', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                // TODO(tbosch): This seems to be a bug in ChromeDriver:
                // Sometimes it does not report the newest events of the performance log
                // to the WebDriver client unless a script is executed...
                createExtension([]).readPerfLog().then(function (_) {
                    testing_internal_1.expect(log).toEqual([['executeScript', '1+1'], ['logs', 'performance']]);
                    async.done();
                });
            }));
            ['Rasterize', 'CompositeLayers'].forEach(function (recordType) {
                testing_internal_1.it("should report " + recordType + " as \"render\"", testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([
                        chromeTimelineEvents.start(recordType, 1234),
                        chromeTimelineEvents.end(recordType, 2345)
                    ])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([
                            normEvents.start('render', 1.234),
                            normEvents.end('render', 2.345),
                        ]);
                        async.done();
                    });
                }));
            });
            testing_internal_1.describe('frame metrics', function () {
                testing_internal_1.it('should report ImplThreadRenderingStats as frame event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([benchmarkEvents.instant('BenchmarkInstrumentation::ImplThreadRenderingStats', 1100, { 'data': { 'frame_count': 1 } })])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([
                            normEvents.instant('frame', 1.1),
                        ]);
                        async.done();
                    });
                }));
                testing_internal_1.it('should not report ImplThreadRenderingStats with zero frames', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([benchmarkEvents.instant('BenchmarkInstrumentation::ImplThreadRenderingStats', 1100, { 'data': { 'frame_count': 0 } })])
                        .readPerfLog()
                        .then(function (events) {
                        testing_internal_1.expect(events).toEqual([]);
                        async.done();
                    });
                }));
                testing_internal_1.it('should throw when ImplThreadRenderingStats contains more than one frame', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    createExtension([benchmarkEvents.instant('BenchmarkInstrumentation::ImplThreadRenderingStats', 1100, { 'data': { 'frame_count': 2 } })])
                        .readPerfLog()
                        .catch(function (err) {
                        testing_internal_1.expect(function () {
                            throw err;
                        }).toThrowError('multi-frame render stats not supported');
                        async.done();
                    });
                }));
            });
            testing_internal_1.it('should report begin timestamps', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([blinkEvents.create('S', 'someName', 1000)])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.markStart('someName', 1.0)]);
                    async.done();
                });
            }));
            testing_internal_1.it('should report end timestamps', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([blinkEvents.create('F', 'someName', 1000)])
                    .readPerfLog()
                    .then(function (events) {
                    testing_internal_1.expect(events).toEqual([normEvents.markEnd('someName', 1.0)]);
                    async.done();
                });
            }));
            testing_internal_1.it('should throw an error on buffer overflow', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                createExtension([
                    chromeTimelineEvents.start('FunctionCall', 1234),
                ], CHROME45_USER_AGENT, 'Tracing.bufferUsage')
                    .readPerfLog()
                    .catch(function (err) {
                    testing_internal_1.expect(function () {
                        throw err;
                    }).toThrowError('The DevTools trace buffer filled during the test!');
                    async.done();
                });
            }));
            testing_internal_1.it('should match chrome browsers', function () {
                testing_internal_1.expect(createExtension().supports({ 'browserName': 'chrome' })).toBe(true);
                testing_internal_1.expect(createExtension().supports({ 'browserName': 'Chrome' })).toBe(true);
            });
        });
    });
}
var MockDriverAdapter = /** @class */ (function (_super) {
    __extends(MockDriverAdapter, _super);
    function MockDriverAdapter(_log, _events, _messageMethod) {
        var _this = _super.call(this) || this;
        _this._log = _log;
        _this._events = _events;
        _this._messageMethod = _messageMethod;
        return _this;
    }
    MockDriverAdapter.prototype.executeScript = function (script) {
        this._log.push(['executeScript', script]);
        return Promise.resolve(null);
    };
    MockDriverAdapter.prototype.logs = function (type) {
        var _this = this;
        this._log.push(['logs', type]);
        if (type === 'performance') {
            return Promise.resolve(this._events.map(function (event) { return ({
                'message': JSON.stringify({ 'message': { 'method': _this._messageMethod, 'params': event } }, null, 2)
            }); }));
        }
        else {
            return null;
        }
    };
    return MockDriverAdapter;
}(index_1.WebDriverAdapter));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lX2RyaXZlcl9leHRlbnNpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC93ZWJkcml2ZXIvY2hyb21lX2RyaXZlcl9leHRlbnNpb25fc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCwrRUFBaUg7QUFFakgscUNBQTJHO0FBQzNHLDhEQUF5RDtBQUV6RDtJQUNFLDJCQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsSUFBTSxtQkFBbUIsR0FDckIsMkhBQTJILENBQUM7UUFFaEksSUFBSSxHQUFVLENBQUM7UUFDZixJQUFJLFNBQWdDLENBQUM7UUFFckMsSUFBTSxXQUFXLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDbkUsSUFBTSxRQUFRLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsSUFBTSxvQkFBb0IsR0FBRyxJQUFJLHVDQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRSxJQUFNLG9CQUFvQixHQUN0QixJQUFJLHVDQUFpQixDQUFDLHVDQUF1QyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLElBQU0sc0JBQXNCLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNsRixJQUFNLHNCQUFzQixHQUFHLElBQUksdUNBQWlCLENBQUMsc0JBQXNCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckYsSUFBTSx5QkFBeUIsR0FBRyxJQUFJLHVDQUFpQixDQUFDLHlCQUF5QixFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNGLElBQU0sMkJBQTJCLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN2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