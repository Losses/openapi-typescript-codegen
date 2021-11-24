#!/usr/bin/env node

'use strict';

const path = require('path');
const program = require('commander');
const pkg = require('../package.json');

const params = program
    .name('openapi')
    .usage('[options]')
    .version(pkg.version)
    .requiredOption('-i, --input <value>', 'OpenAPI specification, can be a path, url or string content (required)')
    .requiredOption('-o, --output <value>', 'Output directory (required)')
    .option('-c, --client <value>', 'HTTP client to generate [fetch, node]', 'fetch')
    .option('--useOptions', 'Use options instead of arguments')
    .option('--useUnionTypes', 'Use union types instead of enums')
    .option('--variation <value>', 'Generate codes for [react-hook, fastify]', 'react-hook')
    .option('--exportCore <value>', 'Write core files to disk', true)
    .option('--exportServices <value>', 'Write services to disk', true)
    .option('--exportModels <value>', 'Write models to disk', true)
    .option('--exportSchemas <value>', 'Write schemas to disk', true)
    .option('--responseSchemaAsModel <value>', 'Convert response component to schema', true)
    .option('--runtimeValidation <value>', 'Check if check data type from service side is valid while fetching the data', true)
    .option('--precompileValidator <value>', 'Precompile AJV validator to JavaScript files, this will significantly increase the amount of generated code', false)
    .option('--throwOnRequestFailed <value>', 'Throw an error while fetch failed', false)
    .option('--verboseHttpLog <value>', 'Dump all detailed request log to your console', process.env.VERBOSE_HTTP_LOG || 'false')
    .option('--request <value>', 'Path to custom request file')
    .parse(process.argv)
    .opts();

const OpenAPI = require(path.resolve(__dirname, '../dist/index.js'));

if (OpenAPI) {
    OpenAPI.generate({
        input: params.input,
        output: params.output,
        httpClient: params.client,
        useOptions: params.useOptions,
        useUnionTypes: params.useUnionTypes,
        variation: params.variation,
        exportCore: JSON.parse(params.exportCore) === true,
        exportServices: JSON.parse(params.exportServices) === true,
        exportModels: JSON.parse(params.exportModels) === true,
        exportSchemas: JSON.parse(params.exportModels) === true,
        responseSchemaAsModel: JSON.parse(params.responseSchemaAsModel) === true,
        runtimeValidation: JSON.parse(params.runtimeValidation) === true,
        precompileValidator: JSON.parse(params.precompileValidator) === true,
        throwOnRequestFailed: JSON.parse(params.throwOnRequestFailed) === true,
        verboseHttpLog: JSON.parse(params.verboseHttpLog) === true,
        request: params.request,
    })
        .then(() => {
            process.exit(0);
        })
        .catch(error => {
            console.error(error);
            process.exit(1);
        });
}
