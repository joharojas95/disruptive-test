import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function LoginCard({ setRegister, setShowSnackbar }) {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isError, setIsError] = React.useState(false);

    const navigate = useNavigate();

    const login = async (event) => {
        event.preventDefault();

        if (email.trim() && password) {
            if (/.+@.+\..+/.test(email)) {

                const params = {
                    email: email,
                    password: password,
                };

                await axios.post("/login", params)
                    .then(response => {
                        console.log(response)
                        if (response.data.token) {
                            localStorage.setItem('token', response.data.token);
                            navigate("/dashboard");
                        }
                    })
                    .catch((error) => {
                        setShowSnackbar({
                            show: true,
                            text: error.response.data.msg ?? error.message,
                            type: "error",
                        });
                    });
            } else {
                setIsError(true);
            }
        } else {
            setIsError(true);
        }
    };

    return (
        <Grid container spacing={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Grid item xs={12} md={5}>
                <Box
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        bgcolor: 'background.default',
                        display: 'grid',
                        gap: 2,
                    }}
                >
                    <Card sx={{ width: "100%", px: 5 }}>
                        <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "center", mt: 3 }}>
                            Iniciar sesión
                        </Typography>
                        <CardContent>
                            <Stack direction="column" spacing={2}>
                                <TextField
                                    type="email"
                                    id="email-login"
                                    label="Ingresa tu correo"
                                    variant="standard"
                                    value={email}
                                    onChange={(event) => {
                                        setEmail(event.target.value);
                                    }}
                                    sx={{ width: "100%" }}
                                    required
                                    error={(isError && email === "")}
                                    helperText={(isError && email === "") ? "Campo requerido" : ""}
                                />
                                <TextField
                                    type="password"
                                    id="password-login"
                                    label="Ingresa tu contraseña"
                                    variant="standard"
                                    value={password}
                                    onChange={(event) => {
                                        setPassword(event.target.value);
                                    }}
                                    sx={{ width: "100%", mt: 2 }}
                                    required
                                    error={(isError && password === "")}
                                    helperText={(isError && password === "") ? "Campo requerido" : ""}
                                />
                                <Button variant="contained" sx={{ my: 5, ml: "auto", mr: "auto" }} onClick={login}>Acceder</Button>
                                <Typography textAlign="center">Si no tienes cuenta, regístrate <Link component="button" onClick={() => setRegister(true)}>aquí.</Link></Typography>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Grid>
        </Grid>
    );
}