"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createTransitionInstruction(element, triggerName, fromState, toState, isRemovalTransition, fromStyles, toStyles, timelines, queriedElements, preStyleProps, postStyleProps, totalTime, errors) {
    return {
        type: 0 /* TransitionAnimation */,
        element: element,
        triggerName: triggerName,
        isRemovalTransition: isRemovalTransition,
        fromState: fromState,
        fromStyles: fromStyles,
        toState: toState,
        toStyles: toStyles,
        timelines: timelines,
        queriedElements: queriedElements,
        preStyleProps: preStyleProps,
        postStyleProps: postStyleProps,
        totalTime: totalTime,
        errors: errors
    };
}
exports.createTransitionInstruction = createTransitionInstruction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5pbWF0aW9uX3RyYW5zaXRpb25faW5zdHJ1Y3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9wYWNrYWdlcy9hbmltYXRpb25zL2Jyb3dzZXIvc3JjL2RzbC9hbmltYXRpb25fdHJhbnNpdGlvbl9pbnN0cnVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQTJCQSxxQ0FDSSxPQUFZLEVBQUUsV0FBbUIsRUFBRSxTQUFpQixFQUFFLE9BQWUsRUFDckUsbUJBQTRCLEVBQUUsVUFBc0IsRUFBRSxRQUFvQixFQUMxRSxTQUF5QyxFQUFFLGVBQXNCLEVBQ2pFLGFBQWtELEVBQ2xELGNBQW1ELEVBQUUsU0FBaUIsRUFDdEUsTUFBYztJQUNoQixPQUFPO1FBQ0wsSUFBSSw2QkFBd0Q7UUFDNUQsT0FBTyxTQUFBO1FBQ1AsV0FBVyxhQUFBO1FBQ1gsbUJBQW1CLHFCQUFBO1FBQ25CLFNBQVMsV0FBQTtRQUNULFVBQVUsWUFBQTtRQUNWLE9BQU8sU0FBQTtRQUNQLFFBQVEsVUFBQTtRQUNSLFNBQVMsV0FBQTtRQUNULGVBQWUsaUJBQUE7UUFDZixhQUFhLGVBQUE7UUFDYixjQUFjLGdCQUFBO1FBQ2QsU0FBUyxXQUFBO1FBQ1QsTUFBTSxRQUFBO0tBQ1AsQ0FBQztBQUNKLENBQUM7QUF2QkQsa0VBdUJDIn0=