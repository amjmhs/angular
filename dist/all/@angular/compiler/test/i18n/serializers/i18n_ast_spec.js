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
var i18n = require("@angular/compiler/src/i18n/i18n_ast");
var digest_1 = require("../../../src/i18n/digest");
var i18n_parser_spec_1 = require("../i18n_parser_spec");
{
    describe('i18n AST', function () {
        describe('CloneVisitor', function () {
            it('should clone an AST', function () {
                var messages = i18n_parser_spec_1._extractMessages('<div i18n="m|d">b{count, plural, =0 {{sex, select, male {m}}}}a</div>');
                var nodes = messages[0].nodes;
                var text = digest_1.serializeNodes(nodes).join('');
                expect(text).toEqual('b<ph icu name="ICU">{count, plural, =0 {[{sex, select, male {[m]}}]}}</ph>a');
                var visitor = new i18n.CloneVisitor();
                var cloneNodes = nodes.map(function (n) { return n.visit(visitor); });
                expect(digest_1.serializeNodes(nodes)).toEqual(digest_1.serializeNodes(cloneNodes));
                nodes.forEach(function (n, i) {
                    expect(n).toEqual(cloneNodes[i]);
                    expect(n).not.toBe(cloneNodes[i]);
                });
            });
        });
        describe('RecurseVisitor', function () {
            it('should visit all nodes', function () {
                var visitor = new RecurseVisitor();
                var container = new i18n.Container([
                    new i18n.Text('', null),
                    new i18n.Placeholder('', '', null),
                    new i18n.IcuPlaceholder(null, '', null),
                ], null);
                var tag = new i18n.TagPlaceholder('', {}, '', '', [container], false, null);
                var icu = new i18n.Icu('', '', { tag: tag }, null);
                icu.visit(visitor);
                expect(visitor.textCount).toEqual(1);
                expect(visitor.phCount).toEqual(1);
                expect(visitor.icuPhCount).toEqual(1);
            });
        });
    });
}
var RecurseVisitor = /** @class */ (function (_super) {
    __extends(RecurseVisitor, _super);
    function RecurseVisitor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.textCount = 0;
        _this.phCount = 0;
        _this.icuPhCount = 0;
        return _this;
    }
    RecurseVisitor.prototype.visitText = function (text, context) { this.textCount++; };
    RecurseVisitor.prototype.visitPlaceholder = function (ph, context) { this.phCount++; };
    RecurseVisitor.prototype.visitIcuPlaceholder = function (ph, context) { this.icuPhCount++; };
    return RecurseVisitor;
}(i18n.RecurseVisitor));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaTE4bl9hc3Rfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3QvaTE4bi9zZXJpYWxpemVycy9pMThuX2FzdF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILDBEQUE0RDtBQUU1RCxtREFBd0Q7QUFDeEQsd0RBQXFEO0FBRXJEO0lBQ0UsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixRQUFRLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtnQkFDeEIsSUFBTSxRQUFRLEdBQUcsbUNBQWdCLENBQzdCLHVFQUF1RSxDQUFDLENBQUM7Z0JBQzdFLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2hDLElBQU0sSUFBSSxHQUFHLHVCQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUM1QyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUNoQiw2RUFBNkUsQ0FBQyxDQUFDO2dCQUNuRixJQUFNLE9BQU8sR0FBRyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEMsSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQztnQkFDcEQsTUFBTSxDQUFDLHVCQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsdUJBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO2dCQUNsRSxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBWSxFQUFFLENBQVM7b0JBQ3BDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2pDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDekIsRUFBRSxDQUFDLHdCQUF3QixFQUFFO2dCQUMzQixJQUFNLE9BQU8sR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO2dCQUNyQyxJQUFNLFNBQVMsR0FBRyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQ2hDO29CQUNFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBTSxDQUFDO29CQUN6QixJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxJQUFNLENBQUM7b0JBQ3BDLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFNLEVBQUUsRUFBRSxFQUFFLElBQU0sQ0FBQztpQkFDNUMsRUFDRCxJQUFNLENBQUMsQ0FBQztnQkFDWixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQU0sQ0FBQyxDQUFDO2dCQUNoRixJQUFNLEdBQUcsR0FBRyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFDLEdBQUcsS0FBQSxFQUFDLEVBQUUsSUFBTSxDQUFDLENBQUM7Z0JBRWhELEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNyQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDbkMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFFRDtJQUE2QixrQ0FBbUI7SUFBaEQ7UUFBQSxxRUFVQztRQVRDLGVBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxhQUFPLEdBQUcsQ0FBQyxDQUFDO1FBQ1osZ0JBQVUsR0FBRyxDQUFDLENBQUM7O0lBT2pCLENBQUM7SUFMQyxrQ0FBUyxHQUFULFVBQVUsSUFBZSxFQUFFLE9BQWEsSUFBUyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRXBFLHlDQUFnQixHQUFoQixVQUFpQixFQUFvQixFQUFFLE9BQWEsSUFBUyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlFLDRDQUFtQixHQUFuQixVQUFvQixFQUF1QixFQUFFLE9BQWEsSUFBUyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLHFCQUFDO0FBQUQsQ0FBQyxBQVZELENBQTZCLElBQUksQ0FBQyxjQUFjLEdBVS9DIn0=