"use client";

import React, { useState, useEffect } from "react";
import styles from "./runTestCases.module.css";

const RunTestCases = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedCase, setSelectedCase] = useState("");
  const [passStatus, setPassStatus] = useState("");
  const [description, setDescription] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [copied, setCopied] = useState(false);

  const testGroups = {
    "Login Tests": {
      description: "Tests related to login functionality.",
      cases: {
        "Valid Login": {
          description: "Test with valid username and password.",
          data: "username: testuser, password: 123456",
          script: "login('testuser', '123456');",
        },
        "Invalid Login": {
          description: "Test with incorrect password.",
          data: "username: testuser, password: wrongpass",
          script: "login('testuser', 'wrongpass');",
        },
      },
    },
    "Signup Tests": {
      description: "Tests related to user registration.",
      cases: {
        "Valid Signup": {
          description: "Register with valid user info.",
          data: "username: newuser, password: pass123",
          script: "signup('newuser', 'pass123');",
        },
      },
    },
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setCurrentDate(today);
  }, []);

  const handleCopy = () => {
    const script =
      selectedGroup && selectedCase
        ? testGroups[selectedGroup].cases[selectedCase].script
        : "";
    navigator.clipboard.writeText(script);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          {Object.keys(testGroups).map((group, idx) => (
            <option key={idx} value={group}>
              {group}
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
            {Object.keys(testGroups[selectedGroup].cases).map((test, idx) => (
              <option key={idx} value={test}>
                {test}
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

      {selectedGroup && selectedCase && (
        <div className={styles.infoBox}>
          <p>
            <strong>Group Description:</strong>{" "}
            {testGroups[selectedGroup].description}
          </p>
          <p>
            <strong>Case Description:</strong>{" "}
            {testGroups[selectedGroup].cases[selectedCase].description}
          </p>
          <p>
            <strong>Test Data:</strong>{" "}
            {testGroups[selectedGroup].cases[selectedCase].data}
          </p>
          <p>
            <strong>Test Script:</strong>
          </p>
          <div className={styles.scriptBox}>
            {testGroups[selectedGroup].cases[selectedCase].script}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className={styles.copyButton}
          >
            Copy Script
          </button>
          {copied && <div className={styles.copySuccess}>Copied!</div>}
        </div>
      )}
    </div>
  );
};

export default RunTestCases;
