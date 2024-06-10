import React, { useState, useCallback, useMemo, useEffect } from "react";
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
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useDropzone } from "react-dropzone";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { jwtDecode } from "jwt-decode";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import 'moment/locale/es';

const baseStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    borderWidth: 2,
    borderRadius: 2,
    borderColor: "#eeeeee",
    borderStyle: "dashed",
    backgroundColor: "#fafafa",
    color: "#818181",
    outline: "none",
    transition: "border .24s ease-in-out",
};

const focusedStyle = {
    borderColor: "#2196f3",
};

const acceptStyle = {
    borderColor: "#00e676",
};

const rejectStyle = {
    borderColor: "#ff1744",
};

const modules = {
    toolbar: [
        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'color': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' },
        { 'indent': '-1' }, { 'indent': '+1' }],
        ['link',],
    ],
}

const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'color'
]

export default function ContentModal({
    open,
    setOpen,
    currentContent,
    updateContent,
    setUpdateContent,
    setCurrentContent,
    allThemes,
    getContents,
    setOpenBackdrop,
    setShowSnackbar
}) {
    const [desc, setDesc] = useState("");
    const [error, setError] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadFile2, setUploadFile2] = useState(null);
    const [valueQuill, setValueQuill] = useState('');
    const [file, setFile] = useState()
    const [preview, setPreview] = useState()
    const [option, setOption] = React.useState("");
    const [option2, setOption2] = React.useState("");
    const [themeText, setThemeText] = React.useState("");
    const [themeColor, setThemeColor] = React.useState("#FFF");
    const [themeTypes, setThemeTypes] = React.useState([]);
    const [showUrlInput, setShowUrlInput] = React.useState(false);
    const [showFileInput, setShowFileInput] = React.useState(false);
    const [url, setUrl] = useState("");  // Estado para la URL
    const [fileAccepts, setFileAccepts] = useState("");  // Estado para la URL
    const [imgUrl, setImgUrl] = useState("");  // Estado para la URL

    const token = localStorage.getItem('token');

    const decoded = jwtDecode(token);
    const user_id = decoded.id
    const username = decoded.username

    useEffect(() => {
        //console.log('data.isAdmin' + user.isAdmin)
        if (!file) {
            setPreview(undefined)
            return
        }
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)
        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)
    }, [file])

    useEffect(() => {
        if (updateContent) {
            setDesc(currentContent.name);
            setOption(currentContent.theme);
            setOption2(currentContent.category);
            setValueQuill(currentContent.description)
            setImgUrl(currentContent.img)

            const index = allThemes.map((item) => item._id).findIndex(x => x === currentContent.theme);

            const themeC = allThemes[index].categories.map((item) => ({
                _id: item._id,
                name: item.name,
                front: item.type.front,
                back: item.type.back,
                type: item.type.name
            }))

            setThemeTypes(themeC)

            let categoryFind = allThemes[index].categories.map((item) => item._id).findIndex(x => x === currentContent.category);
            if (allThemes[index].categories[categoryFind].type.name === 'URLs de YouTube') {
                setUrl(currentContent.content)
                setShowUrlInput(true)
                setShowFileInput(false)
            } else {
                setFileAccepts(allThemes[index].categories[categoryFind].type.front)
                setShowUrlInput(false)
                setShowFileInput(true)
            };

            const selectedText = allThemes[index].name;
            const selectedColor = allThemes[index].color;
            setThemeText(selectedText)
            setThemeColor(selectedColor);

        }
    }, [allThemes, currentContent, currentContent.name, updateContent]);

    const handleClose = () => {
        setOpen(false);
        setUpdateContent(false);
        setCurrentContent({});
        setDesc("");
        setError(false);
        setUploadFile(null)
        setUploadFile2(null)
        setValueQuill('')
        setFile()
        setPreview()
        setOption("")
        setOption2("")
        setThemeText("")
        setThemeColor("")
        setThemeTypes([])
        setShowUrlInput(false)
        setShowFileInput(false)
        setUrl("")
        setFileAccepts("")
        setImgUrl("")
    };

    const addCategoryHandler = async (e) => {
        e.preventDefault();
        if (desc !== "" && option !== "" && uploadFile && option2 !== "" && valueQuill !== "" && user_id) {
            setError(false);
            try {

                const formData = new FormData();
                formData.append("img1", uploadFile);
                formData.append("img2", uploadFile2);
                formData.append("name", desc);
                formData.append("theme", option);
                formData.append("type", option2);
                formData.append("description", valueQuill);
                formData.append("user", user_id);
                formData.append("url", url);

                setOpenBackdrop(true)
                await axios
                    .post(`/content/add`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
                        }
                    })
                    .then((res) => {
                        getContents()
                        setShowSnackbar({
                            show: true,
                            text: "Contenido agregado exitosamente",
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

    const updateCategoryHandler = async (e) => {
        e.preventDefault();
        console.log(option !== "")
        if (desc !== "" && option !== "" && option2 !== "" && valueQuill !== "" && user_id) {
            try {
                setError(false);
                const formData = new FormData();
                formData.append("id", currentContent._id);
                formData.append("img1", uploadFile);
                formData.append("img2", uploadFile2);
                formData.append("name", desc);
                formData.append("theme", option);
                formData.append("type", option2);
                formData.append("description", valueQuill);
                formData.append("user", user_id);
                formData.append("url", url);
                setOpenBackdrop(true)
                await axios
                    .put(`/content/update`, formData, {
                        headers: {
                            Authorization: `Bearer ${token}` // Enviar el token JWT en el encabezado de autorización
                        }
                    })
                    .then((res) => {
                        getContents()
                        setShowSnackbar({
                            show: true,
                            text: "Contenido editado exitosamente",
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

    const onDrop = useCallback((acceptedFiles) => {
        setUploadFile(acceptedFiles[0]);
        setFile(acceptedFiles[0])
    }, []);

    const {
        acceptedFiles,
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': [],
            'image/png': []
        },
        maxFiles: 1,
    });

    const files = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const style = useMemo(
        () => ({
            ...baseStyle,
            ...(isFocused ? focusedStyle : {}),
            ...(isDragAccept ? acceptStyle : {}),
            ...(isDragReject ? rejectStyle : {}),
        }),
        [isFocused, isDragAccept, isDragReject]
    );

    const handleChange = (event) => {
        const selectedOption = event.target.value;
        const index = allThemes.map((item) => item._id).findIndex(x => x === selectedOption);
        const selectedText = allThemes[index].name;
        const selectedColor = allThemes[index].color;

        const themeC = allThemes[index].categories.map((item) => ({
            _id: item._id,
            name: item.name,
            front: item.type.front,
            back: item.type.back,
            type: item.type.name
        }))
        setThemeTypes(themeC)
        setOption(selectedOption);
        setThemeText(selectedText);
        setThemeColor(selectedColor);
    };

    const handleChange2 = (event) => {
        const selectedOption = event.target.value;
        const index = themeTypes.map((item) => item._id).findIndex(x => x === selectedOption);

        if (themeTypes[index].type === 'URLs de YouTube') {
            setShowUrlInput(true)
            setShowFileInput(false)
        } else {
            setFileAccepts(themeTypes[index].front)
            setShowUrlInput(false)
            setShowFileInput(true)
        };

        setOption2(selectedOption);
    };

    const handleFileChange = (event) => {
        setUploadFile2(event.target.files[0]);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <DialogTitle>
                {updateContent ? "Editar contenido" : "Agregar nuevo contenido"}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={10}>
                    <Grid item xs={12} md={7}>
                        <Stack direction="column" spacing={2}>
                            <div {...getRootProps({ style })}>
                                <input {...getInputProps()} />
                                <UploadFileIcon fontSize="large" />
                                <p>Arrastra hasta aquí la imagen de la publicación</p>
                            </div>
                            <aside>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mt: 1 }}>
                                    Archivo cargado
                                </Typography>
                                <ul>{files}</ul>
                            </aside>
                            <TextField
                                autoFocus
                                required
                                margin="dense"
                                id="name"
                                name="name"
                                label="Nombre del contenido"
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
                                <InputLabel id="demo-simple-select-label">Tema del contenido</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="theme"
                                    value={option}
                                    onChange={handleChange}
                                    required
                                    label="Tema del contenido"
                                    name="typeId"
                                    error={option === "" && error}
                                >
                                    {allThemes.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                                {option === "" && error && <FormHelperText sx={{ color: "#d32f2f" }}>Debe completar este campo</FormHelperText>}
                            </FormControl>
                            {themeTypes.length > 0 && <FormControl variant="standard" required sx={{ width: "100%" }}>
                                <InputLabel id="demo-simple-select-label">Categoria del contenido a publicar</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="theme"
                                    value={option2}
                                    onChange={handleChange2}
                                    required
                                    label="Categoria del contenido a publicar"
                                    name="typeId"
                                    error={option2 === "" && error}
                                >
                                    {themeTypes.map((item) => (
                                        <MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>
                                    ))}
                                </Select>
                                {option === "" && error && <FormHelperText sx={{ color: "#d32f2f" }}>Debe completar este campo</FormHelperText>}
                            </FormControl>}
                            {showUrlInput && (
                                <TextField
                                    margin="dense"
                                    id="url"
                                    name="url"
                                    label="Ingrese la URL"
                                    type="url"
                                    fullWidth
                                    variant="standard"
                                    value={url}
                                    onChange={(event) => {
                                        setUrl(event.target.value);
                                    }}
                                    color="primary"
                                    error={url === "" && error}
                                    helperText={url === "" && error ? "Debe completar este campo" : ""}
                                />
                            )}
                            {showFileInput && (
                                <>
                                    <div>
                                        <input
                                            accept={fileAccepts} // Cambia el tipo de archivo si necesitas subir archivos diferentes
                                            id="file-upload-button"
                                            type="file"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                        <label htmlFor="file-upload-button">
                                            <Button
                                                variant="contained"
                                                component="span"
                                                startIcon={<CloudUploadIcon />}
                                            >
                                                Subir archivo anexo
                                            </Button>
                                        </label>
                                        {uploadFile2 && (
                                            <Typography variant="body1" component="p">
                                                Archivo seleccionado: {uploadFile2.name}
                                            </Typography>
                                        )}
                                    </div>
                                </>
                            )}
                        </Stack>
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Vista previa
                        </Typography>
                        <Card sx={{ width: "100%" }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={preview !== undefined ? preview : imgUrl ? imgUrl : ''}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {desc}
                                    </Typography>
                                    <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                                        <Typography variant="body2" color="text.secondary">
                                            Créditos: {username}<br></br>
                                            Publicado el: {moment().format('DD MMM YYYY')}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            <Chip label={themeText} style={{ backgroundColor: themeColor }} />

                                        </Typography>
                                    </Stack>

                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Detalle del contenido
                        </Typography>
                        <ReactQuill theme="snow" value={valueQuill} onChange={setValueQuill} modules={modules}
                            formats={formats} />
                    </Grid>
                </Grid>


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
                        updateContent
                            ? (e) => updateCategoryHandler(e)
                            : (e) => addCategoryHandler(e)
                    }
                    variant="contained"
                    color="primary"
                >
                    {updateContent ? "Guardar" : "Agregar"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
