const {
  addTestGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
} = require("../models/testGroupModel");

const addGroup = (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ message: "Name is required" });

  const date_added = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  addTestGroup({ name, description, date_added }, (err, result) => {
    if (err) {
      console.error("Add group error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    res.status(201).json({ message: "Group added" });
  });
};

const fetchGroups = (req, res) => {
  getAllGroups((err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    res.json(results);
  });
};

const soloFetchGroup = (req, res) => {
  const { id } = req.params;
  getGroupById(id, (err, group) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  });
};

const updateGroupById = (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  if (!name) return res.status(400).json({ message: "Name required" });

  updateGroup(id, { name, description }, (err) => {
    if (err) return res.status(500).json({ message: err.message || "Server error" });
    res.json({ message: "Group updated" });
  });
};

const deleteGroupById = (req, res) => {
  const { id } = req.params;
  deleteGroup(id, (err) => {
    if (err) return res.status(500).json({ message: err.message || "Server error" });
    res.json({ message: "Group deleted" });
  });
};

module.exports = {
  addGroup,
  fetchGroups,
  soloFetchGroup,
  updateGroupById,
  deleteGroupById,
};
