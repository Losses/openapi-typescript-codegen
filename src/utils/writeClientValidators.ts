import { resolve } from 'path';
import { unlinkSync } from 'fs';
import spwan from 'cross-spawn';

import type { Model } from '../client/interfaces/Model';
import { HttpClient } from '../HttpClient';
import { writeFile } from './fileSystem';
import { Templates } from './registerHandlebarTemplates';

/**
 * Generate Vaidators using the Handlebar template and write to disk.
 * @param models Array of Models to write
 * @param templates The loaded handlebar templates
 * @param outputPathValidatorPath Directory to write the generated files to
 * @param httpClient The selected httpClient (fetch, xhr or node)
 * @param useUnionTypes Use union types instead of enums
 * @param precompileValidator: Compile AJV valitor to string or not
 */
export async function writeClientValidators(
    models: Model[], templates: Templates, 
    outputPathValidatorPath: string,
    httpClient: HttpClient, useUnionTypes: boolean
): Promise<void> {
    for (const model of models) {
        const parameters = {
            ...model,
            httpClient,
            useUnionTypes,
        }

        const validatorSchemaFile = resolve(outputPathValidatorPath, `$${model.name}.js`);
        const validatorSchemaResult = templates.exports.schemaCjs(parameters);
        await writeFile(validatorSchemaFile, validatorSchemaResult);
    }

    
    const validatorGeneratorFile = resolve(outputPathValidatorPath, `$$generator.js`);
    const validatorGeneratorResult = templates.exports.validatorGenerator({
        models,
        httpClient,
        useUnionTypes,
    });
    await writeFile(validatorGeneratorFile, validatorGeneratorResult);
    spwan.sync(process.execPath, [validatorGeneratorFile], { stdio: 'inherit', cwd: outputPathValidatorPath });

    unlinkSync(validatorGeneratorFile);
    for (const model of models) {
        const validatorSchemaFile = resolve(outputPathValidatorPath, `$${model.name}.js`);
        unlinkSync(validatorSchemaFile);
    }
}
