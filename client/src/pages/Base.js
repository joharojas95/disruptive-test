import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuBookIcon from '@mui/icons-material/MenuBook';
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
            <MenuBookIcon />
          </IconButton>

          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent={{ xs: "center", sm: 'space-between' }} alignItems="center" sx={{ width: "100%" }} spacing={2}>
            <Typography variant="h5" noWrap component="div" onClick={() => goToUrl('/')} sx={{ cursor: "pointer" }}>
              Biblioteca de contenidos
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ pb: { xs: 2, sm: 0 } }}>
              {login && <Button variant="outlined" color="inherit" onClick={() => goToDashboard()}>Ir al dashboard</Button>}
              <Button variant="outlined" color="inherit" onClick={login ? () => logout() : () => goToLogin()}>{login ? "Cerrar sesión" : "Iniciar sesión"}</Button>
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <Toolbar /><Toolbar /><Toolbar />
        </Stack>

        {children}
        {/* <ActionAreaCard /> */}
      </Box>
    </Box>
  );
}

export default Base;
