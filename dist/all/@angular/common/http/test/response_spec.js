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
var headers_1 = require("../src/headers");
var response_1 = require("../src/response");
{
    testing_internal_1.describe('HttpResponse', function () {
        testing_internal_1.describe('constructor()', function () {
            testing_internal_1.it('fully constructs responses', function () {
                var resp = new response_1.HttpResponse({
                    body: 'test body',
                    headers: new headers_1.HttpHeaders({
                        'Test': 'Test header',
                    }),
                    status: 201,
                    statusText: 'Created',
                    url: '/test',
                });
                expect(resp.body).toBe('test body');
                expect(resp.headers instanceof headers_1.HttpHeaders).toBeTruthy();
                expect(resp.headers.get('Test')).toBe('Test header');
                expect(resp.status).toBe(201);
                expect(resp.statusText).toBe('Created');
                expect(resp.url).toBe('/test');
            });
            testing_internal_1.it('uses defaults if no args passed', function () {
                var resp = new response_1.HttpResponse({});
                expect(resp.headers).not.toBeNull();
                expect(resp.status).toBe(200);
                expect(resp.statusText).toBe('OK');
                expect(resp.body).toBeNull();
                expect(resp.ok).toBeTruthy();
                expect(resp.url).toBeNull();
            });
            testing_internal_1.it('accepts a falsy body', function () {
                expect(new response_1.HttpResponse({ body: false }).body).toEqual(false);
                expect(new response_1.HttpResponse({ body: 0 }).body).toEqual(0);
            });
        });
        testing_internal_1.it('.ok is determined by status', function () {
            var good = new response_1.HttpResponse({ status: 200 });
            var alsoGood = new response_1.HttpResponse({ status: 299 });
            var badHigh = new response_1.HttpResponse({ status: 300 });
            var badLow = new response_1.HttpResponse({ status: 199 });
            expect(good.ok).toBe(true);
            expect(alsoGood.ok).toBe(true);
            expect(badHigh.ok).toBe(false);
            expect(badLow.ok).toBe(false);
        });
        testing_internal_1.describe('.clone()', function () {
            testing_internal_1.it('copies the original when given no arguments', function () {
                var clone = new response_1.HttpResponse({ body: 'test', status: 201, statusText: 'created', url: '/test' })
                    .clone();
                expect(clone.body).toBe('test');
                expect(clone.status).toBe(201);
                expect(clone.statusText).toBe('created');
                expect(clone.url).toBe('/test');
                expect(clone.headers).not.toBeNull();
            });
            testing_internal_1.it('overrides the original', function () {
                var orig = new response_1.HttpResponse({ body: 'test', status: 201, statusText: 'created', url: '/test' });
                var clone = orig.clone({ body: { data: 'test' }, status: 200, statusText: 'Okay', url: '/bar' });
                expect(clone.body).toEqual({ data: 'test' });
                expect(clone.status).toBe(200);
                expect(clone.statusText).toBe('Okay');
                expect(clone.url).toBe('/bar');
                expect(clone.headers).toBe(orig.headers);
            });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzcG9uc2Vfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbW1vbi9odHRwL3Rlc3QvcmVzcG9uc2Vfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUFtRjtBQUVuRiwwQ0FBMkM7QUFDM0MsNENBQTZDO0FBRTdDO0lBQ0UsMkJBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsMkJBQVEsQ0FBQyxlQUFlLEVBQUU7WUFDeEIscUJBQUUsQ0FBQyw0QkFBNEIsRUFBRTtnQkFDL0IsSUFBTSxJQUFJLEdBQUcsSUFBSSx1QkFBWSxDQUFDO29CQUM1QixJQUFJLEVBQUUsV0FBVztvQkFDakIsT0FBTyxFQUFFLElBQUkscUJBQVcsQ0FBQzt3QkFDdkIsTUFBTSxFQUFFLGFBQWE7cUJBQ3RCLENBQUM7b0JBQ0YsTUFBTSxFQUFFLEdBQUc7b0JBQ1gsVUFBVSxFQUFFLFNBQVM7b0JBQ3JCLEdBQUcsRUFBRSxPQUFPO2lCQUNiLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLFlBQVkscUJBQVcsQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUN6RCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3JELE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDakMsQ0FBQyxDQUFDLENBQUM7WUFDSCxxQkFBRSxDQUFDLGlDQUFpQyxFQUFFO2dCQUNwQyxJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQzdCLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7WUFDSCxxQkFBRSxDQUFDLHNCQUFzQixFQUFFO2dCQUN6QixNQUFNLENBQUMsSUFBSSx1QkFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUM1RCxNQUFNLENBQUMsSUFBSSx1QkFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDSCxxQkFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLElBQU0sSUFBSSxHQUFHLElBQUksdUJBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0sUUFBUSxHQUFHLElBQUksdUJBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksdUJBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQ2hELElBQU0sTUFBTSxHQUFHLElBQUksdUJBQVksQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUMsQ0FBQyxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzNCLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsMkJBQVEsQ0FBQyxVQUFVLEVBQUU7WUFDbkIscUJBQUUsQ0FBQyw2Q0FBNkMsRUFBRTtnQkFDaEQsSUFBTSxLQUFLLEdBQ1AsSUFBSSx1QkFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDO3FCQUM3RSxLQUFLLEVBQUUsQ0FBQztnQkFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ2hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3ZDLENBQUMsQ0FBQyxDQUFDO1lBQ0gscUJBQUUsQ0FBQyx3QkFBd0IsRUFBRTtnQkFDM0IsSUFBTSxJQUFJLEdBQ04sSUFBSSx1QkFBWSxDQUFDLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7Z0JBQ3ZGLElBQU0sS0FBSyxHQUNQLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBQyxJQUFJLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO2dCQUNyRixNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO2dCQUMzQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==