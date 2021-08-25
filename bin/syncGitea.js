#!/usr/bin/env node

'use strict';

const fs = require('fs');
const url = require('url');
const path = require('path');
const program = require('commander');
const fetch = require('node-fetch');
const pkg = require('../package.json');

const params = program
    .name('openapi-sync-gitea')
    .usage('[options]')
    .version(pkg.version)
    .requiredOption('-o, --output <value>', 'Output directory (required)')
    .option('--host <value>', 'URL of your Gitea instance')
    .option('--token <value>', 'User token of your Gitea account', process.env.GITEA_TOKEN)
    .option('--owner <value>', 'Owner of the repo')
    .option('--repo <value>', 'Name of the repo')
    .option('--filePath <value>', 'Path of the dir, file, symlink or submodule in the repo')
    .option('--ref <value>', 'The name of the commit/branch/tag. Default the repository’s default branch (usually master)')
    .option('--exportSchemas <value>', 'Write schemas to disk', true)
    .option('--responseSchemaAsModel <value>', 'Convert response component to schema', true)
    .option('--runtimeValidation <value>', 'Check if check data type from service side is valid while fetching the data', true)
    .option('--request <value>', 'Path to custom request file')
    .parse(process.argv)
    .opts();

const main = async () => {
    const fetchUrl = new url.URL(`api/v1/repos/${encodeURIComponent(params.owner)}/${encodeURIComponent(params.repo)}/contents/${encodeURIComponent(params.filePath)}`, params.host);
    fetchUrl.searchParams.append('ref', params.ref);
    fetchUrl.searchParams.append('access_token', params.token);

    const response = await fetch(fetchUrl.href, {
        headers: {
            Accept: 'application/json',
        },
    });

    const body = await response.json();
    const buffer = Buffer.from(body.content, 'base64');
    fs.writeFileSync(path.resolve(params.output), buffer);
};

main();
