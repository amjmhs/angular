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
var i18n = require("../i18n_ast");
var Serializer = /** @class */ (function () {
    function Serializer() {
    }
    // Creates a name mapper, see `PlaceholderMapper`
    // Returning `null` means that no name mapping is used.
    Serializer.prototype.createNameMapper = function (message) { return null; };
    return Serializer;
}());
exports.Serializer = Serializer;
/**
 * A simple mapper that take a function to transform an internal name to a public name
 */
var SimplePlaceholderMapper = /** @class */ (function (_super) {
    __extends(SimplePlaceholderMapper, _super);
    // create a mapping from the message
    function SimplePlaceholderMapper(message, mapName) {
        var _this = _super.call(this) || this;
        _this.mapName = mapName;
        _this.internalToPublic = {};
        _this.publicToNextId = {};
        _this.publicToInternal = {};
        message.nodes.forEach(function (node) { return node.visit(_this); });
        return _this;
    }
    SimplePlaceholderMapper.prototype.toPublicName = function (internalName) {
        return this.internalToPublic.hasOwnProperty(internalName) ?
            this.internalToPublic[internalName] :
            null;
    };
    SimplePlaceholderMapper.prototype.toInternalName = function (publicName) {
        return this.publicToInternal.hasOwnProperty(publicName) ? this.publicToInternal[publicName] :
            null;
    };
    SimplePlaceholderMapper.prototype.visitText = function (text, context) { return null; };
    SimplePlaceholderMapper.prototype.visitTagPlaceholder = function (ph, context) {
        this.visitPlaceholderName(ph.startName);
        _super.prototype.visitTagPlaceholder.call(this, ph, context);
        this.visitPlaceholderName(ph.closeName);
    };
    SimplePlaceholderMapper.prototype.visitPlaceholder = function (ph, context) { this.visitPlaceholderName(ph.name); };
    SimplePlaceholderMapper.prototype.visitIcuPlaceholder = function (ph, context) {
        this.visitPlaceholderName(ph.name);
    };
    // XMB placeholders could only contains A-Z, 0-9 and _
    SimplePlaceholderMapper.prototype.visitPlaceholderName = function (internalName) {
        if (!internalName || this.internalToPublic.hasOwnProperty(internalName)) {
            return;
        }
        var publicName = this.mapName(internalName);
        if (this.publicToInternal.hasOwnProperty(publicName)) {
            // Create a new XMB when it has already been used
            var nextId = this.publicToNextId[publicName];
            this.publicToNextId[publicName] = nextId + 1;
            publicName = publicName + "_" + nextId;
        }
        else {
            this.publicToNextId[publicName] = 1;
        }
        this.internalToPublic[internalName] = publicName;
        this.publicToInternal[publicName] = internalName;
    };
    return SimplePlaceholderMapper;
}(i18n.RecurseVisitor));
exports.SimplePlaceholderMapper = SimplePlaceholderMapper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VyaWFsaXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9pMThuL3NlcmlhbGl6ZXJzL3NlcmlhbGl6ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0FBRUgsa0NBQW9DO0FBRXBDO0lBQUE7SUFjQSxDQUFDO0lBSEMsaURBQWlEO0lBQ2pELHVEQUF1RDtJQUN2RCxxQ0FBZ0IsR0FBaEIsVUFBaUIsT0FBcUIsSUFBNEIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLGlCQUFDO0FBQUQsQ0FBQyxBQWRELElBY0M7QUFkcUIsZ0NBQVU7QUE0QmhDOztHQUVHO0FBQ0g7SUFBNkMsMkNBQW1CO0lBSzlELG9DQUFvQztJQUNwQyxpQ0FBWSxPQUFxQixFQUFVLE9BQWlDO1FBQTVFLFlBQ0UsaUJBQU8sU0FFUjtRQUgwQyxhQUFPLEdBQVAsT0FBTyxDQUEwQjtRQUxwRSxzQkFBZ0IsR0FBMEIsRUFBRSxDQUFDO1FBQzdDLG9CQUFjLEdBQTBCLEVBQUUsQ0FBQztRQUMzQyxzQkFBZ0IsR0FBMEIsRUFBRSxDQUFDO1FBS25ELE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFJLENBQUMsRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDOztJQUNsRCxDQUFDO0lBRUQsOENBQVksR0FBWixVQUFhLFlBQW9CO1FBQy9CLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQztJQUNYLENBQUM7SUFFRCxnREFBYyxHQUFkLFVBQWUsVUFBa0I7UUFDL0IsT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUNuQyxJQUFJLENBQUM7SUFDakUsQ0FBQztJQUVELDJDQUFTLEdBQVQsVUFBVSxJQUFlLEVBQUUsT0FBYSxJQUFTLE9BQU8sSUFBSSxDQUFDLENBQUMsQ0FBQztJQUUvRCxxREFBbUIsR0FBbkIsVUFBb0IsRUFBdUIsRUFBRSxPQUFhO1FBQ3hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDeEMsaUJBQU0sbUJBQW1CLFlBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELGtEQUFnQixHQUFoQixVQUFpQixFQUFvQixFQUFFLE9BQWEsSUFBUyxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsRyxxREFBbUIsR0FBbkIsVUFBb0IsRUFBdUIsRUFBRSxPQUFhO1FBQ3hELElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVELHNEQUFzRDtJQUM5QyxzREFBb0IsR0FBNUIsVUFBNkIsWUFBb0I7UUFDL0MsSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxFQUFFO1lBQ3ZFLE9BQU87U0FDUjtRQUVELElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7UUFFNUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQ3BELGlEQUFpRDtZQUNqRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQy9DLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxDQUFDLEdBQUcsTUFBTSxHQUFHLENBQUMsQ0FBQztZQUM3QyxVQUFVLEdBQU0sVUFBVSxTQUFJLE1BQVEsQ0FBQztTQUN4QzthQUFNO1lBQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckM7UUFFRCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ2pELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsR0FBRyxZQUFZLENBQUM7SUFDbkQsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQXhERCxDQUE2QyxJQUFJLENBQUMsY0FBYyxHQXdEL0Q7QUF4RFksMERBQXVCIn0=