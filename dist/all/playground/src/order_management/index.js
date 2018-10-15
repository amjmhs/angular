"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
/**
 * You can find the AngularJS implementation of this example here:
 * https://github.com/wardbell/ng1DataBinding
 */
// ---- model
var OrderItem = /** @class */ (function () {
    function OrderItem(orderItemId, orderId, productName, qty, unitPrice) {
        this.orderItemId = orderItemId;
        this.orderId = orderId;
        this.productName = productName;
        this.qty = qty;
        this.unitPrice = unitPrice;
    }
    Object.defineProperty(OrderItem.prototype, "total", {
        get: function () { return this.qty * this.unitPrice; },
        enumerable: true,
        configurable: true
    });
    return OrderItem;
}());
var Order = /** @class */ (function () {
    function Order(orderId, customerName, limit, _dataService) {
        this.orderId = orderId;
        this.customerName = customerName;
        this.limit = limit;
        this._dataService = _dataService;
    }
    Object.defineProperty(Order.prototype, "items", {
        get: function () { return this._dataService.itemsFor(this); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Order.prototype, "total", {
        get: function () { return this.items.map(function (i) { return i.total; }).reduce(function (a, b) { return a + b; }, 0); },
        enumerable: true,
        configurable: true
    });
    return Order;
}());
// ---- services
var _nextId = 1000;
var DataService = /** @class */ (function () {
    function DataService() {
        this.currentOrder = null;
        this.orders = [
            new Order(_nextId++, 'J. Coltrane', 100, this), new Order(_nextId++, 'B. Evans', 200, this)
        ];
        this.orderItems = [
            new OrderItem(_nextId++, this.orders[0].orderId, 'Bread', 5, 1),
            new OrderItem(_nextId++, this.orders[0].orderId, 'Brie', 5, 2),
            new OrderItem(_nextId++, this.orders[0].orderId, 'IPA', 5, 3),
            new OrderItem(_nextId++, this.orders[1].orderId, 'Mozzarella', 5, 2),
            new OrderItem(_nextId++, this.orders[1].orderId, 'Wine', 5, 3)
        ];
    }
    DataService.prototype.itemsFor = function (order) {
        return this.orderItems.filter(function (i) { return i.orderId === order.orderId; });
    };
    DataService.prototype.addItemForOrder = function (order) {
        this.orderItems.push(new OrderItem(_nextId++, order.orderId, '', 0, 0));
    };
    DataService.prototype.deleteItem = function (item) { this.orderItems.splice(this.orderItems.indexOf(item), 1); };
    DataService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], DataService);
    return DataService;
}());
// ---- components
var OrderListComponent = /** @class */ (function () {
    function OrderListComponent(_service) {
        this._service = _service;
        this.orders = _service.orders;
    }
    OrderListComponent.prototype.select = function (order) { this._service.currentOrder = order; };
    OrderListComponent = __decorate([
        core_1.Component({
            selector: 'order-list-cmp',
            template: "\n    <h1>Orders</h1>\n  \t<div *ngFor=\"let order of orders\" [class.warning]=\"order.total > order.limit\">\n      <div>\n        <label>Customer name:</label>\n        {{order.customerName}}\n      </div>\n\n      <div>\n        <label>Limit: <input [(ngModel)]=\"order.limit\" type=\"number\" placeholder=\"Limit\"></label>\n      </div>\n\n      <div>\n        <label>Number of items:</label>\n        {{order.items.length}}\n      </div>\n\n      <div>\n        <label>Order total:</label>\n        {{order.total}}\n      </div>\n\n      <button (click)=\"select(order)\">Select</button>\n  \t</div>\n  "
        }),
        __metadata("design:paramtypes", [DataService])
    ], OrderListComponent);
    return OrderListComponent;
}());
var OrderItemComponent = /** @class */ (function () {
    function OrderItemComponent() {
        this.delete = new core_1.EventEmitter();
    }
    OrderItemComponent.prototype.onDelete = function () { this.delete.emit(this.item); };
    __decorate([
        core_1.Input(),
        __metadata("design:type", OrderItem)
    ], OrderItemComponent.prototype, "item", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], OrderItemComponent.prototype, "delete", void 0);
    OrderItemComponent = __decorate([
        core_1.Component({
            selector: 'order-item-cmp',
            template: "\n    <div>\n      <div>\n        <label>Product name: <input [(ngModel)]=\"item.productName\" type=\"text\" placeholder=\"Product name\"></label>\n      </div>\n\n      <div>\n        <label>Quantity: <input [(ngModel)]=\"item.qty\" type=\"number\" placeholder=\"Quantity\"></label>\n      </div>\n\n      <div>\n        <label>Unit Price: <input [(ngModel)]=\"item.unitPrice\" type=\"number\" placeholder=\"Unit price\"></label>\n      </div>\n\n      <div>\n        <label>Total:</label>\n        {{item.total}}\n      </div>\n\n      <button (click)=\"onDelete()\">Delete</button>\n    </div>\n  "
        })
    ], OrderItemComponent);
    return OrderItemComponent;
}());
var OrderDetailsComponent = /** @class */ (function () {
    function OrderDetailsComponent(_service) {
        this._service = _service;
    }
    Object.defineProperty(OrderDetailsComponent.prototype, "order", {
        get: function () { return this._service.currentOrder; },
        enumerable: true,
        configurable: true
    });
    OrderDetailsComponent.prototype.deleteItem = function (item) { this._service.deleteItem(item); };
    OrderDetailsComponent.prototype.addItem = function () { this._service.addItemForOrder(this.order); };
    OrderDetailsComponent = __decorate([
        core_1.Component({
            selector: 'order-details-cmp',
            template: "\n    <div *ngIf=\"order !== null\">\n      <h1>Selected Order</h1>\n      <div>\n        <label>Customer name: <input [(ngModel)]=\"order.customerName\" type=\"text\" placeholder=\"Customer name\"></label>\n      </div>\n\n      <div>\n        <label>Limit: <input [(ngModel)]=\"order.limit\" type=\"number\" placeholder=\"Limit\"></label>\n      </div>\n\n      <div>\n        <label>Number of items:</label>\n        {{order.items.length}}\n      </div>\n\n      <div>\n        <label>Order total:</label>\n        {{order.total}}\n      </div>\n\n      <h2>Items</h2>\n      <button (click)=\"addItem()\">Add Item</button>\n      <order-item-cmp *ngFor=\"let item of order.items\" [item]=\"item\" (delete)=\"deleteItem(item)\"></order-item-cmp>\n    </div>\n  "
        }),
        __metadata("design:paramtypes", [DataService])
    ], OrderDetailsComponent);
    return OrderDetailsComponent;
}());
var OrderManagementApplication = /** @class */ (function () {
    function OrderManagementApplication() {
    }
    OrderManagementApplication = __decorate([
        core_1.Component({
            selector: 'order-management-app',
            providers: [DataService],
            template: "\n    <order-list-cmp></order-list-cmp>\n    <order-details-cmp></order-details-cmp>\n  "
        })
    ], OrderManagementApplication);
    return OrderManagementApplication;
}());
var ExampleModule = /** @class */ (function () {
    function ExampleModule() {
    }
    ExampleModule = __decorate([
        core_1.NgModule({
            bootstrap: [OrderManagementApplication],
            declarations: [OrderManagementApplication, OrderListComponent, OrderDetailsComponent, OrderItemComponent],
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule]
        })
    ], ExampleModule);
    return ExampleModule;
}());
function main() {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(ExampleModule);
}
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL29yZGVyX21hbmFnZW1lbnQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBMkY7QUFDM0Ysd0NBQTJDO0FBQzNDLDhEQUF3RDtBQUN4RCw4RUFBeUU7QUFFekU7OztHQUdHO0FBRUgsYUFBYTtBQUViO0lBQ0UsbUJBQ1csV0FBbUIsRUFBUyxPQUFlLEVBQVMsV0FBbUIsRUFDdkUsR0FBVyxFQUFTLFNBQWlCO1FBRHJDLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQVMsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFTLGdCQUFXLEdBQVgsV0FBVyxDQUFRO1FBQ3ZFLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO0lBQUcsQ0FBQztJQUVwRCxzQkFBSSw0QkFBSzthQUFULGNBQXNCLE9BQU8sSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDM0QsZ0JBQUM7QUFBRCxDQUFDLEFBTkQsSUFNQztBQUVEO0lBQ0UsZUFDVyxPQUFlLEVBQVMsWUFBb0IsRUFBUyxLQUFhLEVBQ2pFLFlBQXlCO1FBRDFCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDakUsaUJBQVksR0FBWixZQUFZLENBQWE7SUFBRyxDQUFDO0lBRXpDLHNCQUFJLHdCQUFLO2FBQVQsY0FBMkIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQUFBO0lBQ3JFLHNCQUFJLHdCQUFLO2FBQVQsY0FBc0IsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FB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