import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId} = req.params;
    const {content} = req.body;
    
    if(!content || !videoId){
        throw new ApiError(401, "Content and video id both are required!");
    }

    const user = await User.findById(req.user?._id);

    if (!user) {
        throw new ApiError(401, "Invalid user!");
    }

    const video = await Video.findById(videoId);
    if (!video) {
        throw new ApiError(401, "Invalid video id!");
    }
    
    const comment = await Comment.create({
        content, 
        video,
        owner: user
    })

    return res
    .status(200)
    .json(new ApiResponse(200, comment, "Comment added successsfully!"))
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
