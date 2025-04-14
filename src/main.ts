import { setupApplication } from "./server.ts";
import { initDatabase } from "./models/core/init.ts";

function main() {
  initDatabase();

  const app = setupApplication();
  const port = 8080;
  app.listen({ port });
  console.log(`Server started on http://localhost:${port}`);
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  main();
}
