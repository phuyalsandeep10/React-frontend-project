import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [inputData, setInputData] = useState('');
    const [storedData, setStoredData] = useState([]);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchData(); // Initial fetch when component mounts
        const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

        return () => clearInterval(interval); // Clean up interval on component unmount
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getdata`);
            setStoredData(response.data);
            setError('');
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again later.');
        }
    };

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!inputData.trim()) {
            setError('Input is empty. Please provide valid data.');
            setSuccessMessage('');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/storedata`, { data: inputData });
            setSuccessMessage('Data stored successfully.');
            setInputData(''); // Clear input field after successful submission
            fetchData(); // Fetch updated data after submission
            setError('');
        } catch (err) {
            console.error('Error storing data:', err);
            setError('Failed to store data. Please try again later.');
            setSuccessMessage('');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/deletedata/${id}`);
            setSuccessMessage('Data deleted successfully.');
            fetchData(); // Fetch updated data after deletion
            setError('');
        } catch (err) {
            console.error('Error deleting data:', err);
            setError('Failed to delete data. Please try again later.');
            setSuccessMessage('');
        }
    };

    return (
        <div className="app-container">
            <h1>Store and Fetch Data Example</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputData}
                    onChange={handleInputChange}
                    placeholder="Enter data to store"
                    className="input-field"
                />
                <button type="submit" className="store-button">Store Data</button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}
            <h2>Stored Data:</h2>
            <div className="data-grid">
                {storedData.map((item) => (
                    <div key={item.id} className="data-item">
                        <p>{item.data}</p>
                        <button onClick={() => handleDelete(item.id)} className="delete-button">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
