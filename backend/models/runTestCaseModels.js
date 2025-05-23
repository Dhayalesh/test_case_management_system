const db = require("./db");

function addTestExecution(testExecution, callback) {
  const { date_executed, group_name, test_case, test_result, status } = testExecution;
  const sql = `
    INSERT INTO test_execution (date_executed, group_name, test_case, test_result, status)
    VALUES (?, ?, ?, ?, ?)
  `;
  db.query(sql, [date_executed, group_name, test_case, test_result, status], callback);
}

function getAllExecutions(callback) {
  const sql = `SELECT * FROM test_execution ORDER BY date_executed DESC`;
  db.query(sql, callback);
}

module.exports = {
  addTestExecution,
  getAllExecutions,
};
