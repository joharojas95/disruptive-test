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
import RadioType from './RadioType';
import axios from 'axios';

export default function RegisterCard({ setRegister, setShowSnackbar }) {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [type, setType] = React.useState('creator');
  const [isError, setIsError] = React.useState(false);
  const [existingEmail, setExistingEmail] = React.useState(false);
  const [existingUsername, setExistingUsername] = React.useState(false);

  const register = async (e) => {
    e.preventDefault();
    //setOpenBackdrop(true);
    if (
      !email ||
      !password ||
      !username ||
      !type ||
      !repeatPassword
    ) {
      setIsError(true);
    } else if (password && repeatPassword && password !== repeatPassword) {
      setIsError(true);
    } else {
      setIsError(false);
      let params = {
        email: email,
        username: username,
        role: type,
        password: password,
      };
      await axios.post("/register", params)
        .then((data) => {
          setShowSnackbar({
            show: true,
            text: "Usuario creador exitosamente",
            type: "success",
        });
          setRegister(false)
        })
        .catch((err) => {
          console.log(err)
        });
    }
  };

  const verifyEmail = async (email) => {
    if (email.trim() && /.+@.+\..+/.test(email)) {
      await axios.get("/verifyEmail?email=" + email)
        .then((response) => {
          setExistingEmail(response.data);
        })
        .catch((error) => {
          console.log(error)
          setExistingEmail(false);
        });
    } else {
      setIsError(true);
    }
  };

  const verifyUsername = async (username) => {
    await axios.get("/verifyUsername?username=" + username)
      .then((response) => {
        setExistingUsername(response.data);
      })
      .catch((error) => {
        console.log(error)
        setExistingUsername(false);
      });
  };

  const handleChangeEmail = async (event) => {
    setEmail(event.target.value);
    await verifyEmail(event.target.value);
  };

  const handleChangeUsername = async (event) => {
    setUsername(event.target.value);
    await verifyUsername(event.target.value);
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
            //gridTemplateColumns: { md: '1fr 1fr' },
            gap: 2,
          }}
        >
          <Card sx={{ width: "100%", px: { xs: 1, md: 5 } }}>
            <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: "center", mt: 3 }}>
              Registro de usuario
            </Typography>
            <CardContent>
              <Stack direction="column" spacing={2}>
                <TextField
                  type="text"
                  id="username-register"
                  label="Ingresa tu nombre de usuario"
                  variant="standard"
                  value={username}
                  onChange={(event) => {
                    handleChangeUsername(event);
                  }}
                  sx={{ width: "100%" }}
                  required
                  error={((isError && username === "") || existingUsername)}
                  helperText={isError && username === "" ? "Campo requerido" : existingUsername ? "El usuario ya existe" : ""}
                />
                <TextField
                  type="email"
                  id="email-register"
                  label="Ingresa tu correo"
                  variant="standard"
                  value={email}
                  onChange={(event) => {
                    handleChangeEmail(event);
                  }}
                  sx={{ width: "100%" }}
                  required
                  error={(isError && !/.+@.+\..+/.test(email)) || (isError && email === "") || existingEmail}
                  helperText={existingEmail ? "El correo ya existe" : (isError && !/.+@.+\..+/.test(email)) ? "Correo inválido" : (isError && email === "") ? "Campo requerido" : ""}
                />
                <TextField
                  type="password"
                  id="password-register"
                  label="Ingresa tu contraseña"
                  variant="standard"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
                  sx={{ width: "100%" }}
                  required
                  error={isError && (password === "" || repeatPassword !== password)}
                  helperText={ isError && password === "" ? "Campo requerido": (repeatPassword !== password) ? "Las contraseñas no coinciden" : ""}

                />
                <TextField
                  type="password"
                  id="password-repeat-register"
                  label="Repite tu contraseña"
                  variant="standard"
                  value={repeatPassword}
                  onChange={(event) => {
                    setRepeatPassword(event.target.value);
                  }}
                  sx={{ width: "100%" }}
                  required
                  error={(isError && repeatPassword === "") || repeatPassword !== password}
                  helperText={ isError && repeatPassword === "" ? "Campo requerido": (repeatPassword !== password) ? "Las contraseñas no coinciden" : ""}
                />
                <RadioType value={type} setValue={setType} />
                <Button variant="contained" sx={{ my: 6 }} onClick={register}>Acceder</Button>
                <Typography textAlign="center">Si tienes cuenta, inicia sesión <Link component="button" onClick={() => setRegister(false)}>aquí.</Link></Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
}