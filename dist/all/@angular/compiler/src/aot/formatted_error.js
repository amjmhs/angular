"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../util");
var FORMATTED_MESSAGE = 'ngFormattedMessage';
function indentStr(level) {
    if (level <= 0)
        return '';
    if (level < 6)
        return ['', ' ', '  ', '   ', '    ', '     '][level];
    var half = indentStr(Math.floor(level / 2));
    return half + half + (level % 2 === 1 ? ' ' : '');
}
function formatChain(chain, indent) {
    if (indent === void 0) { indent = 0; }
    if (!chain)
        return '';
    var position = chain.position ?
        chain.position.fileName + "(" + (chain.position.line + 1) + "," + (chain.position.column + 1) + ")" :
        '';
    var prefix = position && indent === 0 ? position + ": " : '';
    var postfix = position && indent !== 0 ? " at " + position : '';
    var message = "" + prefix + chain.message + postfix;
    return "" + indentStr(indent) + message + ((chain.next && ('\n' + formatChain(chain.next, indent + 2))) || '');
}
function formattedError(chain) {
    var message = formatChain(chain) + '.';
    var error = util_1.syntaxError(message);
    error[FORMATTED_MESSAGE] = true;
    error.chain = chain;
    error.position = chain.position;
    return error;
}
exports.formattedError = formattedError;
function isFormattedError(error) {
    return !!error[FORMATTED_MESSAGE];
}
exports.isFormattedError = isFormattedError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0dGVkX2Vycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2FvdC9mb3JtYXR0ZWRfZXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxnQ0FBb0M7QUFtQnBDLElBQU0saUJBQWlCLEdBQUcsb0JBQW9CLENBQUM7QUFFL0MsbUJBQW1CLEtBQWE7SUFDOUIsSUFBSSxLQUFLLElBQUksQ0FBQztRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQzFCLElBQUksS0FBSyxHQUFHLENBQUM7UUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyRSxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QyxPQUFPLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUNwRCxDQUFDO0FBRUQscUJBQXFCLEtBQXdDLEVBQUUsTUFBa0I7SUFBbEIsdUJBQUEsRUFBQSxVQUFrQjtJQUMvRSxJQUFJLENBQUMsS0FBSztRQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ3RCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMxQixLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsVUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksR0FBQyxDQUFDLFdBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEdBQUMsQ0FBQyxPQUFHLENBQUMsQ0FBQztRQUNuRixFQUFFLENBQUM7SUFDUCxJQUFNLE1BQU0sR0FBRyxRQUFRLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUksUUFBUSxPQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMvRCxJQUFNLE9BQU8sR0FBRyxRQUFRLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBTyxRQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUNsRSxJQUFNLE9BQU8sR0FBRyxLQUFHLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQVMsQ0FBQztJQUV0RCxPQUFPLEtBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sSUFBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUUsQ0FBQztBQUMvRyxDQUFDO0FBRUQsd0JBQStCLEtBQTRCO0lBQ3pELElBQU0sT0FBTyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDekMsSUFBTSxLQUFLLEdBQUcsa0JBQVcsQ0FBQyxPQUFPLENBQW1CLENBQUM7SUFDcEQsS0FBYSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3pDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQztJQUNoQyxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFQRCx3Q0FPQztBQUVELDBCQUFpQyxLQUFZO0lBQzNDLE9BQU8sQ0FBQyxDQUFFLEtBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQzdDLENBQUM7QUFGRCw0Q0FFQyJ9