import { HttpClient } from './HttpClient';
import { parse as parseV3 } from './openApi/v3';
import { getOpenApiSpec } from './utils/getOpenApiSpec';
import { getOpenApiVersion, OpenApiVersion } from './utils/getOpenApiVersion';
import { isString } from './utils/isString';
import { postProcessClient } from './utils/postProcessClient';
import { registerHandlebarTemplates } from './utils/registerHandlebarTemplates';
import { writeClient } from './utils/writeClient';

export { HttpClient } from './HttpClient';

export interface Options {
    input: string | Record<string, any>;
    output: string;
    httpClient?: HttpClient;
    useOptions?: boolean;
    useUnionTypes?: boolean;
    exportCore?: boolean;
    exportServices?: boolean;
    exportModels?: boolean;
    exportSchemas?: boolean;
    responseSchemaAsModel?: boolean;
    runtimeValidation?: boolean;
    precompileValidator?: boolean;
    throwOnRequestFailed?: boolean;
    request?: string;
    write?: boolean;
    verboseHttpLog?: boolean;
}

export type RequiredOptions = Required<Options>;

const DEFAULT_PARAMETERS = {
    input: '',
    output: '',
    httpClient: HttpClient.FETCH,
    useOptions: false,
    useUnionTypes: false,
    exportCore: true,
    exportServices: true,
    exportModels: true,
    exportSchemas: false,
    responseSchemaAsModel: true,
    runtimeValidation: true,
    precompileValidator: false,
    throwOnRequestFailed: false,
    request: '',
    write: true,
    verboseHttpLog: false,
};

/**
 * Generate the OpenAPI client. This method will read the OpenAPI specification and based on the
 * given language it will generate the client, including the typed models, validation schemas,
 * service layer, etc.
 * @param input The relative location of the OpenAPI spec
 * @param output The relative location of the output directory
 * @param httpClient The selected httpClient (fetch or XHR)
 * @param useOptions Use options or arguments functions
 * @param useUnionTypes Use union types instead of enums
 * @param exportCore: Generate core client classes
 * @param exportServices: Generate services
 * @param exportModels: Generate models
 * @param exportSchemas: Generate schemas
 * @param responseSchemaAsModel: Convert responses to schemas
 * @param runtimeValidation: Check if check data type from service side is valid while fetching the data
 * @param precompileValidator: Compile AJV valitor to string or not
 * @param request: Path to custom request file
 * @param write Write the files to disk (true or false)
 */
export async function generate(options: Options): Promise<void> {
    const mergedOptions = {} as unknown as RequiredOptions;

    Object.keys(DEFAULT_PARAMETERS).forEach((_key: string) => {
        const key = _key as keyof RequiredOptions;
        Reflect.set(mergedOptions, key, options[key] ?? DEFAULT_PARAMETERS[key]);
    });

    const openApi = isString(options.input) ? await getOpenApiSpec(options.input) : options.input;
    const openApiVersion = getOpenApiVersion(openApi);
    const templates = registerHandlebarTemplates(mergedOptions);

    switch (openApiVersion) {
        case OpenApiVersion.V2: {
            throw new Error('OpenAPI V2 is not supported.');
        }

        case OpenApiVersion.V3: {
            let client = parseV3(openApi, mergedOptions.responseSchemaAsModel);
            client = postProcessClient(client);
            if (!mergedOptions.write) break;
            await writeClient(client, templates, mergedOptions);
            break;
        }
    }
}
