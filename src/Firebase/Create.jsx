import React, { useState } from 'react';
import { db } from '../FirebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function Create() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const customerData = [
    {
      name: 'Yash Nema',
      mobile: '7898072076',
      loanAmount: 25000,
      agent: 'Sumit',
      agentMobile: '9754872256',
      totalPaid: 1800,
      perDayEmi: 250,
      totalDays: 182,
      emis: [
        { date: '2024-09-01', amount: 1200 },
        { date: '2024-09-02', amount: 600 },
      ],
    },
    {
      name: 'Shrikant Sahu',
      mobile: '787940',
      loanAmount: 100000,
      agent: 'Yash',
      agentMobile: '9754872256000',
      totalPaid: 50600,
      perDayEmi: 250,
      totalDays: 182,
      emis: [
        { date: '2024-09-01', amount: 250 },
        { date: '2024-09-02', amount: 250 },
      ],
    },
  ];

  const handleCreateCollection = async () => {
    setLoading(true);
    setMessage('');
    const collectionName = 'clients';

    try {
      const promises = customerData.map((customer) =>
        addDoc(collection(db, collectionName), {
          ...customer,
          createdAt: new Date()
        })
      );

      await Promise.all(promises);

      setMessage(`✅ ${customerData.length} customers added to "${collectionName}" collection.`);
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to add customers.');
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4">
      <h2>📁 Create Firestore Collection</h2>
      <button className="btn btn-primary" onClick={handleCreateCollection} disabled={loading}>
        {loading ? 'Adding...' : 'Add Customer Data'}
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
