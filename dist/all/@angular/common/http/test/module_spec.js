"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.JsonpCallbackContext
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var operators_1 = require("rxjs/operators");
var client_1 = require("../src/client");
var interceptor_1 = require("../src/interceptor");
var response_1 = require("../src/response");
var api_1 = require("../testing/src/api");
var module_1 = require("../testing/src/module");
var TestInterceptor = /** @class */ (function () {
    function TestInterceptor(value) {
        this.value = value;
    }
    TestInterceptor.prototype.intercept = function (req, delegate) {
        var _this = this;
        var existing = req.headers.get('Intercepted');
        var next = !!existing ? existing + ',' + this.value : this.value;
        req = req.clone({ setHeaders: { 'Intercepted': next } });
        return delegate.handle(req).pipe(operators_1.map(function (event) {
            if (event instanceof response_1.HttpResponse) {
                var existing_1 = event.headers.get('Intercepted');
                var next_1 = !!existing_1 ? existing_1 + ',' + _this.value : _this.value;
                return event.clone({ headers: event.headers.set('Intercepted', next_1) });
            }
            return event;
        }));
    };
    return TestInterceptor;
}());
var InterceptorA = /** @class */ (function (_super) {
    __extends(InterceptorA, _super);
    function InterceptorA() {
        return _super.call(this, 'A') || this;
    }
    return InterceptorA;
}(TestInterceptor));
var InterceptorB = /** @class */ (function (_super) {
    __extends(InterceptorB, _super);
    function InterceptorB() {
        return _super.call(this, 'B') || this;
    }
    return InterceptorB;
}(TestInterceptor));
var ReentrantInterceptor = /** @class */ (function () {
    function ReentrantInterceptor(client) {
        this.client = client;
    }
    ReentrantInterceptor.prototype.intercept = function (req, next) {
        return next.handle(req);
    };
    ReentrantInterceptor = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [client_1.HttpClient])
    ], ReentrantInterceptor);
    return ReentrantInterceptor;
}());
{
    describe('HttpClientModule', function () {
        var injector;
        beforeEach(function () {
            injector = testing_1.TestBed.configureTestingModule({
                imports: [module_1.HttpClientTestingModule],
                providers: [
                    { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: InterceptorA, multi: true },
                    { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: InterceptorB, multi: true },
                ],
            });
        });
        it('initializes HttpClient properly', function (done) {
            injector.get(client_1.HttpClient).get('/test', { responseType: 'text' }).subscribe(function (value) {
                expect(value).toBe('ok!');
                done();
            });
            injector.get(api_1.HttpTestingController).expectOne('/test').flush('ok!');
        });
        it('intercepts outbound responses in the order in which interceptors were bound', function (done) {
            injector.get(client_1.HttpClient)
                .get('/test', { observe: 'response', responseType: 'text' })
                .subscribe(function (value) { return done(); });
            var req = injector.get(api_1.HttpTestingController).expectOne('/test');
            expect(req.request.headers.get('Intercepted')).toEqual('A,B');
            req.flush('ok!');
        });
        it('intercepts inbound responses in the right (reverse binding) order', function (done) {
            injector.get(client_1.HttpClient)
                .get('/test', { observe: 'response', responseType: 'text' })
                .subscribe(function (value) {
                expect(value.headers.get('Intercepted')).toEqual('B,A');
                done();
            });
            injector.get(api_1.HttpTestingController).expectOne('/test').flush('ok!');
        });
        it('allows interceptors to inject HttpClient', function (done) {
            testing_1.TestBed.resetTestingModule();
            injector = testing_1.TestBed.configureTestingModule({
                imports: [module_1.HttpClientTestingModule],
                providers: [
                    { provide: interceptor_1.HTTP_INTERCEPTORS, useClass: ReentrantInterceptor, multi: true },
                ],
            });
            injector.get(client_1.HttpClient).get('/test').subscribe(function () { done(); });
            injector.get(api_1.HttpTestingController).expectOne('/test').flush('ok!');
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vaHR0cC90ZXN0L21vZHVsZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFtRDtBQUNuRCxpREFBOEM7QUFFOUMsNENBQW1DO0FBR25DLHdDQUF5QztBQUN6QyxrREFBc0U7QUFFdEUsNENBQXdEO0FBQ3hELDBDQUF5RDtBQUN6RCxnREFBOEQ7QUFHOUQ7SUFDRSx5QkFBb0IsS0FBYTtRQUFiLFVBQUssR0FBTCxLQUFLLENBQVE7SUFBRyxDQUFDO0lBRXJDLG1DQUFTLEdBQVQsVUFBVSxHQUFxQixFQUFFLFFBQXFCO1FBQXRELGlCQVlDO1FBWEMsSUFBTSxRQUFRLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDaEQsSUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ25FLEdBQUcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUMsVUFBVSxFQUFFLEVBQUMsYUFBYSxFQUFFLElBQUksRUFBQyxFQUFDLENBQUMsQ0FBQztRQUNyRCxPQUFPLFFBQVEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQUcsQ0FBQyxVQUFBLEtBQUs7WUFDeEMsSUFBSSxLQUFLLFlBQVksdUJBQVksRUFBRTtnQkFDakMsSUFBTSxVQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2xELElBQU0sTUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFRLENBQUMsQ0FBQyxDQUFD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