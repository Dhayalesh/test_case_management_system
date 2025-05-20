"use client";
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

export default function Dashboard() {
  
  const chartData = [
    { date: "May 15", pass: 10, fail: 2 },
    { date: "May 16", pass: 12, fail: 1 },
    { date: "May 17", pass: 8, fail: 4 },
    { date: "May 18", pass: 15, fail: 0 },
    { date: "May 19", pass: 11, fail: 3 },
  ];
  const handleLogout = () => {
  localStorage.removeItem("loggedIn");
  router.replace("/login"); 
};

const router = useRouter();

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Test Case Management System</h1>

      <div className={styles.buttonRow}>
        <button className={styles.testCases} onClick={() => router.push('/test-case-groups')}>Test Cases</button>
        <button className={styles.runTestCase} onClick={() => router.push('/run-test-cases')}>Run Test Case</button>
        <button className={styles.testResults}>Test Results</button>
        <button className={styles.settings} onClick={() => router.push('/settings')}>Settings</button>
        <button className={styles.logout} onClick={handleLogout}>
          Logout
        </button>
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
