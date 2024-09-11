"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const abort_controller_1 = require("abort-controller");
const fetch_with_timeout_1 = require("../utils/fetch-with-timeout");
const node_fetch_1 = require("node-fetch");
const openapi_core_1 = require("@redocly/openapi-core");
const https_proxy_agent_1 = require("https-proxy-agent");
jest.mock('node-fetch');
jest.mock('@redocly/openapi-core');
describe('fetchWithTimeout', () => {
    beforeAll(() => {
        // @ts-ignore
        global.setTimeout = jest.fn();
        global.clearTimeout = jest.fn();
    });
    beforeEach(() => {
        openapi_core_1.getProxyAgent.mockReturnValueOnce(undefined);
    });
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should call node-fetch with signal', async () => {
        await (0, fetch_with_timeout_1.default)('url', { timeout: 1000 });
        expect(global.setTimeout).toHaveBeenCalledTimes(1);
        expect(node_fetch_1.default).toHaveBeenCalledWith('url', {
            signal: new abort_controller_1.default().signal,
            agent: undefined,
        });
        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
    });
    it('should call node-fetch with proxy agent', async () => {
        openapi_core_1.getProxyAgent.mockRestore();
        const proxyAgent = new https_proxy_agent_1.HttpsProxyAgent('http://localhost');
        openapi_core_1.getProxyAgent.mockReturnValueOnce(proxyAgent);
        await (0, fetch_with_timeout_1.default)('url');
        expect(node_fetch_1.default).toHaveBeenCalledWith('url', { agent: proxyAgent });
    });
    it('should call node-fetch without signal when timeout is not passed', async () => {
        await (0, fetch_with_timeout_1.default)('url');
        expect(global.setTimeout).not.toHaveBeenCalled();
        expect(node_fetch_1.default).toHaveBeenCalledWith('url', { agent: undefined });
        expect(global.clearTimeout).not.toHaveBeenCalled();
    });
});
