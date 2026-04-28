// FILE: src/utils/notify.js

import toast from "react-hot-toast";
import { CheckCircle, XCircle } from "lucide-react";
import React from "react";

// SUCCESS
export const notifySuccess = (message) => {
  toast.success(message, {
    duration: 20000,
    style: {
      background: "#16a34a",
      color: "white",
      padding: "14px",
      borderRadius: "12px",
      fontWeight: "500",
    },
    icon: React.createElement(CheckCircle, { size: 18 }),
  });
};

// ERROR
export const notifyError = (message) => {
  toast.error(message, {
    duration: 20000,
    style: {
      background: "#dc2626",
      color: "white",
      padding: "14px",
      borderRadius: "12px",
      fontWeight: "500",
    },
    icon: React.createElement(XCircle, { size: 18 }),
  });
};