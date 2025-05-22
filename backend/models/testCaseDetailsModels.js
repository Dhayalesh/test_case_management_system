const db = require("./db");


function sanitizeTableName(name) {
  return name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

function ensureTableExists(table, callback) {
  // Create table if it does not exist already.
  const createSql = `
    CREATE TABLE IF NOT EXISTS \`${table}\` (
      id INT AUTO_INCREMENT PRIMARY KEY,
      test_case_name VARCHAR(255) NOT NULL,
      description TEXT,
      test_script TEXT,
      date_added DATE,
      test_data TEXT
    )
  `;
  db.query(createSql, function (err) {
    if (err) return callback(err);
    // Check if the test_data column exists.
    const checkSql = `SHOW COLUMNS FROM \`${table}\` LIKE 'test_data'`;
    db.query(checkSql, function (err, results) {
      if (err) return callback(err);
      if (results.length === 0) {
        // If the column doesn't exist, alter the table to add it.
        const alterSql = `ALTER TABLE \`${table}\` ADD COLUMN test_data TEXT`;
        db.query(alterSql, function (err) {
          if (err) return callback(err);
          callback(null);
        });
      } else {
        callback(null);
      }
    });
  });
}

// Add a test case to a group's table
function addTestCase(groupName, testCase, callback) {
  const table = sanitizeTableName(groupName);
  ensureTableExists(table, (err) => {
    if (err) return callback(err);
    const { test_case_name, description, test_script, date_added, test_data } = testCase;
    const sql = `
      INSERT INTO \`${table}\` (test_case_name, description, test_script, date_added, test_data)
      VALUES (?, ?, ?, ?, ?)
    `;
    db.query(sql, [test_case_name, description, test_script, date_added, test_data], callback);
  });
}

// Get all test cases from a group's table
function getTestCases(groupName, callback) {
  const table = sanitizeTableName(groupName);
  ensureTableExists(table, (err) => {
    if (err) return callback(err);
    const sql = `SELECT * FROM \`${table}\``;
    db.query(sql, (err, results) => {
      if (err) return callback(err);
      const formatted = results.map(tc => ({
        ...tc,
        date_added: tc.date_added || new Date().toISOString().slice(0, 10)
      }));
      callback(null, formatted);
    });
  });
}

// Get a single test case by ID
function getTestCaseById(groupName, id, callback) {
  const table = sanitizeTableName(groupName);
  ensureTableExists(table, (err) => {
    if (err) return callback(err);
    const sql = `SELECT * FROM \`${table}\` WHERE id = ?`;
    db.query(sql, [id], (err, results) => {
      if (err) return callback(err);
      const testCase = results[0];
      if (testCase) {
        testCase.date_added = testCase.date_added || new Date().toISOString().slice(0, 10);
      }
      callback(null, testCase);
    });
  });
}

// Update a test case by ID
function updateTestCase(groupName, id, testCase, callback) {
  const table = sanitizeTableName(groupName);
  ensureTableExists(table, (err) => {
    if (err) return callback(err);
    const { test_case_name, description, test_script, test_data } = testCase;
    const sql = `
      UPDATE \`${table}\`
      SET test_case_name = ?, description = ?, test_script = ?, test_data = ?
      WHERE id = ?
    `;
    db.query(sql, [test_case_name, description, test_script, test_data, id], callback);
  });
}

// Delete a test case by ID
function deleteTestCase(groupName, id, callback) {
  const table = sanitizeTableName(groupName);
  ensureTableExists(table, (err) => {
    if (err) return callback(err);
    const sql = `DELETE FROM \`${table}\` WHERE id = ?`;
    db.query(sql, [id], callback);
  });
}

module.exports = {
  addTestCase,
  getTestCases,
  getTestCaseById,
  updateTestCase,
  deleteTestCase,
};
