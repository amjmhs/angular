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
var _VERSION = '1.2';
var _XMLNS = 'urn:oasis:names:tc:xliff:document:1.2';
// TODO(vicb): make this a param (s/_/-/)
var _DEFAULT_SOURCE_LANG = 'en';
var _PLACEHOLDER_TAG = 'x';
var _MARKER_TAG = 'mrk';
var _FILE_TAG = 'file';
var _SOURCE_TAG = 'source';
var _SEGMENT_SOURCE_TAG = 'seg-source';
var _TARGET_TAG = 'target';
var _UNIT_TAG = 'trans-unit';
var _CONTEXT_GROUP_TAG = 'context-group';
var _CONTEXT_TAG = 'context';
// http://docs.oasis-open.org/xliff/v1.2/os/xliff-core.html
// http://docs.oasis-open.org/xliff/v1.2/xliff-profile-html/xliff-profile-html-1.2.html
var Xliff = /** @class */ (function (_super) {
    __extends(Xliff, _super);
    function Xliff() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Xliff.prototype.write = function (messages, locale) {
        var visitor = new _WriteVisitor();
        var transUnits = [];
        messages.forEach(function (message) {
            var _a;
            var contextTags = [];
            message.sources.forEach(function (source) {
                var contextGroupTag = new xml.Tag(_CONTEXT_GROUP_TAG, { purpose: 'location' });
                contextGroupTag.children.push(new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { 'context-type': 'sourcefile' }, [new xml.Text(source.filePath)]), new xml.CR(10), new xml.Tag(_CONTEXT_TAG, { 'context-type': 'linenumber' }, [new xml.Text("" + source.startLine)]), new xml.CR(8));
                contextTags.push(new xml.CR(8), contextGroupTag);
            });
            var transUnit = new xml.Tag(_UNIT_TAG, { id: message.id, datatype: 'html' });
            (_a = transUnit.children).push.apply(_a, [new xml.CR(8), new xml.Tag(_SOURCE_TAG, {}, visitor.serialize(message.nodes))].concat(contextTags));
            if (message.description) {
                transUnit.children.push(new xml.CR(8), new xml.Tag('note', { priority: '1', from: 'description' }, [new xml.Text(message.description)]));
            }
            if (message.meaning) {
                transUnit.children.push(new xml.CR(8), new xml.Tag('note', { priority: '1', from: 'meaning' }, [new xml.Text(message.meaning)]));
            }
            transUnit.children.push(new xml.CR(6));
            transUnits.push(new xml.CR(6), transUnit);
        });
        var body = new xml.Tag('body', {}, transUnits.concat([new xml.CR(4)]));
        var file = new xml.Tag('file', {
            'source-language': locale || _DEFAULT_SOURCE_LANG,
            datatype: 'plaintext',
            original: 'ng2.template',
        }, [new xml.CR(4), body, new xml.CR(2)]);
        var xliff = new xml.Tag('xliff', { version: _VERSION, xmlns: _XMLNS }, [new xml.CR(2), file, new xml.CR()]);
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }), new xml.CR(), xliff, new xml.CR()
        ]);
    };
    Xliff.prototype.load = function (content, url) {
        // xliff to xml nodes
        var xliffParser = new XliffParser();
        var _a = xliffParser.parse(content, url), locale = _a.locale, msgIdToHtml = _a.msgIdToHtml, errors = _a.errors;
        // xml nodes to i18n nodes
        var i18nNodesByMsgId = {};
        var converter = new XmlToI18n();
        Object.keys(msgIdToHtml).forEach(function (msgId) {
            var _a = converter.convert(msgIdToHtml[msgId], url), i18nNodes = _a.i18nNodes, e = _a.errors;
            errors.push.apply(errors, e);
            i18nNodesByMsgId[msgId] = i18nNodes;
        });
        if (errors.length) {
            throw new Error("xliff parse errors:\n" + errors.join('\n'));
        }
        return { locale: locale, i18nNodesByMsgId: i18nNodesByMsgId };
    };
    Xliff.prototype.digest = function (message) { return digest_1.digest(message); };
    return Xliff;
}(serializer_1.Serializer));
exports.Xliff = Xliff;
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
        var ctype = getCtypeForTag(ph.tag);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype, 'equiv-text': "<" + ph.tag + "/>" })];
        }
        var startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.startName, ctype: ctype, 'equiv-text': "<" + ph.tag + ">" });
        var closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { id: ph.closeName, ctype: ctype, 'equiv-text': "</" + ph.tag + ">" });
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
    };
    _WriteVisitor.prototype.visitPlaceholder = function (ph, context) {
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, 'equiv-text': "{{" + ph.value + "}}" })];
    };
    _WriteVisitor.prototype.visitIcuPlaceholder = function (ph, context) {
        var equivText = "{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases).map(function (value) { return value + ' {...}'; }).join(' ') + "}";
        return [new xml.Tag(_PLACEHOLDER_TAG, { id: ph.name, 'equiv-text': equivText })];
    };
    _WriteVisitor.prototype.serialize = function (nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _WriteVisitor;
}());
// TODO(vicb): add error management (structure)
// Extract messages as xml nodes from the xliff file
var XliffParser = /** @class */ (function () {
    function XliffParser() {
        this._locale = null;
    }
    XliffParser.prototype.parse = function (xliff, url) {
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
    XliffParser.prototype.visitElement = function (element, context) {
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
            // ignore those tags
            case _SOURCE_TAG:
            case _SEGMENT_SOURCE_TAG:
                break;
            case _TARGET_TAG:
                var innerTextStart = element.startSourceSpan.end.offset;
                var innerTextEnd = element.endSourceSpan.start.offset;
                var content = element.startSourceSpan.start.file.content;
                var innerText = content.slice(innerTextStart, innerTextEnd);
                this._unitMlString = innerText;
                break;
            case _FILE_TAG:
                var localeAttr = element.attrs.find(function (attr) { return attr.name === 'target-language'; });
                if (localeAttr) {
                    this._locale = localeAttr.value;
                }
                ml.visitAll(this, element.children, null);
                break;
            default:
                // TODO(vicb): assert file structure, xliff version
                // For now only recurse on unhandled nodes
                ml.visitAll(this, element.children, null);
        }
    };
    XliffParser.prototype.visitAttribute = function (attribute, context) { };
    XliffParser.prototype.visitText = function (text, context) { };
    XliffParser.prototype.visitComment = function (comment, context) { };
    XliffParser.prototype.visitExpansion = function (expansion, context) { };
    XliffParser.prototype.visitExpansionCase = function (expansionCase, context) { };
    XliffParser.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XliffParser;
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
        if (el.name === _PLACEHOLDER_TAG) {
            var nameAttr = el.attrs.find(function (attr) { return attr.name === 'id'; });
            if (nameAttr) {
                return new i18n.Placeholder('', nameAttr.value, el.sourceSpan);
            }
            this._addError(el, "<" + _PLACEHOLDER_TAG + "> misses the \"id\" attribute");
            return null;
        }
        if (el.name === _MARKER_TAG) {
            return [].concat.apply([], ml.visitAll(this, el.children));
        }
        this._addError(el, "Unexpected tag");
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
            nodes: ml.visitAll(this, icuCase.expression),
        };
    };
    XmlToI18n.prototype.visitComment = function (comment, context) { };
    XmlToI18n.prototype.visitAttribute = function (attribute, context) { };
    XmlToI18n.prototype._addError = function (node, message) {
        this._errors.push(new parse_util_1.I18nError(node.sourceSpan, message));
    };
    return XmlToI18n;
}());
function getCtypeForTag(tag) {
    switch (tag.toLowerCase()) {
        case 'br':
            return 'lb';
        case 'img':
            return 'image';
        default:
            return "x-" + tag;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGxpZmYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci9zcmMvaTE4bi9zZXJpYWxpemVycy94bGlmZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCx3Q0FBMEM7QUFDMUMseURBQXFEO0FBQ3JELG9DQUFpQztBQUNqQyxrQ0FBb0M7QUFDcEMsNENBQXdDO0FBRXhDLDJDQUF3QztBQUN4QyxrQ0FBb0M7QUFFcEMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLElBQU0sTUFBTSxHQUFHLHVDQUF1QyxDQUFDO0FBQ3ZELHlDQUF5QztBQUN6QyxJQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQztBQUNsQyxJQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUM3QixJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFFMUIsSUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUM3QixJQUFNLG1CQUFtQixHQUFHLFlBQVksQ0FBQztBQUN6QyxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUM7QUFDN0IsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDO0FBQy9CLElBQU0sa0JBQWtCLEdBQUcsZUFBZSxDQUFDO0FBQzNDLElBQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQztBQUUvQiwyREFBMkQ7QUFDM0QsdUZBQXVGO0FBQ3ZGO0lBQTJCLHlCQUFVO0lBQXJDOztJQW1GQSxDQUFDO0lBbEZDLHFCQUFLLEdBQUwsVUFBTSxRQUF3QixFQUFFLE1BQW1CO1FBQ2pELElBQU0sT0FBTyxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7UUFDcEMsSUFBTSxVQUFVLEdBQWUsRUFBRSxDQUFDO1FBRWxDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBQSxPQUFPOztZQUN0QixJQUFJLFdBQVcsR0FBZSxFQUFF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