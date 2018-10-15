/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export declare function forceReflow(): void;
export declare function makeAnimationEvent(startOrEnd: 'start' | 'end', animationName: string, elapsedTime: number, timestamp?: number): AnimationEvent;
export declare function supportsAnimationEventCreation(): boolean;
export declare function findKeyframeDefinition(sheet: any): any | null;
export declare function createElement(): HTMLDivElement;
export declare function assertStyle(element: any, prop: string, value: string): void;
export declare function assertElementExistsInDom(element: any, yes?: boolean): void;
