import { resolve } from 'path';

import type { Service } from '../client/interfaces/Service';
import { RequiredOptions } from '../index';
import { writeFile } from './fileSystem';
import { format } from './format';
import { Templates } from './registerHandlebarTemplates';

const VERSION_TEMPLATE_STRING = 'OpenAPI.VERSION';

/**
 * Generate Services using the Handlebar template and write to disk.
 * @param services Array of Services to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 */
export async function writeClientServices(
    services: Service[],
    templates: Templates,
    outputPath: string,
    { httpClient, useUnionTypes, useOptions, runtimeValidation, precompileValidator, throwOnRequestFailed, verboseHttpLog }: RequiredOptions
): Promise<void> {
    for (const service of services) {
        const file = resolve(outputPath, `${service.name}.ts`);
        const useVersion = service.operations.some(operation => operation.path.includes(VERSION_TEMPLATE_STRING));

        const templateResult = templates.exports.service({
            ...service,
            httpClient,
            useUnionTypes,
            useVersion,
            useOptions,
            runtimeValidation,
            precompileValidator,
            throwOnRequestFailed,
            verboseHttpLog,
        });
        await writeFile(file, format(templateResult));
    }
}
