import React, { useEffect, useState } from 'react';
import { db } from '../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Form } from 'react-bootstrap';

const UpdateUserDetails = () => {
    const { userId } = useParams(); // Fetch user ID from the URL parameters
    const [userDetails, setUserDetails] = useState({
        name: '',
        mobile: '',
        loanAmount: '',
        agent: '',
        agentMobile: '',
        totalPaid: '',
        perDayEmi: '',
        totalDays: '',
    });

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const userDoc = await getDoc(doc(db, 'clients', userId));
                if (userDoc.exists()) {
                    setUserDetails(userDoc.data());
                } else {
                    console.error('No such document!');
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, 'clients', userId);
            await updateDoc(userRef, userDetails); // Update user details in Firestore
            navigate('/'); // Redirect to the home page after successful update
        } catch (error) {
            console.error('Error updating user details:', error);
        }
    };

    const handleCancel = () => {
        navigate('/'); // Navigate to the home page or desired route
    };

    if (loading) return <div>Loading...</div>;
    if (!userDetails) return <div>No user details found.</div>;

    return (
        <div className="container mt-4">
            <h2>Update User Details</h2>
            <Form onSubmit={handleUpdate}>
                <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={userDetails.name || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Mobile</Form.Label>
                    <Form.Control
                        type="text"
                        name="mobile"
                        value={userDetails.mobile || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Loan Amount</Form.Label>
                    <Form.Control
                        type="number"
                        name="loanAmount"
                        value={userDetails.loanAmount || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Agent</Form.Label>
                    <Form.Control
                        type="text"
                        name="agent"
                        value={userDetails.agent || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Agent Mobile</Form.Label>
                    <Form.Control
                        type="text"
                        name="agentMobile"
                        value={userDetails.agentMobile || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Total Paid</Form.Label>
                    <Form.Control
                        type="number"
                        name="totalPaid"
                        value={userDetails.totalPaid || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Per Day EMI</Form.Label>
                    <Form.Control
                        type="number"
                        name="perDayEmi"
                        value={userDetails.perDayEmi || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Total Days</Form.Label>
                    <Form.Control
                        type="number"
                        name="totalDays"
                        value={userDetails.totalDays || ''}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Update Details</Button>
                <Button variant="secondary" onClick={handleCancel} className="ms-2">Cancel</Button>
            </Form>
        </div>
    );
};

export default UpdateUserDetails;
