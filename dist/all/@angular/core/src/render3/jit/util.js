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
var injector_1 = require("../../di/injector");
var metadata_1 = require("../../di/metadata");
var element_ref_1 = require("../../linker/element_ref");
var template_ref_1 = require("../../linker/template_ref");
var view_container_ref_1 = require("../../linker/view_container_ref");
var di_1 = require("../../metadata/di");
var reflection_capabilities_1 = require("../../reflection/reflection_capabilities");
var _reflect = null;
function getReflect() {
    return (_reflect = _reflect || new reflection_capabilities_1.ReflectionCapabilities());
}
exports.getReflect = getReflect;
function reflectDependencies(type) {
    return convertDependencies(getReflect().parameters(type));
}
exports.reflectDependencies = reflectDependencies;
function convertDependencies(deps) {
    return deps.map(function (dep) { return reflectDependency(dep); });
}
exports.convertDependencies = convertDependencies;
function reflectDependency(dep) {
    var meta = {
        token: new compiler_1.LiteralExpr(null),
        host: false,
        optional: false,
        resolved: compiler_1.R3ResolvedDependencyType.Token,
        self: false,
        skipSelf: false,
    };
    function setTokenAndResolvedType(token) {
        if (token === element_ref_1.ElementRef) {
            meta.resolved = compiler_1.R3ResolvedDependencyType.ElementRef;
        }
        else if (token === injector_1.Injector) {
            meta.resolved = compiler_1.R3ResolvedDependencyType.Injector;
        }
        else if (token === template_ref_1.TemplateRef) {
            meta.resolved = compiler_1.R3ResolvedDependencyType.TemplateRef;
        }
        else if (token === view_container_ref_1.ViewContainerRef) {
            meta.resolved = compiler_1.R3ResolvedDependencyType.ViewContainerRef;
        }
        else {
            meta.resolved = compiler_1.R3ResolvedDependencyType.Token;
        }
        meta.token = new compiler_1.WrappedNodeExpr(token);
    }
    if (Array.isArray(dep)) {
        if (dep.length === 0) {
            throw new Error('Dependency array must have arguments.');
        }
        for (var j = 0; j < dep.length; j++) {
            var param = dep[j];
            if (param instanceof metadata_1.Optional || param.__proto__.ngMetadataName === 'Optional') {
                meta.optional = true;
            }
            else if (param instanceof metadata_1.SkipSelf || param.__proto__.ngMetadataName === 'SkipSelf') {
                meta.skipSelf = true;
            }
            else if (param instanceof metadata_1.Self || param.__proto__.ngMetadataName === 'Self') {
                meta.self = true;
            }
            else if (param instanceof metadata_1.Host || param.__proto__.ngMetadataName === 'Host') {
                meta.host = true;
            }
            else if (param instanceof metadata_1.Inject) {
                meta.token = new compiler_1.WrappedNodeExpr(param.token);
            }
            else if (param instanceof di_1.Attribute) {
                if (param.attributeName === undefined) {
                    throw new Error("Attribute name must be defined.");
                }
                meta.token = new compiler_1.LiteralExpr(param.attributeName);
                meta.resolved = compiler_1.R3ResolvedDependencyType.Attribute;
            }
            else {
                setTokenAndResolvedType(param);
            }
        }
    }
    else {
        setTokenAndResolvedType(dep);
    }
    return meta;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3JlbmRlcjMvaml0L3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw4Q0FBK0c7QUFFL0csOENBQTJDO0FBQzNDLDhDQUF5RTtBQUN6RSx3REFBb0Q7QUFDcEQsMERBQXNEO0FBQ3RELHNFQUFpRTtBQUNqRSx3Q0FBNEM7QUFDNUMsb0ZBQWdGO0FBR2hGLElBQUksUUFBUSxHQUFnQyxJQUFJLENBQUM7QUFFakQ7SUFDRSxPQUFPLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxJQUFJLGdEQUFzQixFQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBRkQsZ0NBRUM7QUFFRCw2QkFBb0MsSUFBZTtJQUNqRCxPQUFPLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFGRCxrREFFQztBQUVELDZCQUFvQyxJQUFXO0lBQzdDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUM7QUFDakQsQ0FBQztBQUZELGtEQUVDO0FBRUQsMkJBQTJCLEdBQWdCO0lBQ3pDLElBQU0sSUFBSSxHQUF5QjtRQUNqQyxLQUFLLEVBQUUsSUFBSSxzQkFBVyxDQUFDLElBQUksQ0FBQztRQUM1QixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLG1DQUF3QixDQUFDLEtBQUs7UUFDeEMsSUFBSSxFQUFFLEtBQUs7UUFDWCxRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDO0lBRUYsaUNBQWlDLEtBQVU7UUFDekMsSUFBSSxLQUFLLEtBQUssd0JBQVUsRUFBRTtZQUN4QixJQUFJLENBQUMsUUFBUSxHQUFHLG1DQUF3QixDQUFDLFVBQVUsQ0FBQztTQUNyRDthQUFNLElBQUksS0FBSyxLQUFLLG1CQUFRLEVBQUU7WUFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQ0FBd0IsQ0FBQyxRQUFRLENBQUM7U0FDbkQ7YUFBTSxJQUFJLEtBQUssS0FBSywwQkFBVyxFQUFFO1lBQ2hDLElBQUksQ0FBQyxRQUFRLEdBQUcsbUNBQXdCLENBQUMsV0FBVyxDQUFDO1NBQ3REO2FBQU0sSUFBSSxLQUFLLEtBQUsscUNBQWdCLEVBQUU7WUFDckMsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQ0FBd0IsQ0FBQyxnQkFBZ0IsQ0FBQztTQUMzRDthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxtQ0FBd0IsQ0FBQyxLQUFLLENBQUM7U0FDaEQ7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksMEJBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ3RCLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDcEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1NBQzFEO1FBQ0QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLElBQUksS0FBSyxZQUFZLG1CQUFRLElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEtBQUssVUFBVSxFQUFFO2dCQUM5RSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQzthQUN0QjtpQkFBTSxJQUFJLEtBQUssWUFBWSxtQkFBUSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRTtnQkFDckYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDdEI7aUJBQU0sSUFBSSxLQUFLLFlBQVksZUFBSSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxLQUFLLE1BQU0sRUFBRTtnQkFDN0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDbEI7aUJBQU0sSUFBSSxLQUFLLFlBQVksZUFBSSxJQUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxLQUFLLE1BQU0sRUFBRTtnQkFDN0UsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDbEI7aUJBQU0sSUFBSSxLQUFLLFlBQVksaUJBQU0sRUFBRTtnQkFDbEMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLDBCQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQy9DO2lCQUFNLElBQUksS0FBSyxZQUFZLGNBQVMsRUFBRTtnQkFDckMsSUFBSSxLQUFLLENBQUMsYUFBYSxLQUFLLFNBQVMsRUFBRTtvQkFDckMsTUFBTSxJQUFJLEtBQUssQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO2lCQUNwRDtnQkFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksc0JBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxRQUFRLEdBQUcsbUNBQXdCLENBQUMsU0FBUyxDQUFDO2FBQ3BEO2lCQUFNO2dCQUNMLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hDO1NBQ0Y7S0FDRjtTQUFNO1FBQ0wsdUJBQXVCLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDOUI7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMifQ==