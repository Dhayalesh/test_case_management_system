const testExecutionModel = require("../models/runTestCaseModels");

const addExecution = (req, res) => {
  const { group_name, test_case, test_result, status } = req.body;
  if (!group_name || !test_case || !status)
    return res.status(400).json({ error: "Required fields missing" });

  const date_executed = new Date().toISOString().slice(0, 10);
  const execution = { date_executed, group_name, test_case, test_result, status };

  testExecutionModel.addTestExecution(execution, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: "Test execution recorded", id: result.insertId });
  });
};

const fetchExecutions = (req, res) => {
  testExecutionModel.getAllExecutions((err, results) => {
    if (err) return res.status(500).json({ error: "Server error" });
    res.json(results);
  });
};

module.exports = {
  addExecution,
  fetchExecutions,
};
