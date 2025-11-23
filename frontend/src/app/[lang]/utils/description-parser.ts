import { assert } from "console";

//Helper function to parse a string to array of string the string is expected to have items separated by semicolons (;)
export function parseDescriptionList(descriptionList: string): string[] {
  assert(descriptionList !== undefined, "descriptionList is undefined");

  const parsed = descriptionList?.split(';')
  .map(item => item.trim())
  .filter(item => item.length > 0);

  assert(parsed !== undefined, "Parsed description list is undefined");

  return parsed;
}