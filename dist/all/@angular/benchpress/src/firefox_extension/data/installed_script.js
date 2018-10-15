/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
exportFunction(function () {
    var curTime = unsafeWindow.performance.now();
    self.port.emit('startProfiler', curTime);
}, unsafeWindow, { defineAs: 'startProfiler' });
exportFunction(function () {
    self.port.emit('stopProfiler');
}, unsafeWindow, { defineAs: 'stopProfiler' });
exportFunction(function (cb) {
    self.port.once('perfProfile', cb);
    self.port.emit('getProfile');
}, unsafeWindow, { defineAs: 'getProfile' });
exportFunction(function () {
    self.port.emit('forceGC');
}, unsafeWindow, { defineAs: 'forceGC' });
exportFunction(function (name) {
    var curTime = unsafeWindow.performance.now();
    self.port.emit('markStart', name, curTime);
}, unsafeWindow, { defineAs: 'markStart' });
exportFunction(function (name) {
    var curTime = unsafeWindow.performance.now();
    self.port.emit('markEnd', name, curTime);
}, unsafeWindow, { defineAs: 'markEnd' });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbGVkX3NjcmlwdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2JlbmNocHJlc3Mvc3JjL2ZpcmVmb3hfZXh0ZW5zaW9uL2RhdGEvaW5zdGFsbGVkX3NjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFLSCxjQUFjLENBQUM7SUFDYixJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLElBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNsRCxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUMsUUFBUSxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7QUFFOUMsY0FBYyxDQUFDO0lBQ1AsSUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDeEMsQ0FBQyxFQUFFLFlBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDO0FBRTdDLGNBQWMsQ0FBQyxVQUFTLEVBQVk7SUFDNUIsSUFBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ25DLElBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3RDLENBQUMsRUFBRSxZQUFZLEVBQUUsRUFBQyxRQUFRLEVBQUUsWUFBWSxFQUFDLENBQUMsQ0FBQztBQUUzQyxjQUFjLENBQUM7SUFDUCxJQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQyxDQUFDLEVBQUUsWUFBWSxFQUFFLEVBQUMsUUFBUSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7QUFFeEMsY0FBYyxDQUFDLFVBQVMsSUFBWTtJQUNsQyxJQUFNLE9BQU8sR0FBRyxZQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLElBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEQsQ0FBQyxFQUFFLFlBQVksRUFBRSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBRTFDLGNBQWMsQ0FBQyxVQUFTLElBQVk7SUFDbEMsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN6QyxJQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELENBQUMsRUFBRSxZQUFZLEVBQUUsRUFBQyxRQUFRLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQyJ9