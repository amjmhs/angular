#!/usr/bin/env node
"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var api = require("./transformers/api");
var main_1 = require("./main");
function mainXi18n(args, consoleError) {
    if (consoleError === void 0) { consoleError = console.error; }
    var config = readXi18nCommandLineAndConfiguration(args);
    return main_1.main(args, consoleError, config);
}
exports.mainXi18n = mainXi18n;
function readXi18nCommandLineAndConfiguration(args) {
    var options = {};
    var parsedArgs = require('minimist')(args);
    if (parsedArgs.outFile)
        options.i18nOutFile = parsedArgs.outFile;
    if (parsedArgs.i18nFormat)
        options.i18nOutFormat = parsedArgs.i18nFormat;
    if (parsedArgs.locale)
        options.i18nOutLocale = parsedArgs.locale;
    var config = main_1.readCommandLineAndConfiguration(args, options, [
        'outFile',
        'i18nFormat',
        'locale',
    ]);
    // only emit the i18nBundle but nothing else.
    return __assign({}, config, { emitFlags: api.EmitFlags.I18nBundle });
}
// Entry point
if (require.main === module) {
    var args = process.argv.slice(2);
    process.exitCode = mainXi18n(args);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXh0cmFjdF9pMThuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9leHRyYWN0X2kxOG4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFjQSw0QkFBMEI7QUFDMUIsd0NBQTBDO0FBRTFDLCtCQUE2RDtBQUU3RCxtQkFDSSxJQUFjLEVBQUUsWUFBbUQ7SUFBbkQsNkJBQUEsRUFBQSxlQUFzQyxPQUFPLENBQUMsS0FBSztJQUNyRSxJQUFNLE1BQU0sR0FBRyxvQ0FBb0MsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRCxPQUFPLFdBQUksQ0FBQyxJQUFJLEVBQUUsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFKRCw4QkFJQztBQUVELDhDQUE4QyxJQUFjO0lBQzFELElBQU0sT0FBTyxHQUF3QixFQUFFLENBQUM7SUFDeEMsSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLElBQUksVUFBVSxDQUFDLE9BQU87UUFBRSxPQUFPLENBQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQyxPQUFPLENBQUM7SUFDakUsSUFBSSxVQUFVLENBQUMsVUFBVTtRQUFFLE9BQU8sQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztJQUN6RSxJQUFJLFVBQVUsQ0FBQyxNQUFNO1FBQUUsT0FBTyxDQUFDLGFBQWEsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDO0lBRWpFLElBQU0sTUFBTSxHQUFHLHNDQUErQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7UUFDNUQsU0FBUztRQUNULFlBQVk7UUFDWixRQUFRO0tBQ1QsQ0FBQyxDQUFDO0lBQ0gsNkNBQTZDO0lBQzdDLG9CQUFXLE1BQU0sSUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLElBQUU7QUFDMUQsQ0FBQztBQUVELGNBQWM7QUFDZCxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssTUFBTSxFQUFFO0lBQzNCLElBQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25DLE9BQU8sQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0NBQ3BDIn0=