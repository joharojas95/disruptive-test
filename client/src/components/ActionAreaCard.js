import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import moment from 'moment';
import 'moment/locale/es';

export default function ActionAreaCard({ content }) {

  const navigate = useNavigate();

  const goToView = (content) => {
    navigate("/view/content", {
      state: {
        content: content,
      },
    });
  }

  return (
    <Card sx={{ width: "100%" }}>
      <CardActionArea onClick={() => goToView(content)}>
        <CardMedia
          component="img"
          height="200"
          image={content.img}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {content.name}
          </Typography>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Créditos: {content.user.username}<br />
              Publicado el: {moment(content.creation_date).format('DD MMM YYYY')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <Chip label={content.theme.name} style={{ backgroundColor: content.theme.color }} />
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}