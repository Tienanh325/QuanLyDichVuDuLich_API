using System;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DAL.Helper.Interfaces;

namespace DAL.Helper
{
    public class DatabaseHelper : IDatabaseHelper
    {
        //Connection String
        public string StrConnection { get; set; }
        //Connection
        public SqlConnection sqlConnection { get; set; }
        //NpgsqlTransaction 
        public SqlTransaction sqlTransaction { get; set; }

        public DatabaseHelper(IConfiguration configuration)
        {
            StrConnection = configuration["ConnectionStrings:DefaultConnection"];
        }
        /// <summary>
        /// Set Connection String
        /// </summary>
        /// <param name="connectionString"></param>
        public void SetConnectionString(string connectionString)
        {
            StrConnection = connectionString;
        }
        /// <summary>
        /// Open Connect to PostGres DB
        /// </summary>
        /// <returns>String.Empty when connected or Message Error when connect happen issue</returns>
        public string OpenConnection()
        {
            try
            {
                if (sqlConnection == null)
                    sqlConnection = new SqlConnection(StrConnection);

                if (sqlConnection.State != ConnectionState.Open)
                    sqlConnection.Open();

                return "";
            }
            catch (Exception exception)
            {
                return exception.Message;
            }
        }
        /// <summary>
        /// Open Connect begin transaction to PostGres DB
        /// </summary>
        /// <returns>String.Empty when connected or Message Error when connect happen issue</returns>
        public string OpenConnectionAndBeginTransaction()
        {
            try
            {
                if (sqlConnection == null)
                    sqlConnection = new SqlConnection(StrConnection);

                if (sqlConnection.State != ConnectionState.Open)
                    sqlConnection.Open();

                sqlTransaction = sqlConnection.BeginTransaction();

                return "";
            }
            catch (Exception exception)
            {
                if (sqlConnection != null)
                    sqlConnection.Dispose();

                if (sqlTransaction != null)
                    sqlTransaction.Dispose();

                return exception.Message;
            }
        }
        /// <summary>
        /// Close Connect and end transaction to PostGres DB
        /// </summary>
        /// <returns>String.Empty when Close connect success or Message Error when connection close happen issue</returns>
        public string CloseConnectionAndEndTransaction(bool isRollbackTransaction)
        {
            try
            {
                if (sqlTransaction != null)
                {
                    if (isRollbackTransaction)
                        sqlTransaction.Rollback();
                    else sqlTransaction.Commit();
                }

                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
                return "";
            }
            catch (Exception exception)
            {
                return exception.Message;
            }
        }
        /// <summary>
        /// Close Connect to PostGres DB
        /// </summary>
        /// <returns>String.Empty when Close connect success or Message Error when connection close happen issue</returns>
        public string CloseConnection()
        {
            try
            {
                if (sqlConnection != null && sqlConnection.State != ConnectionState.Closed)
                    sqlConnection.Close();
                return "";
            }
            catch (Exception exception)
            {
                return exception.Message;
            }
        }

        public string ExecuteNoneQuery(string strquery)
        {
            string msgError = "";
            try
            {
                OpenConnection();
                var sqlCommand = new SqlCommand(strquery, sqlConnection);
                sqlCommand.ExecuteNonQuery();
                sqlCommand.Dispose();
            }
            catch (Exception exception)
            {
                msgError = exception.ToString();
            }
            finally
            {
                CloseConnection();
            }
            return msgError;
        }

        public DataTable ExecuteQueryToDataTable(string strquery, out string msgError)
        {
            msgError = "";
            var result = new DataTable();
            var sqlDataAdapter = new SqlDataAdapter(strquery, StrConnection);
            try
            {
                sqlDataAdapter.Fill(result);
            }
            catch (Exception exception)
            {
                msgError = exception.ToString();
                result = null;
            }
            finally
            {
                sqlDataAdapter.Dispose();
            }
            return result;
        }

        public object ExecuteScalar(string strquery, out string msgError)
        {
            object result = null;
            try
            {
                OpenConnection();
                var npgsqlCommand = new SqlCommand(strquery, sqlConnection);
                result = npgsqlCommand.ExecuteScalar();
                npgsqlCommand.Dispose();
                msgError = "";
            }
            catch (Exception ex) { msgError = ex.StackTrace; }
            finally
            {
                CloseConnection();
            }
            return result;
        }
        public List<object> ReturnValuesFromExecuteSProcedure(out string msgError, string sprocedureName, int outputParamCountNumber, params object[] paramObjects)
        {
            msgError = "";
            var result = new List<object>();
            try
            {
                OpenConnection();
                using (var sqlCommand = new SqlCommand(sprocedureName, sqlConnection))
                {
                    sqlCommand.CommandType = CommandType.StoredProcedure;

                    // Add parameters to the command
                    for (int i = 0; i < paramObjects.Length; i += 2)
                    {
                        sqlCommand.Parameters.AddWithValue(paramObjects[i].ToString(), paramObjects[i + 1]);
                    }

                    // Add output parameters
                    for (int i = 0; i < outputParamCountNumber; i++)
                    {
                        var outputParam = new SqlParameter($"@OutputParam{i + 1}", SqlDbType.Variant)
                        {
                            Direction = ParameterDirection.Output
                        };
                        sqlCommand.Parameters.Add(outputParam);
                    }

                    sqlCommand.ExecuteNonQuery();

                    // Retrieve output parameter values
                    for (int i = 0; i < outputParamCountNumber; i++)
                    {
                        result.Add(sqlCommand.Parameters[$"@OutputParam{i + 1}"].Value);
                    }
                }
            }
            catch (Exception ex)
            {
                msgError = ex.Message;
            }
            finally
            {
                CloseConnection();
            }
            return result;
        }

        public string ExecuteSProcedure(string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public DataTable ExecuteSProcedureReturnDataTable(out string msgError, string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public DataSet ExecuteSProcedureReturnDataset(out string msgError, string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public string ExecuteSProcedure(SqlConnection sqlConnection, string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public string ExecuteSProcedureWithTransaction(string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public List<string> ExecuteScalarSProcedure(List<StoreParameterInfo> storeParameterInfos)
        {
            throw new NotImplementedException();
        }

        public List<string> ExecuteSProcedureWithTransaction(List<StoreParameterInfo> storeParameterInfos)
        {
            throw new NotImplementedException();
        }

        public object ExecuteScalarSProcedure(out string msgError, string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public object ExecuteScalarSProcedureWithTransaction(out string msgError, string sprocedureName, params object[] paramObjects)
        {
            throw new NotImplementedException();
        }

        public List<object> ExecuteScalarSProcedure(out List<string> msgErrors, List<StoreParameterInfo> storeParameterInfos)
        {
            throw new NotImplementedException();
        }

        public List<object> ExecuteScalarSProcedureWithTransaction(out List<string> msgErrors, List<StoreParameterInfo> storeParameterInfos)
        {
            throw new NotImplementedException();
        }
    }
}
