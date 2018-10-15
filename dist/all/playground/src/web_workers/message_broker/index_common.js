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
var platform_webworker_1 = require("@angular/platform-webworker");
var ECHO_CHANNEL = 'ECHO';
var App = /** @class */ (function () {
    function App(_serviceBrokerFactory) {
        this._serviceBrokerFactory = _serviceBrokerFactory;
        var broker = _serviceBrokerFactory.createMessageBroker(ECHO_CHANNEL, false);
        broker.registerMethod('echo', [1 /* PRIMITIVE */], this._echo, 1 /* PRIMITIVE */);
    }
    App.prototype._echo = function (val) { return new Promise(function (res) { return res(val); }); };
    App = __decorate([
        core_1.Component({ selector: 'app', template: '<h1>WebWorker MessageBroker Test</h1>' }),
        __metadata("design:paramtypes", [platform_webworker_1.ServiceMessageBrokerFactory])
    ], App);
    return App;
}());
exports.App = App;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfY29tbW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vbW9kdWxlcy9wbGF5Z3JvdW5kL3NyYy93ZWJfd29ya2Vycy9tZXNzYWdlX2Jyb2tlci9pbmRleF9jb21tb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFDeEMsa0VBQXlGO0FBRXpGLElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUc1QjtJQUNFLGFBQW9CLHFCQUFrRDtRQUFsRCwwQkFBcUIsR0FBckIscUJBQXFCLENBQTZCO1FBQ3BFLElBQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM5RSxNQUFNLENBQUMsY0FBYyxDQUNqQixNQUFNLEVBQUUsbUJBQTJCLEVBQUUsSUFBSSxDQUFDLEtBQUssb0JBQTRCLENBQUM7SUFDbEYsQ0FBQztJQUVPLG1CQUFLLEdBQWIsVUFBYyxHQUFXLElBQUksT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLEdBQUcsSUFBSyxPQUFBLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBUixDQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFQMUQsR0FBRztRQURmLGdCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSx1Q0FBdUMsRUFBQyxDQUFDO3lDQUVuQyxnREFBMkI7T0FEM0QsR0FBRyxDQVFmO0lBQUQsVUFBQztDQUFBLEFBUkQsSUFRQztBQVJZLGtCQUFHIn0=