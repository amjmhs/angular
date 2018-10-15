/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
import * as chars from './chars';
import { identifierModuleUrl, identifierName } from './compile_metadata';
export class ParseLocation {
    /**
     * @param {?} file
     * @param {?} offset
     * @param {?} line
     * @param {?} col
     */
    constructor(file, offset, line, col) {
        this.file = file;
        this.offset = offset;
        this.line = line;
        this.col = col;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.offset != null ? `${this.file.url}@${this.line}:${this.col}` : this.file.url;
    }
    /**
     * @param {?} delta
     * @return {?}
     */
    moveBy(delta) {
        /** @type {?} */
        const source = this.file.content;
        /** @type {?} */
        const len = source.length;
        /** @type {?} */
        let offset = this.offset;
        /** @type {?} */
        let line = this.line;
        /** @type {?} */
        let col = this.col;
        while (offset > 0 && delta < 0) {
            offset--;
            delta++;
            /** @type {?} */
            const ch = source.charCodeAt(offset);
            if (ch == chars.$LF) {
                line--;
                /** @type {?} */
                const priorLine = source.substr(0, offset - 1).lastIndexOf(String.fromCharCode(chars.$LF));
                col = priorLine > 0 ? offset - priorLine : offset;
            }
            else {
                col--;
            }
        }
        while (offset < len && delta > 0) {
            /** @type {?} */
            const ch = source.charCodeAt(offset);
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
    }
    /**
     * @param {?} maxChars
     * @param {?} maxLines
     * @return {?}
     */
    getContext(maxChars, maxLines) {
        /** @type {?} */
        const content = this.file.content;
        /** @type {?} */
        let startOffset = this.offset;
        if (startOffset != null) {
            if (startOffset > content.length - 1) {
                startOffset = content.length - 1;
            }
            /** @type {?} */
            let endOffset = startOffset;
            /** @type {?} */
            let ctxChars = 0;
            /** @type {?} */
            let ctxLines = 0;
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
    }
}
if (false) {
    /** @type {?} */
    ParseLocation.prototype.file;
    /** @type {?} */
    ParseLocation.prototype.offset;
    /** @type {?} */
    ParseLocation.prototype.line;
    /** @type {?} */
    ParseLocation.prototype.col;
}
export class ParseSourceFile {
    /**
     * @param {?} content
     * @param {?} url
     */
    constructor(content, url) {
        this.content = content;
        this.url = url;
    }
}
if (false) {
    /** @type {?} */
    ParseSourceFile.prototype.content;
    /** @type {?} */
    ParseSourceFile.prototype.url;
}
export class ParseSourceSpan {
    /**
     * @param {?} start
     * @param {?} end
     * @param {?=} details
     */
    constructor(start, end, details = null) {
        this.start = start;
        this.end = end;
        this.details = details;
    }
    /**
     * @return {?}
     */
    toString() {
        return this.start.file.content.substring(this.start.offset, this.end.offset);
    }
}
if (false) {
    /** @type {?} */
    ParseSourceSpan.prototype.start;
    /** @type {?} */
    ParseSourceSpan.prototype.end;
    /** @type {?} */
    ParseSourceSpan.prototype.details;
}
/** @enum {number} */
const ParseErrorLevel = {
    WARNING: 0,
    ERROR: 1,
};
export { ParseErrorLevel };
ParseErrorLevel[ParseErrorLevel.WARNING] = 'WARNING';
ParseErrorLevel[ParseErrorLevel.ERROR] = 'ERROR';
export class ParseError {
    /**
     * @param {?} span
     * @param {?} msg
     * @param {?=} level
     */
    constructor(span, msg, level = ParseErrorLevel.ERROR) {
        this.span = span;
        this.msg = msg;
        this.level = level;
    }
    /**
     * @return {?}
     */
    contextualMessage() {
        /** @type {?} */
        const ctx = this.span.start.getContext(100, 3);
        return ctx ? `${this.msg} ("${ctx.before}[${ParseErrorLevel[this.level]} ->]${ctx.after}")` :
            this.msg;
    }
    /**
     * @return {?}
     */
    toString() {
        /** @type {?} */
        const details = this.span.details ? `, ${this.span.details}` : '';
        return `${this.contextualMessage()}: ${this.span.start}${details}`;
    }
}
if (false) {
    /** @type {?} */
    ParseError.prototype.span;
    /** @type {?} */
    ParseError.prototype.msg;
    /** @type {?} */
    ParseError.prototype.level;
}
/**
 * @param {?} kind
 * @param {?} type
 * @return {?}
 */
export function typeSourceSpan(kind, type) {
    /** @type {?} */
    const moduleUrl = identifierModuleUrl(type);
    /** @type {?} */
    const sourceFileName = moduleUrl != null ? `in ${kind} ${identifierName(type)} in ${moduleUrl}` :
        `in ${kind} ${identifierName(type)}`;
    /** @type {?} */
    const sourceFile = new ParseSourceFile('', sourceFileName);
    return new ParseSourceSpan(new ParseLocation(sourceFile, -1, -1, -1), new ParseLocation(sourceFile, -1, -1, -1));
}
//# sourceMappingURL=parse_util.js.map