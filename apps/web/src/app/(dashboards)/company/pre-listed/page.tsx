"use client"
import React, { useState } from 'react';

const Page = () => {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/cv/student/STU002', {
        method: 'GET',
        headers: {
          Accept: 'application/pdf',
        },
      });

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error fetching PDF:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Pre-Listed Interviews</h1>
      <button onClick={handleButtonClick} disabled={loading}>
        {loading ? 'Loading...' : 'View Student CV (PDF)'}
      </button>
      
      {pdfUrl && (
        <div style={{ marginTop: '20px' }}>
          <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Student CV PDF"
            style={{ border: '1px solid #ccc' }}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
