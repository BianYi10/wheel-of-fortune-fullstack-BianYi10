import axios from 'axios';
import React, { useState, useEffect } from 'react';

const HistoryScoreWindow = (user) => {
    const [historyScores, setHistoryScores] = useState([]); // 示例历史分数
    const [allPlayerScores, setAllPlayerScores] = useState([]); // 示例所有玩家分数
    const [loading, setLoading] = useState(true);

    // 分页相关的状态定义
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [paginatedScores, setPaginatedScores] = useState([]);
    // 历史分数的分页状态
    const [currentHistoryPage, setCurrentHistoryPage] = useState(0);
    const [paginatedHistoryScores, setPaginatedHistoryScores] = useState([]);

    // 所有玩家分数的分页状态
    const [currentAllPlayerPage, setCurrentAllPlayerPage] = useState(0);
    const [paginatedAllPlayerScores, setPaginatedAllPlayerScores] = useState([]);



    const handleDeleteScore = (index,id) => {
        console.log("id= ",id);
        const url=`https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/removeGameRecordById?id=${id}`;
        console.log(url);
        const response = axios.post(url)
        .then(response => {
            console.log("response.data= ",response.data);
            setHistoryScores(prevScores => prevScores.filter((_, i) => i !== index));
        })
        .catch(error => {
            console.log("error.message= ",error.message);
        });
    };

    function findGameRecordsByGoogleId() {
        console.log("googleId= ",user.googleId);
        const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/findGameRecordsByGoogleId?googleId=${user.googleId}`;
        console.log(url);
        axios.get(url)
          .then(response => {
            console.log("response.data= ",response.data);
            setHistoryScores(response.data);

            paginateHistoryData(response.data, 0);
            //const fullList = response.data; // 假设这里是您获取的完整列表
            //paginateData(fullList);
          })
          .catch(error => {
            console.log("error.message= ",error.message);
          });
    };

    //const fetchData = async () => {
    const fetchData = async (page = 0) => {
        try {
            //const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/findGameRecordsOrderByScoreDesc`;
            const url = `https://wheeloffortune-68830.ue.r.appspot.com/api/GameRecords/findGameRecordsOrderByScoreDesc?page=${page}&size=${pageSize}`;
            console.log(url);
            const response = await axios.get(url);
            const records = response.data.content;
            //setAllPlayerScores(response.data.content); // 设置所有玩家分数
            //paginateAllPlayerData(response.data.content, page); // 分页所有玩家分数
            setPaginatedAllPlayerScores(records);// 直接设置为从后端获取的当前页数据

            // 获取与每个游戏记录关联的用户信息
            const recordsWithUserInfo = await Promise.all(records.map(async record => {
                const userInfoResponse = await axios.get(`https://wheeloffortune-68830.ue.r.appspot.com/api/UserInfo/findUserInfoByGoogleId?googleId=${record.googleId}`);
                console.log("userInfoResponse is ",userInfoResponse);
                console.log("userInfoResponse.data.userName is ",userInfoResponse.data.userName);
                return {
                    ...record,
                    userName: userInfoResponse.data[0].userName // 假设返回的用户信息中有 'userName' 字段
                };
            }));

            setAllPlayerScores(recordsWithUserInfo);
        } catch (error) {
            console.error("Error fetching data: ", error);
        } finally {
            setLoading(false);
        }
    };

    // 处理页码更改
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        findGameRecordsByGoogleId(newPage); // 更新该函数以接受页码作为参数
        fetchData(newPage); // 更新该函数以接受页码作为参数
        findGameRecordsByGoogleId();
    };

    // 实现分页逻辑
    function paginateData(fullList) {
        const startIndex = currentPage * pageSize;
        const paginatedList = fullList.slice(startIndex, startIndex + pageSize);
        setPaginatedScores(paginatedList);
    }

    // 处理历史分数页码更改
    const handleHistoryPageChange = (newPage) => {
        setCurrentHistoryPage(newPage);
        paginateHistoryData(historyScores, newPage);
    };

    // 处理所有玩家分数页码更改
    const handleAllPlayerPageChange = (newPage) => {
        setCurrentAllPlayerPage(newPage);
        fetchData(newPage); // fetchData 函数应更新为使用 currentAllPlayerPage
    };

    // 实现历史分数的分页逻辑
    function paginateHistoryData(fullList, page) {
        const startIndex = page * pageSize;
        const paginatedList = fullList.slice(startIndex, startIndex + pageSize);
        setPaginatedHistoryScores(paginatedList);
    }

    const paginateAllPlayerData = (fullList, page) => {
        const startIndex = page * pageSize; // 计算当前页的起始索引
        const paginatedList = fullList.slice(startIndex, startIndex + pageSize); // 获取当前页的数据
        setPaginatedAllPlayerScores(paginatedList); // 更新状态以显示当前页的数据
    };
    

    useEffect(() => {
        findGameRecordsByGoogleId();
        //fetchData();
        fetchData(0);// 加载第一页
        //handlePageChange(0);
        
    }, []);

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
