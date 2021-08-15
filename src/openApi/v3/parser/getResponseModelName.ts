import camelCase from 'camelcase';

export const getResponseModelName = (definitionName: string, mediaType: string) => {
    const convertedMediaType = camelCase(mediaType.replace('/', '-'), {pascalCase: true});

    return `${definitionName}${convertedMediaType}Response`;
}