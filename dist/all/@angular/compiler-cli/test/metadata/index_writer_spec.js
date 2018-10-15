"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var bundler_1 = require("../../src/metadata/bundler");
var index_writer_1 = require("../../src/metadata/index_writer");
var bundler_spec_1 = require("./bundler_spec");
describe('index_writer', function () {
    it('should be able to write the index of a simple library', function () {
        var host = new bundler_spec_1.MockStringBundlerHost('/', bundler_spec_1.SIMPLE_LIBRARY);
        var bundler = new bundler_1.MetadataBundler('/lib/index', undefined, host);
        var bundle = bundler.getMetadataBundle();
        var result = index_writer_1.privateEntriesToIndex('./index', bundle.privates);
        expect(result).toContain("export * from './index';");
        expect(result).toContain("export {PrivateOne as \u0275a} from './src/one';");
        expect(result).toContain("export {PrivateTwo as \u0275b} from './src/two/index';");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXhfd3JpdGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci1jbGkvdGVzdC9tZXRhZGF0YS9pbmRleF93cml0ZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHNEQUEyRDtBQUUzRCxnRUFBc0U7QUFFdEUsK0NBQXFFO0FBRXJFLFFBQVEsQ0FBQyxjQUFjLEVBQUU7SUFDdkIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1FBQzFELElBQU0sSUFBSSxHQUFHLElBQUksb0NBQXFCLENBQUMsR0FBRyxFQUFFLDZCQUFjLENBQUMsQ0FBQztRQUM1RCxJQUFNLE9BQU8sR0FBRyxJQUFJLHlCQUFlLENBQUMsWUFBWSxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNuRSxJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUMzQyxJQUFNLE1BQU0sR0FBRyxvQ0FBcUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsQ0FBQztRQUNyRCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLGtEQUE2QyxDQUFDLENBQUM7UUFDeEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyx3REFBbUQsQ0FBQyxDQUFDO0lBQ2hGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==