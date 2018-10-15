"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var change_detection_util_1 = require("@angular/core/src/change_detection/change_detection_util");
var query_list_1 = require("@angular/core/src/linker/query_list");
var testing_1 = require("@angular/core/testing");
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
{
    testing_internal_1.describe('QueryList', function () {
        var queryList;
        var log;
        testing_internal_1.beforeEach(function () {
            queryList = new query_list_1.QueryList();
            log = '';
        });
        function logAppend(item /** TODO #9100 */) { log += (log.length == 0 ? '' : ', ') + item; }
        testing_internal_1.describe('dirty and reset', function () {
            testing_internal_1.it('should initially be dirty and empty', function () {
                testing_internal_1.expect(queryList.dirty).toBeTruthy();
                testing_internal_1.expect(queryList.length).toBe(0);
            });
            testing_internal_1.it('should be not dirty after reset', function () {
                testing_internal_1.expect(queryList.dirty).toBeTruthy();
                queryList.reset(['one', 'two']);
                testing_internal_1.expect(queryList.dirty).toBeFalsy();
                testing_internal_1.expect(queryList.length).toBe(2);
            });
        });
        testing_internal_1.it('should support resetting and iterating over the new objects', function () {
            queryList.reset(['one']);
            queryList.reset(['two']);
            change_detection_util_1.iterateListLike(queryList, logAppend);
            testing_internal_1.expect(log).toEqual('two');
        });
        testing_internal_1.it('should support length', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.length).toEqual(2);
        });
        testing_internal_1.it('should support map', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.map(function (x) { return x; })).toEqual(['one', 'two']);
        });
        testing_internal_1.it('should support map with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.map(function (x, i) { return x + "_" + i; })).toEqual(['one_0', 'two_1']);
        });
        testing_internal_1.it('should support forEach', function () {
            queryList.reset(['one', 'two']);
            var join = '';
            queryList.forEach(function (x) { return join = join + x; });
            testing_internal_1.expect(join).toEqual('onetwo');
        });
        testing_internal_1.it('should support forEach with index', function () {
            queryList.reset(['one', 'two']);
            var join = '';
            queryList.forEach(function (x, i) { return join = join + x + i; });
            testing_internal_1.expect(join).toEqual('one0two1');
        });
        testing_internal_1.it('should support filter', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.filter(function (x) { return x == 'one'; })).toEqual(['one']);
        });
        testing_internal_1.it('should support filter with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.filter(function (x, i) { return i == 0; })).toEqual(['one']);
        });
        testing_internal_1.it('should support find', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.find(function (x) { return x == 'two'; })).toEqual('two');
        });
        testing_internal_1.it('should support find with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.find(function (x, i) { return i == 1; })).toEqual('two');
        });
        testing_internal_1.it('should support reduce', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.reduce(function (a, x) { return a + x; }, 'start:')).toEqual('start:onetwo');
        });
        testing_internal_1.it('should support reduce with index', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.reduce(function (a, x, i) { return a + x + i; }, 'start:'))
                .toEqual('start:one0two1');
        });
        testing_internal_1.it('should support toArray', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.reduce(function (a, x) { return a + x; }, 'start:')).toEqual('start:onetwo');
        });
        testing_internal_1.it('should support toArray', function () {
            queryList.reset(['one', 'two']);
            testing_internal_1.expect(queryList.toArray()).toEqual(['one', 'two']);
        });
        testing_internal_1.it('should support toString', function () {
            queryList.reset(['one', 'two']);
            var listString = queryList.toString();
            testing_internal_1.expect(listString.indexOf('one') != -1).toBeTruthy();
            testing_internal_1.expect(listString.indexOf('two') != -1).toBeTruthy();
        });
        testing_internal_1.it('should support first and last', function () {
            queryList.reset(['one', 'two', 'three']);
            testing_internal_1.expect(queryList.first).toEqual('one');
            testing_internal_1.expect(queryList.last).toEqual('three');
        });
        testing_internal_1.it('should support some', function () {
            queryList.reset(['one', 'two', 'three']);
            testing_internal_1.expect(queryList.some(function (item) { return item === 'one'; })).toEqual(true);
            testing_internal_1.expect(queryList.some(function (item) { return item === 'four'; })).toEqual(false);
        });
        if (dom_adapter_1.getDOM().supportsDOMEvents()) {
            testing_internal_1.describe('simple observable interface', function () {
                testing_internal_1.it('should fire callbacks on change', testing_1.fakeAsync(function () {
                    var fires = 0;
                    queryList.changes.subscribe({ next: function (_) { fires += 1; } });
                    queryList.notifyOnChanges();
                    testing_1.tick();
                    testing_internal_1.expect(fires).toEqual(1);
                    queryList.notifyOnChanges();
                    testing_1.tick();
                    testing_internal_1.expect(fires).toEqual(2);
                }));
                testing_internal_1.it('should provides query list as an argument', testing_1.fakeAsync(function () {
                    var recorded /** TODO #9100 */;
                    queryList.changes.subscribe({ next: function (v) { recorded = v; } });
                    queryList.reset(['one']);
                    queryList.notifyOnChanges();
                    testing_1.tick();
                    testing_internal_1.expect(recorded).toBe(queryList);
                }));
            });
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnlfbGlzdF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2xpbmtlci9xdWVyeV9saXN0X3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrR0FBeUY7QUFDekYsa0VBQThEO0FBQzlELGlEQUFzRDtBQUN0RCwrRUFBNEY7QUFDNUYsNkVBQXFFO0FBRXJFO0lBQ0UsMkJBQVEsQ0FBQyxXQUFXLEVBQUU7UUFDcEIsSUFBSSxTQUE0QixDQUFDO1FBQ2pDLElBQUksR0FBVyxDQUFDO1FBQ2hCLDZCQUFVLENBQUM7WUFDVCxTQUFTLEdBQUcsSUFBSSxzQkFBUyxFQUFVLENBQUM7WUFDcEMsR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBRUgsbUJBQW1CLElBQVMsQ0FBQyxpQkFBaUIsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBRWhHLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7WUFFMUIscUJBQUUsQ0FBQyxxQ0FBcUMsRUFBRTtnQkFDeEMseUJBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsVUFBVSxFQUFFLENBQUM7Z0JBQ3JDLHlCQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQyxDQUFDLENBQUMsQ0FBQztZQUVILHFCQUFFLENBQUMsaUNBQWlDLEVBQUU7Z0JBQ3BDLHlCQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLFVBQVUsRUFBRSxDQUFDO2dCQUNyQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxD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