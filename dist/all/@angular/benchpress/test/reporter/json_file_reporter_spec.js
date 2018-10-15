"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var testing_internal_1 = require("@angular/core/testing/src/testing_internal");
var index_1 = require("../../index");
{
    testing_internal_1.describe('file reporter', function () {
        var loggedFile;
        function createReporter(_a) {
            var sampleId = _a.sampleId, descriptions = _a.descriptions, metrics = _a.metrics, path = _a.path;
            var providers = [
                index_1.JsonFileReporter.PROVIDERS, {
                    provide: index_1.SampleDescription,
                    useValue: new index_1.SampleDescription(sampleId, descriptions, metrics)
                },
                { provide: index_1.JsonFileReporter.PATH, useValue: path },
                { provide: index_1.Options.NOW, useValue: function () { return new Date(1234); } }, {
                    provide: index_1.Options.WRITE_FILE,
                    useValue: function (filename, content) {
                        loggedFile = { 'filename': filename, 'content': content };
                        return Promise.resolve(null);
                    }
                }
            ];
            return index_1.Injector.create(providers).get(index_1.JsonFileReporter);
        }
        testing_internal_1.it('should write all data into a file', testing_internal_1.inject([testing_internal_1.AsyncTestCompleter], function (async) {
            createReporter({
                sampleId: 'someId',
                descriptions: [{ 'a': 2 }],
                path: 'somePath',
                metrics: { 'a': 'script time', 'b': 'render time' }
            })
                .reportSample([mv(0, 0, { 'a': 3, 'b': 6 })], [mv(0, 0, { 'a': 3, 'b': 6 }), mv(1, 1, { 'a': 5, 'b': 9 })]);
            var regExp = /somePath\/someId_\d+\.json/;
            testing_internal_1.expect(loggedFile['filename'].match(regExp) != null).toBe(true);
            var parsedContent = JSON.parse(loggedFile['content']);
            testing_internal_1.expect(parsedContent).toEqual({
                'description': {
                    'id': 'someId',
                    'description': { 'a': 2 },
                    'metrics': { 'a': 'script time', 'b': 'render time' }
                },
                'stats': { 'a': '4.00+-25%', 'b': '7.50+-20%' },
                'completeSample': [
                    { 'timeStamp': '1970-01-01T00:00:00.000Z', 'runIndex': 0, 'values': { 'a': 3, 'b': 6 } }
                ],
                'validSample': [
                    { 'timeStamp': '1970-01-01T00:00:00.000Z', 'runIndex': 0, 'values': { 'a': 3, 'b': 6 } }, {
                        'timeStamp': '1970-01-01T00:00:00.001Z',
                        'runIndex': 1,
                        'values': { 'a': 5, 'b': 9 }
                    }
                ]
            });
            async.done();
        }));
    });
}
function mv(runIndex, time, values) {
    return new index_1.MeasureValues(runIndex, new Date(time), values);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbl9maWxlX3JlcG9ydGVyX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9iZW5jaHByZXNzL3Rlc3QvcmVwb3J0ZXIvanNvbl9maWxlX3JlcG9ydGVyX3NwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwrRUFBNEc7QUFFNUcscUNBQWtHO0FBRWxHO0lBQ0UsMkJBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsSUFBSSxVQUFlLENBQUM7UUFFcEIsd0JBQXdCLEVBS3ZCO2dCQUx3QixzQkFBUSxFQUFFLDhCQUFZLEVBQUUsb0JBQU8sRUFBRSxjQUFJO1lBTTVELElBQU0sU0FBUyxHQUFHO2dCQUNoQix3QkFBZ0IsQ0FBQyxTQUFTLEVBQUU7b0JBQzFCLE9BQU8sRUFBRSx5QkFBaUI7b0JBQzFCLFFBQVEsRUFBRSxJQUFJLHlCQUFpQixDQUFDLFFBQVEsRUFBRSxZQUFZLEVBQUUsT0FBTyxDQUFDO2lCQUNqRTtnQkFDRCxFQUFDLE9BQU8sRUFBRSx3QkFBZ0IsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztnQkFDaEQsRUFBQyxPQUFPLEVBQUUsZUFBTyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsY0FBTSxPQUFBLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFkLENBQWMsRUFBQyxFQUFFO29CQUN0RCxPQUFPLEVBQUUsZUFBTyxDQUFDLFVBQVU7b0JBQzNCLFFBQVEsRUFBRSxVQUFDLFFBQWdCLEVBQUUsT0FBZTt3QkFDMUMsVUFBVSxHQUFHLEVBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUM7d0JBQ3hELE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDL0IsQ0FBQztpQkFDRjthQUNGLENBQUM7WUFDRixPQUFPLGdCQUFRLENBQUMsTUFBTSxDQUFDLFNB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