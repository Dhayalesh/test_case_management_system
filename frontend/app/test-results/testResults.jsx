"use client";
import React, { useState } from "react";
import styles from "./testResults.module.css";

const dummyData = [
  {
    id: 1,
    groupName: "Authentication",
    caseName: "Login Test",
    description: "Verify login with valid credentials",
    status: "Pass",
    testedDate: "2025-05-19",
  },
  {
    id: 2,
    groupName: "User Management",
    caseName: "Update Profile",
    description: "Update user profile info",
    status: "Fail",
    testedDate: "2025-05-20",
  },
  {
    id: 3,
    groupName: "Dashboard",
    caseName: "Load Widgets",
    description: "Check if dashboard widgets load",
    status: "Pass",
    testedDate: "2025-05-18",
  },
  {
    id: 4,
    groupName: "Billing",
    caseName: "Generate Invoice",
    description: "Ensure invoice is generated for a transaction",
    status: "Pass",
    testedDate: "2025-05-17",
  },
  {
    id: 5,
    groupName: "Authentication",
    caseName: "Logout Function",
    description: "Verify user logout works correctly",
    status: "Fail",
    testedDate: "2025-05-15",
  },
  {
    id: 6,
    groupName: "Settings",
    caseName: "Change Password",
    description: "Ensure password change is functional",
    status: "Pass",
    testedDate: "2025-05-14",
  },
  {
    id: 7,
    groupName: "User Management",
    caseName: "Delete User",
    description: "Verify deletion of a user",
    status: "Fail",
    testedDate: "2025-05-13",
  },
  {
    id: 8,
    groupName: "Notifications",
    caseName: "Email Alerts",
    description: "Test email alert delivery",
    status: "Pass",
    testedDate: "2025-05-12",
  },
  {
    id: 9,
    groupName: "Reporting",
    caseName: "Export CSV",
    description: "Ensure CSV export is accurate",
    status: "Fail",
    testedDate: "2025-05-11",
  },
  {
    id: 10,
    groupName: "Permissions",
    caseName: "Role Assignment",
    description: "Check role-based access control",
    status: "Pass",
    testedDate: "2025-05-10",
  },
  {
    id: 11,
    groupName: "Security",
    caseName: "XSS Prevention",
    description: "Test for cross-site scripting vulnerabilities",
    status: "Pass",
    testedDate: "2025-05-09",
  },
  {
    id: 12,
    groupName: "Performance",
    caseName: "Page Load Time",
    description: "Ensure page loads under 2 seconds",
    status: "Fail",
    testedDate: "2025-05-08",
  },
];

const TestResults = () => {
  const [sortBy, setSortBy] = useState("");
  const [secondaryFilter, setSecondaryFilter] = useState("");
  const [data, setData] = useState(dummyData);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setSecondaryFilter("");
  };

  const filteredData = data.filter((item) => {
    if (sortBy === "Status") {
      return secondaryFilter ? item.status === secondaryFilter : true;
    }
    if (sortBy === "Tested Date") {
      return secondaryFilter ? item.testedDate === secondaryFilter : true;
    }
    if (sortBy === "Test Case Name") {
      return secondaryFilter
        ? item.caseName.toLowerCase().includes(secondaryFilter.toLowerCase())
        : true;
    }
    if (sortBy === "Test Group Name") {
      return secondaryFilter
        ? item.groupName.toLowerCase().includes(secondaryFilter.toLowerCase())
        : true;
    }
    return true;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Test Results</h2>

      <div className={styles.sortSection}>
        <select
          value={sortBy}
          onChange={handleSortChange}
          className={styles.selectBox}
        >
          <option value="">Sort By</option>
          <option value="Test Group Name">Test Group Name</option>
          <option value="Test Case Name">Test Case Name</option>
          <option value="Status">Status</option>
          <option value="Tested Date">Tested Date</option>
        </select>

        {sortBy === "Status" && (
          <select
            value={secondaryFilter}
            onChange={(e) => setSecondaryFilter(e.target.value)}
            className={styles.selectBox}
          >
            <option value="">Select Status</option>
            <option value="Pass">Pass</option>
            <option value="Fail">Fail</option>
          </select>
        )}

        {sortBy === "Tested Date" && (
          <input
            type="date"
            value={secondaryFilter}
            onChange={(e) => setSecondaryFilter(e.target.value)}
            className={styles.selectBox}
          />
        )}

        {(sortBy === "Test Case Name" || sortBy === "Test Group Name") && (
          <input
            type="text"
            placeholder={`Enter ${sortBy}`}
            value={secondaryFilter}
            onChange={(e) => setSecondaryFilter(e.target.value)}
            className={styles.selectBox}
          />
        )}
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Test Group Name</th>
              <th>Test Case Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Tested Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>
                <td>{item.groupName}</td>
                <td>{item.caseName}</td>
                <td>{item.description}</td>
                <td
                  className={item.status === "Pass" ? styles.pass : styles.fail}
                >
                  {item.status}
                </td>
                <td>{item.testedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;
