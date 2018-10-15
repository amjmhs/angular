"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var render_store_1 = require("@angular/platform-webworker/src/web_workers/shared/render_store");
{
    describe('RenderStoreSpec', function () {
        var store;
        beforeEach(function () { store = new render_store_1.RenderStore(); });
        it('should allocate ids', function () {
            expect(store.allocateId()).toBe(0);
            expect(store.allocateId()).toBe(1);
        });
        it('should serialize objects', function () {
            var id = store.allocateId();
            var obj = 'testObject';
            store.store(obj, id);
            expect(store.serialize(obj)).toBe(id);
        });
        it('should deserialize objects', function () {
            var id = store.allocateId();
            var obj = 'testObject';
            store.store(obj, id);
            expect(store.deserialize(id)).toBe(obj);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyX3N0b3JlX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9wbGF0Zm9ybS13ZWJ3b3JrZXIvdGVzdC93ZWJfd29ya2Vycy9zaGFyZWQvcmVuZGVyX3N0b3JlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnR0FBNEY7QUFFNUY7SUFDRSxRQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsSUFBSSxLQUFrQixDQUFDO1FBQ3ZCLFVBQVUsQ0FBQyxjQUFRLEtBQUssR0FBRyxJQUFJLDBCQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpELEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsSUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQzlCLElBQU0sR0FBRyxHQUFHLFlBQVksQ0FBQztZQUN6QixLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0QkFBNEIsRUFBRTtZQUMvQixJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7WUFDOUIsSUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDO1lBQ3pCLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzFDLENBQUMsQ0FBQyxDQUFDO0lBRUwsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9