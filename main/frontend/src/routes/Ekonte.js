import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import theme from '../theme.js';

const Ekonte = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  let temp;
  
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id' 
    },
    {
      title: 'プロジェクト名',
      dataIndex: 'name',
      key: 'name',
      style: { paddingRight: '0' },
    },
    {
      title: '作業するプロジェクトを選択',
      key: 'action',
      render: (text, row) => (
        <Button
          variant="outlined"
          onClick={() => handleButtonClick(row.name)}
          style={{ margin: '0', padding: '6px' }}>
          決定
        </Button>
      ),
      style: { paddingRight: '0' },
    }
  ];

  const fetchFiles = () => {
    axios.get('http://127.0.0.1:5000/get_files')
      .then(response => {
        // サーバーからの応答を処理
        setFiles(response.data);
        console.log(response.data);
        const newFileList = response.data.filter(file => file.includes('.csv')).map((file, index) => ({ id: index + 1, name: file }));
        setFileList(newFileList);
        console.log(newFileList);
      })
      .catch(error => {
        // エラーが発生した場合の処理
        console.error('Error fetching files:', error);
      });
  };

  const handleButtonClick = (name) => {
    console.log(`Button clicked for record with key: ${name}`);
    temp='';
    temp='/ekonte_write?' + name;
    navigate(temp);
  };
  const createButtonClick = () => {
    if (inputValue.trim() === '') {
      return;
    }
    // inputValueをサーバーに送信
    fetch('http://127.0.0.1:5000/create_csv', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: inputValue,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.message); // サーバーからの応答をログに出力（成功した場合のメッセージ）
        fetchFiles();
      })
      .catch(error => {
        console.error('Error:', error); // エラーが発生した場合のログ出力
        // ここでエラー処理を追加
      });
  };
  
  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <h2>禁忌チェック</h2>

      <TableContainer style={{marginLeft: '300px', paddingRight: '30px'}}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key}>
                    {column.title}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {fileList.map((row) => (
              <TableRow key={row.id}>
                {columns.map((column, index) => (
                  <TableCell key={index}>{index === columns.length - 1 ? column.render(null, row) : row[column.dataIndex]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TextField
        label="ファイル名を入力"
        variant="outlined"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <Button variant="outlined" onClick={createButtonClick} disabled={inputValue.trim() === ''}>プロジェクトの新規作成</Button>
    </div>
  );
};

export default Ekonte;