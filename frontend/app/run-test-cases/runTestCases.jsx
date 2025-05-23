"use client";

import React, { useState, useEffect } from "react";
import styles from "./runTestCases.module.css";

const BASE_URL = "http://51.20.12.147";

const RunTestCases = () => {
  const [testGroups, setTestGroups] = useState([]);
  const [testCases, setTestCases] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [passStatus, setPassStatus] = useState("");
  const [description, setDescription] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);

    fetch(`${BASE_URL}/test-case-group-fetch`)
      .then((res) => res.json())
      .then((data) => setTestGroups(data))
      .catch((err) => console.error("Error fetching test groups:", err));
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      fetch(`${BASE_URL}/test-case-detail-fetch?groupName=${selectedGroup}`)
        .then((res) => res.json())
        .then((data) => setTestCases(data))
        .catch((err) => console.error("Error fetching test cases:", err));
    } else {
      setTestCases([]);
    }
  }, [selectedGroup]);

  const handleSave = async () => {
    if (!selectedGroup || !selectedCase || !passStatus) {
      console.error("Please select all required fields before saving.");
      return;
    }

    const executionData = {
      group_name: selectedGroup,
      test_case: selectedCase,
      test_result: description,
      status: passStatus,
    };

    try {
      const response = await fetch(`${BASE_URL}/test-execution-add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(executionData),
      });

      const result = await response.json();
      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        console.log("Test execution saved successfully!");
      } else {
        console.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("Error saving test execution:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Run Test Case</h2>

      <div className={styles.field}>
        <label>Select Test Group</label>
        <select
          value={selectedGroup}
          onChange={(e) => {
            setSelectedGroup(e.target.value);
            setSelectedCase("");
          }}
        >
          <option value="">-- Select Group --</option>
          {testGroups.map((group) => (
            <option key={group.id} value={group.name}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      {selectedGroup && (
        <div className={styles.field}>
          <label>Select Test Case</label>
          <select
            value={selectedCase}
            onChange={(e) => setSelectedCase(e.target.value)}
          >
            <option value="">-- Select Test Case --</option>
            {testCases.map((test) => (
              <option key={test._id} value={test.name}>
                {test.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className={styles.field}>
        <label>Status</label>
        <div className={styles.statusButtons}>
          <button
            className={
              passStatus === "Pass" ? styles.activeGreen : styles.green
            }
            type="button"
            onClick={() => setPassStatus("Pass")}
          >
            Pass
          </button>
          <button
            className={passStatus === "Fail" ? styles.activeRed : styles.red}
            type="button"
            onClick={() => setPassStatus("Fail")}
          >
            Fail
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter test result details here..."
        ></textarea>
      </div>

      <div className={styles.field}>
        <label>Date</label>
        <input type="date" value={currentDate} readOnly />
      </div>

      {selectedCase && (
        <div className={styles.infoBox}>
          <p>
            <strong>Case Description:</strong>{" "}
            {testCases.find((tc) => tc.name === selectedCase)?.description ||
              "No description"}
          </p>
          <p>
            <strong>Test Data:</strong>{" "}
            {testCases.find((tc) => tc.name === selectedCase)?.data ||
              "No data"}
          </p>
          <p>
            <strong>Test Script:</strong>
          </p>
          <textarea
            className={styles.scriptBox}
            value={
              testCases.find((tc) => tc.name === selectedCase)?.script || ""
            }
            readOnly
          ></textarea>

          <button
            type="button"
            onClick={handleSave}
            className={styles.copyButton}
          >
            Save
          </button>
          {saved && <div className={styles.copySuccess}>Saved!</div>}
        </div>
      )}
    </div>
  );
};

export default RunTestCases;
