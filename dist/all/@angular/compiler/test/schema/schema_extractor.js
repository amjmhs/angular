"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var SVG_PREFIX = ':svg:';
// Element | Node interfaces
// see https://developer.mozilla.org/en-US/docs/Web/API/Element
// see https://developer.mozilla.org/en-US/docs/Web/API/Node
var ELEMENT_IF = '[Element]';
// HTMLElement interface
// see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
var HTMLELEMENT_IF = '[HTMLElement]';
var HTMLELEMENT_TAGS = 'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr';
var ALL_HTML_TAGS = 
// https://www.w3.org/TR/html5/index.html
'a,abbr,address,area,article,aside,audio,b,base,bdi,bdo,blockquote,body,br,button,canvas,caption,cite,code,col,colgroup,data,datalist,dd,del,dfn,div,dl,dt,em,embed,fieldset,figcaption,figure,footer,form,h1,h2,h3,h4,h5,h6,head,header,hr,html,i,iframe,img,input,ins,kbd,keygen,label,legend,li,link,main,map,mark,meta,meter,nav,noscript,object,ol,optgroup,option,output,p,param,pre,progress,q,rb,rp,rt,rtc,ruby,s,samp,script,section,select,small,source,span,strong,style,sub,sup,table,tbody,td,template,textarea,tfoot,th,thead,time,title,tr,track,u,ul,var,video,wbr,' +
    // https://html.spec.whatwg.org/
    'details,summary,menu,menuitem';
// Elements missing from Chrome (HtmlUnknownElement), to be manually added
var MISSING_FROM_CHROME = {
    'data^[HTMLElement]': ['value'],
    'keygen^[HTMLElement]': ['!autofocus', 'challenge', '!disabled', 'form', 'keytype', 'name'],
    // TODO(vicb): Figure out why Chrome and WhatWG do not agree on the props
    // 'menu^[HTMLElement]': ['type', 'label'],
    'menuitem^[HTMLElement]': ['type', 'label', 'icon', '!disabled', '!checked', 'radiogroup', '!default'],
    'summary^[HTMLElement]': [],
    'time^[HTMLElement]': ['dateTime'],
    ':svg:cursor^:svg:': [],
};
var _G = global;
var document = typeof _G['document'] == 'object' ? _G['document'] : null;
function extractSchema() {
    if (!document)
        return null;
    var SVGGraphicsElement = _G['SVGGraphicsElement'];
    if (!SVGGraphicsElement)
        return null;
    var element = document.createElement('video');
    var descMap = new Map();
    var visited = {};
    // HTML top level
    extractProperties(Node, element, visited, descMap, ELEMENT_IF, '');
    extractProperties(Element, element, visited, descMap, ELEMENT_IF, '');
    extractProperties(HTMLElement, element, visited, descMap, HTMLELEMENT_IF, ELEMENT_IF);
    extractProperties(HTMLElement, element, visited, descMap, HTMLELEMENT_TAGS, HTMLELEMENT_IF);
    extractProperties(HTMLMediaElement, element, visited, descMap, 'media', HTMLELEMENT_IF);
    // SVG top level
    var svgAnimation = document.createElementNS('http://www.w3.org/2000/svg', 'set');
    var svgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    var svgFeFuncA = document.createElementNS('http://www.w3.org/2000/svg', 'feFuncA');
    var svgGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    var svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    var SVGAnimationElement = _G['SVGAnimationElement'];
    var SVGGeometryElement = _G['SVGGeometryElement'];
    var SVGComponentTransferFunctionElement = _G['SVGComponentTransferFunctionElement'];
    var SVGGradientElement = _G['SVGGradientElement'];
    var SVGTextContentElement = _G['SVGTextContentElement'];
    var SVGTextPositioningElement = _G['SVGTextPositioningElement'];
    extractProperties(SVGElement, svgText, visited, descMap, SVG_PREFIX, HTMLELEMENT_IF);
    extractProperties(SVGGraphicsElement, svgText, visited, descMap, SVG_PREFIX + 'graphics', SVG_PREFIX);
    extractProperties(SVGAnimationElement, svgAnimation, visited, descMap, SVG_PREFIX + 'animation', SVG_PREFIX);
    extractProperties(SVGGeometryElement, svgPath, visited, descMap, SVG_PREFIX + 'geometry', SVG_PREFIX);
    extractProperties(SVGComponentTransferFunctionElement, svgFeFuncA, visited, descMap, SVG_PREFIX + 'componentTransferFunction', SVG_PREFIX);
    extractProperties(SVGGradientElement, svgGradient, visited, descMap, SVG_PREFIX + 'gradient', SVG_PREFIX);
    extractProperties(SVGTextContentElement, svgText, visited, descMap, SVG_PREFIX + 'textContent', SVG_PREFIX + 'graphics');
    extractProperties(SVGTextPositioningElement, svgText, visited, descMap, SVG_PREFIX + 'textPositioning', SVG_PREFIX + 'textContent');
    // Get all element types
    var types = Object.getOwnPropertyNames(window).filter(function (k) { return /^(HTML|SVG).*?Element$/.test(k); });
    types.sort();
    types.forEach(function (type) { extractRecursiveProperties(visited, descMap, window[type]); });
    // Add elements missed by Chrome auto-detection
    Object.keys(MISSING_FROM_CHROME).forEach(function (elHierarchy) {
        descMap.set(elHierarchy, MISSING_FROM_CHROME[elHierarchy]);
    });
    assertNoMissingTags(descMap);
    return descMap;
}
exports.extractSchema = extractSchema;
function assertNoMissingTags(descMap) {
    var extractedTags = [];
    Array.from(descMap.keys()).forEach(function (key) {
        extractedTags.push.apply(extractedTags, key.split('|')[0].split('^')[0].split(','));
    });
    var missingTags = ALL_HTML_TAGS.split(',').filter(function (tag) { return extractedTags.indexOf(tag) == -1; });
    if (missingTags.length) {
        throw new Error("DOM schema misses tags: " + missingTags.join(','));
    }
}
function extractRecursiveProperties(visited, descMap, type) {
    var name = extractName(type);
    if (visited[name]) {
        return name;
    }
    var superName;
    switch (name) {
        case ELEMENT_IF:
            // ELEMENT_IF is the top most interface (Element | Node)
            superName = '';
            break;
        case HTMLELEMENT_IF:
            superName = ELEMENT_IF;
            break;
        default:
            superName =
                extractRecursiveProperties(visited, descMap, type.prototype.__proto__.constructor);
    }
    var instance = null;
    name.split(',').forEach(function (tagName) {
        instance = type['name'].startsWith('SVG') ?
            document.createElementNS('http://www.w3.org/2000/svg', tagName.replace(SVG_PREFIX, '')) :
            document.createElement(tagName);
        var htmlType;
        switch (tagName) {
            case 'cite':
                // <cite> interface is `HTMLQuoteElement`
                htmlType = HTMLElement;
                break;
            default:
                htmlType = type;
        }
        if (!(instance instanceof htmlType)) {
            throw new Error("Tag <" + tagName + "> is not an instance of " + htmlType['name']);
        }
    });
    extractProperties(type, instance, visited, descMap, name, superName);
    return name;
}
function extractProperties(type, instance, visited, descMap, name, superName) {
    if (!type)
        return;
    visited[name] = true;
    var fullName = name + (superName ? '^' + superName : '');
    var props = descMap.has(fullName) ? descMap.get(fullName) : [];
    var prototype = type.prototype;
    var keys = Object.getOwnPropertyNames(prototype);
    keys.sort();
    keys.forEach(function (name) {
        if (name.startsWith('on')) {
            props.push('*' + name.substr(2));
        }
        else {
            var typeCh = _TYPE_MNEMONICS[typeof instance[name]];
            var descriptor = Object.getOwnPropertyDescriptor(prototype, name);
            var isSetter = descriptor && descriptor.set;
            if (typeCh !== void 0 && !name.startsWith('webkit') && isSetter) {
                props.push(typeCh + name);
            }
        }
    });
    // There is no point in using `Node.nodeValue`, filter it out
    descMap.set(fullName, type === Node ? props.filter(function (p) { return p != '%nodeValue'; }) : props);
}
function extractName(type) {
    var name = type['name'];
    // The polyfill @webcomponents/custom-element/src/native-shim.js overrides the
    // window.HTMLElement and does not have the name property. Check if this is the
    // case and if so, set the name manually.
    if (name === '' && type === HTMLElement) {
        name = 'HTMLElement';
    }
    switch (name) {
        // see https://www.w3.org/TR/html5/index.html
        // TODO(vicb): generate this map from all the element types
        case 'Element':
            return ELEMENT_IF;
        case 'HTMLElement':
            return HTMLELEMENT_IF;
        case 'HTMLImageElement':
            return 'img';
        case 'HTMLAnchorElement':
            return 'a';
        case 'HTMLDListElement':
            return 'dl';
        case 'HTMLDirectoryElement':
            return 'dir';
        case 'HTMLHeadingElement':
            return 'h1,h2,h3,h4,h5,h6';
        case 'HTMLModElement':
            return 'ins,del';
        case 'HTMLOListElement':
            return 'ol';
        case 'HTMLParagraphElement':
            return 'p';
        case 'HTMLQuoteElement':
            return 'q,blockquote,cite';
        case 'HTMLTableCaptionElement':
            return 'caption';
        case 'HTMLTableCellElement':
            return 'th,td';
        case 'HTMLTableColElement':
            return 'col,colgroup';
        case 'HTMLTableRowElement':
            return 'tr';
        case 'HTMLTableSectionElement':
            return 'tfoot,thead,tbody';
        case 'HTMLUListElement':
            return 'ul';
        case 'SVGGraphicsElement':
            return SVG_PREFIX + 'graphics';
        case 'SVGMPathElement':
            return SVG_PREFIX + 'mpath';
        case 'SVGSVGElement':
            return SVG_PREFIX + 'svg';
        case 'SVGTSpanElement':
            return SVG_PREFIX + 'tspan';
        default:
            var isSVG = name.startsWith('SVG');
            if (name.startsWith('HTML') || isSVG) {
                name = name.replace('HTML', '').replace('SVG', '').replace('Element', '');
                if (isSVG && name.startsWith('FE')) {
                    name = 'fe' + name.substring(2);
                }
                else if (name) {
                    name = name.charAt(0).toLowerCase() + name.substring(1);
                }
                return isSVG ? SVG_PREFIX + name : name.toLowerCase();
            }
    }
    return null;
}
var _TYPE_MNEMONICS = {
    'string': '',
    'number': '#',
    'boolean': '!',
    'object': '%',
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hX2V4dHJhY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3Rlc3Qvc2NoZW1hL3NjaGVtYV9leHRyYWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxJQUFNLFVBQVUsR0FBRyxPQUFPLENBQUM7QUFFM0IsNEJBQTRCO0FBQzVCLCtEQUErRDtBQUMvRCw0REFBNEQ7QUFDNUQsSUFBTSxVQUFVLEdBQUcsV0FBVyxDQUFDO0FBQy9CLHdCQUF3QjtBQUN4QixtRUFBbUU7QUFDbkUsSUFBTSxjQUFjLEdBQUcsZUFBZSxDQUFDO0FBRXZDLElBQU0sZ0JBQWdCLEdBQ2xCLDBMQUEwTCxDQUFDO0FBRS9MLElBQU0sYUFBYTtBQUNmLHlDQUF5QztBQUN6QyxvakJBQW9qQjtJQUNwakIsZ0NBQWdDO0lBQ2hDLCtCQUErQixDQUFDO0FBRXBDLDBFQUEwRTtBQUMxRSxJQUFNLG1CQUFtQixHQUE2QjtJQUNwRCxvQkFBb0IsRUFBRSxDQUFDLE9BQU8sQ0FBQztJQUMvQixzQkFBc0IsRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDO0lBQzNGLHlFQUF5RTtJQUN6RSwyQ0FBMkM7SUFDM0Msd0JBQXdCLEVBQ3BCLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsVUFBVSxDQUFDO0lBQ2hGLHVCQUF1QixFQUFFLEVBQUU7SUFDM0Isb0JBQW9CLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDbEMsbUJBQW1CLEVBQUUsRUFBRTtDQUN4QixDQUFDO0FBRUYsSUFBTSxFQUFFLEdBQVEsTUFBTSxDQUFDO0FBQ3ZCLElBQU0sUUFBUSxHQUFRLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLFFBQVEsQ0FB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