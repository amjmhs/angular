"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var MeasureValues = /** @class */ (function () {
    function MeasureValues(runIndex, timeStamp, values) {
        this.runIndex = runIndex;
        this.timeStamp = timeStamp;
        this.values = values;
    }
    MeasureValues.prototype.toJson = function () {
        return {
            'timeStamp': this.timeStamp.toJSON(),
            'runIndex': this.runIndex,
            'values': this.values,
        };
    };
    return MeasureValues;
}());
exports.MeasureValues = MeasureValues;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVhc3VyZV92YWx1ZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9tZWFzdXJlX3ZhbHVlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVIO0lBQ0UsdUJBQ1csUUFBZ0IsRUFBUyxTQUFlLEVBQVMsTUFBNEI7UUFBN0UsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUFTLGNBQVMsR0FBVCxTQUFTLENBQU07UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFzQjtJQUFHLENBQUM7SUFFNUYsOEJBQU0sR0FBTjtRQUNFLE9BQU87WUFDTCxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7WUFDcEMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3pCLFFBQVEsRUFBRSxJQUFJLENBQUMsTUFBTTtTQUN0QixDQUFDO0lBQ0osQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYWSxzQ0FBYSJ9