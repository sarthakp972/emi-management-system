import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../FirebaseConfig'; // Your Firebase config
import { CustomerContext } from '../Context/CustomerContext';  // Use 'Context' here



const CustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch customer data from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const fetchedCustomers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(fetchedCustomers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider value={{ customers, setCustomers, loading }}>
      {children}
    </CustomerContext.Provider>
  );
};

export default CustomerProvider;
