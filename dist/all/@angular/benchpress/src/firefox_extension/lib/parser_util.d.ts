/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @param {Object} perfProfile The perf profile JSON object.
 * @return {Object[]} An array of recognized events that are captured
 *     within the perf profile.
 */
export declare function convertPerfProfileToEvents(perfProfile: any): any[];
export declare function categorizeEvent(eventName: string): string;
