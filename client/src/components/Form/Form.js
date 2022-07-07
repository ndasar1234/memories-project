import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import FileBase from "react-file-base64"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom";

import useStyles from "./styles"
import { createPost, updatePost } from "../../actions/posts";


export default function Form({ currentId, setCurrentId }) {
    const classes = useStyles()
    const [postData, setPostData] = useState({ title: "", message: "", tags: "", selectedFile: "" })
    const post = useSelector((state) => currentId ? state.posts.posts.find((p) => p._id === currentId) : null)
    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem("profile"))
    const navigate = useNavigate()

    useEffect(() => {
        if (post) setPostData(post)
    }, [post])

    const clear = () => {
        setCurrentId(0)
        setPostData({ title: "", message: "", tags: "", selectedFile: "" })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        if (currentId) {
            dispatch(updatePost(currentId, { ...postData, name: user?.result?.name }))
        }
        else {
            dispatch(createPost({ ...postData, name: user?.result?.name }, navigate))
        }
        clear()
    }

    if (!user?.result?.name) {
        return (
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    Please Sign In to create your own memories and like other's memories.
                </Typography>
            </Paper>
        )
    }



    return (
        // Paper is like a div with a white-ish background
        <Paper className={classes.paper} elevation={6}>
            <form autoComplete="off" noValidate className={` ${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                {/* 4 input fields for all of postData */}
                <Typography variant="h6">{currentId ? "Editing" : "Creating"} a Memory</Typography>

                {/* When using auth, don't need this field anymore because the one logged in created the post */}
                {/* <TextField name="creator" variant="outlined" label="Creator" fullWidth value={postData.creator} onChange={(event) => setPostData({ ...postData, creator: event.target.value })} /> */}

                <TextField name="title" variant="outlined" label="Title" fullWidth value={postData.title} onChange={(event) => setPostData({ ...postData, title: event.target.value })} />

                <TextField name="message" variant="outlined" label="Message" fullWidth value={postData.message} onChange={(event) => setPostData({ ...postData, message: event.target.value })} />

                <TextField name="tags" variant="outlined" label="Tags (comma separated)" fullWidth value={postData.tags} onChange={(event) => setPostData({ ...postData, tags: event.target.value.split(",") })} />

                {/* Setting image using react-file-bas64 class */}
                <div className={classes.fileInput}>
                    <FileBase
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => setPostData({ ...postData, selectedFile: base64 })}
                    />
                </div>

                <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth >Submit</Button>
                <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth >Clear</Button>

            </form>

        </Paper>
    )
}