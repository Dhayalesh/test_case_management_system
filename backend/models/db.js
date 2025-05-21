const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Dhaya@2505",  
  multipleStatements: true, 
});


db.connect((err) => {
  if (err) {
    console.error("DB connection error:", err);
    return;
  }
  console.log("Connected to MySQL server");

  // Create database if not exists
  db.query("CREATE DATABASE IF NOT EXISTS Test_Case_Management", (err) => {
    if (err) throw err;
    console.log("Database ensured: Test_Case_Management");

    // Use the created database
    db.changeUser({ database: "Test_Case_Management" }, (err) => {
      if (err) throw err;
      console.log("Connected to Test_Case_Management database");

      // Create users table if not exists
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(100) UNIQUE,
          password VARCHAR(100)
        )
      `;
      db.query(createUsersTable, (err) => {
        if (err) throw err;
        console.log("Table created");

        // Insert default admin user if not exists
        const insertAdminUser = `
          INSERT IGNORE INTO users (email, password)
          VALUES ('admin@ktern.com', 'admin123')
        `;
        db.query(insertAdminUser, (err) => {
          if (err) throw err;
          console.log("Default admin user ensured");
        });
      });
    });
  });
});

module.exports = db;
