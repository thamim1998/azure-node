const { app } = require("@azure/functions");

const sql = require("mssql");

const sqlConfig = {
  user:"",
  options: {
    encrypt: true,
  },
};

app.http("httpTrigger1", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || (await request.text()) || "world";

    return { body: `Hello, ${name}!` };
  },
});

app.http("getExample", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log(`Http function processed request for url "${request.url}"`);

    const name = request.query.get("name") || "Thamim";
    const age = request.query.get("age");

    let responseMessage = `Hello ${name}!`;
    if (age) {
      responseMessage += `You are ${age} years old.`;
    }

    return { body: responseMessage };
  },
});

app.http("getCourse", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    context.log("Fetching course from Azure SQL DB");

    context.log(`USERNAME: ${process.env["SQL_USERNAME"]}`)

    try {
      await sql.connect(sqlConfig);

      const result = await sql.query`SELECT * FROM Course`;

      return {
        status: 200,
        jsonBody: result.recordset,
        headers: {
          "Content-Type": "application/json",
        },
      };
    } catch (err) {
      context.log("SQL error:", err);
      return {
        status: 500,
        body: "Error fetching courses from database",
      };
    } finally {
      sql.close();
    }
  },
});
