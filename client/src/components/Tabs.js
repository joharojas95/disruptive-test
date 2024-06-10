import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import ActionAreaCard from "./ActionAreaCard"
import Grid from '@mui/material/Grid';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs({ value, setValue }) {

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%', bgcolor: 'background.paper' }} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" sx={{ justifyContent: "center" }}>
                    <Tab label="Mostrar contenido por temas" {...a11yProps(0)} />
                    <Tab label="Mostrar contenido por tipos" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
                <Grid container spacing={4}>
                    {[0, 1, 2].map((content) => (
                        <Grid item xs={12} md={4}>
                            <ActionAreaCard title={"Tema " + (content + 1)} />
                        </Grid>
                    ))}
                </Grid>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
                <Grid container spacing={4}>
                    {[0, 1, 2, 3].map((content) => (
                        <Grid item xs={12} md={4}>
                            <ActionAreaCard title={"Tipo " + (content + 1)} />
                        </Grid>
                    ))}
                </Grid>
            </CustomTabPanel>
        </Box>
    );
}