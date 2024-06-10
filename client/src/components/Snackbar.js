import { Snackbar, Typography, Alert } from "@mui/material";

export default function SnackBar(props) {
    const { show, type, message, showSnackbar, setShowSnackbar } = props;

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShowSnackbar({
            ...showSnackbar,
            show: false,
        });
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={show}
            autoHideDuration={6000}
            onClose={handleCloseSnackBar}
        >
            <Alert
                onClose={handleCloseSnackBar}
                severity={type}
                // sx={{ bgcolor: "#414042", color: "#FFF" }}
            >
                <Typography variant="body2">
                    {message}
                </Typography>
            </Alert>
        </Snackbar>
    );
}
