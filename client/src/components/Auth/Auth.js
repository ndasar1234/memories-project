import React, { useState } from "react";
import { Avatar, Button, Paper, Grid, Typography, Container } from "@material-ui/core";
// import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google"
import LockOutlinedIcon from "@material-ui/icons/LockOutlined"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"

// import Icon from "./Icon"
import useStyles from "./styles"
import Input from "./Input"
import { signin, signup } from "../../actions/auth"


export default function Auth() {
    const classes = useStyles()
    const [showPassword, setShowPassword] = useState(false)
    const [isSignIn, setisSignIn] = useState(true)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const handleSubmit = (event) => {
        event.preventDefault()
        if (isSignIn) {
            dispatch(signin(formData, navigate))
        }
        else {
            dispatch(signup(formData, navigate))
        }
    }

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value })
    }

    const switchMode = () => {
        setisSignIn((previsSignIn) => !previsSignIn)
        setShowPassword(false)
    }

    /*
    const googleSuccess = async (res) => {
        const result = res?.clientId
        const token = res?.credential

        try {
            dispatch({ type: "AUTH", data: { result, token } })
            navigate("/")
        } catch (error) {
            console.log(error);
        }
    }

    const googleFailure = (err) => {
        console.log(err);
        console.log("Google Sign In was unsuccessful. Try Again Later");
    }
    */


    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{!isSignIn ? "Sign Up" : "Sign In"}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {!isSignIn && (
                            <>
                                <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                                <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                            </>
                        )}
                        <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                        <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        {!isSignIn && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type="password" />}
                    </Grid>
                    <Button className={classes.submit} type="submit" fullWidth variant="contained" color="primary">
                        {!isSignIn ? "Sign Up" : "Sign In"}
                    </Button>
                    {/* <GoogleOAuthProvider
                        clientId="1027483256001-05v2rnoo54fgnr1iiq8homqvprmmqc5b.apps.googleusercontent.com"
                    >
                        <GoogleLogin
                            render={(renderProps) => (
                                <Button className={classes.googleButton} color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained"
                                >
                                    Google Sign In
                                </Button>
                            )}
                            onSuccess={googleSuccess}
                            onFailure={googleFailure}
                            cookiePolicy="single_host_origin"
                        />
                    </GoogleOAuthProvider> */}
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                {!isSignIn ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}