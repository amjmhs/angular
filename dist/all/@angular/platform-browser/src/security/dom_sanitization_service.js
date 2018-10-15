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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.SecurityContext = core_1.SecurityContext;
var dom_tokens_1 = require("../dom/dom_tokens");
/**
 * DomSanitizer helps preventing Cross Site Scripting Security bugs (XSS) by sanitizing
 * values to be safe to use in the different DOM contexts.
 *
 * For example, when binding a URL in an `<a [href]="someValue">` hyperlink, `someValue` will be
 * sanitized so that an attacker cannot inject e.g. a `javascript:` URL that would execute code on
 * the website.
 *
 * In specific situations, it might be necessary to disable sanitization, for example if the
 * application genuinely needs to produce a `javascript:` style link with a dynamic value in it.
 * Users can bypass security by constructing a value with one of the `bypassSecurityTrust...`
 * methods, and then binding to that value from the template.
 *
 * These situations should be very rare, and extraordinary care must be taken to avoid creating a
 * Cross Site Scripting (XSS) security bug!
 *
 * When using `bypassSecurityTrust...`, make sure to call the method as early as possible and as
 * close as possible to the source of the value, to make it easy to verify no security bug is
 * created by its use.
 *
 * It is not required (and not recommended) to bypass security if the value is safe, e.g. a URL that
 * does not start with a suspicious protocol, or an HTML snippet that does not contain dangerous
 * code. The sanitizer leaves safe values intact.
 *
 * @security Calling any of the `bypassSecurityTrust...` APIs disables Angular's built-in
 * sanitization for the value passed in. Carefully check and audit all values and code paths going
 * into this call. Make sure any user data is appropriately escaped for this security context.
 * For more detail, see the [Security Guide](http://g.co/ng/security).
 *
 *
 */
var DomSanitizer = /** @class */ (function () {
    function DomSanitizer() {
    }
    return DomSanitizer;
}());
exports.DomSanitizer = DomSanitizer;
var DomSanitizerImpl = /** @class */ (function (_super) {
    __extends(DomSanitizerImpl, _super);
    function DomSanitizerImpl(_doc) {
        var _this = _super.call(this) || this;
        _this._doc = _doc;
        return _this;
    }
    DomSanitizerImpl.prototype.sanitize = function (ctx, value) {
        if (value == null)
            return null;
        switch (ctx) {
            case core_1.SecurityContext.NONE:
                return value;
            case core_1.SecurityContext.HTML:
                if (value instanceof SafeHtmlImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'HTML');
                return core_1.ɵ_sanitizeHtml(this._doc, String(value));
            case core_1.SecurityContext.STYLE:
                if (value instanceof SafeStyleImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Style');
                return core_1.ɵ_sanitizeStyle(value);
            case core_1.SecurityContext.SCRIPT:
                if (value instanceof SafeScriptImpl)
                    return value.changingThisBreaksApplicationSecurity;
                this.checkNotSafeValue(value, 'Script');
                throw new Error('unsafe value used in a script context');
            case core_1.SecurityContext.URL:
                if (value instanceof SafeResourceUrlImpl || value instanceof SafeUrlImpl) {
                    // Allow resource URLs in URL contexts, they are strictly more trusted.
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'URL');
                return core_1.ɵ_sanitizeUrl(String(value));
            case core_1.SecurityContext.RESOURCE_URL:
                if (value instanceof SafeResourceUrlImpl) {
                    return value.changingThisBreaksApplicationSecurity;
                }
                this.checkNotSafeValue(value, 'ResourceURL');
                throw new Error('unsafe value used in a resource URL context (see http://g.co/ng/security#xss)');
            default:
                throw new Error("Unexpected SecurityContext " + ctx + " (see http://g.co/ng/security#xss)");
        }
    };
    DomSanitizerImpl.prototype.checkNotSafeValue = function (value, expectedType) {
        if (value instanceof SafeValueImpl) {
            throw new Error("Required a safe " + expectedType + ", got a " + value.getTypeName() + " " +
                "(see http://g.co/ng/security#xss)");
        }
    };
    DomSanitizerImpl.prototype.bypassSecurityTrustHtml = function (value) { return new SafeHtmlImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustStyle = function (value) { return new SafeStyleImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustScript = function (value) { return new SafeScriptImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustUrl = function (value) { return new SafeUrlImpl(value); };
    DomSanitizerImpl.prototype.bypassSecurityTrustResourceUrl = function (value) {
        return new SafeResourceUrlImpl(value);
    };
    DomSanitizerImpl = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(dom_tokens_1.DOCUMENT)),
        __metadata("design:paramtypes", [Object])
    ], DomSanitizerImpl);
    return DomSanitizerImpl;
}(DomSanitizer));
exports.DomSanitizerImpl = DomSanitizerImpl;
var SafeValueImpl = /** @class */ (function () {
    function SafeValueImpl(changingThisBreaksApplicationSecurity) {
        this.changingThisBreaksApplicationSecurity = changingThisBreaksApplicationSecurity;
        // empty
    }
    SafeValueImpl.prototype.toString = function () {
        return "SafeValue must use [property]=binding: " + this.changingThisBreaksApplicationSecurity +
            " (see http://g.co/ng/security#xss)";
    };
    return SafeValueImpl;
}());
var SafeHtmlImpl = /** @class */ (function (_super) {
    __extends(SafeHtmlImpl, _super);
    function SafeHtmlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeHtmlImpl.prototype.getTypeName = function () { return 'HTML'; };
    return SafeHtmlImpl;
}(SafeValueImpl));
var SafeStyleImpl = /** @class */ (function (_super) {
    __extends(SafeStyleImpl, _super);
    function SafeStyleImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeStyleImpl.prototype.getTypeName = function () { return 'Style'; };
    return SafeStyleImpl;
}(SafeValueImpl));
var SafeScriptImpl = /** @class */ (function (_super) {
    __extends(SafeScriptImpl, _super);
    function SafeScriptImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeScriptImpl.prototype.getTypeName = function () { return 'Script'; };
    return SafeScriptImpl;
}(SafeValueImpl));
var SafeUrlImpl = /** @class */ (function (_super) {
    __extends(SafeUrlImpl, _super);
    function SafeUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeUrlImpl.prototype.getTypeName = function () { return 'URL'; };
    return SafeUrlImpl;
}(SafeValueImpl));
var SafeResourceUrlImpl = /** @class */ (function (_super) {
    __extends(SafeResourceUrlImpl, _super);
    function SafeResourceUrlImpl() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeResourceUrlImpl.prototype.getTypeName = function () { return 'ResourceURL'; };
    return SafeResourceUrlImpl;
}(SafeValueImpl));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX3Nhbml0aXphdGlvbl9zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcGxhdGZvcm0tYnJvd3Nlci9zcmMvc2VjdXJpdHkvZG9tX3Nhbml0aXphdGlvbl9zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILHNDQUFnTDtBQUl4SywwQkFKK0Isc0JBQWUsQ0FJL0I7QUFGdkIsZ0RBQTJDO0FBZ0QzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEJHO0FBQ0g7SUFBQTtJQXNEQSxDQUFDO0lBQUQsbUJBQUM7QUFBRCxDQUFDLEFBdERELElBc0RDO0FBdERxQixvQ0FBWTtBQTBEbEM7SUFBc0Msb0NBQVk7SUFDaEQsMEJBQXNDLElBQVM7UUFBL0MsWUFBbUQsaUJBQU8sU0FBRztRQUF2QixVQUFJLEdBQUosSUFBSSxDQUFLOztJQUFhLENBQUM7SUFFN0QsbUNBQVEsR0FBUixVQUFTLEdBQW9CLEVBQUUsS0FBNEI7UUFDekQsSUFBSSxLQUFLLElBQUksSUFBSTtZQUFFLE9BQU8sSUFBSSxDQUFDO1FBQy9CLFFBQVEsR0FBRyxFQUFFO1lBQ1gsS0FBSyxzQkFBZSxDQUFDLElBQUk7Z0JBQ3ZCLE9BQU8sS0FBZSxDQUFDO1lBQ3pCLEtBQUssc0JBQWUsQ0FBQyxJQUFJO2dCQUN2QixJQUFJLEtBQUssWUFBWSxZQUFZO29CQUFFLE9BQU8sS0FBSyxDQUFDLHFDQUFxQyxDQUFDO2dCQUN0RixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QyxPQUFPLHFCQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNqRCxLQUFLLHNCQUFlLENBQUMsS0FBSztnQkFDeEIsSUFBSSxLQUFLLFlBQVks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