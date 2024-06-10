import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import axios from 'axios';
import ContentModal from '../components/ContentModal'
import CustomTable from '../components/CustomTable'
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import IconButton from '@mui/material/IconButton';
import { jwtDecode } from "jwt-decode";
import SnackBar from '../components/Snackbar'
import SimpleBackdrop from '../components/SimpleBackdrop'
import Box from '@mui/material/Box';
import moment from 'moment';

const initialSnackbar = {
    show: false,
    text: "",
    type: "success",
};

export default function Content() {
    const [openModal, setOpenModal] = useState(false);
    const [currentContent, setCurrentContent] = useState({});
    const [updateContent, setUpdateContent] = useState(false);
    const [allThemes, setAllThemes] = useState([]);
    const [allContents, setAllContents] = useState([]);
    const [showSnackbar, setShowSnackbar] = useState(initialSnackbar);
    const [openBackdrop, setOpenBackdrop] = useState(false);

    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);

    const handleDeleteContent = async (e, id) => {
        e.preventDefault()
        axios.delete(`/content/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
            }
        })
            .then(() => {
                setShowSnackbar({
                    show: true,
                    text: "Contenido borrado exitosamente",
                    type: "success",
                });
                getContents()
            })
            .catch(error => {
                console.error('Error al borrar el contenido:', error);
            });
    }

    const handleUpdateContent = async (e, id) => {
        e.preventDefault()

        await axios.get("/theme/all")
            .then(async (response1) => {
                setAllThemes(response1.data)
                await axios.get(`/content/get/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
                    }
                })
                    .then((response) => {
                        setCurrentContent(response.data)
                        setUpdateContent(true)
                        setOpenModal(true)
                    })
                    .catch(error => {
                        console.error('Error al editar la categoria:', error);
                    });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const getContents = async () => {
        await axios.get("/content/all/user/" + decoded.id)
            .then((response) => {
                let data = response.data.map((item) => (
                    {
                        ...item,
                        creation_date: moment(item.creation_date).format("DD-MM-YYYY HH:mm:ss"),
                        actions: <Stack direction="row" alignItems="center">
                            <Tooltip title="Editar">
                                <IconButton
                                    aria-label="comment"
                                    onClick={(e) => handleUpdateContent(e, item._id)}
                                >
                                    <EditIcon />
                                </IconButton>
                            </Tooltip>
                            {decoded.role === "admin" && <Tooltip title="Borrar">
                                <IconButton
                                    aria-label="comment"
                                    onClick={(e) => handleDeleteContent(e, item._id)}
                                >
                                    <CloseIcon
                                        sx={{
                                            color: "#ff8787",
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>}
                        </Stack>
                    }
                ))
                setAllContents(data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    useEffect(() => {
        getContents()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleAddModal = async (e) => {
        e.preventDefault()

        await axios.get("/theme/all")
            .then((response) => {
                console.log(response.data)
                setCurrentContent({})
                setUpdateContent(false)
                setOpenModal(true)
                setAllThemes(response.data)
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
                            <Typography variant="h6">Lista de contenido</Typography>
                            <Button variant="contained" onClick={handleAddModal}>Agregar</Button>
                        </Stack>
                    </Grid>
                    <Grid item xs={12}>
                        <CustomTable rows={allContents} headers={['Nombre del contenido', 'Tema', 'Tipo de contenido', 'Creador por', 'Creador el', 'Acciones']} cells={['name', 'theme.name', 'category.name', 'user.username', 'creation_date','actions']} />
                    </Grid>
                </Grid>
                <ContentModal
                    open={openModal}
                    setOpen={setOpenModal}
                    currentContent={currentContent}
                    updateContent={updateContent}
                    setUpdateContent={setUpdateContent}
                    setCurrentContent={setCurrentContent}
                    allThemes={allThemes}
                    getContents={getContents}
                    setOpenBackdrop={setOpenBackdrop}
                    setShowSnackbar={setShowSnackbar}
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