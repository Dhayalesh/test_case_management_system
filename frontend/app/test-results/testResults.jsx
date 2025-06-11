"use client";
import React, { useState, useEffect } from "react";
import styles from "./testResults.module.css";
import API_URL from "../api/api.json";

const BASE_URL = API_URL.BASE_URL;

const TestResults = () => {
  const [sortBy, setSortBy] = useState("");
  const [secondaryFilter, setSecondaryFilter] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/test-execution-fetch`)
      .then((res) => res.json())
      .then((data) => {
        const formattedData = data.map((item) => ({
          ...item,
          date_executed: item.date_executed.split("T")[0], // Ensure only date is shown
        }));
        setData(formattedData);
      })
      .catch((err) =>
        console.error("Error fetching test execution records:", err)
      );
  }, []);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setSecondaryFilter("");
  };

  const filteredData = data.filter((item) => {
    if (sortBy === "Status") {
      return secondaryFilter ? item.status === secondaryFilter : true;
    }
    if (sortBy === "Tested Date") {
      return secondaryFilter ? item.date_executed === secondaryFilter : true;
    }
    if (sortBy === "Test Case Name") {
      return secondaryFilter
        ? item.test_case.toLowerCase().includes(secondaryFilter.toLowerCase())
        : true;
    }
    if (sortBy === "Test Group Name") {
      return secondaryFilter
        ? item.group_name.toLowerCase().includes(secondaryFilter.toLowerCase())
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
              <th>Test Result</th>
              <th>Status</th>
              <th>Tested Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <React.Fragment key={item.id}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.group_name}</td>
                  <td>{item.test_case}</td>
                  <td>{item.test_result}</td>
                  <td
                    className={
                      item.status === "Pass" ? styles.pass : styles.fail
                    }
                  >
                    {item.status}
                  </td>
                  <td>{item.date_executed}</td> {/* Displays only date */}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TestResults;
