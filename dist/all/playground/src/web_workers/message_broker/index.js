"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var platform_webworker_1 = require("@angular/platform-webworker");
var ECHO_CHANNEL = 'ECHO';
function main() {
    platform_webworker_1.bootstrapWorkerUi('loader.js').then(afterBootstrap);
}
exports.main = main;
function afterBootstrap(ref) {
    var brokerFactory = ref.injector.get(platform_webworker_1.ClientMessageBrokerFactory);
    var broker = brokerFactory.createMessageBroker(ECHO_CHANNEL, false);
    document.getElementById('send_echo').addEventListener('click', function (e) {
        var val = document.getElementById('echo_input').value;
        // TODO(jteplitz602): Replace default constructors with real constructors
        // once they're in the .d.ts file (#3926)
        var fnArg = new platform_webworker_1.FnArg(val);
        var args = new platform_webworker_1.UiArguments('echo', [fnArg]);
        broker.runOnService(args, 1 /* PRIMITIVE */).then(function (echo_result) {
            document.getElementById('echo_result').innerHTML =
                "<span class='response'>" + echo_result + "</span>";
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3BsYXlncm91bmQvc3JjL3dlYl93b3JrZXJzL21lc3NhZ2VfYnJva2VyL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBR0gsa0VBQStIO0FBRS9ILElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQztBQUU1QjtJQUNFLHNDQUFpQixDQUFDLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUN0RCxDQUFDO0FBRkQsb0JBRUM7QUFFRCx3QkFBd0IsR0FBZ0I7SUFDdEMsSUFBTSxhQUFhLEdBQStCLEdBQUcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLCtDQUEwQixDQUFDLENBQUM7SUFDL0YsSUFBTSxNQUFNLEdBQUcsYUFBYSxDQUFDLG1CQUFtQixDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUV0RSxRQUFRLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUM7UUFDL0QsSUFBTSxHQUFHLEdBQXNCLFFBQVEsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFFLENBQUMsS0FBSyxDQUFDO1FBQzVFLHlFQUF5RTtRQUN6RSx5Q0FBeUM7UUFDekMsSUFBTSxLQUFLLEdBQUcsSUFBSSwwQkFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLElBQU0sSUFBSSxHQUFHLElBQUksZ0NBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRTlDLE1BQU0sQ0FBQyxZQUFZLENBQUMsSUFBSSxvQkFBNEIsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFtQjtZQUM1RSxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVM7Z0JBQzVDLDRCQUEwQixXQUFXLFlBQVMsQ0FBQztRQUNyRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyJ9