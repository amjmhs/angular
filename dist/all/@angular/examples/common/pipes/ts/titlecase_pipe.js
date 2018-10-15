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
// #docregion TitleCasePipe
var TitleCasePipeComponent = /** @class */ (function () {
    function TitleCasePipeComponent() {
    }
    TitleCasePipeComponent = __decorate([
        core_1.Component({
            selector: 'titlecase-pipe',
            template: "<div>\n    <p>{{'some string' | titlecase}}</p> <!-- output is expected to be \"Some String\" --> \n    <p>{{'tHIs is mIXeD CaSe' | titlecase}}</p> <!-- output is expected to be \"This Is Mixed Case\" --> \n    <p>{{'it\\'s non-trivial question' | titlecase}}</p> <!-- output is expected to be \"It's Non-trivial Question\" --> \n    <p>{{'one,two,three' | titlecase}}</p> <!-- output is expected to be \"One,two,three\" -->\n    <p>{{'true|false' | titlecase}}</p> <!-- output is expected to be \"True|false\" -->\n    <p>{{'foo-vs-bar' | titlecase}}</p> <!-- output is expected to be \"Foo-vs-bar\" -->\n  </div>"
        })
    ], TitleCasePipeComponent);
    return TitleCasePipeComponent;
}());
exports.TitleCasePipeComponent = TitleCasePipeComponent;
// #enddocregion
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGl0bGVjYXNlX3BpcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9leGFtcGxlcy9jb21tb24vcGlwZXMvdHMvdGl0bGVjYXNlX3BpcGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7QUFFSCxzQ0FBd0M7QUFFeEMsMkJBQTJCO0FBWTNCO0lBQUE7SUFDQSxDQUFDO0lBRFksc0JBQXNCO1FBWGxDLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsZ0JBQWdCO1lBQzFCLFFBQVEsRUFBRSx3bUJBT0g7U0FDUixDQUFDO09BQ1csc0JBQXNCLENBQ2xDO0lBQUQsNkJBQUM7Q0FBQSxBQURELElBQ0M7QUFEWSx3REFBc0I7QUFFbkMsZ0JBQWdCIn0=