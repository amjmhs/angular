"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ANNOTATIONS = '__annotations__';
exports.PARAMETERS = '__parameters__';
exports.PROP_METADATA = '__prop__metadata__';
/**
 * @suppress {globalThis}
 */
function makeDecorator(name, props, parentClass, chainFn, typeFn) {
    var metaCtor = makeMetadataCtor(props);
    function DecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        if (this instanceof DecoratorFactory) {
            metaCtor.call.apply(metaCtor, [this].concat(args));
            return this;
        }
        var annotationInstance = new ((_a = DecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
        var TypeDecorator = function TypeDecorator(cls) {
            typeFn && typeFn.apply(void 0, [cls].concat(args));
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var annotations = cls.hasOwnProperty(exports.ANNOTATIONS) ?
                cls[exports.ANNOTATIONS] :
                Object.defineProperty(cls, exports.ANNOTATIONS, { value: [] })[exports.ANNOTATIONS];
            annotations.push(annotationInstance);
            return cls;
        };
        if (chainFn)
            chainFn(TypeDecorator);
        return TypeDecorator;
    }
    if (parentClass) {
        DecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    DecoratorFactory.prototype.ngMetadataName = name;
    DecoratorFactory.annotationCls = DecoratorFactory;
    return DecoratorFactory;
}
exports.makeDecorator = makeDecorator;
function makeMetadataCtor(props) {
    return function ctor() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (props) {
            var values = props.apply(void 0, args);
            for (var propName in values) {
                this[propName] = values[propName];
            }
        }
    };
}
function makeParamDecorator(name, props, parentClass) {
    var metaCtor = makeMetadataCtor(props);
    function ParamDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        if (this instanceof ParamDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        var annotationInstance = new ((_a = ParamDecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
        ParamDecorator.annotation = annotationInstance;
        return ParamDecorator;
        function ParamDecorator(cls, unusedKey, index) {
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var parameters = cls.hasOwnProperty(exports.PARAMETERS) ?
                cls[exports.PARAMETERS] :
                Object.defineProperty(cls, exports.PARAMETERS, { value: [] })[exports.PARAMETERS];
            // there might be gaps if some in between parameters do not have annotations.
            // we pad with nulls.
            while (parameters.length <= index) {
                parameters.push(null);
            }
            (parameters[index] = parameters[index] || []).push(annotationInstance);
            return cls;
        }
    }
    if (parentClass) {
        ParamDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    ParamDecoratorFactory.prototype.ngMetadataName = name;
    ParamDecoratorFactory.annotationCls = ParamDecoratorFactory;
    return ParamDecoratorFactory;
}
exports.makeParamDecorator = makeParamDecorator;
function makePropDecorator(name, props, parentClass) {
    var metaCtor = makeMetadataCtor(props);
    function PropDecoratorFactory() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _a;
        if (this instanceof PropDecoratorFactory) {
            metaCtor.apply(this, args);
            return this;
        }
        var decoratorInstance = new ((_a = PropDecoratorFactory).bind.apply(_a, [void 0].concat(args)))();
        return function PropDecorator(target, name) {
            var constructor = target.constructor;
            // Use of Object.defineProperty is important since it creates non-enumerable property which
            // prevents the property is copied during subclassing.
            var meta = constructor.hasOwnProperty(exports.PROP_METADATA) ?
                constructor[exports.PROP_METADATA] :
                Object.defineProperty(constructor, exports.PROP_METADATA, { value: {} })[exports.PROP_METADATA];
            meta[name] = meta.hasOwnProperty(name) && meta[name] || [];
            meta[name].unshift(decoratorInstance);
        };
    }
    if (parentClass) {
        PropDecoratorFactory.prototype = Object.create(parentClass.prototype);
    }
    PropDecoratorFactory.prototype.ngMetadataName = name;
    PropDecoratorFactory.annotationCls = PropDecoratorFactory;
    return PropDecoratorFactory;
}
exports.makePropDecorator = makePropDecorator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9ycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3V0aWwvZGVjb3JhdG9ycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQThCVSxRQUFBLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztBQUNoQyxRQUFBLFVBQVUsR0FBRyxnQkFBZ0IsQ0FBQztBQUM5QixRQUFBLGFBQWEsR0FBRyxvQkFBb0IsQ0FBQztBQUVsRDs7R0FFRztBQUNILHVCQUNJLElBQVksRUFBRSxLQUErQixFQUFFLFdBQWlCLEVBQ2hFLE9BQWdDLEVBQUUsTUFBa0Q7SUFFdEYsSUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFekM7UUFBMEIsY0FBYzthQUFkLFVBQWMsRUFBZCxxQkFBYyxFQUFkLElBQWM7WUFBZCx5QkFBYzs7O1FBQ3RDLElBQUksSUFBSSxZQUFZLGdCQUFnQixFQUFFO1lBQ3BDLFFBQVEsQ0FBQyxJQUFJLE9BQWIsUUFBUSxHQUFNLElBQUksU0FBSyxJQUFJLEdBQUU7WUFDN0IsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQU0sa0JBQWtCLFFBQU8sQ0FBQSxLQUFNLGdCQUFpQixDQUFBLGdDQUFJLElBQUksS0FBQyxDQUFDO1FBQ2hFLElBQU0sYUFBYSxHQUFpQyx1QkFBdUIsR0FBYztZQUN2RixNQUFNLElBQUksTUFBTSxnQkFBQyxHQUFHLFNBQUssSUFBSSxFQUFDLENBQUM7WUFDL0IsMkZBQTJGO1lBQzNGLHNEQUFzRDtZQUN0RCxJQUFNLFdBQVcsR0FBRyxHQUFHLENBQUMsY0FBYyxDQUFDLG1CQUFXLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxHQUFXLENBQUMsbUJBQVcsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLG1CQUFXLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFB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