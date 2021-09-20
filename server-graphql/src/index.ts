import "reflect-metadata";
import { startServer } from "./server";
import { createConnectionDB } from "./utils/createConnectionDB";

(async () => {
  try {
    await createConnectionDB();
    console.log("Db is connected :D ");
  } catch (error) {
    console.log("ups, error accessing the db ");
    process.exit(1);
  }

  try {
    const { app, apolloServer } = await startServer();
    app.listen({ port: 4000 });
    console.log(
      `Server running in http://localhost:4000${apolloServer.graphqlPath}`
    );
  } catch (error) {
    console.log(error);
  }
})();
