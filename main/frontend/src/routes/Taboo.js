import React from 'react';
import { useState } from 'react';
import {Button, ThemeProvider, Grid, TextField, Container, Box, Table, TableContainer, Paper, TableCell, TableHead, TableBody,  CssBaseline, TableRow } from '@mui/material';
import axios from 'axios';
import theme from '../theme';
import { useNavigate } from 'react-router-dom';

const Taboo = () => {
  const navi = useNavigate();
  const [plotFile,setPlotFile] = useState(null);
  const [fileContent,setFileContent] = useState('テキストファイルを選択してください')
  const [checkedData,setCheckedData]= useState([])

  const filePathChange=(event)=>{
    const selectedPlotFile=event.target.files[0];
    if (event){
      setFileContent(selectedPlotFile.name);
      setPlotFile(selectedPlotFile)
    }
  }
  const filePathButton = () =>{
    document.getElementById('fileInput').click();
  };

  const onFileUpload = () =>{
    console.log(plotFile)

    const plotData = new FormData();
    plotData.append('file',plotFile);
    // postの中にurlを記入
    axios.post('/plotFile',plotData)
    .then((response) => {
      console.log('file upload done',response.data);
      setCheckedData(response.data)
    })
    .catch((error)=>{
      console.log('error',error);
    });
  };

  const toTabooDownload = () =>{
    navi('/TabooDownload')
  };
  return (
    <div className="Taboo">
      <h2>禁忌チェック</h2>
      <ThemeProvider theme={ theme }>
        <CssBaseline/>
        <Box component="main" sx ={{flexGrow:1,p:3,marginLeft:60}}>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
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
                <Button variant='outlined'onClick={filePathButton} fullWidth>ファイル選択</Button>
              </Grid>
              <Grid item xs={12} md={2} lg={2} >
                <Button variant='outlined'onClick={onFileUpload} fullWidth>実行</Button>
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={6}>
                <TableContainer >
                    <Table >
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: '10%' }} align='right'>No.</TableCell>
                          <TableCell style={{ width: '30%' }} align='right'>検出禁忌</TableCell>
                          <TableCell style={{ width: '30%' }} align='right'>概要</TableCell>
                          <TableCell style={{ width: '30%' }} align='right'>改善案</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                      {checkedData.map((data) => (
                        <TableRow key={data.id}>
                          <TableCell style={{ width: '10%' }} align="right">{data.id}</TableCell>
                          <TableCell style={{ width: '30%' }} align="right">{data.taboo}</TableCell>
                          <TableCell style={{ width: '30%' }} align="right">{data.summary}</TableCell>
                          <TableCell style={{ width: '30%' }} align="right">{data.plan}</TableCell>
                        </TableRow>
                      ))}
                      </TableBody>
                    </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
              <TextField
              inputProps={{
                readOnly:true,
              }}
              fullWidth
              id = "readOnlyTabooText"
              // value={}
              variant='outlined'
              label='検出された禁忌'
              >
              </TextField>
            </Grid>
            </Grid>
          </Container>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
            <Grid item xs={12} md={12} lg={12}>
              <Button variant='outlined' fullWidth onClick={toTabooDownload}>チェックのついた改善案を適用して確認</Button>
            </Grid>
          </Container>
        </Box>
      </ThemeProvider>
    </div>

  );
};

export default Taboo;
