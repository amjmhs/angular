"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var operators_1 = require("rxjs/operators");
var request_1 = require("../src/request");
var response_1 = require("../src/response");
var xhr_1 = require("../src/xhr");
var xhr_mock_1 = require("./xhr_mock");
function trackEvents(obs) {
    var events = [];
    obs.subscribe(function (event) { return events.push(event); }, function (err) { return events.push(err); });
    return events;
}
var TEST_POST = new request_1.HttpRequest('POST', '/test', 'some body', {
    responseType: 'text',
});
var XSSI_PREFIX = ')]}\'\n';
{
    testing_internal_1.describe('XhrBackend', function () {
        var factory = null;
        var backend = null;
        beforeEach(function () {
            factory = new xhr_mock_1.MockXhrFactory();
            backend = new xhr_1.HttpXhrBackend(factory);
        });
        testing_internal_1.it('emits status immediately', function () {
            var events = trackEvents(backend.handle(TEST_POST));
            expect(events.length).toBe(1);
            expect(events[0].type).toBe(response_1.HttpEventType.Sent);
        });
        testing_internal_1.it('sets method, url, and responseType correctly', function () {
            backend.handle(TEST_POST).subscribe();
            expect(factory.mock.method).toBe('POST');
            expect(factory.mock.responseType).toBe('text');
            expect(factory.mock.url).toBe('/test');
        });
        testing_internal_1.it('sets outgoing body correctly', function () {
            backend.handle(TEST_POST).subscribe();
            expect(factory.mock.body).toBe('some body');
        });
        testing_internal_1.it('sets outgoing headers, including default headers', function () {
            var post = TEST_POST.clone({
                setHeaders: {
                    'Test': 'Test header',
                },
            });
            backend.handle(post).subscribe();
            expect(factory.mock.mockHeaders).toEqual({
                'Test': 'Test header',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'text/plain',
            });
        });
        testing_internal_1.it('sets outgoing headers, including overriding defaults', function () {
            var setHeaders = {
                'Test': 'Test header',
                'Accept': 'text/html',
                'Content-Type': 'text/css',
            };
            backend.handle(TEST_POST.clone({ setHeaders: setHeaders })).subscribe();
            expect(factory.mock.mockHeaders).toEqual(setHeaders);
        });
        testing_internal_1.it('passes withCredentials through', function () {
            backend.handle(TEST_POST.clone({ withCredentials: true })).subscribe();
            expect(factory.mock.withCredentials).toBe(true);
        });
        testing_internal_1.it('handles a text response', function () {
            var events = trackEvents(backend.handle(TEST_POST));
            factory.mock.mockFlush(200, 'OK', 'some response');
            expect(events.length).toBe(2);
            expect(events[1].type).toBe(response_1.HttpEventType.Response);
            expect(events[1] instanceof response_1.HttpResponse).toBeTruthy();
            var res = events[1];
            expect(res.body).toBe('some response');
            expect(res.status).toBe(200);
            expect(res.statusText).toBe('OK');
        });
        testing_internal_1.it('handles a json response', function () {
            var events = trackEvents(backend.handle(TEST_POST.clone({ responseType: 'json' })));
            factory.mock.mockFlush(200, 'OK', JSON.stringify({ data: 'some data' }));
            expect(events.length).toBe(2);
            var res = events[1];
            expect(res.body.data).toBe('some data');
        });
        testing_internal_1.it('handles a blank json response', function () {
            var events = trackEvents(backend.handle(TEST_POST.clone({ responseType: 'json' })));
            factory.mock.mockFlush(200, 'OK', '');
            expect(events.length).toBe(2);
            var res = events[1];
            expect(res.body).toBeNull();
        });
        testing_internal_1.it('handles a json error response', function () {
            var events = trackEvents(backend.handle(TEST_POST.clone({ responseType: 'json' })));
            factory.mock.mockFlush(500, 'Error', JSON.stringify({ data: 'some data' }));
            expect(events.length).toBe(2);
            var res = events[1];
            expect(res.error.data).toBe('some data');
        });
        testing_internal_1.it('handles a json error response with XSSI prefix', function () {
            var events = trackEvents(backend.handle(TEST_POST.clone({ responseType: 'json' })));
            factory.mock.mockFlush(500, 'Error', XSSI_PREFIX + JSON.stringify({ data: 'some data' }));
            expect(events.length).toBe(2);
            var res = events[1];
            expect(res.error.data).toBe('some data');
        });
        testing_internal_1.it('handles a json string response', function () {
            var events = trackEvents(backend.handle(TEST_POST.clone({ responseType: 'json' })));
            expect(factory.mock.responseType).toEqual('text');
            factory.mock.mockFlush(200, 'OK', JSON.stringify('this is a string'));
            expect(events.length).toBe(2);
            var res = events[1];
            expect(res.body).toEqual('this is a string');
        });
        testing_internal_1.it('handles a json response with an XSSI prefix', function () {
            var events = trackEvents(backend.handle(TEST_POST.clone({ responseType: 'json' })));
            factory.mock.mockFlush(200, 'OK', XSSI_PREFIX + JSON.stringify({ data: 'some data' }));
            expect(events.length).toBe(2);
            var res = events[1];
            expect(res.body.data).toBe('some data');
        });
        testing_internal_1.it('emits unsuccessful responses via the error path', function (done) {
            backend.handle(TEST_POST).subscribe(undefined, function (err) {
                expect(err instanceof response_1.HttpErrorResponse).toBe(true);
                expect(err.error).toBe('this is the error');
                done();
            });
            factory.mock.mockFlush(400, 'Bad Request', 'this is the error');
        });
        testing_internal_1.it('emits real errors via the error path', function (done) {
            backend.handle(TEST_POST).subscribe(undefined, function (err) {
                expect(err instanceof response_1.HttpErrorResponse).toBe(true);
                expect(err.error instanceof Error);
                done();
            });
            factory.mock.mockErrorEvent(new Error('blah'));
        });
        testing_internal_1.describe('progress events', function () {
            testing_internal_1.it('are emitted for download progress', function (done) {
                backend.handle(TEST_POST.clone({ reportProgress: true }))
                    .pipe(operators_1.toArray())
                    .subscribe(function (events) {
                    expect(events.map(function (event) { return event.type; })).toEqual([
                        response_1.HttpEventType.Sent,
                        response_1.HttpEventType.ResponseHeader,
                        response_1.HttpEventType.DownloadProgress,
                        response_1.HttpEventType.DownloadProgress,
                        response_1.HttpEventType.Response,
                    ]);
                    var _a = [
                        events[2], events[3],
                        events[4]
                    ], progress1 = _a[0], progress2 = _a[1], response = _a[2];
                    expect(progress1.partialText).toBe('down');
                    expect(progress1.loaded).toBe(100);
                    expect(progress1.total).toBe(300);
                    expect(progress2.partialText).toBe('download');
                    expect(progress2.loaded).toBe(200);
                    expect(progress2.total).toBe(300);
                    expect(response.body).toBe('downloaded');
                    done();
                });
                factory.mock.responseText = 'down';
                factory.mock.mockDownloadProgressEvent(100, 300);
                factory.mock.responseText = 'download';
                factory.mock.mockDownloadProgressEvent(200, 300);
                factory.mock.mockFlush(200, 'OK', 'downloaded');
            });
            testing_internal_1.it('are emitted for upload progress', function (done) {
                backend.handle(TEST_POST.clone({ reportProgress: true }))
                    .pipe(operators_1.toArray())
                    .subscribe(function (events) {
                    expect(events.map(function (event) { return event.type; })).toEqual([
                        response_1.HttpEventType.Sent,
                        response_1.HttpEventType.UploadProgress,
                        response_1.HttpEventType.UploadProgress,
                        response_1.HttpEventType.Response,
                    ]);
                    var _a = [
                        events[1],
                        events[2],
                    ], progress1 = _a[0], progress2 = _a[1];
                    expect(progress1.loaded).toBe(100);
                    expect(progress1.total).toBe(300);
                    expect(progress2.loaded).toBe(200);
                    expect(progress2.total).toBe(300);
                    done();
                });
                factory.mock.mockUploadProgressEvent(100, 300);
                factory.mock.mockUploadProgressEvent(200, 300);
                factory.mock.mockFlush(200, 'OK', 'Done');
            });
            testing_internal_1.it('are emitted when both upload and download progress are available', function (done) {
                backend.handle(TEST_POST.clone({ reportProgress: true }))
                    .pipe(operators_1.toArray())
                    .subscribe(function (events) {
                    expect(events.map(function (event) { return event.type; })).toEqual([
                        response_1.HttpEventType.Sent,
                        response_1.HttpEventType.UploadProgress,
                        response_1.HttpEventType.ResponseHeader,
                        response_1.HttpEventType.DownloadProgress,
                        response_1.HttpEventType.Response,
                    ]);
                    done();
                });
                factory.mock.mockUploadProgressEvent(100, 300);
                factory.mock.mockDownloadProgressEvent(200, 300);
                factory.mock.mockFlush(200, 'OK', 'Done');
            });
            testing_internal_1.it('are emitted even if length is not computable', function (done) {
                backend.handle(TEST_POST.clone({ reportProgress: true }))
                    .pipe(operators_1.toArray())
                    .subscribe(function (events) {
                    expect(events.map(function (event) { return event.type; })).toEqual([
                        response_1.HttpEventType.Sent,
                        response_1.HttpEventType.UploadProgress,
                        response_1.HttpEventType.ResponseHeader,
                        response_1.HttpEventType.DownloadProgress,
                        response_1.HttpEventType.Response,
                    ]);
                    done();
                });
                factory.mock.mockUploadProgressEvent(100);
                factory.mock.mockDownloadProgressEvent(200);
                factory.mock.mockFlush(200, 'OK', 'Done');
            });
            testing_internal_1.it('include ResponseHeader with headers and status', function (done) {
                backend.handle(TEST_POST.clone({ reportProgress: true }))
                    .pipe(operators_1.toArray())
                    .subscribe(function (events) {
                    expect(events.map(function (event) { return event.type; })).toEqual([
                        response_1.HttpEventType.Sent,
                        response_1.HttpEventType.ResponseHeader,
                        response_1.HttpEventType.DownloadProgress,
                        response_1.HttpEventType.Response,
                    ]);
                    var partial = events[1];
                    expect(partial.headers.get('Content-Type')).toEqual('text/plain');
                    expect(partial.headers.get('Test')).toEqual('Test header');
                    done();
                });
                factory.mock.mockResponseHeaders = 'Test: Test header\nContent-Type: text/plain\n';
                factory.mock.mockDownloadProgressEvent(200);
                factory.mock.mockFlush(200, 'OK', 'Done');
            });
            testing_internal_1.it('are unsubscribed along with the main request', function () {
                var sub = backend.handle(TEST_POST.clone({ reportProgress: true })).subscribe();
                expect(factory.mock.listeners.progress).not.toBeUndefined();
                sub.unsubscribe();
                expect(factory.mock.listeners.progress).toBeUndefined();
            });
            testing_internal_1.it('do not cause headers to be re-parsed on main response', function (done) {
                backend.handle(TEST_POST.clone({ reportProgress: true }))
                    .pipe(operators_1.toArray())
                    .subscribe(function (events) {
                    events
                        .filter(function (event) { return event.type === response_1.HttpEventType.Response ||
                        event.type === response_1.HttpEventType.ResponseHeader; })
                        .map(function (event) { return event; })
                        .forEach(function (event) {
                        expect(event.status).toBe(203);
                        expect(event.headers.get('Test')).toEqual('This is a test');
                    });
                    done();
                });
                factory.mock.mockResponseHeaders = 'Test: This is a test\n';
                factory.mock.status = 203;
                factory.mock.mockDownloadProgressEvent(100, 300);
                factory.mock.mockResponseHeaders = 'Test: should never be read\n';
                factory.mock.mockFlush(203, 'OK', 'Testing 1 2 3');
            });
        });
        testing_internal_1.describe('gets response URL', function () {
            testing_internal_1.it('from XHR.responsesURL', function (done) {
                backend.handle(TEST_POST).pipe(operators_1.toArray()).subscribe(function (events) {
                    expect(events.length).toBe(2);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    var response = events[1];
                    expect(response.url).toBe('/response/url');
                    done();
                });
                factory.mock.responseURL = '/response/url';
                factory.mock.mockFlush(200, 'OK', 'Test');
            });
            testing_internal_1.it('from X-Request-URL header if XHR.responseURL is not present', function (done) {
                backend.handle(TEST_POST).pipe(operators_1.toArray()).subscribe(function (events) {
                    expect(events.length).toBe(2);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    var response = events[1];
                    expect(response.url).toBe('/response/url');
                    done();
                });
                factory.mock.mockResponseHeaders = 'X-Request-URL: /response/url\n';
                factory.mock.mockFlush(200, 'OK', 'Test');
            });
            testing_internal_1.it('falls back on Request.url if neither are available', function (done) {
                backend.handle(TEST_POST).pipe(operators_1.toArray()).subscribe(function (events) {
                    expect(events.length).toBe(2);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    var response = events[1];
                    expect(response.url).toBe('/test');
                    done();
                });
                factory.mock.mockFlush(200, 'OK', 'Test');
            });
        });
        testing_internal_1.describe('corrects for quirks', function () {
            testing_internal_1.it('by normalizing 1223 status to 204', function (done) {
                backend.handle(TEST_POST).pipe(operators_1.toArray()).subscribe(function (events) {
                    expect(events.length).toBe(2);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    var response = events[1];
                    expect(response.status).toBe(204);
                    done();
                });
                factory.mock.mockFlush(1223, 'IE Special Status', 'Test');
            });
            testing_internal_1.it('by normalizing 0 status to 200 if a body is present', function (done) {
                backend.handle(TEST_POST).pipe(operators_1.toArray()).subscribe(function (events) {
                    expect(events.length).toBe(2);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    var response = events[1];
                    expect(response.status).toBe(200);
                    done();
                });
                factory.mock.mockFlush(0, 'CORS 0 status', 'Test');
            });
            testing_internal_1.it('by leaving 0 status as 0 if a body is not present', function (done) {
                backend.handle(TEST_POST).pipe(operators_1.toArray()).subscribe(undefined, function (error) {
                    expect(error.status).toBe(0);
                    done();
                });
                factory.mock.mockFlush(0, 'CORS 0 status');
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L3hocl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQXdGO0FBRXhGLDRDQUF1QztBQUV2QywwQ0FBMkM7QUFDM0MsNENBQW9MO0FBQ3BMLGtDQUEwQztBQUUxQyx1Q0FBMEM7QUFFMUMscUJBQXFCLEdBQStCO0lBQ2xELElBQU0sTUFBTSxHQUFxQixFQUFFLENBQUM7SUFDcEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQWxCLENBQWtCLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUM7SUFDcEUsT0FBTyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQUVELElBQU0sU0FBUyxHQUFHLElBQUkscUJBQVcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRTtJQUM5RCxZQUFZLEVBQUUsTUFBTTtDQUNyQixDQUFDLENBQUM7QUFFSCxJQUFNLFdBQVcsR0FBRyxTQUFTLENBQUM7QUFFOUI7SUFDRSwyQkFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixJQUFJLE9BQU8sR0FBbUIsSUFBTSxDQUFDO1FBQ3JDLElBQUksT0FBTyxHQUFtQixJQUFNLENBQUM7UUFDckMsVUFBVSxDQUFDO1lBQ1QsT0FBTyxHQUFHLElBQUkseUJBQWMsRUFBRSxDQUFDO1lBQy9CLE9BQU8sR0FBRyxJQUFJLG9CQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDSCxxQkFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzdCLElBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxPQUFPLENB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