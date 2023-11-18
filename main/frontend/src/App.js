import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  Link,
  Box,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import ImageIcon from '@mui/icons-material/Image';
import SettingsIcon from '@mui/icons-material/Settings';

import theme from './theme';
import Ekonte from './routes/Ekonte';
import Taboo from './routes/Taboo';
import UserSettings from './routes/UserSetting';
import TabooDownload from './routes/TabooDownload';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
    <div className="App">
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Router>
              <Routes>
                <Route path="/" element ={<div>禁忌チェック</div>}/>
                <Route path="/ekonte" element ={<div>絵・Vコンテ作成</div>}/>
                <Route path="/TabooDownload" element ={<div>絵・Vコンテ作成</div>}/>
                <Route path="/settings" element ={<div>設定</div>}/>
              </Routes>
            </Router>
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx = {{display:'flex'}}>
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            zIndex:(theme) => theme.zIndex.drawer
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItemButton component = {Link} to="/">
            <ListItemIcon>
              <EditIcon />
            </ListItemIcon>
            <ListItemText primary = "禁忌チェック"/>
          </ListItemButton>
        </List>
        <List>
          <ListItemButton component = {Link} to="/ekonte">
            <ListItemIcon>
              <ImageIcon />
            </ListItemIcon>
            <ListItemText primary = "絵・Vコンテ作成"/>
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <ListItemButton component = {Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary = "設定"/>
          </ListItemButton>
        </List>
      </Drawer>
      </Box>
      <Router>
        <Routes>
          <Route path="/" element={<Taboo/>} />
          <Route path="/ekonte" element={<Ekonte/>} />
          <Route path="/settings" element={<UserSettings />} />
          <Route path="/TabooDownload" element={<TabooDownload/>} />
        </Routes>
      </Router>
    </div>
    </ThemeProvider>
  );
}

export default App;
