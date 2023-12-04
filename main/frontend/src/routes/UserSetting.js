import React, { useEffect, useState } from 'react';
import { ThemeProvider, Grid, TextField, Container, Box, Paper, CssBaseline} from '@mui/material';
import theme from '../theme';
import { json, useLocation, useNavigate } from 'react-router-dom';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import axios from 'axios';

const UserSettings = () => {
  const [defaultValue,setdefaultValue] = useState('')
  useEffect(() => {
    const openSettingPage = async()=>{
      try{
        const response = await axios.get('/setting',{responseType:'json'})
        setdefaultValue(response.data)
      }catch(error){
        console.error(error)
      }
    }
    openSettingPage()
   },[]);

  const postBardvalue= async (event)=>{
    axios.post('/setting',{bardToken:event.target.value})
    }
  const postSDvalue = async(event)=>{
    axios.post('/setting',{sDToken:event.target.value})
  } 
  const postdeeplvalue = async(event)=>{
    axios.post('/setting',{deeplToken:event.target.value})
  } 
  const bardTokenDefaultValue = defaultValue.length = 3? defaultValue[0].bardToken:'';
  const sDTokenDefaultValue = defaultValue.length = 3? defaultValue[0].sDToken:'';
  const deeplTokenDefaultValue = defaultValue.length = 3? defaultValue[0].deeplToken:'';
  
  return (
    <div className='UserSetting'>
      <h2>設定画面</h2>
      <ThemeProvider theme={ theme }>
      <CssBaseline/>
      <Box component="main" sx ={{flexGrow:1,p:3,marginLeft:60}}>
        <Container maxWidth="lg" component={Paper} sx={{marginTop:5}}>
          <Grid container spacing={10}>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
              multiline
              fullWidth
              label="BardToken"
              InputLabelProps={{
                shrink:true,
              }}
              InputProps={{
                style:{color:"#000000"}
                }}
              onChange={postBardvalue}
              value={bardTokenDefaultValue}
                >
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
              multiline
              fullWidth
              label="StableDiffusionToken"
              InputLabelProps={{
                shrink:true,
              }}
              InputProps={{
                style:{color:"#000000"}
                }}
                onChange={postSDvalue}
                value={sDTokenDefaultValue}>
              </TextField>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <TextField
              multiline
              fullWidth
              label="DeeplToken"
              InputLabelProps={{
                shrink:true,
              }}
              InputProps={{
                style:{color:"#000000"}
                }}
                onChange={postdeeplvalue}
                value={deeplTokenDefaultValue}>
              </TextField>
            </Grid>
          </Grid>
        </Container>
      </Box>

      </ThemeProvider>

      {/* ここに設定画面のコンテンツを追加 */}
    </div>
  );
};

export default UserSettings;
