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
var client_1 = require("../src/client");
var response_1 = require("../src/response");
var backend_1 = require("../testing/src/backend");
{
    testing_internal_1.describe('HttpClient', function () {
        var client = null;
        var backend = null;
        beforeEach(function () {
            backend = new backend_1.HttpClientTestingBackend();
            client = new client_1.HttpClient(backend);
        });
        afterEach(function () { backend.verify(); });
        testing_internal_1.describe('makes a basic request', function () {
            testing_internal_1.it('for JSON data', function (done) {
                client.get('/test').subscribe(function (res) {
                    expect(res['data']).toEqual('hello world');
                    done();
                });
                backend.expectOne('/test').flush({ 'data': 'hello world' });
            });
            testing_internal_1.it('for text data', function (done) {
                client.get('/test', { responseType: 'text' }).subscribe(function (res) {
                    expect(res).toEqual('hello world');
                    done();
                });
                backend.expectOne('/test').flush('hello world');
            });
            testing_internal_1.it('with headers', function (done) {
                client.get('/test', { headers: { 'X-Option': 'true' } }).subscribe(function () { return done(); });
                var req = backend.expectOne('/test');
                expect(req.request.headers.get('X-Option')).toEqual('true');
                req.flush({});
            });
            testing_internal_1.it('with params', function (done) {
                client.get('/test', { params: { 'test': 'true' } }).subscribe(function () { return done(); });
                backend.expectOne('/test?test=true').flush({});
            });
            testing_internal_1.it('for an arraybuffer', function (done) {
                var body = new ArrayBuffer(4);
                client.get('/test', { responseType: 'arraybuffer' }).subscribe(function (res) {
                    expect(res).toBe(body);
                    done();
                });
                backend.expectOne('/test').flush(body);
            });
            if (typeof Blob !== 'undefined') {
                testing_internal_1.it('for a blob', function (done) {
                    var body = new Blob([new ArrayBuffer(4)]);
                    client.get('/test', { responseType: 'blob' }).subscribe(function (res) {
                        expect(res).toBe(body);
                        done();
                    });
                    backend.expectOne('/test').flush(body);
                });
            }
            testing_internal_1.it('that returns a response', function (done) {
                var body = { 'data': 'hello world' };
                client.get('/test', { observe: 'response' }).subscribe(function (res) {
                    expect(res instanceof response_1.HttpResponse).toBe(true);
                    expect(res.body).toBe(body);
                    done();
                });
                backend.expectOne('/test').flush(body);
            });
            testing_internal_1.it('that returns a stream of events', function (done) {
                client.get('/test', { observe: 'events' }).pipe(operators_1.toArray()).toPromise().then(function (events) {
                    expect(events.length).toBe(2);
                    var x = response_1.HttpResponse;
                    expect(events[0].type).toBe(response_1.HttpEventType.Sent);
                    expect(events[1].type).toBe(response_1.HttpEventType.Response);
                    expect(events[1] instanceof response_1.HttpResponse).toBeTruthy();
                    done();
                });
                backend.expectOne('/test').flush({ 'data': 'hello world' });
            });
            testing_internal_1.it('with progress events enabled', function (done) {
                client.get('/test', { reportProgress: true }).subscribe(function () { return done(); });
                var req = backend.expectOne('/test');
                expect(req.request.reportProgress).toEqual(true);
                req.flush({});
            });
        });
        testing_internal_1.describe('makes a POST request', function () {
            testing_internal_1.it('with text data', function (done) {
                client.post('/test', 'text body', { observe: 'response', responseType: 'text' })
                    .subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                backend.expectOne('/test').flush('hello world');
            });
            testing_internal_1.it('with json data', function (done) {
                var body = { data: 'json body' };
                client.post('/test', body, { observe: 'response', responseType: 'text' }).subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                var testReq = backend.expectOne('/test');
                expect(testReq.request.body).toBe(body);
                testReq.flush('hello world');
            });
            testing_internal_1.it('with a json body of false', function (done) {
                client.post('/test', false, { observe: 'response', responseType: 'text' }).subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                var testReq = backend.expectOne('/test');
                expect(testReq.request.body).toBe(false);
                testReq.flush('hello world');
            });
            testing_internal_1.it('with a json body of 0', function (done) {
                client.post('/test', 0, { observe: 'response', responseType: 'text' }).subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                var testReq = backend.expectOne('/test');
                expect(testReq.request.body).toBe(0);
                testReq.flush('hello world');
            });
            testing_internal_1.it('with an arraybuffer', function (done) {
                var body = new ArrayBuffer(4);
                client.post('/test', body, { observe: 'response', responseType: 'text' }).subscribe(function (res) {
                    expect(res.ok).toBeTruthy();
                    expect(res.status).toBe(200);
                    done();
                });
                var testReq = backend.expectOne('/test');
                expect(testReq.request.body).toBe(body);
                testReq.flush('hello world');
            });
        });
        testing_internal_1.describe('makes a JSONP request', function () {
            testing_internal_1.it('with properly set method and callback', function (done) {
                client.jsonp('/test', 'myCallback').subscribe(function () { return done(); });
                backend.expectOne({ method: 'JSONP', url: '/test?myCallback=JSONP_CALLBACK' })
                    .flush('hello world');
            });
        });
        testing_internal_1.describe('makes a request for an error response', function () {
            testing_internal_1.it('with a JSON body', function (done) {
                client.get('/test').subscribe(function () { }, function (res) {
                    expect(res.error.data).toEqual('hello world');
                    done();
                });
                backend.expectOne('/test').flush({ 'data': 'hello world' }, { status: 500, statusText: 'Server error' });
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50X3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L2NsaWVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsK0VBQXdGO0FBQ3hGLDRDQUF1QztBQUV2Qyx3Q0FBeUM7QUFDekMsNENBQStFO0FBQy9FLGtEQUFnRTtBQUVoRTtJQUNFLDJCQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLElBQUksTUFBTSxHQUFlLElBQU0sQ0FBQztRQUNoQyxJQUFJLE9BQU8sR0FBNkIsSUFBTSxDQUFDO1FBQy9DLFVBQVUsQ0FBQztZQUNULE9BQU8sR0FBRyxJQUFJLGtDQUF3QixFQUFFLENBQUM7WUFDekMsTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUNILFNBQVMsQ0FBQyxjQUFRLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLDJCQUFRLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMscUJBQUUsQ0FBQyxlQUFlLEVBQUUsVUFBQSxJQUFJO2dCQUN0QixNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7b0JBQy9CLE1BQU0sQ0FBRSxHQUFXLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3BELElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBQyxDQUFDLENBQUM7WUFDNUQsQ0FBQyxDQUFDLENBQUM7WUFDSCxxQkFBRSxDQUFDLGVBQWUsRUFBRSxVQUFBLElBQUk7Z0JBQ3RCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztvQkFDdkQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztvQkFDbkMsSUFBSSxFQUFFLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDbEQsQ0FBQyxDQUFDLENBQUM7WUFDSCxxQkFBRSxDQUFDLGNBQWMsRUFBRSxVQUFBLElBQUk7Z0JBQ3JCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQyxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQyxDQUFDO2dCQUM3RSxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM1RCxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hCLENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQyxhQUFhLEVBQUUsVUFBQSxJQUFJO2dCQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUMsRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUUsRUFBTixDQUFNLENBQUMsQ0FBQztnQkFDeEUsT0FBTyxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRCxDQUFDLENBQUMsQ0FBQztZQUNILHFCQUFFLENBQUMsb0JBQW9CLEVBQUUsVUFBQSxJQUFJO2dCQUMzQixJQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsRUFBQyxZQUFZLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO29CQUM5RCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUN2QixJQUFJLEVBQUUsQ0FBQztnQkFDVCxDQUFDLENBQUMsQ0FBQztnQkFDSCxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN6QyxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxFQUFFO2dCQUMvQixxQkFBRSxDQUFDLFlBQVksRUFBRSxVQUFBLElBQUk7b0JBQ25CLElBQU0sSUFBSSxHQUFHLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7d0JBQ3ZELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ3ZCLElBQUksRUFBRSxDQUFDO29CQUNULENBQUMsQ0FBQyxDQUFDO29CQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN6QyxDQUFDLENBQUMsQ0FBQzthQUNKO1lBQ0QscUJBQUUsQ0FBQyx5QkFBeUIsRUFBRSxVQUFBLElBQUk7Z0JBQ2hDLElBQU0sSUFBSSxHQUFHLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7b0JBQ3RELE1BQU0sQ0FBQyxHQUFHLFlBQVksdUJBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7b0JBQzVCLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQyxpQ0FBaUMsRUFBRSxVQUFBLElBQUk7Z0JBQ3hDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG1CQUFPLEVBQUUsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFBLE1BQU07b0JBQzlFLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUM5QixJQUFJLENBQUMsR0FBRyx1QkFBWSxDQUFDO29CQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyx3QkFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNwRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLHVCQUFZLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDdkQsSUFBSSxFQUFFLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBQyxNQUFNLEVBQUUsYUFBYSxFQUFDLENBQUMsQ0FBQztZQUM1RCxDQUFDLENBQUMsQ0FBQztZQUNILHFCQUFFLENBQUMsOEJBQThCLEVBQUUsVUFBQSxJQUFJO2dCQUNyQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxFQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFNLE9BQUEsSUFBSSxFQUFFLEVBQU4sQ0FBTSxDQUFDLENBQUM7Z0JBQ3BFLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDakQsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNoQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0gsMkJBQVEsQ0FBQyxzQkFBc0IsRUFBRTtZQUMvQixxQkFBRSxDQUFDLGdCQUFnQixFQUFFLFVBQUEsSUFBSTtnQkFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsV0FBVyxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFDLENBQUM7cUJBQ3pFLFNBQVMsQ0FBQyxVQUFBLEdBQUc7b0JBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzdCLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUNQLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxVQUFBLElBQUk7Z0JBQ3ZCLElBQU0sSUFBSSxHQUFHLEVBQUMsSUFBSSxFQUFFLFdBQVcsRUFBQyxDQUFDO2dCQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxVQUFBLEdBQUc7b0JBQ25GLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7b0JBQzVCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUM3QixJQUFJLEVBQUUsQ0FBQztnQkFDVCxDQUFDLENBQUMsQ0FBQztnQkFDSCxJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7WUFDSCxxQkFBRSxDQUFDLDJCQUEyQixFQUFFLFVBQUEsSUFBSTtnQkFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO29CQUNwRixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxFQUFFLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN6QyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQyx1QkFBdUIsRUFBRSxVQUFBLElBQUk7Z0JBQzlCLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVBQUEsR0FBRztvQkFDaEYsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDNUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzdCLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUNILElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDckMsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztZQUNILHFCQUFFLENBQUMscUJBQXFCLEVBQUUsVUFBQSxJQUFJO2dCQUM1QixJQUFNLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxHQUFHO29CQUNuRixNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO29CQUM1QixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDN0IsSUFBSSxFQUFFLENBQUM7Z0JBQ1QsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDM0MsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN4QyxPQUFPLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQy9CLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCwyQkFBUSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLHFCQUFFLENBQUMsdUNBQXVDLEVBQUUsVUFBQSxJQUFJO2dCQUM5QyxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsY0FBTSxPQUFBLElBQUksRUFBRSxFQUFOLENBQU0sQ0FBQyxDQUFDO2dCQUM1RCxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsaUNBQWlDLEVBQUMsQ0FBQztxQkFDdkUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1lBQzVCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCwyQkFBUSxDQUFDLHVDQUF1QyxFQUFFO1lBQ2hELHFCQUFFLENBQUMsa0JBQWtCLEVBQUUsVUFBQSxJQUFJO2dCQUN6QixNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxjQUFPLENBQUMsRUFBRSxVQUFDLEdBQXNCO29CQUM3RCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQzlDLElBQUksRUFBRSxDQUFDO2dCQUNULENBQUMsQ0FBQyxDQUFDO2dCQUNILE9BQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUM1QixFQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7WUFDMUUsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==