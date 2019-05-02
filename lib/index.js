"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("fp-ts/lib/Either");
var map = Either_1.either.map;
var chain = Either_1.either.chain;
function fold(ma, onLeft, onRight) {
    var e = ma;
    return e._tag === 'Left'
        ? onLeft(e.hasOwnProperty('left')
            ? /* istanbul ignore next */
                e.left
            : /* istanbul ignore next */
                e.value)
        : onRight(e.hasOwnProperty('right')
            ? /* istanbul ignore next */
                e.right
            : /* istanbul ignore next */
                e.value);
}
exports.fold = fold;
/**
 * @since 1.0.0
 */
var Type = /** @class */ (function () {
    function Type(
    /** a unique name for this codec */
    name, 
    /** a custom type guard */
    is, 
    /** succeeds if a value of type I can be decoded to a value of type A */
    validate, 
    /** converts a value of type A to a value of type O */
    encode) {
        this.name = name;
        this.is = is;
        this.validate = validate;
        this.encode = encode;
        this.decode = this.decode.bind(this);
    }
    Type.prototype.pipe = function (ab, name) {
        var _this = this;
        if (name === void 0) { name = "pipe(" + this.name + ", " + ab.name + ")"; }
        return new Type(name, ab.is, function (i, c) { return chain(_this.validate(i, c), function (a) { return ab.validate(a, c); }); }, this.encode === exports.identity && ab.encode === exports.identity ? exports.identity : function (b) { return _this.encode(ab.encode(b)); });
    };
    Type.prototype.asDecoder = function () {
        return this;
    };
    Type.prototype.asEncoder = function () {
        return this;
    };
    /** a version of `validate` with a default context */
    Type.prototype.decode = function (i) {
        return this.validate(i, [{ key: '', type: this, actual: i }]);
    };
    return Type;
}());
exports.Type = Type;
/**
 * @since 1.0.0
 */
exports.identity = function (a) { return a; };
/**
 * @since 1.0.0
 */
exports.getFunctionName = function (f) {
    return f.displayName || f.name || "<function" + f.length + ">";
};
/**
 * @since 1.0.0
 */
exports.getContextEntry = function (key, decoder) { return ({ key: key, type: decoder }); };
/**
 * @since 1.0.0
 */
exports.appendContext = function (c, key, decoder, actual) {
    var len = c.length;
    var r = Array(len + 1);
    for (var i = 0; i < len; i++) {
        r[i] = c[i];
    }
    r[len] = { key: key, type: decoder, actual: actual };
    return r;
};
/**
 * @since 1.0.0
 */
exports.failures = function (errors) { return Either_1.left(errors); };
/**
 * @since 1.0.0
 */
exports.failure = function (value, context, message) {
    return exports.failures([{ value: value, context: context, message: message }]);
};
/**
 * @since 1.0.0
 */
exports.success = function (value) { return Either_1.right(value); };
var pushAll = function (xs, ys) {
    var l = ys.length;
    for (var i = 0; i < l; i++) {
        xs.push(ys[i]);
    }
};
var getIsCodec = function (tag) { return function (codec) { return codec._tag === tag; }; };
var isUnknownCodec = getIsCodec('UnknownType');
var isAnyCodec = getIsCodec('AnyType');
var isLiteralCodec = getIsCodec('LiteralType');
var isInterfaceCodec = getIsCodec('InterfaceType');
var isPartialCodec = getIsCodec('PartialType');
var isStrictCodec = getIsCodec('StrictType');
var isIntersectionCodec = getIsCodec('IntersectionType');
var isUnionCodec = getIsCodec('UnionType');
var isExactCodec = getIsCodec('ExactType');
var isRefinementCodec = getIsCodec('RefinementType');
var isRecursiveCodec = getIsCodec('RecursiveType');
//
// basic types
//
/**
 * @since 1.0.0
 */
var NullType = /** @class */ (function (_super) {
    __extends(NullType, _super);
    function NullType() {
        var _this = _super.call(this, 'null', function (u) { return u === null; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'NullType';
        return _this;
    }
    return NullType;
}(Type));
exports.NullType = NullType;
/**
 * @alias `null`
 * @since 1.0.0
 */
exports.nullType = new NullType();
exports.null = exports.nullType;
/**
 * @since 1.0.0
 */
var UndefinedType = /** @class */ (function (_super) {
    __extends(UndefinedType, _super);
    function UndefinedType() {
        var _this = _super.call(this, 'undefined', function (u) { return u === void 0; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'UndefinedType';
        return _this;
    }
    return UndefinedType;
}(Type));
exports.UndefinedType = UndefinedType;
var undefinedType = new UndefinedType();
exports.undefined = undefinedType;
/**
 * @since 1.2.0
 */
var VoidType = /** @class */ (function (_super) {
    __extends(VoidType, _super);
    function VoidType() {
        var _this = _super.call(this, 'void', undefinedType.is, undefinedType.validate, exports.identity) || this;
        _this._tag = 'VoidType';
        return _this;
    }
    return VoidType;
}(Type));
exports.VoidType = VoidType;
/**
 * @alias `void`
 * @since 1.2.0
 */
exports.voidType = new VoidType();
exports.void = exports.voidType;
/**
 * @since 1.5.0
 */
var UnknownType = /** @class */ (function (_super) {
    __extends(UnknownType, _super);
    function UnknownType() {
        var _this = _super.call(this, 'unknown', function (_) { return true; }, exports.success, exports.identity) || this;
        _this._tag = 'UnknownType';
        return _this;
    }
    return UnknownType;
}(Type));
exports.UnknownType = UnknownType;
/**
 * @since 1.5.0
 */
exports.unknown = new UnknownType();
/**
 * @since 1.0.0
 */
var StringType = /** @class */ (function (_super) {
    __extends(StringType, _super);
    function StringType() {
        var _this = _super.call(this, 'string', function (u) { return typeof u === 'string'; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'StringType';
        return _this;
    }
    return StringType;
}(Type));
exports.StringType = StringType;
/**
 * @since 1.0.0
 */
exports.string = new StringType();
/**
 * @since 1.0.0
 */
var NumberType = /** @class */ (function (_super) {
    __extends(NumberType, _super);
    function NumberType() {
        var _this = _super.call(this, 'number', function (u) { return typeof u === 'number'; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'NumberType';
        return _this;
    }
    return NumberType;
}(Type));
exports.NumberType = NumberType;
/**
 * @since 1.0.0
 */
exports.number = new NumberType();
/**
 * @since 1.0.0
 */
var BooleanType = /** @class */ (function (_super) {
    __extends(BooleanType, _super);
    function BooleanType() {
        var _this = _super.call(this, 'boolean', function (u) { return typeof u === 'boolean'; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'BooleanType';
        return _this;
    }
    return BooleanType;
}(Type));
exports.BooleanType = BooleanType;
/**
 * @since 1.0.0
 */
exports.boolean = new BooleanType();
/**
 * @since 1.0.0
 */
var AnyArrayType = /** @class */ (function (_super) {
    __extends(AnyArrayType, _super);
    function AnyArrayType() {
        var _this = _super.call(this, 'UnknownArray', Array.isArray, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'AnyArrayType';
        return _this;
    }
    return AnyArrayType;
}(Type));
exports.AnyArrayType = AnyArrayType;
/**
 * @since 1.7.1
 */
exports.UnknownArray = new AnyArrayType();
exports.Array = exports.UnknownArray;
/**
 * @since 1.0.0
 */
var AnyDictionaryType = /** @class */ (function (_super) {
    __extends(AnyDictionaryType, _super);
    function AnyDictionaryType() {
        var _this = _super.call(this, 'UnknownRecord', function (u) { return u !== null && typeof u === 'object'; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'AnyDictionaryType';
        return _this;
    }
    return AnyDictionaryType;
}(Type));
exports.AnyDictionaryType = AnyDictionaryType;
/**
 * @since 1.7.1
 */
exports.UnknownRecord = new AnyDictionaryType();
/**
 * @since 1.0.0
 * @deprecated
 */
var FunctionType = /** @class */ (function (_super) {
    __extends(FunctionType, _super);
    function FunctionType() {
        var _this = _super.call(this, 'Function', 
        // tslint:disable-next-line:strict-type-predicates
        function (u) { return typeof u === 'function'; }, function (u, c) { return (_this.is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity) || this;
        _this._tag = 'FunctionType';
        return _this;
    }
    return FunctionType;
}(Type));
exports.FunctionType = FunctionType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.Function = new FunctionType();
/**
 * @since 1.0.0
 */
var RefinementType = /** @class */ (function (_super) {
    __extends(RefinementType, _super);
    function RefinementType(name, is, validate, encode, type, predicate) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this.predicate = predicate;
        _this._tag = 'RefinementType';
        return _this;
    }
    return RefinementType;
}(Type));
exports.RefinementType = RefinementType;
/**
 * @since 1.8.1
 */
exports.brand = function (codec, predicate, name) {
    return refinement(codec, predicate, name);
};
/**
 * A branded codec representing an integer
 * @since 1.8.1
 */
exports.Int = exports.brand(exports.number, function (n) { return Number.isInteger(n); }, 'Int');
/**
 * @since 1.0.0
 */
var LiteralType = /** @class */ (function (_super) {
    __extends(LiteralType, _super);
    function LiteralType(name, is, validate, encode, value) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.value = value;
        _this._tag = 'LiteralType';
        return _this;
    }
    return LiteralType;
}(Type));
exports.LiteralType = LiteralType;
/**
 * @since 1.0.0
 */
exports.literal = function (value, name) {
    if (name === void 0) { name = JSON.stringify(value); }
    var is = function (u) { return u === value; };
    return new LiteralType(name, is, function (u, c) { return (is(u) ? exports.success(value) : exports.failure(u, c)); }, exports.identity, value);
};
/**
 * @since 1.0.0
 */
var KeyofType = /** @class */ (function (_super) {
    __extends(KeyofType, _super);
    function KeyofType(name, is, validate, encode, keys) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.keys = keys;
        _this._tag = 'KeyofType';
        return _this;
    }
    return KeyofType;
}(Type));
exports.KeyofType = KeyofType;
var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * @since 1.0.0
 */
exports.keyof = function (keys, name) {
    if (name === void 0) { name = Object.keys(keys)
        .map(function (k) { return JSON.stringify(k); })
        .join(' | '); }
    var is = function (u) { return exports.string.is(u) && hasOwnProperty.call(keys, u); };
    return new KeyofType(name, is, function (u, c) { return (is(u) ? exports.success(u) : exports.failure(u, c)); }, exports.identity, keys);
};
/**
 * @since 1.0.0
 */
var RecursiveType = /** @class */ (function (_super) {
    __extends(RecursiveType, _super);
    function RecursiveType(name, is, validate, encode, runDefinition) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.runDefinition = runDefinition;
        _this._tag = 'RecursiveType';
        return _this;
    }
    Object.defineProperty(RecursiveType.prototype, "type", {
        get: function () {
            return this.runDefinition();
        },
        enumerable: true,
        configurable: true
    });
    return RecursiveType;
}(Type));
exports.RecursiveType = RecursiveType;
/**
 * @since 1.0.0
 */
exports.recursion = function (name, definition) {
    var cache;
    var runDefinition = function () {
        if (!cache) {
            cache = definition(Self);
            cache.name = name;
        }
        return cache;
    };
    var Self = new RecursiveType(name, function (u) { return runDefinition().is(u); }, function (u, c) { return runDefinition().validate(u, c); }, function (a) { return runDefinition().encode(a); }, runDefinition);
    var indexRecordCache;
    Self.getIndexRecord = function () {
        if (!indexRecordCache) {
            isRecursiveCodecIndexable = false;
            indexRecordCache = getCodecIndexRecord(definition(Self), Self, Self);
            isRecursiveCodecIndexable = true;
        }
        return indexRecordCache;
    };
    return Self;
};
/**
 * @since 1.0.0
 */
var ArrayType = /** @class */ (function (_super) {
    __extends(ArrayType, _super);
    function ArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ArrayType';
        return _this;
    }
    return ArrayType;
}(Type));
exports.ArrayType = ArrayType;
/**
 * @since 1.0.0
 */
exports.array = function (codec, name) {
    if (name === void 0) { name = "Array<" + codec.name + ">"; }
    return new ArrayType(name, function (u) { return exports.UnknownArray.is(u) && u.every(codec.is); }, function (u, c) {
        return chain(exports.UnknownArray.validate(u, c), function (us) {
            var len = us.length;
            var as = us;
            var errors = [];
            var _loop_1 = function (i) {
                var ui = us[i];
                fold(codec.validate(ui, exports.appendContext(c, String(i), codec, ui)), function (e) { return pushAll(errors, e); }, function (ai) {
                    if (ai !== ui) {
                        if (as === us) {
                            as = us.slice();
                        }
                        as[i] = ai;
                    }
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_1(i);
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success(as);
        });
    }, codec.encode === exports.identity ? exports.identity : function (a) { return a.map(codec.encode); }, codec);
};
/**
 * @since 1.0.0
 */
var InterfaceType = /** @class */ (function (_super) {
    __extends(InterfaceType, _super);
    function InterfaceType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'InterfaceType';
        return _this;
    }
    return InterfaceType;
}(Type));
exports.InterfaceType = InterfaceType;
var getNameFromProps = function (props) {
    return Object.keys(props)
        .map(function (k) { return k + ": " + props[k].name; })
        .join(', ');
};
var useIdentity = function (codecs, len) {
    for (var i = 0; i < len; i++) {
        if (codecs[i].encode !== exports.identity) {
            return false;
        }
    }
    return true;
};
var getInterfaceTypeName = function (props) {
    return "{ " + getNameFromProps(props) + " }";
};
/**
 * @alias `interface`
 * @since 1.0.0
 */
exports.type = function (props, name) {
    if (name === void 0) { name = getInterfaceTypeName(props); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new InterfaceType(name, function (u) {
        if (!exports.UnknownRecord.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            if (!hasOwnProperty.call(u, k) || !types[i].is(u[k])) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        return chain(exports.UnknownRecord.validate(u, c), function (o) {
            var a = o;
            var errors = [];
            var _loop_2 = function (i) {
                var k = keys[i];
                if (!hasOwnProperty.call(a, k)) {
                    if (a === o) {
                        a = __assign({}, o);
                    }
                    a[k] = a[k];
                }
                var ak = a[k];
                var type_1 = types[i];
                fold(type_1.validate(ak, exports.appendContext(c, k, type_1, ak)), function (e) { return pushAll(errors, e); }, function (vak) {
                    if (vak !== ak) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vak;
                    }
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_2(i);
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success(a);
        });
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var encode = types[i].encode;
                if (encode !== exports.identity) {
                    s[k] = encode(a[k]);
                }
            }
            return s;
        }, props);
};
exports.interface = exports.type;
/**
 * @since 1.0.0
 */
var PartialType = /** @class */ (function (_super) {
    __extends(PartialType, _super);
    function PartialType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'PartialType';
        return _this;
    }
    return PartialType;
}(Type));
exports.PartialType = PartialType;
var getPartialTypeName = function (inner) {
    return "Partial<" + inner + ">";
};
/**
 * @since 1.0.0
 */
exports.partial = function (props, name) {
    if (name === void 0) { name = getPartialTypeName(getInterfaceTypeName(props)); }
    var keys = Object.keys(props);
    var types = keys.map(function (key) { return props[key]; });
    var len = keys.length;
    return new PartialType(name, function (u) {
        if (!exports.UnknownRecord.is(u)) {
            return false;
        }
        for (var i = 0; i < len; i++) {
            var k = keys[i];
            var uk = u[k];
            if (uk !== undefined && !props[k].is(uk)) {
                return false;
            }
        }
        return true;
    }, function (u, c) {
        return chain(exports.UnknownRecord.validate(u, c), function (o) {
            var a = o;
            var errors = [];
            var _loop_3 = function (i) {
                var k = keys[i];
                var ak = a[k];
                var type_2 = props[k];
                fold(type_2.validate(ak, exports.appendContext(c, k, type_2, ak)), function (e) {
                    if (ak !== undefined) {
                        pushAll(errors, e);
                    }
                }, function (vak) {
                    if (vak !== ak) {
                        /* istanbul ignore next */
                        if (a === o) {
                            a = __assign({}, o);
                        }
                        a[k] = vak;
                    }
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_3(i);
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success(a);
        });
    }, useIdentity(types, len)
        ? exports.identity
        : function (a) {
            var s = __assign({}, a);
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                var ak = a[k];
                if (ak !== undefined) {
                    s[k] = types[i].encode(ak);
                }
            }
            return s;
        }, props);
};
/**
 * @since 1.0.0
 */
var DictionaryType = /** @class */ (function (_super) {
    __extends(DictionaryType, _super);
    function DictionaryType(name, is, validate, encode, domain, codomain) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.domain = domain;
        _this.codomain = codomain;
        _this._tag = 'DictionaryType';
        return _this;
    }
    return DictionaryType;
}(Type));
exports.DictionaryType = DictionaryType;
var isObject = function (r) { return Object.prototype.toString.call(r) === '[object Object]'; };
/**
 * @since 1.7.1
 */
exports.record = function (domain, codomain, name) {
    if (name === void 0) { name = "{ [K in " + domain.name + "]: " + codomain.name + " }"; }
    return new DictionaryType(name, function (u) {
        if (!exports.UnknownRecord.is(u)) {
            return false;
        }
        if (!isUnknownCodec(codomain) && !isAnyCodec(codomain) && !isObject(u)) {
            return false;
        }
        return Object.keys(u).every(function (k) { return domain.is(k) && codomain.is(u[k]); });
    }, function (u, c) {
        return chain(exports.UnknownRecord.validate(u, c), function (o) {
            if (!isUnknownCodec(codomain) && !isAnyCodec(codomain) && !isObject(o)) {
                return exports.failure(u, c);
            }
            var a = {};
            var errors = [];
            var keys = Object.keys(o);
            var len = keys.length;
            var changed = false;
            var _loop_4 = function (i) {
                var k = keys[i];
                var ok = o[k];
                fold(domain.validate(k, exports.appendContext(c, k, domain, k)), function (e) { return pushAll(errors, e); }, function (vk) {
                    changed = changed || vk !== k;
                    k = vk;
                    fold(codomain.validate(ok, exports.appendContext(c, k, codomain, ok)), function (e) { return pushAll(errors, e); }, function (vok) {
                        changed = changed || vok !== ok;
                        a[k] = vok;
                    });
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_4(i);
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success((changed ? a : o));
        });
    }, domain.encode === exports.identity && codomain.encode === exports.identity
        ? exports.identity
        : function (a) {
            var s = {};
            var keys = Object.keys(a);
            var len = keys.length;
            for (var i = 0; i < len; i++) {
                var k = keys[i];
                s[String(domain.encode(k))] = codomain.encode(a[k]);
            }
            return s;
        }, domain, codomain);
};
/**
 * @since 1.0.0
 */
var UnionType = /** @class */ (function (_super) {
    __extends(UnionType, _super);
    function UnionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'UnionType';
        return _this;
    }
    return UnionType;
}(Type));
exports.UnionType = UnionType;
var getUnionName = function (codecs) {
    return '(' + codecs.map(function (type) { return type.name; }).join(' | ') + ')';
};
/**
 * @since 1.0.0
 */
exports.union = function (codecs, name) {
    if (name === void 0) { name = getUnionName(codecs); }
    var len = codecs.length;
    return new UnionType(name, function (u) { return codecs.some(function (type) { return type.is(u); }); }, function (u, c) {
        var errors = [];
        for (var i = 0; i < len; i++) {
            var type_3 = codecs[i];
            var r = fold(type_3.validate(u, exports.appendContext(c, String(i), type_3, u)), function (e) { return pushAll(errors, e); }, exports.success);
            if (r !== undefined) {
                return r;
            }
        }
        return errors.length > 0 ? exports.failures(errors) : exports.failure(u, c);
    }, useIdentity(codecs, len)
        ? exports.identity
        : function (a) {
            for (var i = 0; i < len; i++) {
                var codec = codecs[i];
                if (codec.is(a)) {
                    return codec.encode(a);
                }
            }
            // https://github.com/gcanti/io-ts/pull/305
            throw new Error("no codec found to encode value in union type " + name);
        }, codecs);
};
/**
 * @since 1.0.0
 */
var IntersectionType = /** @class */ (function (_super) {
    __extends(IntersectionType, _super);
    function IntersectionType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'IntersectionType';
        return _this;
    }
    return IntersectionType;
}(Type));
exports.IntersectionType = IntersectionType;
var mergeAll = function (base, us) {
    var r = base;
    for (var i = 0; i < us.length; i++) {
        var u = us[i];
        if (u !== base) {
            // `u` contains a prismatic value or is the result of a stripping combinator
            if (r === base) {
                r = Object.assign({}, u);
                continue;
            }
            for (var k in u) {
                if (u[k] !== base[k] || !r.hasOwnProperty(k)) {
                    r[k] = u[k];
                }
            }
        }
    }
    return r;
};
function intersection(codecs, name) {
    if (name === void 0) { name = "(" + codecs.map(function (type) { return type.name; }).join(' & ') + ")"; }
    var len = codecs.length;
    return new IntersectionType(name, function (u) { return codecs.every(function (type) { return type.is(u); }); }, codecs.length === 0
        ? exports.success
        : function (u, c) {
            var us = [];
            var errors = [];
            for (var i = 0; i < len; i++) {
                var codec = codecs[i];
                fold(codec.validate(u, exports.appendContext(c, String(i), codec, u)), function (e) { return pushAll(errors, e); }, function (a) { return us.push(a); });
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success(mergeAll(u, us));
        }, codecs.length === 0 ? exports.identity : function (a) { return mergeAll(a, codecs.map(function (codec) { return codec.encode(a); })); }, codecs);
}
exports.intersection = intersection;
/**
 * @since 1.0.0
 */
var TupleType = /** @class */ (function (_super) {
    __extends(TupleType, _super);
    function TupleType(name, is, validate, encode, types) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.types = types;
        _this._tag = 'TupleType';
        return _this;
    }
    return TupleType;
}(Type));
exports.TupleType = TupleType;
function tuple(codecs, name) {
    if (name === void 0) { name = "[" + codecs.map(function (type) { return type.name; }).join(', ') + "]"; }
    var len = codecs.length;
    return new TupleType(name, function (u) { return exports.UnknownArray.is(u) && u.length === len && codecs.every(function (type, i) { return type.is(u[i]); }); }, function (u, c) {
        return chain(exports.UnknownArray.validate(u, c), function (us) {
            var as = us.length > len ? us.slice(0, len) : us; // strip additional components
            var errors = [];
            var _loop_5 = function (i) {
                var a = us[i];
                var type_4 = codecs[i];
                fold(type_4.validate(a, exports.appendContext(c, String(i), type_4, a)), function (e) { return pushAll(errors, e); }, function (va) {
                    if (va !== a) {
                        /* istanbul ignore next */
                        if (as === us) {
                            as = us.slice();
                        }
                        as[i] = va;
                    }
                });
            };
            for (var i = 0; i < len; i++) {
                _loop_5(i);
            }
            return errors.length > 0 ? exports.failures(errors) : exports.success(as);
        });
    }, useIdentity(codecs, len) ? exports.identity : function (a) { return codecs.map(function (type, i) { return type.encode(a[i]); }); }, codecs);
}
exports.tuple = tuple;
/**
 * @since 1.0.0
 */
var ReadonlyType = /** @class */ (function (_super) {
    __extends(ReadonlyType, _super);
    function ReadonlyType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyType';
        return _this;
    }
    return ReadonlyType;
}(Type));
exports.ReadonlyType = ReadonlyType;
/**
 * @since 1.0.0
 */
exports.readonly = function (codec, name) {
    if (name === void 0) { name = "Readonly<" + codec.name + ">"; }
    return new ReadonlyType(name, codec.is, function (u, c) {
        return map(codec.validate(u, c), function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            return x;
        });
    }, codec.encode === exports.identity ? exports.identity : codec.encode, codec);
};
/**
 * @since 1.0.0
 */
var ReadonlyArrayType = /** @class */ (function (_super) {
    __extends(ReadonlyArrayType, _super);
    function ReadonlyArrayType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ReadonlyArrayType';
        return _this;
    }
    return ReadonlyArrayType;
}(Type));
exports.ReadonlyArrayType = ReadonlyArrayType;
/**
 * @since 1.0.0
 */
exports.readonlyArray = function (codec, name) {
    if (name === void 0) { name = "ReadonlyArray<" + codec.name + ">"; }
    var arrayType = exports.array(codec);
    return new ReadonlyArrayType(name, arrayType.is, function (u, c) {
        return map(arrayType.validate(u, c), function (x) {
            if (process.env.NODE_ENV !== 'production') {
                return Object.freeze(x);
            }
            return x;
        });
    }, arrayType.encode, codec);
};
/**
 * Strips additional properties
 * @since 1.0.0
 */
exports.strict = function (props, name) {
    return exports.exact(exports.type(props), name);
};
/** @internal */
exports.emptyIndexRecord = {};
var monoidIndexRecord = {
    concat: function (a, b) {
        var _a;
        if (a === monoidIndexRecord.empty) {
            return b;
        }
        if (b === monoidIndexRecord.empty) {
            return a;
        }
        var r = cloneIndexRecord(a);
        for (var k in b) {
            if (r.hasOwnProperty(k)) {
                (_a = r[k]).push.apply(_a, b[k]);
            }
            else {
                r[k] = b[k];
            }
        }
        return r;
    },
    empty: exports.emptyIndexRecord
};
var isIndexRecordEmpty = function (a) {
    for (var _ in a) {
        return false;
    }
    return true;
};
var foldMapIndexRecord = function (as, f) {
    return as.reduce(function (acc, a) { return monoidIndexRecord.concat(acc, f(a)); }, monoidIndexRecord.empty);
};
var cloneIndexRecord = function (a) {
    var r = {};
    for (var k in a) {
        r[k] = a[k].slice();
    }
    return r;
};
var updateindexRecordOrigin = function (origin, indexRecord) {
    var r = {};
    for (var k in indexRecord) {
        r[k] = indexRecord[k].map(function (_a) {
            var v = _a[0], _ = _a[1], id = _a[2];
            return [v, origin, id];
        });
    }
    return r;
};
var getCodecIndexRecord = function (codec, origin, id) {
    if (isInterfaceCodec(codec) || isStrictCodec(codec)) {
        var interfaceIndex = {};
        for (var k in codec.props) {
            var prop = codec.props[k];
            if (isLiteralCodec(prop)) {
                var value = prop.value;
                interfaceIndex[k] = [[value, origin, id]];
            }
        }
        return interfaceIndex;
    }
    if (isIntersectionCodec(codec)) {
        return foldMapIndexRecord(codec.types, function (type) { return getCodecIndexRecord(type, origin, codec); });
    }
    if (isUnionCodec(codec)) {
        return foldMapIndexRecord(codec.types, function (type) { return getCodecIndexRecord(type, origin, type); });
    }
    if (isExactCodec(codec) || isRefinementCodec(codec)) {
        return getCodecIndexRecord(codec.type, origin, codec);
    }
    if (isRecursiveCodec(codec)) {
        var indexRecord = codec.getIndexRecord();
        if (codec !== origin) {
            return updateindexRecordOrigin(origin, indexRecord);
        }
        return indexRecord;
    }
    return monoidIndexRecord.empty;
};
var isRecursiveCodecIndexable = true;
var isIndexableCodec = function (codec) {
    return (((isInterfaceCodec(codec) || isStrictCodec(codec)) &&
        Object.keys(codec.props).some(function (key) { return isLiteralCodec(codec.props[key]); })) ||
        ((isExactCodec(codec) || isRefinementCodec(codec)) && isIndexableCodec(codec.type)) ||
        (isIntersectionCodec(codec) && codec.types.some(isIndexableCodec)) ||
        (isUnionCodec(codec) && codec.types.every(isIndexableCodec)) ||
        (isRecursiveCodecIndexable && isRecursiveCodec(codec)));
};
/**
 * @internal
 */
exports.getIndexRecord = function (codecs) {
    var len = codecs.length;
    if (len === 0 || !codecs.every(isIndexableCodec)) {
        return monoidIndexRecord.empty;
    }
    var firstCodec = codecs[0];
    var ir = cloneIndexRecord(getCodecIndexRecord(firstCodec, firstCodec, firstCodec));
    for (var i = 1; i < len; i++) {
        var codec = codecs[i];
        var cir = getCodecIndexRecord(codec, codec, codec);
        for (var k in ir) {
            if (cir.hasOwnProperty(k)) {
                var is = ir[k];
                var cis = cir[k];
                var _loop_6 = function (j) {
                    var indexItem = cis[j];
                    var index = is.findIndex(function (_a) {
                        var v = _a[0];
                        return v === indexItem[0];
                    });
                    if (index === -1) {
                        is.push(indexItem);
                    }
                    else if (indexItem[2] !== is[index][2]) {
                        delete ir[k];
                        return "break";
                    }
                };
                for (var j = 0; j < cis.length; j++) {
                    var state_1 = _loop_6(j);
                    if (state_1 === "break")
                        break;
                }
            }
            else {
                delete ir[k];
            }
        }
    }
    return isIndexRecordEmpty(ir) ? monoidIndexRecord.empty : ir;
};
var getTaggedUnion = function (index, tag, codecs, name) {
    var len = codecs.length;
    var indexWithPosition = index.map(function (_a) {
        var v = _a[0], origin = _a[1];
        return [
            v,
            codecs.findIndex(function (codec) { return codec === origin; })
        ];
    });
    var findIndex = function (tagValue) {
        for (var i = 0; i < indexWithPosition.length; i++) {
            var _a = indexWithPosition[i], value = _a[0], position = _a[1];
            if (value === tagValue) {
                return position;
            }
        }
    };
    var isTagValue = function (u) { return findIndex(u) !== undefined; };
    return new TaggedUnionType(name, function (u) {
        if (!exports.UnknownRecord.is(u)) {
            return false;
        }
        var tagValue = u[tag];
        var index = findIndex(tagValue);
        return index !== undefined ? codecs[index].is(u) : false;
    }, function (u, c) {
        return chain(exports.UnknownRecord.validate(u, c), function (d) {
            var tagValue = d[tag];
            if (!isTagValue(tagValue)) {
                return exports.failure(u, c);
            }
            var index = findIndex(tagValue);
            var codec = codecs[index];
            return codec.validate(d, exports.appendContext(c, String(index), codec, d));
        });
    }, useIdentity(codecs, len) ? exports.identity : function (a) { return codecs[findIndex(a[tag])].encode(a); }, codecs, tag);
};
/**
 * @since 1.3.0
 */
var TaggedUnionType = /** @class */ (function (_super) {
    __extends(TaggedUnionType, _super);
    function TaggedUnionType(name, is, validate, encode, codecs, tag) {
        var _this = _super.call(this, name, is, validate, encode, codecs) /* istanbul ignore next */ // <= workaround for https://github.com/Microsoft/TypeScript/issues/13455
         || this;
        _this.tag = tag;
        return _this;
    }
    return TaggedUnionType;
}(UnionType));
exports.TaggedUnionType = TaggedUnionType;
/**
 * @since 1.3.0
 */
exports.taggedUnion = function (tag, codecs, name) {
    if (name === void 0) { name = getUnionName(codecs); }
    var indexRecord = exports.getIndexRecord(codecs);
    if (!indexRecord.hasOwnProperty(tag)) {
        if (isRecursiveCodecIndexable && codecs.length > 0) {
            console.warn("[io-ts] Cannot build a tagged union for " + name + ", returning a de-optimized union");
        }
        var U = exports.union(codecs, name);
        return new TaggedUnionType(name, U.is, U.validate, U.encode, codecs, tag);
    }
    return getTaggedUnion(indexRecord[tag], tag, codecs, name);
};
/**
 * @since 1.1.0
 */
var ExactType = /** @class */ (function (_super) {
    __extends(ExactType, _super);
    function ExactType(name, is, validate, encode, type) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.type = type;
        _this._tag = 'ExactType';
        return _this;
    }
    return ExactType;
}(Type));
exports.ExactType = ExactType;
var getProps = function (codec) {
    switch (codec._tag) {
        case 'RefinementType':
        case 'ReadonlyType':
            return getProps(codec.type);
        case 'InterfaceType':
        case 'StrictType':
        case 'PartialType':
            return codec.props;
        case 'IntersectionType':
            return codec.types.reduce(function (props, type) { return Object.assign(props, getProps(type)); }, {});
    }
};
var stripKeys = function (o, props) {
    var keys = Object.getOwnPropertyNames(o);
    var shouldStrip = false;
    var r = {};
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (!hasOwnProperty.call(props, key)) {
            shouldStrip = true;
        }
        else {
            r[key] = o[key];
        }
    }
    return shouldStrip ? r : o;
};
var getExactTypeName = function (codec) {
    if (isInterfaceCodec(codec)) {
        return "{| " + getNameFromProps(codec.props) + " |}";
    }
    else if (isPartialCodec(codec)) {
        return getPartialTypeName("{| " + getNameFromProps(codec.props) + " |}");
    }
    return "Exact<" + codec.name + ">";
};
/**
 * Strips additional properties
 * @since 1.1.0
 */
exports.exact = function (codec, name) {
    if (name === void 0) { name = getExactTypeName(codec); }
    var props = getProps(codec);
    return new ExactType(name, codec.is, function (u, c) {
        return chain(exports.UnknownRecord.validate(u, c), function () { return fold(codec.validate(u, c), Either_1.left, function (a) { return exports.success(stripKeys(a, props)); }); });
    }, function (a) { return codec.encode(stripKeys(a, props)); }, codec);
};
/**
 * @since 1.0.0
 * @deprecated
 */
exports.getValidationError /* istanbul ignore next */ = function (value, context) { return ({
    value: value,
    context: context
}); };
/**
 * @since 1.0.0
 * @deprecated
 */
exports.getDefaultContext /* istanbul ignore next */ = function (decoder) { return [
    { key: '', type: decoder }
]; };
/**
 * @since 1.0.0
 * @deprecated
 */
var NeverType = /** @class */ (function (_super) {
    __extends(NeverType, _super);
    function NeverType() {
        var _this = _super.call(this, 'never', function (_) { return false; }, function (u, c) { return exports.failure(u, c); }, 
        /* istanbul ignore next */
        function () {
            throw new Error('cannot encode never');
        }) || this;
        _this._tag = 'NeverType';
        return _this;
    }
    return NeverType;
}(Type));
exports.NeverType = NeverType;
/**
 * @since 1.0.0
 * @deprecated
 */
exports.never = new NeverType();
/**
 * @since 1.0.0
 * @deprecated
 */
var AnyType = /** @class */ (function (_super) {
    __extends(AnyType, _super);
    function AnyType() {
        var _this = _super.call(this, 'any', function (_) { return true; }, exports.success, exports.identity) || this;
        _this._tag = 'AnyType';
        return _this;
    }
    return AnyType;
}(Type));
exports.AnyType = AnyType;
/**
 * Use `unknown` instead
 * @since 1.0.0
 * @deprecated
 */
exports.any = new AnyType();
/**
 * Use `UnknownRecord` instead
 * @since 1.0.0
 * @deprecated
 */
exports.Dictionary = exports.UnknownRecord;
/**
 * @since 1.0.0
 * @deprecated
 */
var ObjectType = /** @class */ (function (_super) {
    __extends(ObjectType, _super);
    function ObjectType() {
        var _this = _super.call(this, 'object', exports.UnknownRecord.is, exports.UnknownRecord.validate, exports.identity) || this;
        _this._tag = 'ObjectType';
        return _this;
    }
    return ObjectType;
}(Type));
exports.ObjectType = ObjectType;
/**
 * Use `UnknownRecord` instead
 * @since 1.0.0
 * @deprecated
 */
exports.object = new ObjectType();
/**
 * Use `brand` instead
 * @since 1.0.0
 * @deprecated
 */
function refinement(codec, predicate, name) {
    if (name === void 0) { name = "(" + codec.name + " | " + exports.getFunctionName(predicate) + ")"; }
    return new RefinementType(name, function (u) { return codec.is(u) && predicate(u); }, function (i, c) { return chain(codec.validate(i, c), function (a) { return (predicate(a) ? exports.success(a) : exports.failure(a, c)); }); }, codec.encode, codec, predicate);
}
exports.refinement = refinement;
/**
 * Use `Int` instead
 * @since 1.0.0
 * @deprecated
 */
exports.Integer = refinement(exports.number, Number.isInteger, 'Integer');
/**
 * Use `record` instead
 * @since 1.0.0
 * @deprecated
 */
exports.dictionary = exports.record;
/**
 * @since 1.0.0
 * @deprecated
 */
var StrictType = /** @class */ (function (_super) {
    __extends(StrictType, _super);
    function StrictType(name, is, validate, encode, props) {
        var _this = _super.call(this, name, is, validate, encode) || this;
        _this.props = props;
        _this._tag = 'StrictType';
        return _this;
    }
    return StrictType;
}(Type));
exports.StrictType = StrictType;
/**
 * Drops the codec "kind"
 * @since 1.1.0
 * @deprecated
 */
function clean(codec) {
    return codec;
}
exports.clean = clean;
function alias(codec) {
    return function () { return codec; };
}
exports.alias = alias;