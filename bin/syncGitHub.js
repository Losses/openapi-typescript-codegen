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
    .option('--host <value>', 'URL of your Gitea instance', 'https://api.github.com')
    .option('--token <value>', 'User token of your GitHub account', process.env.GITHUB_TOKEN)
    .option('--owner <value>', 'Owner of the repo')
    .option('--repo <value>', 'Name of the repo')
    .option('--filePath <value>', 'Path of the dir, file, symlink or submodule in the repo')
    .option('--ref <value>', 'The name of the commit/branch/tag. Default the repository’s default branch (usually master)', process.env.OPENAPI_SYNC_REF)
    .parse(process.argv)
    .opts();

const main = async () => {
    const fetchUrl = new url.URL(`repos/${encodeURIComponent(params.owner)}/${encodeURIComponent(params.repo)}/contents/${encodeURIComponent(params.filePath)}`, params.host);
    fetchUrl.searchParams.append('ref', params.ref);

    const response = await fetch(fetchUrl.href, {
        headers: {
            Authorization: `token ${params.token}`,
            Accept: `application/vnd.github.v3.raw`,
        },
    });

    const buffer = await response.buffer();
    fs.writeFileSync(path.resolve(params.output), buffer);
};

main();
