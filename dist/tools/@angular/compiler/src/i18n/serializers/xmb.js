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
var digest_1 = require("../digest");
var serializer_1 = require("./serializer");
var xml = require("./xml_helper");
var _MESSAGES_TAG = 'messagebundle';
var _MESSAGE_TAG = 'msg';
var _PLACEHOLDER_TAG = 'ph';
var _EXEMPLE_TAG = 'ex';
var _SOURCE_TAG = 'source';
var _DOCTYPE = "<!ELEMENT messagebundle (msg)*>\n<!ATTLIST messagebundle class CDATA #IMPLIED>\n\n<!ELEMENT msg (#PCDATA|ph|source)*>\n<!ATTLIST msg id CDATA #IMPLIED>\n<!ATTLIST msg seq CDATA #IMPLIED>\n<!ATTLIST msg name CDATA #IMPLIED>\n<!ATTLIST msg desc CDATA #IMPLIED>\n<!ATTLIST msg meaning CDATA #IMPLIED>\n<!ATTLIST msg obsolete (obsolete) #IMPLIED>\n<!ATTLIST msg xml:space (default|preserve) \"default\">\n<!ATTLIST msg is_hidden CDATA #IMPLIED>\n\n<!ELEMENT source (#PCDATA)>\n\n<!ELEMENT ph (#PCDATA|ex)*>\n<!ATTLIST ph name CDATA #REQUIRED>\n\n<!ELEMENT ex (#PCDATA)>";
var Xmb = /** @class */ (function (_super) {
    __extends(Xmb, _super);
    function Xmb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Xmb.prototype.write = function (messages, locale) {
        var exampleVisitor = new ExampleVisitor();
        var visitor = new _Visitor();
        var rootNode = new xml.Tag(_MESSAGES_TAG);
        messages.forEach(function (message) {
            var attrs = { id: message.id };
            if (message.description) {
                attrs['desc'] = message.description;
            }
            if (message.meaning) {
                attrs['meaning'] = message.meaning;
            }
            var sourceTags = [];
            message.sources.forEach(function (source) {
                sourceTags.push(new xml.Tag(_SOURCE_TAG, {}, [
                    new xml.Text(source.filePath + ":" + source.startLine + (source.endLine !== source.startLine ? ',' + source.endLine : ''))
                ]));
            });
            rootNode.children.push(new xml.CR(2), new xml.Tag(_MESSAGE_TAG, attrs, sourceTags.concat(visitor.serialize(message.nodes))));
        });
        rootNode.children.push(new xml.CR());
        return xml.serialize([
            new xml.Declaration({ version: '1.0', encoding: 'UTF-8' }),
            new xml.CR(),
            new xml.Doctype(_MESSAGES_TAG, _DOCTYPE),
            new xml.CR(),
            exampleVisitor.addDefaultExamples(rootNode),
            new xml.CR(),
        ]);
    };
    Xmb.prototype.load = function (content, url) {
        throw new Error('Unsupported');
    };
    Xmb.prototype.digest = function (message) { return digest(message); };
    Xmb.prototype.createNameMapper = function (message) {
        return new serializer_1.SimplePlaceholderMapper(message, toPublicName);
    };
    return Xmb;
}(serializer_1.Serializer));
exports.Xmb = Xmb;
var _Visitor = /** @class */ (function () {
    function _Visitor() {
    }
    _Visitor.prototype.visitText = function (text, context) { return [new xml.Text(text.value)]; };
    _Visitor.prototype.visitContainer = function (container, context) {
        var _this = this;
        var nodes = [];
        container.children.forEach(function (node) { return nodes.push.apply(nodes, node.visit(_this)); });
        return nodes;
    };
    _Visitor.prototype.visitIcu = function (icu, context) {
        var _this = this;
        var nodes = [new xml.Text("{" + icu.expressionPlaceholder + ", " + icu.type + ", ")];
        Object.keys(icu.cases).forEach(function (c) {
            nodes.push.apply(nodes, [new xml.Text(c + " {")].concat(icu.cases[c].visit(_this), [new xml.Text("} ")]));
        });
        nodes.push(new xml.Text("}"));
        return nodes;
    };
    _Visitor.prototype.visitTagPlaceholder = function (ph, context) {
        var startEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("<" + ph.tag + ">")]);
        var startTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.startName }, [startEx]);
        if (ph.isVoid) {
            // void tags have no children nor closing tags
            return [startTagPh];
        }
        var closeEx = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("</" + ph.tag + ">")]);
        var closeTagPh = new xml.Tag(_PLACEHOLDER_TAG, { name: ph.closeName }, [closeEx]);
        return [startTagPh].concat(this.serialize(ph.children), [closeTagPh]);
    };
    _Visitor.prototype.visitPlaceholder = function (ph, context) {
        var exTag = new xml.Tag(_EXEMPLE_TAG, {}, [new xml.Text("{{" + ph.value + "}}")]);
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name }, [exTag])];
    };
    _Visitor.prototype.visitIcuPlaceholder = function (ph, context) {
        var exTag = new xml.Tag(_EXEMPLE_TAG, {}, [
            new xml.Text("{" + ph.value.expression + ", " + ph.value.type + ", " + Object.keys(ph.value.cases).map(function (value) { return value + ' {...}'; }).join(' ') + "}")
        ]);
        return [new xml.Tag(_PLACEHOLDER_TAG, { name: ph.name }, [exTag])];
    };
    _Visitor.prototype.serialize = function (nodes) {
        var _this = this;
        return [].concat.apply([], nodes.map(function (node) { return node.visit(_this); }));
    };
    return _Visitor;
}());
function digest(message) {
    return digest_1.decimalDigest(message);
}
exports.digest = digest;
// TC requires at least one non-empty example on placeholders
var ExampleVisitor = /** @class */ (function () {
    function ExampleVisitor() {
    }
    ExampleVisitor.prototype.addDefaultExamples = function (node) {
        node.visit(this);
        return node;
    };
    ExampleVisitor.prototype.visitTag = function (tag) {
        var _this = this;
        if (tag.name === _PLACEHOLDER_TAG) {
            if (!tag.children || tag.children.length == 0) {
                var exText = new xml.Text(tag.attrs['name'] || '...');
                tag.children = [new xml.Tag(_EXEMPLE_TAG, {}, [exText])];
            }
        }
        else if (tag.children) {
            tag.children.forEach(function (node) { return node.visit(_this); });
        }
    };
    ExampleVisitor.prototype.visitText = function (text) { };
    ExampleVisitor.prototype.visitDeclaration = function (decl) { };
    ExampleVisitor.prototype.visitDoctype = function (doctype) { };
    return ExampleVisitor;
}());
// XMB/XTB placeholders can only contain A-Z, 0-9 and _
function toPublicName(internalName) {
    return internalName.toUpperCase().replace(/[^A-Z0-9_]/g, '_');
}
exports.toPublicName = toPublicName;
//# sourceMappingURL=xmb.js.map