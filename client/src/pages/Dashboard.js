import Typography from '@mui/material/Typography';

function Dashboard({ role, user_name }) {

  return (
    <>
      <Typography variant="h6">Bienvenido, <b>{user_name}</b>. Tu rol actual es: <b>{role}</b>.</Typography>
    </>
  );
}

export default Dashboard;
