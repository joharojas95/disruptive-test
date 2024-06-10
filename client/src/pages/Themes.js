/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import ThemesModal from '../components/ThemesModal'
import CustomTable from '../components/CustomTable'
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import IconButton from '@mui/material/IconButton';

export default function Themes() {
    const [openModal, setOpenModal] = useState(false);
    const [currentTheme, setCurrentTheme] = useState({});
    const [updateTheme, setUpdateTheme] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [allThemes, setAllThemes] = useState([]);

    const token = localStorage.getItem('token');

    const handleDeleteTheme = async (e, id) => {
        e.preventDefault()
        axios.delete(`/theme/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
            }
        })
            .then(() => {
                getThemes()
            })
            .catch(error => {
                console.error('Error al borrar el tema:', error);
            });
    }

    const handleUpdateTheme = async (e, id) => {
        e.preventDefault()

        await axios.get(`/theme/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
            }
        })
            .then(async (response1) => {
                setCurrentTheme(response1.data)
                await axios.get("/types/all")
                    .then(async (response) => {
                        await axios.get("/category/all")
                            .then((response) => {
                                console.log(response.data)
                                setUpdateTheme(true)
                                setOpenModal(true)
                                setAllCategories(response.data)
                            })
                            .catch((error) => {
                                console.log(error)
                            });

                    })
                    .catch((error) => {
                        console.log(error)
                    });

            })
            .catch(error => {
                console.error('Error al borrar la categoria:', error);
            });
    }

    const getThemes = async () => {
        await axios.get("/theme/all")
            .then((response) => {
                let data = response.data.map((item) => (
                    {
                        ...item,
                        actions: <Stack direction="row" alignItems="center">
                            <Tooltip title="Editar">
                                <IconButton
                                    aria-label="comment"
                                    onClick={(e) => handleUpdateTheme(e, item._id)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Borrar">
                                <IconButton
                                    aria-label="comment"
                                    onClick={(e) => handleDeleteTheme(e, item._id)}
                                >
                                    <CloseIcon
                                        sx={{
                                            color: "#ff8787",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                    }
                ))
                setAllThemes(data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        getThemes()
    }, [])


    const handleAddModal = async (e) => {
        e.preventDefault()

        await axios.get("/category/all")
            .then((response) => {
                console.log(response.data)
                setCurrentTheme({})
                setUpdateTheme(false)
                setOpenModal(true)
                setAllCategories(response.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }
    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        <Typography>Lista de temas</Typography>
                        <Button variant="contained" onClick={handleAddModal}>Agregar</Button>
                    </Stack>
                </Grid>
                <Grid item xs={12}>
                    <CustomTable rows={allThemes} headers={['Nombre del tema', 'Categorías de contenido que acepta', 'Acciones']} cells={['name', 'categories', 'actions']} />
                </Grid>
            </Grid>
            <ThemesModal
                open={openModal}
                setOpen={setOpenModal}
                currentTheme={currentTheme}
                updateTheme={updateTheme}
                setUpdateTheme={setUpdateTheme}
                setCurrentTheme={setCurrentTheme}
                allCategories={allCategories}
                getThemes={getThemes}
            />
        </>
    );
}