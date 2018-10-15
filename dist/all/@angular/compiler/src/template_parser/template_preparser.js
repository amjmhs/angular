"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var tags_1 = require("../ml_parser/tags");
var NG_CONTENT_SELECT_ATTR = 'select';
var LINK_ELEMENT = 'link';
var LINK_STYLE_REL_ATTR = 'rel';
var LINK_STYLE_HREF_ATTR = 'href';
var LINK_STYLE_REL_VALUE = 'stylesheet';
var STYLE_ELEMENT = 'style';
var SCRIPT_ELEMENT = 'script';
var NG_NON_BINDABLE_ATTR = 'ngNonBindable';
var NG_PROJECT_AS = 'ngProjectAs';
function preparseElement(ast) {
    var selectAttr = null;
    var hrefAttr = null;
    var relAttr = null;
    var nonBindable = false;
    var projectAs = '';
    ast.attrs.forEach(function (attr) {
        var lcAttrName = attr.name.toLowerCase();
        if (lcAttrName == NG_CONTENT_SELECT_ATTR) {
            selectAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_HREF_ATTR) {
            hrefAttr = attr.value;
        }
        else if (lcAttrName == LINK_STYLE_REL_ATTR) {
            relAttr = attr.value;
        }
        else if (attr.name == NG_NON_BINDABLE_ATTR) {
            nonBindable = true;
        }
        else if (attr.name == NG_PROJECT_AS) {
            if (attr.value.length > 0) {
                projectAs = attr.value;
            }
        }
    });
    selectAttr = normalizeNgContentSelect(selectAttr);
    var nodeName = ast.name.toLowerCase();
    var type = PreparsedElementType.OTHER;
    if (tags_1.isNgContent(nodeName)) {
        type = PreparsedElementType.NG_CONTENT;
    }
    else if (nodeName == STYLE_ELEMENT) {
        type = PreparsedElementType.STYLE;
    }
    else if (nodeName == SCRIPT_ELEMENT) {
        type = PreparsedElementType.SCRIPT;
    }
    else if (nodeName == LINK_ELEMENT && relAttr == LINK_STYLE_REL_VALUE) {
        type = PreparsedElementType.STYLESHEET;
    }
    return new PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs);
}
exports.preparseElement = preparseElement;
var PreparsedElementType;
(function (PreparsedElementType) {
    PreparsedElementType[PreparsedElementType["NG_CONTENT"] = 0] = "NG_CONTENT";
    PreparsedElementType[PreparsedElementType["STYLE"] = 1] = "STYLE";
    PreparsedElementType[PreparsedElementType["STYLESHEET"] = 2] = "STYLESHEET";
    PreparsedElementType[PreparsedElementType["SCRIPT"] = 3] = "SCRIPT";
    PreparsedElementType[PreparsedElementType["OTHER"] = 4] = "OTHER";
})(PreparsedElementType = exports.PreparsedElementType || (exports.PreparsedElementType = {}));
var PreparsedElement = /** @class */ (function () {
    function PreparsedElement(type, selectAttr, hrefAttr, nonBindable, projectAs) {
        this.type = type;
        this.selectAttr = selectAttr;
        this.hrefAttr = hrefAttr;
        this.nonBindable = nonBindable;
        this.projectAs = projectAs;
    }
    return PreparsedElement;
}());
exports.PreparsedElement = PreparsedElement;
function normalizeNgContentSelect(selectAttr) {
    if (selectAttr === null || selectAttr.length === 0) {
        return '*';
    }
    return selectAttr;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVtcGxhdGVfcHJlcGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3RlbXBsYXRlX3BhcnNlci90ZW1wbGF0ZV9wcmVwYXJzZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCwwQ0FBOEM7QUFFOUMsSUFBTSxzQkFBc0IsR0FBRyxRQUFRLENBQUM7QUFDeEMsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDO0FBQzVCLElBQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0FBQ2xDLElBQU0sb0JBQW9CLEdBQUcsTUFBTSxDQUFDO0FBQ3BDLElBQU0sb0JBQW9CLEdBQUcsWUFBWSxDQUFDO0FBQzFDLElBQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUM5QixJQUFNLGNBQWMsR0FBRyxRQUFRLENBQUM7QUFDaEMsSUFBTSxvQkFBb0IsR0FBRyxlQUFlLENBQUM7QUFDN0MsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDO0FBRXBDLHlCQUFnQyxHQUFpQjtJQUMvQyxJQUFJLFVBQVUsR0FBVyxJQUFNLENBQUM7SUFDaEMsSUFBSSxRQUFRLEdBQVcsSUFBTSxDQUFDO0lBQzlCLElBQUksT0FBTyxHQUFXLElBQU0sQ0FBQztJQUM3QixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDeEIsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDO0lBQ25CLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtRQUNwQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQzNDLElBQUksVUFBVSxJQUFJLHNCQUFzQixFQUFFO1lBQ3hDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3pCO2FBQU0sSUFBSSxVQUFVLElBQUksb0JBQW9CLEVBQUU7WUFDN0MsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDdkI7YUFBTSxJQUFJLFVBQVUsSUFBSSxtQkFBbUIsRUFBRTtZQUM1QyxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztTQUN0QjthQUFNLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxvQkFBb0IsRUFBRTtZQUM1QyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO2FBQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLGFBQWEsRUFBRTtZQUNyQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDekIsU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDeEI7U0FDRjtJQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0gsVUFBVSxHQUFHLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2xELElBQU0sUUFBUSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDeEMsSUFBSSxJQUFJLEdBQUcsb0JBQW9CLENBQUMsS0FBSyxDQUFDO0lBQ3RDLElBQUksa0JBQVcsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUN6QixJQUFJLEdBQUcsb0JBQW9CLENBQUMsVUFBVSxDQUFDO0tBQ3hDO1NBQU0sSUFBSSxRQUFRLElBQUksYUFBYSxFQUFFO1FBQ3BDLElBQUksR0FBRyxvQkFBb0IsQ0FBQyxLQUFLLENBQUM7S0FDbkM7U0FBTSxJQUFJLFFBQVEsSUFBSSxjQUFjLEVBQUU7UUFDckMsSUFBSSxHQUFHLG9CQUFvQixDQUFDLE1BQU0sQ0FBQztLQUNwQztTQUFNLElBQUksUUFBUSxJQUFJLFlBQVksSUFBSSxPQUFPLElBQUksb0JBQW9CLEVBQUU7UUFDdEUsSUFBSSxHQUFHLG9CQUFvQixDQUFDLFVBQVUsQ0FBQztLQUN4QztJQUNELE9BQU8sSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDbEYsQ0FBQztBQW5DRCwwQ0FtQ0M7QUFFRCxJQUFZLG9CQU1YO0FBTkQsV0FBWSxvQkFBb0I7SUFDOUIsMkVBQVUsQ0FBQTtJQUNWLGlFQUFLLENBQUE7SUFDTCwyRUFBVSxDQUFBO0lBQ1YsbUVBQU0sQ0FBQTtJQUNOLGlFQUFLLENBQUE7QUFDUCxDQUFDLEVBTlcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFNL0I7QUFFRDtJQUNFLDBCQUNXLElBQTBCLEVBQVMsVUFBa0IsRUFBUyxRQUFnQixFQUM5RSxXQUFvQixFQUFTLFNBQWlCO1FBRDlDLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQVMsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVE7UUFDOUUsZ0JBQVcsR0FBWCxXQUFXLENBQVM7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO0lBQUcsQ0FBQztJQUMvRCx1QkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksNENBQWdCO0FBTzdCLGtDQUFrQyxVQUFrQjtJQUNsRCxJQUFJLFVBQVUsS0FBSyxJQUFJLElBQUksVUFBVSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDbEQsT0FBTyxHQUFHLENBQUM7S0FDWjtJQUNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMifQ==