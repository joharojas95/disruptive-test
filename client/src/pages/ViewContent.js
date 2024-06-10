import { useEffect, useState } from 'react';
import Base from "./Base"
import axios from "axios";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import 'moment/locale/es';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useNavigate, useLocation } from "react-router-dom";
import AutoIframe from '../components/AutoIframe'
import { jwtDecode } from "jwt-decode";

function ViewContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState({})
  const [role, setRole] = useState("guess")


  useEffect(() => {
    (async () => {
      if (location?.state?.content) {
        console.log(location.state.content)
        setContent(location.state.content)
        const token = localStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setRole(decoded.role)
        } else {
          setRole("guess")
        }
      } else {
        navigate("/");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const downloadFile = async (id) => {
    try {
      const response = await axios({
        url: '/content/download/'+id, // URL del servidor backend
        method: 'GET',
        responseType: 'blob', // Cambia el tipo de respuesta a 'blob'
      });

      const disposition = response.headers['content-disposition'];
      const match = disposition.match(/filename="(.+)"/);
      const fileName = match ? match[1] : 'example.txt'; // Nombre del archivo por defecto

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName); // Nombre del archivo a descargar
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar el archivo', error);
    }
  };

  return (
    <Base>
      {Object.keys(content).length > 0 && <Card sx={{ width: "100%", minHeight: "calc(100vh - 120px)" }}>
        <CardMedia
          component="img"
          height="250"
          image={content.img}
        />
        <CardContent>
          <Typography gutterBottom variant="h4" component="div">
            Nombre del contenido: {content.name} <Chip label={content.theme.name} style={{ backgroundColor: content.theme.color }} />
          </Typography>
          <Divider />
          <Box p={2}>
            <Typography gutterBottom variant="h5" sx={{ mt: 2 }}>
              Descripción del contenido
            </Typography>
            <Box dangerouslySetInnerHTML={{ __html: content.description }}>
            </Box>
          </Box>
          <Divider />
          <Box p={2}>
            <Typography gutterBottom variant="h5" sx={{ mt: 2 }}>
              Contenido adjunto
            </Typography>
            {role === "guess" ?
              <Typography>Debes registrarte o iniciar sesión para ver el contenido.</Typography>
              : (
                content.category.type.name === "Imágenes" ?
                  <Box
                    component="img"
                    src={content.content}
                  ></Box>
                  : content.category.type.name === "URLs de YouTube" ?
                    <AutoIframe src={content.content} />
                    : <Button variant="contained" color="primary" onClick={() => downloadFile(content._id)}>
                      Descargar archivo TXT
                    </Button>
              )}
          </Box>
          <Divider />
          <Box p={2}>
            <Stack direction="row" sx={{ justifyContent: "space-between", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Créditos: {content.user.username}<br></br>
                Publicado el: {moment(content.creation_date).format('DD MMM YYYY')}
              </Typography>
              <Typography variant="body2" color="text.secondary">


              </Typography>
            </Stack>
          </Box>
        </CardContent>
      </Card>}
    </Base>
  );
}

export default ViewContent;
