import { resolve } from 'path';

import type { Client } from '../client/interfaces/Client';
import { RequiredOptions } from '../index';
import { writeFile } from './fileSystem';
import { Templates } from './registerHandlebarTemplates';
import { sortModelsByName } from './sortModelsByName';
import { sortServicesByName } from './sortServicesByName';

/**
 * Generate the OpenAPI client index file using the Handlebar template and write it to disk.
 * The index file just contains all the exports you need to use the client as a standalone
 * library. But yuo can also import individual models and services directly.
 * @param client Client object, containing, models, schemas and services
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 */
export async function writeClientIndex(
    client: Client,
    templates: Templates,
    outputPath: string,
    { exportCore, exportServices, exportModels, exportSchemas, useUnionTypes, variation }: RequiredOptions
): Promise<void> {
    await writeFile(
        resolve(outputPath, 'index.ts'),
        templates.index({
            exportCore,
            exportServices,
            exportModels,
            exportSchemas,
            useUnionTypes,
            variation,
            server: client.server,
            version: client.version,
            models: sortModelsByName(client.models),
            services: sortServicesByName(client.services),
        })
    );
}
