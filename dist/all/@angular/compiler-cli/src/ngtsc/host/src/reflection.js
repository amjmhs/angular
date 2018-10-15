"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An enumeration of possible kinds of class members.
 */
var ClassMemberKind;
(function (ClassMemberKind) {
    ClassMemberKind[ClassMemberKind["Constructor"] = 0] = "Constructor";
    ClassMemberKind[ClassMemberKind["Getter"] = 1] = "Getter";
    ClassMemberKind[ClassMemberKind["Setter"] = 2] = "Setter";
    ClassMemberKind[ClassMemberKind["Property"] = 3] = "Property";
    ClassMemberKind[ClassMemberKind["Method"] = 4] = "Method";
})(ClassMemberKind = exports.ClassMemberKind || (exports.ClassMemberKind = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyLWNsaS9zcmMvbmd0c2MvaG9zdC9zcmMvcmVmbGVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQWlDSDs7R0FFRztBQUNILElBQVksZUFNWDtBQU5ELFdBQVksZUFBZTtJQUN6QixtRUFBVyxDQUFBO0lBQ1gseURBQU0sQ0FBQTtJQUNOLHlEQUFNLENBQUE7SUFDTiw2REFBUSxDQUFBO0lBQ1IseURBQU0sQ0FBQTtBQUNSLENBQUMsRUFOVyxlQUFlLEdBQWYsdUJBQWUsS0FBZix1QkFBZSxRQU0xQiJ9