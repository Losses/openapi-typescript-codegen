import { resolve } from 'path';

import { RequiredOptions } from '../index';

import type { Model } from '../client/interfaces/Model';
import { writeFile } from './fileSystem';
import { format } from './format';
import { Templates } from './registerHandlebarTemplates';

/**
 * Generate Models using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPath Directory to write the generated files to
 */
export async function writeClientModels(models: Model[], templates: Templates, outputPath: string, { httpClient, useUnionTypes }: RequiredOptions): Promise<void> {
    for (const model of models) {
        const file = resolve(outputPath, `${model.name}.ts`);
        const templateResult = templates.exports.model({
            ...model,
            httpClient,
            useUnionTypes,
        });
        await writeFile(file, format(templateResult));
    }
}
