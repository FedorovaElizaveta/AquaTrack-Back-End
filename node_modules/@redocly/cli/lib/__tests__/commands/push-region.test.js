"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openapi_core_1 = require("@redocly/openapi-core");
const push_1 = require("../../commands/push");
const login_1 = require("../../commands/login");
const config_1 = require("../fixtures/config");
jest.mock('fs');
jest.mock('node-fetch', () => ({
    default: jest.fn(() => ({
        ok: true,
        json: jest.fn().mockResolvedValue({}),
    })),
}));
jest.mock('@redocly/openapi-core');
jest.mock('../../commands/login');
jest.mock('../../utils/miscellaneous');
openapi_core_1.getMergedConfig.mockImplementation((config) => config);
const mockPromptClientToken = login_1.promptClientToken;
describe('push-with-region', () => {
    const redoclyClient = require('@redocly/openapi-core').__redoclyClient;
    redoclyClient.isAuthorizedWithRedoclyByRegion = jest.fn().mockResolvedValue(false);
    beforeAll(() => {
        jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    });
    it('should call login with default domain when region is US', async () => {
        redoclyClient.domain = 'redoc.ly';
        await (0, push_1.handlePush)({
            argv: {
                upsert: true,
                api: 'spec.json',
                destination: '@org/my-api@1.0.0',
                branchName: 'test',
            },
            config: config_1.ConfigFixture,
            version: 'cli-version',
        });
        expect(mockPromptClientToken).toBeCalledTimes(1);
        expect(mockPromptClientToken).toHaveBeenCalledWith(redoclyClient.domain);
    });
    it('should call login with EU domain when region is EU', async () => {
        redoclyClient.domain = 'eu.redocly.com';
        await (0, push_1.handlePush)({
            argv: {
                upsert: true,
                api: 'spec.json',
                destination: '@org/my-api@1.0.0',
                branchName: 'test',
            },
            config: config_1.ConfigFixture,
            version: 'cli-version',
        });
        expect(mockPromptClientToken).toBeCalledTimes(1);
        expect(mockPromptClientToken).toHaveBeenCalledWith(redoclyClient.domain);
    });
});
