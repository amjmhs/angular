"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('iv perf test', function () {
    var count = 100000;
    var noOfIterations = 10;
    describe('render', function () {
        for (var iteration = 0; iteration < noOfIterations; iteration++) {
            it(iteration + ". create " + count + " divs in DOM", function () {
                var start = new Date().getTime();
                var container = render_util_1.document.createElement('div');
                for (var i = 0; i < count; i++) {
                    var div = render_util_1.document.createElement('div');
                    div.appendChild(render_util_1.document.createTextNode('-'));
                    container.appendChild(div);
                }
                var end = new Date().getTime();
                log(count + " DIVs in DOM", (end - start) / count);
            });
            it(iteration + ". create " + count + " divs in Render3", function () {
                var Component = /** @class */ (function () {
                    function Component() {
                    }
                    Component.ngComponentDef = index_1.defineComponent({
                        type: Component,
                        selectors: [['div']],
                        template: function Template(rf, ctx) {
                            if (rf & 1 /* Create */) {
                                instructions_1.container(0);
                            }
                            if (rf & 2 /* Update */) {
                                instructions_1.containerRefreshStart(0);
                                {
                                    for (var i = 0; i < count; i++) {
                                        var rf0 = instructions_1.embeddedViewStart(0);
                                        {
                                            if (rf0 & 1 /* Create */) {
                                                instructions_1.elementStart(0, 'div');
                                                instructions_1.text(1, '-');
                                                instructions_1.elementEnd();
                                            }
                                        }
                                        instructions_1.embeddedViewEnd();
                                    }
                                }
                                instructions_1.containerRefreshEnd();
                            }
                        },
                        factory: function () { return new Component; }
                    });
                    return Component;
                }());
                var start = new Date().getTime();
                render_util_1.renderComponent(Component);
                var end = new Date().getTime();
                log(count + " DIVs in Render3", (end - start) / count);
            });
        }
    });
});
function log(text, duration) {
    // tslint:disable-next-line:no-console
    console.log(text, duration * 1000, 'ns');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWNfcGVyZi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9yZW5kZXIzL2Jhc2ljX3BlcmYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxpREFBd0Q7QUFDeEQsK0RBQXlLO0FBRXpLLDZDQUF3RDtBQUV4RCxRQUFRLENBQUMsY0FBYyxFQUFFO0lBRXZCLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQztJQUNyQixJQUFNLGNBQWMsR0FBRyxFQUFFLENBQUM7SUFFMUIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixLQUFLLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRSxTQUFTLEdBQUcsY0FBYyxFQUFFLFNBQVMsRUFBRSxFQUFFO1lBQy9ELEVBQUUsQ0FBSSxTQUFTLGlCQUFZLEtBQUssaUJBQWMsRUFBRTtnQkFDOUMsSUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDbkMsSUFBTSxTQUFTLEdBQUcsc0JBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2hELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQzlCLElBQU0sR0FBRyxHQUFHLHNCQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUMxQyxHQUFHLENBQUMsV0FBVyxDQUFDLHNCQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQzlDLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzVCO2dCQUNELElBQU0sR0FBRyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2pDLEdBQUcsQ0FBSSxLQUFLLGlCQUFjLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDckQsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUksU0FBUyxpQkFBWSxLQUFLLHFCQUFrQixFQUFFO2dCQUNsRDtvQkFBQTtvQkE0QkEsQ0FBQztvQkEzQlEsd0JBQWMsR0FBRyx1QkFBZSxDQUFDO3dCQUN0QyxJQUFJLEVBQUUsU0FBUzt3QkFDZixTQUFTLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO3dCQUNwQixRQUFRLEVBQUUsa0JBQWtCLEVBQWUsRUFBRSxHQUFROzRCQUNuRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0NBQzNCLHdCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ2Q7NEJBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dDQUMzQixvQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDekI7b0NBQ0UsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTt3Q0FDOUIsSUFBSSxHQUFHLEdBQUcsZ0NBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7d0NBQy9COzRDQUNFLElBQUksR0FBRyxpQkFBcUIsRUFBRTtnREFDNUIsMkJBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0RBQ3ZCLG1CQUFJLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dEQUNiLHlCQUFVLEVBQUUsQ0FBQzs2Q0FDZDt5Q0FDRjt3Q0FDRCw4QkFBZSxFQUFFLENBQUM7cUNBQ25CO2lDQUNGO2dDQUNELGtDQUFtQixFQUFFLENBQUM7NkJBQ3ZCO3dCQUNILENBQUM7d0JBQ0QsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLFNBQVMsRUFBYixDQUFhO3FCQUM3QixDQUFDLENBQUM7b0JBQ0wsZ0JBQUM7aUJBQUEsQUE1QkQsSUE0QkM7Z0JBRUQsSUFBTSxLQUFLLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDbkMsNkJBQWUsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDM0IsSUFBTSxHQUFHLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztnQkFDakMsR0FBRyxDQUFJLEtBQUsscUJBQWtCLEVBQUUsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDekQsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFhLElBQVksRUFBRSxRQUFnQjtJQUN6QyxzQ0FBc0M7SUFDdEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxHQUFHLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUMzQyxDQUFDIn0=