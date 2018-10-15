"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Called when directives inject each other (creating a circular dependency) */
function throwCyclicDependencyError(token) {
    throw new Error("Cannot instantiate cyclic dependency! " + token);
}
exports.throwCyclicDependencyError = throwCyclicDependencyError;
/** Called when there are multiple component selectors that match a given node */
function throwMultipleComponentError(tNode) {
    throw new Error("Multiple components match node with tagname " + tNode.tagName);
}
exports.throwMultipleComponentError = throwMultipleComponentError;
/** Throws an ExpressionChangedAfterChecked error if checkNoChanges mode is on. */
function throwErrorIfNoChangesMode(creationMode, checkNoChangesMode, oldValue, currValue) {
    if (checkNoChangesMode) {
        var msg = "ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked. Previous value: '" + oldValue + "'. Current value: '" + currValue + "'.";
        if (creationMode) {
            msg +=
                " It seems like the view has been created after its parent and its children have been dirty checked." +
                    " Has it been created in a change detection hook ?";
        }
        // TODO: include debug context
        throw new Error(msg);
    }
}
exports.throwErrorIfNoChangesMode = throwErrorIfNoChangesMode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3JzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9lcnJvcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFVQSxnRkFBZ0Y7QUFDaEYsb0NBQTJDLEtBQVU7SUFDbkQsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBeUMsS0FBTyxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQUZELGdFQUVDO0FBRUQsaUZBQWlGO0FBQ2pGLHFDQUE0QyxLQUFZO0lBQ3RELE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQStDLEtBQUssQ0FBQyxPQUFTLENBQUMsQ0FBQztBQUNsRixDQUFDO0FBRkQsa0VBRUM7QUFFRCxrRkFBa0Y7QUFDbEYsbUNBQ0ksWUFBcUIsRUFBRSxrQkFBMkIsRUFBRSxRQUFhLEVBQUUsU0FBYztJQUNuRixJQUFJLGtCQUFrQixFQUFFO1FBQ3RCLElBQUksR0FBRyxHQUNILGdIQUE4RyxRQUFRLDJCQUFzQixTQUFTLE9BQUksQ0FBQztRQUM5SixJQUFJLFlBQVksRUFBRTtZQUNoQixHQUFHO2dCQUNDLHFHQUFxRztvQkFDckcsbURBQW1ELENBQUM7U0FDekQ7UUFDRCw4QkFBOEI7UUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN0QjtBQUNILENBQUM7QUFiRCw4REFhQyJ9