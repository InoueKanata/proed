import React from 'react';
import {Button, ThemeProvider, Grid, TextField, Container, Box, Paper, CssBaseline, Fab } from '@mui/material';
import theme from '../theme';
import { useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const TabooDownload = () => {
    const navi = useNavigate();

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
                id = "readOnlyFilePath"
                variant='standard'
                // value={}
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
                    id = "TabooUnCheckedText"
                    label = "入力されたプロット"
                    variant='outlined'
                    // value={}
                    InputProps={{
                    readOnly:true,
                    }}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                    <TextField
                    fullWidth
                    id = "TabooCheckedText"
                    variant='outlined'
                    label="改善後のプロット"
                    // value={}
                    InputProps={{
                    readOnly:true,
                    }}
                    />
                </Grid> 
            </Grid>
          </Container>
          <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
            <Grid item xs={12} md={12} lg={12}>
              <Button variant='outlined' fullWidth >ダウンロード</Button>
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