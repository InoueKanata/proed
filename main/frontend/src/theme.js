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
      primary: '#000000' 
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