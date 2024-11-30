import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const useSocket = (currentPage: number, fetchExhibits: (page: number) => void) => {
    const SOCKET_SERVER_URL = 'http://ec2-13-49-67-34.eu-north-1.compute.amazonaws.com/notifications';

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL, {
            transports: ['websocket'],
            autoConnect: true,
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
            reconnectionAttempts: Infinity,
        });

        socket.on('newPost', (data) => {
            alert(2)
            alert(currentPage)
            toast(`New Post from ${data.user}`);
            if (currentPage === 1) {

                alert(3)
                fetchExhibits(currentPage);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [currentPage, fetchExhibits]);
};

export default useSocket;
