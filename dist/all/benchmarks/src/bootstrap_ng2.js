/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    writeScriptTag('/all/benchmarks/vendor/core.js');
    writeScriptTag('/all/benchmarks/vendor/zone.js');
    writeScriptTag('/all/benchmarks/vendor/long-stack-trace-zone.js');
    writeScriptTag('/all/benchmarks/vendor/system.src.js');
    writeScriptTag('/all/benchmarks/vendor/Reflect.js', 'benchmarksBootstrap()');
    global.benchmarksBootstrap = benchmarksBootstrap;
    function benchmarksBootstrap() {
        // check query param
        var useBundles = location.search.indexOf('bundles=false') == -1;
        if (useBundles) {
            System.config({
                defaultJSExtensions: true,
                map: {
                    '@angular/core': '/packages-dist/core/bundles/core.umd.js',
                    '@angular/animations': '/packages-dist/common/bundles/animations.umd.js',
                    '@angular/platform-browser/animations': '/packages-dist/platform-browser/bundles/platform-browser-animations.umd.js',
                    '@angular/common': '/packages-dist/common/bundles/common.umd.js',
                    '@angular/forms': '/packages-dist/forms/bundles/forms.umd.js',
                    '@angular/compiler': '/packages-dist/compiler/bundles/compiler.umd.js',
                    '@angular/platform-browser': '/packages-dist/platform-browser/bundles/platform-browser.umd.js',
                    '@angular/platform-browser-dynamic': '/packages-dist/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
                    '@angular/http': '/packages-dist/http/bundles/http.umd.js',
                    '@angular/upgrade': '/packages-dist/upgrade/bundles/upgrade.umd.js',
                    '@angular/router': '/packages-dist/router/bundles/router.umd.js',
                    'rxjs': '/all/benchmarks/vendor/rxjs',
                },
                packages: {
                    'rxjs/ajax': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/testing': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/websocket': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs': { main: 'index.js', defaultExtension: 'js' },
                }
            });
        }
        else {
            console.warn('Not using the Angular bundles. Don\'t use this configuration for e2e/performance tests!');
            System.config({
                defaultJSExtensions: true,
                map: { '@angular': '/all/@angular', 'rxjs': '/all/benchmarks/vendor/rxjs' },
                packages: {
                    '@angular/core': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/animations': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser/animations': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/router': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/common': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/forms': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
                    '@angular/upgrade': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/ajax': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/operators': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/testing': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs/websocket': { main: 'index.js', defaultExtension: 'js' },
                    'rxjs': { main: 'index.js', defaultExtension: 'js' },
                }
            });
        }
        // BOOTSTRAP the app!
        System.import('index').then(function (m) { m.main(); }, console.error.bind(console));
    }
    function writeScriptTag(scriptUrl, onload) {
        document.write("<script src=\"" + scriptUrl + "\" onload=\"" + onload + "\"></script>");
    }
}(window));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYm9vdHN0cmFwX25nMi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvYm9vdHN0cmFwX25nMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxDQUFDLFVBQVMsTUFBVztJQUVuQixjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNqRCxjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztJQUNqRCxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQztJQUNsRSxjQUFjLENBQUMsc0NBQXNDLENBQUMsQ0FBQztJQUN2RCxjQUFjLENBQUMsbUNBQW1DLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztJQUV2RSxNQUFPLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7SUFFeEQ7UUFDRSxvQkFBb0I7UUFDcEIsSUFBTSxVQUFVLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEUsSUFBSSxVQUFVLEVBQUU7WUFDZCxNQUFNLENBQUMsTUFBTSxDQUFDO2dCQUNaLG1CQUFtQixFQUFFLElBQUk7Z0JBQ3pCLEdBQUcsRUFBRTtvQkFDSCxlQUFlLEVBQUUseUNBQXlDO29CQUMxRCxxQkFBcUIsRUFBRSxpREFBaUQ7b0JBQ3hFLHNDQUFzQyxFQUNsQyw0RUFBNEU7b0JBQ2hGLGlCQUFpQixFQUFFLDZDQUE2QztvQkFDaEUsZ0JBQWdCLEVBQUUsMkNBQTJDO29CQUM3RCxtQkFBbUIsRUFBRSxpREFBaUQ7b0JBQ3RFLDJCQUEyQixFQUN2QixpRUFBaUU7b0JBQ3JFLG1DQUFtQyxFQUMvQixpRkFBaUY7b0JBQ3JGLGVBQWUsRUFBRSx5Q0FBeUM7b0JBQzFELGtCQUFrQixFQUFFLCtDQUErQztvQkFDbkUsaUJBQWlCLEVBQUUsNkNBQTZDO29CQUNoRSxNQUFNLEVBQUUsNkJBQTZCO2lCQUN0QztnQkFD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