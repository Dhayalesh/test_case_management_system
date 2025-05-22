const testCaseModel = require("../models/testCaseDetailsModels");

const addTestCaseDetail = (req, res) => {
  // Expecting the client to send: groupName, name, description, data, script, addedOn (optional)
  const { groupName, name, description, data, script, addedOn } = req.body;
  if (!groupName)
    return res.status(400).json({ error: "Group name required" });

  const testCase = {
    test_case_name: name,
    description: description,
    test_script: script,
    // Use provided addedOn or default to today's date (YYYY-MM-DD)
    date_added: addedOn || new Date().toISOString().slice(0, 10),
    test_data: data,
  };

  testCaseModel.addTestCase(groupName, testCase, (err, result) => {
    if (err) {
      console.error("Server Add Error:", err);
      return res.status(500).json({ error: err.message || err });
    }
    // Return a response with a consistent key "date_added"
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      script,
      data,
      date_added: testCase.date_added // Use the consistent key here!
    });
  });
};

const getAllTestCaseDetails = (req, res) => {
  const groupName = req.query.groupName;
  if (!groupName)
    return res.status(400).json({ error: "Group name required" });

  testCaseModel.getTestCases(groupName, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Map database rows to the keys the client expects.
    const formatted = results.map(tc => ({
      _id: tc.id,
      name: tc.test_case_name,
      description: tc.description,
      script: tc.test_script,
      data: tc.test_data, // Map test_data as data
      date_added: tc.date_added
        ? new Date(tc.date_added).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    }));

    res.json(formatted);
  });
};

const getSingleTestCaseDetail = (req, res) => {
  const { id } = req.params;
  const { groupName } = req.query;
  if (!groupName)
    return res.status(400).json({ error: "Group name required" });

  testCaseModel.getTestCaseById(groupName, id, (err, testCase) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!testCase)
      return res.status(404).json({ error: "Test case not found" });

    const formatted = {
      _id: testCase.id,
      name: testCase.test_case_name,
      description: testCase.description,
      script: testCase.test_script,
      data: testCase.test_data,
      date_added: testCase.date_added
        ? new Date(testCase.date_added).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10)
    };

    res.json(formatted);
  });
};

const updateTestCaseDetail = (req, res) => {
  const { id } = req.params;
  const { groupName, name, description, data, script } = req.body;
  if (!groupName)
    return res.status(400).json({ error: "Group name required" });

  const testCase = {
    test_case_name: name,
    description: description,
    test_script: script,
    test_data: data,
  };

  testCaseModel.updateTestCase(groupName, id, testCase, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, name, description, script, data });
  });
};

const deleteTestCaseDetail = (req, res) => {
  const { id } = req.params;
  const { groupName } = req.query;
  if (!groupName)
    return res.status(400).json({ error: "Group name required" });

  testCaseModel.deleteTestCase(groupName, id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(204).send();
  });
};

module.exports = {
  addTestCaseDetail,
  getAllTestCaseDetails,
  getSingleTestCaseDetail,
  updateTestCaseDetail,
  deleteTestCaseDetail,
};
