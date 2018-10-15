"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("./core");
var util_1 = require("./util");
var CompilerConfig = /** @class */ (function () {
    function CompilerConfig(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.defaultEncapsulation, defaultEncapsulation = _c === void 0 ? core_1.ViewEncapsulation.Emulated : _c, _d = _b.useJit, useJit = _d === void 0 ? true : _d, _e = _b.jitDevMode, jitDevMode = _e === void 0 ? false : _e, _f = _b.missingTranslation, missingTranslation = _f === void 0 ? null : _f, preserveWhitespaces = _b.preserveWhitespaces, strictInjectionParameters = _b.strictInjectionParameters;
        this.defaultEncapsulation = defaultEncapsulation;
        this.useJit = !!useJit;
        this.jitDevMode = !!jitDevMode;
        this.missingTranslation = missingTranslation;
        this.preserveWhitespaces = preserveWhitespacesDefault(util_1.noUndefined(preserveWhitespaces));
        this.strictInjectionParameters = strictInjectionParameters === true;
    }
    return CompilerConfig;
}());
exports.CompilerConfig = CompilerConfig;
function preserveWhitespacesDefault(preserveWhitespacesOption, defaultSetting) {
    if (defaultSetting === void 0) { defaultSetting = false; }
    return preserveWhitespacesOption === null ? defaultSetting : preserveWhitespacesOption;
}
exports.preserveWhitespacesDefault = preserveWhitespacesDefault;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2NvbmZpZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILCtCQUFxRTtBQUdyRSwrQkFBbUM7QUFFbkM7SUFRRSx3QkFDSSxFQVFNO1lBUk4sNEJBUU0sRUFSTCw0QkFBaUQsRUFBakQsNkVBQWlELEVBQUUsY0FBYSxFQUFiLGtDQUFhLEVBQUUsa0JBQWtCLEVBQWxCLHVDQUFrQixFQUNwRiwwQkFBeUIsRUFBekIsOENBQXlCLEVBQUUsNENBQW1CLEVBQUUsd0RBQXlCO1FBUTVFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxvQkFBb0IsQ0FBQztRQUNqRCxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBQy9CLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxrQkFBa0IsQ0FBQztRQUM3QyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsMEJBQTBCLENBQUMsa0JBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFDeEYsSUFBSSxDQUFDLHlCQUF5QixHQUFHLHlCQUF5QixLQUFLLElBQUksQ0FBQztJQUN0RSxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBekJELElBeUJDO0FBekJZLHdDQUFjO0FBMkIzQixvQ0FDSSx5QkFBeUMsRUFBRSxjQUFzQjtJQUF0QiwrQkFBQSxFQUFBLHNCQUFzQjtJQUNuRSxPQUFPLHlCQUF5QixLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyx5QkFBeUIsQ0FBQztBQUN6RixDQUFDO0FBSEQsZ0VBR0MifQ==