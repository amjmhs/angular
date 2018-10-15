"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var _a = require('incremental-dom'), patch = _a.patch, elementOpen = _a.elementOpen, elementClose = _a.elementClose, elementOpenStart = _a.elementOpenStart, elementOpenEnd = _a.elementOpenEnd, attr = _a.attr, text = _a.text;
var TableComponent = /** @class */ (function () {
    function TableComponent(_rootEl) {
        this._rootEl = _rootEl;
    }
    Object.defineProperty(TableComponent.prototype, "data", {
        set: function (data) {
            var _this = this;
            patch(this._rootEl, function () { return _this._render(data); });
        },
        enumerable: true,
        configurable: true
    });
    TableComponent.prototype._render = function (data) {
        elementOpen('table');
        elementOpen('tbody');
        for (var r = 0; r < data.length; r++) {
            elementOpen('tr');
            var row = data[r];
            for (var c = 0; c < row.length; c++) {
                elementOpenStart('td');
                if (r % 2 === 0) {
                    attr('style', 'background-color: grey');
                }
                elementOpenEnd('td');
                text(row[c].value);
                elementClose('td');
            }
            elementClose('tr');
        }
        elementClose('tbody');
        elementClose('table');
    };
    return TableComponent;
}());
exports.TableComponent = TableComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL2JlbmNobWFya3Mvc3JjL2xhcmdldGFibGUvaW5jcmVtZW50YWxfZG9tL3RhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0csSUFBQSwrQkFDd0IsRUFEdkIsZ0JBQUssRUFBRSw0QkFBVyxFQUFFLDhCQUFZLEVBQUUsc0NBQWdCLEVBQUUsa0NBQWMsRUFBRSxjQUFJLEVBQUUsY0FBSSxDQUN0RDtBQUUvQjtJQUNFLHdCQUFvQixPQUFZO1FBQVosWUFBTyxHQUFQLE9BQU8sQ0FBSztJQUFHLENBQUM7SUFFcEMsc0JBQUksZ0NBQUk7YUFBUixVQUFTLElBQW1CO1lBQTVCLGlCQUFnRjtZQUFoRCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBbEIsQ0FBa0IsQ0FBQyxDQUFDO1FBQUMsQ0FBQzs7O09BQUE7SUFFeEUsZ0NBQU8sR0FBZixVQUFnQixJQUFtQjtRQUNqQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3BDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ25DLGdCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUN2QixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNmLElBQUksQ0FBQyxPQUFPLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztpQkFDekM7Z0JBQ0QsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNuQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEI7WUFDRCxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEI7UUFDRCxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdEIsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUF6QkQsSUF5QkM7QUF6Qlksd0NBQWMifQ==