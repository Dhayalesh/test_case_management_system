"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const BASE_URL = "http://localhost:5000";

export default function Dashboard() {
  const [chartData, setChartData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const response = await fetch(`${BASE_URL}/test-execution-fetch`);
        const data = await response.json();

        // Generate last 5 calendar dates dynamically
        const today = new Date();
        const lastFiveDays = Array.from({ length: 5 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(" ", "-");
        }).reverse(); // Reverse to get chronological order

        // Map API data and ensure all dates exist
        const executionMap = data.reduce((acc, { date_executed, status }) => {
          const formattedDate = new Date(date_executed).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(" ", "-");
          if (!acc[formattedDate]) {
            acc[formattedDate] = { date: formattedDate, pass: 0, fail: 0 };
          }
          acc[formattedDate][status === "Pass" ? "pass" : "fail"] += 1;
          return acc;
        }, {});

        // Ensure all last 5 dates exist in final chart data
        const formattedData = lastFiveDays.map(date => executionMap[date] || { date, pass: 0, fail: 0 });

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching test executions:", error);
      }
    };

    fetchExecutions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    router.replace("/login");
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Test Case Management System</h1>

      <div className={styles.buttonRow}>
        <button className={styles.testCases} onClick={() => router.push("/test-case-groups")}>Test Cases</button>
        <button className={styles.runTestCase} onClick={() => router.push("/run-test-cases")}>Run Test Case</button>
        <button className={styles.testResults} onClick={() => router.push("/test-results")}>Test Results</button>
        <button className={styles.settings} onClick={() => router.push("/settings")}>Settings</button>
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </div>

      <div className={styles.chartWrapper}>
        <h3 className={styles.chartTitle}>Test Execution Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="pass" stroke="#22c55e" name="Passed" />
            <Line type="monotone" dataKey="fail" stroke="#ef4444" name="Failed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
