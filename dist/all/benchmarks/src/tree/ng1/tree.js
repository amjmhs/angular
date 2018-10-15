"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function addTreeToModule(mod) {
    return mod
        .directive('tree', function () {
        return {
            scope: { data: '=' },
            template: "<span ng-style=\"{'background-color': data.depth % 2 ? '' : 'grey'}\"> {{data.value}} </span><tree-if data='data.right'></tree-if><tree-if data='data.left'></tree-if>"
        };
    })
        // special directive for "if" as angular 1.3 does not support
        // recursive components.
        // Cloned from real ngIf directive, but using a lazily created transclude function.
        .directive('treeIf', [
        '$compile', '$animate',
        function ($compile, $animate) {
            var transcludeFn;
            return {
                transclude: 'element',
                priority: 600,
                terminal: true,
                $$tlb: true,
                link: function ($scope, $element, $attr, ctrl) {
                    if (!transcludeFn) {
                        var template = '<tree data="' + $attr.data + '"></tree>';
                        transcludeFn = $compile(template);
                    }
                    var childElement, childScope;
                    $scope.$watch($attr.data, function ngIfWatchAction(value) {
                        if (value) {
                            if (!childScope) {
                                childScope = $scope.$new();
                                transcludeFn(childScope, function (clone) {
                                    childElement = clone;
                                    $animate.enter(clone, $element.parent(), $element);
                                });
                            }
                        }
                        else {
                            if (childScope) {
                                childScope.$destroy();
                                childScope = null;
                            }
                            if (childElement) {
                                $animate.leave(childElement);
                                childElement = null;
                            }
                        }
                    });
                }
            };
        }
    ])
        .config([
        '$compileProvider',
        function ($compileProvider) { $compileProvider.debugInfoEnabled(false); }
    ]);
}
exports.addTreeToModule = addTreeToModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvYmVuY2htYXJrcy9zcmMvdHJlZS9uZzEvdHJlZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVdBLHlCQUFnQyxHQUFRO0lBQ3RDLE9BQU8sR0FBRztTQUNMLFNBQVMsQ0FDTixNQUFNLEVBQ047UUFDRSxPQUFPO1lBQ0wsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQztZQUNsQixRQUFRLEVBQ0osd0tBQXNLO1NBQzNLLENBQUM7SUFDSixDQUFDLENBQUM7UUFDTiw2REFBNkQ7UUFDN0Qsd0JBQXdCO1FBQ3hCLG1GQUFtRjtTQUNsRixTQUFTLENBQ04sUUFBUSxFQUNSO1FBQ0UsVUFBVSxFQUFFLFVBQVU7UUFDdEIsVUFBUyxRQUFhLEVBQUUsUUFBYTtZQUNuQyxJQUFJLFlBQWlCLENBQUM7WUFDdEIsT0FBTztnQkFDTCxVQUFVLEVBQUUsU0FBUztnQkFDckIsUUFBUSxFQUFFLEdBQUc7Z0JBQ2IsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsS0FBSyxFQUFFLElBQUk7Z0JBQ1gsSUFBSSxFQUFFLFVBQVMsTUFBVyxFQUFFLFFBQWEsRUFBRSxLQUFVLEVBQUUsSUFBUztvQkFDOUQsSUFBSSxDQUFDLFlBQVksRUFBRTt3QkFDakIsSUFBTSxRQUFRLEdBQUcsY0FBYyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDO3dCQUMzRCxZQUFZLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO3FCQUNuQztvQkFDRCxJQUFJLFlBQWlCLEVBQUUsVUFBZSxDQUFDO29CQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUseUJBQXlCLEtBQVU7d0JBRTNELElBQUksS0FBSyxFQUFFOzRCQUNULElBQUksQ0FBQyxVQUFVLEVBQUU7Z0NBQ2YsVUFBVSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQ0FDM0IsWUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFTLEtBQVU7b0NBQzFDLFlBQVksR0FBRyxLQUFLLENBQUM7b0NBQ3JCLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztnQ0FDckQsQ0FBQyxDQUFDLENBQUM7NkJBQ0o7eUJBQ0Y7NkJBQU07NEJBQ0wsSUFBSSxVQUFVLEVBQUU7Z0NBQ2QsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dDQUN0QixVQUFVLEdBQUcsSUFBSSxDQUFDOzZCQUNuQjs0QkFDRCxJQUFJLFlBQVksRUFBRTtnQ0FDaEIsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztnQ0FDN0IsWUFBWSxHQUFHLElBQUksQ0FBQzs2QkFDckI7eUJBQ0Y7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQzthQUNGLENBQUM7UUFDSixDQUFDO0tBQ0YsQ0FBQztTQUNMLE1BQU0sQ0FBQztRQUNOLGtCQUFrQjtRQUNsQixVQUFTLGdCQUFxQixJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5RSxDQUFDLENBQUM7QUFDVCxDQUFDO0FBNURELDBDQTREQyJ9