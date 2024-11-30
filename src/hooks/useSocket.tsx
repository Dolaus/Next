import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const useSocket = (currentPage: number, fetchExhibits: (page: number) => void) => {
    const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL;

    useEffect(() => {
        if (!SOCKET_SERVER_URL) {
            console.error('SOCKET_SERVER_URL is not defined');
            return;
        }

        const socket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
        });

        socket.on('newPost', (data) => {
            console.log('New post received:', data);
            toast(`New Post from ${data.user}`);
            if (currentPage === 1) {
                fetchExhibits(currentPage);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [SOCKET_SERVER_URL, currentPage, fetchExhibits]);
};

export default useSocket;
