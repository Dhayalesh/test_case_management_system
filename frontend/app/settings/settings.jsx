// app/settings/settings.jsx
"use client";

import React, { useState } from "react";
import styles from "./settings.module.css";

const Settings = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Settings</h1>
      <div className={styles.buttonGroup}>
        <button
          className={styles.actionButton}
          onClick={() => {
            setShowPasswordForm(true);
            setShowEmailForm(false);
          }}
        >
          Update Password
        </button>
        <button
          className={styles.actionButton}
          onClick={() => {
            setShowEmailForm(true);
            setShowPasswordForm(false);
          }}
        >
          Update Email
        </button>
      </div>

      {showPasswordForm && (
        <div className={styles.formContainer}>
          <h2>Change Password</h2>
          <input type="password" placeholder="Old Password" />
          <input type="password" placeholder="New Password" />
          <input type="password" placeholder="Confirm New Password" />
          <button className={styles.submitButton}>Update Password</button>
        </div>
      )}

      {showEmailForm && (
        <div className={styles.formContainer}>
          <h2>Change Email</h2>
          <input type="email" placeholder="Old Email" />
          <input type="email" placeholder="New Email" />
          <input type="text" placeholder="Enter OTP" />
          <button className={styles.submitButton}>Update Email</button>
        </div>
      )}
    </div>
  );
};

export default Settings;
