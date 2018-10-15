"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var compiler_1 = require("@angular/compiler");
var MockSchemaRegistry = /** @class */ (function () {
    function MockSchemaRegistry(existingProperties, attrPropMapping, existingElements, invalidProperties, invalidAttributes) {
        this.existingProperties = existingProperties;
        this.attrPropMapping = attrPropMapping;
        this.existingElements = existingElements;
        this.invalidProperties = invalidProperties;
        this.invalidAttributes = invalidAttributes;
    }
    MockSchemaRegistry.prototype.hasProperty = function (tagName, property, schemas) {
        var value = this.existingProperties[property];
        return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.hasElement = function (tagName, schemaMetas) {
        var value = this.existingElements[tagName.toLowerCase()];
        return value === void 0 ? true : value;
    };
    MockSchemaRegistry.prototype.allKnownElementNames = function () { return Object.keys(this.existingElements); };
    MockSchemaRegistry.prototype.securityContext = function (selector, property, isAttribute) {
        return compiler_1.core.SecurityContext.NONE;
    };
    MockSchemaRegistry.prototype.getMappedPropName = function (attrName) { return this.attrPropMapping[attrName] || attrName; };
    MockSchemaRegistry.prototype.getDefaultComponentElementName = function () { return 'ng-component'; };
    MockSchemaRegistry.prototype.validateProperty = function (name) {
        if (this.invalidProperties.indexOf(name) > -1) {
            return { error: true, msg: "Binding to property '" + name + "' is disallowed for security reasons" };
        }
        else {
            return { error: false };
        }
    };
    MockSchemaRegistry.prototype.validateAttribute = function (name) {
        if (this.invalidAttributes.indexOf(name) > -1) {
            return {
                error: true,
                msg: "Binding to attribute '" + name + "' is disallowed for security reasons"
            };
        }
        else {
            return { error: false };
        }
    };
    MockSchemaRegistry.prototype.normalizeAnimationStyleProperty = function (propName) { return propName; };
    MockSchemaRegistry.prototype.normalizeAnimationStyleValue = function (camelCaseProp, userProvidedProp, val) {
        return { error: null, value: val.toString() };
    };
    return MockSchemaRegistry;
}());
exports.MockSchemaRegistry = MockSchemaRegistry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hX3JlZ2lzdHJ5X21vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0aW5nL3NyYy9zY2hlbWFfcmVnaXN0cnlfbW9jay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDhDQUE4RDtBQUU5RDtJQUNFLDRCQUNXLGtCQUE0QyxFQUM1QyxlQUF3QyxFQUN4QyxnQkFBMEMsRUFBUyxpQkFBZ0MsRUFDbkYsaUJBQWdDO1FBSGhDLHVCQUFrQixHQUFsQixrQkFBa0IsQ0FBMEI7UUFDNUMsb0JBQWUsR0FBZixlQUFlLENBQXlCO1FBQ3hDLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMEI7UUFBUyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWU7UUFDbkYsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFlO0lBQUcsQ0FBQztJQUUvQyx3Q0FBVyxHQUFYLFVBQVksT0FBZSxFQUFFLFFBQWdCLEVBQUUsT0FBOEI7UUFDM0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sS0FBSyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUN6QyxDQUFDO0lBRUQsdUNBQVUsR0FBVixVQUFXLE9BQWUsRUFBRSxXQUFrQztRQUM1RCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDM0QsT0FBTyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0lBQ3pDLENBQUM7SUFFRCxpREFBb0IsR0FBcEIsY0FBbUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUUvRSw0Q0FBZSxHQUFmLFVBQWdCLFFBQWdCLEVBQUUsUUFBZ0IsRUFBRSxXQUFvQjtRQUN0RSxPQUFPLGVBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO0lBQ25DLENBQUM7SUFFRCw4Q0FBaUIsR0FBakIsVUFBa0IsUUFBZ0IsSUFBWSxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQztJQUVsRywyREFBOEIsR0FBOUIsY0FBMkMsT0FBTyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBRW5FLDZDQUFnQixHQUFoQixVQUFpQixJQUFZO1FBQzNCLElBQUksSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUM3QyxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsMEJBQXdCLElBQUkseUNBQXNDLEVBQUMsQ0FBQztTQUMvRjthQUFNO1lBQ0wsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCw4Q0FBaUIsR0FBakIsVUFBa0IsSUFBWTtRQUM1QixJQUFJLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDN0MsT0FBTztnQkFDTCxLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsMkJBQXlCLElBQUkseUNBQXNDO2FBQ3pFLENBQUM7U0FDSDthQUFNO1lBQ0wsT0FBTyxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsQ0FBQztTQUN2QjtJQUNILENBQUM7SUFFRCw0REFBK0IsR0FBL0IsVUFBZ0MsUUFBZ0IsSUFBWSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDOUUseURBQTRCLEdBQTVCLFVBQTZCLGFBQXFCLEVBQUUsZ0JBQXdCLEVBQUUsR0FBa0I7UUFFOUYsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBQyxDQUFDO0lBQ2hELENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFuREQsSUFtREM7QUFuRFksZ0RBQWtCIn0=