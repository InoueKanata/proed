import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a80df',
      contrastText: '#ffffff',
    },
    background: {
      default: '#1a80df',
    },
    text: { primary: '#3775fa' },
  },
});

export default theme;