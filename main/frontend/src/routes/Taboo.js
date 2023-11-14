import React from 'react';
import { useState } from 'react';
import { Input,Button, ThemeProvider, Grid, TextField, Container, Box, Table, TableContainer, Paper, TableCell, TableHead, TableBody, Tab } from '@mui/material';
import Axios from 'axios';
import theme from '../theme';

const Taboo = ({ onFileUpload }) => {
  const [plotFile,setPlotFile] = useState(null);
  const [fileContent,setFileContent] = useState('テキストファイルを選択してください')

  const filePathChange=(event)=>{
    const selectedPlotFile=event.target.files[0];
    if (event){
      setFileContent(selectedPlotFile.name);
      setPlotFile(selectedPlotFile)
    }
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
        <Box component="main" sx ={{flexGrow:1,p:3,marginLeft:60}}>
          <Container maxWidth="lg" component={Paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8} lg={8} >
                <TextField
                fullWidth
                id = "readOnlyFilePath"
                variant='standard'
                value={fileContent}
                InputProps={{
                readOnly:true,
                }}
                />
              </Grid>
              <input
              type= "file"
              id = "fileInput"
              style={{display:'none'}}
              onChange={filePathChange}
              />
              <Grid item xs={12} md={2} lg={2}  >
                <Button variant='outlined'onClick={filePathButton} >　　ファイル選択　　</Button>
              </Grid>
              <Grid item xs={12} md={2} lg={2} >
                <Button variant='outlined'onClick={onUpload}>　　　　実行　　　　</Button>
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth="lg" component={Paper} spacing={3} style={{marginTop:50}}>
            <Grid>
              <TableContainer >
                  <Table >
                    <TableHead>
                      <TableCell align='right'>No.</TableCell>
                      <TableCell align='right'>検出禁忌</TableCell>
                      <TableCell align='right'>概要</TableCell>
                      <TableCell align='right'>改善案</TableCell>
                    </TableHead>
                  </Table>
                  {/* <TableBody>
                    <TableCall align="right">{}</TableCall>
                    <TableCall align="right">{}</TableCall>
                    <TableCall align="right">{}</TableCall>
                    <TableCall align="right">{}</TableCall>
                  </TableBody> */}
              </TableContainer>
            </Grid>
          </Container>
          <Container maxWidth='lg'  style={{marginTop:30}}>
            <Grid item xs={12} md={2} lg={2}  >
              <Button variant='outlined' fullWidth>　　プロット再生成&ダウンロード　　</Button>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </div>

  );
};

export default Taboo;
