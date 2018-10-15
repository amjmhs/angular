"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var url_tree_1 = require("./url_tree");
var collection_1 = require("./utils/collection");
function createUrlTree(route, urlTree, commands, queryParams, fragment) {
    if (commands.length === 0) {
        return tree(urlTree.root, urlTree.root, urlTree, queryParams, fragment);
    }
    var nav = computeNavigation(commands);
    if (nav.toRoot()) {
        return tree(urlTree.root, new url_tree_1.UrlSegmentGroup([], {}), urlTree, queryParams, fragment);
    }
    var startingPosition = findStartingPosition(nav, urlTree, route);
    var segmentGroup = startingPosition.processChildren ?
        updateSegmentGroupChildren(startingPosition.segmentGroup, startingPosition.index, nav.commands) :
        updateSegmentGroup(startingPosition.segmentGroup, startingPosition.index, nav.commands);
    return tree(startingPosition.segmentGroup, segmentGroup, urlTree, queryParams, fragment);
}
exports.createUrlTree = createUrlTree;
function isMatrixParams(command) {
    return typeof command === 'object' && command != null && !command.outlets && !command.segmentPath;
}
function tree(oldSegmentGroup, newSegmentGroup, urlTree, queryParams, fragment) {
    var qp = {};
    if (queryParams) {
        collection_1.forEach(queryParams, function (value, name) {
            qp[name] = Array.isArray(value) ? value.map(function (v) { return "" + v; }) : "" + value;
        });
    }
    if (urlTree.root === oldSegmentGroup) {
        return new url_tree_1.UrlTree(newSegmentGroup, qp, fragment);
    }
    return new url_tree_1.UrlTree(replaceSegment(urlTree.root, oldSegmentGroup, newSegmentGroup), qp, fragment);
}
function replaceSegment(current, oldSegment, newSegment) {
    var children = {};
    collection_1.forEach(current.children, function (c, outletName) {
        if (c === oldSegment) {
            children[outletName] = newSegment;
        }
        else {
            children[outletName] = replaceSegment(c, oldSegment, newSegment);
        }
    });
    return new url_tree_1.UrlSegmentGroup(current.segments, children);
}
var Navigation = /** @class */ (function () {
    function Navigation(isAbsolute, numberOfDoubleDots, commands) {
        this.isAbsolute = isAbsolute;
        this.numberOfDoubleDots = numberOfDoubleDots;
        this.commands = commands;
        if (isAbsolute && commands.length > 0 && isMatrixParams(commands[0])) {
            throw new Error('Root segment cannot have matrix parameters');
        }
        var cmdWithOutlet = commands.find(function (c) { return typeof c === 'object' && c != null && c.outlets; });
        if (cmdWithOutlet && cmdWithOutlet !== collection_1.last(commands)) {
            throw new Error('{outlets:{}} has to be the last command');
        }
    }
    Navigation.prototype.toRoot = function () {
        return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
    };
    return Navigation;
}());
/** Transforms commands to a normalized `Navigation` */
function computeNavigation(commands) {
    if ((typeof commands[0] === 'string') && commands.length === 1 && commands[0] === '/') {
        return new Navigation(true, 0, commands);
    }
    var numberOfDoubleDots = 0;
    var isAbsolute = false;
    var res = commands.reduce(function (res, cmd, cmdIdx) {
        if (typeof cmd === 'object' && cmd != null) {
            if (cmd.outlets) {
                var outlets_1 = {};
                collection_1.forEach(cmd.outlets, function (commands, name) {
                    outlets_1[name] = typeof commands === 'string' ? commands.split('/') : commands;
                });
                return res.concat([{ outlets: outlets_1 }]);
            }
            if (cmd.segmentPath) {
                return res.concat([cmd.segmentPath]);
            }
        }
        if (!(typeof cmd === 'string')) {
            return res.concat([cmd]);
        }
        if (cmdIdx === 0) {
            cmd.split('/').forEach(function (urlPart, partIndex) {
                if (partIndex == 0 && urlPart === '.') {
                    // skip './a'
                }
                else if (partIndex == 0 && urlPart === '') { //  '/a'
                    isAbsolute = true;
                }
                else if (urlPart === '..') { //  '../a'
                    numberOfDoubleDots++;
                }
                else if (urlPart != '') {
                    res.push(urlPart);
                }
            });
            return res;
        }
        return res.concat([cmd]);
    }, []);
    return new Navigation(isAbsolute, numberOfDoubleDots, res);
}
var Position = /** @class */ (function () {
    function Position(segmentGroup, processChildren, index) {
        this.segmentGroup = segmentGroup;
        this.processChildren = processChildren;
        this.index = index;
    }
    return Position;
}());
function findStartingPosition(nav, tree, route) {
    if (nav.isAbsolute) {
        return new Position(tree.root, true, 0);
    }
    if (route.snapshot._lastPathIndex === -1) {
        return new Position(route.snapshot._urlSegment, true, 0);
    }
    var modifier = isMatrixParams(nav.commands[0]) ? 0 : 1;
    var index = route.snapshot._lastPathIndex + modifier;
    return createPositionApplyingDoubleDots(route.snapshot._urlSegment, index, nav.numberOfDoubleDots);
}
function createPositionApplyingDoubleDots(group, index, numberOfDoubleDots) {
    var g = group;
    var ci = index;
    var dd = numberOfDoubleDots;
    while (dd > ci) {
        dd -= ci;
        g = g.parent;
        if (!g) {
            throw new Error('Invalid number of \'../\'');
        }
        ci = g.segments.length;
    }
    return new Position(g, false, ci - dd);
}
function getPath(command) {
    if (typeof command === 'object' && command != null && command.outlets) {
        return command.outlets[shared_1.PRIMARY_OUTLET];
    }
    return "" + command;
}
function getOutlets(commands) {
    var _a, _b;
    if (!(typeof commands[0] === 'object'))
        return _a = {}, _a[shared_1.PRIMARY_OUTLET] = commands, _a;
    if (commands[0].outlets === undefined)
        return _b = {}, _b[shared_1.PRIMARY_OUTLET] = commands, _b;
    return commands[0].outlets;
}
function updateSegmentGroup(segmentGroup, startIndex, commands) {
    if (!segmentGroup) {
        segmentGroup = new url_tree_1.UrlSegmentGroup([], {});
    }
    if (segmentGroup.segments.length === 0 && segmentGroup.hasChildren()) {
        return updateSegmentGroupChildren(segmentGroup, startIndex, commands);
    }
    var m = prefixedWith(segmentGroup, startIndex, commands);
    var slicedCommands = commands.slice(m.commandIndex);
    if (m.match && m.pathIndex < segmentGroup.segments.length) {
        var g = new url_tree_1.UrlSegmentGroup(segmentGroup.segments.slice(0, m.pathIndex), {});
        g.children[shared_1.PRIMARY_OUTLET] =
            new url_tree_1.UrlSegmentGroup(segmentGroup.segments.slice(m.pathIndex), segmentGroup.children);
        return updateSegmentGroupChildren(g, 0, slicedCommands);
    }
    else if (m.match && slicedCommands.length === 0) {
        return new url_tree_1.UrlSegmentGroup(segmentGroup.segments, {});
    }
    else if (m.match && !segmentGroup.hasChildren()) {
        return createNewSegmentGroup(segmentGroup, startIndex, commands);
    }
    else if (m.match) {
        return updateSegmentGroupChildren(segmentGroup, 0, slicedCommands);
    }
    else {
        return createNewSegmentGroup(segmentGroup, startIndex, commands);
    }
}
function updateSegmentGroupChildren(segmentGroup, startIndex, commands) {
    if (commands.length === 0) {
        return new url_tree_1.UrlSegmentGroup(segmentGroup.segments, {});
    }
    else {
        var outlets_2 = getOutlets(commands);
        var children_1 = {};
        collection_1.forEach(outlets_2, function (commands, outlet) {
            if (commands !== null) {
                children_1[outlet] = updateSegmentGroup(segmentGroup.children[outlet], startIndex, commands);
            }
        });
        collection_1.forEach(segmentGroup.children, function (child, childOutlet) {
            if (outlets_2[childOutlet] === undefined) {
                children_1[childOutlet] = child;
            }
        });
        return new url_tree_1.UrlSegmentGroup(segmentGroup.segments, children_1);
    }
}
function prefixedWith(segmentGroup, startIndex, commands) {
    var currentCommandIndex = 0;
    var currentPathIndex = startIndex;
    var noMatch = { match: false, pathIndex: 0, commandIndex: 0 };
    while (currentPathIndex < segmentGroup.segments.length) {
        if (currentCommandIndex >= commands.length)
            return noMatch;
        var path = segmentGroup.segments[currentPathIndex];
        var curr = getPath(commands[currentCommandIndex]);
        var next = currentCommandIndex < commands.length - 1 ? commands[currentCommandIndex + 1] : null;
        if (currentPathIndex > 0 && curr === undefined)
            break;
        if (curr && next && (typeof next === 'object') && next.outlets === undefined) {
            if (!compare(curr, next, path))
                return noMatch;
            currentCommandIndex += 2;
        }
        else {
            if (!compare(curr, {}, path))
                return noMatch;
            currentCommandIndex++;
        }
        currentPathIndex++;
    }
    return { match: true, pathIndex: currentPathIndex, commandIndex: currentCommandIndex };
}
function createNewSegmentGroup(segmentGroup, startIndex, commands) {
    var paths = segmentGroup.segments.slice(0, startIndex);
    var i = 0;
    while (i < commands.length) {
        if (typeof commands[i] === 'object' && commands[i].outlets !== undefined) {
            var children = createNewSegmentChildren(commands[i].outlets);
            return new url_tree_1.UrlSegmentGroup(paths, children);
        }
        // if we start with an object literal, we need to reuse the path part from the segment
        if (i === 0 && isMatrixParams(commands[0])) {
            var p = segmentGroup.segments[startIndex];
            paths.push(new url_tree_1.UrlSegment(p.path, commands[0]));
            i++;
            continue;
        }
        var curr = getPath(commands[i]);
        var next = (i < commands.length - 1) ? commands[i + 1] : null;
        if (curr && next && isMatrixParams(next)) {
            paths.push(new url_tree_1.UrlSegment(curr, stringify(next)));
            i += 2;
        }
        else {
            paths.push(new url_tree_1.UrlSegment(curr, {}));
            i++;
        }
    }
    return new url_tree_1.UrlSegmentGroup(paths, {});
}
function createNewSegmentChildren(outlets) {
    var children = {};
    collection_1.forEach(outlets, function (commands, outlet) {
        if (commands !== null) {
            children[outlet] = createNewSegmentGroup(new url_tree_1.UrlSegmentGroup([], {}), 0, commands);
        }
    });
    return children;
}
function stringify(params) {
    var res = {};
    collection_1.forEach(params, function (v, k) { return res[k] = "" + v; });
    return res;
}
function compare(path, params, segment) {
    return path == segment.path && collection_1.shallowEqual(params, segment.parameters);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3JlYXRlX3VybF90cmVlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvcm91dGVyL3NyYy9jcmVhdGVfdXJsX3RyZWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFHSCxtQ0FBZ0Q7QUFDaEQsdUNBQWdFO0FBQ2hFLGlEQUErRDtBQUUvRCx1QkFDSSxLQUFxQixFQUFFLE9BQWdCLEVBQUUsUUFBZSxFQUFFLFdBQW1CLEVBQzdFLFFBQWdCO0lBQ2xCLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDekIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDekU7SUFFRCxJQUFNLEdBQUcsR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUV4QyxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtRQUNoQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLElBQUksMEJBQWUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUN4RjtJQUVELElBQU0sZ0JBQWdCLEdBQUcsb0JBQW9CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztJQUVuRSxJQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUNuRCwwQkFBMEIsQ0FDdEIsZ0JBQWdCLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMxRSxrQkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxRQUFR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