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
var browser_util_1 = require("@angular/platform-browser/testing/src/browser_util");
var definition_1 = require("../../src/render3/definition");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var renderer_1 = require("../../src/render3/interfaces/renderer");
var imported_renderer2_1 = require("./imported_renderer2");
var BaseFixture = /** @class */ (function () {
    function BaseFixture() {
        this.hostElement = exports.document.createElement('div');
        this.hostElement.setAttribute('fixture', 'mark');
    }
    Object.defineProperty(BaseFixture.prototype, "html", {
        /**
         * Current state of rendered HTML.
         */
        get: function () { return toHtml(this.hostElement); },
        enumerable: true,
        configurable: true
    });
    return BaseFixture;
}());
exports.BaseFixture = BaseFixture;
function noop() { }
/**
 * Fixture for testing template functions in a convenient way.
 *
 * This fixture allows:
 * - specifying the creation block and update block as two separate functions,
 * - maintaining the template state between invocations,
 * - access to the render `html`.
 */
var TemplateFixture = /** @class */ (function (_super) {
    __extends(TemplateFixture, _super);
    /**
     *
     * @param createBlock Instructions which go into the creation block:
     *          `if (rf & RenderFlags.Create) { __here__ }`.
     * @param updateBlock Optional instructions which go into the update block:
     *          `if (rf & RenderFlags.Update) { __here__ }`.
     */
    function TemplateFixture(createBlock, updateBlock, directives, pipes, sanitizer, rendererFactory) {
        if (updateBlock === void 0) { updateBlock = noop; }
        var _this = _super.call(this) || this;
        _this.createBlock = createBlock;
        _this.updateBlock = updateBlock;
        _this._directiveDefs = toDefs(directives, definition_1.extractDirectiveDef);
        _this._pipeDefs = toDefs(pipes, definition_1.extractPipeDef);
        _this._sanitizer = sanitizer || null;
        _this._rendererFactory = rendererFactory || renderer_1.domRendererFactory3;
        _this.hostNode = instructions_1.renderTemplate(_this.hostElement, function (rf, ctx) {
            if (rf & 1 /* Create */) {
                _this.createBlock();
            }
            if (rf & 2 /* Update */) {
                _this.updateBlock();
            }
        }, null, _this._rendererFactory, null, _this._directiveDefs, _this._pipeDefs, sanitizer);
        return _this;
    }
    /**
     * Update the existing template
     *
     * @param updateBlock Optional update block.
     */
    TemplateFixture.prototype.update = function (updateBlock) {
        instructions_1.renderTemplate(this.hostNode.native, updateBlock || this.updateBlock, null, this._rendererFactory, this.hostNode, this._directiveDefs, this._pipeDefs, this._sanitizer);
    };
    return TemplateFixture;
}(BaseFixture));
exports.TemplateFixture = TemplateFixture;
/**
 * Fixture for testing Components in a convenient way.
 */
var ComponentFixture = /** @class */ (function (_super) {
    __extends(ComponentFixture, _super);
    function ComponentFixture(componentType, opts) {
        if (opts === void 0) { opts = {}; }
        var _this = _super.call(this) || this;
        _this.componentType = componentType;
        _this.requestAnimationFrame = function (fn) {
            exports.requestAnimationFrame.queue.push(fn);
        };
        _this.requestAnimationFrame.queue = [];
        _this.requestAnimationFrame.flush = function () {
            while (exports.requestAnimationFrame.queue.length) {
                exports.requestAnimationFrame.queue.shift()();
            }
        };
        _this.component = index_1.renderComponent(componentType, {
            host: _this.hostElement,
            scheduler: _this.requestAnimationFrame,
            injector: opts.injector,
            sanitizer: opts.sanitizer,
            rendererFactory: opts.rendererFactory || renderer_1.domRendererFactory3
        });
        return _this;
    }
    ComponentFixture.prototype.update = function () {
        index_1.tick(this.component);
        this.requestAnimationFrame.flush();
    };
    return ComponentFixture;
}(BaseFixture));
exports.ComponentFixture = ComponentFixture;
///////////////////////////////////////////////////////////////////////////////////
// The methods below use global state and we should stop using them.
// Fixtures above are preferred way of testing Components and Templates
///////////////////////////////////////////////////////////////////////////////////
exports.document = (typeof global == 'object' && global || window).document;
exports.containerEl = null;
var host;
var isRenderer2 = typeof process == 'object' && process.argv[3] && process.argv[3] === '--r=renderer2';
// tslint:disable-next-line:no-console
console.log("Running tests with " + (!isRenderer2 ? 'document' : 'Renderer2') + " renderer...");
var testRendererFactory = isRenderer2 ? imported_renderer2_1.getRendererFactory2(exports.document) : renderer_1.domRendererFactory3;
exports.requestAnimationFrame = function (fn) {
    exports.requestAnimationFrame.queue.push(fn);
};
exports.requestAnimationFrame.flush = function () {
    while (exports.requestAnimationFrame.queue.length) {
        exports.requestAnimationFrame.queue.shift()();
    }
};
function resetDOM() {
    exports.requestAnimationFrame.queue = [];
    if (exports.containerEl) {
        try {
            exports.document.body.removeChild(exports.containerEl);
        }
        catch (e) {
        }
    }
    exports.containerEl = exports.document.createElement('div');
    exports.containerEl.setAttribute('host', '');
    exports.document.body.appendChild(exports.containerEl);
    host = null;
    // TODO: assert that the global state is clean (e.g. ngData, previousOrParentNode, etc)
}
exports.resetDOM = resetDOM;
/**
 * @deprecated use `TemplateFixture` or `ComponentFixture`
 */
function renderToHtml(template, ctx, directives, pipes, providedRendererFactory) {
    host = instructions_1.renderTemplate(exports.containerEl, template, ctx, providedRendererFactory || testRendererFactory, host, toDefs(directives, definition_1.extractDirectiveDef), toDefs(pipes, definition_1.extractPipeDef));
    return toHtml(exports.containerEl);
}
exports.renderToHtml = renderToHtml;
function toDefs(types, mapFn) {
    if (!types)
        return null;
    if (typeof types == 'function') {
        types = types();
    }
    return types.map(mapFn);
}
beforeEach(resetDOM);
/**
 * @deprecated use `TemplateFixture` or `ComponentFixture`
 */
function renderComponent(type, opts) {
    return index_1.renderComponent(type, {
        rendererFactory: opts && opts.rendererFactory || testRendererFactory,
        host: exports.containerEl,
        scheduler: exports.requestAnimationFrame,
        sanitizer: opts ? opts.sanitizer : undefined,
        hostFeatures: opts && opts.hostFeatures
    });
}
exports.renderComponent = renderComponent;
/**
 * @deprecated use `TemplateFixture` or `ComponentFixture`
 */
function toHtml(componentOrElement) {
    var node = componentOrElement[instructions_1.NG_HOST_SYMBOL];
    if (node) {
        return toHtml(node.native);
    }
    else {
        return browser_util_1.stringifyElement(componentOrElement)
            .replace(/^<div host="">/, '')
            .replace(/^<div fixture="mark">/, '')
            .replace(/<\/div>$/, '')
            .replace(' style=""', '')
            .replace(/<!--container-->/g, '');
    }
}
exports.toHtml = toHtml;
function createComponent(name, template, directives, pipes, viewQuery) {
    if (directives === void 0) { directives = []; }
    if (pipes === void 0) { pipes = []; }
    if (viewQuery === void 0) { viewQuery = null; }
    var _a;
    return _a = /** @class */ (function () {
            function Component() {
            }
            return Component;
        }()),
        _a.ngComponentDef = index_1.defineComponent({
            type: _a,
            selectors: [[name]],
            factory: function () { return new _a; },
            template: template,
            viewQuery: viewQuery,
            features: [index_1.PublicFeature],
            directives: directives,
            pipes: pipes
        }),
        _a;
}
exports.createComponent = createComponent;
function createDirective(name, _a) {
    var exportAs = (_a === void 0 ? {} : _a).exportAs;
    var _b;
    return _b = /** @class */ (function () {
            function Directive() {
            }
            return Directive;
        }()),
        _b.ngDirectiveDef = index_1.defineDirective({
            type: _b,
            selectors: [['', name, '']],
            factory: function () { return new _b(); },
            features: [index_1.PublicFeature],
            exportAs: exportAs,
        }),
        _b;
}
exports.createDirective = createDirective;
// Verify that DOM is a type of render. This is here for error checking only and has no use.
exports.renderer = null;
exports.element = null;
exports.text = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuZGVyX3V0aWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb3JlL3Rlc3QvcmVuZGVyMy9yZW5kZXJfdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7QUFFSCxtRkFBb0Y7QUFJcEYsMkRBQWlGO0FBQ2pGLGlEQUF1TjtBQUN2TiwrREFBOEU7QUFHOUUsa0VBQXdIO0FBSXhILDJEQUF5RDtBQUV6RDtJQUdFO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxnQkFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRCxJQUFJLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUtELHNCQUFJLDZCQUFJO1FBSFI7O1dBRUc7YUFDSCxjQUFxQixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBNkIsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BQUE7SUFDM0Usa0JBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQVpxQixrQ0FBVztBQWNqQyxrQkFBaUIsQ0FBQztBQUNsQjs7Ozs7OztHQU9HO0FBQ0g7SUFBcUMsbUNBQVc7SUFPOUM7Ozs7OztPQU1HO0lBQ0gseUJBQ1ksV0FBdUIsRUFBVSxXQUE4QixFQUN2RSxVQUF5QyxFQUFFLEtBQStCLEVBQzFFLFNBQTBCLEVBQUUsZUFBa0M7UUFGckIsNEJBQUEsRUFBQSxrQkFBOEI7UUFEM0UsWUFJRSxpQkFBTyxTQWFSO1FBaEJXLGlCQUFXLEdBQVgsV0FBVyxDQUFZO1FBQVUsaUJBQVcsR0FBWCxXQUFXLENBQW1CO1FBSXpFLEtBQUksQ0FBQyxjQUFjLEdBQUcsTUFBTSxDQUFDLFVBQVUsRUFBRSxnQ0FBbUIsQ0FBQyxDQUFDO1FBQzlELEtBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSwyQkFBYyxDQUFD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