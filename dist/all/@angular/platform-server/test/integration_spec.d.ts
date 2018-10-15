/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
export declare class HttpBeforeExampleModule {
}
export declare class HttpAfterExampleModule {
}
export declare class HttpClientExampleModule {
}
export declare class MyHttpInterceptor implements HttpInterceptor {
    private http;
    constructor(http: HttpClient);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>;
}
export declare class HttpInterceptorExampleModule {
}
