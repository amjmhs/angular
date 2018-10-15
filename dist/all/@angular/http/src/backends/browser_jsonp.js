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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var _nextRequestId = 0;
exports.JSONP_HOME = '__ng_jsonp__';
var _jsonpConnections = null;
function _getJsonpConnections() {
    var w = typeof window == 'object' ? window : {};
    if (_jsonpConnections === null) {
        _jsonpConnections = w[exports.JSONP_HOME] = {};
    }
    return _jsonpConnections;
}
// Make sure not to evaluate this in a non-browser environment!
var BrowserJsonp = /** @class */ (function () {
    function BrowserJsonp() {
    }
    // Construct a <script> element with the specified URL
    BrowserJsonp.prototype.build = function (url) {
        var node = document.createElement('script');
        node.src = url;
        return node;
    };
    BrowserJsonp.prototype.nextRequestID = function () { return "__req" + _nextRequestId++; };
    BrowserJsonp.prototype.requestCallback = function (id) { return exports.JSONP_HOME + "." + id + ".finished"; };
    BrowserJsonp.prototype.exposeConnection = function (id, connection) {
        var connections = _getJsonpConnections();
        connections[id] = connection;
    };
    BrowserJsonp.prototype.removeConnection = function (id) {
        var connections = _getJsonpConnections();
        connections[id] = null;
    };
    // Attach the <script> element to the DOM
    BrowserJsonp.prototype.send = function (node) { document.body.appendChild((node)); };
    // Remove <script> element from the DOM
    BrowserJsonp.prototype.cleanup = function (node) {
        if (node.parentNode) {
            node.parentNode.removeChild((node));
        }
    };
    BrowserJsonp = __decorate([
        core_1.Injectable()
    ], BrowserJsonp);
    return BrowserJsonp;
}());
exports.BrowserJsonp = BrowserJsonp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlcl9qc29ucC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2h0dHAvc3JjL2JhY2tlbmRzL2Jyb3dzZXJfanNvbnAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBeUM7QUFFekMsSUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsUUFBQSxVQUFVLEdBQUcsY0FBYyxDQUFDO0FBQ3pDLElBQUksaUJBQWlCLEdBQThCLElBQUksQ0FBQztBQUV4RDtJQUNFLElBQU0sQ0FBQyxHQUF5QixPQUFPLE1BQU0sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQ3hFLElBQUksaUJBQWlCLEtBQUssSUFBSSxFQUFFO1FBQzlCLGlCQUFpQixHQUFHLENBQUMsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ3hDO0lBQ0QsT0FBTyxpQkFBaUIsQ0FBQztBQUMzQixDQUFDO0FBRUQsK0RBQStEO0FBRS9EO0lBQUE7SUErQkEsQ0FBQztJQTlCQyxzREFBc0Q7SUFDdEQsNEJBQUssR0FBTCxVQUFNLEdBQVc7UUFDZixJQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsb0NBQWEsR0FBYixjQUEwQixPQUFPLFVBQVEsY0FBYyxFQUFJLENBQUMsQ0FBQyxDQUFDO0lBRTlELHNDQUFlLEdBQWYsVUFBZ0IsRUFBVSxJQUFZLE9BQVUsa0JBQVUsU0FBSSxFQUFFLGNBQVcsQ0FBQyxDQUFDLENBQUM7SUFFOUUsdUNBQWdCLEdBQWhCLFVBQWlCLEVBQVUsRUFBRSxVQUFlO1FBQzFDLElBQU0sV0FBVyxHQUFHLG9CQUFvQixFQUFFLENBQUM7UUFDM0MsV0FBVyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztJQUMvQixDQUFDO0lBRUQsdUNBQWdCLEdBQWhCLFVBQWlCLEVBQVU7UUFDekIsSUFBTSxXQUFXLEdBQUcsb0JBQW9CLEVBQUUsQ0FBQztRQUMzQyxXQUFXLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRCx5Q0FBeUM7SUFDekMsMkJBQUksR0FBSixVQUFLLElBQVMsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTVELHVDQUF1QztJQUN2Qyw4QkFBTyxHQUFQLFVBQVEsSUFBUztRQUNmLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNuQixJQUFJLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDM0M7SUFDSCxDQUFDO0lBOUJVLFlBQVk7UUFEeEIsaUJBQVUsRUFBRTtPQUNBLFlBQVksQ0ErQnhCO0lBQUQsbUJBQUM7Q0FBQSxBQS9CRCxJQStCQztBQS9CWSxvQ0FBWSJ9