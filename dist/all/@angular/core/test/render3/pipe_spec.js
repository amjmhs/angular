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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var matchers_1 = require("@angular/platform-browser/testing/src/matchers");
var definition_1 = require("../../src/render3/definition");
var instructions_1 = require("../../src/render3/instructions");
var pipe_1 = require("../../src/render3/pipe");
var imported_renderer2_1 = require("./imported_renderer2");
var render_util_1 = require("./render_util");
var log = [];
var person;
var renderLog = new imported_renderer2_1.RenderLog();
var rendererFactory2 = imported_renderer2_1.getRendererFactory2(document);
imported_renderer2_1.patchLoggingRenderer2(rendererFactory2, renderLog);
describe('pipe', function () {
    beforeEach(function () {
        log = [];
        renderLog.clear();
        person = new Person();
    });
    var pipes = function () { return [CountingPipe, MultiArgPipe, CountingImpurePipe]; };
    it('should support interpolation', function () {
        function Template(rf, person) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0);
                pipe_1.pipe(1, 'countingPipe');
                instructions_1.reserveSlots(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind1(1, 2, person.name), ''));
            }
        }
        person.init('bob', null);
        matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bob state:0');
    });
    it('should throw if pipe is not found', function () {
        var App = render_util_1.createComponent('app', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0);
                pipe_1.pipe(1, 'randomPipeName');
                instructions_1.reserveSlots(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind1(1, 2, ctx.value), ''));
            }
        }, [], pipes);
        matchers_1.expect(function () {
            var fixture = new render_util_1.ComponentFixture(App);
        }).toThrowError(/Pipe with name 'randomPipeName' not found!/);
    });
    it('should support bindings', function () {
        var directive = null;
        var MyDir = /** @class */ (function () {
            function MyDir() {
                this.dirProp = '';
            }
            MyDir_1 = MyDir;
            var MyDir_1;
            MyDir.ngDirectiveDef = definition_1.defineDirective({
                type: MyDir_1,
                selectors: [['', 'myDir', '']],
                factory: function () { return new MyDir_1(); },
                inputs: { dirProp: 'elprop' }
            });
            MyDir = MyDir_1 = __decorate([
                core_1.Directive({ selector: '[my-dir]', inputs: ['dirProp: elprop'], exportAs: 'mydir' }),
                __metadata("design:paramtypes", [])
            ], MyDir);
            return MyDir;
        }());
        var DoublePipe = /** @class */ (function () {
            function DoublePipe() {
            }
            DoublePipe_1 = DoublePipe;
            DoublePipe.prototype.transform = function (value) { return "" + value + value; };
            var DoublePipe_1;
            DoublePipe.ngPipeDef = definition_1.definePipe({
                name: 'double',
                type: DoublePipe_1,
                factory: function DoublePipe_Factory() { return new DoublePipe_1(); },
            });
            DoublePipe = DoublePipe_1 = __decorate([
                core_1.Pipe({ name: 'double' })
            ], DoublePipe);
            return DoublePipe;
        }());
        function Template(rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div', ['myDir', '']);
                pipe_1.pipe(1, 'double');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'elprop', instructions_1.bind(pipe_1.pipeBind1(1, 2, ctx)));
                directive = instructions_1.loadDirective(0);
            }
        }
        render_util_1.renderToHtml(Template, 'a', [MyDir], [DoublePipe]);
        matchers_1.expect(directive.dirProp).toEqual('aa');
    });
    it('should support arguments in pipes', function () {
        function Template(rf, person) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0);
                pipe_1.pipe(1, 'multiArgPipe');
                instructions_1.reserveSlots(4);
            }
            if (rf & 2 /* Update */) {
                instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind3(1, 4, person.name, 'one', person.address.city), ''));
            }
        }
        person.init('value', new Address('two'));
        matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('value one two default');
    });
    it('should support calling pipes with different number of arguments', function () {
        function Template(rf, person) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0);
                pipe_1.pipe(1, 'multiArgPipe');
                pipe_1.pipe(2, 'multiArgPipe');
                instructions_1.reserveSlots(9);
            }
            if (rf & 2 /* Update */) {
                instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind4(2, 9, pipe_1.pipeBindV(1, 4, [person.name, 'a', 'b']), 0, 1, 2), ''));
            }
        }
        person.init('value', null);
        matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('value a b default 0 1 2');
    });
    it('should do nothing when no change', function () {
        var IdentityPipe = /** @class */ (function () {
            function IdentityPipe() {
            }
            IdentityPipe_1 = IdentityPipe;
            IdentityPipe.prototype.transform = function (value) { return value; };
            var IdentityPipe_1;
            IdentityPipe.ngPipeDef = definition_1.definePipe({
                name: 'identityPipe',
                type: IdentityPipe_1,
                factory: function IdentityPipe_Factory() { return new IdentityPipe_1(); },
            });
            IdentityPipe = IdentityPipe_1 = __decorate([
                core_1.Pipe({ name: 'identityPipe' })
            ], IdentityPipe);
            return IdentityPipe;
        }());
        function Template(rf, person) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'div');
                pipe_1.pipe(1, 'identityPipe');
                instructions_1.elementEnd();
                instructions_1.reserveSlots(2);
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(0, 'someProp', instructions_1.bind(pipe_1.pipeBind1(1, 2, 'Megatron')));
            }
        }
        render_util_1.renderToHtml(Template, person, null, [IdentityPipe], rendererFactory2);
        matchers_1.expect(renderLog.log).toEqual(['someProp=Megatron']);
        renderLog.clear();
        render_util_1.renderToHtml(Template, person, null, pipes, rendererFactory2);
        matchers_1.expect(renderLog.log).toEqual([]);
    });
    describe('pure', function () {
        it('should call pure pipes only if the arguments change', function () {
            function Template(rf, person) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                    pipe_1.pipe(1, 'countingPipe');
                    instructions_1.reserveSlots(2);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind1(1, 2, person.name), ''));
                }
            }
            // change from undefined -> null
            person.name = null;
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('null state:0');
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('null state:0');
            // change from null -> some value
            person.name = 'bob';
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bob state:1');
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bob state:1');
            // change from some value -> some other value
            person.name = 'bart';
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bart state:2');
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bart state:2');
        });
    });
    describe('impure', function () {
        it('should call impure pipes on each change detection run', function () {
            function Template(rf, person) {
                if (rf & 1 /* Create */) {
                    instructions_1.text(0);
                    pipe_1.pipe(1, 'countingImpurePipe');
                    instructions_1.reserveSlots(2);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind1(1, 2, person.name), ''));
                }
            }
            person.name = 'bob';
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bob state:0');
            matchers_1.expect(render_util_1.renderToHtml(Template, person, null, pipes)).toEqual('bob state:1');
        });
        it('should not cache impure pipes', function () {
            function Template(rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'div');
                    pipe_1.pipe(1, 'countingImpurePipe');
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div');
                    pipe_1.pipe(3, 'countingImpurePipe');
                    instructions_1.elementEnd();
                    instructions_1.container(4);
                    instructions_1.reserveSlots(4);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(0, 'someProp', instructions_1.bind(pipe_1.pipeBind1(1, 2, true)));
                    instructions_1.elementProperty(2, 'someProp', instructions_1.bind(pipe_1.pipeBind1(3, 4, true)));
                    pipeInstances.push(instructions_1.load(1), instructions_1.load(3));
                    instructions_1.containerRefreshStart(4);
                    {
                        for (var _i = 0, _a = [1, 2]; _i < _a.length; _i++) {
                            var i = _a[_i];
                            var rf1 = instructions_1.embeddedViewStart(1);
                            {
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.elementStart(0, 'div');
                                    pipe_1.pipe(1, 'countingImpurePipe');
                                    instructions_1.elementEnd();
                                    instructions_1.reserveSlots(2);
                                }
                                if (rf1 & 2 /* Update */) {
                                    instructions_1.elementProperty(0, 'someProp', instructions_1.bind(pipe_1.pipeBind1(1, 2, true)));
                                    pipeInstances.push(instructions_1.load(1));
                                }
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            var pipeInstances = [];
            render_util_1.renderToHtml(Template, {}, null, pipes, rendererFactory2);
            matchers_1.expect(pipeInstances.length).toEqual(4);
            matchers_1.expect(pipeInstances[0]).toBeAnInstanceOf(CountingImpurePipe);
            matchers_1.expect(pipeInstances[1]).toBeAnInstanceOf(CountingImpurePipe);
            matchers_1.expect(pipeInstances[1]).not.toBe(pipeInstances[0]);
            matchers_1.expect(pipeInstances[2]).toBeAnInstanceOf(CountingImpurePipe);
            matchers_1.expect(pipeInstances[2]).not.toBe(pipeInstances[0]);
            matchers_1.expect(pipeInstances[3]).toBeAnInstanceOf(CountingImpurePipe);
            matchers_1.expect(pipeInstances[3]).not.toBe(pipeInstances[0]);
        });
    });
    describe('lifecycles', function () {
        var PipeWithOnDestroy = /** @class */ (function () {
            function PipeWithOnDestroy() {
            }
            PipeWithOnDestroy_1 = PipeWithOnDestroy;
            PipeWithOnDestroy.prototype.ngOnDestroy = function () { log.push('pipeWithOnDestroy - ngOnDestroy'); };
            PipeWithOnDestroy.prototype.transform = function (value) { return null; };
            var PipeWithOnDestroy_1;
            PipeWithOnDestroy.ngPipeDef = definition_1.definePipe({
                name: 'pipeWithOnDestroy',
                type: PipeWithOnDestroy_1,
                factory: function PipeWithOnDestroy_Factory() { return new PipeWithOnDestroy_1(); },
            });
            PipeWithOnDestroy = PipeWithOnDestroy_1 = __decorate([
                core_1.Pipe({ name: 'pipeWithOnDestroy' })
            ], PipeWithOnDestroy);
            return PipeWithOnDestroy;
        }());
        it('should call ngOnDestroy on pipes', function () {
            function Template(rf, person) {
                if (rf & 1 /* Create */) {
                    instructions_1.container(0);
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(0);
                    {
                        if (person.age > 20) {
                            var rf1 = instructions_1.embeddedViewStart(1);
                            {
                                if (rf1 & 1 /* Create */) {
                                    instructions_1.text(0);
                                    pipe_1.pipe(1, 'pipeWithOnDestroy');
                                    instructions_1.reserveSlots(2);
                                }
                                if (rf & 2 /* Update */) {
                                    instructions_1.textBinding(0, instructions_1.interpolation1('', pipe_1.pipeBind1(1, 2, person.age), ''));
                                }
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }
            var pipes = [PipeWithOnDestroy];
            person.age = 25;
            render_util_1.renderToHtml(Template, person, null, pipes);
            person.age = 15;
            render_util_1.renderToHtml(Template, person, null, pipes);
            matchers_1.expect(log).toEqual(['pipeWithOnDestroy - ngOnDestroy']);
            log = [];
            person.age = 30;
            render_util_1.renderToHtml(Template, person, null, pipes);
            matchers_1.expect(log).toEqual([]);
            log = [];
            person.age = 10;
            render_util_1.renderToHtml(Template, person, null, pipes);
            matchers_1.expect(log).toEqual(['pipeWithOnDestroy - ngOnDestroy']);
        });
    });
});
var CountingPipe = /** @class */ (function () {
    function CountingPipe() {
        this.state = 0;
    }
    CountingPipe_1 = CountingPipe;
    CountingPipe.prototype.transform = function (value) { return value + " state:" + this.state++; };
    var CountingPipe_1;
    CountingPipe.ngPipeDef = definition_1.definePipe({
        name: 'countingPipe',
        type: CountingPipe_1,
        factory: function CountingPipe_Factory() { return new CountingPipe_1(); },
    });
    CountingPipe = CountingPipe_1 = __decorate([
        core_1.Pipe({ name: 'countingPipe' })
    ], CountingPipe);
    return CountingPipe;
}());
var CountingImpurePipe = /** @class */ (function () {
    function CountingImpurePipe() {
        this.state = 0;
    }
    CountingImpurePipe_1 = CountingImpurePipe;
    CountingImpurePipe.prototype.transform = function (value) { return value + " state:" + this.state++; };
    var CountingImpurePipe_1;
    CountingImpurePipe.ngPipeDef = definition_1.definePipe({
        name: 'countingImpurePipe',
        type: CountingImpurePipe_1,
        factory: function CountingImpurePipe_Factory() { return new CountingImpurePipe_1(); },
        pure: false,
    });
    CountingImpurePipe = CountingImpurePipe_1 = __decorate([
        core_1.Pipe({ name: 'countingImpurePipe', pure: false })
    ], CountingImpurePipe);
    return CountingImpurePipe;
}());
var MultiArgPipe = /** @class */ (function () {
    function MultiArgPipe() {
    }
    MultiArgPipe_1 = MultiArgPipe;
    MultiArgPipe.prototype.transform = function (value, arg1, arg2, arg3) {
        if (arg3 === void 0) { arg3 = 'default'; }
        return value + " " + arg1 + " " + arg2 + " " + arg3;
    };
    var MultiArgPipe_1;
    MultiArgPipe.ngPipeDef = definition_1.definePipe({
        name: 'multiArgPipe',
        type: MultiArgPipe_1,
        factory: function MultiArgPipe_Factory() { return new MultiArgPipe_1(); },
    });
    MultiArgPipe = MultiArgPipe_1 = __decorate([
        core_1.Pipe({ name: 'multiArgPipe' })
    ], MultiArgPipe);
    return MultiArgPipe;
}());
var Person = /** @class */ (function () {
    function Person() {
        this.address = null;
    }
    Person.prototype.init = function (name, address) {
        if (address === void 0) { address = null; }
        this.name = name;
        this.address = address;
    };
    Person.prototype.sayHi = function (m) { return "Hi, " + m; };
    Person.prototype.passThrough = function (val) { return val; };
    Person.prototype.toString = function () {
        var address = this.address == null ? '' : ' address=' + this.address.toString();
        return 'name=' + this.name + address;
    };
    return Person;
}());
var Address = /** @class */ (function () {
    function Address(_city, _zipcode) {
        if (_zipcode === void 0) { _zipcode = null; }
        this._city = _city;
        this._zipcode = _zipcode;
        this.cityGetterCalls = 0;
        this.zipCodeGetterCalls = 0;
    }
    Object.defineProperty(Address.prototype, "city", {
        get: function () {
            this.cityGetterCalls++;
            return this._city;
        },
        set: function (v) { this._city = v; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Address.prototype, "zipcode", {
        get: function () {
            this.zipCodeGetterCalls++;
            return this._zipcode;
        },
        set: function (v) { this._zipcode = v; },
        enumerable: true,
        configurable: true
    });
    Address.prototype.toString = function () { return this.city || '-'; };
    return Address;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlwZV9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvcGlwZV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBRUgsc0NBQW1GO0FBQ25GLDJFQUFzRTtBQUV0RSwyREFBeUU7QUFDekUsK0RBQWdRO0FBRWhRLCtDQUF3RjtBQUV4RiwyREFBMkY7QUFDM0YsNkNBQThFO0FBRzlFLElBQUksR0FBRyxHQUFhLEVBQUUsQ0FBQztBQUN2QixJQUFJLE1BQWMsQ0FBQztBQUNuQixJQUFJLFNBQVMsR0FBYyxJQUFJLDhCQUFTLEVBQUUsQ0FBQztBQUMzQyxJQUFNLGdCQUFnQixHQUFHLHdDQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZELDBDQUFxQixDQUFDLGdCQUFnQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBRW5ELFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixVQUFVLENBQUM7UUFDVCxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBQ1QsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xCLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBTSxLQUFLLEdBQUcsY0FBTSxPQUFBLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxrQkFBa0IsQ0FBQyxFQUFoRCxDQUFnRCxDQUFDO0lBRXJFLEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtRQUNqQyxrQkFBa0IsRUFBZSxFQUFFLE1BQWM7WUFDL0MsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQixtQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNSLFdBQUksQ0FBQyxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7Z0JBQ3hCLDJCQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDakI7WUFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLDBCQUFXLENBQUMsQ0FBQyxFQUFFLDZCQUFjLENBQUMsRUFBRSxFQUFFLGdCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN0RTtRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN6QixpQkFBTSxDQUFDLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDN0UsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUU7UUFDdEMsSUFBTSxHQUFHLEdBQUcsNkJBQWUsQ0FBQyxLQUFLLEVBQUUsVUFBUyxFQUFlLEVBQUUsR0FBUTtZQUNuRSxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLG1CQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsV0FBSSxDQUFDLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMxQiwyQkFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pCO1lBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQiwwQkFBVyxDQUFDLENBQUMsRUFBRSw2QkFBYyxDQUFDLEVBQUUsRUFBRSxnQkFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDcEU7UUFDSCxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRWQsaUJBQU0sQ0FBQztZQUNMLElBQU0sT0FBTyxHQUFHLElBQUksOEJBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLDRDQUE0QyxDQUFDLENBQUM7SUFDaEUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7UUFDNUIsSUFBSSxTQUFTLEdBQVEsSUFBSSxDQUFDO1FBRzFCO1lBR0U7Z0JBQWdCLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1lBQUMsQ0FBQztzQkFIaEMsS0FBSzs7WUFLRixvQkFBYyxHQUFHLDRCQUFlLENBQUM7Z0JBQ3RDLElBQUksRUFBRSxPQUFLO2dCQUNYLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDOUIsT0FBTyxFQUFFLGNBQU0sT0FBQSxJQUFJLE9BQUssRUFBRSxFQUFYLENBQVc7Z0JBQzFCLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUM7YUFDNUIsQ0FBQyxDQUFDO1lBVkMsS0FBSztnQkFEVixnQkFBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUMsQ0FBQzs7ZUFDNUUsS0FBSyxDQVdWO1lBQUQsWUFBQztTQUFBLEFBWEQsSUFXQztRQUdEO1lBQUE7WUFRQSxDQUFDOzJCQVJLLFVBQVU7WUFDZCw4QkFBUyxHQUFULFVBQVUsS0FBVSxJQUFJLE9BQU8sS0FBRyxLQUFLLEdBQUcsS0FBTyxDQUFDLENBQUMsQ0FBQzs7WUFFN0Msb0JBQVMsR0FBRyx1QkFBVSxDQUFDO2dCQUM1QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsWUFBVTtnQkFDaEIsT0FBTyxFQUFFLGdDQUFnQyxPQUFPLElBQUksWUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BFLENBQUMsQ0FBQztZQVBDLFVBQVU7Z0JBRGYsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBQyxDQUFDO2VBQ2pCLFVBQVUsQ0FRZjtZQUFELGlCQUFDO1NBQUEsQUFSRCxJQVFDO1FBRUQsa0JBQWtCLEVBQWUsRUFBRSxHQUFXO1lBQzVDLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLFdBQUksQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7Z0JBQ2xCLHlCQUFVLEVBQUUsQ0FBQztnQkFDYiwyQkFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2pCO1lBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQiw4QkFBZSxDQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsbUJBQUksQ0FBQyxnQkFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6RCxTQUFTLEdBQUcsNEJBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QjtRQUNILENBQUM7UUFDRCwwQkFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDbkQsaUJBQU0sQ0FBQyxTQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVDLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1FBQ3RDLGtCQUFrQixFQUFlLEVBQUUsTUFBYztZQUMvQyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLG1CQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsV0FBSSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDeEIsMkJBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQjtZQUNELElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMEJBQVcsQ0FDUCxDQUFDLEVBQUUsNkJBQWMsQ0FBQyxFQUFFLEVBQUUsZ0JBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxPQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUM1RjtRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ3pDLGlCQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3ZGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlFQUFpRSxFQUFFO1FBQ3BFLGtCQUFrQixFQUFlLEVBQUUsTUFBYztZQUMvQyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLG1CQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsV0FBSSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDeEIsV0FBSSxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQztnQkFDeEIsMkJBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQjtZQUNELElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMEJBQVcsQ0FDUCxDQUFDLEVBQUUsNkJBQWMsQ0FDVixFQUFFLEVBQUUsZ0JBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLGdCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3pGO1FBQ0gsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQzNCLGlCQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3pGLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1FBRXJDO1lBQUE7WUFRQSxDQUFDOzZCQVJLLFlBQVk7WUFDaEIsZ0NBQVMsR0FBVCxVQUFVLEtBQVUsSUFBSSxPQUFPLEtBQUssQ0FBQyxDQUFDLENBQUM7O1lBRWhDLHNCQUFTLEdBQUcsdUJBQVUsQ0FBQztnQkFDNUIsSUFBSSxFQUFFLGNBQWM7Z0JBQ3BCLElBQUksRUFBRSxjQUFZO2dCQUNsQixPQUFPLEVBQUUsa0NBQWtDLE9BQU8sSUFBSSxjQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDeEUsQ0FBQyxDQUFDO1lBUEMsWUFBWTtnQkFEakIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDO2VBQ3ZCLFlBQVksQ0FRakI7WUFBRCxtQkFBQztTQUFBLEFBUkQsSUFRQztRQUVELGtCQUFrQixFQUFlLEVBQUUsTUFBYztZQUMvQyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7Z0JBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2QixXQUFJLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO2dCQUN4Qix5QkFBVSxFQUFFLENBQUM7Z0JBQ2IsMkJBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNqQjtZQUNELElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLG1CQUFJLENBQUMsZ0JBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNuRTtRQUNILENBQUM7UUFFRCwwQkFBWSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsWUFBWSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN2RSxpQkFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7UUFFckQsU0FBUyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2xCLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsaUJBQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLE1BQU0sRUFBRTtRQUNmLEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtZQUN4RCxrQkFBa0IsRUFBZSxFQUFFLE1BQWM7Z0JBQy9DLElBQUksRUFBRSxpQkFBcUIsRUFBRTtvQkFDM0IsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDUixXQUFJLENBQUMsQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO29CQUN4QiwyQkFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqQjtnQkFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLDBCQUFXLENBQUMsQ0FBQyxFQUFFLDZCQUFjLENBQUMsRUFBRSxFQUFFLGdCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztpQkFDdEU7WUFDSCxDQUFDO1lBRUQsZ0NBQWdDO1lBQ2hDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1lBQ25CLGlCQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1RSxpQkFBTSxDQUFDLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7WUFFNUUsaUNBQWlDO1lBQ2pDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLGlCQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzRSxpQkFBTSxDQUFDLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7WUFFM0UsNkNBQTZDO1lBQzdDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLGlCQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUM1RSxpQkFBTSxDQUFDLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDOUUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELGtCQUFrQixFQUFlLEVBQUUsTUFBYztnQkFDL0MsSUFBSSxFQUFFLGlCQUFxQixFQUFFO29CQUMzQixtQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNSLFdBQUksQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztvQkFDOUIsMkJBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDakI7Z0JBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO29CQUMzQiwwQkFBVyxDQUFDLENBQUMsRUFBRSw2QkFBYyxDQUFDLEVBQUUsRUFBRSxnQkFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RFO1lBQ0gsQ0FBQztZQUVELE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ3BCLGlCQUFNLENBQUMsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUMzRSxpQkFBTSxDQUFDLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0UsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsK0JBQStCLEVBQUU7WUFDbEMsa0JBQWtCLEVBQWUsRUFBRSxHQUFRO2dCQUN6QyxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUN2QixXQUFJLENBQUMsQ0FBQyxFQUFFLG9CQUFvQixDQUFDLENBQUM7b0JBQzlCLHlCQUFVLEVBQUUsQ0FBQztvQkFDYiwyQkFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDdkIsV0FBSSxDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO29CQUM5Qix5QkFBVSxFQUFFLENBQUM7b0JBQ2Isd0JBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDYiwyQkFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNqQjtnQkFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLDhCQUFlLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxtQkFBSSxDQUFDLGdCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVELDhCQUFlLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxtQkFBSSxDQUFDLGdCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzVELGFBQWEsQ0FBQyxJQUFJLENBQUMsbUJBQUksQ0FBcUIsQ0FBQyxDQUFDLEVBQUUsbUJBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6RCxvQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekI7d0JBQ0UsS0FBYyxVQUFNLEVBQU4sTUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQU4sY0FBTSxFQUFOLElBQU0sRUFBRTs0QkFBakIsSUFBSSxDQUFDLFNBQUE7NEJBQ1IsSUFBSSxHQUFHLEdBQUcsZ0NBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQy9CO2dDQUNFLElBQUksR0FBRyxpQkFBcUIsRUFBRTtvQ0FDNUIsMkJBQVksQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7b0NBQ3ZCLFdBQUksQ0FBQyxDQUFDLEVBQUUsb0JBQW9CLENBQUMsQ0FBQztvQ0FDOUIseUJBQVUsRUFBRSxDQUFDO29DQUNiLDJCQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7aUNBQ2pCO2dDQUNELElBQUksR0FBRyxpQkFBcUIsRUFBRTtvQ0FDNUIsOEJBQWUsQ0FBQyxDQUFDLEVBQUUsVUFBVSxFQUFFLG1CQUFJLENBQUMsZ0JBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQ0FDNUQsYUFBYSxDQUFDLElBQUksQ0FBQyxtQkFBSSxDQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO2lDQUNqRDs2QkFDRjs0QkFDRCw4QkFBZSxFQUFFLENBQUM7eUJBQ25CO3FCQUNGO29CQUNELGtDQUFtQixFQUFFLENBQUM7aUJBQ3ZCO1lBQ0gsQ0FBQztZQUVELElBQU0sYUFBYSxHQUF5QixFQUFFLENBQUM7WUFDL0MsMEJBQVksQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUMxRCxpQkFBTSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsaUJBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzlELGlCQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUM5RCxpQkFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEQsaUJBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQzlELGlCQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwRCxpQkFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDOUQsaUJBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBRXJCO1lBQUE7WUFVQSxDQUFDO2tDQVZLLGlCQUFpQjtZQUNyQix1Q0FBVyxHQUFYLGNBQWdCLEdBQUcsQ0FBQyxJQUFJLENBQUMsaUNBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFOUQscUNBQVMsR0FBVCxVQUFVLEtBQVUsSUFBUyxPQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7O1lBRXBDLDJCQUFTLEdBQUcsdUJBQVUsQ0FBQztnQkFDNUIsSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsSUFBSSxFQUFFLG1CQUFpQjtnQkFDdkIsT0FBTyxFQUFFLHVDQUF1QyxPQUFPLElBQUksbUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDbEYsQ0FBQyxDQUFDO1lBVEMsaUJBQWlCO2dCQUR0QixXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsbUJBQW1CLEVBQUMsQ0FBQztlQUM1QixpQkFBaUIsQ0FVdEI7WUFBRCx3QkFBQztTQUFBLEFBVkQsSUFVQztRQUVELEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUNyQyxrQkFBa0IsRUFBZSxFQUFFLE1BQWM7Z0JBQy9DLElBQUksRUFBRSxpQkFBcUIsRUFBRTtvQkFDM0Isd0JBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDZDtnQkFDRCxJQUFJLEVBQUUsaUJBQXFCLEVBQUU7b0JBQzNCLG9DQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6Qjt3QkFDRSxJQUFJLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxFQUFFOzRCQUNuQixJQUFJLEdBQUcsR0FBRyxnQ0FBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDL0I7Z0NBQ0UsSUFBSSxHQUFHLGlCQUFxQixFQUFFO29DQUM1QixtQkFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29DQUNSLFdBQUksQ0FBQyxDQUFDLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztvQ0FDN0IsMkJBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDakI7Z0NBQ0QsSUFBSSxFQUFFLGlCQUFxQixFQUFFO29DQUMzQiwwQkFBVyxDQUFDLENBQUMsRUFBRSw2QkFBYyxDQUFDLEVBQUUsRUFBRSxnQkFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7aUNBQ3JFOzZCQUNGOzRCQUNELDhCQUFlLEVBQUUsQ0FBQzt5QkFDbkI7cUJBQ0Y7b0JBQ0Qsa0NBQW1CLEVBQUUsQ0FBQztpQkFDdkI7WUFDSCxDQUFDO1lBQ0QsSUFBTSxLQUFLLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO1lBRWxDLE1BQU0sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLDBCQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFFNUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDaEIsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM1QyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztZQUV6RCxHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDaEIsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM1QyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUV4QixHQUFHLEdBQUcsRUFBRSxDQUFDO1lBQ1QsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7WUFDaEIsMEJBQVksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUM1QyxpQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLGlDQUFpQyxDQUFDLENBQUMsQ0FBQztRQUMzRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBRUwsQ0FBQyxDQUFDLENBQUM7QUFHSDtJQURBO1FBRUUsVUFBSyxHQUFXLENBQUMsQ0FBQztJQVNwQixDQUFDO3FCQVZLLFlBQVk7SUFHaEIsZ0NBQVMsR0FBVCxVQUFVLEtBQVUsSUFBSSxPQUFVLEtBQUssZUFBVSxJQUFJLENBQUMsS0FBSyxFQUFJLENBQUMsQ0FBQyxDQUFDOztJQUUzRCxzQkFBUyxHQUFHLHVCQUFVLENBQUM7UUFDNUIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsSUFBSSxFQUFFLGNBQVk7UUFDbEIsT0FBTyxFQUFFLGtDQUFrQyxPQUFPLElBQUksY0FBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hFLENBQUMsQ0FBQztJQVRDLFlBQVk7UUFEakIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDO09BQ3ZCLFlBQVksQ0FVakI7SUFBRCxtQkFBQztDQUFBLEFBVkQsSUFVQztBQUdEO0lBREE7UUFFRSxVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBVXBCLENBQUM7MkJBWEssa0JBQWtCO0lBR3RCLHNDQUFTLEdBQVQsVUFBVSxLQUFVLElBQUksT0FBVSxLQUFLLGVBQVUsSUFBSSxDQUFDLEtBQUssRUFBSSxDQUFDLENBQUMsQ0FBQzs7SUFFM0QsNEJBQVMsR0FBRyx1QkFBVSxDQUFDO1FBQzVCLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsSUFBSSxFQUFFLG9CQUFrQjtRQUN4QixPQUFPLEVBQUUsd0NBQXdDLE9BQU8sSUFBSSxvQkFBa0IsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNuRixJQUFJLEVBQUUsS0FBSztLQUNaLENBQUMsQ0FBQztJQVZDLGtCQUFrQjtRQUR2QixXQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsb0JBQW9CLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxDQUFDO09BQzFDLGtCQUFrQixDQVd2QjtJQUFELHlCQUFDO0NBQUEsQUFYRCxJQVdDO0FBR0Q7SUFBQTtJQVVBLENBQUM7cUJBVkssWUFBWTtJQUNoQixnQ0FBUyxHQUFULFVBQVUsS0FBVSxFQUFFLElBQVMsRUFBRSxJQUFTLEVBQUUsSUFBZ0I7UUFBaEIscUJBQUEsRUFBQSxnQkFBZ0I7UUFDMUQsT0FBVSxLQUFLLFNBQUksSUFBSSxTQUFJLElBQUksU0FBSSxJQUFNLENBQUM7SUFDNUMsQ0FBQzs7SUFFTSxzQkFBUyxHQUFHLHVCQUFVLENBQUM7UUFDNUIsSUFBSSxFQUFFLGNBQWM7UUFDcEIsSUFBSSxFQUFFLGNBQVk7UUFDbEIsT0FBTyxFQUFFLGtDQUFrQyxPQUFPLElBQUksY0FBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3hFLENBQUMsQ0FBQztJQVRDLFlBQVk7UUFEakIsV0FBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDO09BQ3ZCLFlBQVksQ0FVakI7SUFBRCxtQkFBQztDQUFBLEFBVkQsSUFVQztBQUVEO0lBQUE7UUFLRSxZQUFPLEdBQWlCLElBQUksQ0FBQztJQWtCL0IsQ0FBQztJQWRDLHFCQUFJLEdBQUosVUFBSyxJQUFpQixFQUFFLE9BQTRCO1FBQTVCLHdCQUFBLEVBQUEsY0FBNEI7UUFDbEQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDekIsQ0FBQztJQUVELHNCQUFLLEdBQUwsVUFBTSxDQUFNLElBQVksT0FBTyxTQUFPLENBQUcsQ0FBQyxDQUFDLENBQUM7SUFFNUMsNEJBQVcsR0FBWCxVQUFZLEdBQVEsSUFBUyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFFMUMseUJBQVEsR0FBUjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWxGLE9BQU8sT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO0lBQ3ZDLENBQUM7SUFDSCxhQUFDO0FBQUQsQ0FBQyxBQXZCRCxJQXVCQztBQUVEO0lBSUUsaUJBQW1CLEtBQWEsRUFBUyxRQUFvQjtRQUFwQix5QkFBQSxFQUFBLGVBQW9CO1FBQTFDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFZO1FBSDdELG9CQUFlLEdBQVcsQ0FBQyxDQUFDO1FBQzVCLHVCQUFrQixHQUFXLENBQUMsQ0FBQztJQUVpQyxDQUFDO0lBRWpFLHNCQUFJLHlCQUFJO2FBQVI7WUFDRSxJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDdkIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFPRCxVQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7OztPQVA5QjtJQUVELHNCQUFJLDRCQUFPO2FBQVg7WUFDRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztZQUMxQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDdkIsQ0FBQzthQUlELFVBQVksQ0FBQyxJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7O09BSnBDO0lBTUQsMEJBQVEsR0FBUixjQUFxQixPQUFPLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNqRCxjQUFDO0FBQUQsQ0FBQyxBQXJCRCxJQXFCQyJ9