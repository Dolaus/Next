'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import axios from 'axios';

interface IComment {
    id: number;
    text: string;
    createdAt: string;
    user: {
        id: number;
        username: string;
    };
}

interface IExhibit {
    id: number;
    description: string;
    imageUrl: string;
    user: {
        id: number;
        username: string;
    };
    commentCount: number;
    createdAt: string;
}

interface Props {
    exhibit: IExhibit;
    currentUser: { id: number; username: string };
    deleteComment: (commentId: number) => void;
}

const PostItemWithComments: React.FC<Props> = ({ exhibit, currentUser, deleteComment }) => {
    const [comments, setComments] = useState<IComment[]>([]);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(false);

    // Fetch comments for the selected post
    const fetchComments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/api/exhibits/${exhibit.id}/comments`
            );
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setLoading(false);
        }
    };

    // Toggle comments visibility
    const toggleComments = () => {
        if (!showComments) {
            fetchComments();
        }
        setShowComments(!showComments);
    };

    return (
        <Card sx={{ marginBottom: 2 }}>
            <img
                src={`http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com${exhibit.imageUrl}`}
                alt={exhibit.description}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <CardContent>
                <Typography variant="h6">{exhibit.description}</Typography>
                <Typography variant="body2" color="textSecondary">
                    <strong>Posted by:</strong> {exhibit.user.username} on{' '}
                    {new Date(exhibit.createdAt).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                    <strong>Comments:</strong> {exhibit.commentCount}
                </Typography>
                <Button onClick={toggleComments} sx={{ marginTop: 2 }}>
                    {showComments ? 'Hide Comments' : 'Show Comments'}
                </Button>
                {showComments && (
                    <Box sx={{ marginTop: 2 }}>
                        {loading ? (
                            <p>Loading comments...</p>
                        ) : (
                            comments.map((comment) => (
                                <Box
                                    key={comment.id}
                                    sx={{
                                        padding: '8px',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginBottom: '8px',
                                        position: 'relative',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        {comment.user.username}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {new Date(comment.createdAt).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2">{comment.text}</Typography>
                                    {comment.user.id === currentUser.id && (
                                        <Button
                                            size="small"
                                            color="error"
                                            sx={{ position: 'absolute', top: '8px', right: '8px' }}
                                            onClick={() => deleteComment(comment.id)}
                                        >
                                            Delete
                                        </Button>
                                    )}
                                </Box>
                            ))
                        )}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default PostItemWithComments;
