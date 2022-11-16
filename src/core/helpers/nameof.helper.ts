export interface NameofOptions {
  propertyNameOnly: boolean;
}

export const nameof = (
  f: { (...params: any): any },
  options: NameofOptions = { propertyNameOnly: false }
): string => {
  const propertyPath = f.toString().replace(/[ |\(\)=>]/g, "");
  if (options?.propertyNameOnly === true)
    return propertyPath.replace(/(.*)\./g, "");
  else return propertyPath;
};
