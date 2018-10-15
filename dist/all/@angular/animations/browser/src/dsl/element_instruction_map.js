"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ElementInstructionMap = /** @class */ (function () {
    function ElementInstructionMap() {
        this._map = new Map();
    }
    ElementInstructionMap.prototype.consume = function (element) {
        var instructions = this._map.get(element);
        if (instructions) {
            this._map.delete(element);
        }
        else {
            instructions = [];
        }
        return instructions;
    };
    ElementInstructionMap.prototype.append = function (element, instructions) {
        var existingInstructions = this._map.get(element);
        if (!existingInstructions) {
            this._map.set(element, existingInstructions = []);
        }
        existingInstructions.push.apply(existingInstructions, instructions);
    };
    ElementInstructionMap.prototype.has = function (element) { return this._map.has(element); };
    ElementInstructionMap.prototype.clear = function () { this._map.clear(); };
    return ElementInstructionMap;
}());
exports.ElementInstructionMap = ElementInstructionMap;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudF9pbnN0cnVjdGlvbl9tYXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9lbGVtZW50X2luc3RydWN0aW9uX21hcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVNBO0lBQUE7UUFDVSxTQUFJLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7SUF1QmhFLENBQUM7SUFyQkMsdUNBQU8sR0FBUCxVQUFRLE9BQVk7UUFDbEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUMsSUFBSSxZQUFZLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLFlBQVksR0FBRyxFQUFFLENBQUM7U0FDbkI7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQsc0NBQU0sR0FBTixVQUFPLE9BQVksRUFBRSxZQUE0QztRQUMvRCxJQUFJLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsb0JBQW9CLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDbkQ7UUFDRCxvQkFBb0IsQ0FBQyxJQUFJLE9BQXpCLG9CQUFvQixFQUFTLFlBQVksRUFBRTtJQUM3QyxDQUFDO0lBRUQsbUNBQUcsR0FBSCxVQUFJLE9BQVksSUFBYSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUU3RCxxQ0FBSyxHQUFMLGNBQVUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEMsNEJBQUM7QUFBRCxDQUFDLEFBeEJELElBd0JDO0FBeEJZLHNEQUFxQiJ9