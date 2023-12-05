import React, { useEffect, useState } from 'react';
import { ThemeProvider, Grid, TextField, Container, Box, Paper, CssBaseline} from '@mui/material';
import theme from '../theme';
import axios from 'axios';

const UserSettings = () => {
  const [defaultValue,setdefaultValue] = useState([])
  useEffect(() => {
    const openSettingPage = async()=>{
      try{
        const response = await axios.get('/setting',{responseType:'json'})
        setdefaultValue(response.data||[]);
        // console.log(response.data)
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
  const arrayValue = JSON.parse(`[${defaultValue}]`);
  const value = arrayValue[0]
  let bardTokenDefaultValue = ""
  let sDTokenDefaultValue = ""
  let deeplTokenDefaultValue = ""
  if (value){ 
  bardTokenDefaultValue = value.length === 3 ? value.find(item => item[0] === 'bard_api_key')[1] : '';
  sDTokenDefaultValue = value.length === 3 ? value.find(item => item[0] === 'stablediffusion_api_key')[1] : '';
  deeplTokenDefaultValue =value.length === 3 ? value.find(item => item[0] === 'DEEPL_api_key')[1] : '';
};

  console.log(bardTokenDefaultValue)
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
              defaultValue={bardTokenDefaultValue}
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
                defaultValue={sDTokenDefaultValue}>
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
                defaultValue={deeplTokenDefaultValue}>
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
