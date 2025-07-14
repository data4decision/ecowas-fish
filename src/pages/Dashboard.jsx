import React, { useEffect, useState } from "react";
import WelcomeSummary from "../components/WelcomeSummary";
import { getCountrySummaryData } from "../utils/getCountrySummaryData";
import fisheriesData from "../data/fisheriesData.json";

import { db } from "../firebase/firebase";
import { collection, query, getDocs } from "firebase/firestore";

const Dashboard = ({ user }) => {
  const [uploadHistory, setUploadHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMetadata = async (countryCode, summaryData) => {
    try {
      console.log("📥 Fetching Firestore data for:", countryCode);
      const uploadRef = collection(db, "uploads", countryCode.toLowerCase(), "records");
      const q = query(uploadRef);
      const snapshot = await getDocs(q);

      const dates = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (data?.uploadedAt?.toDate) {
          dates.push(data.uploadedAt.toDate().toISOString());
        }
      });

      return {
        ...summaryData,
        uploadDates: dates,
        downloadDates: dates,
      };
    } catch (err) {
      console.error("❌ Firestore read error:", err.message);
      setError("You do not have permission to view dashboard data for this country.");
      return {
        ...summaryData,
        uploadDates: [],
        downloadDates: [],
      };
    }
  };

  useEffect(() => {
    if (!user?.country) {
      setError("Invalid user country.");
      setLoading(false);
      return;
    }

    const summary = getCountrySummaryData(user.country, fisheriesData);
    if (!summary) {
      setError("Country summary not found.");
      setLoading(false);
      return;
    }

    fetchMetadata(user.country, summary).then((fullData) => {
      setUploadHistory(fullData);
      setLoading(false);
    });
  }, [user]);

  return (
    <div className="p-4">
      {error ? (
        <div className="text-red-600 text-sm font-medium bg-red-100 border border-red-300 p-4 rounded">
          {error}
        </div>
      ) : (
        <WelcomeSummary
          user={user}
          uploadHistory={uploadHistory}
          reportTypes={uploadHistory?.reportTypes || []}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Dashboard;
