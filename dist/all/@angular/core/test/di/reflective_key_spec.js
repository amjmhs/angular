"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var reflective_key_1 = require("@angular/core/src/di/reflective_key");
{
    describe('key', function () {
        var registry;
        beforeEach(function () { registry = new reflective_key_1.KeyRegistry(); });
        it('should be equal to another key if type is the same', function () { expect(registry.get('car')).toBe(registry.get('car')); });
        it('should not be equal to another key if types are different', function () { expect(registry.get('car')).not.toBe(registry.get('porsche')); });
        it('should return the passed in key', function () { expect(registry.get(registry.get('car'))).toBe(registry.get('car')); });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVmbGVjdGl2ZV9rZXlfc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvdGVzdC9kaS9yZWZsZWN0aXZlX2tleV9zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsc0VBQWdFO0FBRWhFO0lBQ0UsUUFBUSxDQUFDLEtBQUssRUFBRTtRQUNkLElBQUksUUFBcUIsQ0FBQztRQUUxQixVQUFVLENBQUMsY0FBYSxRQUFRLEdBQUcsSUFBSSw0QkFBVyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUV6RCxFQUFFLENBQUMsb0RBQW9ELEVBQ3BELGNBQWEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUUsRUFBRSxDQUFDLDJEQUEyRCxFQUMzRCxjQUFhLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVsRixFQUFFLENBQUMsaUNBQWlDLEVBQ2pDLGNBQWEsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBRTFGLENBQUMsQ0FBQyxDQUFDO0NBQ0oifQ==