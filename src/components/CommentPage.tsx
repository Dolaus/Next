'use client'

import React, { useEffect, useState } from 'react';
import { createCommentForPostById, getAllCommentsForPost } from "../api/commentActions";
import Box from "@mui/material/Box";
import { Comment } from "../components/Comment";
import { TextField } from "@mui/material";
import Button from "@mui/material/Button";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface CommentPageProps {
    id: number;
}

interface IComment {
    createdAt: Date;
    text: string;
    user: { username: string };
    id: number;
}

const CommentPage: React.FC<CommentPageProps> = ({ id }) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [commentText, setCommentText] = useState<string>("");

    const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);

    useEffect(() => {
        const resultFetchComments = async () => {
            return await getAllCommentsForPost(id);
        };

        resultFetchComments().then((r) => {
            setComments(r.data);
        });
    }, [id]);

    const handleDeleteComment = (commentId: number) => {
        setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    };

    const sendCommentHandler = async (text: string) => {
        await createCommentForPostById(id, text);
        const resultFetchComments = async () => {
            return await getAllCommentsForPost(id);
        };

        resultFetchComments().then((r) => {
            setComments(r.data);
        });
    };

    return (
        <div>
            <Box sx={{ maxWidth: 400, mx: 'auto' }}>
                {/* Відображення коментарів */}
                {comments.map(comment => (
                    <Comment
                        onDelete={handleDeleteComment}
                        key={comment.id}
                        id={comment.id}
                        user={comment.user}
                        createdAt={comment.createdAt}
                        text={comment.text}
                    />
                ))}
                {isAuthenticated && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 3 }}>
                        <TextField
                            onChange={(e) => setCommentText(e.target.value)}
                            fullWidth
                            placeholder="Write a comment..."
                        />
                        <Button
                            onClick={() => sendCommentHandler(commentText)}
                            sx={{ ml: 1, alignSelf: 'center', height: 'fit-content' }}
                            variant="contained"
                        >
                            Send
                        </Button>
                    </Box>
                )}
            </Box>
        </div>
    );
};

export default CommentPage;
