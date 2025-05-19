"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./testCaseGroups.module.css";
import deleteIcon from "../../public/images/delete.png";
import editIcon from "../../public/images/edit.png";
import Image from "next/image";

export default function TestCaseGroups() {
  const router = useRouter();

  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "User Authentication",
      description: "Covers login and registration.",
      date: "01/05/2025",
    },
    {
      id: 2,
      name: "Payment Processing",
      description: "Includes all payment-related test cases.",
      date: "05/05/2025",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddGroup = () => {
    if (!newGroupName.trim()) return;

    const currentDate = new Date().toLocaleDateString();

    const newGroup = {
      name: newGroupName,
      description: newGroupDesc,
      date: currentDate,
    };

    if (editIndex !== null) {
      const updated = [...groups];
      updated[editIndex] = { ...newGroup, date: groups[editIndex].date };
      setGroups(updated);
      setEditIndex(null);
    } else {
      setGroups([...groups, newGroup]);
    }

    setNewGroupName("");
    setNewGroupDesc("");
    setShowForm(false);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    setNewGroupName(groups[index].name);
    setNewGroupDesc(groups[index].description);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    const updated = groups.filter((_, i) => i !== index);
    setGroups(updated);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditIndex(null);
    setNewGroupName("");
    setNewGroupDesc("");
  };

  const handleNavigate = () => {
    router.push("/test-case-details");
  };

  return (
    <div className={styles.overallContainer}>
      <div className={styles.container}>
        <h2 className={styles.title}>Test Case Groups</h2>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className={styles.addBtn}>
            Add Group
          </button>
        )}

        {showForm && (
          <div className={styles.form}>
            <input
              type="text"
              placeholder="Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={newGroupDesc}
              onChange={(e) => setNewGroupDesc(e.target.value)}
            ></textarea>
            <div className={styles.formActions}>
              <button onClick={handleAddGroup} className={styles.saveBtn}>
                {editIndex !== null ? "Update Group" : "Save Group"}
              </button>
              <button onClick={handleCancel} className={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.groupList} onClick={handleNavigate}>
          {groups.map((group, index) => (
            <div key={index} className={styles.groupCard}>
              <h3 className={styles.groupTitle}>
                {group.name}
              </h3>
              <p>{group.description}</p>
              <p className={styles.date}>Added on: {group.date}</p>
              <div className={styles.actions}>
                <button
                  onClick={() => handleEdit(index)}
                  className={styles.iconBtn}
                  aria-label="Edit group"
                >
                  <Image
                    src={editIcon}
                    alt="Edit"
                    width={25}
                    height={25}
                    draggable="false"
                  />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className={styles.iconBtn}
                  aria-label="Delete group"
                >
                  <Image
                    src={deleteIcon}
                    alt="Delete"
                    width={25}
                    height={25}
                    draggable="false"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
