"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
class MockRootScopeInjector {
    constructor(parent) {
        this.parent = parent;
    }
    get(token, defaultValue, flags = 0 /* Default */) {
        if (token.ngInjectableDef && token.ngInjectableDef.providedIn === 'root') {
            const old = core_1.ɵsetCurrentInjector(this);
            try {
                return token.ngInjectableDef.factory();
            }
            finally {
                core_1.ɵsetCurrentInjector(old);
            }
        }
        return this.parent.get(token, defaultValue, flags);
    }
}
{
    describe('injector metadata examples', () => {
        it('works', () => {
            // #docregion Injector
            const injector = core_1.Injector.create({ providers: [{ provide: 'validToken', useValue: 'Value' }] });
            expect(injector.get('validToken')).toEqual('Value');
            expect(() => injector.get('invalidToken')).toThrowError();
            expect(injector.get('invalidToken', 'notFound')).toEqual('notFound');
            // #enddocregion
        });
        it('injects injector', () => {
            // #docregion injectInjector
            const injector = core_1.Injector.create({ providers: [] });
            expect(injector.get(core_1.Injector)).toBe(injector);
            // #enddocregion
        });
        it('should infer type', () => {
            // #docregion InjectionToken
            const BASE_URL = new core_1.InjectionToken('BaseUrl');
            const injector = core_1.Injector.create({ providers: [{ provide: BASE_URL, useValue: 'http://localhost' }] });
            const url = injector.get(BASE_URL);
            // here `url` is inferred to be `string` because `BASE_URL` is `InjectionToken<string>`.
            expect(url).toBe('http://localhost');
            // #enddocregion
        });
        it('injects a tree-shakeable InjectionToken', () => {
            class MyDep {
            }
            const injector = new MockRootScopeInjector(core_1.Injector.create({ providers: [{ provide: MyDep, deps: [] }] }));
            // #docregion ShakableInjectionToken
            class MyService {
                constructor(myDep) {
                    this.myDep = myDep;
                }
            }
            const MY_SERVICE_TOKEN = new core_1.InjectionToken('Manually constructed MyService', {
                providedIn: 'root',
                factory: () => new MyService(core_1.inject(MyDep)),
            });
            const instance = injector.get(MY_SERVICE_TOKEN);
            expect(instance instanceof MyService).toBeTruthy();
            expect(instance.myDep instanceof MyDep).toBeTruthy();
            // #enddocregion
        });
    });
}
//# sourceMappingURL=injector_spec.js.map