"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var testing_1 = require("@angular/core/testing");
var compiler_reflector_1 = require("@angular/platform-browser-dynamic/src/compiler_reflector");
var testing_2 = require("../testing");
{
    describe('MockPipeResolver', function () {
        var pipeResolver;
        beforeEach(testing_1.inject([core_1.Injector], function (injector) {
            pipeResolver = new testing_2.MockPipeResolver(new compiler_reflector_1.JitReflector());
        }));
        describe('Pipe overriding', function () {
            it('should fallback to the default PipeResolver when templates are not overridden', function () {
                var pipe = pipeResolver.resolve(SomePipe);
                expect(pipe.name).toEqual('somePipe');
            });
            it('should allow overriding the @Pipe', function () {
                pipeResolver.setPipe(SomePipe, new core_1.Pipe({ name: 'someOtherName' }));
                var pipe = pipeResolver.resolve(SomePipe);
                expect(pipe.name).toEqual('someOtherName');
            });
        });
    });
}
var SomePipe = /** @class */ (function () {
    function SomePipe() {
    }
    SomePipe = __decorate([
        core_1.Pipe({ name: 'somePipe' })
    ], SomePipe);
    return SomePipe;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9yZXNvbHZlcl9tb2NrX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L3BpcGVfcmVzb2x2ZXJfbW9ja19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7O0FBRUgsc0NBQTZDO0FBQzdDLGlEQUE2QztBQUM3QywrRkFBc0Y7QUFFdEYsc0NBQTRDO0FBRTVDO0lBQ0UsUUFBUSxDQUFDLGtCQUFrQixFQUFFO1FBQzNCLElBQUksWUFBOEIsQ0FBQztRQUVuQyxVQUFVLENBQUMsZ0JBQU0sQ0FBQyxDQUFDLGVBQVEsQ0FBQyxFQUFFLFVBQUMsUUFBa0I7WUFDL0MsWUFBWSxHQUFHLElBQUksMEJBQWdCLENBQUMsSUFBSSxpQ0FBWSxFQUFFLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRUosUUFBUSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLEVBQUUsQ0FBQywrRUFBK0UsRUFBRTtnQkFDbEYsSUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7WUFDeEMsQ0FBQyxDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7Z0JBQ3RDLFlBQVksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLElBQUksV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUMsQ0FBQztnQkFDbEUsSUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDN0MsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0NBQ0o7QUFHRDtJQUFBO0lBQ0EsQ0FBQztJQURLLFFBQVE7UUFEYixXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFDLENBQUM7T0FDbkIsUUFBUSxDQUNiO0lBQUQsZUFBQztDQUFBLEFBREQsSUFDQyJ9