import PostMessage from "../models/postMessage.js"
import { StatusCodes } from "http-status-codes"
import mongoose from "mongoose";


export const getPost = async (req, res) => {
    const { id } = req.params

    try {
        const post = await PostMessage.findById(id)
        res.status(StatusCodes.OK).json(post)
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message })
    }
}

export const getPosts = async (req, res) => {
    const { page } = req.query

    try {
        const LIMIT = 8
        const startIndex = (Number(page) - 1) * LIMIT  // get the starting index of every page
        const total = await PostMessage.countDocuments({})

        const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex)

        res.status(StatusCodes.OK).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) })
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message })
    }
}

// NOTE:
// Query -> /posts?page=1 -> page = 1
// Params -> /posts/:id -> id = 123(whatever u want)
// both are acceptable, usually id is used to get resource and query is used to do a search

export const getPostsBySearch = async (req, res) => {
    const { searchQuery, tags } = req.query

    try {
        const title = new RegExp(searchQuery, "i")  // i means ignore case a = A
        // note: reg exp is easier for mongodb/mongoose to search database for query

        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(",") } }] })  // $or means find me the title or the tags  $in means match one of the tags in the array

        res.status(StatusCodes.OK).json(posts)
    } catch (error) {
        res.status(StatusCodes.NOT_FOUND).json({ message: error.message })
    }
}

export const createPost = async (req, res) => {
    const post = req.body

    const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

    try {
        // const newPost = await PostMessage.create(post)
        await newPost.save()
        res.status(StatusCodes.CREATED).json(newPost)
    } catch (error) {
        res.status(StatusCodes.CONFLICT).json({ message: error.message })
    }
}

export const updatePost = async (req, res) => {
    const { id } = req.params
    const post = req.body

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(StatusCodes.NOT_FOUND).send("No post with that id")

    const updatedPost = await PostMessage.findByIdAndUpdate(id, { ...post, id }, { new: true })  // don't need _id in the post object?
    res.status(StatusCodes.OK).json(updatedPost)
}

export const deletePost = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(StatusCodes.NOT_FOUND).send("No post with that id")

    await PostMessage.findByIdAndDelete(id)
    res.status(StatusCodes.OK).json({ message: "Post deleted successfully" })
}

export const likePost = async (req, res) => {
    const { id } = req.params

    if (!req.userId) return res.status(StatusCodes.UNAUTHORIZED).json({ mressage: "Unauthenticated" })
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(StatusCodes.NOT_FOUND).send("No post with that id")

    const post = await PostMessage.findById(id)
    const index = post.likes.findIndex((id) => id === String(req.userId))

    if (index === -1) {  // like the post, if no id matches req.userId, findIndex returns -1
        post.likes.push(req.userId)
    }
    else {  // dislike the post
        post.likes = post.likes.filter((id) => id !== req.userId)
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.status(StatusCodes.OK).json(updatedPost)
}

export const commentPost = async (req, res) => {
    const { id } = req.params
    const { value } = req.body

    const post = await PostMessage.findById(id)
    post.comments.push(value)
    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })
    res.status(StatusCodes.OK).json(updatedPost)
}