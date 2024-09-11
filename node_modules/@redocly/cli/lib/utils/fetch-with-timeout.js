"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_FETCH_TIMEOUT = void 0;
const node_fetch_1 = require("node-fetch");
const abort_controller_1 = require("abort-controller");
const openapi_core_1 = require("@redocly/openapi-core");
exports.DEFAULT_FETCH_TIMEOUT = 3000;
exports.default = async (url, { timeout, ...options } = {}) => {
    if (!timeout) {
        return (0, node_fetch_1.default)(url, {
            ...options,
            agent: (0, openapi_core_1.getProxyAgent)(),
        });
    }
    const controller = new abort_controller_1.default();
    const timeoutId = setTimeout(() => {
        controller.abort();
    }, timeout);
    const res = await (0, node_fetch_1.default)(url, {
        signal: controller.signal,
        ...options,
        agent: (0, openapi_core_1.getProxyAgent)(),
    });
    clearTimeout(timeoutId);
    return res;
};
