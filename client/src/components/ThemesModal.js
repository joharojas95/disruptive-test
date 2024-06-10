import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function ThemesModal({
    open,
    setOpen,
    currentTheme,
    updateTheme,
    setUpdateTheme,
    setCurrentTheme,
    allCategories,
    getThemes
}) {
    const [desc, setDesc] = React.useState("");
    const [error, setError] = React.useState(false);
    const [multiple, setMultiple] = React.useState([]);
    const token = localStorage.getItem('token');

    React.useEffect(() => {
        if (updateTheme) {
            setDesc(currentTheme.name);
            setMultiple(currentTheme.categories)
        }
    }, [currentTheme.categories, currentTheme.name, updateTheme]);

    const handleClose = () => {
        setOpen(false);
        setUpdateTheme(false);
        setCurrentTheme({});
        setDesc("");
        setError(false);
        setMultiple([])
    };

    const addCategoryHandler = async (e) => {
        e.preventDefault();
        if (desc !== "" && multiple.length > 0) {
            setError(false);
            try {
                await axios
                    .post(`/theme/add`, {
                        name: desc,
                        categories: multiple,
                    })
                    .then((res) => {
                        getThemes()
                        // setShowSnackbar({
                        //     show: true,
                        //     text: "Tarea agregada exitosamente",
                        //     type: "success",
                        // });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }

            handleClose();
        } else {
            setError(true);
        }
    };

    const updateCategoryHandler = async (e) => {
        e.preventDefault();
        if (desc !== "" && multiple.length > 0) {
            try {
                setError(false);
                await axios
                    .put(`/theme/update`, {
                        id: currentTheme._id,
                        name: desc,
                        categories: multiple,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
                        }
                    })
                    .then((res) => {
                        getThemes()
                        handleClose();
                        // setShowSnackbar({
                        //     show: true,
                        //     text: "Categoría editada exitosamente",
                        //     type: "success",
                        // });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }

            handleClose();
        } else {
            setError(true);
        }
    };

    const handleMultiple = (e, id) => {
        if (e.target.checked) {
            const newMultiple = [...multiple, id];
            setMultiple(newMultiple);
        } else {
            const newMultiple = multiple.filter((item) => item !== id);
            setMultiple(newMultiple);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {updateTheme ? "Editar tema" : "Agregar nuevo tema"}
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nombre del tema"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={desc}
                        onChange={(event) => {
                            setDesc(event.target.value);
                        }}
                        color="primary"
                        multiline
                        maxRows={5}
                        inputProps={{ maxLength: 255 }}
                        error={desc === "" && error}
                        helperText={
                            desc === "" && error ? "Debe completar este campo" : ""
                        }
                    />
                    <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                        <FormLabel component="legend">Categorías de contenido que acepta</FormLabel>
                        <FormGroup>
                            {allCategories.map((item) => (
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={multiple.includes(item._id)} onChange={(e) => handleMultiple(e, item._id)} />
                                    }
                                    label={"Acepta " + item.name}
                                />
                            ))}

                        </FormGroup>
                        {multiple.length === 0 && error && <FormHelperText sx={{ color: "#d32f2f" }}>Debe completar este campo</FormHelperText>}
                    </FormControl>
                </Stack>

            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handleClose}
                    variant="outlined"
                    color="primary"
                >
                    Cancelar
                </Button>
                <Button
                    type="button"
                    onClick={
                        updateTheme
                            ? (e) => updateCategoryHandler(e)
                            : (e) => addCategoryHandler(e)
                    }
                    variant="contained"
                    color="primary"
                >
                    {updateTheme ? "Guardar" : "Agregar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
