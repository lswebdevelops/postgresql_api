const app = require("./src/app.js");
const pool = require("./src/pool");

pool
  .connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork",
    user: "postgres",
    password: "20126619",
  })
  .then(() => {
    app().listen(3005, () => {
      console.log("Listening on port 3005");
    });
  })
  .catch((err) => console.error(err));
