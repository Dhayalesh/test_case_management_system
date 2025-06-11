"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./testCaseDetails.module.css";
import deleteIcon from "../../public/images/delete.png";
import editIcon from "../../public/images/edit.png";
import Image from "next/image";
import API_URL from "../api/api.json";

const BASE_URL = API_URL.BASE_URL;

export default function TestCaseDetails({ groupName, groupId, onBack }) {
  const [testCases, setTestCases] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    data: "",
    script: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch test cases when groupName changes
  useEffect(() => {
    if (!groupName) return;

    axios
      .get(
        `${BASE_URL}/test-case-detail-fetch?groupName=${encodeURIComponent(
          groupName
        )}`
      )
      .then((res) => setTestCases(res.data))
      .catch((err) => {
        console.error(
          "Fetch error:",
          err.response ? err.response.data : err
        );
      });
  }, [groupName]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    if (editIndex !== null) {
      // Update test case
      axios
        .put(`${BASE_URL}/test-case-detail-update/${editId}`, {
          groupName,
          ...formData,
        })
        .then((res) => {
          const updated = [...testCases];
          updated[editIndex] = { ...res.data, _id: res.data.id };
          setTestCases(updated);
          resetForm();
        })
        .catch((err) =>
          console.error("Update error:", JSON.stringify(err, null, 2))
        );
    } else {
      // Add new test case, sending date as "YYYY-MM-DD"
      axios
        .post(`${BASE_URL}/test-case-detail-add`, {
          ...formData,
          groupName,
          groupId,
          addedOn: new Date().toISOString().slice(0, 10),
        })
        .then((res) => {
          const newTestCase = { ...res.data, _id: res.data.id };
          setTestCases([...testCases, newTestCase]);
          resetForm();
        })
        .catch((err) =>
          console.error("Add error:", JSON.stringify(err, null, 2))
        );
    }
  };

  const handleEdit = (index) => {
    const tc = testCases[index];
    setFormData({
      name: tc.name,
      description: tc.description,
      data: tc.data,
      script: tc.script,
    });
    setEditId(tc._id || tc.id);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const id = testCases[index]._id || testCases[index].id;
    axios
      .delete(
        `${BASE_URL}/test-case-detail-delete/${id}?groupName=${encodeURIComponent(
          groupName
        )}`
      )
      .then(() => {
        setTestCases(testCases.filter((_, i) => i !== index));
      })
      .catch((err) =>
        console.error("Delete error:", JSON.stringify(err, null, 2))
      );
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", data: "", script: "" });
    setShowForm(false);
    setEditIndex(null);
    setEditId(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Test Cases in Group: {groupName}</h2>

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
            placeholder="Test Data"
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
              {editIndex !== null ? "Update Test Case" : "Save Test Case"}
            </button>
            <button onClick={resetForm} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className={styles.list}>
        {testCases.map((tc, i) => (
          <div key={tc._id || tc.id || `temp-${i}`} className={styles.testCaseCard}>
            <h3>{tc.name}</h3>
            <p>{tc.description}</p>
            <p>
              <b>Test Data:</b> {tc.data}
            </p>
            <p>
              <b>Test Script:</b> {tc.script}
            </p>
            <p>
              <b>Date Added:</b> {tc.date_added}
            </p>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(i)} className={styles.iconBtn}>
                <div className={styles.iconContainer}>
                  <Image
                    src={editIcon}
                    alt="Edit"
                    width={25}
                    height={25}
                    draggable="false"
                    unoptimized
                  />
                </div>
              </button>
              <button onClick={() => handleDelete(i)} className={styles.iconBtn}>
                <div className={styles.iconContainer}>
                  <Image
                    src={deleteIcon}
                    alt="Delete"
                    width={25}
                    height={25}
                    draggable="false"
                    unoptimized
                  />
                </div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
