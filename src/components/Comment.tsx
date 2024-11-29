import { Avatar, Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Button from "@mui/material/Button";
import {deleteCommentById} from "@/api/commentActions";
import moment from "moment";

interface IComment {
    id: number
    createdAt: Date;
    text: string;
    user: { username: string };
    onDelete: (id: number) => void;
}

export function Comment({ onDelete, user, createdAt, text, id }: IComment) {
    const currentUser = useSelector((state: RootState) => state.user.username);
    console.log('currentUser');
    console.log(currentUser);
    const deleteCommentHandler = async () => {
        await deleteCommentById(id);
        onDelete(id);
    }

    return (
        <Paper elevation={2} sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderRadius: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: 'grey.500' }}>{user.username.charAt(0).toUpperCase()}</Avatar>
            <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2">{user.username}</Typography>
                <Typography variant="caption" color="textSecondary">{moment(createdAt).format('MMMM Do YYYY, h:mm:ss A')}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{text}</Typography>
            </Box>
            {currentUser === user.username && (
                <Button onClick={deleteCommentHandler} sx={{ alignSelf: 'center' }}>Delete</Button>
            )}
        </Paper>
    );
}
