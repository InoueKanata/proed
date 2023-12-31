import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing:4,
  palette: {
    primary: {
      main: '#1a80df',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8f8f8',
    },
    text: { 
      primary: '#3775fa' 
    },
  },
  components:{
    MuiContainer:{
      styleOverrides:{
        root:{
          padding:'30px',
        },
      },
    },
  },
});

export default theme;