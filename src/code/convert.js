import { KEBAB_CASE, SNAKE_CASE, CAMEL_CASE } from '../constants';
export const capitalize = (value) => {
    if (value.length < 2)
        return value.toUpperCase();
    return value[0].toUpperCase() + value.substr(1).toLowerCase();
};
export const toKebabCase = (value) => {
    const regex = /[\s\W]+/g;
    return value.replace(regex, '-').toLowerCase();
};
export const toSnakeCase = (value) => {
    const regex = /[\s\W]+/g;
    return value.replace(regex, '_').toLowerCase();
};
export const toCamelCase = (value) => {
    const result = value.split(/[\s\W]/g).map((str, idx) => {
        return idx == 0 ? str.toLowerCase() : capitalize(str);
    });
    return result.join('');
};
export const inConvention = (convention, value) => {
    const path = value.split('/').map((p) => {
        const elem = p.trim();
        switch (convention) {
            case KEBAB_CASE:
                return toKebabCase(elem);
            case SNAKE_CASE:
                return toSnakeCase(elem);
            case CAMEL_CASE:
                return toCamelCase(elem);
            default:
                return elem;
        }
    });
    return path.join('/');
};
