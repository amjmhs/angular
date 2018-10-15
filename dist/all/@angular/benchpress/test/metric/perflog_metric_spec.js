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
(function () {
    var commandLog;
    var eventFactory = new trace_event_factory_1.TraceEventFactory('timeline', 'pid0');
    function createMetric(perfLogs, perfLogFeatures, _a) {
        var _b = _a === void 0 ? {} : _a, microMetrics = _b.microMetrics, forceGc = _b.forceGc, captureFrames = _b.captureFrames, receivedData = _b.receivedData, requestCount = _b.requestCount, ignoreNavigation = _b.ignoreNavigation;
        commandLog = [];
        if (!perfLogFeatures) {
            perfLogFeatures =
                new index_1.PerfLogFeatures({ render: true, gc: true, frameCapture: true, userTiming: true });
        }
        if (!microMetrics) {
            microMetrics = {};
        }
        var providers = [
            index_1.Options.DEFAULT_PROVIDERS, index_1.PerflogMetric.PROVIDERS,
            { provide: index_1.Options.MICRO_METRICS, useValue: microMetrics }, {
                provide: index_1.PerflogMetric.SET_TIMEOUT,
                useValue: function (fn, millis) {
                    commandLog.push(['setTimeout', millis]);
                    fn();
                },
            },
            {
                provide: index_1.WebDriverExtension,
                useValue: new MockDriverExtension(perfLogs, commandLog, perfLogFeatures)
            }
        ];
        if (forceGc != null) {
            providers.push({ provide: index_1.Options.FORCE_GC, useValue: forceGc });
        }
        if (captureFrames != null) {
            providers.push({ provide: index_1.Options.CAPTURE_FRAMES, useValue: captureFrames });
        }
        if (receivedData != null) {
            providers.push({ provide: index_1.Options.RECEIVED_DATA, useValue: receivedData });
        }
        if (requestCount != null) {
            providers.push({ provide: index_1.Options.REQUEST_COUNT, useValue: requestCount });
        }
        if (ignoreNavigation != null) {
            providers.push({ provide: index_1.PerflogMetric.IGNORE_NAVIGATION, useValue: ignoreNavigation });
        }
        return index_1.Injector.create(providers).get(index_1.PerflogMetric);
    }
    testing_internal_1.describe('perflog metric', function () {
        function sortedKeys(stringMap) {
            var res = [];
            res.push.apply(res, Object.keys(stringMap));
            res.sort();
            return res;
        }
        testing_internal_1.it('should describe itself based on the perfLogFeatrues', function () {
            testing_internal_1.expect(sortedKeys(createMetric([[]], new index_1.PerfLogFeatures()).describe())).toEqual([
                'pureScriptTime', 'scriptTime'
            ]);
            testing_internal_1.expect(sortedKeys(createMetric([[]], new index_1.PerfLogFeatures({ render: true, gc: false })).describe()))
                .toEqual(['pureScriptTime', 'renderTime', 'scriptTime']);
            testing_internal_1.expect(sortedKeys(createMetric([[]], null).describe())).toEqual([
                'gcAmount', 'gcTime', 'majorGcTime', 'pureScriptTime', 'renderTime', 'scriptTime'
            ]);
            testing_internal_1.expect(sortedKeys(createMetric([[]], new index_1.PerfLogFeatures({ render: true, gc: true }), {
                forceGc: true
            }).describe()))
                .toEqual([
                'forcedGcAmount', 'forcedGcTime', 'gcAmount', 'gcTime', 'majorGcTime', 'pureScriptTime',
                'renderTime', 'scriptTime'
            ]);
            testing_internal_1.expect(sortedKeys(createMetric([[]], new index_1.PerfLogFeatures({ userTiming: true }), {
                receivedData: true,
                requestCount: true
            }).describe()))
                .toEqual(['pureScriptTime', 'receivedData', 'requestCount', 'scriptTime']);
        });
        testing_internal_1.it('should describe itself based on micro metrics', function () {
            var description = createMetric([[]], null, { microMetrics: { 'myMicroMetric': 'someDesc' } }).describe();
            testing_internal_1.expect(description['myMicroMetric']).toEqual('someDesc');
        });
        testing_internal_1.it('should describe itself if frame capture is requested and available', function () {
            var description = createMetric([[]], new index_1.PerfLogFeatures({ frameCapture: true }), {
                captureFrames: true
            }).describe();
            testing_internal_1.expect(description['frameTime.mean']).not.toContain('WARNING');
            testing_internal_1.expect(description['frameTime.best']).not.toContain('WARNING');
            testing_internal_1.expect(description['frameTime.worst']).not.toContain('WARNING');
            testing_internal_1.expect(description['frameTime.smooth']).not.toContain('WARNING');
        });
        testing_internal_1.it('should describe itself if frame capture is requested and not available', function () {
            var description = createMetric([[]], new index_1.PerfLogFeatures({ frameCapture: false }), {
                captureFrames: true
            }).describe();
            testing_internal_1.expect(description['frameTime.mean']).toContain('WARNING');
            testing_internal_1.expect(description['frameTime.best']).toContain('WARNING');
            testing_internal_1.expect(description['frameTime.worst']).toContain('WARNING');
            testing_internal_1.expect(description['frameTime.smooth']).toContain('WARNING');
        });
        testing_internal_1.describe('beginMeasure', function () {
            testing_internal_1.it('should not force gc and mark the timeline', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var metric = createMetric([[]], null);
                metric.beginMeasure().then(function (_) {
                    testing_internal_1.expect(commandLog).toEqual([['timeBegin', 'benchpress0']]);
                    async.done();
                });
            }));
            testing_internal_1.it('should force gc and mark the timeline', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var metric = createMetric([[]], null, { forceGc: true });
                metric.beginMeasure().then(function (_) {
                    testing_internal_1.expect(commandLog).toEqual([['gc'], ['timeBegin', 'benchpress0']]);
                    async.done();
                });
            }));
        });
        testing_internal_1.describe('endMeasure', function () {
            testing_internal_1.it('should mark and aggregate events in between the marks', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var events = [[
                        eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 4),
                        eventFactory.end('script', 6), eventFactory.markEnd('benchpress0', 10)
                    ]];
                var metric = createMetric(events, null);
                metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                    testing_internal_1.expect(commandLog).toEqual([
                        ['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', null], 'readPerfLog'
                    ]);
                    testing_internal_1.expect(data['scriptTime']).toBe(2);
                    async.done();
                });
            }));
            testing_internal_1.it('should mark and aggregate events since navigationStart', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var events = [[
                        eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 4),
                        eventFactory.end('script', 6), eventFactory.instant('navigationStart', 7),
                        eventFactory.start('script', 8), eventFactory.end('script', 9),
                        eventFactory.markEnd('benchpress0', 10)
                    ]];
                var metric = createMetric(events, null);
                metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(1);
                    async.done();
                });
            }));
            testing_internal_1.it('should ignore navigationStart if ignoreNavigation is set', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var events = [[
                        eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 4),
                        eventFactory.end('script', 6), eventFactory.instant('navigationStart', 7),
                        eventFactory.start('script', 8), eventFactory.end('script', 9),
                        eventFactory.markEnd('benchpress0', 10)
                    ]];
                var metric = createMetric(events, null, { ignoreNavigation: true });
                metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(3);
                    async.done();
                });
            }));
            testing_internal_1.it('should restart timing', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var events = [
                    [
                        eventFactory.markStart('benchpress0', 0),
                        eventFactory.markEnd('benchpress0', 1),
                        eventFactory.markStart('benchpress1', 2),
                    ],
                    [eventFactory.markEnd('benchpress1', 3)]
                ];
                var metric = createMetric(events, null);
                metric.beginMeasure()
                    .then(function (_) { return metric.endMeasure(true); })
                    .then(function (_) { return metric.endMeasure(true); })
                    .then(function (_) {
                    testing_internal_1.expect(commandLog).toEqual([
                        ['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', 'benchpress1'],
                        'readPerfLog', ['timeEnd', 'benchpress1', 'benchpress2'], 'readPerfLog'
                    ]);
                    async.done();
                });
            }));
            testing_internal_1.it('should loop and aggregate until the end mark is present', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var events = [
                    [eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 1)],
                    [eventFactory.end('script', 2)],
                    [
                        eventFactory.start('script', 3), eventFactory.end('script', 5),
                        eventFactory.markEnd('benchpress0', 10)
                    ]
                ];
                var metric = createMetric(events, null);
                metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                    testing_internal_1.expect(commandLog).toEqual([
                        ['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', null], 'readPerfLog',
                        ['setTimeout', 100], 'readPerfLog', ['setTimeout', 100], 'readPerfLog'
                    ]);
                    testing_internal_1.expect(data['scriptTime']).toBe(3);
                    async.done();
                });
            }));
            testing_internal_1.it('should store events after the end mark for the next call', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var events = [
                    [
                        eventFactory.markStart('benchpress0', 0), eventFactory.markEnd('benchpress0', 1),
                        eventFactory.markStart('benchpress1', 1), eventFactory.start('script', 1),
                        eventFactory.end('script', 2)
                    ],
                    [
                        eventFactory.start('script', 3), eventFactory.end('script', 5),
                        eventFactory.markEnd('benchpress1', 6)
                    ]
                ];
                var metric = createMetric(events, null);
                metric.beginMeasure()
                    .then(function (_) { return metric.endMeasure(true); })
                    .then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(0);
                    return metric.endMeasure(true);
                })
                    .then(function (data) {
                    testing_internal_1.expect(commandLog).toEqual([
                        ['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', 'benchpress1'],
                        'readPerfLog', ['timeEnd', 'benchpress1', 'benchpress2'], 'readPerfLog'
                    ]);
                    testing_internal_1.expect(data['scriptTime']).toBe(3);
                    async.done();
                });
            }));
            testing_internal_1.describe('with forced gc', function () {
                var events;
                testing_internal_1.beforeEach(function () {
                    events = [[
                            eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 4),
                            eventFactory.end('script', 6), eventFactory.markEnd('benchpress0', 10),
                            eventFactory.markStart('benchpress1', 11),
                            eventFactory.start('gc', 12, { 'usedHeapSize': 2500 }),
                            eventFactory.end('gc', 15, { 'usedHeapSize': 1000 }),
                            eventFactory.markEnd('benchpress1', 20)
                        ]];
                });
                testing_internal_1.it('should measure forced gc', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var metric = createMetric(events, null, { forceGc: true });
                    metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                        testing_internal_1.expect(commandLog).toEqual([
                            ['gc'], ['timeBegin', 'benchpress0'], ['timeEnd', 'benchpress0', 'benchpress1'],
                            'readPerfLog', ['gc'], ['timeEnd', 'benchpress1', null], 'readPerfLog'
                        ]);
                        testing_internal_1.expect(data['forcedGcTime']).toBe(3);
                        testing_internal_1.expect(data['forcedGcAmount']).toBe(1.5);
                        async.done();
                    });
                }));
                testing_internal_1.it('should restart after the forced gc if needed', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var metric = createMetric(events, null, { forceGc: true });
                    metric.beginMeasure().then(function (_) { return metric.endMeasure(true); }).then(function (data) {
                        testing_internal_1.expect(commandLog[5]).toEqual(['timeEnd', 'benchpress1', 'benchpress2']);
                        async.done();
                    });
                }));
            });
        });
        testing_internal_1.describe('aggregation', function () {
            function aggregate(events, _a) {
                var _b = _a === void 0 ? {} : _a, microMetrics = _b.microMetrics, captureFrames = _b.captureFrames, receivedData = _b.receivedData, requestCount = _b.requestCount;
                events.unshift(eventFactory.markStart('benchpress0', 0));
                events.push(eventFactory.markEnd('benchpress0', 10));
                var metric = createMetric([events], null, {
                    microMetrics: microMetrics,
                    captureFrames: captureFrames,
                    receivedData: receivedData,
                    requestCount: requestCount
                });
                return metric.beginMeasure().then(function (_) { return metric.endMeasure(false); });
            }
            testing_internal_1.describe('frame metrics', function () {
                testing_internal_1.it('should calculate mean frame time', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('frameCapture', 0), eventFactory.instant('frame', 1),
                        eventFactory.instant('frame', 3), eventFactory.instant('frame', 4),
                        eventFactory.markEnd('frameCapture', 5)
                    ], { captureFrames: true })
                        .then(function (data) {
                        testing_internal_1.expect(data['frameTime.mean']).toBe(((3 - 1) + (4 - 3)) / 2);
                        async.done();
                    });
                }));
                testing_internal_1.it('should throw if no start event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([eventFactory.instant('frame', 4), eventFactory.markEnd('frameCapture', 5)], { captureFrames: true })
                        .catch(function (err) {
                        testing_internal_1.expect(function () {
                            throw err;
                        }).toThrowError('missing start event for frame capture');
                        async.done();
                    });
                }));
                testing_internal_1.it('should throw if no end event', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([eventFactory.markStart('frameCapture', 3), eventFactory.instant('frame', 4)], { captureFrames: true })
                        .catch(function (err) {
                        testing_internal_1.expect(function () { throw err; }).toThrowError('missing end event for frame capture');
                        async.done();
                    });
                }));
                testing_internal_1.it('should throw if trying to capture twice', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('frameCapture', 3),
                        eventFactory.markStart('frameCapture', 4)
                    ], { captureFrames: true })
                        .catch(function (err) {
                        testing_internal_1.expect(function () {
                            throw err;
                        }).toThrowError('can capture frames only once per benchmark run');
                        async.done();
                    });
                }));
                testing_internal_1.it('should throw if trying to capture when frame capture is disabled', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([eventFactory.markStart('frameCapture', 3)]).catch(function (err) {
                        testing_internal_1.expect(function () { throw err; })
                            .toThrowError('found start event for frame capture, but frame capture was not requested in benchpress');
                        async.done();
                        return null;
                    });
                }));
                testing_internal_1.it('should throw if frame capture is enabled, but nothing is captured', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([], { captureFrames: true }).catch(function (err) {
                        testing_internal_1.expect(function () { throw err; })
                            .toThrowError('frame capture requested in benchpress, but no start event was found');
                        async.done();
                    });
                }));
                testing_internal_1.it('should calculate best and worst frame time', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('frameCapture', 0), eventFactory.instant('frame', 1),
                        eventFactory.instant('frame', 9), eventFactory.instant('frame', 15),
                        eventFactory.instant('frame', 18), eventFactory.instant('frame', 28),
                        eventFactory.instant('frame', 32), eventFactory.markEnd('frameCapture', 10)
                    ], { captureFrames: true })
                        .then(function (data) {
                        testing_internal_1.expect(data['frameTime.worst']).toBe(10);
                        testing_internal_1.expect(data['frameTime.best']).toBe(3);
                        async.done();
                    });
                }));
                testing_internal_1.it('should calculate percentage of smoothness to be good', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('frameCapture', 0), eventFactory.instant('frame', 1),
                        eventFactory.instant('frame', 2), eventFactory.instant('frame', 3),
                        eventFactory.markEnd('frameCapture', 4)
                    ], { captureFrames: true })
                        .then(function (data) {
                        testing_internal_1.expect(data['frameTime.smooth']).toBe(1.0);
                        async.done();
                    });
                }));
                testing_internal_1.it('should calculate percentage of smoothness to be bad', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('frameCapture', 0), eventFactory.instant('frame', 1),
                        eventFactory.instant('frame', 2), eventFactory.instant('frame', 22),
                        eventFactory.instant('frame', 23), eventFactory.instant('frame', 24),
                        eventFactory.markEnd('frameCapture', 4)
                    ], { captureFrames: true })
                        .then(function (data) {
                        testing_internal_1.expect(data['frameTime.smooth']).toBe(0.75);
                        async.done();
                    });
                }));
            });
            testing_internal_1.it('should report a single interval', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('script', 0), eventFactory.end('script', 5)
                ]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(5);
                    async.done();
                });
            }));
            testing_internal_1.it('should sum up multiple intervals', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('script', 0), eventFactory.end('script', 5),
                    eventFactory.start('script', 10), eventFactory.end('script', 17)
                ]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(12);
                    async.done();
                });
            }));
            testing_internal_1.it('should ignore not started intervals', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([eventFactory.end('script', 10)]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(0);
                    async.done();
                });
            }));
            testing_internal_1.it('should ignore not ended intervals', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([eventFactory.start('script', 10)]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(0);
                    async.done();
                });
            }));
            testing_internal_1.it('should ignore nested intervals', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('script', 0), eventFactory.start('script', 5),
                    eventFactory.end('script', 10), eventFactory.end('script', 17)
                ]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(17);
                    async.done();
                });
            }));
            testing_internal_1.it('should ignore events from different processed as the start mark', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var otherProcessEventFactory = new trace_event_factory_1.TraceEventFactory('timeline', 'pid1');
                var metric = createMetric([[
                        eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 0, null),
                        eventFactory.end('script', 5, null),
                        otherProcessEventFactory.start('script', 10, null),
                        otherProcessEventFactory.end('script', 17, null),
                        eventFactory.markEnd('benchpress0', 20)
                    ]], null);
                metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(5);
                    async.done();
                });
            }));
            testing_internal_1.it('should mark a run as invalid if the start and end marks are different', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var otherProcessEventFactory = new trace_event_factory_1.TraceEventFactory('timeline', 'pid1');
                var metric = createMetric([[
                        eventFactory.markStart('benchpress0', 0), eventFactory.start('script', 0, null),
                        eventFactory.end('script', 5, null),
                        otherProcessEventFactory.start('script', 10, null),
                        otherProcessEventFactory.end('script', 17, null),
                        otherProcessEventFactory.markEnd('benchpress0', 20)
                    ]], null);
                metric.beginMeasure().then(function (_) { return metric.endMeasure(false); }).then(function (data) {
                    testing_internal_1.expect(data['invalid']).toBe(1);
                    async.done();
                });
            }));
            testing_internal_1.it('should support scriptTime metric', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('script', 0), eventFactory.end('script', 5)
                ]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(5);
                    async.done();
                });
            }));
            testing_internal_1.it('should support renderTime metric', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('render', 0), eventFactory.end('render', 5)
                ]).then(function (data) {
                    testing_internal_1.expect(data['renderTime']).toBe(5);
                    async.done();
                });
            }));
            testing_internal_1.it('should support gcTime/gcAmount metric', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('gc', 0, { 'usedHeapSize': 2500 }),
                    eventFactory.end('gc', 5, { 'usedHeapSize': 1000 })
                ]).then(function (data) {
                    testing_internal_1.expect(data['gcTime']).toBe(5);
                    testing_internal_1.expect(data['gcAmount']).toBe(1.5);
                    testing_internal_1.expect(data['majorGcTime']).toBe(0);
                    async.done();
                });
            }));
            testing_internal_1.it('should support majorGcTime metric', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('gc', 0, { 'usedHeapSize': 2500 }),
                    eventFactory.end('gc', 5, { 'usedHeapSize': 1000, 'majorGc': true })
                ]).then(function (data) {
                    testing_internal_1.expect(data['gcTime']).toBe(5);
                    testing_internal_1.expect(data['majorGcTime']).toBe(5);
                    async.done();
                });
            }));
            testing_internal_1.it('should support pureScriptTime = scriptTime-gcTime-renderTime', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                aggregate([
                    eventFactory.start('script', 0), eventFactory.start('gc', 1, { 'usedHeapSize': 1000 }),
                    eventFactory.end('gc', 4, { 'usedHeapSize': 0 }), eventFactory.start('render', 4),
                    eventFactory.end('render', 5), eventFactory.end('script', 6)
                ]).then(function (data) {
                    testing_internal_1.expect(data['scriptTime']).toBe(6);
                    testing_internal_1.expect(data['pureScriptTime']).toBe(2);
                    async.done();
                });
            }));
            testing_internal_1.describe('receivedData', function () {
                testing_internal_1.it('should report received data since last navigationStart', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.instant('receivedData', 0, { 'encodedDataLength': 1 }),
                        eventFactory.instant('navigationStart', 1),
                        eventFactory.instant('receivedData', 2, { 'encodedDataLength': 2 }),
                        eventFactory.instant('navigationStart', 3),
                        eventFactory.instant('receivedData', 4, { 'encodedDataLength': 4 }),
                        eventFactory.instant('receivedData', 5, { 'encodedDataLength': 8 })
                    ], { receivedData: true })
                        .then(function (data) {
                        testing_internal_1.expect(data['receivedData']).toBe(12);
                        async.done();
                    });
                }));
            });
            testing_internal_1.describe('requestCount', function () {
                testing_internal_1.it('should report count of requests sent since last navigationStart', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.instant('sendRequest', 0),
                        eventFactory.instant('navigationStart', 1),
                        eventFactory.instant('sendRequest', 2),
                        eventFactory.instant('navigationStart', 3),
                        eventFactory.instant('sendRequest', 4), eventFactory.instant('sendRequest', 5)
                    ], { requestCount: true })
                        .then(function (data) {
                        testing_internal_1.expect(data['requestCount']).toBe(2);
                        async.done();
                    });
                }));
            });
            testing_internal_1.describe('microMetrics', function () {
                testing_internal_1.it('should report micro metrics', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('mm1', 0),
                        eventFactory.markEnd('mm1', 5),
                    ], { microMetrics: { 'mm1': 'micro metric 1' } })
                        .then(function (data) {
                        testing_internal_1.expect(data['mm1']).toBe(5.0);
                        async.done();
                    });
                }));
                testing_internal_1.it('should ignore micro metrics that were not specified', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('mm1', 0),
                        eventFactory.markEnd('mm1', 5),
                    ]).then(function (data) {
                        testing_internal_1.expect(data['mm1']).toBeFalsy();
                        async.done();
                    });
                }));
                testing_internal_1.it('should report micro metric averages', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    aggregate([
                        eventFactory.markStart('mm1*20', 0),
                        eventFactory.markEnd('mm1*20', 5),
                    ], { microMetrics: { 'mm1': 'micro metric 1' } })
                        .then(function (data) {
                        testing_internal_1.expect(data['mm1']).toBe(5 / 20);
                        async.done();
                    });
                }));
            });
        });
    });
})();
var MockDriverExtension = /** @class */ (function (_super) {
    __extends(MockDriverExtension, _super);
    function MockDriverExtension(_perfLogs, _commandLog, _perfLogFeatures) {
        var _this = _super.call(this) || this;
        _this._perfLogs = _perfLogs;
        _this._commandLog = _commandLog;
        _this._perfLogFeatures = _perfLogFeatures;
        return _this;
    }
    MockDriverExtension.prototype.timeBegin = function (name) {
        this._commandLog.push(['timeBegin', name]);
        return Promise.resolve(null);
    };
    MockDriverExtension.prototype.timeEnd = function (name, restartName) {
        this._commandLog.push(['timeEnd', name, restartName]);
        return Promise.resolve(null);
    };
    MockDriverExtension.prototype.perfLogFeatures = function () { return this._perfLogFeatures; };
    MockDriverExtension.prototype.readPerfLog = function () {
        this._commandLog.push('readPerfLog');
        if (this._perfLogs.length > 0) {
            var next = this._perfLogs[0];
            this._perfLogs.shift();
            return Promise.resolve(next);
        }
        else {
            return Promise.resolve([]);
        }
    };
    MockDriverExtension.prototype.gc = function () {
        this._commandLog.push(['gc']);
        return Promise.resolve(null);
    };
    return MockDriverExtension;
}(index_1.WebDriverExtension));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVyZmxvZ19tZXRyaWNfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC9tZXRyaWMvcGVyZmxvZ19tZXRyaWNfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFHSCwrRUFBd0g7QUFFeEgscUNBQXdIO0FBQ3hILDhEQUF5RDtBQUV6RCxDQUFDO0lBQ0MsSUFBSSxVQUFpQixDQUFDO0lBQ3RCLElBQU0sWUFBWSxHQUFHLElBQUksdUNBQWlCLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBRS9ELHNCQUNJLFFBQXdCLEVBQUUsZUFBZ0MsRUFDMUQsRUFPTTtZQVBOLDRCQU9NLEVBUEwsOEJBQVksRUFBRSxvQkFBTyxFQUFFLGdDQUFhLEVBQUUsOEJBQVksRUFBRSw4QkFBWSxFQUFFLHNDQUFnQjtRQVFyRixVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEIsZUFBZTtnQkFDWCxJQUFJLHVCQUFlLENBQUMsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztTQUN6RjtRQUNELElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakIsWUFBWSxHQUFHLEVBQUUsQ0FBQztTQUNuQjtRQUNELElBQU0sU0FBUyxHQUFxQjtZQUNsQyxlQUFPLENBQUMsaUJBQWlCLEVBQUUscUJBQWEsQ0FBQyxTQUFTO1lBQ2xELEVBQUMsT0FBTyxFQUFFLGVBQU8sQ0FBQyxhQUFhLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBQyxFQUFFO2dCQUN4RCxPQUFPLEVBQUUscUJBQWEsQ0FBQyxXQUFXO2dCQUNsQyxRQUFRLEVBQUUsVUFBQyxFQUFZLEVBQUUsTUFBYztvQkFDckMs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