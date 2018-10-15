"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var QUESTION_MARK = '[^/]';
var WILD_SINGLE = '[^/]*';
var WILD_OPEN = '(?:.+\\/)?';
var TO_ESCAPE_BASE = [
    { replace: /\./g, with: '\\.' },
    { replace: /\+/g, with: '\\+' },
    { replace: /\*/g, with: WILD_SINGLE },
];
var TO_ESCAPE_WILDCARD_QM = TO_ESCAPE_BASE.concat([
    { replace: /\?/g, with: QUESTION_MARK },
]);
var TO_ESCAPE_LITERAL_QM = TO_ESCAPE_BASE.concat([
    { replace: /\?/g, with: '\\?' },
]);
function globToRegex(glob, literalQuestionMark) {
    if (literalQuestionMark === void 0) { literalQuestionMark = false; }
    var toEscape = literalQuestionMark ? TO_ESCAPE_LITERAL_QM : TO_ESCAPE_WILDCARD_QM;
    var segments = glob.split('/').reverse();
    var regex = '';
    while (segments.length > 0) {
        var segment = segments.pop();
        if (segment === '**') {
            if (segments.length > 0) {
                regex += WILD_OPEN;
            }
            else {
                regex += '.*';
            }
        }
        else {
            var processed = toEscape.reduce(function (segment, escape) { return segment.replace(escape.replace, escape.with); }, segment);
            regex += processed;
            if (segments.length > 0) {
                regex += '\\/';
            }
        }
    }
    return regex;
}
exports.globToRegex = globToRegex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2xvYi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL3NlcnZpY2Utd29ya2VyL2NvbmZpZy9zcmMvZ2xvYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUM3QixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUM7QUFDNUIsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDO0FBRS9CLElBQU0sY0FBYyxHQUFHO0lBQ3JCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0lBQzdCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0lBQzdCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFDO0NBQ3BDLENBQUM7QUFDRixJQUFNLHFCQUFxQixHQUN0QixjQUFjO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFDO0VBQ3RDLENBQUM7QUFDRixJQUFNLG9CQUFvQixHQUNyQixjQUFjO0lBQ2pCLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDO0VBQzlCLENBQUM7QUFFRixxQkFBNEIsSUFBWSxFQUFFLG1CQUEyQjtJQUEzQixvQ0FBQSxFQUFBLDJCQUEyQjtJQUNuRSxJQUFNLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLHFCQUFxQixDQUFDO0lBQ3BGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDM0MsSUFBSSxLQUFLLEdBQVcsRUFBRSxDQUFDO0lBQ3ZCLE9BQU8sUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDMUIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEdBQUcsRUFBSSxDQUFDO1FBQ2pDLElBQUksT0FBTyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixLQUFLLElBQUksU0FBUyxDQUFDO2FBQ3BCO2lCQUFNO2dCQUNMLEtBQUssSUFBSSxJQUFJLENBQUM7YUFDZjtTQUNGO2FBQU07WUFDTCxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUM3QixVQUFDLE9BQU8sRUFBRSxNQUFNLElBQUssT0FBQSxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUE1QyxDQUE0QyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hGLEtBQUssSUFBSSxTQUFTLENBQUM7WUFDbkIsSUFBSSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDdkIsS0FBSyxJQUFJLEtBQUssQ0FBQzthQUNoQjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUF0QkQsa0NBc0JDIn0=