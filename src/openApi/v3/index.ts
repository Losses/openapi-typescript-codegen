import type { Client } from '../../client/interfaces/Client';
import type { OpenApi } from './interfaces/OpenApi';
import { getModels } from './parser/getModels';
import { getServer } from './parser/getServer';
import { getServices } from './parser/getServices';
import { getServiceVersion } from './parser/getServiceVersion';

/**
 * Parse the OpenAPI specification to a Client model that contains
 * all the models, services and schema's we should output.
 * @param openApi The OpenAPI spec  that we have loaded from disk.
 * @param responseSchemaAsModel: Convert responses to schemas.
 */
export function parse(openApi: OpenApi, responseSchemaAsModel: boolean): Client {
    const version = getServiceVersion(openApi.info.version);
    const server = getServer(openApi);
    const models = getModels(openApi, responseSchemaAsModel);
    const services = getServices(openApi);

    return { version, server, models, services };
}
