"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../core");
var tags_1 = require("../ml_parser/tags");
var util_1 = require("../util");
var dom_security_schema_1 = require("./dom_security_schema");
var element_schema_registry_1 = require("./element_schema_registry");
var BOOLEAN = 'boolean';
var NUMBER = 'number';
var STRING = 'string';
var OBJECT = 'object';
/**
 * This array represents the DOM schema. It encodes inheritance, properties, and events.
 *
 * ## Overview
 *
 * Each line represents one kind of element. The `element_inheritance` and properties are joined
 * using `element_inheritance|properties` syntax.
 *
 * ## Element Inheritance
 *
 * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
 * Here the individual elements are separated by `,` (commas). Every element in the list
 * has identical properties.
 *
 * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
 * specified then `""` (blank) element is assumed.
 *
 * NOTE: The blank element inherits from root `[Element]` element, the super element of all
 * elements.
 *
 * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
 *
 * ## Properties
 *
 * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
 * by a special character designating its type:
 *
 * - (no prefix): property is a string.
 * - `*`: property represents an event.
 * - `!`: property is a boolean.
 * - `#`: property is a number.
 * - `%`: property is an object.
 *
 * ## Query
 *
 * The class creates an internal squas representation which allows to easily answer the query of
 * if a given property exist on a given element.
 *
 * NOTE: We don't yet support querying for types or events.
 * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
 *       see dom_element_schema_registry_spec.ts
 */
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
//
// Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
// dom_security_schema.ts. Reach out to mprobst & rjamet for details.
//
// =================================================================================================
var SCHEMA = [
    '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop,slot' +
        /* added manually to avoid breaking changes */
        ',*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored',
    '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,src,%srcObject,#volume',
    ':svg:^[HTMLElement]|*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
    ':svg:graphics^:svg:|',
    ':svg:animation^:svg:|*begin,*end,*repeat',
    ':svg:geometry^:svg:|',
    ':svg:componentTransferFunction^:svg:|',
    ':svg:gradient^:svg:|',
    ':svg:textContent^:svg:graphics|',
    ':svg:textPositioning^:svg:textContent|',
    'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
    'area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,search,shape,target,username',
    'audio^media|',
    'br^[HTMLElement]|clear',
    'base^[HTMLElement]|href,target',
    'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
    'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
    'canvas^[HTMLElement]|#height,#width',
    'content^[HTMLElement]|select',
    'dl^[HTMLElement]|!compact',
    'datalist^[HTMLElement]|',
    'details^[HTMLElement]|!open',
    'dialog^[HTMLElement]|!open,returnValue',
    'dir^[HTMLElement]|!compact',
    'div^[HTMLElement]|align',
    'embed^[HTMLElement]|align,height,name,src,type,width',
    'fieldset^[HTMLElement]|!disabled,name',
    'font^[HTMLElement]|color,face,size',
    'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
    'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
    'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
    'hr^[HTMLElement]|align,color,!noShade,size,width',
    'head^[HTMLElement]|',
    'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
    'html^[HTMLElement]|version',
    'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
    'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
    'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
    'li^[HTMLElement]|type,#value',
    'label^[HTMLElement]|htmlFor',
    'legend^[HTMLElement]|align',
    'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type',
    'map^[HTMLElement]|name',
    'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
    'menu^[HTMLElement]|!compact',
    'meta^[HTMLElement]|content,httpEquiv,name,scheme',
    'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
    'ins,del^[HTMLElement]|cite,dateTime',
    'ol^[HTMLElement]|!compact,!reversed,#start,type',
    'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
    'optgroup^[HTMLElement]|!disabled,label',
    'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
    'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
    'p^[HTMLElement]|align',
    'param^[HTMLElement]|name,type,value,valueType',
    'picture^[HTMLElement]|',
    'pre^[HTMLElement]|#width',
    'progress^[HTMLElement]|#max,#value',
    'q,blockquote,cite^[HTMLElement]|',
    'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
    'select^[HTMLElement]|!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
    'shadow^[HTMLElement]|',
    'slot^[HTMLElement]|name',
    'source^[HTMLElement]|media,sizes,src,srcset,type',
    'span^[HTMLElement]|',
    'style^[HTMLElement]|!disabled,media,type',
    'caption^[HTMLElement]|align',
    'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
    'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
    'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
    'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
    'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
    'template^[HTMLElement]|',
    'textarea^[HTMLElement]|autocapitalize,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
    'title^[HTMLElement]|text',
    'track^[HTMLElement]|!default,kind,label,src,srclang',
    'ul^[HTMLElement]|!compact,type',
    'unknown^[HTMLElement]|',
    'video^media|#height,poster,#width',
    ':svg:a^:svg:graphics|',
    ':svg:animate^:svg:animation|',
    ':svg:animateMotion^:svg:animation|',
    ':svg:animateTransform^:svg:animation|',
    ':svg:circle^:svg:geometry|',
    ':svg:clipPath^:svg:graphics|',
    ':svg:defs^:svg:graphics|',
    ':svg:desc^:svg:|',
    ':svg:discard^:svg:|',
    ':svg:ellipse^:svg:geometry|',
    ':svg:feBlend^:svg:|',
    ':svg:feColorMatrix^:svg:|',
    ':svg:feComponentTransfer^:svg:|',
    ':svg:feComposite^:svg:|',
    ':svg:feConvolveMatrix^:svg:|',
    ':svg:feDiffuseLighting^:svg:|',
    ':svg:feDisplacementMap^:svg:|',
    ':svg:feDistantLight^:svg:|',
    ':svg:feDropShadow^:svg:|',
    ':svg:feFlood^:svg:|',
    ':svg:feFuncA^:svg:componentTransferFunction|',
    ':svg:feFuncB^:svg:componentTransferFunction|',
    ':svg:feFuncG^:svg:componentTransferFunction|',
    ':svg:feFuncR^:svg:componentTransferFunction|',
    ':svg:feGaussianBlur^:svg:|',
    ':svg:feImage^:svg:|',
    ':svg:feMerge^:svg:|',
    ':svg:feMergeNode^:svg:|',
    ':svg:feMorphology^:svg:|',
    ':svg:feOffset^:svg:|',
    ':svg:fePointLight^:svg:|',
    ':svg:feSpecularLighting^:svg:|',
    ':svg:feSpotLight^:svg:|',
    ':svg:feTile^:svg:|',
    ':svg:feTurbulence^:svg:|',
    ':svg:filter^:svg:|',
    ':svg:foreignObject^:svg:graphics|',
    ':svg:g^:svg:graphics|',
    ':svg:image^:svg:graphics|',
    ':svg:line^:svg:geometry|',
    ':svg:linearGradient^:svg:gradient|',
    ':svg:mpath^:svg:|',
    ':svg:marker^:svg:|',
    ':svg:mask^:svg:|',
    ':svg:metadata^:svg:|',
    ':svg:path^:svg:geometry|',
    ':svg:pattern^:svg:|',
    ':svg:polygon^:svg:geometry|',
    ':svg:polyline^:svg:geometry|',
    ':svg:radialGradient^:svg:gradient|',
    ':svg:rect^:svg:geometry|',
    ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
    ':svg:script^:svg:|type',
    ':svg:set^:svg:animation|',
    ':svg:stop^:svg:|',
    ':svg:style^:svg:|!disabled,media,title,type',
    ':svg:switch^:svg:graphics|',
    ':svg:symbol^:svg:|',
    ':svg:tspan^:svg:textPositioning|',
    ':svg:text^:svg:textPositioning|',
    ':svg:textPath^:svg:textContent|',
    ':svg:title^:svg:|',
    ':svg:use^:svg:graphics|',
    ':svg:view^:svg:|#zoomAndPan',
    'data^[HTMLElement]|value',
    'keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name',
    'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
    'summary^[HTMLElement]|',
    'time^[HTMLElement]|dateTime',
    ':svg:cursor^:svg:|',
];
var _ATTR_TO_PROP = {
    'class': 'className',
    'for': 'htmlFor',
    'formaction': 'formAction',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
};
var DomElementSchemaRegistry = /** @class */ (function (_super) {
    __extends(DomElementSchemaRegistry, _super);
    function DomElementSchemaRegistry() {
        var _this = _super.call(this) || this;
        _this._schema = {};
        SCHEMA.forEach(function (encodedType) {
            var type = {};
            var _a = encodedType.split('|'), strType = _a[0], strProperties = _a[1];
            var properties = strProperties.split(',');
            var _b = strType.split('^'), typeNames = _b[0], superName = _b[1];
            typeNames.split(',').forEach(function (tag) { return _this._schema[tag.toLowerCase()] = type; });
            var superType = superName && _this._schema[superName.toLowerCase()];
            if (superType) {
                Object.keys(superType).forEach(function (prop) { type[prop] = superType[prop]; });
            }
            properties.forEach(function (property) {
                if (property.length > 0) {
                    switch (property[0]) {
                        case '*':
                            // We don't yet support events.
                            // If ever allowing to bind to events, GO THROUGH A SECURITY REVIEW, allowing events
                            // will
                            // almost certainly introduce bad XSS vulnerabilities.
                            // type[property.substring(1)] = EVENT;
                            break;
                        case '!':
                            type[property.substring(1)] = BOOLEAN;
                            break;
                        case '#':
                            type[property.substring(1)] = NUMBER;
                            break;
                        case '%':
                            type[property.substring(1)] = OBJECT;
                            break;
                        default:
                            type[property] = STRING;
                    }
                }
            });
        });
        return _this;
    }
    DomElementSchemaRegistry.prototype.hasProperty = function (tagName, propName, schemaMetas) {
        if (schemaMetas.some(function (schema) { return schema.name === core_1.NO_ERRORS_SCHEMA.name; })) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (tags_1.isNgContainer(tagName) || tags_1.isNgContent(tagName)) {
                return false;
            }
            if (schemaMetas.some(function (schema) { return schema.name === core_1.CUSTOM_ELEMENTS_SCHEMA.name; })) {
                // Can't tell now as we don't know which properties a custom element will get
                // once it is instantiated
                return true;
            }
        }
        var elementProperties = this._schema[tagName.toLowerCase()] || this._schema['unknown'];
        return !!elementProperties[propName];
    };
    DomElementSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
        if (schemaMetas.some(function (schema) { return schema.name === core_1.NO_ERRORS_SCHEMA.name; })) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (tags_1.isNgContainer(tagName) || tags_1.isNgContent(tagName)) {
                return true;
            }
            if (schemaMetas.some(function (schema) { return schema.name === core_1.CUSTOM_ELEMENTS_SCHEMA.name; })) {
                // Allow any custom elements
                return true;
            }
        }
        return !!this._schema[tagName.toLowerCase()];
    };
    /**
     * securityContext returns the security context for the given property on the given DOM tag.
     *
     * Tag and property name are statically known and cannot change at runtime, i.e. it is not
     * possible to bind a value into a changing attribute or tag name.
     *
     * The filtering is white list based. All attributes in the schema above are assumed to have the
     * 'NONE' security context, i.e. that they are safe inert string values. Only specific well known
     * attack vectors are assigned their appropriate context.
     */
    DomElementSchemaRegistry.prototype.securityContext = function (tagName, propName, isAttribute) {
        if (isAttribute) {
            // NB: For security purposes, use the mapped property name, not the attribute name.
            propName = this.getMappedPropName(propName);
        }
        // Make sure comparisons are case insensitive, so that case differences between attribute and
        // property names do not have a security impact.
        tagName = tagName.toLowerCase();
        propName = propName.toLowerCase();
        var ctx = dom_security_schema_1.SECURITY_SCHEMA()[tagName + '|' + propName];
        if (ctx) {
            return ctx;
        }
        ctx = dom_security_schema_1.SECURITY_SCHEMA()['*|' + propName];
        return ctx ? ctx : core_1.SecurityContext.NONE;
    };
    DomElementSchemaRegistry.prototype.getMappedPropName = function (propName) { return _ATTR_TO_PROP[propName] || propName; };
    DomElementSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
    DomElementSchemaRegistry.prototype.validateProperty = function (name) {
        if (name.toLowerCase().startsWith('on')) {
            var msg = "Binding to event property '" + name + "' is disallowed for security reasons, " +
                ("please use (" + name.slice(2) + ")=...") +
                ("\nIf '" + name + "' is a directive input, make sure the directive is imported by the") +
                " current module.";
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    };
    DomElementSchemaRegistry.prototype.validateAttribute = function (name) {
        if (name.toLowerCase().startsWith('on')) {
            var msg = "Binding to event attribute '" + name + "' is disallowed for security reasons, " +
                ("please use (" + name.slice(2) + ")=...");
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    };
    DomElementSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this._schema); };
    DomElementSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) {
        return util_1.dashCaseToCamelCase(propName);
    };
    DomElementSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
        var unit = '';
        var strVal = val.toString().trim();
        var errorMsg = null;
        if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
            if (typeof val === 'number') {
                unit = 'px';
            }
            else {
                var valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errorMsg = "Please provide a CSS unit value for " + userProvidedProp + ":" + val;
                }
            }
        }
        return { error: errorMsg, value: strVal + unit };
    };
    return DomElementSchemaRegistry;
}(element_schema_registry_1.ElementSchemaRegistry));
exports.DomElementSchemaRegistry = DomElementSchemaRegistry;
function _isPixelDimensionStyle(prop) {
    switch (prop) {
        case 'width':
        case 'height':
        case 'minWidth':
        case 'minHeight':
        case 'maxWidth':
        case 'maxHeight':
        case 'left':
        case 'top':
        case 'bottom':
        case 'right':
        case 'fontSize':
        case 'outlineWidth':
        case 'outlineOffset':
        case 'paddingTop':
        case 'paddingLeft':
        case 'paddingBottom':
        case 'paddingRight':
        case 'marginTop':
        case 'marginLeft':
        case 'marginBottom':
        case 'marginRight':
        case 'borderRadius':
        case 'borderWidth':
        case 'borderTopWidth':
        case 'borderLeftWidth':
        case 'borderRightWidth':
        case 'borderBottomWidth':
        case 'textIndent':
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3NjaGVtYS9kb21fZWxlbWVudF9zY2hlbWFfcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsZ0NBQWtHO0FBRWxHLDBDQUE2RDtBQUM3RCxnQ0FBNEM7QUFFNUMsNkRBQXNEO0FBQ3RELHFFQUFnRTtBQUVoRSxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDMUIsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ3hCLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUN4QixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFFeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBRUgsb0dBQW9HO0FBQ3BHLG9HQUFvRztBQUNwRyxvR0FBb0c7QUFDcEcsb0dBQW9HO0FBQ3BHLG9HQUFvRztBQUNwRyxFQUFFO0FBQ0YsK0VBQStFO0FBQy9FLEVBQUU7QUFDRixrR0FBa0c7QUFDbEcscUVBQXFFO0FBQ3JFLEVBQUU7QUFDRixvR0FBb0c7QUFFcEcsSUFBTSxNQUFNLEdBQWE7SUFDdkIsZ09BQWdPO1FBQzVOLDhDQUE4QztRQUM5QyxrS0FBa0s7SUFDdEsscTFCQUFxMUI7SUFDcjFCLG9nQ0FBb2dDO0lBQ3BnQywrTkFBK047SUFDL04sMHVCQUEwdUI7SUFDMXVCLHNCQUFzQjtJQUN0QiwwQ0FBMEM7SUFDMUMsc0JBQXNCO0lBQ3RCLHVDQUF1QztJQUN2QyxzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHdDQUF3QztJQUN4QyxrTEFBa0w7SUFDbEwsNkpBQTZKO0lBQzdKLGNBQWM7SUFDZCx3QkFBd0I7SUFDeEIsZ0NBQWdDO0lBQ2hDLGdRQUFnUTtJQUNoUSx3SEFBd0g7SUFD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