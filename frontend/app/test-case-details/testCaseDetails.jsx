"use client";

import { useState } from "react";
import styles from "./testCaseDetails.module.css";
import deleteIcon from "../../public/images/delete.png";
import editIcon from "../../public/images/edit.png";
import Image from "next/image";

export default function TestCaseDetails() {
  const [testCases, setTestCases] = useState([
    {
      name: "Login Valid Credentials",
      description: "Test login with valid username and password.",
      data: "Username: test, Password: 123456",
      script: "script goes here",
      addedOn: new Date().toLocaleString("en-GB"),
    },
    {
      name: "Login Invalid Credentials",
      description: "Test login with incorrect credentials.",
      data: "Username: test, Password: wrongpass",
      script: "script goes here",
      addedOn: new Date().toLocaleString("en-GB"),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    data: "",
    script: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const newEntry = {
      ...formData,
      addedOn: new Date().toLocaleString("en-GB"),
    };

    if (editIndex !== null) {
      const updated = [...testCases];
      updated[editIndex] = { ...formData, addedOn: testCases[editIndex].addedOn };
      setTestCases(updated);
      setEditIndex(null);
    } else {
      setTestCases([...testCases, newEntry]);
    }

    setFormData({ name: "", description: "", data: "", script: "" });
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setFormData(testCases[index]);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const handleCancel = () => {
    setFormData({ name: "", description: "", data: "", script: "" });
    setEditIndex(null);
    setShowForm(false);
  };

  return (
    <div className={styles.overallContainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Test Cases</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            Add Test Case
          </button>
        )}

        {showForm && (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Test Case Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            <textarea
              placeholder="Data Needed"
              value={formData.data}
              onChange={(e) => handleChange("data", e.target.value)}
            />
            <textarea
              placeholder="Test Script"
              value={formData.script}
              onChange={(e) => handleChange("script", e.target.value)}
            />
            <div className={styles.formActions}>
              <button onClick={handleSave} className={styles.saveBtn}>
                {editIndex !== null ? "Update" : "Save"}
              </button>
              <button onClick={handleCancel} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.testCaseList}>
          {testCases.map((tc, index) => (
            <div key={index} className={styles.testCaseCard}>
              <h3>{tc.name}</h3>
              <p><strong>Description:</strong> {tc.description}</p>
              <p><strong>Data:</strong> {tc.data}</p>
              <p><strong>Test Script:</strong> {tc.script}</p>
              <p className={styles.timestamp}>
                <strong>Date Added:</strong> {tc.addedOn}
              </p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(index)}
                  className={styles.iconBtn}
                  aria-label="Edit test case"
                >
                  <Image src={editIcon} alt="Edit" width={25} height={25} draggable={false} />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className={styles.iconBtn}
                  aria-label="Delete test case"
                >
                  <Image src={deleteIcon} alt="Delete" width={25} height={25} draggable={false} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
