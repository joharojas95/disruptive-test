import { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import ClassIcon from '@mui/icons-material/Class';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CategoryIcon from '@mui/icons-material/Category';
const drawerWidth = 240;


function Base(props) {

  const { window, children, role } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  useEffect(() => {
    if (role === "admin") {
      setMenu([
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          url: '/dashboard'
        },
        {
          text: "Categorías",
          icon: <CategoryIcon />,
          url: '/categories'
        },
        {
          text: "Temas",
          icon: <ClassIcon />,
          url: '/themes'
        },
        {
          text: "Contenido",
          icon: <DynamicFeedIcon />,
          url: '/content'
        },
      ])
    } else if (role === "creator") {
      setMenu([
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          url: '/dashboard'
        },
        {
          text: "Contenido",
          icon: <DynamicFeedIcon />,
          url: '/content'
        },
      ])
    } else if (role === "reader") {
      setMenu([
        {
          text: "Dashboard",
          icon: <DashboardIcon />,
          url: '/dashboard'
        },
      ])
    }
  }, [role]);

  const logout = async (id) => {
    localStorage.removeItem('token');
    console.log('User logged out successfully');
    navigate("/login");
  };

  const goToUrl = async (url) => {
    navigate(url);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => goToUrl('/')}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Biblioteca" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {menu.map((item, index) => (
          <ListItem key={"item_" + index} disablePadding>
            <ListItemButton onClick={() => goToUrl(item.url)}>
              <ListItemIcon>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

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
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
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
            <Button variant="outlined" color="inherit" sx={{ ml: 1 }} onClick={logout}>Cerrar sesión</Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Base;
