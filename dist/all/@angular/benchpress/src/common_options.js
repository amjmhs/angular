"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var fs = require("fs");
var Options = /** @class */ (function () {
    function Options() {
    }
    Options.SAMPLE_ID = new core_1.InjectionToken('Options.sampleId');
    Options.DEFAULT_DESCRIPTION = new core_1.InjectionToken('Options.defaultDescription');
    Options.SAMPLE_DESCRIPTION = new core_1.InjectionToken('Options.sampleDescription');
    Options.FORCE_GC = new core_1.InjectionToken('Options.forceGc');
    Options.NO_PREPARE = function () { return true; };
    Options.PREPARE = new core_1.InjectionToken('Options.prepare');
    Options.EXECUTE = new core_1.InjectionToken('Options.execute');
    Options.CAPABILITIES = new core_1.InjectionToken('Options.capabilities');
    Options.USER_AGENT = new core_1.InjectionToken('Options.userAgent');
    Options.MICRO_METRICS = new core_1.InjectionToken('Options.microMetrics');
    Options.USER_METRICS = new core_1.InjectionToken('Options.userMetrics');
    Options.NOW = new core_1.InjectionToken('Options.now');
    Options.WRITE_FILE = new core_1.InjectionToken('Options.writeFile');
    Options.RECEIVED_DATA = new core_1.InjectionToken('Options.receivedData');
    Options.REQUEST_COUNT = new core_1.InjectionToken('Options.requestCount');
    Options.CAPTURE_FRAMES = new core_1.InjectionToken('Options.frameCapture');
    Options.DEFAULT_PROVIDERS = [
        { provide: Options.DEFAULT_DESCRIPTION, useValue: {} },
        { provide: Options.SAMPLE_DESCRIPTION, useValue: {} },
        { provide: Options.FORCE_GC, useValue: false },
        { provide: Options.PREPARE, useValue: Options.NO_PREPARE },
        { provide: Options.MICRO_METRICS, useValue: {} }, { provide: Options.USER_METRICS, useValue: {} },
        { provide: Options.NOW, useValue: function () { return new Date(); } },
        { provide: Options.RECEIVED_DATA, useValue: false },
        { provide: Options.REQUEST_COUNT, useValue: false },
        { provide: Options.CAPTURE_FRAMES, useValue: false },
        { provide: Options.WRITE_FILE, useValue: writeFile }
    ];
    return Options;
}());
exports.Options = Options;
function writeFile(filename, content) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, content, function (error) {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX29wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9jb21tb25fb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNDQUE2QztBQUM3Qyx1QkFBeUI7QUFFekI7SUFBQTtJQTZCQSxDQUFDO0lBNUJRLGlCQUFTLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDbkQsMkJBQW1CLEdBQUcsSUFBSSxxQkFBYyxDQUFDLDRCQUE0QixDQUFDLENBQUM7SUFDdkUsMEJBQWtCLEdBQUcsSUFBSSxxQkFBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDckUsZ0JBQVEsR0FBRyxJQUFJLHFCQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqRCxrQkFBVSxHQUFHLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDO0lBQ3hCLGVBQU8sR0FBRyxJQUFJLHFCQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNoRCxlQUFPLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDaEQsb0JBQVksR0FBRyxJQUFJLHFCQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMxRCxrQkFBVSxHQUFHLElBQUkscUJBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3JELHFCQUFhLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDM0Qsb0JBQVksR0FBRyxJQUFJLHFCQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUN6RCxXQUFHLEdBQUcsSUFBSSxxQkFBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3hDLGtCQUFVLEdBQUcsSUFBSSxxQkFBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDckQscUJBQWEsR0FBRyxJQUFJLHFCQUFjLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUMzRCxxQkFBYSxHQUFHLElBQUkscUJBQWMsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQzNELHNCQUFjLEdBQUcsSUFBSSxxQkFBYyxDQUFDLHNCQUFzQixDQUFDLENBQUM7SUFDNUQseUJBQWlCLEdBQUc7UUFDekIsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLG1CQUFtQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7UUFDcEQsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUM7UUFDbkQsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDO1FBQzVDLEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxVQUFVLEVBQUM7UUFDeEQsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFDO1FBQzdGLEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLGNBQU0sT0FBQSxJQUFJLElBQUksRUFBRSxFQUFWLENBQVUsRUFBQztRQUNsRCxFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsYUFBYSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUM7UUFDakQsRUFBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFDO1FBQ2pELEVBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBQztRQUNsRCxFQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUM7S0FDbkQsQ0FBQztJQUNKLGNBQUM7Q0FBQSxBQTdCRCxJQTZCQztBQTdCWSwwQkFBTztBQStCcEIsbUJBQW1CLFFBQWdCLEVBQUUsT0FBZTtJQUNsRCxPQUFPLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU07UUFDekMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFVBQUMsS0FBSztZQUNwQyxJQUFJLEtBQUssRUFBRTtnQkFDVCxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxPQUFPLEVBQUUsQ0FBQzthQUNYO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMifQ==