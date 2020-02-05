export const ucfirst = (text: string): string => `${text.charAt(0).toLocaleUpperCase()}${text.substr(1)}`;

export const ucwords = (text: string, separator: string = ' ') => text.split(separator).map(ucfirst).join(separator);

export const lcfirst = (text: string): string => `${text.charAt(0).toLocaleLowerCase()}${text.substr(1)}`;
