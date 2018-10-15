/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CssSelector } from './selector';
/**
 * @record
 */
export function Inject() { }
/** @type {?} */
Inject.prototype.token;
/** @type {?} */
export const createInject = makeMetadataFactory('Inject', (token) => ({ token }));
/** @type {?} */
export const createInjectionToken = makeMetadataFactory('InjectionToken', (desc) => ({ _desc: desc, ngInjectableDef: undefined }));
/**
 * @record
 */
export function Attribute() { }
/** @type {?|undefined} */
Attribute.prototype.attributeName;
/** @type {?} */
export const createAttribute = makeMetadataFactory('Attribute', (attributeName) => ({ attributeName }));
/**
 * @record
 */
export function Query() { }
/** @type {?} */
Query.prototype.descendants;
/** @type {?} */
Query.prototype.first;
/** @type {?} */
Query.prototype.read;
/** @type {?} */
Query.prototype.isViewQuery;
/** @type {?} */
Query.prototype.selector;
/** @type {?} */
export const createContentChildren = makeMetadataFactory('ContentChildren', (selector, data = {}) => (Object.assign({ selector, first: false, isViewQuery: false, descendants: false }, data)));
/** @type {?} */
export const createContentChild = makeMetadataFactory('ContentChild', (selector, data = {}) => (Object.assign({ selector, first: true, isViewQuery: false, descendants: true }, data)));
/** @type {?} */
export const createViewChildren = makeMetadataFactory('ViewChildren', (selector, data = {}) => (Object.assign({ selector, first: false, isViewQuery: true, descendants: true }, data)));
/** @type {?} */
export const createViewChild = makeMetadataFactory('ViewChild', (selector, data) => (Object.assign({ selector, first: true, isViewQuery: true, descendants: true }, data)));
/**
 * @record
 */
export function Directive() { }
/** @type {?|undefined} */
Directive.prototype.selector;
/** @type {?|undefined} */
Directive.prototype.inputs;
/** @type {?|undefined} */
Directive.prototype.outputs;
/** @type {?|undefined} */
Directive.prototype.host;
/** @type {?|undefined} */
Directive.prototype.providers;
/** @type {?|undefined} */
Directive.prototype.exportAs;
/** @type {?|undefined} */
Directive.prototype.queries;
/** @type {?|undefined} */
Directive.prototype.guards;
/** @type {?} */
export const createDirective = makeMetadataFactory('Directive', (dir = {}) => dir);
/**
 * @record
 */
export function Component() { }
/** @type {?|undefined} */
Component.prototype.changeDetection;
/** @type {?|undefined} */
Component.prototype.viewProviders;
/** @type {?|undefined} */
Component.prototype.moduleId;
/** @type {?|undefined} */
Component.prototype.templateUrl;
/** @type {?|undefined} */
Component.prototype.template;
/** @type {?|undefined} */
Component.prototype.styleUrls;
/** @type {?|undefined} */
Component.prototype.styles;
/** @type {?|undefined} */
Component.prototype.animations;
/** @type {?|undefined} */
Component.prototype.encapsulation;
/** @type {?|undefined} */
Component.prototype.interpolation;
/** @type {?|undefined} */
Component.prototype.entryComponents;
/** @type {?|undefined} */
Component.prototype.preserveWhitespaces;
/** @enum {number} */
const ViewEncapsulation = {
    Emulated: 0,
    Native: 1,
    None: 2,
    ShadowDom: 3,
};
export { ViewEncapsulation };
ViewEncapsulation[ViewEncapsulation.Emulated] = 'Emulated';
ViewEncapsulation[ViewEncapsulation.Native] = 'Native';
ViewEncapsulation[ViewEncapsulation.None] = 'None';
ViewEncapsulation[ViewEncapsulation.ShadowDom] = 'ShadowDom';
/** @enum {number} */
const ChangeDetectionStrategy = {
    OnPush: 0,
    Default: 1,
};
export { ChangeDetectionStrategy };
ChangeDetectionStrategy[ChangeDetectionStrategy.OnPush] = 'OnPush';
ChangeDetectionStrategy[ChangeDetectionStrategy.Default] = 'Default';
/** @type {?} */
export const createComponent = makeMetadataFactory('Component', (c = {}) => (Object.assign({ changeDetection: ChangeDetectionStrategy.Default }, c)));
/**
 * @record
 */
export function Pipe() { }
/** @type {?} */
Pipe.prototype.name;
/** @type {?|undefined} */
Pipe.prototype.pure;
/** @type {?} */
export const createPipe = makeMetadataFactory('Pipe', (p) => (Object.assign({ pure: true }, p)));
/**
 * @record
 */
export function Input() { }
/** @type {?|undefined} */
Input.prototype.bindingPropertyName;
/** @type {?} */
export const createInput = makeMetadataFactory('Input', (bindingPropertyName) => ({ bindingPropertyName }));
/**
 * @record
 */
export function Output() { }
/** @type {?|undefined} */
Output.prototype.bindingPropertyName;
/** @type {?} */
export const createOutput = makeMetadataFactory('Output', (bindingPropertyName) => ({ bindingPropertyName }));
/**
 * @record
 */
export function HostBinding() { }
/** @type {?|undefined} */
HostBinding.prototype.hostPropertyName;
/** @type {?} */
export const createHostBinding = makeMetadataFactory('HostBinding', (hostPropertyName) => ({ hostPropertyName }));
/**
 * @record
 */
export function HostListener() { }
/** @type {?|undefined} */
HostListener.prototype.eventName;
/** @type {?|undefined} */
HostListener.prototype.args;
/** @type {?} */
export const createHostListener = makeMetadataFactory('HostListener', (eventName, args) => ({ eventName, args }));
/**
 * @record
 */
export function NgModule() { }
/** @type {?|undefined} */
NgModule.prototype.providers;
/** @type {?|undefined} */
NgModule.prototype.declarations;
/** @type {?|undefined} */
NgModule.prototype.imports;
/** @type {?|undefined} */
NgModule.prototype.exports;
/** @type {?|undefined} */
NgModule.prototype.entryComponents;
/** @type {?|undefined} */
NgModule.prototype.bootstrap;
/** @type {?|undefined} */
NgModule.prototype.schemas;
/** @type {?|undefined} */
NgModule.prototype.id;
/** @type {?} */
export const createNgModule = makeMetadataFactory('NgModule', (ngModule) => ngModule);
/**
 * @record
 */
export function ModuleWithProviders() { }
/** @type {?} */
ModuleWithProviders.prototype.ngModule;
/** @type {?|undefined} */
ModuleWithProviders.prototype.providers;
/**
 * @record
 */
export function Injectable() { }
/** @type {?|undefined} */
Injectable.prototype.providedIn;
/** @type {?|undefined} */
Injectable.prototype.useClass;
/** @type {?|undefined} */
Injectable.prototype.useExisting;
/** @type {?|undefined} */
Injectable.prototype.useValue;
/** @type {?|undefined} */
Injectable.prototype.useFactory;
/** @type {?|undefined} */
Injectable.prototype.deps;
/** @type {?} */
export const createInjectable = makeMetadataFactory('Injectable', (injectable = {}) => injectable);
/**
 * @record
 */
export function SchemaMetadata() { }
/** @type {?} */
SchemaMetadata.prototype.name;
/** @type {?} */
export const CUSTOM_ELEMENTS_SCHEMA = {
    name: 'custom-elements'
};
/** @type {?} */
export const NO_ERRORS_SCHEMA = {
    name: 'no-errors-schema'
};
/** @type {?} */
export const createOptional = makeMetadataFactory('Optional');
/** @type {?} */
export const createSelf = makeMetadataFactory('Self');
/** @type {?} */
export const createSkipSelf = makeMetadataFactory('SkipSelf');
/** @type {?} */
export const createHost = makeMetadataFactory('Host');
/** @type {?} */
export const Type = Function;
/** @enum {number} */
const SecurityContext = {
    NONE: 0,
    HTML: 1,
    STYLE: 2,
    SCRIPT: 3,
    URL: 4,
    RESOURCE_URL: 5,
};
export { SecurityContext };
SecurityContext[SecurityContext.NONE] = 'NONE';
SecurityContext[SecurityContext.HTML] = 'HTML';
SecurityContext[SecurityContext.STYLE] = 'STYLE';
SecurityContext[SecurityContext.SCRIPT] = 'SCRIPT';
SecurityContext[SecurityContext.URL] = 'URL';
SecurityContext[SecurityContext.RESOURCE_URL] = 'RESOURCE_URL';
/** @typedef {?} */
var Provider;
export { Provider };
/** @enum {number} */
const NodeFlags = {
    None: 0,
    TypeElement: 1,
    TypeText: 2,
    ProjectedTemplate: 4,
    CatRenderNode: 3,
    TypeNgContent: 8,
    TypePipe: 16,
    TypePureArray: 32,
    TypePureObject: 64,
    TypePurePipe: 128,
    CatPureExpression: 224,
    TypeValueProvider: 256,
    TypeClassProvider: 512,
    TypeFactoryProvider: 1024,
    TypeUseExistingProvider: 2048,
    LazyProvider: 4096,
    PrivateProvider: 8192,
    TypeDirective: 16384,
    Component: 32768,
    CatProviderNoDirective: 3840,
    CatProvider: 20224,
    OnInit: 65536,
    OnDestroy: 131072,
    DoCheck: 262144,
    OnChanges: 524288,
    AfterContentInit: 1048576,
    AfterContentChecked: 2097152,
    AfterViewInit: 4194304,
    AfterViewChecked: 8388608,
    EmbeddedViews: 16777216,
    ComponentView: 33554432,
    TypeContentQuery: 67108864,
    TypeViewQuery: 134217728,
    StaticQuery: 268435456,
    DynamicQuery: 536870912,
    TypeModuleProvider: 1073741824,
    CatQuery: 201326592,
    // mutually exclusive values...
    Types: 201347067,
};
export { NodeFlags };
/** @enum {number} */
const DepFlags = {
    None: 0,
    SkipSelf: 1,
    Optional: 2,
    Self: 4,
    Value: 8,
};
export { DepFlags };
/** @enum {number} */
const InjectFlags = {
    Default: 0,
    /**
       * Specifies that an injector should retrieve a dependency from any injector until reaching the
       * host element of the current component. (Only used with Element Injector)
       */
    Host: 1,
    /** Don't descend into ancestors of the node requesting injection. */
    Self: 2,
    /** Skip the node that is requesting injection. */
    SkipSelf: 4,
    /** Inject `defaultValue` instead if token not found. */
    Optional: 8,
};
export { InjectFlags };
/** @enum {number} */
const ArgumentType = {
    Inline: 0, Dynamic: 1,
};
export { ArgumentType };
/** @enum {number} */
const BindingFlags = {
    TypeElementAttribute: 1,
    TypeElementClass: 2,
    TypeElementStyle: 4,
    TypeProperty: 8,
    SyntheticProperty: 16,
    SyntheticHostProperty: 32,
    CatSyntheticProperty: 48,
    // mutually exclusive values...
    Types: 15,
};
export { BindingFlags };
/** @enum {number} */
const QueryBindingType = {
    First: 0, All: 1,
};
export { QueryBindingType };
/** @enum {number} */
const QueryValueType = {
    ElementRef: 0,
    RenderElement: 1,
    TemplateRef: 2,
    ViewContainerRef: 3,
    Provider: 4,
};
export { QueryValueType };
/** @enum {number} */
const ViewFlags = {
    None: 0,
    OnPush: 2,
};
export { ViewFlags };
/** @enum {number} */
const MissingTranslationStrategy = {
    Error: 0,
    Warning: 1,
    Ignore: 2,
};
export { MissingTranslationStrategy };
MissingTranslationStrategy[MissingTranslationStrategy.Error] = 'Error';
MissingTranslationStrategy[MissingTranslationStrategy.Warning] = 'Warning';
MissingTranslationStrategy[MissingTranslationStrategy.Ignore] = 'Ignore';
/**
 * @record
 * @template T
 */
export function MetadataFactory() { }
/* TODO: handle strange member:
(...args: any[]): T;
*/
/** @type {?} */
MetadataFactory.prototype.isTypeOf;
/** @type {?} */
MetadataFactory.prototype.ngMetadataName;
/**
 * @template T
 * @param {?} name
 * @param {?=} props
 * @return {?}
 */
function makeMetadataFactory(name, props) {
    /** @type {?} */
    const factory = (...args) => {
        /** @type {?} */
        const values = props ? props(...args) : {};
        return Object.assign({ ngMetadataName: name }, values);
    };
    factory.isTypeOf = (obj) => obj && obj.ngMetadataName === name;
    factory.ngMetadataName = name;
    return factory;
}
/**
 * @record
 */
export function Route() { }
/** @type {?|undefined} */
Route.prototype.children;
/** @type {?|undefined} */
Route.prototype.loadChildren;
/** @enum {number} */
const SelectorFlags = {
    /** Indicates this is the beginning of a new negative selector */
    NOT: 1,
    /** Mode for matching attributes */
    ATTRIBUTE: 2,
    /** Mode for matching tag names */
    ELEMENT: 4,
    /** Mode for matching class names */
    CLASS: 8,
};
export { SelectorFlags };
/** @typedef {?} */
var R3CssSelector;
export { R3CssSelector };
/** @typedef {?} */
var R3CssSelectorList;
export { R3CssSelectorList };
/**
 * @param {?} selector
 * @return {?}
 */
function parserSelectorToSimpleSelector(selector) {
    /** @type {?} */
    const classes = selector.classNames && selector.classNames.length ?
        [8 /* CLASS */, ...selector.classNames] :
        [];
    /** @type {?} */
    const elementName = selector.element && selector.element !== '*' ? selector.element : '';
    return [elementName, ...selector.attrs, ...classes];
}
/**
 * @param {?} selector
 * @return {?}
 */
function parserSelectorToNegativeSelector(selector) {
    /** @type {?} */
    const classes = selector.classNames && selector.classNames.length ?
        [8 /* CLASS */, ...selector.classNames] :
        [];
    if (selector.element) {
        return [
            1 /* NOT */ | 4 /* ELEMENT */, selector.element, ...selector.attrs, ...classes
        ];
    }
    else if (selector.attrs.length) {
        return [1 /* NOT */ | 2 /* ATTRIBUTE */, ...selector.attrs, ...classes];
    }
    else {
        return selector.classNames && selector.classNames.length ?
            [1 /* NOT */ | 8 /* CLASS */, ...selector.classNames] :
            [];
    }
}
/**
 * @param {?} selector
 * @return {?}
 */
function parserSelectorToR3Selector(selector) {
    /** @type {?} */
    const positive = parserSelectorToSimpleSelector(selector);
    /** @type {?} */
    const negative = selector.notSelectors && selector.notSelectors.length ?
        selector.notSelectors.map(notSelector => parserSelectorToNegativeSelector(notSelector)) :
        [];
    return positive.concat(...negative);
}
/**
 * @param {?} selector
 * @return {?}
 */
export function parseSelectorToR3Selector(selector) {
    /** @type {?} */
    const selectors = CssSelector.parse(selector);
    return selectors.map(parserSelectorToR3Selector);
}
/** @enum {number} */
const RenderFlags = {
    /* Whether to run the creation block (e.g. create elements and directives) */
    Create: 1,
    /* Whether to run the update block (e.g. refresh bindings) */
    Update: 2,
};
export { RenderFlags };
/** @enum {number} */
const InitialStylingFlags = {
    VALUES_MODE: 1,
};
export { InitialStylingFlags };
//# sourceMappingURL=core.js.map