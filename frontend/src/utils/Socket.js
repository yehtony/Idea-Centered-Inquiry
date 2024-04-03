import { io } from "socket.io-client";
import url from "../url.json";

export const socket = io.connect(url.backendHost);

// // 添加连接成功和错误处理代码
// socket.on("connect", () => {
//   console.log("Socket connected successfully!");
// });

// socket.on("connect_error", (error) => {
//   console.error("Socket connection error:", error);
// });