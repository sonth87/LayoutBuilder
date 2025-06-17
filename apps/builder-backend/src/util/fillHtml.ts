/**
 * Replace placeholders in HTML with values.
 * @param html HTML string with placeholders.
 * @param values Object with key-value pairs to replace.
 * @param brackets Array with opening and closing bracket strings, e.g. ["{{", "}}"]
 * @returns HTML string with replaced values.
 */
export function fillTemplateHtml(
  html: string,
  values: Record<string, string>,
  brackets: [string, string] = ["{{", "}}"],
): string {
  let result = html;
  for (const [key, value] of Object.entries(values)) {
    // Create a global regex for each placeholder
    const pattern = new RegExp(
      `${brackets[0]}\\s*${key}\\s*${brackets[1]}`,
      "g",
    );
    result = result.replace(pattern, value);
  }
  return result;
}
