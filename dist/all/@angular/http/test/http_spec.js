"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var http_utils_1 = require("@angular/http/src/http_utils");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var rxjs_1 = require("rxjs");
var index_1 = require("../index");
var mock_backend_1 = require("../testing/src/mock_backend");
{
    testing_internal_1.describe('injectables', function () {
        var url = 'http://foo.bar';
        var http;
        var injector;
        var jsonpBackend;
        var xhrBackend;
        var jsonp;
        testing_internal_1.beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [index_1.HttpModule, index_1.JsonpModule],
                providers: [
                    { provide: index_1.XHRBackend, useClass: mock_backend_1.MockBackend },
                    { provide: index_1.JSONPBackend, useClass: mock_backend_1.MockBackend }
                ]
            });
            injector = testing_1.getTestBed();
        });
        testing_internal_1.it('should allow using jsonpInjectables and httpInjectables in same injector', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            http = injector.get(index_1.Http);
            jsonp = injector.get(index_1.Jsonp);
            jsonpBackend = injector.get(index_1.JSONPBackend);
            xhrBackend = injector.get(index_1.XHRBackend);
            var xhrCreatedConnections = 0;
            var jsonpCreatedConnections = 0;
            xhrBackend.connections.subscribe(function () {
                xhrCreatedConnections++;
                matchers_1.expect(xhrCreatedConnections).toEqual(1);
                if (jsonpCreatedConnections) {
                    async.done();
                }
            });
            http.get(url).subscribe(function () { });
            jsonpBackend.connections.subscribe(function () {
                jsonpCreatedConnections++;
                matchers_1.expect(jsonpCreatedConnections).toEqual(1);
                if (xhrCreatedConnections) {
                    async.done();
                }
            });
            jsonp.request(url).subscribe(function () { });
        }));
    });
    testing_internal_1.describe('http', function () {
        var url = 'http://foo.bar';
        var http;
        var injector;
        var backend;
        var baseResponse;
        var jsonp;
        testing_internal_1.beforeEach(function () {
            injector = core_1.Injector.create([
                { provide: index_1.BaseRequestOptions, deps: [] }, { provide: mock_backend_1.MockBackend, deps: [] }, {
                    provide: index_1.Http,
                    useFactory: function (backend, defaultOptions) {
                        return new index_1.Http(backend, defaultOptions);
                    },
                    deps: [mock_backend_1.MockBackend, index_1.BaseRequestOptions]
                },
                {
                    provide: index_1.Jsonp,
                    useFactory: function (backend, defaultOptions) {
                        return new index_1.Jsonp(backend, defaultOptions);
                    },
                    deps: [mock_backend_1.MockBackend, index_1.BaseRequestOptions]
                }
            ]);
            http = injector.get(index_1.Http);
            jsonp = injector.get(index_1.Jsonp);
            backend = injector.get(mock_backend_1.MockBackend);
            baseResponse = new index_1.Response(new index_1.ResponseOptions({ body: 'base response' }));
            spyOn(index_1.Http.prototype, 'request').and.callThrough();
        });
        testing_internal_1.afterEach(function () { return backend.verifyNoPendingRequests(); });
        testing_internal_1.describe('Http', function () {
            testing_internal_1.describe('.request()', function () {
                testing_internal_1.it('should return an Observable', function () { matchers_1.expect(http.request(url)).toBeAnInstanceOf(rxjs_1.Observable); });
                testing_internal_1.it('should accept a fully-qualified request as its only parameter', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toBe('https://google.com');
                        c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: 'Thank you' })));
                        async.done();
                    });
                    http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com' })))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should accept a fully-qualified request as its only parameter', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toBe('https://google.com');
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Post);
                        c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: 'Thank you' })));
                        async.done();
                    });
                    http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com', method: index_1.RequestMethod.Post })))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should perform a get request for given url if only passed a string', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                    http.request('http://basic.connection').subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                        async.done();
                    });
                }));
                testing_internal_1.it('should perform a post request for given url if options include a method', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toEqual(index_1.RequestMethod.Post);
                        c.mockRespond(baseResponse);
                    });
                    var requestOptions = new index_1.RequestOptions({ method: index_1.RequestMethod.Post });
                    http.request('http://basic.connection', requestOptions).subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                        async.done();
                    });
                }));
                testing_internal_1.it('should perform a post request for given url if options include a method', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toEqual(index_1.RequestMethod.Post);
                        c.mockRespond(baseResponse);
                    });
                    var requestOptions = { method: index_1.RequestMethod.Post };
                    http.request('http://basic.connection', requestOptions).subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                        async.done();
                    });
                }));
                testing_internal_1.it('should perform a get request and complete the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                    http.request('http://basic.connection')
                        .subscribe(function (res) { matchers_1.expect(res.text()).toBe('base response'); }, null, function () { async.done(); });
                }));
                testing_internal_1.it('should perform multiple get requests and complete the responses', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                    http.request('http://basic.connection').subscribe(function (res) {
                        matchers_1.expect(res.text()).toBe('base response');
                    });
                    http.request('http://basic.connection')
                        .subscribe(function (res) { matchers_1.expect(res.text()).toBe('base response'); }, null, function () { async.done(); });
                }));
                testing_internal_1.it('should throw if url is not a string or Request', function () {
                    var req = {};
                    matchers_1.expect(function () { return http.request(req); })
                        .toThrowError('First argument must be a url string or Request instance.');
                });
            });
            testing_internal_1.describe('.get()', function () {
                testing_internal_1.it('should perform a get request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Get);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.get(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.post()', function () {
                testing_internal_1.it('should perform a post request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Post);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.post(url, 'post me').subscribe(function (res) { });
                }));
                testing_internal_1.it('should attach the provided body to the request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var body = 'this is my post body';
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.text()).toBe(body);
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.post(url, body).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.put()', function () {
                testing_internal_1.it('should perform a put request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Put);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.put(url, 'put me').subscribe(function (res) { });
                }));
                testing_internal_1.it('should attach the provided body to the request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var body = 'this is my put body';
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.text()).toBe(body);
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.put(url, body).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.delete()', function () {
                testing_internal_1.it('should perform a delete request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Delete);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.delete(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.patch()', function () {
                testing_internal_1.it('should perform a patch request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Patch);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.patch(url, 'this is my patch body').subscribe(function (res) { });
                }));
                testing_internal_1.it('should attach the provided body to the request', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var body = 'this is my patch body';
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.text()).toBe(body);
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.patch(url, body).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.head()', function () {
                testing_internal_1.it('should perform a head request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Head);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.head(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('.options()', function () {
                testing_internal_1.it('should perform an options request for given url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Options);
                        matchers_1.expect(http.request).toHaveBeenCalled();
                        backend.resolveAllConnections();
                        async.done();
                    });
                    matchers_1.expect(http.request).not.toHaveBeenCalled();
                    http.options(url).subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('searchParams', function () {
                testing_internal_1.it('should append search params to url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    var params = new index_1.URLSearchParams();
                    params.append('q', 'puppies');
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=puppies');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com', new index_1.RequestOptions({ search: params }))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should append string search params to url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=piggies');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com', new index_1.RequestOptions({ search: 'q=piggies' }))
                        .subscribe(function (res) { });
                }));
                testing_internal_1.it('should produce valid url when url already contains a query', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=angular&as_eq=1.x');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com?q=angular', new index_1.RequestOptions({ search: 'as_eq=1.x' }))
                        .subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('params', function () {
                testing_internal_1.it('should append params to url', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                    backend.connections.subscribe(function (c) {
                        matchers_1.expect(c.request.url).toEqual('https://www.google.com?q=puppies');
                        backend.resolveAllConnections();
                        async.done();
                    });
                    http.get('https://www.google.com', { params: { q: 'puppies' } })
                        .subscribe(function (res) { });
                }));
            });
            testing_internal_1.describe('string method names', function () {
                testing_internal_1.it('should allow case insensitive strings for method names', function () {
                    testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                        backend.connections.subscribe(function (c) {
                            matchers_1.expect(c.request.method).toBe(index_1.RequestMethod.Post);
                            c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: 'Thank you' })));
                            async.done();
                        });
                        http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com', method: 'PosT' })))
                            .subscribe(function (res) { });
                    });
                });
                testing_internal_1.it('should throw when invalid string parameter is passed for method name', function () {
                    matchers_1.expect(function () {
                        http.request(new index_1.Request(new index_1.RequestOptions({ url: 'https://google.com', method: 'Invalid' })));
                    }).toThrowError('Invalid request method. The method "Invalid" is not supported.');
                });
            });
        });
        testing_internal_1.describe('Jsonp', function () {
            testing_internal_1.describe('.request()', function () {
                testing_internal_1.it('should throw if url is not a string or Request', function () {
                    var req = {};
                    matchers_1.expect(function () { return jsonp.request(req); })
                        .toThrowError('First argument must be a url string or Request instance.');
                });
            });
        });
        testing_internal_1.describe('response buffer', function () {
            testing_internal_1.it('should attach the provided buffer to the response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                backend.connections.subscribe(function (c) {
                    matchers_1.expect(c.request.responseType).toBe(index_1.ResponseContentType.ArrayBuffer);
                    c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: new ArrayBuffer(32) })));
                    async.done();
                });
                http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.ArrayBuffer }))
                    .subscribe(function (res) { });
            }));
            testing_internal_1.it('should be able to consume a buffer containing a String as any response type', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                backend.connections.subscribe(function (c) { return c.mockRespond(baseResponse); });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBeAnInstanceOf(ArrayBuffer);
                    matchers_1.expect(res.text()).toBe('base response');
                    async.done();
                });
            }));
            testing_internal_1.it('should be able to consume a buffer containing an ArrayBuffer as any response type', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var arrayBuffer = http_utils_1.stringToArrayBuffer('{"response": "ok"}');
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: arrayBuffer })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBe(arrayBuffer);
                    matchers_1.expect(res.text()).toEqual('{"response": "ok"}');
                    matchers_1.expect(res.json()).toEqual({ response: 'ok' });
                    async.done();
                });
            }));
            testing_internal_1.it('should be able to consume a buffer containing an Object as any response type', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var simpleObject = { 'content': 'ok' };
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: simpleObject })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBeAnInstanceOf(ArrayBuffer);
                    matchers_1.expect(res.text()).toEqual(JSON.stringify(simpleObject, null, 2));
                    matchers_1.expect(res.json()).toBe(simpleObject);
                    async.done();
                });
            }));
            testing_internal_1.it('should preserve encoding of ArrayBuffer response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var message = 'é@θЂ';
                var arrayBuffer = http_utils_1.stringToArrayBuffer(message);
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: arrayBuffer })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toBeAnInstanceOf(ArrayBuffer);
                    matchers_1.expect(res.text()).toEqual(message);
                    async.done();
                });
            }));
            testing_internal_1.it('should preserve encoding of String response', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var message = 'é@θЂ';
                backend.connections.subscribe(function (c) {
                    return c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: message })));
                });
                http.get('https://www.google.com').subscribe(function (res) {
                    matchers_1.expect(res.arrayBuffer()).toEqual(http_utils_1.stringToArrayBuffer(message));
                    async.done();
                });
            }));
            testing_internal_1.it('should have an equivalent response independently of the buffer used', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
                var message = { 'param': 'content' };
                backend.connections.subscribe(function (c) {
                    var body = function () {
                        switch (c.request.responseType) {
                            case index_1.ResponseContentType.Text:
                                return JSON.stringify(message, null, 2);
                            case index_1.ResponseContentType.Json:
                                return message;
                            case index_1.ResponseContentType.ArrayBuffer:
                                return http_utils_1.stringToArrayBuffer(JSON.stringify(message, null, 2));
                        }
                    };
                    c.mockRespond(new index_1.Response(new index_1.ResponseOptions({ body: body() })));
                });
                rxjs_1.zip(http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.Text })), http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.Json })), http.get('https://www.google.com', new index_1.RequestOptions({ responseType: index_1.ResponseContentType.ArrayBuffer })))
                    .subscribe(function (res) {
                    matchers_1.expect(res[0].text()).toEqual(res[1].text());
                    matchers_1.expect(res[1].text()).toEqual(res[2].text());
                    async.done();
                });
            }));
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvaHR0cC90ZXN0L2h0dHBfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUF1QztBQUN2QyxpREFBMEQ7QUFDMUQsK0VBQTJIO0FBQzNILDJEQUFpRTtBQUNqRSwyRUFBc0U7QUFDdEUsNkJBQXFDO0FBRXJDLGtDQUF3TztBQUN4Tyw0REFBd0U7QUFFeEU7SUFDRSwyQkFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixJQUFNLEdBQUcsR0FBRyxnQkFBZ0IsQ0FBQztRQUM3QixJQUFJLElBQVUsQ0FBQztRQUNmLElBQUksUUFBa0IsQ0FBQztRQUN2QixJQUFJLFlBQXlCLENBQUM7UUFDOUIsSUFBSSxVQUF1QixDQUFDO1FBQzVCLElBQUksS0FBWSxDQUFDO1FBRWpCLDZCQUFVLENBQUM7WUFDVCxpQkFBTyxDQUFDLHNCQUFzQixDQUFDO2dCQUM3QixPQUFPLEVBQUUsQ0FBQyxrQkFBVSxFQUFFLG1CQUFXLENBQUM7Z0JBQ2xDLFNBQVMsRUFBRTtvQkFDVCxFQUFDLE9BQU8sRUFBRSxrQkFBVSxFQUFFLFFBQVEsRUFBRSwwQkFBVyxFQUFDO29CQUM1QyxFQUFDLE9BQU8sRUFBRSxvQkFBWSxFQUFFLFFBQVEsRUFBRSwwQkFBVyxFQUFDO2lCQUMvQzthQUNGLENBQUMsQ0FBQztZQUNILFFBQVEsR0FBRyxvQkFBVSxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7UUFFSCxxQkFBRSxDQUFDLDBFQUEwRSxFQUMxRSx5QkFBTSxDQUFDLENBQUMscUNBQWtCLENBQUMsRUFBRSxVQUFDLEtBQXlCO1lBRXJELElBQUksR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQUksQ0FBQyxDQUFDO1lBQzFCLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLGFBQUssQ0FBQyxDQUFDO1lBQzVCLFlBQVks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