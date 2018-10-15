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
var core_1 = require("../../src/core");
var definition_1 = require("../../src/render3/definition");
var di_1 = require("../../src/render3/di");
var index_1 = require("../../src/render3/index");
var instructions_1 = require("../../src/render3/instructions");
var render_util_1 = require("./render_util");
describe('content projection', function () {
    it('should project content', function () {
        /**
         * <div><ng-content></ng-content></div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        /**
         * <child>content</child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>content</div></child>');
    });
    it('should project content when root.', function () {
        /** <ng-content></ng-content> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
            }
        });
        /** <child>content</child> */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child>content</child>');
    });
    it('should project content with siblings', function () {
        /** <ng-content></ng-content> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
            }
        });
        /**
         * <child>
         *  before
         *  <div>content</div>
         *  after
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, 'before');
                    instructions_1.elementStart(2, 'div');
                    {
                        instructions_1.text(3, 'content');
                    }
                    instructions_1.elementEnd();
                    instructions_1.text(4, 'after');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child>before<div>content</div>after</child>');
    });
    it('should re-project content when root.', function () {
        /** <div><ng-content></ng-content></div> */
        var GrandChild = render_util_1.createComponent('grand-child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        /** <grand-child><ng-content></ng-content></grand-child> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'grand-child');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        }, [GrandChild]);
        /** <child><b>Hello</b>World!</child> */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.elementStart(1, 'b');
                    instructions_1.text(2, 'Hello');
                    instructions_1.elementEnd();
                    instructions_1.text(3, 'World!');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent))
            .toEqual('<child><grand-child><div><b>Hello</b>World!</div></grand-child></child>');
    });
    it('should project components', function () {
        /** <div><ng-content></ng-content></div> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        var ProjectedComp = render_util_1.createComponent('projected-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.text(0, 'content');
            }
        });
        /**
         * <child>
         *   <projected-comp></projected-comp>
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.elementStart(1, 'projected-comp');
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
            }
        }, [Child, ProjectedComp]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent))
            .toEqual('<child><div><projected-comp>content</projected-comp></div></child>');
    });
    it('should project components that have their own projection', function () {
        /** <div><ng-content></ng-content></div> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        /** <p><ng-content></ng-content></p> */
        var ProjectedComp = render_util_1.createComponent('projected-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'p');
                instructions_1.projection(1);
                instructions_1.elementEnd();
            }
        });
        /**
         * <child>
         *   <projected-comp>
         *       <div> Some content </div>
         *       Other content
         *   </projected-comp>
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.elementStart(1, 'projected-comp');
                    {
                        instructions_1.elementStart(2, 'div');
                        instructions_1.text(3, 'Some content');
                        instructions_1.elementEnd();
                        instructions_1.text(4, 'Other content');
                    }
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
            }
        }, [Child, ProjectedComp]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent))
            .toEqual('<child><div><projected-comp><p><div>Some content</div>Other content</p></projected-comp></div></child>');
    });
    it('should project containers', function () {
        /** <div> <ng-content></ng-content></div> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        /**
         * <child>
         *     (
         *      % if (value) {
         *        content
         *      % }
         *     )
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, '(');
                    instructions_1.container(2);
                    instructions_1.text(3, ')');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (ctx.value) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.text(0, 'content');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>()</div></child>');
        parent.value = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>(content)</div></child>');
        parent.value = false;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>()</div></child>');
    });
    it('should project containers into root', function () {
        /** <ng-content></ng-content> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
            }
        });
        /**
         * <child>
         *    % if (value) {
         *      content
         *    % }
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (ctx.value) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.text(0, 'content');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child></child>');
        parent.value = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child>content</child>');
        parent.value = false;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child></child>');
    });
    it('should project containers with if-else.', function () {
        /** <div><ng-content></ng-content></div> */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
            }
        });
        /**
         * <child>
         *     (
         *       % if (value) {
         *         content
         *       % } else {
         *         else
         *       % }
         *     )
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, '(');
                    instructions_1.container(2);
                    instructions_1.text(3, ')');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (ctx.value) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.text(0, 'content');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                    else {
                        if (instructions_1.embeddedViewStart(1)) {
                            instructions_1.text(0, 'else');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>(else)</div></child>');
        parent.value = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>(content)</div></child>');
        parent.value = false;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>(else)</div></child>');
    });
    it('should support projection into embedded views', function () {
        var childCmptInstance;
        /**
         * <div>
         *  % if (!skipContent) {
         *    <span>
         *      <ng-content></ng-content>
         *    </span>
         *  % }
         * </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.elementStart(0, 'span');
                            instructions_1.projection(1);
                            instructions_1.elementEnd();
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /**
         * <child>
         *   <div>text</div>
         *   content
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.elementStart(1, 'div');
                    {
                        instructions_1.text(2, 'text');
                    }
                    instructions_1.elementEnd();
                    instructions_1.text(3, 'content');
                }
                instructions_1.elementEnd();
                // testing
                childCmptInstance = instructions_1.loadDirective(0);
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div><span><div>text</div>content</span></div></child>');
        childCmptInstance.skipContent = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div></div></child>');
    });
    it('should support projection into embedded views when no projected nodes', function () {
        var childCmptInstance;
        /**
         * <div>
         *  % if (!skipContent) {
         *      <ng-content></ng-content>
         *      text
         *  % }
         * </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.projection(0);
                            instructions_1.text(1, 'text');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /** <child></child> */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                instructions_1.elementEnd();
                // testing
                childCmptInstance = instructions_1.loadDirective(0);
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>text</div></child>');
        childCmptInstance.skipContent = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div></div></child>');
    });
    it('should support projection into embedded views when ng-content is a root node of an embedded view', function () {
        var childCmptInstance;
        /**
         * <div>
         *  % if (!skipContent) {
          *    <ng-content></ng-content>
          *  % }
         * </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.projection(0);
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /**
         * <child>content</child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    childCmptInstance = instructions_1.loadDirective(0);
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>content</div></child>');
        childCmptInstance.skipContent = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div></div></child>');
    });
    it('should project containers into containers', function () {
        /**
         * <div>
         *  Before (inside)
         *  % if (!skipContent) {
         *    <ng-content></ng-content>
         *  % }
         *  After (inside)
         * </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.text(1, 'Before (inside)-');
                    instructions_1.container(2);
                    instructions_1.text(3, '-After (inside)');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.projection(0);
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /**
         * <child>
         *     Before text-
         *     % if (!skipContent) {
         *       content
         *     % }
         *     -After text
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, 'Before text-');
                    instructions_1.container(2);
                    instructions_1.text(3, '-After text');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.text(0, 'content');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }, [Child]);
        var fixture = new render_util_1.ComponentFixture(Parent);
        expect(fixture.html)
            .toEqual('<child><div>Before (inside)-Before text-content-After text-After (inside)</div></child>');
        fixture.component.skipContent = true;
        fixture.update();
        expect(fixture.html)
            .toEqual('<child><div>Before (inside)-Before text--After text-After (inside)</div></child>');
    });
    it('should re-project containers into containers', function () {
        /**
         * <div>
         *  % if (!skipContent) {
         *    <ng-content></ng-content>
         *  % }
         * </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.projection(0);
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /**
         * <child>
         *     Before text
         *     % if (!skipContent) {
         *       <ng-content></ng-content>
         *     % }
         *     -After text
         * </child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, 'Before text');
                    instructions_1.container(2);
                    instructions_1.text(3, '-After text');
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.projection(0);
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        }, [Child]);
        var parent;
        /** <parent><p>text</p></parent> */
        var App = render_util_1.createComponent('app', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'parent');
                {
                    instructions_1.elementStart(1, 'p');
                    {
                        instructions_1.text(2, 'text');
                    }
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
                // testing
                parent = instructions_1.loadDirective(0);
            }
        }, [Parent]);
        var fixture = new render_util_1.ComponentFixture(App);
        expect(fixture.html)
            .toEqual('<parent><child><div>Before text<p>text</p>-After text</div></child></parent>');
        parent.skipContent = true;
        fixture.update();
        expect(fixture.html)
            .toEqual('<parent><child><div>Before text-After text</div></child></parent>');
    });
    it('should support projection into embedded views when ng-content is a root node of an embedded view, with other nodes after', function () {
        var childCmptInstance;
        /**
         * <div>
         *  % if (!skipContent) {
          *    before-<ng-content></ng-content>-after
          *  % }
         * </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.container(1);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(1);
                {
                    if (!ctx.skipContent) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.text(0, 'before-');
                            instructions_1.projection(1);
                            instructions_1.text(2, '-after');
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /**
         * <child>content</child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    childCmptInstance = instructions_1.loadDirective(0);
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>before-content-after</div></child>');
        childCmptInstance.skipContent = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div></div></child>');
    });
    it('should project into dynamic views (with createEmbeddedView)', function () {
        var NgIf = /** @class */ (function () {
            function NgIf(vcr, template) {
                this.vcr = vcr;
                this.template = template;
            }
            Object.defineProperty(NgIf.prototype, "ngIf", {
                set: function (value) {
                    value ? this.vcr.createEmbeddedView(this.template) : this.vcr.clear();
                },
                enumerable: true,
                configurable: true
            });
            NgIf.ngDirectiveDef = definition_1.defineDirective({
                type: NgIf,
                selectors: [['', 'ngIf', '']],
                inputs: { 'ngIf': 'ngIf' },
                factory: function () { return new NgIf(di_1.injectViewContainerRef(), di_1.injectTemplateRef()); }
            });
            __decorate([
                core_1.Input(),
                __metadata("design:type", Boolean),
                __metadata("design:paramtypes", [Boolean])
            ], NgIf.prototype, "ngIf", null);
            return NgIf;
        }());
        /**
         * Before-
         * <ng-template [ngIf]="showing">
         *     <ng-content></ng-content>
         * </ng-template>
         * -After
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.text(0, 'Before-');
                instructions_1.container(1, IfTemplate, '', [1 /* SelectOnly */, 'ngIf']);
                instructions_1.text(2, '-After');
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(1, 'ngIf', instructions_1.bind(ctx.showing));
            }
            function IfTemplate(rf1, ctx1) {
                if (rf1 & 1 /* Create */) {
                    instructions_1.projectionDef();
                    instructions_1.projection(0);
                }
            }
        }, [NgIf]);
        var child;
        /**
         * <child>
         *     <div>A</div>
         *     Some text
         * </child>
         */
        var App = render_util_1.createComponent('app', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.elementStart(1, 'div');
                    {
                        instructions_1.text(2, 'A');
                    }
                    instructions_1.elementEnd();
                    instructions_1.text(3, 'Some text');
                }
                instructions_1.elementEnd();
                // testing
                child = instructions_1.loadDirective(0);
            }
        }, [Child]);
        var fixture = new render_util_1.ComponentFixture(App);
        child.showing = true;
        fixture.update();
        expect(fixture.html).toEqual('<child>Before-<div>A</div>Some text-After</child>');
        child.showing = false;
        fixture.update();
        expect(fixture.html).toEqual('<child>Before--After</child>');
        child.showing = true;
        fixture.update();
        expect(fixture.html).toEqual('<child>Before-<div>A</div>Some text-After</child>');
    });
    it('should project into dynamic views (with insertion)', function () {
        var NgIf = /** @class */ (function () {
            function NgIf(vcr, template) {
                this.vcr = vcr;
                this.template = template;
            }
            Object.defineProperty(NgIf.prototype, "ngIf", {
                set: function (value) {
                    if (value) {
                        var viewRef = this.template.createEmbeddedView({});
                        this.vcr.insert(viewRef);
                    }
                    else {
                        this.vcr.clear();
                    }
                },
                enumerable: true,
                configurable: true
            });
            NgIf.ngDirectiveDef = definition_1.defineDirective({
                type: NgIf,
                selectors: [['', 'ngIf', '']],
                inputs: { 'ngIf': 'ngIf' },
                factory: function () { return new NgIf(di_1.injectViewContainerRef(), di_1.injectTemplateRef()); }
            });
            __decorate([
                core_1.Input(),
                __metadata("design:type", Boolean),
                __metadata("design:paramtypes", [Boolean])
            ], NgIf.prototype, "ngIf", null);
            return NgIf;
        }());
        /**
         * Before-
         * <ng-template [ngIf]="showing">
         *     <ng-content></ng-content>
         * </ng-template>
         * -After
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.text(0, 'Before-');
                instructions_1.container(1, IfTemplate, '', [1 /* SelectOnly */, 'ngIf']);
                instructions_1.text(2, '-After');
            }
            if (rf & 2 /* Update */) {
                instructions_1.elementProperty(1, 'ngIf', instructions_1.bind(ctx.showing));
            }
            function IfTemplate(rf1, ctx1) {
                if (rf1 & 1 /* Create */) {
                    instructions_1.projectionDef();
                    instructions_1.projection(0);
                }
            }
        }, [NgIf]);
        var child;
        /**
         * <child>
         *     <div>A</div>
         *     Some text
         * </child>
         */
        var App = render_util_1.createComponent('app', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.elementStart(1, 'div');
                    {
                        instructions_1.text(2, 'A');
                    }
                    instructions_1.elementEnd();
                    instructions_1.text(3, 'Some text');
                }
                instructions_1.elementEnd();
                // testing
                child = instructions_1.loadDirective(0);
            }
        }, [Child]);
        var fixture = new render_util_1.ComponentFixture(App);
        child.showing = true;
        fixture.update();
        expect(fixture.html).toEqual('<child>Before-<div>A</div>Some text-After</child>');
        child.showing = false;
        fixture.update();
        expect(fixture.html).toEqual('<child>Before--After</child>');
        child.showing = true;
        fixture.update();
        expect(fixture.html).toEqual('<child>Before-<div>A</div>Some text-After</child>');
    });
    it('should project nodes into the last ng-content', function () {
        /**
         * <div><ng-content></ng-content></div>
         * <span><ng-content></ng-content></span>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'div');
                {
                    instructions_1.projection(1);
                }
                instructions_1.elementEnd();
                instructions_1.elementStart(2, 'span');
                {
                    instructions_1.projection(3);
                }
                instructions_1.elementEnd();
            }
        });
        /**
         * <child>content</child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div></div><span>content</span></child>');
    });
    /**
     * Warning: this test is _not_ in-line with what Angular does atm.
     * Moreover the current implementation logic will result in DOM nodes
     * being re-assigned from one parent to another. Proposal: have compiler
     * to remove all but the latest occurrence of <ng-content> so we generate
     * only one P(n, m, 0) instruction. It would make it consistent with the
     * current Angular behaviour:
     * http://plnkr.co/edit/OAYkNawTDPkYBFTqovTP?p=preview
     */
    it('should project nodes into the last available ng-content', function () {
        var childCmptInstance;
        /**
         *  <ng-content></ng-content>
         *  <div>
         *  % if (show) {
         *    <ng-content></ng-content>
         *  % }
         *  </div>
         */
        var Child = render_util_1.createComponent('child', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.projection(0);
                instructions_1.elementStart(1, 'div');
                {
                    instructions_1.container(2);
                }
                instructions_1.elementEnd();
            }
            if (rf & 2 /* Update */) {
                instructions_1.containerRefreshStart(2);
                {
                    if (ctx.show) {
                        var rf0 = instructions_1.embeddedViewStart(0);
                        if (rf0 & 1 /* Create */) {
                            instructions_1.projection(0);
                        }
                        instructions_1.embeddedViewEnd();
                    }
                }
                instructions_1.containerRefreshEnd();
            }
        });
        /**
         * <child>content</child>
         */
        var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'child');
                {
                    childCmptInstance = instructions_1.loadDirective(0);
                    instructions_1.text(1, 'content');
                }
                instructions_1.elementEnd();
            }
        }, [Child]);
        var parent = render_util_1.renderComponent(Parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child>content<div></div></child>');
        childCmptInstance.show = true;
        index_1.detectChanges(parent);
        expect(render_util_1.toHtml(parent)).toEqual('<child><div>content</div></child>');
    });
    it('should project with multiple instances of a component with projection', function () {
        var ProjectionComp = render_util_1.createComponent('projection-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.text(0, 'Before');
                instructions_1.projection(1);
                instructions_1.text(2, 'After');
            }
        });
        /**
         * <projection-comp>
         *     <div>A</div>
         *     <p>123</p>
         * </projection-comp>
         * <projection-comp>
         *     <div>B</div>
         *     <p>456</p>
         * </projection-comp>
         */
        var AppComp = render_util_1.createComponent('app-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'projection-comp');
                {
                    instructions_1.elementStart(1, 'div');
                    {
                        instructions_1.text(2, 'A');
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(3, 'p');
                    {
                        instructions_1.text(4, '123');
                    }
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
                instructions_1.elementStart(5, 'projection-comp');
                {
                    instructions_1.elementStart(6, 'div');
                    {
                        instructions_1.text(7, 'B');
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(8, 'p');
                    {
                        instructions_1.text(9, '456');
                    }
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
            }
        }, [ProjectionComp]);
        var fixture = new render_util_1.ComponentFixture(AppComp);
        fixture.update();
        expect(fixture.html)
            .toEqual('<projection-comp>Before<div>A</div><p>123</p>After</projection-comp>' +
            '<projection-comp>Before<div>B</div><p>456</p>After</projection-comp>');
    });
    it('should re-project with multiple instances of a component with projection', function () {
        /**
         * Before
         * <ng-content></ng-content>
         * After
         */
        var ProjectionComp = render_util_1.createComponent('projection-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.text(0, 'Before');
                instructions_1.projection(1);
                instructions_1.text(2, 'After');
            }
        });
        /**
         * <projection-comp>
         *     <div>A</div>
         *     <ng-content></ng-content>
         *     <p>123</p>
         * </projection-comp>
         * <projection-comp>
         *     <div>B</div>
         *     <p>456</p>
         * </projection-comp>
         */
        var ProjectionParent = render_util_1.createComponent('parent-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.projectionDef();
                instructions_1.elementStart(0, 'projection-comp');
                {
                    instructions_1.elementStart(1, 'div');
                    {
                        instructions_1.text(2, 'A');
                    }
                    instructions_1.elementEnd();
                    instructions_1.projection(3, 0);
                    instructions_1.elementStart(4, 'p');
                    {
                        instructions_1.text(5, '123');
                    }
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
                instructions_1.elementStart(6, 'projection-comp');
                {
                    instructions_1.elementStart(7, 'div');
                    {
                        instructions_1.text(8, 'B');
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(9, 'p');
                    {
                        instructions_1.text(10, '456');
                    }
                    instructions_1.elementEnd();
                }
                instructions_1.elementEnd();
            }
        }, [ProjectionComp]);
        /**
         * <parent-comp>
         *    **ABC**
         * </parent-comp>
         * <parent-comp>
         *    **DEF**
         * </parent-comp>
         */
        var AppComp = render_util_1.createComponent('app-comp', function (rf, ctx) {
            if (rf & 1 /* Create */) {
                instructions_1.elementStart(0, 'parent-comp');
                {
                    instructions_1.text(1, '**ABC**');
                }
                instructions_1.elementEnd();
                instructions_1.elementStart(2, 'parent-comp');
                {
                    instructions_1.text(3, '**DEF**');
                }
                instructions_1.elementEnd();
            }
        }, [ProjectionParent]);
        var fixture = new render_util_1.ComponentFixture(AppComp);
        fixture.update();
        expect(fixture.html)
            .toEqual('<parent-comp>' +
            '<projection-comp>Before<div>A</div>**ABC**<p>123</p>After</projection-comp>' +
            '<projection-comp>Before<div>B</div><p>456</p>After</projection-comp></parent-comp>' +
            '<parent-comp>' +
            '<projection-comp>Before<div>A</div>**DEF**<p>123</p>After</projection-comp>' +
            '<projection-comp>Before<div>B</div><p>456</p>After</projection-comp></parent-comp>');
    });
    describe('with selectors', function () {
        it('should project nodes using attribute selectors', function () {
            /**
             *  <div id="first"><ng-content select="span[title=toFirst]"></ng-content></div>
             *  <div id="second"><ng-content select="span[title=toSecond]"></ng-content></div>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['span', 'title', 'toFirst']], [['span', 'title', 'toSecond']]], ['span[title=toFirst]', 'span[title=toSecond]']);
                    instructions_1.elementStart(0, 'div', ['id', 'first']);
                    {
                        instructions_1.projection(1, 1);
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['id', 'second']);
                    {
                        instructions_1.projection(3, 2);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *  <span title="toFirst">1</span>
             *  <span title="toSecond">2</span>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span', ['title', 'toFirst']);
                        {
                            instructions_1.text(2, '1');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'span', ['title', 'toSecond']);
                        {
                            instructions_1.text(4, '2');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><div id="first"><span title="toFirst">1</span></div><div id="second"><span title="toSecond">2</span></div></child>');
        });
        // https://stackblitz.com/edit/angular-psokum?file=src%2Fapp%2Fapp.module.ts
        it('should project nodes where attribute selector matches a binding', function () {
            /**
             *  <ng-content select="[title]"></ng-content>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['', 'title', '']]], ['[title]']);
                    {
                        instructions_1.projection(0, 1);
                    }
                }
            });
            /**
             * <child>
             *  <span [title]="'Some title'">Has title</span>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span', [1 /* SelectOnly */, 'title']);
                        {
                            instructions_1.text(2, 'Has title');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.elementProperty(1, 'title', instructions_1.bind('Some title'));
                }
            }, [Child]);
            var fixture = new render_util_1.ComponentFixture(Parent);
            expect(fixture.html).toEqual('<child><span title="Some title">Has title</span></child>');
        });
        it('should project nodes using class selectors', function () {
            /**
             *  <div id="first"><ng-content select="span.toFirst"></ng-content></div>
             *  <div id="second"><ng-content select="span.toSecond"></ng-content></div>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([
                        [['span', 8 /* CLASS */, 'toFirst']],
                        [['span', 8 /* CLASS */, 'toSecond']]
                    ], ['span.toFirst', 'span.toSecond']);
                    instructions_1.elementStart(0, 'div', ['id', 'first']);
                    {
                        instructions_1.projection(1, 1);
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['id', 'second']);
                    {
                        instructions_1.projection(3, 2);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *  <span class="toFirst">1</span>
             *  <span class="toSecond">2</span>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span', ['class', 'toFirst']);
                        {
                            instructions_1.text(2, '1');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'span', ['class', 'toSecond']);
                        {
                            instructions_1.text(4, '2');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><div id="first"><span class="toFirst">1</span></div><div id="second"><span class="toSecond">2</span></div></child>');
        });
        it('should project nodes using class selectors when element has multiple classes', function () {
            /**
             *  <div id="first"><ng-content select="span.toFirst"></ng-content></div>
             *  <div id="second"><ng-content select="span.toSecond"></ng-content></div>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([
                        [['span', 8 /* CLASS */, 'toFirst']],
                        [['span', 8 /* CLASS */, 'toSecond']]
                    ], ['span.toFirst', 'span.toSecond']);
                    instructions_1.elementStart(0, 'div', ['id', 'first']);
                    {
                        instructions_1.projection(1, 1);
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['id', 'second']);
                    {
                        instructions_1.projection(3, 2);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *  <span class="other toFirst">1</span>
             *  <span class="toSecond noise">2</span>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span', ['class', 'other toFirst']);
                        {
                            instructions_1.text(2, '1');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'span', ['class', 'toSecond noise']);
                        {
                            instructions_1.text(4, '2');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><div id="first"><span class="other toFirst">1</span></div><div id="second"><span class="toSecond noise">2</span></div></child>');
        });
        it('should project nodes into the first matching selector', function () {
            /**
             *  <div id="first"><ng-content select="span"></ng-content></div>
             *  <div id="second"><ng-content select="span.toSecond"></ng-content></div>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['span']], [['span', 8 /* CLASS */, 'toSecond']]], ['span', 'span.toSecond']);
                    instructions_1.elementStart(0, 'div', ['id', 'first']);
                    {
                        instructions_1.projection(1, 1);
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['id', 'second']);
                    {
                        instructions_1.projection(3, 2);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *  <span class="toFirst">1</span>
             *  <span class="toSecond">2</span>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span', ['class', 'toFirst']);
                        {
                            instructions_1.text(2, '1');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'span', ['class', 'toSecond']);
                        {
                            instructions_1.text(4, '2');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><div id="first"><span class="toFirst">1</span><span class="toSecond">2</span></div><div id="second"></div></child>');
        });
        it('should allow mixing ng-content with and without selectors', function () {
            /**
             *  <div id="first"><ng-content select="span.toFirst"></ng-content></div>
             *  <div id="second"><ng-content></ng-content></div>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['span', 8 /* CLASS */, 'toFirst']]], ['span.toFirst']);
                    instructions_1.elementStart(0, 'div', ['id', 'first']);
                    {
                        instructions_1.projection(1, 1);
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['id', 'second']);
                    {
                        instructions_1.projection(3);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *  <span class="other toFirst">1</span>
             *  <span class="toSecond noise">2</span>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span', ['class', 'toFirst']);
                        {
                            instructions_1.text(2, '1');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'span');
                        {
                            instructions_1.text(4, 'remaining');
                        }
                        instructions_1.elementEnd();
                        instructions_1.text(5, 'more remaining');
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><div id="first"><span class="toFirst">1</span></div><div id="second"><span>remaining</span>more remaining</div></child>');
        });
        it('should allow mixing ng-content with and without selectors - ng-content first', function () {
            /**
             *  <div id="first"><ng-content></ng-content></div>
             *  <div id="second"><ng-content select="span.toSecond"></ng-content></div>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['span', 8 /* CLASS */, 'toSecond']]], ['span.toSecond']);
                    instructions_1.elementStart(0, 'div', ['id', 'first']);
                    {
                        instructions_1.projection(1);
                    }
                    instructions_1.elementEnd();
                    instructions_1.elementStart(2, 'div', ['id', 'second']);
                    {
                        instructions_1.projection(3, 1);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *  <span>1</span>
             *  <span class="toSecond">2</span>
             *  remaining
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span');
                        {
                            instructions_1.text(2, '1');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'span', ['class', 'toSecond']);
                        {
                            instructions_1.text(4, '2');
                        }
                        instructions_1.elementEnd();
                        instructions_1.text(5, 'remaining');
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><div id="first"><span>1</span>remaining</div><div id="second"><span class="toSecond">2</span></div></child>');
        });
        /**
         * Descending into projected content for selector-matching purposes is not supported
         * today: http://plnkr.co/edit/MYQcNfHSTKp9KvbzJWVQ?p=preview
         */
        it('should not descend into re-projected content', function () {
            /**
             *  <ng-content select="span"></ng-content>
             *  <hr>
             *  <ng-content></ng-content>
             */
            var GrandChild = render_util_1.createComponent('grand-child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['span']]], ['span']);
                    instructions_1.projection(0, 1);
                    instructions_1.elementStart(1, 'hr');
                    instructions_1.elementEnd();
                    instructions_1.projection(2);
                }
            });
            /**
             *  <grand-child>
             *    <ng-content></ng-content>
             *    <span>in child template</span>
             *  </grand-child>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef();
                    instructions_1.elementStart(0, 'grand-child');
                    {
                        instructions_1.projection(1);
                        instructions_1.elementStart(2, 'span');
                        {
                            instructions_1.text(3, 'in child template');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [GrandChild]);
            /**
             * <child>
             *  <div>
             *    parent content
             *  </div>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'span');
                        {
                            instructions_1.text(2, 'parent content');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent))
                .toEqual('<child><grand-child><span>in child template</span><hr><span>parent content</span></grand-child></child>');
        });
        it('should match selectors on ng-content nodes with attributes', function () {
            /**
             * <ng-content select="[card-title]"></ng-content>
             * <hr>
             * <ng-content select="[card-content]"></ng-content>
             */
            var Card = render_util_1.createComponent('card', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['', 'card-title', '']], [['', 'card-content', '']]], ['[card-title]', '[card-content]']);
                    instructions_1.projection(0, 1);
                    instructions_1.elementStart(1, 'hr');
                    instructions_1.elementEnd();
                    instructions_1.projection(2, 2);
                }
            });
            /**
             * <card>
             *  <h1 card-title>Title</h1>
             *  <ng-content card-content></ng-content>
             * </card>
             */
            var CardWithTitle = render_util_1.createComponent('card-with-title', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef();
                    instructions_1.elementStart(0, 'card');
                    {
                        instructions_1.elementStart(1, 'h1', ['card-title', '']);
                        {
                            instructions_1.text(2, 'Title');
                        }
                        instructions_1.elementEnd();
                        instructions_1.projection(3, 0, ['card-content', '']);
                    }
                    instructions_1.elementEnd();
                }
            }, [Card]);
            /**
             * <card-with-title>
             *  content
             * </card-with-title>
             */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'card-with-title');
                    {
                        instructions_1.text(1, 'content');
                    }
                    instructions_1.elementEnd();
                }
            }, [CardWithTitle]);
            var app = render_util_1.renderComponent(App);
            expect(render_util_1.toHtml(app))
                .toEqual('<card-with-title><card><h1 card-title="">Title</h1><hr>content</card></card-with-title>');
        });
        it('should support ngProjectAs on elements (including <ng-content>)', function () {
            /**
             * <ng-content select="[card-title]"></ng-content>
             * <hr>
             * <ng-content select="[card-content]"></ng-content>
             */
            var Card = render_util_1.createComponent('card', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['', 'card-title', '']], [['', 'card-content', '']]], ['[card-title]', '[card-content]']);
                    instructions_1.projection(0, 1);
                    instructions_1.elementStart(1, 'hr');
                    instructions_1.elementEnd();
                    instructions_1.projection(2, 2);
                }
            });
            /**
             * <card>
             *  <h1 ngProjectAs="[card-title]>Title</h1>
             *  <ng-content ngProjectAs="[card-content]"></ng-content>
             * </card>
             */
            var CardWithTitle = render_util_1.createComponent('card-with-title', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef();
                    instructions_1.elementStart(0, 'card');
                    {
                        instructions_1.elementStart(1, 'h1', ['ngProjectAs', '[card-title]']);
                        {
                            instructions_1.text(2, 'Title');
                        }
                        instructions_1.elementEnd();
                        instructions_1.projection(3, 0, ['ngProjectAs', '[card-content]']);
                    }
                    instructions_1.elementEnd();
                }
            }, [Card]);
            /**
             * <card-with-title>
             *  content
             * </card-with-title>
             */
            var App = render_util_1.createComponent('app', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'card-with-title');
                    {
                        instructions_1.text(1, 'content');
                    }
                    instructions_1.elementEnd();
                }
            }, [CardWithTitle]);
            var app = render_util_1.renderComponent(App);
            expect(render_util_1.toHtml(app))
                .toEqual('<card-with-title><card><h1>Title</h1><hr>content</card></card-with-title>');
        });
        it('should not match selectors against node having ngProjectAs attribute', function () {
            /**
             *  <ng-content select="div"></ng-content>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['div']]], ['div']);
                    instructions_1.projection(0, 1);
                }
            });
            /**
             * <child>
             *  <div ngProjectAs="span">should not project</div>
             *  <div>should project</div>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.elementStart(1, 'div', ['ngProjectAs', 'span']);
                        {
                            instructions_1.text(2, 'should not project');
                        }
                        instructions_1.elementEnd();
                        instructions_1.elementStart(3, 'div');
                        {
                            instructions_1.text(4, 'should project');
                        }
                        instructions_1.elementEnd();
                    }
                    instructions_1.elementEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent)).toEqual('<child><div>should project</div></child>');
        });
        it('should match selectors against projected containers', function () {
            /**
             * <span>
             *  <ng-content select="div"></ng-content>
             * </span>
             */
            var Child = render_util_1.createComponent('child', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.projectionDef([[['div']]], ['div']);
                    instructions_1.elementStart(0, 'span');
                    {
                        instructions_1.projection(1, 1);
                    }
                    instructions_1.elementEnd();
                }
            });
            /**
             * <child>
             *   <div *ngIf="true">content</div>
             * </child>
             */
            var Parent = render_util_1.createComponent('parent', function (rf, ctx) {
                if (rf & 1 /* Create */) {
                    instructions_1.elementStart(0, 'child');
                    {
                        instructions_1.container(1, undefined, 'div');
                    }
                    instructions_1.elementEnd();
                }
                if (rf & 2 /* Update */) {
                    instructions_1.containerRefreshStart(1);
                    {
                        if (true) {
                            var rf0 = instructions_1.embeddedViewStart(0);
                            if (rf0 & 1 /* Create */) {
                                instructions_1.elementStart(0, 'div');
                                {
                                    instructions_1.text(1, 'content');
                                }
                                instructions_1.elementEnd();
                            }
                            instructions_1.embeddedViewEnd();
                        }
                    }
                    instructions_1.containerRefreshEnd();
                }
            }, [Child]);
            var parent = render_util_1.renderComponent(Parent);
            expect(render_util_1.toHtml(parent)).toEqual('<child><span><div>content</div></span></child>');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGVudF9zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS90ZXN0L3JlbmRlcjMvY29udGVudF9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7O0FBSUgsdUNBQTZFO0FBQzdFLDJEQUE2RDtBQUM3RCwyQ0FBK0U7QUFDL0UsaURBQXVFO0FBQ3ZFLCtEQUEwTztBQUcxTyw2Q0FBeUY7QUFFekYsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtRQUUzQjs7V0FFRztRQUNILElBQU0sS0FBSyxHQUFHLDZCQUFlLENBQUMsT0FBTyxFQUFFLFVBQVMsRUFBZSxFQUFFLEdBQVE7WUFDdkUsSUFBSSxFQUFFLGlCQUFxQixFQUFFO2dCQUMzQiw0QkFBYSxFQUFFLENBQUM7Z0JBQ2hCLDJCQUFZLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUN2QjtvQkFBRSx5QkFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUFFO2dCQUNsQix5QkFBVSxFQUFFLENBQUM7YUFDZDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUg7O1dBRUc7UUFDSCxJQUFNLE1BQU0sR0FBRyw2QkFBZSxDQUFDLFFBQVEsRUFBRSxVQUFTLEVBQWUsRUFBRSxHQUFRO1lBQ3pFLElBQUksRUFBRSxpQkFBcUIsRUFBRTtnQkFDM0IsMkJBQVksQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3pCO29CQUFFLG1CQUFJLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUFFO2dCQUN2Qix5QkFBVSxFQUFFLENBQUM7YUFDZDtRQUNILENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFFWixJQUFNLE1BQU0sR0FBRyw2QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sQ0FBQyxv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