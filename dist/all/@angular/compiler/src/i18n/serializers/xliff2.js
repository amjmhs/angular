"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ml = require("../../ml_parser/ast");
var xml_parser_1 = require("../../ml_parser/xml_parser");
var digest_1 = require("../digest");
var i18n = require("../i18n_ast");
var parse_util_1 = require("../parse_util");
var serializer_1 = require("./serializer");
var xml = require("./xml_helper");
var _VERSION = '2.0';
var _XMLNS = 'urn:oasis:names:tc:xliff:document:2.0';
// TODO(vicb): make this a param (s/_/-/)
var _DEFAULT_SOURCE_LANG = 'en';
var _PLACEHOLDER_TAG = 'ph';
var _PLACEHOLDER_SPANNING_TAG = 'pc';
var _MARKER_TAG = 'mrk';
var _XLIFF_TAG = 'xliff';
var _SOURCE_TAG = 'source';
var _TARGET_TAG = 'target';
var _UNIT_TAG = 'unit';
// http://docs.oasis-open.org/xliff/xliff-core/v2.0/os/xliff-core-v2.0-os.html
var Xliff2 = /** @class */ (function (_super) {
    __extends(Xliff2, _super);
    function Xliff2() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Xliff2.prototype.write = function (messages, locale) {
        var visitor = new _WriteVisitor();
        var units = [];
        messages.forEach(function (message) {
            var unit = new xml.Tag(_UNIT_TAG, { id: message.id });
            var notes = new xml.Tag('notes');
            if (message.description || message.meaning) {
                if (message.description) {
                    notes.children.push(new xml.CR(8), new xml.Tag('note', { category: 'description' }, [new xml.Text(message.description)]));
                }
                if (message.meaning) {
                    notes.children.push(new xml.CR(8), new xml.Tag('note', { category: 'meaning' }, [new xml.Text(message.meaning)]));
                }
            }
            message.sources.forEach(function (source) {
                notes.children.push(new xml.CR(8), new xml.Tag('note', { category: 'location' }, [
                    new xml.Text(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? ',' + source.endLine : ''))
                ]));
            });
            notes.children.push(new xml.CR(6));
            unit.children.push(new xml.CR(6), notes);
            var segment = new xml.Tag('segment');
            segment.children.push(new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes)), new xml.CR(6));
            unit.children.push(new xml.CR(6), segment, new xml.CR(4));
            units.push(new xml.CR(4), unit);
        });
        var file = new xml.Tag('file', { 'original': 'ng.template', id: 'ngi18n' }, units.concat([new xml.CR(2)]));
        var xliff = new xml.Tag(_XLIFF_TAG, { version: _VERSION, xmlns: _XMLNS, srcLang: locale || _DEFAULT_SOURCE_LANG }, [new xml.CR(2), file, new xml.CR()]);
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }), new xml.CR(), xliff, new xml.CR()
        ]);
    };
    Xliff2.prototype.load = function (content, url) {
        // xliff to xml nodes
        var xliff2Parser = new Xliff2Parser();
        var _a = xliff2Parser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xliff2 parse errors:\n" + errors.join('\n'));
        }
        return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
    };
    Xliff2.prototype.digest = function (message) { return digest_1.decimalDigest(message); };
    return Xliff2;
}(serializer_1.Serializer));
exports.Xliff2 = Xliff2;
var _WriteVisitor = /** @class */ (function () {
    function _WriteVisitor() {
    }
    _WriteVisitor.prototype.visitText = function (text, context) { return [new xml.Text(text.value)]; };
    _WriteVisitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        var nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    _WriteVisitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var nodes = [new xml.Text("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new xml.Text(c + " {")].concat(icu.cases[c].visit(_this), [new xml.Text("} ")]));
        });
        nodes.push(new xml.Text("}"));
        return nodes;
    };
    _WriteVisitor.prototype.visitTagPlaceholder = function (ph, context) {
        var _this = this;
        var type = getTypeForTag(ph.tag);
        if (ph.isVoid) {
            var tagPh = new xml.Tag(_PLACEHOLDER_TAG, {
                id: (this._nextPlaceholderId++).toString(),
                equiv: ph.startName,
                type: type,
                disp: "<" + ph.tag + "/>",
            });
            return [tagPh];
        }
        var tagPc = new xml.Tag(_PLACEHOLDER_SPANNING_TAG, {
            id: (this._nextPlaceholderId++).toString(),
            equivStart: ph.startName,
            equivEnd: ph.closeName,
            type: type,
            dispStart: "<" + ph.tag + ">",
            dispEnd: "</" + ph.tag + ">",
        });
        var nodes = [].concat.apply([], ph.children.map(function (node) { return node.visit(_this); }));
        if (nodes.length) {
            nodes.forEach(function (node) { return tagPc.children.push(node); });
        }
        else {
            tagPc.children.push(new xml.Text(''));
        }
        return [tagPc];
    };
    _WriteVisitor.prototype.visitPlaceholder = function (ph, context) {
        var idStr = (this._nextPlaceholderId++).toString();
        return [new xml.Tag(_PLACEHOLDER_TAG, {
                id: idStr,
                equiv: ph.name,
                disp: "{{" + ph.value + "}}",
            })];
    };
    _WriteVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        var cases = Object.keys(ph.value.cases).map(function (value) { return value + ' {...}'; }).join(' ');
        var idStr = (this._nextPlaceholderId++).toString();
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: idStr, equiv: ph.name, disp: "{" + ph.value.expression + ", " + ph.value.type + ", " + cases + "}" })];
    };
    _WriteVisitor.prototype.serialize = function (nodes) {
        var _this = this;
        this._nextPlaceholderId = 0;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _WriteVisitor;
}());
// Extract messages as xml nodes from the xliff file
var Xliff2Parser = /** @class */ (function () {
    function Xliff2Parser() {
        this._locale = null;
    }
    Xliff2Parser.prototype.parse = function (xliff, url) {
        this._unitMlString = null;
        this._msgIdToHtml = {};
        var xml = new xml_parser_1.XmlParser().parse(xliff, url, false);
        this._errors = xml.errors;
        ml.visitAll(this, xml.rootNodes, null);
        return {
            msgIdToHtml: this._msgIdToHtml,
            errors: this._errors,
            locale: this._locale,
        };
    };
    Xliff2Parser.prototype.visitElement = function (element, context) {
        switch (element.name) {
            case _UNIT_TAG:
                this._unitMlString = null;
                var idAttr = element.attrs.find(function (attr) { return attr.name === 'id'; });
                if (!idAttr) {
                    this._addError(element, "<" + _UNIT_TAG + "> misses the \"id\" attribute");
                }
                else {
                    var id = idAttr.value;
                    if (this._msgIdToHtml.hasOwnProperty(id)) {
                        this._addError(element, "Duplicated translations for msg " + id);
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                        if (typeof this._unitMlString === 'string') {
                            this._msgIdToHtml[id] = this._unitMlString;
                        }
                        else {
                            this._addError(element, "Message " + id + " misses a translation");
                        }
                    }
                }
                break;
            case _SOURCE_TAG:
                // ignore source message
                break;
            case _TARGET_TAG:
                var innerTextStart = element.startSourceSpan.end.offset;
                var innerTextEnd = element.endSourceSpan.start.offset;
                var content = element.startSourceSpan.start.file.content;
                var innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _XLIFF_TAG:
                var localeAttr = element.attrs.find(function (attr) { return attr.name === 'trgLang'; });
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                var versionAttr = element.attrs.find(function (attr) { return attr.name === 'version'; });
                if (versionAttr) {
                    var version = versionAttr.value;
                    if (version !== '2.0') {
                        this._addError(element, "The XLIFF file version " + version + " is not compatible with XLIFF 2.0 serializer");
                    }
                    else {
                        ml.visitAll(this, element.children, null);
                    }
                }
                break;
            default:
                ml.visitAll(this, element.children, null);
        }
    };
    Xliff2Parser.prototype.visitAttribute = function (attribute, context) { };
    Xliff2Parser.prototype.visitText = function (text, context) { };
    Xliff2Parser.prototype.visitComment = function (comment, context) { };
    Xliff2Parser.prototype.visitExpansion = function (expansion, context) { };
    Xliff2Parser.prototype.visitExpansionCase = function (expansionCase, context) { };
    Xliff2Parser.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return Xliff2Parser;
}());
// Convert ml nodes (xliff syntax) to i18n nodes
var XmlToI18n = /** @class */ (function () {
    function XmlToI18n() {
    }
    XmlToI18n.prototype.convert = function (message, url) {
        var xmlIcu = new xml_parser_1.XmlParser().parse(message, url, true);
        this._errors = xmlIcu.errors;
        var i18nNodes = this._errors.length > 0 || xmlIcu.rootNodes.length == 0 ?
            [] : [].concat.apply([], ml.visitAll(this, xmlIcu.rootNodes));
        return {
            i18nNodes: i18nNodes,
            errors: this._errors,
        };
    };
    XmlToI18n.prototype.visitText = function (text, context) { return new i18n.Text(text.value, text.sourceSpan); };
    XmlToI18n.prototype.visitElement = function (el, context) {
        var _this = this;
        switch (el.name) {
            case _PLACEHOLDER_TAG:
                var nameAttr = el.attrs.find(function (attr) { return attr.name === 'equiv'; });
                if (nameAttr) {
                    return [new i18n.Placeholder('', nameAttr.value, el.sourceSpan)];
                }
                this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"equiv\" attribute");
                break;
            case _PLACEHOLDER_SPANNING_TAG:
                var startAttr = el.attrs.find(function (attr) { return attr.name === 'equivStart'; });
                var endAttr = el.attrs.find(function (attr) { return attr.name === 'equivEnd'; });
                if (!startAttr) {
                    this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"equivStart\" attribute");
                }
                else if (!endAttr) {
                    this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"equivEnd\" attribute");
                }
                else {
                    var startId = startAttr.value;
                    var endId = endAttr.value;
                    var nodes = [];
                    return nodes.concat.apply(nodes, [new i18n.Placeholder('', startId, el.sourceSpan)].concat(el.children.map(function (node) { return node.visit(_this, null); }), [new i18n.Placeholder('', endId, el.sourceSpan)]));
                }
                break;
            case _MARKER_TAG:
                return [].concat.apply([], ml.visitAll(this, el.children));
            default:
                this._addError(el, "Unexpected tag");
        }
        return null;
    };
    XmlToI18n.prototype.visitExpansion = function (icu, context) {
        var caseMap = {};
        ml.visitAll(this, icu.cases).forEach(function (c) {
            caseMap[c.value] = new i18n.Container(c.nodes, icu.sourceSpan);
        });
        return new i18n.Icu(icu.switchValue, icu.type, caseMap, icu.sourceSpan);
    };
    XmlToI18n.prototype.visitExpansionCase = function (icuCase, context) {
        return {
            value: icuCase.value,
            nodes: [].concat.apply([], ml.visitAll(this, icuCase.expression)),
        };
    };
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XmlToI18n;
}());
function getTypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
        case 'b':
        case 'i':
        case 'u':
            return 'fmt';
        case 'img':
            return 'image';
        case 'a':
            return 'link';
        default:
            return 'other';
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vc2VyaWFsaXplcnMveGxpZmYyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILHdDQUEwQztBQUMxQyx5REFBcUQ7QUFDckQsb0NBQXdDO0FBQ3hDLGtDQUFvQztBQUNwQyw0Q0FBd0M7QUFFeEMsMkNBQXdDO0FBQ3hDLGtDQUFvQztBQUVwQyxJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDdkIsSUFBTSxNQUFNLEdBQUcsdUNBQXVDLENBQUM7QUFDdkQseUNBQXlDO0FBQ3pDLElBQU0sb0JBQW9CLEdBQUcsSUFBSSxDQUFDO0FBQ2xDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLElBQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDO0FBQ3ZDLElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQztBQUUxQixJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFDM0IsSUFBTSxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzdCLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUM3QixJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUM7QUFFekIsOEVBQThFO0FBQzlFO0lBQTRCLDBCQUFVO0lBQXRDOztJQWdGQSxDQUFDO0lBL0VDLHNCQUFLLEdBQUwsVUFBTSxRQUF3QixFQUFFLE1BQW1CO1FBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDcEMsSUFBTSxLQUFLLEdBQWUsRUFBRSxDQUFDO1FBRTdCLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPO1lBQ3RCLElBQU0sSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsRUFBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7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