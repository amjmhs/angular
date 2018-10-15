"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var dom_adapter_1 = require("@angular/platform-browser/src/dom/dom_adapter");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
{
    describe('Meta service', function () {
        var doc;
        var metaService;
        var defaultMeta;
        beforeEach(function () {
            doc = dom_adapter_1.getDOM().createHtmlDocument();
            metaService = new platform_browser_1.Meta(doc);
            defaultMeta = dom_adapter_1.getDOM().createElement('meta', doc);
            dom_adapter_1.getDOM().setAttribute(defaultMeta, 'property', 'fb:app_id');
            dom_adapter_1.getDOM().setAttribute(defaultMeta, 'content', '123456789');
            dom_adapter_1.getDOM().appendChild(dom_adapter_1.getDOM().getElementsByTagName(doc, 'head')[0], defaultMeta);
        });
        afterEach(function () { return dom_adapter_1.getDOM().remove(defaultMeta); });
        it('should return meta tag matching selector', function () {
            var actual = metaService.getTag('property="fb:app_id"');
            matchers_1.expect(actual).not.toBeNull();
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual, 'content')).toEqual('123456789');
        });
        it('should return all meta tags matching selector', function () {
            var tag1 = metaService.addTag({ name: 'author', content: 'page author' });
            var tag2 = metaService.addTag({ name: 'author', content: 'another page author' });
            var actual = metaService.getTags('name=author');
            matchers_1.expect(actual.length).toEqual(2);
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual[0], 'content')).toEqual('page author');
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual[1], 'content')).toEqual('another page author');
            // clean up
            metaService.removeTagElement(tag1);
            metaService.removeTagElement(tag2);
        });
        it('should return null if meta tag does not exist', function () {
            var actual = metaService.getTag('fake=fake');
            matchers_1.expect(actual).toBeNull();
        });
        it('should remove meta tag by the given selector', function () {
            var selector = 'name=author';
            matchers_1.expect(metaService.getTag(selector)).toBeNull();
            metaService.addTag({ name: 'author', content: 'page author' });
            matchers_1.expect(metaService.getTag(selector)).not.toBeNull();
            metaService.removeTag(selector);
            matchers_1.expect(metaService.getTag(selector)).toBeNull();
        });
        it('should remove meta tag by the given element', function () {
            var selector = 'name=keywords';
            matchers_1.expect(metaService.getTag(selector)).toBeNull();
            metaService.addTags([{ name: 'keywords', content: 'meta test' }]);
            var meta = metaService.getTag(selector);
            matchers_1.expect(meta).not.toBeNull();
            metaService.removeTagElement(meta);
            matchers_1.expect(metaService.getTag(selector)).toBeNull();
        });
        it('should update meta tag matching the given selector', function () {
            var selector = 'property="fb:app_id"';
            metaService.updateTag({ content: '4321' }, selector);
            var actual = metaService.getTag(selector);
            matchers_1.expect(actual).not.toBeNull();
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual, 'content')).toEqual('4321');
        });
        it('should extract selector from the tag definition', function () {
            var selector = 'property="fb:app_id"';
            metaService.updateTag({ property: 'fb:app_id', content: '666' });
            var actual = metaService.getTag(selector);
            matchers_1.expect(actual).not.toBeNull();
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual, 'content')).toEqual('666');
        });
        it('should create meta tag if it does not exist', function () {
            var selector = 'name="twitter:title"';
            metaService.updateTag({ name: 'twitter:title', content: 'Content Title' }, selector);
            var actual = metaService.getTag(selector);
            matchers_1.expect(actual).not.toBeNull();
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual, 'content')).toEqual('Content Title');
            // clean up
            metaService.removeTagElement(actual);
        });
        it('should add new meta tag', function () {
            var selector = 'name="og:title"';
            matchers_1.expect(metaService.getTag(selector)).toBeNull();
            metaService.addTag({ name: 'og:title', content: 'Content Title' });
            var actual = metaService.getTag(selector);
            matchers_1.expect(actual).not.toBeNull();
            matchers_1.expect(dom_adapter_1.getDOM().getAttribute(actual, 'content')).toEqual('Content Title');
            // clean up
            metaService.removeTagElement(actual);
        });
        it('should add multiple new meta tags', function () {
            var nameSelector = 'name="twitter:title"';
            var propertySelector = 'property="og:title"';
            matchers_1.expect(metaService.getTag(nameSelector)).toBeNull();
            matchers_1.expect(metaService.getTag(propertySelector)).toBeNull();
            metaService.addTags([
                { name: 'twitter:title', content: 'Content Title' },
                { property: 'og:title', content: 'Content Title' }
            ]);
            var twitterMeta = metaService.getTag(nameSelector);
            var fbMeta = metaService.getTag(propertySelector);
            matchers_1.expect(twitterMeta).not.toBeNull();
            matchers_1.expect(fbMeta).not.toBeNull();
            // clean up
            metaService.removeTagElement(twitterMeta);
            metaService.removeTagElement(fbMeta);
        });
        it('should not add meta tag if it is already present on the page and has the same attr', function () {
            var selector = 'property="fb:app_id"';
            matchers_1.expect(metaService.getTags(selector).length).toEqual(1);
            metaService.addTag({ property: 'fb:app_id', content: '123456789' });
            matchers_1.expect(metaService.getTags(selector).length).toEqual(1);
        });
        it('should add meta tag if it is already present on the page and but has different attr', function () {
            var selector = 'property="fb:app_id"';
            matchers_1.expect(metaService.getTags(selector).length).toEqual(1);
            var meta = metaService.addTag({ property: 'fb:app_id', content: '666' });
            matchers_1.expect(metaService.getTags(selector).length).toEqual(2);
            // clean up
            metaService.removeTagElement(meta);
        });
        it('should add meta tag if it is already present on the page and force true', function () {
            var selector = 'property="fb:app_id"';
            matchers_1.expect(metaService.getTags(selector).length).toEqual(1);
            var meta = metaService.addTag({ property: 'fb:app_id', content: '123456789' }, true);
            matchers_1.expect(metaService.getTags(selector).length).toEqual(2);
            // clean up
            metaService.removeTagElement(meta);
        });
    });
    describe('integration test', function () {
        var DependsOnMeta = /** @class */ (function () {
            function DependsOnMeta(meta) {
                this.meta = meta;
            }
            DependsOnMeta = __decorate([
                core_1.Injectable(),
                __metadata("design:paramtypes", [platform_browser_1.Meta])
            ], DependsOnMeta);
            return DependsOnMeta;
        }());
        beforeEach(function () {
            testing_1.TestBed.configureTestingModule({
                imports: [platform_browser_1.BrowserModule],
                providers: [DependsOnMeta],
            });
        });
        it('should inject Meta service when using BrowserModule', function () { return matchers_1.expect(testing_1.TestBed.get(DependsOnMeta).meta).toBeAnInstanceOf(platform_browser_1.Meta); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0YV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci90ZXN0L2Jyb3dzZXIvbWV0YV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQXlDO0FBQ3pDLGlEQUE4QztBQUM5Qyw4REFBOEQ7QUFDOUQsNkVBQXFFO0FBQ3JFLDJFQUFzRTtBQUV0RTtJQUNFLFFBQVEsQ0FBQyxjQUFjLEVBQUU7UUFDdkIsSUFBSSxHQUFhLENBQUM7UUFDbEIsSUFBSSxXQUFpQixDQUFDO1FBQ3RCLElBQUksV0FBNEIsQ0FBQztRQUVqQyxVQUFVLENBQUM7WUFDVCxHQUFHLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGtCQUFrQixFQUFFLENBQUM7WUFDcEMsV0FBVyxHQUFHLElBQUksdUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixXQUFXLEdBQUcsb0JBQU0sRUFBRSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFvQixDQUFDO1lBQ3JFLG9CQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQVUsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM1RCxvQkFBTSxFQUFFLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsV0FBVyxDQUFDLENBQUM7WUFDM0Qsb0JBQU0sRUFBRSxDQUFDLFdBQVcsQ0FBQyxvQkFBTSxFQUFFLENBQUMsb0JBQW9CLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ25GLENBQUMsQ0FBQyxDQUFDO1FBRUgsU0FBUyxDQUFDLGNBQU0sT0FBQSxvQkFBTSxFQUFFLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxFQUE1QixDQUE0QixDQUFDLENBQUM7UUFFOUMsRUFBRSxDQUFDLDBDQUEwQyxF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