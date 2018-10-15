"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("@angular/core/src/errors");
var error_handler_1 = require("../src/error_handler");
var MockConsole = /** @class */ (function () {
    function MockConsole() {
        this.res = [];
    }
    MockConsole.prototype.error = function () {
        var s = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            s[_i] = arguments[_i];
        }
        this.res.push(s);
    };
    return MockConsole;
}());
(function () {
    function errorToString(error) {
        var logger = new MockConsole();
        var errorHandler = new error_handler_1.ErrorHandler();
        errorHandler._console = logger;
        errorHandler.handleError(error);
        return logger.res.map(function (line) { return line.join('#'); }).join('\n');
    }
    describe('ErrorHandler', function () {
        it('should output exception', function () {
            var e = errorToString(new Error('message!'));
            expect(e).toContain('message!');
        });
        describe('context', function () {
            it('should print nested context', function () {
                var cause = new Error('message!');
                var context = { source: 'context!', toString: function () { return 'Context'; } };
                var original = debugError(cause, context);
                var e = errorToString(error_handler_1.wrappedError('message', original));
                expect(e).toEqual("ERROR#Error: message caused by: Error in context! caused by: message!\nORIGINAL ERROR#Error: message!\nERROR CONTEXT#Context");
            });
        });
        describe('original exception', function () {
            it('should print original exception message if available (original is Error)', function () {
                var realOriginal = new Error('inner');
                var original = error_handler_1.wrappedError('wrapped', realOriginal);
                var e = errorToString(error_handler_1.wrappedError('wrappedwrapped', original));
                expect(e).toContain('inner');
            });
            it('should print original exception message if available (original is not Error)', function () {
                var realOriginal = new Error('custom');
                var original = error_handler_1.wrappedError('wrapped', realOriginal);
                var e = errorToString(error_handler_1.wrappedError('wrappedwrapped', original));
                expect(e).toContain('custom');
            });
        });
        it('should use the error logger on the error', function () {
            var err = new Error('test');
            var console = new MockConsole();
            var errorHandler = new error_handler_1.ErrorHandler();
            errorHandler._console = console;
            var logger = jasmine.createSpy('logger');
            err[errors_1.ERROR_LOGGER] = logger;
            errorHandler.handleError(err);
            expect(console.res).toEqual([]);
            expect(logger).toHaveBeenCalledWith(console, 'ERROR', err);
        });
    });
})();
function debugError(originalError, context) {
    var error = error_handler_1.wrappedError("Error in " + context.source, originalError);
    error[errors_1.ERROR_DEBUG_CONTEXT] = context;
    error[errors_1.ERROR_TYPE] = debugError;
    return error;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JfaGFuZGxlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L2Vycm9yX2hhbmRsZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILG1EQUF1RjtBQUV2RixzREFBZ0U7QUFFaEU7SUFBQTtRQUNFLFFBQUcsR0FBWSxFQUFFLENBQUM7SUFFcEIsQ0FBQztJQURDLDJCQUFLLEdBQUw7UUFBTSxXQUFXO2FBQVgsVUFBVyxFQUFYLHFCQUFXLEVBQVgsSUFBVztZQUFYLHNCQUFXOztRQUFVLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQUMsQ0FBQztJQUNoRCxrQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBRUQsQ0FBQztJQUNDLHVCQUF1QixLQUFVO1FBQy9CLElBQU0sTUFBTSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7UUFDakMsSUFBTSxZQUFZLEdBQUcsSUFBSSw0QkFBWSxFQUFFLENBQUM7UUFDdkMsWUFBb0IsQ0FBQyxRQUFRLEdBQUcsTUFBYSxDQUFDO1FBQy9DLFlBQVksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWQsQ0FBYyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxRQUFRLENBQUMsY0FBYyxFQUFFO1FBQ3ZCLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixJQUFNLENBQUMsR0FBRyxhQUFhLENBQUMsSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUMvQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLFVB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