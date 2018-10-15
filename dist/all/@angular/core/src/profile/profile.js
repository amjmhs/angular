"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var wtf_impl_1 = require("./wtf_impl");
/**
 * True if WTF is enabled.
 */
exports.wtfEnabled = wtf_impl_1.detectWTF();
function noopScope(arg0, arg1) {
    return null;
}
/**
 * Create trace scope.
 *
 * Scopes must be strictly nested and are analogous to stack frames, but
 * do not have to follow the stack frames. Instead it is recommended that they follow logical
 * nesting. You may want to use
 * [Event
 * Signatures](http://google.github.io/tracing-framework/instrumenting-code.html#custom-events)
 * as they are defined in WTF.
 *
 * Used to mark scope entry. The return value is used to leave the scope.
 *
 *     var myScope = wtfCreateScope('MyClass#myMethod(ascii someVal)');
 *
 *     someMethod() {
 *        var s = myScope('Foo'); // 'Foo' gets stored in tracing UI
 *        // DO SOME WORK HERE
 *        return wtfLeave(s, 123); // Return value 123
 *     }
 *
 * Note, adding try-finally block around the work to ensure that `wtfLeave` gets called can
 * negatively impact the performance of your application. For this reason we recommend that
 * you don't add them to ensure that `wtfLeave` gets called. In production `wtfLeave` is a noop and
 * so try-finally block has no value. When debugging perf issues, skipping `wtfLeave`, do to
 * exception, will produce incorrect trace, but presence of exception signifies logic error which
 * needs to be fixed before the app should be profiled. Add try-finally only when you expect that
 * an exception is expected during normal execution while profiling.
 *
 * @experimental
 */
exports.wtfCreateScope = exports.wtfEnabled ? wtf_impl_1.createScope : function (signature, flags) { return noopScope; };
/**
 * Used to mark end of Scope.
 *
 * - `scope` to end.
 * - `returnValue` (optional) to be passed to the WTF.
 *
 * Returns the `returnValue for easy chaining.
 * @experimental
 */
exports.wtfLeave = exports.wtfEnabled ? wtf_impl_1.leave : function (s, r) { return r; };
/**
 * Used to mark Async start. Async are similar to scope but they don't have to be strictly nested.
 * The return value is used in the call to [endAsync]. Async ranges only work if WTF has been
 * enabled.
 *
 *     someMethod() {
 *        var s = wtfStartTimeRange('HTTP:GET', 'some.url');
 *        var future = new Future.delay(5).then((_) {
 *          wtfEndTimeRange(s);
 *        });
 *     }
 * @experimental
 */
exports.wtfStartTimeRange = exports.wtfEnabled ? wtf_impl_1.startTimeRange : function (rangeType, action) { return null; };
/**
 * Ends a async time range operation.
 * [range] is the return value from [wtfStartTimeRange] Async ranges only work if WTF has been
 * enabled.
 * @experimental
 */
exports.wtfEndTimeRange = exports.wtfEnabled ? wtf_impl_1.endTimeRange : function (r) { return null; };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3Byb2ZpbGUvcHJvZmlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVDQUFtRztBQUtuRzs7R0FFRztBQUNVLFFBQUEsVUFBVSxHQUFHLG9CQUFTLEVBQUUsQ0FBQztBQUV0QyxtQkFBbUIsSUFBVSxFQUFFLElBQVU7SUFDdkMsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkJHO0FBQ1UsUUFBQSxjQUFjLEdBQ3ZCLGtCQUFVLENBQUMsQ0FBQyxDQUFDLHNCQUFXLENBQUMsQ0FBQyxDQUFDLFVBQUMsU0FBaUIsRUFBRSxLQUFXLElBQUssT0FBQSxTQUFTLEVBQVQsQ0FBUyxDQUFDO0FBRTdFOzs7Ozs7OztHQVFHO0FBQ1UsUUFBQSxRQUFRLEdBQ2pCLGtCQUFVLENBQUMsQ0FBQyxDQUFDLGdCQUFLLENBQUMsQ0FBQyxDQUFDLFVBQUMsQ0FBTSxFQUFFLENBQU8sSUFBSyxPQUFBLENBQUMsRUFBRCxDQUFDLENBQUM7QUFFaEQ7Ozs7Ozs7Ozs7OztHQVlHO0FBQ1UsUUFBQSxpQkFBaUIsR0FDMUIsa0JBQVUsQ0FBQyxDQUFDLENBQUMseUJBQWMsQ0FBQyxDQUFDLENBQUMsVUFBQyxTQUFpQixFQUFFLE1BQWMsSUFBSyxPQUFBLElBQUksRUFBSixDQUFJLENBQUM7QUFFOUU7Ozs7O0dBS0c7QUFDVSxRQUFBLGVBQWUsR0FBeUIsa0JBQVUsQ0FBQyxDQUFDLENBQUMsdUJBQVksQ0FBQyxDQUFDLENBQUMsVUFBQyxDQUFNLElBQUssT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDIn0=