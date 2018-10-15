"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var chars = require("./chars");
var compile_metadata_1 = require("./compile_metadata");
var ParseLocation = /** @class */ (function () {
    function ParseLocation(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    ParseLocation.prototype.toString = function () {
        return this.offset != null ? this.file.url + "@" + this.line + ":" + this.col : this.file.url;
    };
    ParseLocation.prototype.moveBy = function (delta) {
        var source = this.file.content;
        var len = source.length;
        var offset = this.offset;
        var line = this.line;
        var col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            var ch = source.charCodeAt(offset);
            if (ch == chars.$LF) {
                line--;
                var priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode(chars.$LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            var ch = source.charCodeAt(offset);
            offset++;
            delta--;
            if (ch == chars.$LF) {
                line++;
                col = 0;
            }
            else {
                col++;
            }
        }
        return new ParseLocation(this.file, offset, line, col);
    };
    // Return the source around the location
    // Up to `maxChars` or `maxLines` on each side of the location
    ParseLocation.prototype.getContext = function (maxChars, maxLines) {
        var content = this.file.content;
        var startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            var endOffset = startOffset;
            var ctxChars = 0;
            var ctxLines = 0;
            while (ctxChars < maxChars && startOffset > 0) {
                startOffset--;
                ctxChars++;
                if (content[startOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            ctxChars = 0;
            ctxLines = 0;
            while (ctxChars < maxChars && endOffset < content.length - 1) {
                endOffset++;
                ctxChars++;
                if (content[endOffset] == '\n') {
                    if (++ctxLines == maxLines) {
                        break;
                    }
                }
            }
            return {
                before: content.substring(startOffset, this.offset),
                after: content.substring(this.offset, endOffset + 1),
            };
        }
        return null;
    };
    return ParseLocation;
}());
exports.ParseLocation = ParseLocation;
var ParseSourceFile = /** @class */ (function () {
    function ParseSourceFile(content, url) {
        this.content = content;
        this.url = url;
    }
    return ParseSourceFile;
}());
exports.ParseSourceFile = ParseSourceFile;
var ParseSourceSpan = /** @class */ (function () {
    function ParseSourceSpan(start, end, details) {
        if (details === void 0) { details = null; }
        this.start = start;
        this.end = end;
        this.details = details;
    }
    ParseSourceSpan.prototype.toString = function () {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    };
    return ParseSourceSpan;
}());
exports.ParseSourceSpan = ParseSourceSpan;
var ParseErrorLevel;
(function (ParseErrorLevel) {
    ParseErrorLevel[ParseErrorLevel["WARNING"] = 0] = "WARNING";
    ParseErrorLevel[ParseErrorLevel["ERROR"] = 1] = "ERROR";
})(ParseErrorLevel = exports.ParseErrorLevel || (exports.ParseErrorLevel = {}));
var ParseError = /** @class */ (function () {
    function ParseError(span, msg, level) {
        if (level === void 0) { level = ParseErrorLevel.ERROR; }
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    ParseError.prototype.contextualMessage = function () {
        var ctx = this.span.start.getContext(100, 3);
        return ctx ? this.msg + " (\"" + ctx.before + "[" + ParseErrorLevel[this.level] + " ->]" + ctx.after + "\")" :
            this.msg;
    };
    ParseError.prototype.toString = function () {
        var details = this.span.details ? ", " + this.span.details : '';
        return this.contextualMessage() + ": " + this.span.start + details;
    };
    return ParseError;
}());
exports.ParseError = ParseError;
function typeSourceSpan(kind, type) {
    var moduleUrl = compile_metadata_1.identifierModuleUrl(type);
    var sourceFileName = moduleUrl != null ? "in " + kind + " " + compile_metadata_1.identifierName(type) + " in " + moduleUrl :
        "in " + kind + " " + compile_metadata_1.identifierName(type);
    var sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
exports.typeSourceSpan = typeSourceSpan;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VfdXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9wYXJzZV91dGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsK0JBQWlDO0FBQ2pDLHVEQUFrRztBQUdsRztJQUNFLHVCQUNXLElBQXFCLEVBQVMsTUFBYyxFQUFTLElBQVksRUFDakUsR0FBVztRQURYLFNBQUksR0FBSixJQUFJLENBQWlCO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFDakUsUUFBRyxHQUFILEdBQUcsQ0FBUTtJQUFHLENBQUM7SUFFMUIsZ0NBQVEsR0FBUjtRQUNFLE9BQU8sSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFJLElBQUksQ0FBQyxJQUFJLFNBQUksSUFBSSxDQUFDLEdBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7SUFDM0YsQ0FBQztJQUVELDhCQUFNLEdBQU4sVUFBTyxLQUFhO1FBQ2xCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUN6QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3JCLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7UUFDbkIsT0FBTyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDOUIsTUFBTSxFQUFFLENBQUM7WUFDVCxLQUFLLEVBQUUsQ0FBQztZQUNSLElBQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxV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