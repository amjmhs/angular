"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @module
 * @description
 * This module provides a set of common Pipes.
 */
var async_pipe_1 = require("./async_pipe");
exports.AsyncPipe = async_pipe_1.AsyncPipe;
var case_conversion_pipes_1 = require("./case_conversion_pipes");
exports.LowerCasePipe = case_conversion_pipes_1.LowerCasePipe;
exports.TitleCasePipe = case_conversion_pipes_1.TitleCasePipe;
exports.UpperCasePipe = case_conversion_pipes_1.UpperCasePipe;
var date_pipe_1 = require("./date_pipe");
exports.DatePipe = date_pipe_1.DatePipe;
var i18n_plural_pipe_1 = require("./i18n_plural_pipe");
exports.I18nPluralPipe = i18n_plural_pipe_1.I18nPluralPipe;
var i18n_select_pipe_1 = require("./i18n_select_pipe");
exports.I18nSelectPipe = i18n_select_pipe_1.I18nSelectPipe;
var json_pipe_1 = require("./json_pipe");
exports.JsonPipe = json_pipe_1.JsonPipe;
var keyvalue_pipe_1 = require("./keyvalue_pipe");
exports.KeyValuePipe = keyvalue_pipe_1.KeyValuePipe;
var number_pipe_1 = require("./number_pipe");
exports.CurrencyPipe = number_pipe_1.CurrencyPipe;
exports.DecimalPipe = number_pipe_1.DecimalPipe;
exports.PercentPipe = number_pipe_1.PercentPipe;
var slice_pipe_1 = require("./slice_pipe");
exports.SlicePipe = slice_pipe_1.SlicePipe;
/**
 * A collection of Angular pipes that are likely to be used in each and every application.
 */
exports.COMMON_PIPES = [
    async_pipe_1.AsyncPipe,
    case_conversion_pipes_1.UpperCasePipe,
    case_conversion_pipes_1.LowerCasePipe,
    json_pipe_1.JsonPipe,
    slice_pipe_1.SlicePipe,
    number_pipe_1.DecimalPipe,
    number_pipe_1.PercentPipe,
    case_conversion_pipes_1.TitleCasePipe,
    number_pipe_1.CurrencyPipe,
    date_pipe_1.DatePipe,
    i18n_plural_pipe_1.I18nPluralPipe,
    i18n_select_pipe_1.I18nSelectPipe,
    keyvalue_pipe_1.KeyValuePipe,
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21tb24vc3JjL3BpcGVzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUg7Ozs7R0FJRztBQUNILDJDQUF1QztBQVdyQyxvQkFYTSxzQkFBUyxDQVdOO0FBVlgsaUVBQW9GO0FBbUJsRix3QkFuQk0scUNBQWEsQ0FtQk47QUFHYix3QkF0QnFCLHFDQUFhLENBc0JyQjtBQUNiLHdCQXZCb0MscUNBQWEsQ0F1QnBDO0FBdEJmLHlDQUFxQztBQVduQyxtQkFYTSxvQkFBUSxDQVdOO0FBVlYsdURBQWtEO0FBY2hELHlCQWRNLGlDQUFjLENBY047QUFiaEIsdURBQWtEO0FBY2hELHlCQWRNLGlDQUFjLENBY047QUFiaEIseUNBQXFDO0FBY25DLG1CQWRNLG9CQUFRLENBY047QUFiVixpREFBdUQ7QUFVckQsdUJBVmdCLDRCQUFZLENBVWhCO0FBVGQsNkNBQXFFO0FBS25FLHVCQUxNLDBCQUFZLENBS047QUFFWixzQkFQb0IseUJBQVcsQ0FPcEI7QUFPWCxzQkFkaUMseUJBQVcsQ0FjakM7QUFiYiwyQ0FBdUM7QUFjckMsb0JBZE0sc0JBQVMsQ0FjTjtBQU1YOztHQUVHO0FBQ1UsUUFBQSxZQUFZLEdBQUc7SUFDMUIsc0JBQVM7SUFDVCxxQ0FBYTtJQUNiLHFDQUFhO0lBQ2Isb0JBQVE7SUFDUixzQkFBUztJQUNULHlCQUFXO0lBQ1gseUJBQVc7SUFDWCxxQ0FBYTtJQUNiLDBCQUFZO0lBQ1osb0JBQVE7SUFDUixpQ0FBYztJQUNkLGlDQUFjO0lBQ2QsNEJBQVk7Q0FDYixDQUFDIn0=