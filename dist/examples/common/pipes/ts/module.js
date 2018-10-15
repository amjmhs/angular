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
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const async_pipe_1 = require("./async_pipe");
const currency_pipe_1 = require("./currency_pipe");
const date_pipe_1 = require("./date_pipe");
const i18n_pipe_1 = require("./i18n_pipe");
const json_pipe_1 = require("./json_pipe");
const keyvalue_pipe_1 = require("./keyvalue_pipe");
const lowerupper_pipe_1 = require("./lowerupper_pipe");
const number_pipe_1 = require("./number_pipe");
const percent_pipe_1 = require("./percent_pipe");
const slice_pipe_1 = require("./slice_pipe");
const titlecase_pipe_1 = require("./titlecase_pipe");
let ExampleAppComponent = class ExampleAppComponent {
};
ExampleAppComponent = __decorate([
    core_1.Component({
        selector: 'example-app',
        template: `
    <h1>Pipe Example</h1>

    <h2><code>async</code></h2>
    <async-promise-pipe></async-promise-pipe>
    <async-observable-pipe></async-observable-pipe>

    <h2><code>date</code></h2>
    <date-pipe></date-pipe>

    <h2><code>json</code></h2>
    <json-pipe></json-pipe>

    <h2><code>lower</code>, <code>upper</code></h2>
    <lowerupper-pipe></lowerupper-pipe>

    <h2><code>titlecase</code></h2>
    <titlecase-pipe></titlecase-pipe>

    <h2><code>number</code></h2>
    <number-pipe></number-pipe>
    <percent-pipe></percent-pipe>
    <currency-pipe></currency-pipe>

    <h2><code>slice</code></h2>
    <slice-string-pipe></slice-string-pipe>
    <slice-list-pipe></slice-list-pipe>

    <h2><code>i18n</code></h2>
    <i18n-plural-pipe></i18n-plural-pipe>
    <i18n-select-pipe></i18n-select-pipe>

    <h2><code>keyvalue</code></h2>
    <keyvalue-pipe></keyvalue-pipe>
  `
    })
], ExampleAppComponent);
exports.ExampleAppComponent = ExampleAppComponent;
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            async_pipe_1.AsyncPromisePipeComponent, async_pipe_1.AsyncObservablePipeComponent, ExampleAppComponent, json_pipe_1.JsonPipeComponent,
            date_pipe_1.DatePipeComponent, date_pipe_1.DeprecatedDatePipeComponent, lowerupper_pipe_1.LowerUpperPipeComponent, titlecase_pipe_1.TitleCasePipeComponent,
            number_pipe_1.NumberPipeComponent, percent_pipe_1.PercentPipeComponent, percent_pipe_1.DeprecatedPercentPipeComponent,
            currency_pipe_1.CurrencyPipeComponent, currency_pipe_1.DeprecatedCurrencyPipeComponent, slice_pipe_1.SlicePipeStringComponent,
            slice_pipe_1.SlicePipeListComponent, i18n_pipe_1.I18nPluralPipeComponent, i18n_pipe_1.I18nSelectPipeComponent, keyvalue_pipe_1.KeyValuePipeComponent
        ],
        imports: [platform_browser_1.BrowserModule],
        bootstrap: [ExampleAppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=module.js.map