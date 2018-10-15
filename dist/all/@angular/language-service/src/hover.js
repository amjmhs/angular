"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var locate_symbol_1 = require("./locate_symbol");
function getHover(info) {
    var result = locate_symbol_1.locateSymbol(info);
    if (result) {
        return { text: hoverTextOf(result.symbol), span: result.span };
    }
}
exports.getHover = getHover;
function hoverTextOf(symbol) {
    var result = [{ text: symbol.kind }, { text: ' ' }, { text: symbol.name, language: symbol.language }];
    var container = symbol.container;
    if (container) {
        result.push({ text: ' of ' }, { text: container.name, language: container.language });
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG92ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9sYW5ndWFnZS1zZXJ2aWNlL3NyYy9ob3Zlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUdILGlEQUE2QztBQUc3QyxrQkFBeUIsSUFBa0I7SUFDekMsSUFBTSxNQUFNLEdBQUcsNEJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxJQUFJLE1BQU0sRUFBRTtRQUNWLE9BQU8sRUFBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBQyxDQUFDO0tBQzlEO0FBQ0gsQ0FBQztBQUxELDRCQUtDO0FBRUQscUJBQXFCLE1BQWM7SUFDakMsSUFBTSxNQUFNLEdBQ1IsQ0FBQyxFQUFDLElBQUksRUFBRSxNQUFNLENBQUMsSUFBSSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsR0FBRyxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7SUFDdkYsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNuQyxJQUFJLFNBQVMsRUFBRTtRQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBQyxDQUFDLENBQUM7S0FDbkY7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIn0=