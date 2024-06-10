import { useEffect, useState } from 'react';
import Base from "./Base"
import axios from "axios";
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ActionAreaCard from "../components/ActionAreaCard"

const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

function Home() {

  const [allCategories, setAllCategories] = useState([]);
  const [allThemes, setAllThemes] = useState([]);
  const [allContent, setAllContent] = useState([]);

  const getCategories = async () => {
    await axios.get("/category/all")
      .then((response) => {
        setAllCategories(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const getThemes = async () => {
    await axios.get("/theme/all")
      .then((response) => {
        setAllThemes(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const getContent = async () => {
    await axios.get("/content/all")
      .then((response) => {
        setAllContent(response.data)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  useEffect(() => {
    getCategories()
    getThemes()
    getContent()
  }, [])

  return (
    <Base>
      {allCategories.length > 0 ? allCategories.map((category) => {
        if (allContent.filter((item) => item.category._id === category._id).length > 0) {
          return (
            <div key={category._id}>
              <Typography variant="h4">Categoría: {category.name} ({allContent.filter((item) => item.category._id === category._id).length === 0 ? "0" : "+" + allContent.filter((item) => item.category._id === category._id).length})</Typography>
              <Divider pb={2} />
              {allThemes.map((theme) => {
                if (allContent.filter((item) => item.theme._id === theme._id && item.category._id === category._id).length > 0) {
                  return (
                    <div key={theme._id}>
                      <Grid container spacing={4} px={4} py={2}>
                        <Grid item xs={12}>
                          <Typography variant="h5">Tema: {theme.name} ({allContent.filter((item) => item.theme._id === theme._id && item.category._id === category._id).length === 0 ? "0" : "+" + allContent.filter((item) => item.theme._id === theme._id && item.category._id === category._id).length})</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Carousel
                            responsive={responsive}
                            customTransition="transform 300ms ease-in-out"
                            itemClass="carousel-item-padding-40-px"
                          >
                            {allContent.filter((item) => item.theme._id === theme._id && item.category._id === category._id).map((content) => (
                              <div key={content._id} style={{ padding: '0px 20px 20px 20px' }}> {/* Add padding for spacing */}
                                <ActionAreaCard content={content} />
                              </div>
                            ))}
                          </Carousel>
                          <Divider />
                        </Grid>
                      </Grid>
                    </div>
                  )
                } else {
                  return ""
                }
              })}
            </div>
          )
        } else {
          return ""
        }
      }) : "No hay contenido, por ahora."}
    </Base>
  );
}

export default Home;
