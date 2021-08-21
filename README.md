# OpenAPI Hooks Codegen

[![NPM][npm-image]][npm-url]
[![License][license-image]][license-url]
[![Build Status][travis-image]][travis-url]

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

**NPX**

```
npx openapi-typescript-codegen --input ./spec.json --output ./dist
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
import { useGetRole } from './api/services/AdminService';

const [role, roleController] = useGetRole();

roleController.fetchData(1);
```

**Side effect**

Like setting `localStorage` after a login request.

```typescript
import { useGetRole } from './api/services/AdminService';

const [role, roleController] = useGetRole();

roleController.fetchData(1, {}, (atom, set, result) => {
    set({ ...atom, data: result.body });
    localStorage.setItem('token', result.body);
});
```

**Credential**

```typescript
import { useGetRole } from './api/services/AdminService';

const [role, roleController] = useGetRole();

roleController.fetchData(1, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
});
```

**Request body of a post request**

```typescript
import { useCreateRole } from './api/services/AdminService';

const [role, createRoleController] = useCreateRole();

createRoleController.fetchData({
    name: 'xxx',
    permissions: ['xxx'],
});
```

**Infinite scrolling**

```typescript
import { useGetRole } from './api/services/AdminService';

const [role, roleController] = useGetRole();

roleController.fetchData(1, {}, (atom, set, result) => {
    set({
        ...atom, 
        data: atom.data.concat(result)
    })
});
```

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

[npm-url]: https://npmjs.org/package/@jbcz/openapi-typescript-codegen
[npm-image]: https://img.shields.io/npm/v/@jbcz/openapi-typescript-codegen.svg
[license-url]: LICENSE
[license-image]: http://img.shields.io/npm/l/@jbcz/openapi-typescript-codegen.svg
[travis-url]: https://travis-ci.org/ferdikoomen/openapi-typescript-codegen
[travis-image]: https://img.shields.io/travis/ferdikoomen/openapi-typescript-codegen.svg
