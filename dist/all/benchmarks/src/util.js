"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-console  */
urlParamsToForm();
function getIntParameter(name) {
    return parseInt(getStringParameter(name), 10);
}
exports.getIntParameter = getIntParameter;
function getStringParameter(name) {
    var els = document.querySelectorAll("input[name=\"" + name + "\"]");
    var value;
    var el;
    for (var i = 0; i < els.length; i++) {
        el = els[i];
        var type = el.type;
        if ((type != 'radio' && type != 'checkbox') || el.checked) {
            value = el.value;
            break;
        }
    }
    if (value == null) {
        throw new Error("Could not find and input field with name " + name);
    }
    return value;
}
exports.getStringParameter = getStringParameter;
function bindAction(selector, callback) {
    document.querySelector(selector).addEventListener('click', callback);
}
exports.bindAction = bindAction;
function profile(create, destroy, name) {
    return function () {
        window.console.profile(name);
        var duration = 0;
        var count = 0;
        while (count++ < 150) {
            var start = window.performance.now();
            create();
            duration += window.performance.now() - start;
            destroy();
        }
        window.console.profileEnd();
        window.console.log("Iterations: " + count + "; time: " + duration / count + " ms / iteration");
    };
}
exports.profile = profile;
// helper script that will read out the url parameters
// and store them in appropriate form fields on the page
function urlParamsToForm() {
    var regex = /(\w+)=(\w+)/g;
    var search = decodeURIComponent(location.search);
    var match;
    while (match = regex.exec(search)) {
        var name_1 = match[1];
        var value = match[2];
        var els = document.querySelectorAll('input[name="' + name_1 + '"]');
        var el = void 0;
        for (var i = 0; i < els.length; i++) {
            el = els[i];
            if (el.type === 'radio' || el.type === 'checkbox') {
                el.checked = el.value === value;
            }
            else {
                el.value = value;
            }
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILGdDQUFnQztBQUNoQyxlQUFlLEVBQUUsQ0FBQztBQUVsQix5QkFBZ0MsSUFBWTtJQUMxQyxPQUFPLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNoRCxDQUFDO0FBRkQsMENBRUM7QUFFRCw0QkFBbUMsSUFBWTtJQUM3QyxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsa0JBQWUsSUFBSSxRQUFJLENBQUMsQ0FBQztJQUMvRCxJQUFJLEtBQVUsQ0FBQztJQUNmLElBQUksRUFBTyxDQUFDO0lBRVosS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNaLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUU7WUFDekQsS0FBSyxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7WUFDakIsTUFBTTtTQUNQO0tBQ0Y7SUFFRCxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsTUFBTSxJQUFJLEtBQUssQ0FBQyw4Q0FBNEMsSUFBTSxDQUFDLENBQUM7S0FDckU7SUFFRCxPQUFPLEtBQUssQ0FBQztBQUNmLENBQUM7QUFuQkQsZ0RBbUJDO0FBRUQsb0JBQTJCLFFBQWdCLEVBQUUsUUFBb0I7SUFDL0QsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDekUsQ0FBQztBQUZELGdDQUVDO0FBR0QsaUJBQXdCLE1BQWtCLEVBQUUsT0FBbUIsRUFBRSxJQUFZO0lBQzNFLE9BQU87UUFDTCxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDakIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsT0FBTyxLQUFLLEVBQUUsR0FBRyxHQUFHLEVBQUU7WUFDcEIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztZQUN2QyxNQUFNLEVBQUUsQ0FBQztZQUNULFFBQVEsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztZQUM3QyxPQUFPLEVBQUUsQ0FBQztTQUNYO1FBQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQztRQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBZSxLQUFLLGdCQUFXLFFBQVEsR0FBRyxLQUFLLG9CQUFpQixDQUFDLENBQUM7SUFDdkYsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWRELDBCQWNDO0FBRUQsc0RBQXNEO0FBQ3RELHdEQUF3RDtBQUN4RDtJQUNFLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztJQUM3QixJQUFNLE1BQU0sR0FBRyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsSUFBSSxLQUFpQixDQUFDO0lBQ3RCLE9BQU8sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDakMsSUFBTSxNQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxHQUFHLE1BQUksR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNwRSxJQUFJLEVBQUUsU0FBSyxDQUFDO1FBQ1osS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNaLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxPQUFPLElBQUksRUFBRSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7Z0JBQ2pELEVBQUUsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUM7YUFDakM7aUJBQU07Z0JBQ0wsRUFBRSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7YUFDbEI7U0FDRjtLQUNGO0FBQ0gsQ0FBQyJ9