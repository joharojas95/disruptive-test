import * as React from 'react';
import Base from "./Base"
import LoginCard from "../components/LoginCard"
import RegisterCard from "../components/RegisterCard"
import Backdrop from "../components/SimpleBackdrop"
import SnackBar from '../components/Snackbar';

const initialSnackbar = {
  show: false,
  text: "",
  type: "success",
};


function Login(props) {
  const [register, setRegister] = React.useState(false);
  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const [showSnackbar, setShowSnackbar] = React.useState(initialSnackbar);

  return (
    <>
      <Base>
        {register ?
          <RegisterCard setRegister={setRegister} setOpenBackdrop={setOpenBackdrop} setShowSnackbar={setShowSnackbar} /> :
          <LoginCard setRegister={setRegister} openBackdrop={openBackdrop} setOpenBackdrop={setOpenBackdrop} />
        }
      </Base>
      <Backdrop open={openBackdrop} />
      <SnackBar
        show={showSnackbar.show}
        type={showSnackbar.type}
        message={showSnackbar.text}
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
      />
    </>
  );
}

export default Login;
