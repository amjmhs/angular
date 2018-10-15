"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var PARSE_TO_PAIRS = /([0-9]+[^0-9]+)/g;
var PAIR_SPLIT = /^([0-9]+)([dhmsu]+)$/;
function parseDurationToMs(duration) {
    var matches = [];
    var array;
    while ((array = PARSE_TO_PAIRS.exec(duration)) !== null) {
        matches.push(array[0]);
    }
    return matches
        .map(function (match) {
        var res = PAIR_SPLIT.exec(match);
        if (res === null) {
            throw new Error("Not a valid duration: " + match);
        }
        var factor = 0;
        switch (res[2]) {
            case 'd':
                factor = 86400000;
                break;
            case 'h':
                factor = 3600000;
                break;
            case 'm':
                factor = 60000;
                break;
            case 's':
                factor = 1000;
                break;
            case 'u':
                factor = 1;
                break;
            default:
                throw new Error("Not a valid duration unit: " + res[2]);
        }
        return parseInt(res[1]) * factor;
    })
        .reduce(function (total, value) { return total + value; }, 0);
}
exports.parseDurationToMs = parseDurationToMs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHVyYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvc3JjL2R1cmF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsSUFBTSxjQUFjLEdBQUcsa0JBQWtCLENBQUM7QUFDMUMsSUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUM7QUFFMUMsMkJBQWtDLFFBQWdCO0lBQ2hELElBQU0sT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUU3QixJQUFJLEtBQTJCLENBQUM7SUFDaEMsT0FBTyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1FBQ3ZELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLE9BQU87U0FDVCxHQUFHLENBQUMsVUFBQSxLQUFLO1FBQ1IsSUFBTSxHQUFHLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNuQyxJQUFJLEdBQUcsS0FBSyxJQUFJLEVBQUU7WUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBeUIsS0FBTyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxJQUFJLE1BQU0sR0FBVyxDQUFDLENBQUM7UUFDdkIsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDZCxLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLFFBQVEsQ0FBQztnQkFDbEIsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsT0FBTyxDQUFDO2dCQUNqQixNQUFNO1lBQ1IsS0FBSyxHQUFHO2dCQUNOLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQ2YsTUFBTTtZQUNSLEtBQUssR0FBRztnQkFDTixNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNkLE1BQU07WUFDUixLQUFLLEdBQUc7Z0JBQ04sTUFBTSxHQUFHLENBQUMsQ0FBQztnQkFDWCxNQUFNO1lBQ1I7Z0JBQ0UsTUFBTSxJQUFJLEtBQUssQ0FBQyxnQ0FBOEIsR0FBRyxDQUFDLENBQUMsQ0FBRyxDQUFDLENBQUM7U0FDM0Q7UUFDRCxPQUFPLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7SUFDbkMsQ0FBQyxDQUFDO1NBQ0QsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLEtBQUssSUFBSyxPQUFBLEtBQUssR0FBRyxLQUFLLEVBQWIsQ0FBYSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUM7QUFwQ0QsOENBb0NDIn0=