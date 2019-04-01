export const ucfirst = (text: string): string => `${text.charAt(0).toUpperCase()}${text.substr(1)}`;

export const ucwords = (text: string, separator: string = ' ') => text.split(separator).map(ucfirst).join(separator);
