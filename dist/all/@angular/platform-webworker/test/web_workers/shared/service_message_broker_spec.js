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
var api_1 = require("@angular/platform-webworker/src/web_workers/shared/api");
var render_store_1 = require("@angular/platform-webworker/src/web_workers/shared/render_store");
var serializer_1 = require("@angular/platform-webworker/src/web_workers/shared/serializer");
var service_message_broker_1 = require("@angular/platform-webworker/src/web_workers/shared/service_message_broker");
var web_worker_test_util_1 = require("./web_worker_test_util");
{
    var CHANNEL_1 = 'UIMessageBroker Test Channel';
    var TEST_METHOD_1 = 'TEST_METHOD';
    var PASSED_ARG_1_1 = 5;
    var PASSED_ARG_2_1 = 'TEST';
    var RESULT_1 = 20;
    var ID_1 = 'methodId';
    testing_internal_1.beforeEachProviders(function () { return [serializer_1.Serializer, { provide: api_1.ON_WEB_WORKER, useValue: true }, render_store_1.RenderStore]; });
    testing_internal_1.describe('UIMessageBroker', function () {
        var messageBuses /** TODO #9100 */;
        testing_internal_1.beforeEach(function () {
            messageBuses = web_worker_test_util_1.createPairedMessageBuses();
            messageBuses.ui.initChannel(CHANNEL_1);
            messageBuses.worker.initChannel(CHANNEL_1);
        });
        testing_internal_1.it('should call registered method with correct arguments', testing_internal_1.inject([serializer_1.Serializer], function (serializer) {
            var broker = new service_message_broker_1.ServiceMessageBroker(messageBuses.ui, serializer, CHANNEL_1);
            broker.registerMethod(TEST_METHOD_1, [1 /* PRIMITIVE */, 1 /* PRIMITIVE */], function (arg1, arg2) {
                testing_internal_1.expect(arg1).toEqual(PASSED_ARG_1_1);
                testing_internal_1.expect(arg2).toEqual(PASSED_ARG_2_1);
            });
            messageBuses.worker.to(CHANNEL_1).emit({
                'method': TEST_METHOD_1,
                'args': [PASSED_ARG_1_1, PASSED_ARG_2_1],
            });
        }));
        testing_internal_1.it('should return promises to the worker', testing_internal_1.inject([serializer_1.Serializer], function (serializer) {
            var broker = new service_message_broker_1.ServiceMessageBroker(messageBuses.ui, serializer, CHANNEL_1);
            broker.registerMethod(TEST_METHOD_1, [1 /* PRIMITIVE */], function (arg1) {
                testing_internal_1.expect(arg1).toEqual(PASSED_ARG_1_1);
                return new Promise(function (res, rej) {
                    try {
                        res(RESULT_1);
                    }
                    catch (e) {
                        rej(e);
                    }
                });
            });
            messageBuses.worker.to(CHANNEL_1).emit({ 'method': TEST_METHOD_1, 'id': ID_1, 'args': [PASSED_ARG_1_1] });
            messageBuses.worker.from(CHANNEL_1).subscribe({
                next: function (data) {
                    testing_internal_1.expect(data.type).toEqual('result');
                    testing_internal_1.expect(data.id).toEqual(ID_1);
                    testing_internal_1.expect(data.value).toEqual(RESULT_1);
                },
            });
        }));
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZV9tZXNzYWdlX2Jyb2tlcl9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0td2Vid29ya2VyL3Rlc3Qvd2ViX3dvcmtlcnMvc2hhcmVkL3NlcnZpY2VfbWVzc2FnZV9icm9rZXJfc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILCtFQUF5SDtBQUN6SCw4RUFBcUY7QUFDckYsZ0dBQTRGO0FBQzVGLDRGQUEwRztBQUMxRyxvSEFBK0c7QUFFL0csK0RBQWdFO0FBRWhFO0lBQ0UsSUFBTSxTQUFPLEdBQUcsOEJBQThCLENBQUM7SUFDL0MsSUFBTSxhQUFXLEdBQUcsYUFBYSxDQUFDO0lBQ2xDLElBQU0sY0FBWSxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFNLGNBQVksR0FBRyxNQUFNLENBQUM7SUFDNUIsSUFBTSxRQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLElBQU0sSUFBRSxHQUFHLFVBQVUsQ0FBQztJQUV0QixzQ0FBbUIsQ0FBQyxjQUFNLE9BQUEsQ0FBQyx1QkFBVSxFQUFFLEVBQUMsT0FBTyxFQUFFLG1CQUFhLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFFLDBCQUFXLENBQUMsRUFBbkUsQ0FBbUUsQ0FBQyxDQUFDO0lBRS9GLDJCQUFRLENBQUMsaUJBQWlCLEVBQUU7UUFDMUIsSUFBSSxZQUFpQixDQUFDLGlCQUFpQixDQUFDO1FBRXhDLDZCQUFVLENBQUM7WUFDVCxZQUFZLEdBQUcsK0NBQXdCLEVBQUUsQ0FBQztZQUMxQyxZQUFZLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxTQUFPLENBQUMsQ0FBQztZQUNyQyxZQUFZLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFPLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQztRQUNILHFCQUFFLENBQUMsc0RBQXNELEVBQ3RELHlCQUFNLENBQUMsQ0FBQyx1QkFBVSxDQUFDLEVBQUUsVUFBQyxVQUFzQjtZQUMxQyxJQUFNLE1BQU0sR0FBRyxJQUFLLDZDQUE0QixDQUFDLFlBQVksQ0FBQyxFQUFFLEVBQUUsVUFBVSxFQUFFLFNBQU8sQ0FBQyxDQUFDO1lBQ3ZGLE1BQU0sQ0FBQyxjQUFjLENBQ2pCLGFBQVcsRUFBRSxzQ0FBc0QsRUFDbkUsVUFBQyxJQUFTLEVBQUUsSUFBUztnQkFDbkIseUJBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBWSxDQUFDLENBQUM7Z0JBQ25DLHlCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQVksQ0FBQyxDQUFDO1lBQ3JDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUNuQyxRQUFRLEVBQUUsYUFBVztnQkFDckIsTUFBTSxFQUFFLENBQUMsY0FBWSxFQUFFLGNBQVksQ0FBQzthQUNyQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRVAscUJBQUUsQ0FBQyxzQ0FBc0MsRUFBRSx5QkFBTSxDQUFDLENBQUMsdUJBQVUsQ0FBQyxFQUFFLFVBQUMsVUFBc0I7WUFDbEYsSUFBTSxNQUFNLEdBQUcsSUFBSyw2Q0FBNEIsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLFVBQVUsRUFBRSxTQUFPLENBQUMsQ0FBQztZQUN2RixNQUFNLENBQUMsY0FBYyxDQUFDLGFBQVcsRUFBRSxtQkFBMkIsRUFBRSxVQUFDLElBQVM7Z0JBQ3hFLHlCQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLGNBQVksQ0FBQyxDQUFDO2dCQUNuQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7b0JBQzFCLElBQUk7d0JBQ0YsR0FBRyxDQUFDLFFBQU0sQ0FBQyxDQUFDO3FCQUNiO29CQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNWLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztxQkFDUjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBTyxDQUFDLENBQUMsSUFBSSxDQUNoQyxFQUFDLFFBQVEsRUFBRSxhQUFXLEVBQUUsSUFBSSxFQUFFLElBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxjQUFZLENBQUMsRUFBQyxDQUFDLENBQUM7WUFDL0QsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUMxQyxJQUFJLEVBQUUsVUFBQyxJQUFTO29CQUNkLHlCQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDcEMseUJBQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUUsQ0FBQyxDQUFDO29CQUM1Qix5QkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBTSxDQUFDLENBQUM7Z0JBQ3JDLENBQUM7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9