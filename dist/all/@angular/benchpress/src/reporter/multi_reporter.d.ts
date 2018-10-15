/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { MeasureValues } from '../measure_values';
import { Reporter } from '../reporter';
export declare class MultiReporter extends Reporter {
    private _reporters;
    static provideWith(childTokens: any[]): any[];
    constructor(_reporters: Reporter[]);
    reportMeasureValues(values: MeasureValues): Promise<any[]>;
    reportSample(completeSample: MeasureValues[], validSample: MeasureValues[]): Promise<any[]>;
}
