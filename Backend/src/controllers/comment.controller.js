
const answerModel = require("../models/answer.model");
const commentModel = require("../models/comment.model");

const getAllComments = async function(req,res){
    try{
        const answerId = req.params?.answerId;

        const answer = await answerModel.findById(answerId);
        if(!answer){
            return res.status(404).json({
                message: "Answer not found"
            })
        }

        const comments = await commentModel.find({ answerId }).populate("authorId",'username avatar').sort({ createdAt: 1 });
        if(!comments){
            return res.status(400).json({
                message: "No comment found"
            })
        }

        res.status(200).json({
            message: "comments fetched successfully",
            comments
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const createComment = async function(req,res){
    try{
        const { answerId } = req.params;
        const userId = req.user?._id;
        const { content } = req.body;

        if(!content && !content.trim()){
            return res.status(400).json({
                message: "content is required"
            })
        }

        if(content.length > 200){
            return res.status(400).json({
                message: "content length is less than 200 characters"
            })
        }

        const isAnswerExist = await answerModel.findById(answerId);
        if(!isAnswerExist){
            return res.status(404).json({
                message: "Answer not found"
            })
        }

        const comment = await commentModel.create({
            answerId,
            authorId: userId,
            content
        })

        const populatedComment = await commentModel.findById(comment._id).populate("authorId",'username avatar');

        res.status(201).json({
            message: "Comment created successfully",
            comment: populatedComment
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const updateComment = async function(req,res){
    try{
        const commentId = req.params?.commentId;
        const userId = req.user?._id;

        const { content } = req.body;
        if(!content && !content.trim()){
            return res.status(400).json({
                message: "Comment is required"
            })
        }

        const comment = await commentModel.findById(commentId);

        if(!comment){
            return res.status(400).json({
                message: "Can not update comment"
            })
        }

        if(userId.toString() !== comment.authorId.toString()){
            return res.status(403).json({
                message: "You are not authorized to update this comment"
            })
        }

        comment.content = content; 
        await comment.save();

        const updatedComment = await commentModel.findById(commentId).populate("authorId",'username avatar');

        res.status(200).json({
            message: "Comment updated",
            comment: updatedComment
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


const deleteComment = async function(req,res){
    try{
        const commentId = req.params?.commentId;
        const userId = req.user?._id;

        const comment = await commentModel.findById(commentId);
        if(!comment){
            return res.status(400).json({
                message: "Comment not found"
            })
        }

        if(userId.toString() !== comment.authorId.toString()){
            return res.status(403).json({
                message: "You are not authorized to delete this comment"
            })
        }

        const deletedComment = await commentModel.findByIdAndDelete(commentId);

        if (!deletedComment){
            return res.status(404).json({ 
                message: "Comment not found or already deleted" 
            });
        }

        await commentModel.deleteMany({ parentComment: commentId });

        res.status(200).json({
            message: "Comment deleted",
            comment: deletedComment
        })

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

const createReply = async function(req,res){
    try{

    }
    catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


module.exports = {
    getAllComments,
    createComment,
    updateComment,
    deleteComment
}