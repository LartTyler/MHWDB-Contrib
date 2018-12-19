// @ts-ignore
export const toValues = <T>(subject: object): T[] => Object.keys(subject).map(key => subject[key]);
