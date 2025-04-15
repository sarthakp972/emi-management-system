import React, { useContext, useState, useEffect } from 'react'; 
import { CustomerContext } from '../Context/CustomerContext'; 
import { db } from '../FirebaseConfig'; 
import { doc, deleteDoc, getDocs, updateDoc, collection } from 'firebase/firestore'; 
import { Button, Table, Modal, Accordion } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; // Optional, for displaying notifications

const AdminOnly = () => { 
    const { customers, setCustomers, loading } = useContext(CustomerContext); 
    const [showModal, setShowModal] = useState(false); 
    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [showEditModal, setShowEditModal] = useState(false);
    const [editedEmiAmount, setEditedEmiAmount] = useState('');
    const [selectedEmi, setSelectedEmi] = useState(null); 
    const navigate = useNavigate(); 

    useEffect(() => { 
        fetchCustomers(); 
    }, []); 

    const fetchCustomers = async () => { 
        try {
            const customersSnapshot = await getDocs(collection(db, 'clients')); 
            const customerList = customersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setCustomers(customerList); 
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    const handleDelete = async (id) => { 
        try { 
            await deleteDoc(doc(db, 'clients', id)); 
            setCustomers(customers.filter(customer => customer.id !== id)); 
            toast.success("Customer deleted successfully!"); // Optional notification
        } catch (error) { 
            console.error('Error deleting customer:', error);
            toast.error("Error deleting customer."); // Optional notification
        } 
    }; 

    const openModal = (customer) => { 
        setSelectedCustomer(customer); 
        setShowModal(true); 
    }; 

    const openEditModal = (emi) => {
        setEditedEmiAmount(emi.amount); 
        setSelectedEmi(emi); 
        setShowEditModal(true);
    };

    const handleUpdateEmi = async () => {
        if (!selectedCustomer) return;

        try {
            const customerRef = doc(db, 'clients', selectedCustomer.id);
            const updatedEmis = selectedCustomer.emis.map(item => 
                item.date === selectedEmi.date ? { ...item, amount: Number(editedEmiAmount) } : item
            );

            await updateDoc(customerRef, { emis: updatedEmis });
            const newTotalPaid = updatedEmis.reduce((acc, emi) => acc + (emi.amount || 0), 0);
            await updateDoc(customerRef, { totalPaid: newTotalPaid });

            fetchCustomers();
            setShowEditModal(false);
            toast.success("EMI updated successfully!"); // Optional notification
        } catch (error) {
            console.error('Error updating EMI:', error);
            toast.error("Error updating EMI."); // Optional notification
        }
    };

    const handleAddNewCustomer = () => { 
        navigate('/add-new'); 
    }; 

    const handleUpdateCustomer = (id) => {
        navigate(`/user-update/${id}`); // Redirect to user update page with customer ID
    };

    const formatDate = (dateString) => {
        const options = { 
            day: 'numeric', 
            month: 'numeric', 
            year: 'numeric', 
            hour: 'numeric', 
            minute: 'numeric', 
            hour12: true 
        };
        return new Date(dateString).toLocaleString('en-GB', options).replace(',', '');
    };

    return (
        <div className="container mt-5"> 
            <h3>Admin - Customer Management</h3>
            <div className="mb-4"> 
                <Button variant="primary" onClick={handleAddNewCustomer}>Add New Customer</Button> 
            </div> 

            {loading ? <p>Loading...</p> : ( 
                <Table striped bordered responsive> 
                    <thead> 
                        <tr> 
                            <th>Name</th> 
                            <th>Mobile</th> 
                            <th>Loan</th> 
                            <th>Agent</th> 
                            <th>Total Paid</th> 
                            <th>Per Day EMI</th> 
                            <th>Total Days</th> 
                            <th>EMI History</th> 
                            <th>Actions</th> 
                        </tr> 
                    </thead> 
                    <tbody> 
                        {customers.map((customer) => ( 
                            <tr key={customer.id}> 
                                <td>{customer.name}</td> 
                                <td>{customer.mobile}</td> 
                                <td>{customer.loanAmount}</td> 
                                <td>{customer.agent}</td> 
                                <td>{customer.totalPaid}</td> 
                                <td>{customer.perDayEmi}</td> 
                                <td>{customer.totalDays}</td> 
                                <td> 
                                    <Accordion> 
                                        <Accordion.Item eventKey="0"> 
                                            <Accordion.Header>View EMI</Accordion.Header> 
                                            <Accordion.Body> 
                                                <Button variant="info" onClick={() => openModal(customer)}>Open EMI History</Button> 
                                            </Accordion.Body> 
                                        </Accordion.Item> 
                                    </Accordion> 
                                </td> 
                                <td> 
                                    <Button variant="danger" onClick={() => handleDelete(customer.id)} className="me-2">Delete</Button> 
                                    <Button variant="warning" onClick={() => handleUpdateCustomer(customer.id)}>Update Details</Button> {/* Redirect here */}
                                </td> 
                            </tr> 
                        ))} 
                    </tbody> 
                </Table> 
            )} 

            {/* EMI Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered> 
                <Modal.Header closeButton> 
                    <Modal.Title>EMI History for {selectedCustomer?.name}</Modal.Title> 
                </Modal.Header> 
                <Modal.Body> 
                    {selectedCustomer?.emis?.length > 0 ? ( 
                        <Table striped bordered responsive> 
                            <thead> 
                                <tr> 
                                    <th>#</th> 
                                    <th>Date</th> 
                                    <th>Amount</th> 
                                    <th>Actions</th>
                                </tr> 
                            </thead> 
                            <tbody> 
                                {selectedCustomer.emis.map((emi, index) => ( 
                                    <tr key={index}> 
                                        <td>{index + 1}</td> 
                                        <td>{formatDate(emi.date)}</td> 
                                        <td>₹{emi.amount}</td> 
                                        <td>
                                            <Button variant="success" onClick={() => openEditModal(emi)}>Edit</Button>
                                        </td>
                                    </tr> 
                                ))} 
                            </tbody> 
                        </Table> 
                    ) : <p>No EMI records available.</p>} 
                </Modal.Body> 
                <Modal.Footer> 
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button> 
                </Modal.Footer> 
            </Modal> 

            {/* Edit EMI Modal */} 
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit EMI Amount</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        type="number" 
                        value={editedEmiAmount} 
                        onChange={(e) => setEditedEmiAmount(e.target.value)} 
                        placeholder="Enter new amount" 
                        className="form-control"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdateEmi}>Save Changes</Button> 
                </Modal.Footer>
            </Modal>
        </div> 
    ); 
}; 

export default AdminOnly; 
