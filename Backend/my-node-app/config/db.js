const hasSqlCredentials = Boolean(process.env.DB_USER && process.env.DB_PASSWORD);
const useTrustedConnection =
    !hasSqlCredentials &&
    String(process.env.DB_TRUSTED_CONNECTION || "true").toLowerCase() === "true";
const rawServer = process.env.DB_SERVER || "LAPTOP-377TGVKG\\MSSQLSERVER01";
const [serverName, instanceFromServer] = rawServer.split("\\");
const instanceName = process.env.DB_INSTANCE || instanceFromServer;
const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

const resolveSqlDriver = () => {
    if (!useTrustedConnection) {
        return require("mssql");
    }

    try {
        return require("mssql/msnodesqlv8");
    } catch (err) {
        throw new Error(
            "Windows Authentication requires 'msnodesqlv8'. Install it with 'npm install msnodesqlv8' or set DB_USER and DB_PASSWORD."
        );
    }
};

const sql = resolveSqlDriver();

const baseConfig = {
    server: serverName,
    database: process.env.DB_NAME || "TravelBookingSystem",
    ...(port ? { port } : {}),
    options: {
        trustServerCertificate: true,
        ...(instanceName ? { instanceName } : {})
    }
};

const config = useTrustedConnection
    ? {
          ...baseConfig,
          driver: process.env.DB_DRIVER || "ODBC Driver 17 for SQL Server",
          options: {
              ...baseConfig.options,
              trustedConnection: true,
              encrypt: false
          }
      }
    : {
          ...baseConfig,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          options: {
              ...baseConfig.options,
              encrypt: false
          }
      };

let poolPromise;

const connectDB = async () => {
    if (!poolPromise) {
        poolPromise = sql
            .connect(config)
            .then((pool) => {
                console.log("SQL Server connected");
                return pool;
            })
            .catch((err) => {
                poolPromise = null;
                throw err;
            });
    }

    return poolPromise;
};

module.exports = { sql, connectDB, config };
