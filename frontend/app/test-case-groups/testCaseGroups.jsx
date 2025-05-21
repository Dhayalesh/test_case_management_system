"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./testCaseGroups.module.css";
import deleteIcon from "../../public/images/delete.png";
import editIcon from "../../public/images/edit.png";
import Image from "next/image";
import axios from "axios";

export default function TestCaseGroups() {
  const router = useRouter();
  const [groups, setGroups] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchGroups = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/test-case-group-fetch"
      );

      const mappedGroups = res.data.map((g) => ({
        ...g,
        _id: g._id || g.id,
      }));

      setGroups(mappedGroups);
      console.log("Fetched groups:", mappedGroups);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = async () => {
    if (!newGroupName.trim()) return;

    const payload = {
      name: newGroupName,
      description: newGroupDesc,
      date: new Date().toISOString(), // ✅ Current date added
    };

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/test-case-group-update/${editId}`,
          payload
        );
      } else {
        await axios.post("http://localhost:5000/test-case-group-add", payload);
      }

      fetchGroups();
      setNewGroupName("");
      setNewGroupDesc("");
      setEditId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleEdit = async (id) => {
    if (!id) {
      console.error("Edit id missing");
      return;
    }
    try {
      const res = await axios.get(
        `http://localhost:5000/test-case-group-soloFetch/${id}`
      );
      setNewGroupName(res.data.name);
      setNewGroupDesc(res.data.description);
      setEditId(id);
      setShowForm(true);
    } catch (error) {
      console.error("Edit fetch error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!id) {
      console.error("Group id is missing");
      return;
    }
    try {
      const res = await axios.delete(
        `http://localhost:5000/test-case-group-delete/${id}`
      );
      console.log(res.data.message);
      fetchGroups(); // refresh list after delete
    } catch (error) {
      console.error("Delete error:", error.response?.data || error.message);
    }
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
                {editId ? "Update Group" : "Save Group"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditId(null);
                  setNewGroupName("");
                  setNewGroupDesc("");
                }}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className={styles.groupList}>
          {groups.map((group, index) => {
            if (!group._id) {
              console.warn("Missing _id for group:", group);
              return null;
            }

            return (
              <div
                key={group._id}
                className={styles.groupCard}
                onClick={handleNavigate}
              >
                <h3 className={styles.groupTitle}>{group.name}</h3>
                <p>{group.description}</p>
                <p className={styles.date}>
                  Added on:{" "}
                  {group.date_added
                    ? new Date(group.date_added).toLocaleDateString()
                    : "Unknown"}
                </p>

                <div className={styles.actions}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(group._id);
                    }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(group._id);
                    }}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
