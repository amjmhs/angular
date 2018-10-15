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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieG1iLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL2kxOG4vc2VyaWFsaXplcnMveG1iLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7OztBQUVILG9DQUF3QztBQUd4QywyQ0FBb0Y7QUFDcEYsa0NBQW9DO0FBRXBDLElBQU0sYUFBYSxHQUFHLGVBQWUsQ0FBQztBQUN0QyxJQUFNLFlBQVksR0FBRyxLQUFLLENBQUM7QUFDM0IsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDOUIsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQzFCLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQUU3QixJQUFNLFFBQVEsR0FBRyx1akJBa0JPLENBQUM7QUFFekI7SUFBeUIsdUJBQVU7SUFBbkM7O0lBcURBLENBQUM7SUFwREMsbUJBQUssR0FBTCxVQUFNLFFBQXdCLEVBQUUsTUFBbUI7UUFDakQsSUFBTSxjQUFjLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUM1QyxJQUFNLE9BQU8sR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO1FBQy9CLElBQUksUUFBUSxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUUxQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsT0FBTztZQUN0QixJQUFNLEtBQUssR0FBMEIsRUFBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBQyxDQUFDO1lBRXRELElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtnQkFDdkIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUM7YUFDckM7WUFFRCxJQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7Z0JBQ25CLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQ3BDO1lB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