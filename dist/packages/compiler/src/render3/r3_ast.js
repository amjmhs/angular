/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,uselessCode} checked by tsc
 */
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @record
 */
export function Node() { }
/** @type {?} */
Node.prototype.sourceSpan;
/** @type {?} */
Node.prototype.visit;
export class Text {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitText(this); }
}
if (false) {
    /** @type {?} */
    Text.prototype.value;
    /** @type {?} */
    Text.prototype.sourceSpan;
}
export class BoundText {
    /**
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(value, sourceSpan) {
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitBoundText(this); }
}
if (false) {
    /** @type {?} */
    BoundText.prototype.value;
    /** @type {?} */
    BoundText.prototype.sourceSpan;
}
export class TextAttribute {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     * @param {?=} valueSpan
     */
    constructor(name, value, sourceSpan, valueSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
        this.valueSpan = valueSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitTextAttribute(this); }
}
if (false) {
    /** @type {?} */
    TextAttribute.prototype.name;
    /** @type {?} */
    TextAttribute.prototype.value;
    /** @type {?} */
    TextAttribute.prototype.sourceSpan;
    /** @type {?} */
    TextAttribute.prototype.valueSpan;
}
export class BoundAttribute {
    /**
     * @param {?} name
     * @param {?} type
     * @param {?} securityContext
     * @param {?} value
     * @param {?} unit
     * @param {?} sourceSpan
     */
    constructor(name, type, securityContext, value, unit, sourceSpan) {
        this.name = name;
        this.type = type;
        this.securityContext = securityContext;
        this.value = value;
        this.unit = unit;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} prop
     * @return {?}
     */
    static fromBoundElementProperty(prop) {
        return new BoundAttribute(prop.name, prop.type, prop.securityContext, prop.value, prop.unit, prop.sourceSpan);
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitBoundAttribute(this); }
}
if (false) {
    /** @type {?} */
    BoundAttribute.prototype.name;
    /** @type {?} */
    BoundAttribute.prototype.type;
    /** @type {?} */
    BoundAttribute.prototype.securityContext;
    /** @type {?} */
    BoundAttribute.prototype.value;
    /** @type {?} */
    BoundAttribute.prototype.unit;
    /** @type {?} */
    BoundAttribute.prototype.sourceSpan;
}
export class BoundEvent {
    /**
     * @param {?} name
     * @param {?} handler
     * @param {?} target
     * @param {?} phase
     * @param {?} sourceSpan
     */
    constructor(name, handler, target, phase, sourceSpan) {
        this.name = name;
        this.handler = handler;
        this.target = target;
        this.phase = phase;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    static fromParsedEvent(event) {
        /** @type {?} */
        const target = event.type === 0 /* Regular */ ? event.targetOrPhase : null;
        /** @type {?} */
        const phase = event.type === 1 /* Animation */ ? event.targetOrPhase : null;
        return new BoundEvent(event.name, event.handler, target, phase, event.sourceSpan);
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitBoundEvent(this); }
}
if (false) {
    /** @type {?} */
    BoundEvent.prototype.name;
    /** @type {?} */
    BoundEvent.prototype.handler;
    /** @type {?} */
    BoundEvent.prototype.target;
    /** @type {?} */
    BoundEvent.prototype.phase;
    /** @type {?} */
    BoundEvent.prototype.sourceSpan;
}
export class Element {
    /**
     * @param {?} name
     * @param {?} attributes
     * @param {?} inputs
     * @param {?} outputs
     * @param {?} children
     * @param {?} references
     * @param {?} sourceSpan
     * @param {?} startSourceSpan
     * @param {?} endSourceSpan
     */
    constructor(name, attributes, inputs, outputs, children, references, sourceSpan, startSourceSpan, endSourceSpan) {
        this.name = name;
        this.attributes = attributes;
        this.inputs = inputs;
        this.outputs = outputs;
        this.children = children;
        this.references = references;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitElement(this); }
}
if (false) {
    /** @type {?} */
    Element.prototype.name;
    /** @type {?} */
    Element.prototype.attributes;
    /** @type {?} */
    Element.prototype.inputs;
    /** @type {?} */
    Element.prototype.outputs;
    /** @type {?} */
    Element.prototype.children;
    /** @type {?} */
    Element.prototype.references;
    /** @type {?} */
    Element.prototype.sourceSpan;
    /** @type {?} */
    Element.prototype.startSourceSpan;
    /** @type {?} */
    Element.prototype.endSourceSpan;
}
export class Template {
    /**
     * @param {?} attributes
     * @param {?} inputs
     * @param {?} children
     * @param {?} references
     * @param {?} variables
     * @param {?} sourceSpan
     * @param {?} startSourceSpan
     * @param {?} endSourceSpan
     */
    constructor(attributes, inputs, children, references, variables, sourceSpan, startSourceSpan, endSourceSpan) {
        this.attributes = attributes;
        this.inputs = inputs;
        this.children = children;
        this.references = references;
        this.variables = variables;
        this.sourceSpan = sourceSpan;
        this.startSourceSpan = startSourceSpan;
        this.endSourceSpan = endSourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitTemplate(this); }
}
if (false) {
    /** @type {?} */
    Template.prototype.attributes;
    /** @type {?} */
    Template.prototype.inputs;
    /** @type {?} */
    Template.prototype.children;
    /** @type {?} */
    Template.prototype.references;
    /** @type {?} */
    Template.prototype.variables;
    /** @type {?} */
    Template.prototype.sourceSpan;
    /** @type {?} */
    Template.prototype.startSourceSpan;
    /** @type {?} */
    Template.prototype.endSourceSpan;
}
export class Content {
    /**
     * @param {?} selectorIndex
     * @param {?} attributes
     * @param {?} sourceSpan
     */
    constructor(selectorIndex, attributes, sourceSpan) {
        this.selectorIndex = selectorIndex;
        this.attributes = attributes;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitContent(this); }
}
if (false) {
    /** @type {?} */
    Content.prototype.selectorIndex;
    /** @type {?} */
    Content.prototype.attributes;
    /** @type {?} */
    Content.prototype.sourceSpan;
}
export class Variable {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitVariable(this); }
}
if (false) {
    /** @type {?} */
    Variable.prototype.name;
    /** @type {?} */
    Variable.prototype.value;
    /** @type {?} */
    Variable.prototype.sourceSpan;
}
export class Reference {
    /**
     * @param {?} name
     * @param {?} value
     * @param {?} sourceSpan
     */
    constructor(name, value, sourceSpan) {
        this.name = name;
        this.value = value;
        this.sourceSpan = sourceSpan;
    }
    /**
     * @template Result
     * @param {?} visitor
     * @return {?}
     */
    visit(visitor) { return visitor.visitReference(this); }
}
if (false) {
    /** @type {?} */
    Reference.prototype.name;
    /** @type {?} */
    Reference.prototype.value;
    /** @type {?} */
    Reference.prototype.sourceSpan;
}
/**
 * @record
 * @template Result
 */
export function Visitor() { }
/** @type {?|undefined} */
Visitor.prototype.visit;
/** @type {?} */
Visitor.prototype.visitElement;
/** @type {?} */
Visitor.prototype.visitTemplate;
/** @type {?} */
Visitor.prototype.visitContent;
/** @type {?} */
Visitor.prototype.visitVariable;
/** @type {?} */
Visitor.prototype.visitReference;
/** @type {?} */
Visitor.prototype.visitTextAttribute;
/** @type {?} */
Visitor.prototype.visitBoundAttribute;
/** @type {?} */
Visitor.prototype.visitBoundEvent;
/** @type {?} */
Visitor.prototype.visitText;
/** @type {?} */
Visitor.prototype.visitBoundText;
export class NullVisitor {
    /**
     * @param {?} element
     * @return {?}
     */
    visitElement(element) { }
    /**
     * @param {?} template
     * @return {?}
     */
    visitTemplate(template) { }
    /**
     * @param {?} content
     * @return {?}
     */
    visitContent(content) { }
    /**
     * @param {?} variable
     * @return {?}
     */
    visitVariable(variable) { }
    /**
     * @param {?} reference
     * @return {?}
     */
    visitReference(reference) { }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitTextAttribute(attribute) { }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitBoundAttribute(attribute) { }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitBoundEvent(attribute) { }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { }
    /**
     * @param {?} text
     * @return {?}
     */
    visitBoundText(text) { }
}
export class RecursiveVisitor {
    /**
     * @param {?} element
     * @return {?}
     */
    visitElement(element) {
        visitAll(this, element.attributes);
        visitAll(this, element.children);
        visitAll(this, element.references);
    }
    /**
     * @param {?} template
     * @return {?}
     */
    visitTemplate(template) {
        visitAll(this, template.attributes);
        visitAll(this, template.children);
        visitAll(this, template.references);
        visitAll(this, template.variables);
    }
    /**
     * @param {?} content
     * @return {?}
     */
    visitContent(content) { }
    /**
     * @param {?} variable
     * @return {?}
     */
    visitVariable(variable) { }
    /**
     * @param {?} reference
     * @return {?}
     */
    visitReference(reference) { }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitTextAttribute(attribute) { }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitBoundAttribute(attribute) { }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitBoundEvent(attribute) { }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { }
    /**
     * @param {?} text
     * @return {?}
     */
    visitBoundText(text) { }
}
export class TransformVisitor {
    /**
     * @param {?} element
     * @return {?}
     */
    visitElement(element) {
        /** @type {?} */
        const newAttributes = transformAll(this, element.attributes);
        /** @type {?} */
        const newInputs = transformAll(this, element.inputs);
        /** @type {?} */
        const newOutputs = transformAll(this, element.outputs);
        /** @type {?} */
        const newChildren = transformAll(this, element.children);
        /** @type {?} */
        const newReferences = transformAll(this, element.references);
        if (newAttributes != element.attributes || newInputs != element.inputs ||
            newOutputs != element.outputs || newChildren != element.children ||
            newReferences != element.references) {
            return new Element(element.name, newAttributes, newInputs, newOutputs, newChildren, newReferences, element.sourceSpan, element.startSourceSpan, element.endSourceSpan);
        }
        return element;
    }
    /**
     * @param {?} template
     * @return {?}
     */
    visitTemplate(template) {
        /** @type {?} */
        const newAttributes = transformAll(this, template.attributes);
        /** @type {?} */
        const newInputs = transformAll(this, template.inputs);
        /** @type {?} */
        const newChildren = transformAll(this, template.children);
        /** @type {?} */
        const newReferences = transformAll(this, template.references);
        /** @type {?} */
        const newVariables = transformAll(this, template.variables);
        if (newAttributes != template.attributes || newInputs != template.inputs ||
            newChildren != template.children || newVariables != template.variables ||
            newReferences != template.references) {
            return new Template(newAttributes, newInputs, newChildren, newReferences, newVariables, template.sourceSpan, template.startSourceSpan, template.endSourceSpan);
        }
        return template;
    }
    /**
     * @param {?} content
     * @return {?}
     */
    visitContent(content) { return content; }
    /**
     * @param {?} variable
     * @return {?}
     */
    visitVariable(variable) { return variable; }
    /**
     * @param {?} reference
     * @return {?}
     */
    visitReference(reference) { return reference; }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitTextAttribute(attribute) { return attribute; }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitBoundAttribute(attribute) { return attribute; }
    /**
     * @param {?} attribute
     * @return {?}
     */
    visitBoundEvent(attribute) { return attribute; }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) { return text; }
    /**
     * @param {?} text
     * @return {?}
     */
    visitBoundText(text) { return text; }
}
/**
 * @template Result
 * @param {?} visitor
 * @param {?} nodes
 * @return {?}
 */
export function visitAll(visitor, nodes) {
    /** @type {?} */
    const result = [];
    if (visitor.visit) {
        for (const node of nodes) {
            /** @type {?} */
            const newNode = visitor.visit(node) || node.visit(visitor);
        }
    }
    else {
        for (const node of nodes) {
            /** @type {?} */
            const newNode = node.visit(visitor);
            if (newNode) {
                result.push(newNode);
            }
        }
    }
    return result;
}
/**
 * @template Result
 * @param {?} visitor
 * @param {?} nodes
 * @return {?}
 */
export function transformAll(visitor, nodes) {
    /** @type {?} */
    const result = [];
    /** @type {?} */
    let changed = false;
    for (const node of nodes) {
        /** @type {?} */
        const newNode = node.visit(visitor);
        if (newNode) {
            result.push(/** @type {?} */ (newNode));
        }
        changed = changed || newNode != node;
    }
    return changed ? result : nodes;
}
//# sourceMappingURL=r3_ast.js.map