/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CompilerHostAdapter, MetadataBundlerHost } from '../../src/metadata/bundler';
import { MetadataCollector } from '../../src/metadata/collector';
import { ModuleMetadata } from '../../src/metadata/schema';
import { Directory } from '../mocks';
export declare class MockStringBundlerHost implements MetadataBundlerHost {
    private dirName;
    collector: MetadataCollector;
    adapter: CompilerHostAdapter;
    constructor(dirName: string, directory: Directory);
    getMetadataFor(moduleName: string): ModuleMetadata | undefined;
}
export declare const SIMPLE_LIBRARY: {
    'lib': {
        'index.ts': string;
        'src': {
            'index.ts': string;
            'one.ts': string;
            'two': {
                'index.ts': string;
            };
        };
    };
};
export declare const SIMPLE_LIBRARY_WITH_IMPLIED_INDEX: {
    'lib': {
        'index.ts': string;
        'src': {
            'index.ts': string;
            'one.ts': string;
            'two': {
                'index.ts': string;
            };
        };
    };
};
