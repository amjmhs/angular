"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../src/util");
{
    describe('stringify', function () {
        it('should return string undefined when toString returns undefined', function () { return expect(util_1.stringify({ toString: function () { return undefined; } })).toBe('undefined'); });
        it('should return string null when toString returns null', function () { return expect(util_1.stringify({ toString: function () { return null; } })).toBe('null'); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3V0aWxfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG9DQUFzQztBQUV0QztJQUNFLFFBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsRUFBRSxDQUFDLGdFQUFnRSxFQUNoRSxjQUFNLE9BQUEsTUFBTSxDQUFDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsY0FBVyxPQUFBLFNBQVMsRUFBVCxDQUFTLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxFQUFyRSxDQUFxRSxDQUFDLENBQUM7UUFFaEYsRUFBRSxDQUFDLHNEQUFzRCxFQUN0RCxjQUFNLE9BQUEsTUFBTSxDQUFDLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsY0FBVyxPQUFBLElBQUksRUFBSixDQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUEzRCxDQUEyRCxDQUFDLENBQUM7SUFDeEUsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9