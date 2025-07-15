export function isKebabCase(str: string) {
  return /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(str);
}

export function isTopicPathName(str: string) {
  return /^(\d+)-[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/.test(str);
}
