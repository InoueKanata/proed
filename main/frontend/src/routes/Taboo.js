import React from 'react';
import { useState } from 'react';
import { Input,Button, ThemeProvider, Grid, TextField } from '@mui/material';
import Axios from 'axios';
import theme from '../theme';

const Taboo = ({ onFileUpload }) => {
  const [plotFile,setPlotFile] = useState(null);

  const filePathChange=(event)=>{
    setPlotFile(event.target.files[0]);
  }
  const onUpload =()=>{
    if (plotFile){
      onFileUpload(plotFile);
    }
  }
  const filePathButton = () =>{
    document.getElementById('fileInput').click();
  };
  return (
    <div className="Taboo">
      <h2>禁忌チェック</h2>
      {/* ここに設定画面のコンテンツを追加
      <input type='file' onChange={onFileChnage}/>
      <button onClick={onUpload}>実行</button>
      */}
      <ThemeProvider theme={ theme }>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={8}>
            <TextField
            disabled
            id = "disabladFilePath"
            defaultValue="テキストファイルを選択してください"
            variant='standard'
            />
          </Grid>
          <input
          type= "file"
          id = "fileInput"
          style={{display:'none'}}
          onChange={filePathChange}
          />
          <Grid item xs={12} md={4} lg={4}>
            <Button variant='outlined'onClick={filePathButton}>ファイル選択</Button>
          </Grid>
        </Grid>
      </ThemeProvider>
    </div>

  );
};

export default Taboo;
