import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import axios from 'axios';
import CategoriesModal from '../components/CategoriesModal'
import CustomTable from '../components/CustomTable'
import SnackBar from '../components/Snackbar'
import SimpleBackdrop from '../components/SimpleBackdrop'
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import IconButton from '@mui/material/IconButton';

const initialSnackbar = {
    show: false,
    text: "",
    type: "success",
};

export default function Categories() {
    const [openModal, setOpenModal] = useState(false);
    const [currentCategory, setCurrentCategory] = useState({});
    const [updateCategory, setUpdateCategory] = useState(false);
    const [allTypes, setAllTypes] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(initialSnackbar);
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const token = localStorage.getItem('token');

    const handleDeleteCategory = async (e, id) => {
        e.preventDefault()
        axios.delete(`/category/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
            }
        })
            .then(() => {
                getCategories()
            })
            .catch(error => {
                console.error('Error al borrar la categoria:', error);
            });
    }

    const handleUpdateCategory = async (e, id) => {
        e.preventDefault()

        await axios.get(`/category/get/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
            }
        })
            .then(async (response1) => {
                setCurrentCategory(response1.data)
                await axios.get("/types/all")
                    .then((response) => {
                        setUpdateCategory(true)
                        setOpenModal(true)
                        setAllTypes(response.data)
                    })
                    .catch((error) => {
                        console.log(error)
                    });

            })
            .catch(error => {
                console.error('Error al borrar la categoria:', error);
            });
    }

    const getCategories = async () => {
        await axios.get("/category/all", {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
            }
        })
            .then((response) => {
                let data = response.data.map((item) => (
                    {
                        ...item,
                        actions: <Stack direction="row" alignItems="center">
                            <Tooltip title="Editar">
                                <IconButton
                                    aria-label="comment"
                                    onClick={(e) => handleUpdateCategory(e, item._id)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Borrar">
                                <IconButton
                                    aria-label="comment"
                                    onClick={(e) => handleDeleteCategory(e, item._id)}
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
                setAllCategories(data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        getCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleAddModal = async (e) => {
        e.preventDefault()

        await axios.get("/types/all")
            .then((response) => {
                setCurrentCategory({})
                setUpdateCategory(false)
                setOpenModal(true)
                setAllTypes(response.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    return (
        <>
            <Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                            <Typography variant="h6">Lista de categorías</Typography>
                            <Button variant="contained" onClick={handleAddModal}>Agregar</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTable rows={allCategories} headers={['Nombre de la categoría', 'Tipo de contenido', 'Acciones']} cells={['name', 'type.name', 'actions']} reload={getCategories} />
                    </Grid>
                </Grid>
                <CategoriesModal
                    open={openModal}
                    setOpen={setOpenModal}
                    currentCategory={currentCategory}
                    updateCategory={updateCategory}
                    setUpdateCategory={setUpdateCategory}
                    setCurrentCategory={setCurrentCategory}
                    allTypes={allTypes}
                    getCategories={getCategories}
                    setShowSnackbar={setShowSnackbar}
                    setOpenBackdrop={setOpenBackdrop}
                />
            </Box>
            <SnackBar
                show={showSnackbar.show}
                type={showSnackbar.type}
                message={showSnackbar.text}
                showSnackbar={showSnackbar}
                setShowSnackbar={setShowSnackbar}
            />
            <SimpleBackdrop open={openBackdrop} />
        </>
    );
}