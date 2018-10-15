/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var q = require('q');
var FirefoxProfile = require('firefox-profile');
var jpm = require('jpm/lib/xpi');
var pathUtil = require('path');
var PERF_ADDON_PACKAGE_JSON_DIR = '..';
exports.getAbsolutePath = function (path) {
    var normalizedPath = pathUtil.normalize(path);
    if (pathUtil.resolve(normalizedPath) == normalizedPath) {
        // Already absolute path
        return normalizedPath;
    }
    else {
        return pathUtil.join(__dirname, normalizedPath);
    }
};
exports.getFirefoxProfile = function (extensionPath) {
    var deferred = q.defer();
    var firefoxProfile = new FirefoxProfile();
    firefoxProfile.addExtensions([extensionPath], function () {
        firefoxProfile.encoded(function (err, encodedProfile) {
            var multiCapabilities = [{ browserName: 'firefox', firefox_profile: encodedProfile }];
            deferred.resolve(multiCapabilities);
        });
    });
    return deferred.promise;
};
exports.getFirefoxProfileWithExtension = function () {
    var absPackageJsonDir = pathUtil.join(__dirname, PERF_ADDON_PACKAGE_JSON_DIR);
    var packageJson = require(pathUtil.join(absPackageJsonDir, 'package.json'));
    var savedCwd = process.cwd();
    process.chdir(absPackageJsonDir);
    return jpm(packageJson).then(function (xpiPath) {
        process.chdir(savedCwd);
        return exports.getFirefoxProfile(xpiPath);
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdF9oZWxwZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3NyYy9maXJlZm94X2V4dGVuc2lvbi9saWIvdGVzdF9oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ2xELElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNuQyxJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFakMsSUFBTSwyQkFBMkIsR0FBRyxJQUFJLENBQUM7QUFFekMsT0FBTyxDQUFDLGVBQWUsR0FBRyxVQUFTLElBQVk7SUFDN0MsSUFBTSxjQUFjLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNoRCxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLElBQUksY0FBYyxFQUFFO1FBQ3RELHdCQUF3QjtRQUN4QixPQUFPLGNBQWMsQ0FBQztLQUN2QjtTQUFNO1FBQ0wsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztLQUNqRDtBQUNILENBQUMsQ0FBQztBQUVGLE9BQU8sQ0FBQyxpQkFBaUIsR0FBRyxVQUFTLGFBQXFCO0lBQ3hELElBQU0sUUFBUSxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUUzQixJQUFNLGNBQWMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBQzVDLGNBQWMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsRUFBRTtRQUM1QyxjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBUSxFQUFFLGNBQXNCO1lBQ3RELElBQU0saUJBQWlCLEdBQUcsQ0FBQyxFQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7WUFDdEYsUUFBUSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUM7QUFDMUIsQ0FBQyxDQUFDO0FBRUYsT0FBTyxDQUFDLDhCQUE4QixHQUFHO0lBQ3ZDLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztJQUNoRixJQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBRTlFLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7SUFFakMsT0FBTyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsT0FBZTtRQUMzQyxPQUFPLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIn0=