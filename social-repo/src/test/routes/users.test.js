const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repo");
const pool = require("../../pool");

const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");
const format = require("pg-format");

beforeAll(async () => {
  // randomly generatyiong a role name to connect to pg as
  // always starts with an a> because of postgres roles
  const roleName = "a" + randomBytes(4).toString("hex");
  // connect to pg as usual
  await pool.connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork-test",
    user: "postgres",
    password: "20126619",
  });
  // create a new role
  await pool.query(
    format('create role %I with login password %L;', roleName, roleName)
  );
  // create a schema with the same name
  await pool.query(
    format("create schema %I authorization %I;", roleName, roleName)
  );
  // disconnect entirely from pg
  await pool.close();

  // run our migrations in the new schema
  await migrate({
    schema: roleName,
    direction: "up",
    log: () => {},
    noLock: true,
    dir: "migrations",
    databaseUrl: {
      host: "localhost",
      port: 5432,
      database: "socialnetwork-test",
      user: roleName,
      password: roleName,
    },
  });
  // connect to pg as the newly created role
  await pool.connect({
    host: "localhost",
    port: 5432,
    database: "socialnetwork-test",
    user: roleName,
    password: roleName,
  });
});

afterAll(() => {
  return pool.close();
});

it("create a user", async () => {
  const startingCount = await UserRepo.count();

  await request(buildApp())
    .post("/users")
    .send({ username: "testuser", bio: "test bio" })
    .expect(200);

  const finishCount = await UserRepo.count();
  expect(finishCount - startingCount).toEqual(1);
});
