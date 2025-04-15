export function env(name: string): string {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Required environment variable missing: ${name}`);
  return value;
}
