type FieldIssue = { path: ReadonlyArray<PropertyKey>; message: string };

export function toFieldErrors(error: { issues: ReadonlyArray<FieldIssue> }): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0]);
    if (key && !(key in result)) {
      result[key] = issue.message;
    }
  }
  return result;
}
