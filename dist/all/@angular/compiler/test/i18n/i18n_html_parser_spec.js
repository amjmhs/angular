"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var i18n_html_parser_1 = require("@angular/compiler/src/i18n/i18n_html_parser");
var translation_bundle_1 = require("@angular/compiler/src/i18n/translation_bundle");
var html_parser_1 = require("@angular/compiler/src/ml_parser/html_parser");
{
    describe('I18N html parser', function () {
        // https://github.com/angular/angular/issues/14322
        it('should parse the translations only once', function () {
            var transBundle = new translation_bundle_1.TranslationBundle({}, null, function () { return 'id'; });
            spyOn(translation_bundle_1.TranslationBundle, 'load').and.returnValue(transBundle);
            var htmlParser = new html_parser_1.HtmlParser();
            var i18nHtmlParser = new i18n_html_parser_1.I18NHtmlParser(htmlParser, 'translations');
            expect(translation_bundle_1.TranslationBundle.load).toHaveBeenCalledTimes(1);
            i18nHtmlParser.parse('source', 'url');
            i18nHtmlParser.parse('source', 'url');
            expect(translation_bundle_1.TranslationBundle.load).toHaveBeenCalledTimes(1);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9odG1sX3BhcnNlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9pMThuL2kxOG5faHRtbF9wYXJzZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdGQUEyRTtBQUMzRSxvRkFBZ0Y7QUFDaEYsMkVBQXVFO0FBR3ZFO0lBQ0UsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQzNCLGtEQUFrRDtRQUNsRCxFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsSUFBTSxXQUFXLEdBQUcsSUFBSSxzQ0FBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUM7WUFDaEUsS0FBSyxDQUFDLHNDQUFpQixFQUFFLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDOUQsSUFBTSxVQUFVLEdBQUcsSUFBSSx3QkFBVSxFQUFFLENBQUM7WUFDcEMsSUFBTSxjQUFjLEdBQUcsSUFBSSxpQ0FBYyxDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUV0RSxNQUFNLENBQUMsc0NBQWlCLENBQUMsSUFBSSxDQUFDLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFeEQsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsY0FBYyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDdEMsTUFBTSxDQUFDLHNDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFELENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9