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
const core_1 = require("@angular/core");
{
    describe('Provider examples', () => {
        describe('TypeProvider', () => {
            it('works', () => {
                // #docregion TypeProvider
                let Greeting = class Greeting {
                    // #docregion TypeProvider
                    constructor() {
                        this.salutation = 'Hello';
                    }
                };
                Greeting = __decorate([
                    core_1.Injectable()
                ], Greeting);
                const injector = core_1.ReflectiveInjector.resolveAndCreate([
                    Greeting,
                ]);
                expect(injector.get(Greeting).salutation).toBe('Hello');
                // #enddocregion
            });
        });
        describe('ValueProvider', () => {
            it('works', () => {
                // #docregion ValueProvider
                const injector = core_1.Injector.create([{ provide: String, useValue: 'Hello' }]);
                expect(injector.get(String)).toEqual('Hello');
                // #enddocregion
            });
        });
        describe('MultiProviderAspect', () => {
            it('works', () => {
                // #docregion MultiProviderAspect
                const locale = new core_1.InjectionToken('locale');
                const injector = core_1.Injector.create([
                    { provide: locale, multi: true, useValue: 'en' },
                    { provide: locale, multi: true, useValue: 'sk' },
                ]);
                const locales = injector.get(locale);
                expect(locales).toEqual(['en', 'sk']);
                // #enddocregion
            });
        });
        describe('ClassProvider', () => {
            it('works', () => {
                // #docregion ClassProvider
                class Shape {
                }
                class Square extends Shape {
                    constructor() {
                        super(...arguments);
                        this.name = 'square';
                    }
                }
                const injector = core_1.ReflectiveInjector.resolveAndCreate([{ provide: Shape, useClass: Square }]);
                const shape = injector.get(Shape);
                expect(shape.name).toEqual('square');
                expect(shape instanceof Square).toBe(true);
                // #enddocregion
            });
            it('is different then useExisting', () => {
                // #docregion ClassProviderDifference
                class Greeting {
                    constructor() {
                        this.salutation = 'Hello';
                    }
                }
                class FormalGreeting extends Greeting {
                    constructor() {
                        super(...arguments);
                        this.salutation = 'Greetings';
                    }
                }
                const injector = core_1.ReflectiveInjector.resolveAndCreate([FormalGreeting, { provide: Greeting, useClass: FormalGreeting }]);
                // The injector returns different instances.
                // See: {provide: ?, useExisting: ?} if you want the same instance.
                expect(injector.get(FormalGreeting)).not.toBe(injector.get(Greeting));
                // #enddocregion
            });
        });
        describe('StaticClassProvider', () => {
            it('works', () => {
                // #docregion StaticClassProvider
                class Shape {
                }
                class Square extends Shape {
                    constructor() {
                        super(...arguments);
                        this.name = 'square';
                    }
                }
                const injector = core_1.Injector.create([{ provide: Shape, useClass: Square, deps: [] }]);
                const shape = injector.get(Shape);
                expect(shape.name).toEqual('square');
                expect(shape instanceof Square).toBe(true);
                // #enddocregion
            });
            it('is different then useExisting', () => {
                // #docregion StaticClassProviderDifference
                class Greeting {
                    constructor() {
                        this.salutation = 'Hello';
                    }
                }
                class FormalGreeting extends Greeting {
                    constructor() {
                        super(...arguments);
                        this.salutation = 'Greetings';
                    }
                }
                const injector = core_1.Injector.create([
                    { provide: FormalGreeting, useClass: FormalGreeting, deps: [] },
                    { provide: Greeting, useClass: FormalGreeting, deps: [] }
                ]);
                // The injector returns different instances.
                // See: {provide: ?, useExisting: ?} if you want the same instance.
                expect(injector.get(FormalGreeting)).not.toBe(injector.get(Greeting));
                // #enddocregion
            });
        });
        describe('ConstructorProvider', () => {
            it('works', () => {
                // #docregion ConstructorProvider
                class Square {
                    constructor() {
                        this.name = 'square';
                    }
                }
                const injector = core_1.Injector.create({ providers: [{ provide: Square, deps: [] }] });
                const shape = injector.get(Square);
                expect(shape.name).toEqual('square');
                expect(shape instanceof Square).toBe(true);
                // #enddocregion
            });
        });
        describe('ExistingProvider', () => {
            it('works', () => {
                // #docregion ExistingProvider
                class Greeting {
                    constructor() {
                        this.salutation = 'Hello';
                    }
                }
                class FormalGreeting extends Greeting {
                    constructor() {
                        super(...arguments);
                        this.salutation = 'Greetings';
                    }
                }
                const injector = core_1.Injector.create([
                    { provide: FormalGreeting, deps: [] }, { provide: Greeting, useExisting: FormalGreeting }
                ]);
                expect(injector.get(Greeting).salutation).toEqual('Greetings');
                expect(injector.get(FormalGreeting).salutation).toEqual('Greetings');
                expect(injector.get(FormalGreeting)).toBe(injector.get(Greeting));
                // #enddocregion
            });
        });
        describe('FactoryProvider', () => {
            it('works', () => {
                // #docregion FactoryProvider
                const Location = new core_1.InjectionToken('location');
                const Hash = new core_1.InjectionToken('hash');
                const injector = core_1.Injector.create([
                    { provide: Location, useValue: 'http://angular.io/#someLocation' }, {
                        provide: Hash,
                        useFactory: (location) => location.split('#')[1],
                        deps: [Location]
                    }
                ]);
                expect(injector.get(Hash)).toEqual('someLocation');
                // #enddocregion
            });
            it('supports optional dependencies', () => {
                // #docregion FactoryProviderOptionalDeps
                const Location = new core_1.InjectionToken('location');
                const Hash = new core_1.InjectionToken('hash');
                const injector = core_1.Injector.create([{
                        provide: Hash,
                        useFactory: (location) => `Hash for: ${location}`,
                        // use a nested array to define metadata for dependencies.
                        deps: [[new core_1.Optional(), Location]]
                    }]);
                expect(injector.get(Hash)).toEqual('Hash for: null');
                // #enddocregion
            });
        });
    });
}
//# sourceMappingURL=provider_spec.js.map