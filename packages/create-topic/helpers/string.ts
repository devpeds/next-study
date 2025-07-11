export function isKebabCase(str: string) {
  return /^(\w+-)*\w+$/.test(str);
}
