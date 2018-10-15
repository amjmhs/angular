"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var config_1 = require("../src/config");
{
    describe('compiler config', function () {
        it('should set missing translation strategy', function () {
            var config = new config_1.CompilerConfig({ missingTranslation: core_1.MissingTranslationStrategy.Error });
            expect(config.missingTranslation).toEqual(core_1.MissingTranslationStrategy.Error);
        });
    });
    describe('preserveWhitespacesDefault', function () {
        it('should return the default `false` setting when no preserveWhitespacesOption are provided', function () { expect(config_1.preserveWhitespacesDefault(null)).toEqual(false); });
        it('should return the preserveWhitespacesOption when provided as a parameter', function () {
            expect(config_1.preserveWhitespacesDefault(true)).toEqual(true);
            expect(config_1.preserveWhitespacesDefault(false)).toEqual(false);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnX3NwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9jb21waWxlci90ZXN0L2NvbmZpZ19zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0NBQXlEO0FBQ3pELHdDQUF5RTtBQUV6RTtJQUNFLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMseUNBQXlDLEVBQUU7WUFDNUMsSUFBTSxNQUFNLEdBQUcsSUFBSSx1QkFBYyxDQUFDLEVBQUMsa0JBQWtCLEVBQUUsaUNBQTBCLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztZQUMxRixNQUFNLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUMsT0FBTyxDQUFDLGlDQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsRUFBRSxDQUFDLDBGQUEwRixFQUMxRixjQUFRLE1BQU0sQ0FBQyxtQ0FBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLEVBQUUsQ0FBQywwRUFBMEUsRUFBRTtZQUM3RSxNQUFNLENBQUMsbUNBQTBCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkQsTUFBTSxDQUFDLG1DQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7Q0FDSiJ9