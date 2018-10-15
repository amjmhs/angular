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
var client_1 = require("../../src/client");
var backend_1 = require("../src/backend");
testing_internal_1.describe('HttpClient TestRequest', function () {
    testing_internal_1.it('accepts a null body', function () {
        var mock = new backend_1.HttpClientTestingBackend();
        var client = new client_1.HttpClient(mock);
        var resp;
        client.post('/some-url', { test: 'test' }).subscribe(function (body) { resp = body; });
        var req = mock.expectOne('/some-url');
        req.flush(null);
        expect(resp).toBeNull();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tbW9uL2h0dHAvdGVzdGluZy90ZXN0L3JlcXVlc3Rfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUF3RjtBQUV4RiwyQ0FBNEM7QUFDNUMsMENBQXdEO0FBRXhELDJCQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMscUJBQUUsQ0FBQyxxQkFBcUIsRUFBRTtRQUN4QixJQUFNLElBQUksR0FBRyxJQUFJLGtDQUF3QixFQUFFLENBQUM7UUFDNUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXBDLElBQUksSUFBUyxDQUFDO1FBQ2QsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBQSxJQUFJLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdFLElBQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDeEMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVoQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9