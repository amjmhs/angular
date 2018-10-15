"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var lexer_1 = require("../../src/expression_parser/lexer");
var parser_1 = require("../../src/expression_parser/parser");
var html_parser_1 = require("../../src/ml_parser/html_parser");
var interpolation_config_1 = require("../../src/ml_parser/interpolation_config");
var t = require("../../src/render3/r3_ast");
var r3_template_transform_1 = require("../../src/render3/r3_template_transform");
var binding_parser_1 = require("../../src/template_parser/binding_parser");
var testing_1 = require("../../testing");
var unparser_1 = require("../expression_parser/utils/unparser");
// Parse an html string to IVY specific info
function parse(html) {
    var htmlParser = new html_parser_1.HtmlParser();
    var parseResult = htmlParser.parse(html, 'path:://to/template', true);
    if (parseResult.errors.length > 0) {
        var msg = parseResult.errors.map(function (e) { return e.toString(); }).join('\n');
        throw new Error(msg);
    }
    var htmlNodes = parseResult.rootNodes;
    var expressionParser = new parser_1.Parser(new lexer_1.Lexer());
    var schemaRegistry = new testing_1.MockSchemaRegistry({ 'invalidProp': false }, { 'mappedAttr': 'mappedProp' }, { 'unknown': false, 'un-known': false }, ['onEvent'], ['onEvent']);
    var bindingParser = new binding_parser_1.BindingParser(expressionParser, interpolation_config_1.DEFAULT_INTERPOLATION_CONFIG, schemaRegistry, null, []);
    return r3_template_transform_1.htmlAstToRender3Ast(htmlNodes, bindingParser);
}
// Transform an IVY AST to a flat list of nodes to ease testing
var R3AstHumanizer = /** @class */ (function () {
    function R3AstHumanizer() {
        this.result = [];
    }
    R3AstHumanizer.prototype.visitElement = function (element) {
        this.result.push(['Element', element.name]);
        this.visitAll([
            element.attributes,
            element.inputs,
            element.outputs,
            element.references,
            element.children,
        ]);
    };
    R3AstHumanizer.prototype.visitTemplate = function (template) {
        this.result.push(['Template']);
        this.visitAll([
            template.attributes,
            template.inputs,
            template.references,
            template.variables,
            template.children,
        ]);
    };
    R3AstHumanizer.prototype.visitContent = function (content) {
        this.result.push(['Content', content.selectorIndex]);
        t.visitAll(this, content.attributes);
    };
    R3AstHumanizer.prototype.visitVariable = function (variable) {
        this.result.push(['Variable', variable.name, variable.value]);
    };
    R3AstHumanizer.prototype.visitReference = function (reference) {
        this.result.push(['Reference', reference.name, reference.value]);
    };
    R3AstHumanizer.prototype.visitTextAttribute = function (attribute) {
        this.result.push(['TextAttribute', attribute.name, attribute.value]);
    };
    R3AstHumanizer.prototype.visitBoundAttribute = function (attribute) {
        this.result.push([
            'BoundAttribute',
            attribute.type,
            attribute.name,
            unparser_1.unparse(attribute.value),
        ]);
    };
    R3AstHumanizer.prototype.visitBoundEvent = function (event) {
        this.result.push([
            'BoundEvent',
            event.name,
            event.target,
            unparser_1.unparse(event.handler),
        ]);
    };
    R3AstHumanizer.prototype.visitText = function (text) { this.result.push(['Text', text.value]); };
    R3AstHumanizer.prototype.visitBoundText = function (text) { this.result.push(['BoundText', unparser_1.unparse(text.value)]); };
    R3AstHumanizer.prototype.visitAll = function (nodes) {
        var _this = this;
        nodes.forEach(function (node) { return t.visitAll(_this, node); });
    };
    return R3AstHumanizer;
}());
function expectFromHtml(html) {
    var res = parse(html);
    return expectFromR3Nodes(res.nodes);
}
function expectFromR3Nodes(nodes) {
    var humanizer = new R3AstHumanizer();
    t.visitAll(humanizer, nodes);
    return expect(humanizer.result);
}
describe('R3 template transform', function () {
    describe('Nodes without binding', function () {
        it('should parse text nodes', function () {
            expectFromHtml('a').toEqual([
                ['Text', 'a'],
            ]);
        });
        it('should parse elements with attributes', function () {
            expectFromHtml('<div a=b></div>').toEqual([
                ['Element', 'div'],
                ['TextAttribute', 'a', 'b'],
            ]);
        });
        it('should parse ngContent', function () {
            var res = parse('<ng-content select="a"></ng-content>');
            expect(res.hasNgContent).toEqual(true);
            expect(res.ngContentSelectors).toEqual(['a']);
            expectFromR3Nodes(res.nodes).toEqual([
                ['Content', 1],
                ['TextAttribute', 'select', 'a'],
            ]);
        });
        it('should parse ngContent when it contains WS only', function () {
            expectFromHtml('<ng-content select="a">    \n   </ng-content>').toEqual([
                ['Content', 1],
                ['TextAttribute', 'select', 'a'],
            ]);
        });
        it('should parse ngContent regardless the namespace', function () {
            expectFromHtml('<svg><ng-content select="a"></ng-content></svg>').toEqual([
                ['Element', ':svg:svg'],
                ['Content', 1],
                ['TextAttribute', 'select', 'a'],
            ]);
        });
    });
    describe('Bound text nodes', function () {
        it('should parse bound text nodes', function () {
            expectFromHtml('{{a}}').toEqual([
                ['BoundText', '{{ a }}'],
            ]);
        });
    });
    describe('Bound attributes', function () {
        it('should parse mixed case bound properties', function () {
            expectFromHtml('<div [someProp]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'someProp', 'v'],
            ]);
        });
        it('should parse bound properties via bind- ', function () {
            expectFromHtml('<div bind-prop="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'prop', 'v'],
            ]);
        });
        it('should parse bound properties via {{...}}', function () {
            expectFromHtml('<div prop="{{v}}"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'prop', '{{ v }}'],
            ]);
        });
        it('should parse dash case bound properties', function () {
            expectFromHtml('<div [some-prop]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'some-prop', 'v'],
            ]);
        });
        it('should parse dotted name bound properties', function () {
            expectFromHtml('<div [d.ot]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'd.ot', 'v'],
            ]);
        });
        it('should normalize property names via the element schema', function () {
            expectFromHtml('<div [mappedAttr]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'mappedProp', 'v'],
            ]);
        });
        it('should parse mixed case bound attributes', function () {
            expectFromHtml('<div [attr.someAttr]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 1 /* Attribute */, 'someAttr', 'v'],
            ]);
        });
        it('should parse and dash case bound classes', function () {
            expectFromHtml('<div [class.some-class]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 2 /* Class */, 'some-class', 'v'],
            ]);
        });
        it('should parse mixed case bound classes', function () {
            expectFromHtml('<div [class.someClass]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 2 /* Class */, 'someClass', 'v'],
            ]);
        });
        it('should parse mixed case bound styles', function () {
            expectFromHtml('<div [style.someStyle]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 3 /* Style */, 'someStyle', 'v'],
            ]);
        });
    });
    describe('templates', function () {
        it('should support * directives', function () {
            expectFromHtml('<div *ngIf></div>').toEqual([
                ['Template'],
                ['TextAttribute', 'ngIf', ''],
                ['Element', 'div'],
            ]);
        });
        it('should support <ng-template>', function () {
            expectFromHtml('<ng-template></ng-template>').toEqual([
                ['Template'],
            ]);
        });
        it('should support <ng-template> regardless the namespace', function () {
            expectFromHtml('<svg><ng-template></ng-template></svg>').toEqual([
                ['Element', ':svg:svg'],
                ['Template'],
            ]);
        });
        it('should support reference via #...', function () {
            expectFromHtml('<ng-template #a></ng-template>').toEqual([
                ['Template'],
                ['Reference', 'a', ''],
            ]);
        });
        it('should support reference via ref-...', function () {
            expectFromHtml('<ng-template ref-a></ng-template>').toEqual([
                ['Template'],
                ['Reference', 'a', ''],
            ]);
        });
        it('should parse variables via let-...', function () {
            expectFromHtml('<ng-template let-a="b"></ng-template>').toEqual([
                ['Template'],
                ['Variable', 'a', 'b'],
            ]);
        });
    });
    describe('inline templates', function () {
        it('should parse variables via let ...', function () {
            expectFromHtml('<div *ngIf="let a=b"></div>').toEqual([
                ['Template'],
                ['TextAttribute', 'ngIf', ''],
                ['Variable', 'a', 'b'],
                ['Element', 'div'],
            ]);
        });
        it('should parse variables via as ...', function () {
            expectFromHtml('<div *ngIf="expr as local"></div>').toEqual([
                ['Template'],
                ['TextAttribute', 'ngIf', 'expr '],
                ['BoundAttribute', 0 /* Property */, 'ngIf', 'expr'],
                ['Variable', 'local', 'ngIf'],
                ['Element', 'div'],
            ]);
        });
    });
    describe('events', function () {
        it('should parse bound events with a target', function () {
            expectFromHtml('<div (window:event)="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundEvent', 'event', 'window', 'v'],
            ]);
        });
        it('should parse event names case sensitive', function () {
            expectFromHtml('<div (some-event)="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundEvent', 'some-event', null, 'v'],
            ]);
            expectFromHtml('<div (someEvent)="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundEvent', 'someEvent', null, 'v'],
            ]);
        });
        it('should parse bound events via on-', function () {
            expectFromHtml('<div on-event="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundEvent', 'event', null, 'v'],
            ]);
        });
        it('should parse bound events and properties via [(...)]', function () {
            expectFromHtml('<div [(prop)]="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'prop', 'v'],
                ['BoundEvent', 'propChange', null, 'v = $event'],
            ]);
        });
        it('should parse bound events and properties via bindon-', function () {
            expectFromHtml('<div bindon-prop="v"></div>').toEqual([
                ['Element', 'div'],
                ['BoundAttribute', 0 /* Property */, 'prop', 'v'],
                ['BoundEvent', 'propChange', null, 'v = $event'],
            ]);
        });
        it('should report an error on empty expression', function () {
            expect(function () { return parse('<div (event)="">'); }).toThrowError(/Empty expressions are not allowed/);
            expect(function () { return parse('<div (event)="   ">'); }).toThrowError(/Empty expressions are not allowed/);
        });
    });
    describe('references', function () {
        it('should parse references via #...', function () {
            expectFromHtml('<div #a></div>').toEqual([
                ['Element', 'div'],
                ['Reference', 'a', ''],
            ]);
        });
        it('should parse references via ref-', function () {
            expectFromHtml('<div ref-a></div>').toEqual([
                ['Element', 'div'],
                ['Reference', 'a', ''],
            ]);
        });
        it('should parse camel case references', function () {
            expectFromHtml('<div #someA></div>').toEqual([
                ['Element', 'div'],
                ['Reference', 'someA', ''],
            ]);
        });
    });
    describe('ng-content', function () {
        it('should parse ngContent without selector', function () {
            var res = parse('<ng-content></ng-content>');
            expect(res.hasNgContent).toEqual(true);
            expect(res.ngContentSelectors).toEqual([]);
            expectFromR3Nodes(res.nodes).toEqual([
                ['Content', 0],
            ]);
        });
        it('should parse ngContent with a * selector', function () {
            var res = parse('<ng-content></ng-content>');
            var selectors = [''];
            expect(res.hasNgContent).toEqual(true);
            expect(res.ngContentSelectors).toEqual([]);
            expectFromR3Nodes(res.nodes).toEqual([
                ['Content', 0],
            ]);
        });
        it('should parse ngContent with a specific selector', function () {
            var res = parse('<ng-content select="tag[attribute]"></ng-content>');
            var selectors = ['', 'tag[attribute]'];
            expect(res.hasNgContent).toEqual(true);
            expect(res.ngContentSelectors).toEqual(['tag[attribute]']);
            expectFromR3Nodes(res.nodes).toEqual([
                ['Content', 1],
                ['TextAttribute', 'select', selectors[1]],
            ]);
        });
        it('should parse ngContent with a selector', function () {
            var res = parse('<ng-content select="a"></ng-content><ng-content></ng-content><ng-content select="b"></ng-content>');
            var selectors = ['', 'a', 'b'];
            expect(res.hasNgContent).toEqual(true);
            expect(res.ngContentSelectors).toEqual(['a', 'b']);
            expectFromR3Nodes(res.nodes).toEqual([
                ['Content', 1],
                ['TextAttribute', 'select', selectors[1]],
                ['Content', 0],
                ['Content', 2],
                ['TextAttribute', 'select', selectors[2]],
            ]);
        });
        it('should parse ngProjectAs as an attribute', function () {
            var res = parse('<ng-content ngProjectAs="a"></ng-content>');
            var selectors = [''];
            expect(res.hasNgContent).toEqual(true);
            expect(res.ngContentSelectors).toEqual([]);
            expectFromR3Nodes(res.nodes).toEqual([
                ['Content', 0],
                ['TextAttribute', 'ngProjectAs', 'a'],
            ]);
        });
    });
    describe('Ignored elements', function () {
        it('should ignore <script> elements', function () {
            expectFromHtml('<script></script>a').toEqual([
                ['Text', 'a'],
            ]);
        });
        it('should ignore <style> elements', function () {
            expectFromHtml('<style></style>a').toEqual([
                ['Text', 'a'],
            ]);
        });
    });
    describe('<link rel="stylesheet">', function () {
        it('should keep <link rel="stylesheet"> elements if they have an absolute url', function () {
            expectFromHtml('<link rel="stylesheet" href="http://someurl">').toEqual([
                ['Element', 'link'],
                ['TextAttribute', 'rel', 'stylesheet'],
                ['TextAttribute', 'href', 'http://someurl'],
            ]);
            expectFromHtml('<link REL="stylesheet" href="http://someurl">').toEqual([
                ['Element', 'link'],
                ['TextAttribute', 'REL', 'stylesheet'],
                ['TextAttribute', 'href', 'http://someurl'],
            ]);
        });
        it('should keep <link rel="stylesheet"> elements if they have no uri', function () {
            expectFromHtml('<link rel="stylesheet">').toEqual([
                ['Element', 'link'],
                ['TextAttribute', 'rel', 'stylesheet'],
            ]);
            expectFromHtml('<link REL="stylesheet">').toEqual([
                ['Element', 'link'],
                ['TextAttribute', 'REL', 'stylesheet'],
            ]);
        });
        it('should ignore <link rel="stylesheet"> elements if they have a relative uri', function () {
            expectFromHtml('<link rel="stylesheet" href="./other.css">').toEqual([]);
            expectFromHtml('<link REL="stylesheet" HREF="./other.css">').toEqual([]);
        });
    });
    describe('ngNonBindable', function () {
        it('should ignore bindings on children of elements with ngNonBindable', function () {
            expectFromHtml('<div ngNonBindable>{{b}}</div>').toEqual([
                ['Element', 'div'],
                ['TextAttribute', 'ngNonBindable', ''],
                ['Text', '{{b}}'],
            ]);
        });
        it('should keep nested children of elements with ngNonBindable', function () {
            expectFromHtml('<div ngNonBindable><span>{{b}}</span></div>').toEqual([
                ['Element', 'div'],
                ['TextAttribute', 'ngNonBindable', ''],
                ['Element', 'span'],
                ['Text', '{{b}}'],
            ]);
        });
        it('should ignore <script> elements inside of elements with ngNonBindable', function () {
            expectFromHtml('<div ngNonBindable><script></script>a</div>').toEqual([
                ['Element', 'div'],
                ['TextAttribute', 'ngNonBindable', ''],
                ['Text', 'a'],
            ]);
        });
        it('should ignore <style> elements inside of elements with ngNonBindable', function () {
            expectFromHtml('<div ngNonBindable><style></style>a</div>').toEqual([
                ['Element', 'div'],
                ['TextAttribute', 'ngNonBindable', ''],
                ['Text', 'a'],
            ]);
        });
        it('should ignore <link rel="stylesheet"> elements inside of elements with ngNonBindable', function () {
            expectFromHtml('<div ngNonBindable><link rel="stylesheet">a</div>').toEqual([
                ['Element', 'div'],
                ['TextAttribute', 'ngNonBindable', ''],
                ['Text', 'a'],
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicjNfdGVtcGxhdGVfdHJhbnNmb3JtX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3JlbmRlcjMvcjNfdGVtcGxhdGVfdHJhbnNmb3JtX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwyREFBd0Q7QUFDeEQsNkRBQTBEO0FBRTFELCtEQUEyRDtBQUMzRCxpRkFBc0Y7QUFFdEYsNENBQThDO0FBQzlDLGlGQUFnRztBQUNoRywyRUFBdUU7QUFDdkUseUNBQWlEO0FBQ2pELGdFQUE0RDtBQUc1RCw0Q0FBNEM7QUFDNUMsZUFBZSxJQUFZO0lBQ3pCLElBQU0sVUFBVSxHQUFHLElBQUksd0JBQVUsRUFBRSxDQUFDO0lBRXBDLElBQU0sV0FBVyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLHFCQUFxQixFQUFFLElBQUksQ0FBQyxDQUFDO0lBRXhFLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ2pDLElBQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxFQUFaLENBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqRSxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ3RCO0lBRUQsSUFBTSxTQUFTLEdBQUcsV0FBVyxDQUFDLFNBQVMsQ0FBQztJQUN4QyxJQUFNLGdCQUFnQixHQUFHLElBQUksZUFBTSxDQUFDLElBQUksYUFBSyxFQUFFLENBQUMsQ0FBQztJQUNqRCxJQUFNLGNBQWMsR0FBRyxJQUFJLDRCQUFrQixDQUN6QyxFQUFDLGFBQWEsRUFBRSxLQUFLLEVBQUMsRUFBRSxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUMsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBQyxFQUMzRixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUM5QixJQUFNLGFBQWEsR0FDZixJQUFJLDhCQUFhLENBQUMsZ0JBQWdCLEVBQUUsbURBQTRCLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoRyxPQUFPLDJDQUFtQixDQUFDLFNBQVMsRUFBRSxhQUFhLENBQUMsQ0FBQztBQUN2RCxDQUFDO0FBRUQsK0RBQStEO0FBQy9EO0lBQUE7UUFDRSxXQUFNLEdBQVUsRUFBRSxDQUFDO0lBZ0VyQixDQUFDO0lBOURDLHFDQUFZLEdBQVosVUFBYSxPQUFrQjtRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1QyxJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ1osT0FBTyxDQUFDLFVBQVU7WUFDbEIsT0FBTyxDQUFDLE1BQU07WUFDZCxPQUFPLENBQUMsT0FBTztZQUNmLE9BQU8sQ0FBQyxVQUFVO1lBQ2xCLE9BQU8sQ0FBQyxRQUFRO1NBQ2pCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxzQ0FBYSxHQUFiLFVBQWMsUUFBb0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLENBQUM7WUFDWixRQUFRLENBQUMsVUFBVTtZQUNuQixRQUFRLENBQUMsTUFBTTtZQUNmLFFBQVEsQ0FBQyxVQUFVO1lBQ25CLFFBQVEsQ0FBQyxTQUFTO1lBQ2xCLFFBQVEsQ0FBQyxRQUFRO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxxQ0FBWSxHQUFaLFVBQWEsT0FBa0I7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7UUFDckQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxzQ0FBYSxHQUFiLFVBQWMsUUFBb0I7UUFDaEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUNoRSxDQUFDO0lBRUQsdUNBQWMsR0FBZCxVQUFlLFNBQXNCO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELDJDQUFrQixHQUFsQixVQUFtQixTQUEwQjtRQUMzQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCw0Q0FBbUIsR0FBbkIsVUFBb0IsU0FBMkI7UUFDN0MsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixnQkFBZ0I7WUFDaEIsU0FBUyxDQUFDLElBQUk7WUFDZCxTQUFTLENBQUMsSUFBSTtZQUNkLGtCQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztTQUN6QixDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsd0NBQWUsR0FBZixVQUFnQixLQUFtQjtRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLFlBQVk7WUFDWixLQUFLLENBQUMsSUFBSTtZQUNWLEtBQUssQ0FBQyxNQUFNO1lBQ1osa0JBQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxrQ0FBUyxHQUFULFVBQVUsSUFBWSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVuRSx1Q0FBYyxHQUFkLFVBQWUsSUFBaUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFdBQVcsRUFBRSxrQkFBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRW5GLGlDQUFRLEdBQWhCLFVBQWlCLEtBQWlCO1FBQWxDLGlCQUFzRjtRQUFoRCxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFJLEVBQUUsSUFBSSxDQUFDLEVBQXRCLENBQXNCLENBQUMsQ0FBQztJQUFDLENBQUM7SUFDeEYscUJBQUM7QUFBRCxDQUFDLEFBakVELElBaUVDO0FBRUQsd0JBQXdCLElBQVk7SUFDbEMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLE9BQU8saUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCwyQkFBMkIsS0FBZTtJQUN4QyxJQUFNLFNBQVMsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0lBQ3ZDLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzdCLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQsUUFBUSxDQUFDLHVCQUF1QixFQUFFO0lBQ2hDLFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtRQUNoQyxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDMUIsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN4QyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUM7YUFDNUIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDMUQsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDOUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDbkMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUM7YUFDakMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsY0FBYyxDQUFDLCtDQUErQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN0RSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQzthQUNqQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxpREFBaUQsRUFBRTtZQUNwRCxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3hFLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQztnQkFDdkIsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUM7YUFDakMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixFQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDOUIsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDO2FBQ3pCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLGNBQWMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDbkQsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGdCQUFnQixvQkFBd0IsVUFBVSxFQUFFLEdBQUcsQ0FBQzthQUMxRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxjQUFjLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2xELENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxnQkFBZ0Isb0JBQXdCLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDdEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMkNBQTJDLEVBQUU7WUFDOUMsY0FBYyxDQUFDLDBCQUEwQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsZ0JBQWdCLG9CQUF3QixNQUFNLEVBQUUsU0FBUyxDQUFDO2FBQzVELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDcEQsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGdCQUFnQixvQkFBd0IsV0FBVyxFQUFFLEdBQUcsQ0FBQzthQUMzRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxjQUFjLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQy9DLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxnQkFBZ0Isb0JBQXdCLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDdEQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0RBQXdELEVBQUU7WUFDM0QsY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNyRCxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsZ0JBQWdCLG9CQUF3QixZQUFZLEVBQUUsR0FBRyxDQUFDO2FBQzVELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBDQUEwQyxFQUFFO1lBQzdDLGNBQWMsQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDeEQsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGdCQUFnQixxQkFBeUIsVUFBVSxFQUFFLEdBQUcsQ0FBQzthQUMzRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxjQUFjLENBQUMsb0NBQW9DLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzNELENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxnQkFBZ0IsaUJBQXFCLFlBQVksRUFBRSxHQUFHLENBQUM7YUFDekQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsY0FBYyxDQUFDLG1DQUFtQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMxRCxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsZ0JBQWdCLGlCQUFxQixXQUFXLEVBQUUsR0FBRyxDQUFDO2FBQ3hELENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1lBQ3pDLGNBQWMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDMUQsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGdCQUFnQixpQkFBcUIsV0FBVyxFQUFFLEdBQUcsQ0FBQzthQUN4RCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsNkJBQTZCLEVBQUU7WUFDaEMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMxQyxDQUFDLFVBQVUsQ0FBQztnQkFDWixDQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO2dCQUM3QixDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7YUFDbkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUU7WUFDakMsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNwRCxDQUFDLFVBQVUsQ0FBQzthQUNiLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELGNBQWMsQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDL0QsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDO2dCQUN2QixDQUFDLFVBQVUsQ0FBQzthQUNiLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDdkQsQ0FBQyxVQUFVLENBQUM7Z0JBQ1osQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxjQUFjLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzFELENBQUMsVUFBVSxDQUFDO2dCQUNaLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUM7YUFDdkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDdkMsY0FBYyxDQUFDLHVDQUF1QyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUM5RCxDQUFDLFVBQVUsQ0FBQztnQkFDWixDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO2FBQ3ZCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsa0JBQWtCLEVBQUU7UUFDM0IsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO1lBQ3ZDLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDcEQsQ0FBQyxVQUFVLENBQUM7Z0JBQ1osQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQztnQkFDN0IsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQztnQkFDdEIsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2FBQ25CLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1lBQ3RDLGNBQWMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDMUQsQ0FBQyxVQUFVLENBQUM7Z0JBQ1osQ0FBQyxlQUFlLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztnQkFDbEMsQ0FBQyxnQkFBZ0Isb0JBQXdCLE1BQU0sRUFBRSxNQUFNLENBQUM7Z0JBQ3hELENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUM7Z0JBQzdCLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQzthQUNuQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsY0FBYyxDQUFDLGdDQUFnQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN2RCxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDO2FBQ3ZDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1lBQzVDLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDckQsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQzthQUN4QyxDQUFDLENBQUM7WUFDSCxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BELENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxZQUFZLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUM7YUFDdkMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7WUFDdEMsY0FBYyxDQUFDLDBCQUEwQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNqRCxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDO2FBQ25DLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNEQUFzRCxFQUFFO1lBQ3pELGNBQWMsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDakQsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGdCQUFnQixvQkFBd0IsTUFBTSxFQUFFLEdBQUcsQ0FBQztnQkFDckQsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxZQUFZLENBQUM7YUFDakQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0RBQXNELEVBQUU7WUFDekQsY0FBYyxDQUFDLDZCQUE2QixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNwRCxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsZ0JBQWdCLG9CQUF3QixNQUFNLEVBQUUsR0FBRyxDQUFDO2dCQUNyRCxDQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFlBQVksQ0FBQzthQUNqRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0Q0FBNEMsRUFBRTtZQUMvQyxNQUFNLENBQUMsY0FBTSxPQUFBLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxFQUF6QixDQUF5QixDQUFDLENBQUMsWUFBWSxDQUFDLG1DQUFtQyxDQUFDLENBQUM7WUFDMUYsTUFBTSxDQUFDLGNBQU0sT0FBQSxLQUFLLENBQUMscUJBQXFCLENBQUMsRUFBNUIsQ0FBNEIsQ0FBQyxDQUFDLFlBQVksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQy9GLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxXQUFXLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQzthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtZQUN2QyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQzNDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxXQUFXLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQzthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLDJCQUEyQixDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNuQyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7YUFDZixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztZQUMvQyxJQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0MsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDbkMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2FBQ2YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLG1EQUFtRCxDQUFDLENBQUM7WUFDdkUsSUFBTSxTQUFTLEdBQUcsQ0FBQyxFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUN6QyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1lBQzNELGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ25DLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDZCxDQUFDLGVBQWUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1lBQzNDLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FDYixtR0FBbUcsQ0FBQyxDQUFDO1lBQ3pHLElBQU0sU0FBUyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztZQUNqQyxNQUFNLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxNQUFNLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDbkQsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDbkMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLENBQUMsZUFBZSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztnQkFDZCxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxlQUFlLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUMxQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsMkNBQTJDLENBQUMsQ0FBQztZQUMvRCxJQUFNLFNBQVMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0MsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDbkMsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO2dCQUNkLENBQUMsZUFBZSxFQUFFLGFBQWEsRUFBRSxHQUFHLENBQUM7YUFDdEMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxrQkFBa0IsRUFBRTtRQUMzQixFQUFFLENBQUMsaUNBQWlDLEVBQUU7WUFDcEMsY0FBYyxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUMzQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDZCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNuQyxjQUFjLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3pDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUNkLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMseUJBQXlCLEVBQUU7UUFDbEMsRUFBRSxDQUFDLDJFQUEyRSxFQUFFO1lBQzlFLGNBQWMsQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDdEUsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDO2dCQUNuQixDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsWUFBWSxDQUFDO2dCQUN0QyxDQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUUsZ0JBQWdCLENBQUM7YUFDNUMsQ0FBQyxDQUFDO1lBQ0gsY0FBYyxDQUFDLCtDQUErQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUN0RSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQ25CLENBQUMsZUFBZSxFQUFFLEtBQUssRUFBRSxZQUFZLENBQUM7Z0JBQ3RDLENBQUMsZUFBZSxFQUFFLE1BQU0sRUFBRSxnQkFBZ0IsQ0FBQzthQUM1QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrRUFBa0UsRUFBRTtZQUNyRSxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hELENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFDbkIsQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQzthQUN2QyxDQUFDLENBQUM7WUFDSCxjQUFjLENBQUMseUJBQXlCLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ2hELENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQztnQkFDbkIsQ0FBQyxlQUFlLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQzthQUN2QyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw0RUFBNEUsRUFBRTtZQUMvRSxjQUFjLENBQUMsNENBQTRDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDekUsY0FBYyxDQUFDLDRDQUE0QyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQyxtRUFBbUUsRUFBRTtZQUN0RSxjQUFjLENBQUMsZ0NBQWdDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3ZELENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQztnQkFDdEMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDREQUE0RCxFQUFFO1lBQy9ELGNBQWMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDcEUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUM7Z0JBQ25CLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQzthQUNsQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1RUFBdUUsRUFBRTtZQUMxRSxjQUFjLENBQUMsNkNBQTZDLENBQUMsQ0FBQyxPQUFPLENBQUM7Z0JBQ3BFLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztnQkFDbEIsQ0FBQyxlQUFlLEVBQUUsZUFBZSxFQUFFLEVBQUUsQ0FBQztnQkFDdEMsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDO2FBQ2QsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0VBQXNFLEVBQUU7WUFDekUsY0FBYyxDQUFDLDJDQUEyQyxDQUFDLENBQUMsT0FBTyxDQUFDO2dCQUNsRSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7Z0JBQ2xCLENBQUMsZUFBZSxFQUFFLGVBQWUsRUFBRSxFQUFFLENBQUM7Z0JBQ3RDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQzthQUNkLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHNGQUFzRixFQUN0RjtZQUNFLGNBQWMsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDLE9BQU8sQ0FBQztnQkFDMUUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO2dCQUNsQixDQUFDLGVBQWUsRUFBRSxlQUFlLEVBQUUsRUFBRSxDQUFDO2dCQUN0QyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUM7YUFDZCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNSLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==