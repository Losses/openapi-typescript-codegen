import type { OperationError } from './OperationError';
import type { OperationParameters } from './OperationParameters';
import type { OperationResponse } from './OperationResponse';

export interface Operation extends OperationParameters {
    service: string;
    name: string;
    hookName: string;
    summary: string | null;
    description: string | null;
    deprecated: boolean;
    method: string;
    path: string;
    pathParameters: string[];
    pathPattern: string;
    errors: OperationError[];
    results: OperationResponse[];
    okResults: OperationResponse[];
    errorResults: OperationResponse[];
    responseHeader: string | null;
}
