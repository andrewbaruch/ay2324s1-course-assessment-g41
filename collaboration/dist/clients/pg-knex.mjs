import { createRequire as topLevelCreateRequire } from 'module';
global.require = topLevelCreateRequire(import.meta.url);
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/clients/pg-knex.ts
var objection = __require("objection");
var { knexSnakeCaseMappers } = objection;
var knexPgClient = __require("knex")({
  client: "pg",
  connection: process.env.POSTGRES_COLLAB,
  // set min to 0 so all idle connections can be terminated
  pool: { min: 0, max: 10 },
  ...knexSnakeCaseMappers({ underscoreBeforeDigits: true })
});
export {
  knexPgClient
};
