# OpenAPI Hooks Codegen

[![NPM][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Node.js Package][action-image]][action-url]

> Node.js library that generates React Hooks based on the OpenAPI specification.

This project is a fork of [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen/), which:
* Generates React hooks for OpenAPI specification, which is driven by [jotai](https://github.com/pmndrs/jotai);
* Fixed many bugs in the schema generator, which could help us generate ajv-compliant JSON Schema;
* Add client side type validation to enhance the robostness of your website;
* Dropped the support of OpenAPI v2 and XHR mode.

## Install

```
npm install @jbcz/openapi-hooks-codegen --save-dev
```


## Usage

```
$ openapi --help

  Usage: openapi [options]

  Options:
    -V, --version             output the version number
    -i, --input <value>       OpenAPI specification, can be a path, url or string content (required)
    -o, --output <value>      Output directory (required)

  Examples
    $ openapi --input ./spec.json
    $ openapi --input ./spec.json --output ./dist
```


## Example

### Generating

**package.json**
```json
{
    "scripts": {
        "generate": "openapi --input ./spec.json --output ./dist"
    }
}
```

**Node.js API**

```javascript
const OpenAPI = require('openapi-hooks-codegen');

OpenAPI.generate({
    input: './spec.json',
    output: './dist'
});

// Or by providing the content of the spec directly 🚀
OpenAPI.generate({
    input: require('./spec.json'),
    output: './dist'
});
```

### Using

**Basic usage**

```typescript
import { useGetRole } from './api';

const [role, roleController] = useGetRole();

roleController.fetchData(1);
```

**Side effect**

Like setting `localStorage` after a login request.

```typescript
import { useGetRole } from './api';

const [role, roleController] = useGetRole();

roleController.fetchData(1, {}, (atom, set, result) => {
    set({ ...atom, data: result.body });
    localStorage.setItem('token', result.body);
});
```

**Credential**

```typescript

import { useGetRole, globalOptionsAtom } from './api';

const [role, roleController] = useGetRole();
const [globalConfig, setGlobalConfig] = useAtom(globalOptionsAtom)

setGlobalConfig({
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});

roleController.fetchData(1);
```

**Request body of a post request**

```typescript
import { useCreateRole } from './api';

const [role, createRoleController] = useCreateRole();

createRoleController.fetchData({
    name: 'xxx',
    permissions: ['xxx'],
    // ...
});
```

**Request header of a request**

```typescript
import { useGetRole } from './api';

const [role, roleController] = useGetRole();

roleController.fetchData(1, {
    headers: {
        'YourHeader': `YourValue`,
        // ...
    },
});
```

**Infinite scrolling**

```typescript
import { useGetRole } from './api';

const [role, roleController] = useGetRole();

roleController.fetchData(1, {}, (atom, set, result) => {
    set({
        ...atom,
        data: atom.data.concat(result),
    })
});
```

### Project Setup

If your team is using Gitea and want to automatically sync the spec with the repository,
you can use the following project setup:

1. Installing some dependencies:

```
yarn add -D npm-run-all dotenv-cli @jbcz/openapi-hooks-codegen
```

2. Creating a `.env.openapi` file in the root directory of your project, with the following
   content:

```
GITEA_TOKEN=YOUR_SUPER_SECRET_TOKEN
```

3. Adding the following configuration to the `scripts` section of your `package.json` file:

```
"scripts": {
    "sync-spec": "dotenv-cli -e /env.openapi openapi-sync-gitea --ref RELEASE_TAG --owner REPO_OWNER --repo REPO_ID --filePath --filePath FILE_PATH_IN_THE_REPO --host GITEA_HOST -o ./spec.yaml",
    "gen-api": "openapi --input ./spec.yaml ./src/api/",
    "postinstall": "npm-run-all sync-spec gen-api",
},
```

4. Creating a `.gitkeep` file in the `./src/api/`.


5. **IMPORTANT**: Add the following configuration to your `.gitignore` file:

```
/env.openapi
/spec.yaml
/src/api/
!/src/api/.gitkeep
```

6. Edit `tsconfig.json` to add the following configuration:

```
{
  "compilerOptions": {
      "baseUrl": "src",
  }
}
```

7. Run `yarn postinstall` to generate the API.

****
FAQ
===

### Babel support
If you use enums inside your models / definitions then those enums are by default inside a namespace with the same name
as your model. This is called declaration merging. However, the [@babel/plugin-transform-typescript](https://babeljs.io/docs/en/babel-plugin-transform-typescript)
does not support these namespaces, so if you are using babel in your project please use the `--useUnionTypes` flag
to generate union types instead of traditional enums. More info can be found here: [Enums vs. Union Types](#enums-vs-union-types---useuniontypes).

**Note:** If you are using Babel 7 and Typescript 3.8 (or higher) then you should enable the `onlyRemoveTypeImports` to
ignore any 'type only' imports, see https://babeljs.io/docs/en/babel-preset-typescript#onlyremovetypeimports for more info

```javascript
module.exports = {
    presets: [
        ['@babel/preset-typescript', {
            onlyRemoveTypeImports: true,
        }],
    ],
};
```

[npm-url]: https://npmjs.org/package/@jbcz/openapi-hooks-codegen
[npm-image]: https://img.shields.io/npm/v/@jbcz/openapi-hooks-codegen.svg
[license-url]: LICENSE
[license-image]: http://img.shields.io/npm/l/@jbcz/openapi-hooks-codegen.svg
[action-url]: https://github.com/jibencaozuo-playground/openapi-hooks-codegen/actions/workflows/npm-publish.yml
[action-image]: https://github.com/jibencaozuo-playground/openapi-hooks-codegen/actions/workflows/npm-publish.yml/badge.svg
