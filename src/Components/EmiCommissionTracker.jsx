import React, { useEffect, useState, useContext } from 'react';
import { CustomerContext } from '../Context/CustomerContext';

const EmiCollectionTable = () => {
  const { customers } = useContext(CustomerContext);
  const [filteredData, setFilteredData] = useState([]);
  const [totalCollection, setTotalCollection] = useState(0);

  // Get today's date in YYYY-MM-DD format
  const todayDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    let total = 0;
    const result = [];

    customers.forEach((customer) => {
      if (customer.emis) {
        customer.emis.forEach((emi) => {
          if (emi.date === todayDate) {
            total += emi.amount;
            result.push({
              name: customer.name || 'N/A',
              phone: customer.phone || 'N/A',
              amount: emi.amount,
              date: emi.date,
            });
          }
        });
      }
    });

    setFilteredData(result);
    setTotalCollection(total);
  }, [customers]);

  return (
    <div className="container mt-4">
      <h2>Today’s EMI Collection ({todayDate})</h2>

      {filteredData.length > 0 ? (
        <>
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Collected Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.phone}</td>
                  <td>₹{item.amount}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h5>Total Collection Today: ₹{totalCollection}</h5>
        </>
      ) : (
        <p>No collections found for today.</p>
      )}
    </div>
  );
};

export default EmiCollectionTable;
