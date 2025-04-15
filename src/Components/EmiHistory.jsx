import React, { useContext, useEffect, useState } from 'react';
import { CustomerContext } from '../Context/CustomerContext';

// Function to format date in "Day-Month-Year" format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options).replace(/,/g, '');  // This removes the comma
};

const EmiHistory = () => {
  const { customers } = useContext(CustomerContext);
  const [emiByDate, setEmiByDate] = useState({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [searchDate, setSearchDate] = useState('');
  const [filteredEmiByDate, setFilteredEmiByDate] = useState({});

  useEffect(() => {
    const tempEmiByDate = {};
    let totalCollection = 0;

    customers.forEach((customer) => {
      if (customer.emis) {
        customer.emis.forEach((emi) => {
          const formattedDate = formatDate(emi.date); // Format the date

          if (!tempEmiByDate[formattedDate]) {
            tempEmiByDate[formattedDate] = {
              entries: [],
              total: 0,
            };
          }

          tempEmiByDate[formattedDate].entries.push({
            name: customer.name,
            mobile: customer.mobile,
            amount: emi.amount,
          });

          tempEmiByDate[formattedDate].total += emi.amount;
          totalCollection += emi.amount;
        });
      }
    });

    setEmiByDate(tempEmiByDate);
    setFilteredEmiByDate(tempEmiByDate); // Set filtered data as the full data initially
    setGrandTotal(totalCollection);
  }, [customers]);

  const handleSearch = (e) => {
    const input = e.target.value.toLowerCase();
    setSearchDate(e.target.value);
  
    const filtered = Object.keys(emiByDate)
      .filter(date => date.toLowerCase().includes(input)) // case-insensitive comparison
      .reduce((obj, key) => {
        obj[key] = emiByDate[key];
        return obj;
      }, {});
  
    setFilteredEmiByDate(filtered);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3 fw-bold">📅 EMI Collection History</h2>

      {/* Search Form */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Date (e.g., 2-Sep-2024)"
          value={searchDate}
          onChange={handleSearch}
        />
      </div>

      {/* Move Total to Top */}
      <div className="alert alert-success mb-4 fw-bold">
        💰 Total Collection Till Now: ₹{grandTotal}
      </div>

      {/* Accordion */}
      <div className="accordion" id="emiAccordion">
        {Object.keys(filteredEmiByDate)
          .sort((a, b) => new Date(b) - new Date(a)) // recent first
          .map((date, index) => (
            <div className="accordion-item" key={index}>
              <h2 className="accordion-header" id={`heading${index}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded="false"
                  aria-controls={`collapse${index}`}
                >
                  {date} || Total: ₹{filteredEmiByDate[date].total}
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                className="accordion-collapse collapse"
                aria-labelledby={`heading${index}`}
                data-bs-parent="#emiAccordion"
              >
                <div className="accordion-body p-0">
                  <table className="table table-bordered table-striped mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Mobile</th>
                        <th>EMI Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmiByDate[date].entries.map((entry, idx) => (
                        <tr key={idx}>
                          <td>{entry.name}</td>
                          <td>{entry.mobile}</td>
                          <td>₹{entry.amount}</td>
                        </tr>
                      ))}
                      <tr className="fw-bold table-secondary">
                        <td colSpan="2" className="text-end">Total</td>
                        <td>₹{filteredEmiByDate[date].total}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default EmiHistory;
