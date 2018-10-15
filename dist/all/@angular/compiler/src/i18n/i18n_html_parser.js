"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../core");
var interpolation_config_1 = require("../ml_parser/interpolation_config");
var parser_1 = require("../ml_parser/parser");
var digest_1 = require("./digest");
var extractor_merger_1 = require("./extractor_merger");
var xliff_1 = require("./serializers/xliff");
var xliff2_1 = require("./serializers/xliff2");
var xmb_1 = require("./serializers/xmb");
var xtb_1 = require("./serializers/xtb");
var translation_bundle_1 = require("./translation_bundle");
var I18NHtmlParser = /** @class */ (function () {
    function I18NHtmlParser(_htmlParser, translations, translationsFormat, missingTranslation, console) {
        if (missingTranslation === void 0) { missingTranslation = core_1.MissingTranslationStrategy.Warning; }
        this._htmlParser = _htmlParser;
        if (translations) {
            var serializer = createSerializer(translationsFormat);
            this._translationBundle =
                translation_bundle_1.TranslationBundle.load(translations, 'i18n', serializer, missingTranslation, console);
        }
        else {
            this._translationBundle =
                new translation_bundle_1.TranslationBundle({}, null, digest_1.digest, undefined, missingTranslation, console);
        }
    }
    I18NHtmlParser.prototype.parse = function (source, url, parseExpansionForms, interpolationConfig) {
        if (parseExpansionForms === void 0) { parseExpansionForms = false; }
        if (interpolationConfig === void 0) { interpolationConfig = interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG; }
        var parseResult = this._htmlParser.parse(source, url, parseExpansionForms, interpolationConfig);
        if (parseResult.errors.length) {
            return new parser_1.ParseTreeResult(parseResult.rootNodes, parseResult.errors);
        }
        return extractor_merger_1.mergeTranslations(parseResult.rootNodes, this._translationBundle, interpolationConfig, [], {});
    };
    return I18NHtmlParser;
}());
exports.I18NHtmlParser = I18NHtmlParser;
function createSerializer(format) {
    format = (format || 'xlf').toLowerCase();
    switch (format) {
        case 'xmb':
            return new xmb_1.Xmb();
        case 'xtb':
            return new xtb_1.Xtb();
        case 'xliff2':
        case 'xlf2':
            return new xliff2_1.Xliff2();
        case 'xliff':
        case 'xlf':
        default:
            return new xliff_1.Xliff();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9odG1sX3BhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL2kxOG5faHRtbF9wYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnQ0FBbUQ7QUFFbkQsMEVBQW9HO0FBQ3BHLDhDQUFvRDtBQUdwRCxtQ0FBZ0M7QUFDaEMsdURBQXFEO0FBRXJELDZDQUEwQztBQUMxQywrQ0FBNEM7QUFDNUMseUNBQXNDO0FBQ3RDLHlDQUFzQztBQUN0QywyREFBdUQ7QUFFdkQ7SUFNRSx3QkFDWSxXQUF1QixFQUFFLFlBQXFCLEVBQUUsa0JBQTJCLEVBQ25GLGtCQUFtRixFQUNuRixPQUFpQjtRQURqQixtQ0FBQSxFQUFBLHFCQUFpRCxpQ0FBMEIsQ0FBQyxPQUFPO1FBRDNFLGdCQUFXLEdBQVgsV0FBVyxDQUFZO1FBR2pDLElBQUksWUFBWSxFQUFFO1lBQ2hCLElBQU0sVUFBVSxHQUFHLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDeEQsSUFBSSxDQUFDLGtCQUFrQjtnQkFDbkIsc0NBQWlCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLGtCQUFrQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzNGO2FBQU07WUFDTCxJQUFJLENBQUMsa0JBQWtCO2dCQUNuQixJQUFJLHNDQUFpQixDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsZUFBTSxFQUFFLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNyRjtJQUNILENBQUM7SUFFRCw4QkFBSyxHQUFMLFVBQ0ksTUFBYyxFQUFFLEdBQVcsRUFBRSxtQkFBb0MsRUFDakUsbUJBQXVFO1FBRDFDLG9DQUFBLEVBQUEsMkJBQW9DO1FBQ2pFLG9DQUFBLEVBQUEsc0JBQTJDLG1EQUE0QjtRQUN6RSxJQUFNLFdBQVcsR0FDYixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLG1CQUFtQixFQUFFLG1CQUFtQixDQUFDLENBQUM7UUFFbEYsSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRTtZQUM3QixPQUFPLElBQUksd0JBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2RTtRQUVELE9BQU8sb0NBQWlCLENBQ3BCLFdBQVcsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLGtCQUFrQixFQUFFLG1CQUFtQixFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNuRixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBakNELElBaUNDO0FBakNZLHdDQUFjO0FBbUMzQiwwQkFBMEIsTUFBZTtJQUN2QyxNQUFNLEdBQUcsQ0FBQyxNQUFNLElBQUksS0FBSyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFFekMsUUFBUSxNQUFNLEVBQUU7UUFDZCxLQUFLLEtBQUs7WUFDUixPQUFPLElBQUksU0FBRyxFQUFFLENBQUM7UUFDbkIsS0FBSyxLQUFLO1lBQ1IsT0FBTyxJQUFJLFNBQUcsRUFBRSxDQUFDO1FBQ25CLEtBQUssUUFBUSxDQUFDO1FBQ2QsS0FBSyxNQUFNO1lBQ1QsT0FBTyxJQUFJLGVBQU0sRUFBRSxDQUFDO1FBQ3RCLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxLQUFLLENBQUM7UUFDWDtZQUNFLE9BQU8sSUFBSSxhQUFLLEVBQUUsQ0FBQztLQUN0QjtBQUNILENBQUMifQ==