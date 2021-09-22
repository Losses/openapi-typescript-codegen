import { resolve } from 'path';

import { RequiredOptions } from '../index';

import type { Client } from '../client/interfaces/Client';
import { mkdir, rmdir } from './fileSystem';
import { isSubDirectory } from './isSubdirectory';
import { Templates } from './registerHandlebarTemplates';
import { writeClientCore } from './writeClientCore';
import { writeClientIndex } from './writeClientIndex';
import { writeClientModels } from './writeClientModels';
import { writeClientSchemas } from './writeClientSchemas';
import { writeClientValidators } from './writeClientValidators';
import { writeClientServices } from './writeClientServices';

/**
 * Write our OpenAPI client, using the given templates at the given output
 * @param client Client object with all the models, services, etc.
 * @param templates Templates wrapper with all loaded Handlebars templates
 */
export async function writeClient(client: Client, templates: Templates, options: RequiredOptions): Promise<void> {
    const outputPath = resolve(process.cwd(), options.output);
    const outputPathCore = resolve(outputPath, 'core');
    const outputPathModels = resolve(outputPath, 'models');
    const outputPathValidator = resolve(outputPath, 'validators');
    const outputPathSchemas = resolve(outputPath, 'schemas');
    const outputPathServices = resolve(outputPath, 'services');

    if (!isSubDirectory(process.cwd(), options.output)) {
        throw new Error(`Output folder is not a subdirectory of the current working directory`);
    }

    if (options.exportCore) {
        await rmdir(outputPathCore);
        await mkdir(outputPathCore);
        await writeClientCore(client, templates, outputPathCore, options);
    }

    if (options.exportServices) {
        await rmdir(outputPathServices);
        await mkdir(outputPathServices);
        await writeClientServices(client.services, templates, outputPathServices, options);
    }

    if (options.exportSchemas) {
        await rmdir(outputPathSchemas);
        await mkdir(outputPathSchemas);
        await writeClientSchemas(client.models, templates, outputPathSchemas, options);
    }

    if (options.precompileValidator) {
        await rmdir(outputPathValidator);
        await mkdir(outputPathValidator);
        await writeClientValidators(client.models, templates, outputPathValidator, options);
    }

    if (options.exportModels) {
        await rmdir(outputPathModels);
        await mkdir(outputPathModels);
        await writeClientModels(client.models, templates, outputPathModels, options);
    }

    if (options.exportCore || options.exportServices || options.exportSchemas || options.exportModels) {
        await mkdir(outputPath);
        await writeClientIndex(client, templates, outputPath, options);
    }
}
