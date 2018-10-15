"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var low_level_1 = require("../src/low_level");
var module_1 = require("../src/module");
var push_1 = require("../src/push");
var update_1 = require("../src/update");
var mock_1 = require("../testing/mock");
var async_1 = require("./async");
{
    describe('ServiceWorker library', function () {
        var mock;
        var comm;
        beforeEach(function () {
            mock = new mock_1.MockServiceWorkerContainer();
            comm = new low_level_1.NgswCommChannel(mock);
        });
        describe('NgswCommsChannel', function () {
            it('can access the registration when it comes before subscription', function (done) {
                var mock = new mock_1.MockServiceWorkerContainer();
                var comm = new low_level_1.NgswCommChannel(mock);
                var regPromise = mock.getRegistration();
                mock.setupSw();
                comm.registration.subscribe(function (reg) { done(); });
            });
            it('can access the registration when it comes after subscription', function (done) {
                var mock = new mock_1.MockServiceWorkerContainer();
                var comm = new low_level_1.NgswCommChannel(mock);
                var regPromise = mock.getRegistration();
                comm.registration.subscribe(function (reg) { done(); });
                mock.setupSw();
            });
        });
        describe('ngswCommChannelFactory', function () {
            it('gives disabled NgswCommChannel for platform-server', function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: core_1.PLATFORM_ID, useValue: 'server' },
                        { provide: module_1.RegistrationOptions, useValue: { enabled: true } }, {
                            provide: low_level_1.NgswCommChannel,
                            useFactory: module_1.ngswCommChannelFactory,
                            deps: [module_1.RegistrationOptions, core_1.PLATFORM_ID]
                        }
                    ]
                });
                expect(testing_1.TestBed.get(low_level_1.NgswCommChannel).isEnabled).toEqual(false);
            });
            it('gives disabled NgswCommChannel when \'enabled\' option is false', function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: core_1.PLATFORM_ID, useValue: 'browser' },
                        { provide: module_1.RegistrationOptions, useValue: { enabled: false } }, {
                            provide: low_level_1.NgswCommChannel,
                            useFactory: module_1.ngswCommChannelFactory,
                            deps: [module_1.RegistrationOptions, core_1.PLATFORM_ID]
                        }
                    ]
                });
                expect(testing_1.TestBed.get(low_level_1.NgswCommChannel).isEnabled).toEqual(false);
            });
            it('gives disabled NgswCommChannel when navigator.serviceWorker is undefined', function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: core_1.PLATFORM_ID, useValue: 'browser' },
                        { provide: module_1.RegistrationOptions, useValue: { enabled: true } },
                        {
                            provide: low_level_1.NgswCommChannel,
                            useFactory: module_1.ngswCommChannelFactory,
                            deps: [module_1.RegistrationOptions, core_1.PLATFORM_ID],
                        },
                    ],
                });
                var context = global || window;
                var originalDescriptor = Object.getOwnPropertyDescriptor(context, 'navigator');
                var patchedDescriptor = { value: { serviceWorker: undefined }, configurable: true };
                try {
                    // Set `navigator` to `{serviceWorker: undefined}`.
                    Object.defineProperty(context, 'navigator', patchedDescriptor);
                    expect(testing_1.TestBed.get(low_level_1.NgswCommChannel).isEnabled).toBe(false);
                }
                finally {
                    if (originalDescriptor) {
                        Object.defineProperty(context, 'navigator', originalDescriptor);
                    }
                    else {
                        delete context.navigator;
                    }
                }
            });
            it('gives enabled NgswCommChannel when browser supports SW and enabled option is true', function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        { provide: core_1.PLATFORM_ID, useValue: 'browser' },
                        { provide: module_1.RegistrationOptions, useValue: { enabled: true } }, {
                            provide: low_level_1.NgswCommChannel,
                            useFactory: module_1.ngswCommChannelFactory,
                            deps: [module_1.RegistrationOptions, core_1.PLATFORM_ID]
                        }
                    ]
                });
                var context = global || window;
                var originalDescriptor = Object.getOwnPropertyDescriptor(context, 'navigator');
                var patchedDescriptor = { value: { serviceWorker: mock }, configurable: true };
                try {
                    // Set `navigator` to `{serviceWorker: mock}`.
                    Object.defineProperty(context, 'navigator', patchedDescriptor);
                    expect(testing_1.TestBed.get(low_level_1.NgswCommChannel).isEnabled).toBe(true);
                }
                finally {
                    if (originalDescriptor) {
                        Object.defineProperty(context, 'navigator', originalDescriptor);
                    }
                    else {
                        delete context.navigator;
                    }
                }
            });
        });
        describe('SwPush', function () {
            var unpatchDecodeBase64;
            var push;
            // Patch `SwPush.decodeBase64()` in Node.js (where `atob` is not available).
            beforeAll(function () { return unpatchDecodeBase64 = mock_1.patchDecodeBase64(push_1.SwPush.prototype); });
            afterAll(function () { return unpatchDecodeBase64(); });
            beforeEach(function () {
                push = new push_1.SwPush(comm);
                mock.setupSw();
            });
            it('is injectable', function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        push_1.SwPush,
                        { provide: low_level_1.NgswCommChannel, useValue: comm },
                    ]
                });
                expect(function () { return testing_1.TestBed.get(push_1.SwPush); }).not.toThrow();
            });
            describe('requestSubscription()', function () {
                async_1.async_it('returns a promise that resolves to the subscription', function () { return __awaiter(_this, void 0, void 0, function () {
                    var promise, sub;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                promise = push.requestSubscription({ serverPublicKey: 'test' });
                                expect(promise).toEqual(jasmine.any(Promise));
                                return [4 /*yield*/, promise];
                            case 1:
                                sub = _a.sent();
                                expect(sub).toEqual(jasmine.any(mock_1.MockPushSubscription));
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('calls `PushManager.subscribe()` (with appropriate options)', function () { return __awaiter(_this, void 0, void 0, function () {
                    var decode, serverPublicKey, appServerKeyStr, pmSubscribeSpy, actualAppServerKey, actualAppServerKeyStr;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                decode = function (charCodeArr) {
                                    return Array.from(charCodeArr).map(function (c) { return String.fromCharCode(c); }).join('');
                                };
                                serverPublicKey = 'c3ViamVjdHM_';
                                appServerKeyStr = 'subjects?';
                                pmSubscribeSpy = spyOn(mock_1.MockPushManager.prototype, 'subscribe').and.callThrough();
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: serverPublicKey })];
                            case 1:
                                _a.sent();
                                expect(pmSubscribeSpy).toHaveBeenCalledTimes(1);
                                expect(pmSubscribeSpy).toHaveBeenCalledWith({
                                    applicationServerKey: jasmine.any(Uint8Array),
                                    userVisibleOnly: true,
                                });
                                actualAppServerKey = pmSubscribeSpy.calls.first().args[0].applicationServerKey;
                                actualAppServerKeyStr = decode(actualAppServerKey);
                                expect(actualAppServerKeyStr).toBe(appServerKeyStr);
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('emits the new `PushSubscription` on `SwPush.subscription`', function () { return __awaiter(_this, void 0, void 0, function () {
                    var subscriptionSpy, sub;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                                push.subscription.subscribe(subscriptionSpy);
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 1:
                                sub = _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledWith(sub);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('unsubscribe()', function () {
                var psUnsubscribeSpy;
                beforeEach(function () {
                    psUnsubscribeSpy = spyOn(mock_1.MockPushSubscription.prototype, 'unsubscribe').and.callThrough();
                });
                async_1.async_it('rejects if currently not subscribed to push notifications', function () { return __awaiter(_this, void 0, void 0, function () {
                    var err_1;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 2, , 3]);
                                return [4 /*yield*/, push.unsubscribe()];
                            case 1:
                                _a.sent();
                                throw new Error('`unsubscribe()` should fail');
                            case 2:
                                err_1 = _a.sent();
                                expect(err_1.message).toBe('Not subscribed to push notifications.');
                                return [3 /*break*/, 3];
                            case 3: return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('calls `PushSubscription.unsubscribe()`', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, push.unsubscribe()];
                            case 2:
                                _a.sent();
                                expect(psUnsubscribeSpy).toHaveBeenCalledTimes(1);
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('rejects if `PushSubscription.unsubscribe()` fails', function () { return __awaiter(_this, void 0, void 0, function () {
                    var err_2;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                psUnsubscribeSpy.and.callFake(function () { throw new Error('foo'); });
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, push.unsubscribe()];
                            case 3:
                                _a.sent();
                                throw new Error('`unsubscribe()` should fail');
                            case 4:
                                err_2 = _a.sent();
                                expect(err_2.message).toBe('foo');
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('rejects if `PushSubscription.unsubscribe()` returns false', function () { return __awaiter(_this, void 0, void 0, function () {
                    var err_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                psUnsubscribeSpy.and.returnValue(Promise.resolve(false));
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 4, , 5]);
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 2:
                                _a.sent();
                                return [4 /*yield*/, push.unsubscribe()];
                            case 3:
                                _a.sent();
                                throw new Error('`unsubscribe()` should fail');
                            case 4:
                                err_3 = _a.sent();
                                expect(err_3.message).toBe('Unsubscribe failed!');
                                return [3 /*break*/, 5];
                            case 5: return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('emits `null` on `SwPush.subscription`', function () { return __awaiter(_this, void 0, void 0, function () {
                    var subscriptionSpy;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                                push.subscription.subscribe(subscriptionSpy);
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, push.unsubscribe()];
                            case 2:
                                _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledWith(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('does not emit on `SwPush.subscription` on failure', function () { return __awaiter(_this, void 0, void 0, function () {
                    var subscriptionSpy, initialSubEmit;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                subscriptionSpy = jasmine.createSpy('subscriptionSpy');
                                initialSubEmit = new Promise(function (resolve) { return subscriptionSpy.and.callFake(resolve); });
                                push.subscription.subscribe(subscriptionSpy);
                                return [4 /*yield*/, initialSubEmit];
                            case 1:
                                _a.sent();
                                subscriptionSpy.calls.reset();
                                // Error due to no subscription.
                                return [4 /*yield*/, push.unsubscribe().catch(function () { return undefined; })];
                            case 2:
                                // Error due to no subscription.
                                _a.sent();
                                expect(subscriptionSpy).not.toHaveBeenCalled();
                                // Subscribe.
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 3:
                                // Subscribe.
                                _a.sent();
                                subscriptionSpy.calls.reset();
                                // Error due to `PushSubscription.unsubscribe()` error.
                                psUnsubscribeSpy.and.callFake(function () { throw new Error('foo'); });
                                return [4 /*yield*/, push.unsubscribe().catch(function () { return undefined; })];
                            case 4:
                                _a.sent();
                                expect(subscriptionSpy).not.toHaveBeenCalled();
                                // Error due to `PushSubscription.unsubscribe()` failure.
                                psUnsubscribeSpy.and.returnValue(Promise.resolve(false));
                                return [4 /*yield*/, push.unsubscribe().catch(function () { return undefined; })];
                            case 5:
                                _a.sent();
                                expect(subscriptionSpy).not.toHaveBeenCalled();
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('messages', function () {
                it('receives push messages', function () {
                    var sendMessage = function (type, message) {
                        return mock.sendMessage({ type: type, data: { message: message } });
                    };
                    var receivedMessages = [];
                    push.messages.subscribe(function (msg) { return receivedMessages.push(msg.message); });
                    sendMessage('PUSH', 'this was a push message');
                    sendMessage('NOTPUSH', 'this was not a push message');
                    sendMessage('PUSH', 'this was a push message too');
                    sendMessage('HSUP', 'this was a HSUP message');
                    expect(receivedMessages).toEqual([
                        'this was a push message',
                        'this was a push message too',
                    ]);
                });
            });
            describe('notificationClicks', function () {
                it('receives notification clicked messages', function () {
                    var sendMessage = function (type, action) {
                        return mock.sendMessage({ type: type, data: { action: action } });
                    };
                    var receivedMessages = [];
                    push.notificationClicks.subscribe(function (msg) { return receivedMessages.push(msg.action); });
                    sendMessage('NOTIFICATION_CLICK', 'this was a click');
                    sendMessage('NOT_IFICATION_CLICK', 'this was not a click');
                    sendMessage('NOTIFICATION_CLICK', 'this was a click too');
                    sendMessage('KCILC_NOITACIFITON', 'this was a KCILC_NOITACIFITON message');
                    expect(receivedMessages).toEqual([
                        'this was a click',
                        'this was a click too',
                    ]);
                });
            });
            describe('subscription', function () {
                var nextSubEmitResolve;
                var nextSubEmitPromise;
                var subscriptionSpy;
                beforeEach(function () {
                    nextSubEmitPromise = new Promise(function (resolve) { return nextSubEmitResolve = resolve; });
                    subscriptionSpy = jasmine.createSpy('subscriptionSpy').and.callFake(function () {
                        nextSubEmitResolve();
                        nextSubEmitPromise = new Promise(function (resolve) { return nextSubEmitResolve = resolve; });
                    });
                    push.subscription.subscribe(subscriptionSpy);
                });
                async_1.async_it('emits on worker-driven changes (i.e. when the controller changes)', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: 
                            // Initial emit for the current `ServiceWorkerController`.
                            return [4 /*yield*/, nextSubEmitPromise];
                            case 1:
                                // Initial emit for the current `ServiceWorkerController`.
                                _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                                expect(subscriptionSpy).toHaveBeenCalledWith(null);
                                subscriptionSpy.calls.reset();
                                // Simulate a `ServiceWorkerController` change.
                                mock.setupSw();
                                return [4 /*yield*/, nextSubEmitPromise];
                            case 2:
                                _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                                expect(subscriptionSpy).toHaveBeenCalledWith(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
                async_1.async_it('emits on subscription changes (i.e. when subscribing/unsubscribing)', function () { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, nextSubEmitPromise];
                            case 1:
                                _a.sent();
                                subscriptionSpy.calls.reset();
                                // Subscribe.
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 2:
                                // Subscribe.
                                _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                                expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.any(mock_1.MockPushSubscription));
                                subscriptionSpy.calls.reset();
                                // Subscribe again.
                                return [4 /*yield*/, push.requestSubscription({ serverPublicKey: 'test' })];
                            case 3:
                                // Subscribe again.
                                _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                                expect(subscriptionSpy).toHaveBeenCalledWith(jasmine.any(mock_1.MockPushSubscription));
                                subscriptionSpy.calls.reset();
                                // Unsubscribe.
                                return [4 /*yield*/, push.unsubscribe()];
                            case 4:
                                // Unsubscribe.
                                _a.sent();
                                expect(subscriptionSpy).toHaveBeenCalledTimes(1);
                                expect(subscriptionSpy).toHaveBeenCalledWith(null);
                                return [2 /*return*/];
                        }
                    });
                }); });
            });
            describe('with no SW', function () {
                beforeEach(function () {
                    comm = new low_level_1.NgswCommChannel(undefined);
                    push = new push_1.SwPush(comm);
                });
                it('does not crash on subscription to observables', function () {
                    push.messages.toPromise().catch(function (err) { return fail(err); });
                    push.notificationClicks.toPromise().catch(function (err) { return fail(err); });
                    push.subscription.toPromise().catch(function (err) { return fail(err); });
                });
                it('gives an error when registering', function (done) {
                    push.requestSubscription({ serverPublicKey: 'test' }).catch(function (err) { done(); });
                });
                it('gives an error when unsubscribing', function (done) { push.unsubscribe().catch(function (err) { done(); }); });
            });
        });
        describe('SwUpdate', function () {
            var update;
            beforeEach(function () {
                update = new update_1.SwUpdate(comm);
                mock.setupSw();
            });
            it('processes update availability notifications when sent', function (done) {
                update.available.subscribe(function (event) {
                    expect(event.current).toEqual({ hash: 'A' });
                    expect(event.available).toEqual({ hash: 'B' });
                    expect(event.type).toEqual('UPDATE_AVAILABLE');
                    done();
                });
                mock.sendMessage({
                    type: 'UPDATE_AVAILABLE',
                    current: {
                        hash: 'A',
                    },
                    available: {
                        hash: 'B',
                    },
                });
            });
            it('processes update activation notifications when sent', function (done) {
                update.activated.subscribe(function (event) {
                    expect(event.previous).toEqual({ hash: 'A' });
                    expect(event.current).toEqual({ hash: 'B' });
                    expect(event.type).toEqual('UPDATE_ACTIVATED');
                    done();
                });
                mock.sendMessage({
                    type: 'UPDATE_ACTIVATED',
                    previous: {
                        hash: 'A',
                    },
                    current: {
                        hash: 'B',
                    },
                });
            });
            it('activates updates when requested', function (done) {
                mock.messages.subscribe(function (msg) {
                    expect(msg.action).toEqual('ACTIVATE_UPDATE');
                    mock.sendMessage({
                        type: 'STATUS',
                        nonce: msg.statusNonce,
                        status: true,
                    });
                });
                return update.activateUpdate().then(function () { return done(); }).catch(function (err) { return done.fail(err); });
            });
            it('reports activation failure when requested', function (done) {
                mock.messages.subscribe(function (msg) {
                    expect(msg.action).toEqual('ACTIVATE_UPDATE');
                    mock.sendMessage({
                        type: 'STATUS',
                        nonce: msg.statusNonce,
                        status: false,
                        error: 'Failed to activate',
                    });
                });
                return update.activateUpdate()
                    .catch(function (err) { expect(err.message).toEqual('Failed to activate'); })
                    .then(function () { return done(); })
                    .catch(function (err) { return done.fail(err); });
            });
            it('is injectable', function () {
                testing_1.TestBed.configureTestingModule({
                    providers: [
                        update_1.SwUpdate,
                        { provide: low_level_1.NgswCommChannel, useValue: comm },
                    ]
                });
                expect(function () { return testing_1.TestBed.get(update_1.SwUpdate); }).not.toThrow();
            });
            describe('with no SW', function () {
                beforeEach(function () { comm = new low_level_1.NgswCommChannel(undefined); });
                it('can be instantiated', function () { update = new update_1.SwUpdate(comm); });
                it('does not crash on subscription to observables', function () {
                    update = new update_1.SwUpdate(comm);
                    update.available.toPromise().catch(function (err) { return fail(err); });
                    update.activated.toPromise().catch(function (err) { return fail(err); });
                });
                it('gives an error when checking for updates', function (done) {
                    update = new update_1.SwUpdate(comm);
                    update.checkForUpdate().catch(function (err) { done(); });
                });
                it('gives an error when activating updates', function (done) {
                    update = new update_1.SwUpdate(comm);
                    update.activateUpdate().catch(function (err) { done(); });
                });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvc2VydmljZS13b3JrZXIvdGVzdC9jb21tX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUgsaUJBdWVBOztBQXZlQSxzQ0FBMEM7QUFDMUMsaURBQThDO0FBRTlDLDhDQUFpRDtBQUNqRCx3Q0FBMEU7QUFDMUUsb0NBQW1DO0FBQ25DLHdDQUF1QztBQUN2Qyx3Q0FBb0o7QUFDcEosaUNBQTRDO0FBRTVDO0lBQ0UsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLElBQUksSUFBZ0MsQ0FBQztRQUNyQyxJQUFJLElBQXFCLENBQUM7UUFFMUIsVUFBVSxDQUFDO1lBQ1QsSUFBSSxHQUFHLElBQUksaUNBQTBCLEVBQUUsQ0FBQztZQUN4QyxJQUFJLEdBQUcsSUFBSSwyQkFBZSxDQUFDLElBQVcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLEVBQUUsQ0FBQywrREFBK0QsRUFBRSxVQUFBLElBQUk7Z0JBQ3RFLElBQU0sSUFBSSxHQUFHLElBQUksaUNBQTBCLEVBQUUsQ0FBQztnQkFDOUMsSUFBTSxJQUFJLEdBQUcsSUFBSSwyQkFBZSxDQUFDLElBQVcsQ0FBQyxDQUFDO2dCQUM5QyxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsZUFBZSxFQUEwQyxDQUFDO2dCQUVsRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBRWQsSUFBWSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFRLElBQU8sSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyw4REFBOEQsRUFBRSxVQUFBLElBQUk7Z0JB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