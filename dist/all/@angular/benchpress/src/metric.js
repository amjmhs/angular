"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * A metric is measures values
 */
var Metric = /** @class */ (function () {
    function Metric() {
    }
    /**
     * Starts measuring
     */
    Metric.prototype.beginMeasure = function () { throw new Error('NYI'); };
    /**
     * Ends measuring and reports the data
     * since the begin call.
     * @param restart: Whether to restart right after this.
     */
    Metric.prototype.endMeasure = function (restart) { throw new Error('NYI'); };
    /**
     * Describes the metrics provided by this metric implementation.
     * (e.g. units, ...)
     */
    Metric.prototype.describe = function () { throw new Error('NYI'); };
    return Metric;
}());
exports.Metric = Metric;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvYmVuY2hwcmVzcy9zcmMvbWV0cmljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0g7O0dBRUc7QUFDSDtJQUFBO0lBa0JBLENBQUM7SUFqQkM7O09BRUc7SUFDSCw2QkFBWSxHQUFaLGNBQStCLE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXhEOzs7O09BSUc7SUFDSCwyQkFBVSxHQUFWLFVBQVcsT0FBZ0IsSUFBbUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdkY7OztPQUdHO0lBQ0gseUJBQVEsR0FBUixjQUFzQyxNQUFNLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqRSxhQUFDO0FBQUQsQ0FBQyxBQWxCRCxJQWtCQztBQWxCcUIsd0JBQU0ifQ==