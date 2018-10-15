/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    writeScriptTag('/vendor/zone.js');
    writeScriptTag('/vendor/task-tracking.js');
    writeScriptTag('/vendor/system.js');
    writeScriptTag('/vendor/Reflect.js');
    writeScriptTag('/_common/system-config.js');
    if (location.pathname.indexOf('/upgrade/') != -1) {
        writeScriptTag('/vendor/angular.js');
    }
    function writeScriptTag(scriptUrl, onload) {
        if (onload === void 0) { onload = ''; }
        document.write('<script src="' + scriptUrl + '" onload="' + onload + '"></script>');
    }
}(window));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvZXhhbXBsZXMvX2NvbW1vbi9ib290c3RyYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsQ0FBQyxVQUFTLE1BQVc7SUFDbkIsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFDbEMsY0FBYyxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDM0MsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDcEMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDckMsY0FBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7SUFDNUMsSUFBSSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUNoRCxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztLQUN0QztJQUVELHdCQUF3QixTQUFpQixFQUFFLE1BQW1CO1FBQW5CLHVCQUFBLEVBQUEsV0FBbUI7UUFDNUQsUUFBUSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsU0FBUyxHQUFHLFlBQVksR0FBRyxNQUFNLEdBQUcsYUFBYSxDQUFDLENBQUM7SUFDdEYsQ0FBQztBQUNILENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDIn0=