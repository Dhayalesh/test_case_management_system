const db = require("./db");

// Sanitize table name for group tables
function sanitizeTableName(name) {
  return name.toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

// Create test group table dynamically
function createGroupTable(groupName, callback) {
  const tableName = sanitizeTableName(groupName);
  console.log("Creating group table:", tableName);

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS \`${tableName}\` (
      id INT PRIMARY KEY AUTO_INCREMENT,
      test_case_name VARCHAR(100),
      description TEXT,
      test_script TEXT,
      date_added DATE
    )
  `;

  db.query(createTableSQL, (err, results) => {
    if (err) {
      console.error("Error creating group table:", err);
      return callback(err);
    }
    callback(null, results);
  });
}

function addTestGroup(group, callback) {
  const { name, description, date_added } = group;
  console.log("Adding test group:", name);

  db.query(
    "INSERT INTO test_groups (name, description, date_added) VALUES (?, ?, ?)",
    [name, description, date_added],
    (err, results) => {
      if (err) {
        console.error("Error inserting test group:", err);
        return callback(err);
      }
      createGroupTable(name, (err) => {
        if (err) {
          console.error("Error creating test group table after insert:", err);
          return callback(err);
        }
        callback(null, results);
      });
    }
  );
}

function getAllGroups(callback) {
  db.query("SELECT * FROM test_groups", (err, results) => {
    if (err) {
      console.error("Error fetching all groups:", err);
      return callback(err);
    }

    // Fallback if date_added is NULL
    const formatted = results.map(group => ({
      ...group,
      date_added: group.date_added || new Date().toISOString().slice(0, 10)
    }));

    callback(null, formatted);
  });
}

function getGroupById(id, callback) {
  db.query("SELECT * FROM test_groups WHERE id = ?", [id], (err, results) => {
    if (err) {
      console.error("Error fetching group by ID:", err);
      return callback(err);
    }

    const group = results[0];

    // Fallback if date_added is missing
    if (group) {
      group.date_added = group.date_added || new Date().toISOString().slice(0, 10);
    }

    callback(null, group);
  });
}

function updateGroup(id, group, callback) {
  const { name, description } = group;
  console.log(`Updating group ID ${id} with name: ${name}`);

  getGroupById(id, (err, oldGroup) => {
    if (err) {
      console.error("Error fetching old group for update:", err);
      return callback(err);
    }
    if (!oldGroup) {
      const errMsg = "Group not found for update";
      console.error(errMsg);
      return callback(new Error(errMsg));
    }

    db.query(
      "UPDATE test_groups SET name = ?, description = ? WHERE id = ?",
      [name, description, id],
      (err) => {
        if (err) {
          console.error("Error updating group info:", err);
          return callback(err);
        }

        if (oldGroup.name !== name) {
          const oldTable = sanitizeTableName(oldGroup.name);
          const newTable = sanitizeTableName(name);
          console.log(`Renaming table from ${oldTable} to ${newTable}`);

          db.query(`RENAME TABLE \`${oldTable}\` TO \`${newTable}\``, (err) => {
            if (err) {
              console.error("Error renaming group table:", err);
              return callback(err);
            }
            callback(null);
          });
        } else {
          callback(null);
        }
      }
    );
  });
}

function deleteGroup(id, callback) {
  console.log("Deleting group with ID:", id);

  getGroupById(id, (err, group) => {
    if (err) {
      console.error("Error fetching group for deletion:", err);
      return callback(err);
    }
    if (!group) {
      const errMsg = "Group not found for deletion";
      console.error(errMsg);
      return callback(new Error(errMsg));
    }

    const tableName = sanitizeTableName(group.name);
    console.log("Dropping table for group:", tableName);

    db.query(`DROP TABLE IF EXISTS \`${tableName}\``, (err) => {
      if (err) {
        console.error("Error dropping group table:", err);
        return callback(err);
      }

      db.query("DELETE FROM test_groups WHERE id = ?", [id], (err) => {
        if (err) {
          console.error("Error deleting group record:", err);
          return callback(err);
        }
        callback(null);
      });
    });
  });
}

module.exports = {
  addTestGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
};
