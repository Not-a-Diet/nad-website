export function parseDescriptionList(descriptionList: string): string[] {
  const parsed = descriptionList?.split(';')
  .map(item => item.trim())
  .filter(item => item.length > 0);

  return parsed ?? [];
}