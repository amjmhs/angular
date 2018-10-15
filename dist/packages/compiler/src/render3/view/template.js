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
import { flatten, sanitizeIdentifier } from '../../compile_metadata';
import { BindingForm, BuiltinFunctionCall, convertActionBinding, convertPropertyBinding } from '../../compiler_util/expression_converter';
import * as core from '../../core';
import { AstMemoryEfficientTransformer, FunctionCall, ImplicitReceiver, Interpolation, LiteralArray, LiteralPrimitive, PropertyRead } from '../../expression_parser/ast';
import { Lexer } from '../../expression_parser/lexer';
import { Parser } from '../../expression_parser/parser';
import * as html from '../../ml_parser/ast';
import { HtmlParser } from '../../ml_parser/html_parser';
import { WhitespaceVisitor } from '../../ml_parser/html_whitespaces';
import { DEFAULT_INTERPOLATION_CONFIG } from '../../ml_parser/interpolation_config';
import { splitNsName } from '../../ml_parser/tags';
import * as o from '../../output/output_ast';
import { DomElementSchemaRegistry } from '../../schema/dom_element_schema_registry';
import { CssSelector } from '../../selector';
import { BindingParser } from '../../template_parser/binding_parser';
import { error } from '../../util';
import * as t from '../r3_ast';
import { Identifiers as R3 } from '../r3_identifiers';
import { htmlAstToRender3Ast } from '../r3_template_transform';
import { parseStyle } from './styling';
import { CONTEXT_NAME, I18N_ATTR, I18N_ATTR_PREFIX, ID_SEPARATOR, IMPLICIT_REFERENCE, MEANING_SEPARATOR, REFERENCE_PREFIX, RENDER_FLAGS, asLiteral, invalid, mapToExpression, noop, trimTrailingNulls, unsupported } from './util';
/**
 * @param {?} type
 * @return {?}
 */
function mapBindingToInstruction(type) {
    switch (type) {
        case 0 /* Property */:
            return R3.elementProperty;
        case 1 /* Attribute */:
            return R3.elementAttribute;
        case 2 /* Class */:
            return R3.elementClassProp;
        default:
            return undefined;
    }
}
/**
 * @param {?} flags
 * @param {?} statements
 * @return {?}
 */
export function renderFlagCheckIfStmt(flags, statements) {
    return o.ifStmt(o.variable(RENDER_FLAGS).bitwiseAnd(o.literal(flags), null, false), statements);
}
export class TemplateDefinitionBuilder {
    /**
     * @param {?} constantPool
     * @param {?} contextParameter
     * @param {?} parentBindingScope
     * @param {?=} level
     * @param {?=} contextName
     * @param {?=} templateName
     * @param {?=} viewQueries
     * @param {?=} directiveMatcher
     * @param {?=} directives
     * @param {?=} pipeTypeByName
     * @param {?=} pipes
     * @param {?=} _namespace
     */
    constructor(constantPool, contextParameter, parentBindingScope, level = 0, contextName, templateName, viewQueries, directiveMatcher, directives, pipeTypeByName, pipes, _namespace) {
        this.constantPool = constantPool;
        this.contextParameter = contextParameter;
        this.level = level;
        this.contextName = contextName;
        this.templateName = templateName;
        this.viewQueries = viewQueries;
        this.directiveMatcher = directiveMatcher;
        this.directives = directives;
        this.pipeTypeByName = pipeTypeByName;
        this.pipes = pipes;
        this._namespace = _namespace;
        this._dataIndex = 0;
        this._bindingContext = 0;
        this._prefixCode = [];
        this._creationCode = [];
        this._variableCode = [];
        this._bindingCode = [];
        this._postfixCode = [];
        this._unsupported = unsupported;
        this._inI18nSection = false;
        this._i18nSectionIndex = -1;
        this._phToNodeIdxes = [{}];
        this._pureFunctionSlots = 0;
        // These should be handled in the template or element directly.
        this.visitReference = invalid;
        this.visitVariable = invalid;
        this.visitTextAttribute = invalid;
        this.visitBoundAttribute = invalid;
        this.visitBoundEvent = invalid;
        // view queries can take up space in data and allocation happens earlier (in the "viewQuery"
        // function)
        this._dataIndex = viewQueries.length;
        this._bindingScope =
            parentBindingScope.nestedScope((lhsVar, expression) => {
                this._bindingCode.push(lhsVar.set(expression).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
            });
        this._valueConverter = new ValueConverter(constantPool, () => this.allocateDataSlot(), (numSlots) => this._pureFunctionSlots += numSlots, (name, localName, slot, value) => {
            /** @type {?} */
            const pipeType = pipeTypeByName.get(name);
            if (pipeType) {
                this.pipes.add(pipeType);
            }
            this._bindingScope.set(localName, value);
            this._creationCode.push(o.importExpr(R3.pipe).callFn([o.literal(slot), o.literal(name)]).toStmt());
        });
    }
    /**
     * @param {?} nodes
     * @param {?} variables
     * @param {?=} hasNgContent
     * @param {?=} ngContentSelectors
     * @return {?}
     */
    buildTemplateFunction(nodes, variables, hasNgContent = false, ngContentSelectors = []) {
        if (this._namespace !== R3.namespaceHTML) {
            this.instruction(this._creationCode, null, this._namespace);
        }
        // Create variable bindings
        for (const variable of variables) {
            /** @type {?} */
            const variableName = variable.name;
            /** @type {?} */
            const expression = o.variable(this.contextParameter).prop(variable.value || IMPLICIT_REFERENCE);
            /** @type {?} */
            const scopedName = this._bindingScope.freshReferenceName();
            // Add the reference to the local scope.
            this._bindingScope.set(variableName, o.variable(variableName + scopedName), expression);
        }
        // Output a `ProjectionDef` instruction when some `<ng-content>` are present
        if (hasNgContent) {
            /** @type {?} */
            const parameters = [];
            // Only selectors with a non-default value are generated
            if (ngContentSelectors.length > 1) {
                /** @type {?} */
                const r3Selectors = ngContentSelectors.map(s => core.parseSelectorToR3Selector(s));
                /** @type {?} */
                const parsed = this.constantPool.getConstLiteral(asLiteral(r3Selectors), true);
                /** @type {?} */
                const unParsed = this.constantPool.getConstLiteral(asLiteral(ngContentSelectors), true);
                parameters.push(parsed, unParsed);
            }
            this.instruction(this._creationCode, null, R3.projectionDef, ...parameters);
        }
        t.visitAll(this, nodes);
        if (this._pureFunctionSlots > 0) {
            this.instruction(this._creationCode, null, R3.reserveSlots, o.literal(this._pureFunctionSlots));
        }
        /** @type {?} */
        const creationCode = this._creationCode.length > 0 ?
            [renderFlagCheckIfStmt(1 /* Create */, this._creationCode)] :
            [];
        /** @type {?} */
        const updateCode = this._bindingCode.length > 0 ?
            [renderFlagCheckIfStmt(2 /* Update */, this._bindingCode)] :
            [];
        // Generate maps of placeholder name to node indexes
        // TODO(vicb): This is a WIP, not fully supported yet
        for (const phToNodeIdx of this._phToNodeIdxes) {
            if (Object.keys(phToNodeIdx).length > 0) {
                /** @type {?} */
                const scopedName = this._bindingScope.freshReferenceName();
                /** @type {?} */
                const phMap = o.variable(scopedName)
                    .set(mapToExpression(phToNodeIdx, true))
                    .toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]);
                this._prefixCode.push(phMap);
            }
        }
        return o.fn([new o.FnParam(RENDER_FLAGS, o.NUMBER_TYPE), new o.FnParam(this.contextParameter, null)], [
            // Temporary variable declarations for query refresh (i.e. let _t: any;)
            ...this._prefixCode,
            // Creating mode (i.e. if (rf & RenderFlags.Create) { ... })
            ...creationCode,
            // Temporary variable declarations for local refs (i.e. const tmp = ld(1) as any)
            ...this._variableCode,
            // Binding and refresh mode (i.e. if (rf & RenderFlags.Update) {...})
            ...updateCode,
            // Nested templates (i.e. function CompTemplate() {})
            ...this._postfixCode
        ], o.INFERRED_TYPE, null, this.templateName);
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) { return this._bindingScope.get(name); }
    /**
     * @param {?} ngContent
     * @return {?}
     */
    visitContent(ngContent) {
        /** @type {?} */
        const slot = this.allocateDataSlot();
        /** @type {?} */
        const selectorIndex = ngContent.selectorIndex;
        /** @type {?} */
        const parameters = [o.literal(slot)];
        /** @type {?} */
        const attributeAsList = [];
        ngContent.attributes.forEach((attribute) => {
            /** @type {?} */
            const name = attribute.name;
            if (name !== 'select') {
                attributeAsList.push(name, attribute.value);
            }
        });
        if (attributeAsList.length > 0) {
            parameters.push(o.literal(selectorIndex), asLiteral(attributeAsList));
        }
        else if (selectorIndex !== 0) {
            parameters.push(o.literal(selectorIndex));
        }
        this.instruction(this._creationCode, ngContent.sourceSpan, R3.projection, ...parameters);
    }
    /**
     * @param {?} namespaceKey
     * @return {?}
     */
    getNamespaceInstruction(namespaceKey) {
        switch (namespaceKey) {
            case 'math':
                return R3.namespaceMathML;
            case 'svg':
                return R3.namespaceSVG;
            default:
                return R3.namespaceHTML;
        }
    }
    /**
     * @param {?} nsInstruction
     * @param {?} element
     * @return {?}
     */
    addNamespaceInstruction(nsInstruction, element) {
        this._namespace = nsInstruction;
        this.instruction(this._creationCode, element.sourceSpan, nsInstruction);
    }
    /**
     * @param {?} element
     * @return {?}
     */
    visitElement(element) {
        /** @type {?} */
        const elementIndex = this.allocateDataSlot();
        /** @type {?} */
        const referenceDataSlots = new Map();
        /** @type {?} */
        const wasInI18nSection = this._inI18nSection;
        /** @type {?} */
        const outputAttrs = {};
        /** @type {?} */
        const attrI18nMetas = {};
        /** @type {?} */
        let i18nMeta = '';
        const [namespaceKey, elementName] = splitNsName(element.name);
        // Elements inside i18n sections are replaced with placeholders
        // TODO(vicb): nested elements are a WIP in this phase
        if (this._inI18nSection) {
            /** @type {?} */
            const phName = element.name.toLowerCase();
            if (!this._phToNodeIdxes[this._i18nSectionIndex][phName]) {
                this._phToNodeIdxes[this._i18nSectionIndex][phName] = [];
            }
            this._phToNodeIdxes[this._i18nSectionIndex][phName].push(elementIndex);
        }
        // Handle i18n attributes
        for (const attr of element.attributes) {
            /** @type {?} */
            const name = attr.name;
            /** @type {?} */
            const value = attr.value;
            if (name === I18N_ATTR) {
                if (this._inI18nSection) {
                    throw new Error(`Could not mark an element as translatable inside of a translatable section`);
                }
                this._inI18nSection = true;
                this._i18nSectionIndex++;
                this._phToNodeIdxes[this._i18nSectionIndex] = {};
                i18nMeta = value;
            }
            else if (name.startsWith(I18N_ATTR_PREFIX)) {
                attrI18nMetas[name.slice(I18N_ATTR_PREFIX.length)] = value;
            }
            else {
                outputAttrs[name] = value;
            }
        }
        // Match directives on non i18n attributes
        if (this.directiveMatcher) {
            /** @type {?} */
            const selector = createCssSelector(element.name, outputAttrs);
            this.directiveMatcher.match(selector, (sel, staticType) => { this.directives.add(staticType); });
        }
        /** @type {?} */
        const parameters = [
            o.literal(elementIndex),
            o.literal(elementName),
        ];
        /** @type {?} */
        const i18nMessages = [];
        /** @type {?} */
        const attributes = [];
        /** @type {?} */
        const initialStyleDeclarations = [];
        /** @type {?} */
        const initialClassDeclarations = [];
        /** @type {?} */
        const styleInputs = [];
        /** @type {?} */
        const classInputs = [];
        /** @type {?} */
        const allOtherInputs = [];
        element.inputs.forEach((input) => {
            switch (input.type) {
                // [attr.style] or [attr.class] should not be treated as styling-based
                // bindings since they are intended to be written directly to the attr
                // and therefore will skip all style/class resolution that is present
                // with style="", [style]="" and [style.prop]="", class="",
                // [class.prop]="". [class]="" assignments
                case 0 /* Property */:
                    if (input.name == 'style') {
                        // this should always go first in the compilation (for [style])
                        styleInputs.splice(0, 0, input);
                    }
                    else if (isClassBinding(input)) {
                        // this should always go first in the compilation (for [class])
                        classInputs.splice(0, 0, input);
                    }
                    else {
                        allOtherInputs.push(input);
                    }
                    break;
                case 3 /* Style */:
                    styleInputs.push(input);
                    break;
                case 2 /* Class */:
                    classInputs.push(input);
                    break;
                default:
                    allOtherInputs.push(input);
                    break;
            }
        });
        /** @type {?} */
        let currStyleIndex = 0;
        /** @type {?} */
        let currClassIndex = 0;
        /** @type {?} */
        let staticStylesMap = null;
        /** @type {?} */
        let staticClassesMap = null;
        /** @type {?} */
        const stylesIndexMap = {};
        /** @type {?} */
        const classesIndexMap = {};
        Object.getOwnPropertyNames(outputAttrs).forEach(name => {
            /** @type {?} */
            const value = outputAttrs[name];
            if (name == 'style') {
                staticStylesMap = parseStyle(value);
                Object.keys(staticStylesMap).forEach(prop => { stylesIndexMap[prop] = currStyleIndex++; });
            }
            else if (name == 'class') {
                staticClassesMap = {};
                value.split(/\s+/g).forEach(className => {
                    classesIndexMap[className] = currClassIndex++; /** @type {?} */
                    ((staticClassesMap))[className] = true;
                });
            }
            else {
                attributes.push(o.literal(name));
                if (attrI18nMetas.hasOwnProperty(name)) {
                    /** @type {?} */
                    const meta = parseI18nMeta(attrI18nMetas[name]);
                    /** @type {?} */
                    const variable = this.constantPool.getTranslation(value, meta);
                    attributes.push(variable);
                }
                else {
                    attributes.push(o.literal(value));
                }
            }
        });
        /** @type {?} */
        let hasMapBasedStyling = false;
        for (let i = 0; i < styleInputs.length; i++) {
            /** @type {?} */
            const input = styleInputs[i];
            /** @type {?} */
            const isMapBasedStyleBinding = i === 0 && input.name === 'style';
            if (isMapBasedStyleBinding) {
                hasMapBasedStyling = true;
            }
            else if (!stylesIndexMap.hasOwnProperty(input.name)) {
                stylesIndexMap[input.name] = currStyleIndex++;
            }
        }
        for (let i = 0; i < classInputs.length; i++) {
            /** @type {?} */
            const input = classInputs[i];
            /** @type {?} */
            const isMapBasedClassBinding = i === 0 && isClassBinding(input);
            if (!isMapBasedClassBinding && !stylesIndexMap.hasOwnProperty(input.name)) {
                classesIndexMap[input.name] = currClassIndex++;
            }
        }
        /** @type {?} */
        let useDefaultStyleSanitizer = hasMapBasedStyling;
        // this will build the instructions so that they fall into the following syntax
        // => [prop1, prop2, prop3, 0, prop1, value1, prop2, value2]
        Object.keys(stylesIndexMap).forEach(prop => {
            useDefaultStyleSanitizer = useDefaultStyleSanitizer || isStyleSanitizable(prop);
            initialStyleDeclarations.push(o.literal(prop));
        });
        if (staticStylesMap) {
            initialStyleDeclarations.push(o.literal(1 /* VALUES_MODE */));
            Object.keys(staticStylesMap).forEach(prop => {
                initialStyleDeclarations.push(o.literal(prop));
                /** @type {?} */
                const value = /** @type {?} */ ((staticStylesMap))[prop];
                initialStyleDeclarations.push(o.literal(value));
            });
        }
        Object.keys(classesIndexMap).forEach(prop => {
            initialClassDeclarations.push(o.literal(prop));
        });
        if (staticClassesMap) {
            initialClassDeclarations.push(o.literal(1 /* VALUES_MODE */));
            Object.keys(staticClassesMap).forEach(className => {
                initialClassDeclarations.push(o.literal(className));
                initialClassDeclarations.push(o.literal(true));
            });
        }
        /** @type {?} */
        const hasStylingInstructions = initialStyleDeclarations.length || styleInputs.length ||
            initialClassDeclarations.length || classInputs.length;
        /** @type {?} */
        const attrArg = attributes.length > 0 ?
            this.constantPool.getConstLiteral(o.literalArr(attributes), true) :
            o.TYPED_NULL_EXPR;
        parameters.push(attrArg);
        if (element.references && element.references.length > 0) {
            /** @type {?} */
            const references = flatten(element.references.map(reference => {
                /** @type {?} */
                const slot = this.allocateDataSlot();
                referenceDataSlots.set(reference.name, slot);
                /** @type {?} */
                const variableName = this._bindingScope.freshReferenceName();
                this._variableCode.push(o.variable(variableName, o.INFERRED_TYPE)
                    .set(o.importExpr(R3.load).callFn([o.literal(slot)]))
                    .toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
                this._bindingScope.set(reference.name, o.variable(variableName));
                return [reference.name, reference.value];
            }));
            parameters.push(this.constantPool.getConstLiteral(asLiteral(references), true));
        }
        else {
            parameters.push(o.TYPED_NULL_EXPR);
        }
        // Generate the instruction create element instruction
        if (i18nMessages.length > 0) {
            this._creationCode.push(...i18nMessages);
        }
        /** @type {?} */
        const wasInNamespace = this._namespace;
        /** @type {?} */
        const currentNamespace = this.getNamespaceInstruction(namespaceKey);
        // If the namespace is changing now, include an instruction to change it
        // during element creation.
        if (currentNamespace !== wasInNamespace) {
            this.addNamespaceInstruction(currentNamespace, element);
        }
        /** @type {?} */
        const implicit = o.variable(CONTEXT_NAME);
        /** @type {?} */
        const createSelfClosingInstruction = !hasStylingInstructions && element.children.length === 0 && element.outputs.length === 0;
        if (createSelfClosingInstruction) {
            this.instruction(this._creationCode, element.sourceSpan, R3.element, ...trimTrailingNulls(parameters));
        }
        else {
            // Generate the instruction create element instruction
            if (i18nMessages.length > 0) {
                this._creationCode.push(...i18nMessages);
            }
            this.instruction(this._creationCode, element.sourceSpan, R3.elementStart, ...trimTrailingNulls(parameters));
            // initial styling for static style="..." attributes
            if (hasStylingInstructions) {
                /** @type {?} */
                const paramsList = [];
                if (initialClassDeclarations.length) {
                    // the template compiler handles initial class styling (e.g. class="foo") values
                    // in a special command called `elementClass` so that the initial class
                    // can be processed during runtime. These initial class values are bound to
                    // a constant because the inital class values do not change (since they're static).
                    paramsList.push(this.constantPool.getConstLiteral(o.literalArr(initialClassDeclarations), true));
                }
                else if (initialStyleDeclarations.length || useDefaultStyleSanitizer) {
                    // no point in having an extra `null` value unless there are follow-up params
                    paramsList.push(o.NULL_EXPR);
                }
                if (initialStyleDeclarations.length) {
                    // the template compiler handles initial style (e.g. style="foo") values
                    // in a special command called `elementStyle` so that the initial styles
                    // can be processed during runtime. These initial styles values are bound to
                    // a constant because the inital style values do not change (since they're static).
                    paramsList.push(this.constantPool.getConstLiteral(o.literalArr(initialStyleDeclarations), true));
                }
                else if (useDefaultStyleSanitizer) {
                    // no point in having an extra `null` value unless there are follow-up params
                    paramsList.push(o.NULL_EXPR);
                }
                if (useDefaultStyleSanitizer) {
                    paramsList.push(o.importExpr(R3.defaultStyleSanitizer));
                }
                this._creationCode.push(o.importExpr(R3.elementStyling).callFn(paramsList).toStmt());
            }
            // Generate Listeners (outputs)
            element.outputs.forEach((outputAst) => {
                /** @type {?} */
                const elName = sanitizeIdentifier(element.name);
                /** @type {?} */
                const evName = sanitizeIdentifier(outputAst.name);
                /** @type {?} */
                const functionName = `${this.templateName}_${elName}_${evName}_listener`;
                /** @type {?} */
                const localVars = [];
                /** @type {?} */
                const bindingScope = this._bindingScope.nestedScope((lhsVar, rhsExpression) => {
                    localVars.push(lhsVar.set(rhsExpression).toDeclStmt(o.INFERRED_TYPE, [o.StmtModifier.Final]));
                });
                /** @type {?} */
                const bindingExpr = convertActionBinding(bindingScope, implicit, outputAst.handler, 'b', () => error('Unexpected interpolation'));
                /** @type {?} */
                const handler = o.fn([new o.FnParam('$event', o.DYNAMIC_TYPE)], [...localVars, ...bindingExpr.render3Stmts], o.INFERRED_TYPE, null, functionName);
                this.instruction(this._creationCode, outputAst.sourceSpan, R3.listener, o.literal(outputAst.name), handler);
            });
        }
        if ((styleInputs.length || classInputs.length) && hasStylingInstructions) {
            /** @type {?} */
            const indexLiteral = o.literal(elementIndex);
            /** @type {?} */
            const firstStyle = styleInputs[0];
            /** @type {?} */
            const mapBasedStyleInput = firstStyle && firstStyle.name == 'style' ? firstStyle : null;
            /** @type {?} */
            const firstClass = classInputs[0];
            /** @type {?} */
            const mapBasedClassInput = firstClass && isClassBinding(firstClass) ? firstClass : null;
            /** @type {?} */
            const stylingInput = mapBasedStyleInput || mapBasedClassInput;
            if (stylingInput) {
                /** @type {?} */
                const params = [];
                if (mapBasedClassInput) {
                    params.push(this.convertPropertyBinding(implicit, mapBasedClassInput.value, true));
                }
                else if (mapBasedStyleInput) {
                    params.push(o.NULL_EXPR);
                }
                if (mapBasedStyleInput) {
                    params.push(this.convertPropertyBinding(implicit, mapBasedStyleInput.value, true));
                }
                this.instruction(this._bindingCode, stylingInput.sourceSpan, R3.elementStylingMap, indexLiteral, ...params);
            }
            /** @type {?} */
            let lastInputCommand = null;
            if (styleInputs.length) {
                /** @type {?} */
                let i = mapBasedStyleInput ? 1 : 0;
                for (i; i < styleInputs.length; i++) {
                    /** @type {?} */
                    const input = styleInputs[i];
                    /** @type {?} */
                    const convertedBinding = this.convertPropertyBinding(implicit, input.value, true);
                    /** @type {?} */
                    const params = [convertedBinding];
                    /** @type {?} */
                    const sanitizationRef = resolveSanitizationFn(input, input.securityContext);
                    if (sanitizationRef) {
                        params.push(sanitizationRef);
                    }
                    /** @type {?} */
                    const key = input.name;
                    /** @type {?} */
                    const styleIndex = /** @type {?} */ ((stylesIndexMap[key]));
                    this.instruction(this._bindingCode, input.sourceSpan, R3.elementStyleProp, indexLiteral, o.literal(styleIndex), ...params);
                }
                lastInputCommand = styleInputs[styleInputs.length - 1];
            }
            if (classInputs.length) {
                /** @type {?} */
                let i = mapBasedClassInput ? 1 : 0;
                for (i; i < classInputs.length; i++) {
                    /** @type {?} */
                    const input = classInputs[i];
                    /** @type {?} */
                    const convertedBinding = this.convertPropertyBinding(implicit, input.value, true);
                    /** @type {?} */
                    const params = [convertedBinding];
                    /** @type {?} */
                    const sanitizationRef = resolveSanitizationFn(input, input.securityContext);
                    if (sanitizationRef) {
                        params.push(sanitizationRef);
                    }
                    /** @type {?} */
                    const key = input.name;
                    /** @type {?} */
                    const classIndex = /** @type {?} */ ((classesIndexMap[key]));
                    this.instruction(this._bindingCode, input.sourceSpan, R3.elementClassProp, indexLiteral, o.literal(classIndex), ...params);
                }
                lastInputCommand = classInputs[classInputs.length - 1];
            }
            this.instruction(this._bindingCode, /** @type {?} */ ((lastInputCommand)).sourceSpan, R3.elementStylingApply, indexLiteral);
        }
        // Generate element input bindings
        allOtherInputs.forEach((input) => {
            if (input.type === 4 /* Animation */) {
                console.error('warning: animation bindings not yet supported');
                return;
            }
            /** @type {?} */
            const convertedBinding = this.convertPropertyBinding(implicit, input.value);
            /** @type {?} */
            const instruction = mapBindingToInstruction(input.type);
            if (instruction) {
                /** @type {?} */
                const params = [convertedBinding];
                /** @type {?} */
                const sanitizationRef = resolveSanitizationFn(input, input.securityContext);
                if (sanitizationRef) {
                    params.push(sanitizationRef);
                }
                // TODO(chuckj): runtime: security context?
                this.instruction(this._bindingCode, input.sourceSpan, instruction, o.literal(elementIndex), o.literal(input.name), ...params);
            }
            else {
                this._unsupported(`binding type ${input.type}`);
            }
        });
        // Traverse element child nodes
        if (this._inI18nSection && element.children.length == 1 &&
            element.children[0] instanceof t.Text) {
            /** @type {?} */
            const text = /** @type {?} */ (element.children[0]);
            this.visitSingleI18nTextChild(text, i18nMeta);
        }
        else {
            t.visitAll(this, element.children);
        }
        if (!createSelfClosingInstruction) {
            // Finish element construction mode.
            this.instruction(this._creationCode, element.endSourceSpan || element.sourceSpan, R3.elementEnd);
        }
        // Restore the state before exiting this node
        this._inI18nSection = wasInI18nSection;
    }
    /**
     * @param {?} template
     * @return {?}
     */
    visitTemplate(template) {
        /** @type {?} */
        const templateIndex = this.allocateDataSlot();
        /** @type {?} */
        let elName = '';
        if (template.children.length === 1 && template.children[0] instanceof t.Element) {
            // When the template as a single child, derive the context name from the tag
            elName = sanitizeIdentifier((/** @type {?} */ (template.children[0])).name);
        }
        /** @type {?} */
        const contextName = elName ? `${this.contextName}_${elName}` : '';
        /** @type {?} */
        const templateName = contextName ? `${contextName}_Template_${templateIndex}` : `Template_${templateIndex}`;
        /** @type {?} */
        const templateContext = `ctx${this.level}`;
        /** @type {?} */
        const parameters = [
            o.literal(templateIndex),
            o.variable(templateName),
            o.TYPED_NULL_EXPR,
        ];
        /** @type {?} */
        const attributeNames = [];
        /** @type {?} */
        const attributeMap = {};
        template.attributes.forEach(a => {
            attributeNames.push(asLiteral(a.name), asLiteral(''));
            attributeMap[a.name] = a.value;
        });
        // Match directives on template attributes
        if (this.directiveMatcher) {
            /** @type {?} */
            const selector = createCssSelector('ng-template', attributeMap);
            this.directiveMatcher.match(selector, (cssSelector, staticType) => { this.directives.add(staticType); });
        }
        if (attributeNames.length) {
            parameters.push(this.constantPool.getConstLiteral(o.literalArr(attributeNames), true));
        }
        // e.g. C(1, C1Template)
        this.instruction(this._creationCode, template.sourceSpan, R3.containerCreate, ...trimTrailingNulls(parameters));
        /** @type {?} */
        const context = o.variable(CONTEXT_NAME);
        template.inputs.forEach(input => {
            /** @type {?} */
            const convertedBinding = this.convertPropertyBinding(context, input.value);
            this.instruction(this._bindingCode, template.sourceSpan, R3.elementProperty, o.literal(templateIndex), o.literal(input.name), convertedBinding);
        });
        /** @type {?} */
        const templateVisitor = new TemplateDefinitionBuilder(this.constantPool, templateContext, this._bindingScope, this.level + 1, contextName, templateName, [], this.directiveMatcher, this.directives, this.pipeTypeByName, this.pipes, this._namespace);
        /** @type {?} */
        const templateFunctionExpr = templateVisitor.buildTemplateFunction(template.children, template.variables);
        this._postfixCode.push(templateFunctionExpr.toDeclStmt(templateName, null));
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitBoundText(text) {
        /** @type {?} */
        const nodeIndex = this.allocateDataSlot();
        this.instruction(this._creationCode, text.sourceSpan, R3.text, o.literal(nodeIndex));
        this.instruction(this._bindingCode, text.sourceSpan, R3.textBinding, o.literal(nodeIndex), this.convertPropertyBinding(o.variable(CONTEXT_NAME), text.value));
    }
    /**
     * @param {?} text
     * @return {?}
     */
    visitText(text) {
        this.instruction(this._creationCode, text.sourceSpan, R3.text, o.literal(this.allocateDataSlot()), o.literal(text.value));
    }
    /**
     * @param {?} text
     * @param {?} i18nMeta
     * @return {?}
     */
    visitSingleI18nTextChild(text, i18nMeta) {
        /** @type {?} */
        const meta = parseI18nMeta(i18nMeta);
        /** @type {?} */
        const variable = this.constantPool.getTranslation(text.value, meta);
        this.instruction(this._creationCode, text.sourceSpan, R3.text, o.literal(this.allocateDataSlot()), variable);
    }
    /**
     * @return {?}
     */
    allocateDataSlot() { return this._dataIndex++; }
    /**
     * @return {?}
     */
    bindingContext() { return `${this._bindingContext++}`; }
    /**
     * @param {?} statements
     * @param {?} span
     * @param {?} reference
     * @param {...?} params
     * @return {?}
     */
    instruction(statements, span, reference, ...params) {
        statements.push(o.importExpr(reference, null, span).callFn(params, span).toStmt());
    }
    /**
     * @param {?} implicit
     * @param {?} value
     * @param {?=} skipBindFn
     * @return {?}
     */
    convertPropertyBinding(implicit, value, skipBindFn) {
        /** @type {?} */
        const pipesConvertedValue = value.visit(this._valueConverter);
        if (pipesConvertedValue instanceof Interpolation) {
            /** @type {?} */
            const convertedPropertyBinding = convertPropertyBinding(this, implicit, pipesConvertedValue, this.bindingContext(), BindingForm.TrySimple, interpolate);
            this._bindingCode.push(...convertedPropertyBinding.stmts);
            return convertedPropertyBinding.currValExpr;
        }
        else {
            /** @type {?} */
            const convertedPropertyBinding = convertPropertyBinding(this, implicit, pipesConvertedValue, this.bindingContext(), BindingForm.TrySimple, () => error('Unexpected interpolation'));
            this._bindingCode.push(...convertedPropertyBinding.stmts);
            /** @type {?} */
            const valExpr = convertedPropertyBinding.currValExpr;
            return skipBindFn ? valExpr : o.importExpr(R3.bind).callFn([valExpr]);
        }
    }
}
if (false) {
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._dataIndex;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._bindingContext;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._prefixCode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._creationCode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._variableCode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._bindingCode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._postfixCode;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._valueConverter;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._unsupported;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._bindingScope;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._inI18nSection;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._i18nSectionIndex;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._phToNodeIdxes;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._pureFunctionSlots;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitReference;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitVariable;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitTextAttribute;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitBoundAttribute;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.visitBoundEvent;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.constantPool;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.contextParameter;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.level;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.contextName;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.templateName;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.viewQueries;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.directiveMatcher;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.directives;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.pipeTypeByName;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype.pipes;
    /** @type {?} */
    TemplateDefinitionBuilder.prototype._namespace;
}
class ValueConverter extends AstMemoryEfficientTransformer {
    /**
     * @param {?} constantPool
     * @param {?} allocateSlot
     * @param {?} allocatePureFunctionSlots
     * @param {?} definePipe
     */
    constructor(constantPool, allocateSlot, allocatePureFunctionSlots, definePipe) {
        super();
        this.constantPool = constantPool;
        this.allocateSlot = allocateSlot;
        this.allocatePureFunctionSlots = allocatePureFunctionSlots;
        this.definePipe = definePipe;
    }
    /**
     * @param {?} pipe
     * @param {?} context
     * @return {?}
     */
    visitPipe(pipe, context) {
        /** @type {?} */
        const slot = this.allocateSlot();
        /** @type {?} */
        const slotPseudoLocal = `PIPE:${slot}`;
        /** @type {?} */
        const pureFunctionSlot = this.allocatePureFunctionSlots(2 + pipe.args.length);
        /** @type {?} */
        const target = new PropertyRead(pipe.span, new ImplicitReceiver(pipe.span), slotPseudoLocal);
        const { identifier, isVarLength } = pipeBindingCallInfo(pipe.args);
        this.definePipe(pipe.name, slotPseudoLocal, slot, o.importExpr(identifier));
        /** @type {?} */
        const args = [pipe.exp, ...pipe.args];
        /** @type {?} */
        const convertedArgs = isVarLength ? this.visitAll([new LiteralArray(pipe.span, args)]) : this.visitAll(args);
        return new FunctionCall(pipe.span, target, [
            new LiteralPrimitive(pipe.span, slot),
            new LiteralPrimitive(pipe.span, pureFunctionSlot),
            ...convertedArgs,
        ]);
    }
    /**
     * @param {?} array
     * @param {?} context
     * @return {?}
     */
    visitLiteralArray(array, context) {
        return new BuiltinFunctionCall(array.span, this.visitAll(array.expressions), values => {
            /** @type {?} */
            const literal = o.literalArr(values);
            return values.every(a => a.isConstant()) ?
                this.constantPool.getConstLiteral(literal, true) :
                getLiteralFactory(this.constantPool, literal, this.allocatePureFunctionSlots);
        });
    }
    /**
     * @param {?} map
     * @param {?} context
     * @return {?}
     */
    visitLiteralMap(map, context) {
        return new BuiltinFunctionCall(map.span, this.visitAll(map.values), values => {
            /** @type {?} */
            const literal = o.literalMap(values.map((value, index) => ({ key: map.keys[index].key, value, quoted: map.keys[index].quoted })));
            return values.every(a => a.isConstant()) ?
                this.constantPool.getConstLiteral(literal, true) :
                getLiteralFactory(this.constantPool, literal, this.allocatePureFunctionSlots);
        });
    }
}
if (false) {
    /** @type {?} */
    ValueConverter.prototype.constantPool;
    /** @type {?} */
    ValueConverter.prototype.allocateSlot;
    /** @type {?} */
    ValueConverter.prototype.allocatePureFunctionSlots;
    /** @type {?} */
    ValueConverter.prototype.definePipe;
}
/** @type {?} */
const pipeBindingIdentifiers = [R3.pipeBind1, R3.pipeBind2, R3.pipeBind3, R3.pipeBind4];
/**
 * @param {?} args
 * @return {?}
 */
function pipeBindingCallInfo(args) {
    /** @type {?} */
    const identifier = pipeBindingIdentifiers[args.length];
    return {
        identifier: identifier || R3.pipeBindV,
        isVarLength: !identifier,
    };
}
/** @type {?} */
const pureFunctionIdentifiers = [
    R3.pureFunction0, R3.pureFunction1, R3.pureFunction2, R3.pureFunction3, R3.pureFunction4,
    R3.pureFunction5, R3.pureFunction6, R3.pureFunction7, R3.pureFunction8
];
/**
 * @param {?} args
 * @return {?}
 */
function pureFunctionCallInfo(args) {
    /** @type {?} */
    const identifier = pureFunctionIdentifiers[args.length];
    return {
        identifier: identifier || R3.pureFunctionV,
        isVarLength: !identifier,
    };
}
/**
 * @param {?} constantPool
 * @param {?} literal
 * @param {?} allocateSlots
 * @return {?}
 */
function getLiteralFactory(constantPool, literal, allocateSlots) {
    const { literalFactory, literalFactoryArguments } = constantPool.getLiteralFactory(literal);
    /** @type {?} */
    const startSlot = allocateSlots(1 + literalFactoryArguments.length);
    literalFactoryArguments.length > 0 || error(`Expected arguments to a literal factory function`);
    const { identifier, isVarLength } = pureFunctionCallInfo(literalFactoryArguments);
    /** @type {?} */
    const args = [
        o.literal(startSlot),
        literalFactory,
    ];
    if (isVarLength) {
        args.push(o.literalArr(literalFactoryArguments));
    }
    else {
        args.push(...literalFactoryArguments);
    }
    return o.importExpr(identifier).callFn(args);
}
/** @typedef {?} */
var DeclareLocalVarCallback;
export { DeclareLocalVarCallback };
export class BindingScope {
    /**
     * @param {?=} parent
     * @param {?=} declareLocalVarCallback
     */
    constructor(parent = null, declareLocalVarCallback = noop) {
        this.parent = parent;
        this.declareLocalVarCallback = declareLocalVarCallback;
        /**
         * Keeps a map from local variables to their expressions.
         *
         * This is used when one refers to variable such as: 'let abc = a.b.c`.
         * - key to the map is the string literal `"abc"`.
         * - value `lhs` is the left hand side which is an AST representing `abc`.
         * - value `rhs` is the right hand side which is an AST representing `a.b.c`.
         * - value `declared` is true if the `declareLocalVarCallback` has been called for this scope
         * already.
         */
        this.map = new Map();
        this.referenceNameIndex = 0;
    }
    /**
     * @return {?}
     */
    static get ROOT_SCOPE() {
        if (!BindingScope._ROOT_SCOPE) {
            BindingScope._ROOT_SCOPE = new BindingScope().set('$event', o.variable('$event'));
        }
        return BindingScope._ROOT_SCOPE;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    get(name) {
        /** @type {?} */
        let current = this;
        while (current) {
            /** @type {?} */
            let value = current.map.get(name);
            if (value != null) {
                if (current !== this) {
                    // make a local copy and reset the `declared` state.
                    value = { lhs: value.lhs, rhs: value.rhs, declared: false };
                    // Cache the value locally.
                    this.map.set(name, value);
                }
                if (value.rhs && !value.declared) {
                    // if it is first time we are referencing the variable in the scope
                    // than invoke the callback to insert variable declaration.
                    this.declareLocalVarCallback(value.lhs, value.rhs);
                    value.declared = true;
                }
                return value.lhs;
            }
            current = current.parent;
        }
        return null;
    }
    /**
     * Create a local variable for later reference.
     *
     * @param {?} name Name of the variable.
     * @param {?} lhs AST representing the left hand side of the `let lhs = rhs;`.
     * @param {?=} rhs AST representing the right hand side of the `let lhs = rhs;`. The `rhs` can be
     * `undefined` for variable that are ambient such as `$event` and which don't have `rhs`
     * declaration.
     * @return {?}
     */
    set(name, lhs, rhs) {
        !this.map.has(name) ||
            error(`The name ${name} is already defined in scope to be ${this.map.get(name)}`);
        this.map.set(name, { lhs: lhs, rhs: rhs, declared: false });
        return this;
    }
    /**
     * @param {?} name
     * @return {?}
     */
    getLocal(name) { return this.get(name); }
    /**
     * @param {?} declareCallback
     * @return {?}
     */
    nestedScope(declareCallback) {
        return new BindingScope(this, declareCallback);
    }
    /**
     * @return {?}
     */
    freshReferenceName() {
        /** @type {?} */
        let current = this;
        // Find the top scope as it maintains the global reference count
        while (current.parent)
            current = current.parent;
        /** @type {?} */
        const ref = `${REFERENCE_PREFIX}${current.referenceNameIndex++}`;
        return ref;
    }
}
if (false) {
    /** @type {?} */
    BindingScope._ROOT_SCOPE;
    /**
     * Keeps a map from local variables to their expressions.
     *
     * This is used when one refers to variable such as: 'let abc = a.b.c`.
     * - key to the map is the string literal `"abc"`.
     * - value `lhs` is the left hand side which is an AST representing `abc`.
     * - value `rhs` is the right hand side which is an AST representing `a.b.c`.
     * - value `declared` is true if the `declareLocalVarCallback` has been called for this scope
     * already.
     * @type {?}
     */
    BindingScope.prototype.map;
    /** @type {?} */
    BindingScope.prototype.referenceNameIndex;
    /** @type {?} */
    BindingScope.prototype.parent;
    /** @type {?} */
    BindingScope.prototype.declareLocalVarCallback;
}
/**
 * Creates a `CssSelector` given a tag name and a map of attributes
 * @param {?} tag
 * @param {?} attributes
 * @return {?}
 */
function createCssSelector(tag, attributes) {
    /** @type {?} */
    const cssSelector = new CssSelector();
    cssSelector.setElement(tag);
    Object.getOwnPropertyNames(attributes).forEach((name) => {
        /** @type {?} */
        const value = attributes[name];
        cssSelector.addAttribute(name, value);
        if (name.toLowerCase() === 'class') {
            /** @type {?} */
            const classes = value.trim().split(/\s+/g);
            classes.forEach(className => cssSelector.addClassName(className));
        }
    });
    return cssSelector;
}
/**
 * @param {?=} i18n
 * @return {?}
 */
function parseI18nMeta(i18n) {
    /** @type {?} */
    let meaning;
    /** @type {?} */
    let description;
    /** @type {?} */
    let id;
    if (i18n) {
        /** @type {?} */
        const idIndex = i18n.indexOf(ID_SEPARATOR);
        /** @type {?} */
        const descIndex = i18n.indexOf(MEANING_SEPARATOR);
        /** @type {?} */
        let meaningAndDesc;
        [meaningAndDesc, id] =
            (idIndex > -1) ? [i18n.slice(0, idIndex), i18n.slice(idIndex + 2)] : [i18n, ''];
        [meaning, description] = (descIndex > -1) ?
            [meaningAndDesc.slice(0, descIndex), meaningAndDesc.slice(descIndex + 1)] :
            ['', meaningAndDesc];
    }
    return { description, id, meaning };
}
/**
 * @param {?} args
 * @return {?}
 */
function interpolate(args) {
    args = args.slice(1); // Ignore the length prefix added for render2
    switch (args.length) {
        case 3:
            return o.importExpr(R3.interpolation1).callFn(args);
        case 5:
            return o.importExpr(R3.interpolation2).callFn(args);
        case 7:
            return o.importExpr(R3.interpolation3).callFn(args);
        case 9:
            return o.importExpr(R3.interpolation4).callFn(args);
        case 11:
            return o.importExpr(R3.interpolation5).callFn(args);
        case 13:
            return o.importExpr(R3.interpolation6).callFn(args);
        case 15:
            return o.importExpr(R3.interpolation7).callFn(args);
        case 17:
            return o.importExpr(R3.interpolation8).callFn(args);
    }
    (args.length >= 19 && args.length % 2 == 1) ||
        error(`Invalid interpolation argument length ${args.length}`);
    return o.importExpr(R3.interpolationV).callFn([o.literalArr(args)]);
}
/**
 * Parse a template into render3 `Node`s and additional metadata, with no other dependencies.
 *
 * @param {?} template text of the template to parse
 * @param {?} templateUrl URL to use for source mapping of the parsed template
 * @param {?=} options
 * @return {?}
 */
export function parseTemplate(template, templateUrl, options = {}) {
    /** @type {?} */
    const bindingParser = makeBindingParser();
    /** @type {?} */
    const htmlParser = new HtmlParser();
    /** @type {?} */
    const parseResult = htmlParser.parse(template, templateUrl);
    if (parseResult.errors && parseResult.errors.length > 0) {
        return { errors: parseResult.errors, nodes: [], hasNgContent: false, ngContentSelectors: [] };
    }
    /** @type {?} */
    let rootNodes = parseResult.rootNodes;
    if (!options.preserveWhitespaces) {
        rootNodes = html.visitAll(new WhitespaceVisitor(), rootNodes);
    }
    const { nodes, hasNgContent, ngContentSelectors, errors } = htmlAstToRender3Ast(rootNodes, bindingParser);
    if (errors && errors.length > 0) {
        return { errors, nodes: [], hasNgContent: false, ngContentSelectors: [] };
    }
    return { nodes, hasNgContent, ngContentSelectors };
}
/**
 * Construct a `BindingParser` with a default configuration.
 * @return {?}
 */
export function makeBindingParser() {
    return new BindingParser(new Parser(new Lexer()), DEFAULT_INTERPOLATION_CONFIG, new DomElementSchemaRegistry(), null, []);
}
/**
 * @param {?} input
 * @return {?}
 */
function isClassBinding(input) {
    return input.name == 'className' || input.name == 'class';
}
/**
 * @param {?} input
 * @param {?} context
 * @return {?}
 */
function resolveSanitizationFn(input, context) {
    switch (context) {
        case core.SecurityContext.HTML:
            return o.importExpr(R3.sanitizeHtml);
        case core.SecurityContext.SCRIPT:
            return o.importExpr(R3.sanitizeScript);
        case core.SecurityContext.STYLE:
            // the compiler does not fill in an instruction for [style.prop?] binding
            // values because the style algorithm knows internally what props are subject
            // to sanitization (only [attr.style] values are explicitly sanitized)
            return input.type === 1 /* Attribute */ ? o.importExpr(R3.sanitizeStyle) : null;
        case core.SecurityContext.URL:
            return o.importExpr(R3.sanitizeUrl);
        case core.SecurityContext.RESOURCE_URL:
            return o.importExpr(R3.sanitizeResourceUrl);
        default:
            return null;
    }
}
/**
 * @param {?} prop
 * @return {?}
 */
function isStyleSanitizable(prop) {
    switch (prop) {
        case 'background-image':
        case 'background':
        case 'border-image':
        case 'filter':
        case 'list-style':
        case 'list-style-image':
            return true;
    }
    return false;
}
//# sourceMappingURL=template.js.map