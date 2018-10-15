/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injector } from '../../src/di/injector';
import { CreateComponentOptions } from '../../src/render3/component';
import { ComponentTemplate, ComponentType, DirectiveType } from '../../src/render3/index';
import { DirectiveTypesOrFactory, PipeTypesOrFactory } from '../../src/render3/interfaces/definition';
import { LElementNode } from '../../src/render3/interfaces/node';
import { RElement, RText, Renderer3, RendererFactory3 } from '../../src/render3/interfaces/renderer';
import { Sanitizer } from '../../src/sanitization/security';
export declare abstract class BaseFixture {
    hostElement: HTMLElement;
    constructor();
    /**
     * Current state of rendered HTML.
     */
    readonly html: string;
}
/**
 * Fixture for testing template functions in a convenient way.
 *
 * This fixture allows:
 * - specifying the creation block and update block as two separate functions,
 * - maintaining the template state between invocations,
 * - access to the render `html`.
 */
export declare class TemplateFixture extends BaseFixture {
    private createBlock;
    private updateBlock;
    hostNode: LElementNode;
    private _directiveDefs;
    private _pipeDefs;
    private _sanitizer;
    private _rendererFactory;
    /**
     *
     * @param createBlock Instructions which go into the creation block:
     *          `if (rf & RenderFlags.Create) { __here__ }`.
     * @param updateBlock Optional instructions which go into the update block:
     *          `if (rf & RenderFlags.Update) { __here__ }`.
     */
    constructor(createBlock: () => void, updateBlock?: () => void, directives?: DirectiveTypesOrFactory | null, pipes?: PipeTypesOrFactory | null, sanitizer?: Sanitizer | null, rendererFactory?: RendererFactory3);
    /**
     * Update the existing template
     *
     * @param updateBlock Optional update block.
     */
    update(updateBlock?: () => void): void;
}
/**
 * Fixture for testing Components in a convenient way.
 */
export declare class ComponentFixture<T> extends BaseFixture {
    private componentType;
    component: T;
    requestAnimationFrame: {
        (fn: () => void): void;
        flush(): void;
        queue: (() => void)[];
    };
    constructor(componentType: ComponentType<T>, opts?: {
        injector?: Injector;
        sanitizer?: Sanitizer;
        rendererFactory?: RendererFactory3;
    });
    update(): void;
}
export declare const document: any;
export declare let containerEl: HTMLElement;
export declare const requestAnimationFrame: {
    (fn: () => void): void;
    flush(): void;
    queue: (() => void)[];
};
export declare function resetDOM(): void;
/**
 * @deprecated use `TemplateFixture` or `ComponentFixture`
 */
export declare function renderToHtml(template: ComponentTemplate<any>, ctx: any, directives?: DirectiveTypesOrFactory | null, pipes?: PipeTypesOrFactory | null, providedRendererFactory?: RendererFactory3 | null): string;
/**
 * @deprecated use `TemplateFixture` or `ComponentFixture`
 */
export declare function renderComponent<T>(type: ComponentType<T>, opts?: CreateComponentOptions): T;
/**
 * @deprecated use `TemplateFixture` or `ComponentFixture`
 */
export declare function toHtml<T>(componentOrElement: T | RElement): string;
export declare function createComponent(name: string, template: ComponentTemplate<any>, directives?: DirectiveTypesOrFactory, pipes?: PipeTypesOrFactory, viewQuery?: ComponentTemplate<any> | null): ComponentType<any>;
export declare function createDirective(name: string, { exportAs }?: {
    exportAs?: string;
}): DirectiveType<any>;
export declare const renderer: Renderer3;
export declare const element: RElement;
export declare const text: RText;
