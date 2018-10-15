"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var generator_1 = require("../src/generator");
var mock_1 = require("../testing/mock");
{
    describe('Generator', function () {
        it('generates a correct config', function (done) {
            var fs = new mock_1.MockFilesystem({
                '/index.html': 'This is a test',
                '/main.css': 'This is a CSS file',
                '/main.js': 'This is a JS file',
                '/main.ts': 'This is a TS file',
                '/test.txt': 'Another test',
                '/foo/test.html': 'Another test',
                '/ignored/x.html': 'should be ignored',
            });
            var gen = new generator_1.Generator(fs, '/test');
            var res = gen.process({
                appData: {
                    test: true,
                },
                index: '/index.html',
                assetGroups: [{
                        name: 'test',
                        resources: {
                            files: [
                                '/**/*.html',
                                '/**/*.?s',
                                '!/ignored/**',
                            ],
                            versionedFiles: [
                                '/**/*.txt',
                            ],
                            urls: [
                                '/absolute/**',
                                '/some/url?with+escaped+chars',
                                'relative/*.txt',
                            ]
                        }
                    }],
                dataGroups: [{
                        name: 'other',
                        urls: [
                            '/api/**',
                            'relapi/**',
                            'https://example.com/**/*?with+escaped+chars',
                        ],
                        cacheConfig: {
                            maxSize: 100,
                            maxAge: '3d',
                            timeout: '1m',
                        }
                    }],
                navigationUrls: [
                    '/included/absolute/**',
                    '!/excluded/absolute/**',
                    '/included/some/url/with+escaped+chars',
                    '!excluded/relative/*.txt',
                    '!/api/?*',
                    'http://example.com/included',
                    '!http://example.com/excluded',
                ],
            });
            res.then(function (config) {
                expect(config).toEqual({
                    configVersion: 1,
                    appData: {
                        test: true,
                    },
                    index: '/test/index.html',
                    assetGroups: [{
                            name: 'test',
                            installMode: 'prefetch',
                            updateMode: 'prefetch',
                            urls: [
                                '/test/foo/test.html',
                                '/test/index.html',
                                '/test/main.js',
                                '/test/main.ts',
                                '/test/test.txt',
                            ],
                            patterns: [
                                '\\/absolute\\/.*',
                                '\\/some\\/url\\?with\\+escaped\\+chars',
                                '\\/test\\/relative\\/[^/]*\\.txt',
                            ]
                        }],
                    dataGroups: [{
                            name: 'other',
                            patterns: [
                                '\\/api\\/.*',
                                '\\/test\\/relapi\\/.*',
                                'https:\\/\\/example\\.com\\/(?:.+\\/)?[^/]*\\?with\\+escaped\\+chars',
                            ],
                            strategy: 'performance',
                            maxSize: 100,
                            maxAge: 259200000,
                            timeoutMs: 60000,
                            version: 1,
                        }],
                    navigationUrls: [
                        { positive: true, regex: '^\\/included\\/absolute\\/.*$' },
                        { positive: false, regex: '^\\/excluded\\/absolute\\/.*$' },
                        { positive: true, regex: '^\\/included\\/some\\/url\\/with\\+escaped\\+chars$' },
                        { positive: false, regex: '^\\/test\\/excluded\\/relative\\/[^/]*\\.txt$' },
                        { positive: false, regex: '^\\/api\\/[^/][^/]*$' },
                        { positive: true, regex: '^http:\\/\\/example\\.com\\/included$' },
                        { positive: false, regex: '^http:\\/\\/example\\.com\\/excluded$' },
                    ],
                    hashTable: {
                        '/test/foo/test.html': '18f6f8eb7b1c23d2bb61bff028b83d867a9e4643',
                        '/test/index.html': 'a54d88e06612d820bc3be72877c74f257b561b19',
                        '/test/main.js': '41347a66676cdc0516934c76d9d13010df420f2c',
                        '/test/main.ts': '7d333e31f0bfc4f8152732bb211a93629484c035',
                        '/test/test.txt': '18f6f8eb7b1c23d2bb61bff028b83d867a9e4643'
                    }
                });
                done();
            })
                .catch(function (err) { return done.fail(err); });
        });
        it('uses default `navigationUrls` if not provided', function (done) {
            var fs = new mock_1.MockFilesystem({
                '/index.html': 'This is a test',
            });
            var gen = new generator_1.Generator(fs, '/test');
            var res = gen.process({
                index: '/index.html',
            });
            res.then(function (config) {
                expect(config).toEqual({
                    configVersion: 1,
                    appData: undefined,
                    index: '/test/index.html',
                    assetGroups: [],
                    dataGroups: [],
                    navigationUrls: [
                        { positive: true, regex: '^\\/.*$' },
                        { positive: false, regex: '^\\/(?:.+\\/)?[^/]*\\.[^/]*$' },
                        { positive: false, regex: '^\\/(?:.+\\/)?[^/]*__[^/]*$' },
                        { positive: false, regex: '^\\/(?:.+\\/)?[^/]*__[^/]*\\/.*$' },
                    ],
                    hashTable: {}
                });
                done();
            })
                .catch(function (err) { return done.fail(err); });
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdG9yX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9zZXJ2aWNlLXdvcmtlci9jb25maWcvdGVzdC9nZW5lcmF0b3Jfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUEyQztBQUMzQyx3Q0FBK0M7QUFFL0M7SUFDRSxRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLEVBQUUsQ0FBQyw0QkFBNEIsRUFBRSxVQUFBLElBQUk7WUFDbkMsSUFBTSxFQUFFLEdBQUcsSUFBSSxxQkFBYyxDQUFDO2dCQUM1QixhQUFhLEVBQUUsZ0JBQWdCO2dCQUMvQixXQUFXLEVBQUUsb0JBQW9CO2dCQUNqQyxVQUFVLEVBQUUsbUJBQW1CO2dCQUMvQixVQUFVLEVBQUUsbUJBQW1CO2dCQUMvQixXQUFXLEVBQUUsY0FBYztnQkFDM0IsZ0JBQWdCLEVBQUUsY0FBYztnQkFDaEMsaUJBQWlCLEVBQUUsbUJBQW1CO2FBQ3ZDLENBQUMsQ0FBQztZQUNILElBQU0sR0FBRyxHQUFHLElBQUkscUJBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDdkMsSUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQztnQkFDdEIsT0FBTyxFQUFFO29CQUNQLElBQUksRUFBRSxJQUFJO2lCQUNYO2dCQUNELEtBQUssRUFBRSxhQUFhO2dCQUNwQixXQUFXLEVBQUUsQ0FBQzt3QkFDWixJQUFJLEVBQUUsTUFBTTt3QkFDWixTQUFTLEVBQUU7NEJBQ1QsS0FBSyxFQUFFO2dDQUNMLFlBQVk7Z0NBQ1osVUFBVTtnQ0FDVixjQUFjOzZCQUNmOzRCQUNELGNBQWMsRUFBRTtnQ0FDZCxXQUFXOzZCQUNaOzRCQUNELElBQUksRUFBRTtnQ0FDSixjQUFjO2dDQUNkLDhCQUE4QjtnQ0FDOUIsZ0JBQWdCOzZCQUNqQjt5QkFDRjtxQkFDRixDQUFDO2dCQUNGLFVBQVUs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