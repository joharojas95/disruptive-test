import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import FormHelperText from '@mui/material/FormHelperText';

export default function CategoriesModal({
    open,
    setOpen,
    currentCategory,
    updateCategory,
    setUpdateCategory,
    setCurrentCategory,
    allTypes,
    getCategories,
    setShowSnackbar,
    setOpenBackdrop
}) {
    const [desc, setDesc] = React.useState("");
    const [option, setOption] = React.useState("");
    const [error, setError] = React.useState(false);
    const token = localStorage.getItem('token');

    const handleChange = (event) => {
        setOption(event.target.value);
    };

    React.useEffect(() => {
        if (updateCategory) {
            setDesc(currentCategory.name);
            setOption(currentCategory.type);
        }
    }, [currentCategory.name, currentCategory.type, updateCategory]);

    const handleClose = () => {
        setOpen(false);
        setUpdateCategory(false);
        setCurrentCategory({});
        setDesc("");
        setOption("");
        setError(false);
    };

    const addCategoryHandler = async (e) => {
        e.preventDefault();
        if (desc !== "" && option !== "") {
            setError(false);
            try {
                setOpenBackdrop(true)
                await axios
                    .post('/category/add', {
                        name: desc,
                        typeId: option,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
                        }
                    })
                    .then((res) => {
                        getCategories()
                        handleClose();
                        setShowSnackbar({
                            show: true,
                            text: "Categoría agregada exitosamente",
                            type: "success",
                        });
                    })
                    .catch((error) => {
                        setShowSnackbar()
                        console.log(error);
                        setShowSnackbar({
                            show: true,
                            text: error.response.data.msg ?? error.message,
                            type: "error",
                        });
                    });
                setOpenBackdrop(false)
            } catch (error) {
                setShowSnackbar()
                console.log(error);
                setShowSnackbar({
                    show: true,
                    text: error.response.data.msg ?? error.message,
                    type: "error",
                });
            }
        } else {
            setError(true);
        }
    };

    const updateCategoryHandler = async (e) => {
        e.preventDefault();
        if (desc !== "" && option !== "") {
            try {
                setOpenBackdrop(true)
                setError(false);
                await axios
                    .put(`/category/update`, {
                        id: currentCategory._id,
                        name: desc,
                        typeId: option,
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
                        }
                    })
                    .then((res) => {
                        getCategories()
                        handleClose();
                        setShowSnackbar({
                            show: true,
                            text: "Categoría editada exitosamente",
                            type: "success",
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                setOpenBackdrop(false)
            } catch (error) {
                console.log(error);
            }

            handleClose();
        } else {
            setError(true);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                {updateCategory ? "Editar categoría" : "Agregar nueva categoría"}
            </DialogTitle>
            <DialogContent>
                <Stack direction="column" spacing={2}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="name"
                        label="Nombre de la categoría"
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
                    <FormControl variant="standard" required sx={{ width: "100%" }}>
                        <InputLabel id="demo-simple-select-label">Tipo de archivo</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="typeId"
                            value={option}
                            onChange={handleChange}
                            required
                            label="Tipo de archivo"
                            name="typeId"
                            error={option === "" && error}
                            disabled={updateCategory}
                        >
                            {allTypes.map((item) => (
                                <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                            ))}
                        </Select>
                        {option === "" && error && <FormHelperText sx={{ color: "#d32f2f" }}>Debe completar este campo</FormHelperText>}
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
                        updateCategory
                            ? (e) => updateCategoryHandler(e)
                            : (e) => addCategoryHandler(e)
                    }
                    variant="contained"
                    color="primary"
                >
                    {updateCategory ? "Guardar" : "Agregar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
