"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// Metadata Schema
// If you make a backwards incompatible change to the schema, increment the METADTA_VERSION number.
// If you make a backwards compatible change to the metadata (such as adding an option field) then
// leave METADATA_VERSION the same. If possible, supply as many versions of the metadata that can
// represent the semantics of the file in an array. For example, when generating a version 2 file,
// if version 1 can accurately represent the metadata, generate both version 1 and version 2 in
// an array.
exports.METADATA_VERSION = 4;
function isModuleMetadata(value) {
    return value && value.__symbolic === 'module';
}
exports.isModuleMetadata = isModuleMetadata;
function isClassMetadata(value) {
    return value && value.__symbolic === 'class';
}
exports.isClassMetadata = isClassMetadata;
function isInterfaceMetadata(value) {
    return value && value.__symbolic === 'interface';
}
exports.isInterfaceMetadata = isInterfaceMetadata;
function isMemberMetadata(value) {
    if (value) {
        switch (value.__symbolic) {
            case 'constructor':
            case 'method':
            case 'property':
                return true;
        }
    }
    return false;
}
exports.isMemberMetadata = isMemberMetadata;
function isMethodMetadata(value) {
    return value && (value.__symbolic === 'constructor' || value.__symbolic === 'method');
}
exports.isMethodMetadata = isMethodMetadata;
function isConstructorMetadata(value) {
    return value && value.__symbolic === 'constructor';
}
exports.isConstructorMetadata = isConstructorMetadata;
function isFunctionMetadata(value) {
    return value && value.__symbolic === 'function';
}
exports.isFunctionMetadata = isFunctionMetadata;
function isMetadataSymbolicExpression(value) {
    if (value) {
        switch (value.__symbolic) {
            case 'binary':
            case 'call':
            case 'index':
            case 'new':
            case 'pre':
            case 'reference':
            case 'select':
            case 'spread':
            case 'if':
                return true;
        }
    }
    return false;
}
exports.isMetadataSymbolicExpression = isMetadataSymbolicExpression;
function isMetadataSymbolicBinaryExpression(value) {
    return value && value.__symbolic === 'binary';
}
exports.isMetadataSymbolicBinaryExpression = isMetadataSymbolicBinaryExpression;
function isMetadataSymbolicIndexExpression(value) {
    return value && value.__symbolic === 'index';
}
exports.isMetadataSymbolicIndexExpression = isMetadataSymbolicIndexExpression;
function isMetadataSymbolicCallExpression(value) {
    return value && (value.__symbolic === 'call' || value.__symbolic === 'new');
}
exports.isMetadataSymbolicCallExpression = isMetadataSymbolicCallExpression;
function isMetadataSymbolicPrefixExpression(value) {
    return value && value.__symbolic === 'pre';
}
exports.isMetadataSymbolicPrefixExpression = isMetadataSymbolicPrefixExpression;
function isMetadataSymbolicIfExpression(value) {
    return value && value.__symbolic === 'if';
}
exports.isMetadataSymbolicIfExpression = isMetadataSymbolicIfExpression;
function isMetadataGlobalReferenceExpression(value) {
    return value && value.name && !value.module && isMetadataSymbolicReferenceExpression(value);
}
exports.isMetadataGlobalReferenceExpression = isMetadataGlobalReferenceExpression;
function isMetadataModuleReferenceExpression(value) {
    return value && value.module && !value.name && !value.default &&
        isMetadataSymbolicReferenceExpression(value);
}
exports.isMetadataModuleReferenceExpression = isMetadataModuleReferenceExpression;
function isMetadataImportedSymbolReferenceExpression(value) {
    return value && value.module && !!value.name && isMetadataSymbolicReferenceExpression(value);
}
exports.isMetadataImportedSymbolReferenceExpression = isMetadataImportedSymbolReferenceExpression;
function isMetadataImportDefaultReference(value) {
    return value && value.module && value.default && isMetadataSymbolicReferenceExpression(value);
}
exports.isMetadataImportDefaultReference = isMetadataImportDefaultReference;
function isMetadataSymbolicReferenceExpression(value) {
    return value && value.__symbolic === 'reference';
}
exports.isMetadataSymbolicReferenceExpression = isMetadataSymbolicReferenceExpression;
function isMetadataSymbolicSelectExpression(value) {
    return value && value.__symbolic === 'select';
}
exports.isMetadataSymbolicSelectExpression = isMetadataSymbolicSelectExpression;
function isMetadataSymbolicSpreadExpression(value) {
    return value && value.__symbolic === 'spread';
}
exports.isMetadataSymbolicSpreadExpression = isMetadataSymbolicSpreadExpression;
function isMetadataError(value) {
    return value && value.__symbolic === 'error';
}
exports.isMetadataError = isMetadataError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NoZW1hLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXItY2xpL3NyYy9tZXRhZGF0YS9zY2hlbWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCxrQkFBa0I7QUFFbEIsbUdBQW1HO0FBRW5HLGtHQUFrRztBQUNsRyxpR0FBaUc7QUFDakcsa0dBQWtHO0FBQ2xHLCtGQUErRjtBQUMvRixZQUFZO0FBRUMsUUFBQSxnQkFBZ0IsR0FBRyxDQUFDLENBQUM7QUFZbEMsMEJBQWlDLEtBQVU7SUFDekMsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUM7QUFDaEQsQ0FBQztBQUZELDRDQUVDO0FBZUQseUJBQWdDLEtBQVU7SUFDeEMsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxPQUFPLENBQUM7QUFDL0MsQ0FBQztBQUZELDBDQUVDO0FBR0QsNkJBQW9DLEtBQVU7SUFDNUMsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUM7QUFDbkQsQ0FBQztBQUZELGtEQUVDO0FBUUQsMEJBQWlDLEtBQVU7SUFDekMsSUFBSSxLQUFLLEVBQUU7UUFDVCxRQUFRLEtBQUssQ0FBQyxVQUFVLEVBQUU7WUFDeEIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxRQUFRLENBQUM7WUFDZCxLQUFLLFVBQVU7Z0JBQ2IsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBVkQsNENBVUM7QUFNRCwwQkFBaUMsS0FBVTtJQUN6QyxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssYUFBYSxJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssUUFBUSxDQUFDLENBQUM7QUFDeEYsQ0FBQztBQUZELDRDQUVDO0FBTUQsK0JBQXNDLEtBQVU7SUFDOUMsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxhQUFhLENBQUM7QUFDckQsQ0FBQztBQUZELHNEQUVDO0FBUUQsNEJBQW1DLEtBQVU7SUFDM0MsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxVQUFVLENBQUM7QUFDbEQsQ0FBQztBQUZELGdEQUVDO0FBcUJELHNDQUE2QyxLQUFVO0lBQ3JELElBQUksS0FBSyxFQUFFO1FBQ1QsUUFBUSxLQUFLLENBQUMsVUFBVSxFQUFFO1lBQ3hCLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssS0FBSyxDQUFDO1lBQ1gsS0FBSyxLQUFLLENBQUM7WUFDWCxLQUFLLFdBQVcsQ0FBQztZQUNqQixLQUFLLFFBQVEsQ0FBQztZQUNkLEtBQUssUUFBUSxDQUFDO1lBQ2QsS0FBSyxJQUFJO2dCQUNQLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7S0FDRjtJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQztBQWhCRCxvRUFnQkM7QUFTRCw0Q0FBbUQsS0FBVTtJQUUzRCxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQztBQUNoRCxDQUFDO0FBSEQsZ0ZBR0M7QUFPRCwyQ0FBa0QsS0FBVTtJQUUxRCxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsVUFBVSxLQUFLLE9BQU8sQ0FBQztBQUMvQyxDQUFDO0FBSEQsOEVBR0M7QUFPRCwwQ0FBaUQsS0FBVTtJQUV6RCxPQUFPLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssS0FBSyxDQUFDLENBQUM7QUFDOUUsQ0FBQztBQUhELDRFQUdDO0FBT0QsNENBQW1ELEtBQVU7SUFFM0QsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUM7QUFDN0MsQ0FBQztBQUhELGdGQUdDO0FBUUQsd0NBQStDLEtBQVU7SUFDdkQsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxJQUFJLENBQUM7QUFDNUMsQ0FBQztBQUZELHdFQUVDO0FBbUJELDZDQUFvRCxLQUFVO0lBRTVELE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLHFDQUFxQyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlGLENBQUM7QUFIRCxrRkFHQztBQU1ELDZDQUFvRCxLQUFVO0lBRTVELE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU87UUFDekQscUNBQXFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbkQsQ0FBQztBQUpELGtGQUlDO0FBUUQscURBQTRELEtBQVU7SUFFcEUsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxxQ0FBcUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvRixDQUFDO0FBSEQsa0dBR0M7QUFTRCwwQ0FBaUQsS0FBVTtJQUV6RCxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxPQUFPLElBQUkscUNBQXFDLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEcsQ0FBQztBQUhELDRFQUdDO0FBS0QsK0NBQXNELEtBQVU7SUFFOUQsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxXQUFXLENBQUM7QUFDbkQsQ0FBQztBQUhELHNGQUdDO0FBT0QsNENBQW1ELEtBQVU7SUFFM0QsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUM7QUFDaEQsQ0FBQztBQUhELGdGQUdDO0FBTUQsNENBQW1ELEtBQVU7SUFFM0QsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLFVBQVUsS0FBSyxRQUFRLENBQUM7QUFDaEQsQ0FBQztBQUhELGdGQUdDO0FBeUJELHlCQUFnQyxLQUFVO0lBQ3hDLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssT0FBTyxDQUFDO0FBQy9DLENBQUM7QUFGRCwwQ0FFQyJ9