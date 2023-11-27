import React, { useEffect, useState } from 'react';
import {Button, ThemeProvider, Grid, TextField, Container, Box, Paper, CssBaseline, Fab } from '@mui/material';
import theme from '../theme';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import axios from 'axios';
const TabooDownload = () => {
  const navi = useNavigate();
  const location = useLocation();
  const receivedData1 = location.state?.data1 || '';
  const receivedData2 = location.state?.data2 || '';
  const [responseText,setResponseText] = useState('')


  useEffect(() => {
    const fetchData = async() => {
      try{
        const response = await axios.get('/tabooCheck',{
          responseType:'text',
        });
        const jsonString = JSON.stringify(response.data);
        const jsonStringReplace = jsonString.replace(/\\n/g, '\n');
        setResponseText(jsonStringReplace);
        console.log(jsonStringReplace)
        console.log(jsonStringReplace);
      }catch(error){
        console.error('something error',error)
      }
    };
    fetchData();
  },[]);
  
  const onClickDownload = () =>{
    const data = responseText;
    const blob = new Blob([data],{type:'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download','plot.txt');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }

  const toEkonte =()=>{
      navi('/Ekonte')
    }
  return (
    <div className='TabooDownload'>
      <h2>禁忌チェックダウンロード場所</h2>
      <ThemeProvider theme={ theme }>
        <CssBaseline/>
        <Box component="main" sx ={{flexGrow:1,p:3,marginLeft:60}}>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12} lg={12} >
                <TextField
                fullWidth
                multiline
                id = "readOnlyFilePath"
                variant='standard'
                value={receivedData1}
                InputLabelProps={{
                  shrink:true,
                }}
                InputProps={{
                readOnly:true,
                }}
                />
              </Grid>
            </Grid>
          </Container>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                    fullWidth
                    multiline
                    id = "TabooUnCheckedText"
                    label = "入力されたプロット"
                    variant='outlined'
                    value={receivedData2}
                    InputLabelProps={{
                      shrink:true,
                    }}
                    InputProps={{
                    readOnly:true,
                    style:{overflowWrap:'anywhere'}
                    }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                    fullWidth
                    multiline
                    id = "TabooCheckedText"
                    variant='outlined'
                    label="改善後のプロット"
                    value={responseText}
                    InputProps={{
                    readOnly:true,
                    style:{
                      overflowWrap:'anywhere',
                      whiteSpace:'pre-line',
                  }
                    }}
                    />
                </Grid> 
            </Grid>
          </Container>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
            <Grid item xs={12} md={12} lg={12}>
              <Button variant='outlined' fullWidth onClick={onClickDownload}>ダウンロード</Button>
            </Grid>
          </Container>
        </Box>
        <Fab
        color="primary"
        aria-label="next-page"
        variant='extended'
        onClick={toEkonte}
        style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        }}
        >
            絵・Vコンテ作成に進む
            <KeyboardDoubleArrowRightIcon/>

        </Fab>
      </ThemeProvider>
    </div>
  );
};

export default TabooDownload;
