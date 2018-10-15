/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { RendererFactory2 } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser/src/dom/events/event_manager';
export declare class SimpleDomEventsPlugin extends EventManagerPlugin {
    constructor(doc: any);
    supports(eventName: string): boolean;
    addEventListener(element: HTMLElement, eventName: string, handler: Function): Function;
    removeEventListener(target: any, eventName: string, callback: Function): void;
}
export declare function getRendererFactory2(document: any): RendererFactory2;
export declare function getAnimationRendererFactory2(document: any): RendererFactory2;
export declare class RenderLog {
    log: string[];
    loggedValues: any[];
    setElementProperty(el: any, propName: string, propValue: any): void;
    setText(node: any, value: string): void;
    clear(): void;
}
/**
 * This function patches the DomRendererFactory2 so that it returns a DefaultDomRenderer2
 * which logs some of the DOM operations through a RenderLog instance.
 */
export declare function patchLoggingRenderer2(rendererFactory: RendererFactory2, log: RenderLog): void;
