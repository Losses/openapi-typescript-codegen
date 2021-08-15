
import type { Model } from '../../../client/interfaces/Model';
import type { OpenApi } from '../interfaces/OpenApi';
import type { OpenApiMediaType } from '../interfaces/OpenApiMediaType';

import { getModel } from './getModel';
import { getType } from './getType';
import { getResponseModelName } from './getResponseModelName'

export function getModels(openApi: OpenApi, responseComponentAsSchema: boolean): Model[] {
    const models: Model[] = [];
    if (openApi.components) {
        for (const definitionName in openApi.components.schemas) {
            if (openApi.components.schemas.hasOwnProperty(definitionName)) {
                const definition = openApi.components.schemas[definitionName];
                const definitionType = getType(definitionName);
                const model = getModel(openApi, definition, true, definitionType.base);
                models.push(model);
            }
        }

        if (responseComponentAsSchema && openApi.components.responses) {
            Object
                .entries(openApi.components.responses)
                .forEach(([definitionName, definition]) => {
                    if (!definition.content) return;

                    Object
                        .entries(definition.content)
                        .forEach(([mediaType, responseDefinition]: [string, OpenApiMediaType]) => {
                            const modelName = getResponseModelName(definitionName, mediaType);
                            const responseSchema = responseDefinition.schema;
                            if (!responseSchema) return;

                            const responseType = getType(modelName);
                            const model = getModel(openApi, responseSchema, true, responseType.base);
                            responseDefinition.schema = { '$ref': `#/components/schemas/${modelName}` };

                            models.push(model);
                        });
                });
        }
    }
    return models;
}
