import axios from 'axios';
import React, { useState, useEffect } from 'react';

const HistoryScoreWindow = (user) => {
    // State hooks for managing game history and loading status
    const [historyScores, setHistoryScores] = useState([]); // Stores example history scores
    const [loading, setLoading] = useState(true);

    // State hooks for pagination
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    // State for paginating history scores
    const [currentHistoryPage, setCurrentHistoryPage] = useState(0);
    const [paginatedHistoryScores, setPaginatedHistoryScores] = useState([]);

    // State for paginating all player scores
    const [currentAllPlayerPage, setCurrentAllPlayerPage] = useState(0);
    const [paginatedAllPlayerScores, setPaginatedAllPlayerScores] = useState([]);

    // Handles the deletion of a score
    const handleDeleteScore = (index, id) => {
        const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/removeGameRecordById?id=${id}`;
        axios.post(url)
        .then(response => {
            setHistoryScores(prevScores => prevScores.filter((_, i) => i !== index));
        })
        .catch(error => {
            console.error("Error:", error.message);
        });
    };

    // Fetches game records by the user's Google ID
    function findGameRecordsByGoogleId() {
        const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/findGameRecordsByGoogleId?googleId=${user.googleId}`;
        axios.get(url)
          .then(response => {
            setHistoryScores(response.data);
            paginateHistoryData(response.data, 0);
          })
          .catch(error => {
            console.error("Error:", error.message);
          });
    };

    // Async function to fetch data with pagination
    const fetchData = async (page = 0) => {
        try {
            const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/findGameRecordsOrderByScoreDesc?page=${page}&size=${pageSize}`;
            const response = await axios.get(url);
            const records = response.data.content;
            setPaginatedAllPlayerScores(records); // Directly set to the current page data fetched from backend

            // Fetching user information associated with each game record
            const recordsWithUserInfo = await Promise.all(records.map(async record => {
                const userInfoResponse = await axios.get(`https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/findUserInfoByGoogleId?googleId=${record.googleId}`);
                return {
                    ...record,
                    userName: userInfoResponse.data[0].userName // Assuming 'userName' field is present in returned user info
                };
            }));

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handles page changes for the history scores
    const handleHistoryPageChange = (newPage) => {
        setCurrentHistoryPage(newPage);
        paginateHistoryData(historyScores, newPage);
    };

    // Handles page changes for all player scores
    const handleAllPlayerPageChange = (newPage) => {
        setCurrentAllPlayerPage(newPage);
        fetchData(newPage); // The fetchData function should be updated to use currentAllPlayerPage
    };

    // Implements pagination logic for history scores
    function paginateHistoryData(fullList, page) {
        const startIndex = page * pageSize;
        const paginatedList = fullList.slice(startIndex, startIndex + pageSize);
        setPaginatedHistoryScores(paginatedList);
    }

    // useEffect hook to fetch game records by Google ID and load the first page of data
    useEffect(() => {
        findGameRecordsByGoogleId();
        fetchData(0); // Load the first page of data
    }, []);

    // Conditional rendering for loading state
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h2>History Scores</h2>
            <ul>
                {paginatedHistoryScores.map((item, index) => (
                    <li key={index}>Date:{item.date} Score:{item.score} <button onClick={() => handleDeleteScore(index,item.id)}>Delete</button></li>
                ))}
            </ul>
            <div>
                <button onClick={() => handleHistoryPageChange(currentHistoryPage - 1)} disabled={currentHistoryPage === 0}>Previous</button>
                <span>Page {currentHistoryPage + 1}</span>
                <button onClick={() => handleHistoryPageChange(currentHistoryPage + 1)}>Next</button>
            </div>

            <h2>All Player Scores</h2>
            <ul>
                {paginatedAllPlayerScores.map((item, index) => (
                    <li key={index}>UserName:{item.userName} Date:{item.date} Score:{item.score}</li>
                ))}
            </ul>
            <div>
                <button onClick={() => handleAllPlayerPageChange(currentAllPlayerPage - 1)} disabled={currentAllPlayerPage === 0}>Previous</button>
                <span>Page {currentAllPlayerPage + 1}</span>
                <button onClick={() => handleAllPlayerPageChange(currentAllPlayerPage + 1)}>Next</button>
            </div>
        </div>
    );
};

export default HistoryScoreWindow;
