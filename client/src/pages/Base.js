import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
//import ActionAreaCard from "../components/ActionAreaCard"
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';

const drawerWidth = 240;

function Base(props) {

  const { children } = props;
  const navigate = useNavigate();
  const [login, setLogin] = useState(false)

  const goToLogin = async (id) => {
    navigate("/login");
  };

  const goToDashboard = async (id) => {
    navigate("/dashboard");
  };

  const logout = async () => {
    localStorage.removeItem('token');
    console.log('User logged out successfully');
    navigate("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setLogin(true)
    } else {
      setLogin(false)
    }
  }, [])

  const goToUrl = async (url) => {
    navigate(url);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            sx={{ mr: 1 }}
            onClick={() => goToUrl('/')}
          >
            <LocalLibraryIcon />
          </IconButton>

          <Stack direction="row" justifyContent="space-between" sx={{ width: "100%" }}>
            <Typography variant="h5" noWrap component="div" onClick={() => goToUrl('/')} sx={{ cursor: "pointer" }}>
              Biblioteca de contenidos
            </Typography>
            <Box>
              {login && <Button variant="outlined" color="inherit" sx={{ ml: 1 }} onClick={() => goToDashboard()}>Ir al dashboard</Button>}
              <Button variant="outlined" color="inherit" sx={{ ml: 1 }} onClick={login ? () => logout() : () => goToLogin()}>{login ? "Cerrar sesión" : "Iniciar sesión"}</Button>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
        {/* <ActionAreaCard /> */}
      </Box>
    </Box>
  );
}

export default Base;
