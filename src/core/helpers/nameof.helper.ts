export interface NameofOptions {
  fieldNameOnly: boolean;
}

export const nameof = (
  f: { (...params: any): any },
  options: NameofOptions = { fieldNameOnly: false }
): string => {
  const propertyPath = f.toString().replace(/[ |\(\)=>]/g, "");
  if (options?.fieldNameOnly === true)
    return propertyPath.replace(/(.*)\./g, "");
  else return propertyPath;
};
