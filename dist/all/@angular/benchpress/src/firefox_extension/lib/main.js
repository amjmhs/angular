/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _a = require('chrome'), Cc = _a.Cc, Ci = _a.Ci, Cu = _a.Cu;
var os = Cc['@mozilla.org/observer-service;1'].getService(Ci.nsIObserverService);
var ParserUtil = require('./parser_util');
var Profiler = /** @class */ (function () {
    function Profiler() {
        this._profiler = Cc['@mozilla.org/tools/profiler;1'].getService(Ci.nsIProfiler);
    }
    Profiler.prototype.start = function (entries, interval, features, timeStarted) {
        this._profiler.StartProfiler(entries, interval, features, features.length);
        this._profilerStartTime = timeStarted;
        this._markerEvents = [];
    };
    Profiler.prototype.stop = function () { this._profiler.StopProfiler(); };
    Profiler.prototype.getProfilePerfEvents = function () {
        var profileData = this._profiler.getProfileData();
        var perfEvents = ParserUtil.convertPerfProfileToEvents(profileData);
        perfEvents = this._mergeMarkerEvents(perfEvents);
        perfEvents.sort(function (event1, event2) {
            return event1.ts - event2.ts;
        }); // Sort by ts
        return perfEvents;
    };
    /** @internal */
    Profiler.prototype._mergeMarkerEvents = function (perfEvents) {
        this._markerEvents.forEach(function (markerEvent) { perfEvents.push(markerEvent); });
        return perfEvents;
    };
    Profiler.prototype.addStartEvent = function (name, timeStarted) {
        this._markerEvents.push({ ph: 'B', ts: timeStarted - this._profilerStartTime, name: name });
    };
    Profiler.prototype.addEndEvent = function (name, timeEnded) {
        this._markerEvents.push({ ph: 'E', ts: timeEnded - this._profilerStartTime, name: name });
    };
    return Profiler;
}());
function forceGC() {
    Cu.forceGC();
    os.notifyObservers(null, 'child-gc-request', null);
}
var mod = require('sdk/page-mod');
var data = require('sdk/self').data;
var profiler = new Profiler();
mod.PageMod({
    include: ['*'],
    contentScriptFile: data.url('installed_script.js'),
    onAttach: function (worker) {
        worker.port.on('startProfiler', function (timeStarted) { return profiler.start(
        /* = profiler memory */ 3000000, 0.1, ['leaf', 'js', 'stackwalk', 'gc'], timeStarted); });
        worker.port.on('stopProfiler', function () { return profiler.stop(); });
        worker.port.on('getProfile', function () { return worker.port.emit('perfProfile', profiler.getProfilePerfEvents()); });
        worker.port.on('forceGC', forceGC);
        worker.port.on('markStart', function (name, timeStarted) { return profiler.addStartEvent(name, timeStarted); });
        worker.port.on('markEnd', function (name, timeEnded) { return profiler.addEndEvent(name, timeEnded); });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL2ZpcmVmb3hfZXh0ZW5zaW9uL2xpYi9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVHLElBQUEsc0JBQWdDLEVBQS9CLFVBQUUsRUFBRSxVQUFFLEVBQUUsVUFBRSxDQUFzQjtBQUN2QyxJQUFNLEVBQUUsR0FBRyxFQUFFLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDbkYsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBRTVDO0lBT0U7UUFBZ0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsK0JBQStCLENBQUMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUVsRyx3QkFBSyxHQUFMLFVBQU0sT0FBWSxFQUFFLFFBQWEsRUFBRSxRQUFhLEVBQUUsV0FBZ0I7UUFDaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNFLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxXQUFXLENBQUM7UUFDdEMsSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELHVCQUFJLEdBQUosY0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6Qyx1Q0FBb0IsR0FBcEI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3BELElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUNwRSxVQUFVLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBUyxNQUFXLEVBQUUsTUFBVztZQUMvQyxPQUFPLE1BQU0sQ0FBQyxFQUFFLEdBQUcsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQyxDQUFFLGFBQWE7UUFDbEIsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELGdCQUFnQjtJQUNSLHFDQUFrQixHQUExQixVQUEyQixVQUFpQjtRQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxVQUFTLFdBQVcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEYsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQztJQUVELGdDQUFhLEdBQWIsVUFBYyxJQUFZLEVBQUUsV0FBbUI7UUFDN0MsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxXQUFXLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzVGLENBQUM7SUFFRCw4QkFBVyxHQUFYLFVBQVksSUFBWSxFQUFFLFNBQWlCO1FBQ3pDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUF4Q0QsSUF3Q0M7QUFFRDtJQUNFLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNiLEVBQUUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3JELENBQUM7QUFFRCxJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsSUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUN0QyxJQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2hDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFDVixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7SUFDZCxpQkFBaUIsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDO0lBQ2xELFFBQVEsRUFBRSxVQUFDLE1BQVc7UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ1YsZUFBZSxFQUNmLFVBQUMsV0FBZ0IsSUFBSyxPQUFBLFFBQVEsQ0FBQyxLQUFLO1FBQ2hDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsRUFBRSxXQUFXLENBQUMsRUFEbkUsQ0FDbUUsQ0FBQyxDQUFDO1FBQy9GLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFNLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQyxDQUFDO1FBQ3RELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNWLFlBQVksRUFBRSxjQUFNLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLEVBQWhFLENBQWdFLENBQUMsQ0FBQztRQUMxRixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQ1YsV0FBVyxFQUFFLFVBQUMsSUFBWSxFQUFFLFdBQWdCLElBQUssT0FBQSxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsRUFBekMsQ0FBeUMsQ0FBQyxDQUFDO1FBQ2hHLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUNWLFNBQVMsRUFBRSxVQUFDLElBQVksRUFBRSxTQUFjLElBQUssT0FBQSxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsRUFBckMsQ0FBcUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7Q0FDRixDQUFDLENBQUMifQ==