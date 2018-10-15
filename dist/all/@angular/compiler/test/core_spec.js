"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var core = require("@angular/core");
{
    describe('compiler core', function () {
        it('Attribute should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.Attribute('someName'), compiler_1.core.createAttribute('someName'));
        });
        it('Inject should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.Inject('someName'), compiler_1.core.createInject('someName'));
        });
        it('Query should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.ContentChild('someSelector'), compiler_1.core.createContentChild('someSelector'));
            compareRuntimeShape(new core.ContentChild('someSelector', { read: 'someRead' }), compiler_1.core.createContentChild('someSelector', { read: 'someRead' }));
            compareRuntimeShape(new core.ContentChildren('someSelector'), compiler_1.core.createContentChildren('someSelector'));
            compareRuntimeShape(new core.ContentChildren('someSelector', { read: 'someRead', descendants: false }), compiler_1.core.createContentChildren('someSelector', { read: 'someRead', descendants: false }));
            compareRuntimeShape(new core.ViewChild('someSelector'), compiler_1.core.createViewChild('someSelector'));
            compareRuntimeShape(new core.ViewChild('someSelector', { read: 'someRead' }), compiler_1.core.createViewChild('someSelector', { read: 'someRead' }));
            compareRuntimeShape(new core.ViewChildren('someSelector'), compiler_1.core.createViewChildren('someSelector'));
            compareRuntimeShape(new core.ViewChildren('someSelector', { read: 'someRead' }), compiler_1.core.createViewChildren('someSelector', { read: 'someRead' }));
        });
        it('Directive should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.Directive({}), compiler_1.core.createDirective({}));
        });
        it('Component should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.Component({}), compiler_1.core.createComponent({}));
        });
        it('Pipe should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.Pipe({ name: 'someName' }), compiler_1.core.createPipe({ name: 'someName' }));
        });
        it('NgModule should be equal', function () {
            typeExtends();
            typeExtends();
            compareRuntimeShape(new core.NgModule({}), compiler_1.core.createNgModule({}));
        });
        it('marker metadata should be equal', function () {
            compareRuntimeShape(new core.Injectable(), compiler_1.core.createInjectable());
            compareRuntimeShape(new core.Optional(), compiler_1.core.createOptional());
            compareRuntimeShape(new core.Self(), compiler_1.core.createSelf());
            compareRuntimeShape(new core.SkipSelf(), compiler_1.core.createSkipSelf());
            compareRuntimeShape(new core.Host(), compiler_1.core.createHost());
        });
        it('InjectionToken should be equal', function () {
            compareRuntimeShape(new core.InjectionToken('someName'), compiler_1.core.createInjectionToken('someName'));
        });
        it('non const enums should be equal', function () {
            typeExtends();
            typeExtends();
            typeExtends();
            typeExtends();
            typeExtends();
            typeExtends();
            typeExtends();
            typeExtends();
        });
        it('const enums should be equal', function () {
            var expectToBe = function (val1, val2) { return expect(val1).toBe(val2); };
            expectToBe(0 /* None */, 0 /* None */);
            expectToBe(1 /* TypeElement */, 1 /* TypeElement */);
            expectToBe(2 /* TypeText */, 2 /* TypeText */);
            expectToBe(4 /* ProjectedTemplate */, 4 /* ProjectedTemplate */);
            expectToBe(3 /* CatRenderNode */, 3 /* CatRenderNode */);
            expectToBe(8 /* TypeNgContent */, 8 /* TypeNgContent */);
            expectToBe(16 /* TypePipe */, 16 /* TypePipe */);
            expectToBe(32 /* TypePureArray */, 32 /* TypePureArray */);
            expectToBe(64 /* TypePureObject */, 64 /* TypePureObject */);
            expectToBe(128 /* TypePurePipe */, 128 /* TypePurePipe */);
            expectToBe(224 /* CatPureExpression */, 224 /* CatPureExpression */);
            expectToBe(256 /* TypeValueProvider */, 256 /* TypeValueProvider */);
            expectToBe(512 /* TypeClassProvider */, 512 /* TypeClassProvider */);
            expectToBe(1024 /* TypeFactoryProvider */, 1024 /* TypeFactoryProvider */);
            expectToBe(2048 /* TypeUseExistingProvider */, 2048 /* TypeUseExistingProvider */);
            expectToBe(4096 /* LazyProvider */, 4096 /* LazyProvider */);
            expectToBe(8192 /* PrivateProvider */, 8192 /* PrivateProvider */);
            expectToBe(16384 /* TypeDirective */, 16384 /* TypeDirective */);
            expectToBe(32768 /* Component */, 32768 /* Component */);
            expectToBe(3840 /* CatProviderNoDirective */, 3840 /* CatProviderNoDirective */);
            expectToBe(20224 /* CatProvider */, 20224 /* CatProvider */);
            expectToBe(65536 /* OnInit */, 65536 /* OnInit */);
            expectToBe(131072 /* OnDestroy */, 131072 /* OnDestroy */);
            expectToBe(262144 /* DoCheck */, 262144 /* DoCheck */);
            expectToBe(524288 /* OnChanges */, 524288 /* OnChanges */);
            expectToBe(1048576 /* AfterContentInit */, 1048576 /* AfterContentInit */);
            expectToBe(2097152 /* AfterContentChecked */, 2097152 /* AfterContentChecked */);
            expectToBe(4194304 /* AfterViewInit */, 4194304 /* AfterViewInit */);
            expectToBe(8388608 /* AfterViewChecked */, 8388608 /* AfterViewChecked */);
            expectToBe(16777216 /* EmbeddedViews */, 16777216 /* EmbeddedViews */);
            expectToBe(33554432 /* ComponentView */, 33554432 /* ComponentView */);
            expectToBe(67108864 /* TypeContentQuery */, 67108864 /* TypeContentQuery */);
            expectToBe(134217728 /* TypeViewQuery */, 134217728 /* TypeViewQuery */);
            expectToBe(268435456 /* StaticQuery */, 268435456 /* StaticQuery */);
            expectToBe(536870912 /* DynamicQuery */, 536870912 /* DynamicQuery */);
            expectToBe(201326592 /* CatQuery */, 201326592 /* CatQuery */);
            expectToBe(201347067 /* Types */, 201347067 /* Types */);
            expectToBe(0 /* None */, 0 /* None */);
            expectToBe(1 /* SkipSelf */, 1 /* SkipSelf */);
            expectToBe(2 /* Optional */, 2 /* Optional */);
            expectToBe(8 /* Value */, 8 /* Value */);
            expectToBe(0 /* Default */, 0 /* Default */);
            expectToBe(4 /* SkipSelf */, 4 /* SkipSelf */);
            expectToBe(2 /* Self */, 2 /* Self */);
            expectToBe(0 /* Inline */, 0 /* Inline */);
            expectToBe(1 /* Dynamic */, 1 /* Dynamic */);
            expectToBe(1 /* TypeElementAttribute */, 1 /* TypeElementAttribute */);
            expectToBe(2 /* TypeElementClass */, 2 /* TypeElementClass */);
            expectToBe(4 /* TypeElementStyle */, 4 /* TypeElementStyle */);
            expectToBe(8 /* TypeProperty */, 8 /* TypeProperty */);
            expectToBe(16 /* SyntheticProperty */, 16 /* SyntheticProperty */);
            expectToBe(32 /* SyntheticHostProperty */, 32 /* SyntheticHostProperty */);
            expectToBe(48 /* CatSyntheticProperty */, 48 /* CatSyntheticProperty */);
            expectToBe(15 /* Types */, 15 /* Types */);
            expectToBe(0 /* First */, 0 /* First */);
            expectToBe(1 /* All */, 1 /* All */);
            expectToBe(0 /* ElementRef */, 0 /* ElementRef */);
            expectToBe(1 /* RenderElement */, 1 /* RenderElement */);
            expectToBe(2 /* TemplateRef */, 2 /* TemplateRef */);
            expectToBe(3 /* ViewContainerRef */, 3 /* ViewContainerRef */);
            expectToBe(4 /* Provider */, 4 /* Provider */);
            expectToBe(0 /* None */, 0 /* None */);
            expectToBe(2 /* OnPush */, 2 /* OnPush */);
        });
    });
}
function compareRuntimeShape(a, b) {
    var keys = metadataKeys(a);
    expect(keys).toEqual(metadataKeys(b));
    keys.forEach(function (key) { expect(a[key]).toBe(b[key]); });
    // Need to check 'ngMetadataName' separately, as this is
    // on the prototype in @angular/core, but a regular property in @angular/compiler.
    expect(a.ngMetadataName).toBe(b.ngMetadataName);
}
function metadataKeys(a) {
    return Object.keys(a).filter(function (prop) { return prop !== 'ngMetadataName' && !prop.startsWith('_'); }).sort();
}
function typeExtends() { }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvdGVzdC9jb3JlX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBdUQ7QUFDdkQsb0NBQXNDO0FBRXRDO0lBQ0UsUUFBUSxDQUFDLGVBQWUsRUFBRTtRQUN4QixFQUFFLENBQUMsMkJBQTJCLEVBQUU7WUFDOUIsV0FBVyxFQUEwQyxDQUFDO1lBQ3RELFdBQVcsRUFBMEMsQ0FBQztZQUN0RCxtQkFBbUIsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsZUFBWSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hHLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHdCQUF3QixFQUFFO1lBQzNCLFdBQVcsRUFBb0MsQ0FBQztZQUNoRCxXQUFXLEVBQW9DLENBQUM7WUFDaEQsbUJBQW1CLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLGVBQVksQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUMxRixDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx1QkFBdUIsRUFBRTtZQUMxQixXQUFXLEVBQWtDLENBQUM7WUFDOUMsV0FBVyxFQUFrQyxDQUFDO1lBQzlDLG1CQUFtQixDQUNmLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLENBQUMsRUFBRSxlQUFZLENBQUMsa0JBQWtCLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUM1RixtQkFBbUIsQ0FDZixJQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsY0FBYyxFQUFFLEVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBQyxDQUFDLEVBQ3pELGVBQVksQ0FBQyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsRUFBQyxJQUFJLEVBQUUs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