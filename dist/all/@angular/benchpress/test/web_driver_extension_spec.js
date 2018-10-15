"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../index");
(function () {
    function createExtension(ids, caps) {
        return new Promise(function (res, rej) {
            try {
                res(index_1.Injector
                    .create([
                    ids.map(function (id) { return ({ provide: id, useValue: new MockExtension(id) }); }),
                    { provide: index_1.Options.CAPABILITIES, useValue: caps },
                    index_1.WebDriverExtension.provideFirstSupported(ids)
                ])
                    .get(index_1.WebDriverExtension));
            }
            catch (e) {
                rej(e);
            }
        });
    }
    testing_internal_1.describe('WebDriverExtension.provideFirstSupported', function () {
        testing_internal_1.it('should provide the extension that matches the capabilities', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension(['m1', 'm2', 'm3'], { 'browser': 'm2' }).then(function (m) {
                testing_internal_1.expect(m.id).toEqual('m2');
                async.done();
            });
        }));
        testing_internal_1.it('should throw if there is no match', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createExtension(['m1'], { 'browser': 'm2' }).catch(function (err) {
                testing_internal_1.expect(err != null).toBe(true);
                async.done();
            });
        }));
    });
})();
var MockExtension = /** @class */ (function (_super) {
    __extends(MockExtension, _super);
    function MockExtension(id) {
        var _this = _super.call(this) || this;
        _this.id = id;
        return _this;
    }
    MockExtension.prototype.supports = function (capabilities) {
        return capabilities['browser'] === this.id;
    };
    return MockExtension;
}(index_1.WebDriverExtension));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViX2RyaXZlcl9leHRlbnNpb25fc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3MvdGVzdC93ZWJfZHJpdmVyX2V4dGVuc2lvbl9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILCtFQUE0RztBQUU1RyxrQ0FBK0Q7QUFFL0QsQ0FBQztJQUNDLHlCQUF5QixHQUFVLEVBQUUsSUFBUztRQUM1QyxPQUFPLElBQUksT0FBTyxDQUFNLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDL0IsSUFBSTtnQkFDRixHQUFHLENBQUMsZ0JBQVE7cUJBQ0gsTUFBTSxDQUFDO29CQUNOLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFFLElBQUssT0FBQSxDQUFDLEVBQUMsT0FBTyxFQUFFLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUMsQ0FBQyxFQUFoRCxDQUFnRCxDQUFDO29CQUNqRSxFQUFDLE9BQU8sRUFBRSxlQUFPLENBQUMsWUFBWSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7b0JBQy9DLDBCQUFrQixDQUFDLHFCQUFxQixDQUFDLEdBQUcsQ0FBQztpQkFDOUMsQ0FBQztxQkFDRCxHQUFHLENBQUMsMEJBQWtCLENBQUMsQ0FBQyxDQUFDO2FBQ25DO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1YsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1I7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCwyQkFBUSxDQUFDLDBDQUEwQyxFQUFFO1FBRW5ELHFCQUFFLENBQUMsNERBQTRELEVBQzVELHlCQUFNLENBQUMsQ0FBQyxxQ0FBa0IsQ0FBQyxFQUFFLFVBQUMsS0FBeUI7WUFDckQsZUFBZSxDQUFDLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUM7Z0JBQzVELHlCQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDM0IsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAscUJBQUUsQ0FBQyxtQ0FBbUMsRUFDbkMseUJBQU0sQ0FBQyxDQUFDLHFDQUFrQixDQUFDLEVBQUUsVUFBQyxLQUF5QjtZQUNyRCxlQUFlLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFDLEdBQUc7Z0JBQ25ELHlCQUFNLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDL0IsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2YsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsRUFBRSxDQUFDO0FBRUw7SUFBNEIsaUNBQWtCO0lBQzVDLHVCQUFtQixFQUFVO1FBQTdCLFlBQWlDLGlCQUFPLFNBQUc7UUFBeEIsUUFBRSxHQUFGLEVBQUUsQ0FBUTs7SUFBYSxDQUFDO0lBRTNDLGdDQUFRLEdBQVIsVUFBUyxZQUFrQztRQUN6QyxPQUFPLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQzdDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFORCxDQUE0QiwwQkFBa0IsR0FNN0MifQ==