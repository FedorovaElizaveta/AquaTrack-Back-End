"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveXInternal = void 0;
const utils_1 = require("../../utils");
const ref_utils_1 = require("../../ref-utils");
const DEFAULT_INTERNAL_PROPERTY_NAME = 'x-internal';
const RemoveXInternal = ({ internalFlagProperty }) => {
    const hiddenTag = internalFlagProperty || DEFAULT_INTERNAL_PROPERTY_NAME;
    function removeInternal(node, ctx) {
        const { parent, key } = ctx;
        let didDelete = false;
        if (Array.isArray(node)) {
            for (let i = 0; i < node.length; i++) {
                if ((0, ref_utils_1.isRef)(node[i])) {
                    const resolved = ctx.resolve(node[i]);
                    if (resolved.node?.[hiddenTag]) {
                        node.splice(i, 1);
                        didDelete = true;
                        i--;
                    }
                }
                if (node[i]?.[hiddenTag]) {
                    node.splice(i, 1);
                    didDelete = true;
                    i--;
                }
            }
        }
        else if ((0, utils_1.isPlainObject)(node)) {
            for (const key of Object.keys(node)) {
                node = node;
                if ((0, ref_utils_1.isRef)(node[key])) {
                    const resolved = ctx.resolve(node[key]);
                    if (resolved.node?.[hiddenTag]) {
                        delete node[key];
                        didDelete = true;
                    }
                }
                if (node[key]?.[hiddenTag]) {
                    delete node[key];
                    didDelete = true;
                }
            }
        }
        if (didDelete && ((0, utils_1.isEmptyObject)(node) || (0, utils_1.isEmptyArray)(node))) {
            delete parent[key];
        }
    }
    return {
        any: {
            enter: (node, ctx) => {
                removeInternal(node, ctx);
            },
        },
    };
};
exports.RemoveXInternal = RemoveXInternal;
