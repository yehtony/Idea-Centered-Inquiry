import { io } from 'socket.io-client';
import url from '../url.json';

export const socket = io(url, {
  autoConnect: false,
});
