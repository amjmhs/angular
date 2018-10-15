/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    writeScriptTag('/all/benchmarks/vendor/core.js');
    writeScriptTag('/all/benchmarks/vendor/system.src.js', 'benchmarksBootstrap()');
    global.benchmarksBootstrap = benchmarksBootstrap;
    function benchmarksBootstrap() {
        System.config({
            defaultJSExtensions: true,
            map: { 'incremental-dom': '/all/benchmarks/vendor/incremental-dom-cjs.js' }
        });
        // BOOTSTRAP the app!
        System.import('index').then(function (m) {
            m.main && m.main();
        }, console.error.bind(console));
    }
    function writeScriptTag(scriptUrl, onload) {
        document.write("<script src=\"" + scriptUrl + "\" onload=\"" + onload + "\"></script>");
    }
}(window));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwX3BsYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vbW9kdWxlcy9iZW5jaG1hcmtzL3NyYy9ib290c3RyYXBfcGxhaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsQ0FBQyxVQUFTLE1BQVc7SUFFbkIsY0FBYyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7SUFDakQsY0FBYyxDQUFDLHNDQUFzQyxFQUFFLHVCQUF1QixDQUFDLENBQUM7SUFFMUUsTUFBTyxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO0lBRXhEO1FBQ0UsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNaLG1CQUFtQixFQUFFLElBQUk7WUFDekIsR0FBRyxFQUFFLEVBQUMsaUJBQWlCLEVBQUUsK0NBQStDLEVBQUM7U0FDMUUsQ0FBQyxDQUFDO1FBRUgscUJBQXFCO1FBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVMsQ0FBTTtZQUN6QyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsd0JBQXdCLFNBQWlCLEVBQUUsTUFBZTtRQUN4RCxRQUFRLENBQUMsS0FBSyxDQUFDLG1CQUFnQixTQUFTLG9CQUFhLE1BQU0saUJBQWEsQ0FBQyxDQUFDO0lBQzVFLENBQUM7QUFDSCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyJ9