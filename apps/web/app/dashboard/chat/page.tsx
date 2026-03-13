"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../../../src/context/Socketprovider";

interface Message {
  user?: string;
  text: string;
  system?: boolean;
}

export default function ChatPage() {
  const { socket, connectSocket } = useSocket();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [joined, setJoined] = useState(false);
  const [username, setUsername] = useState("");

  // connect socket
  useEffect(() => {
    const token = localStorage.getItem("token") ?? "";
    connectSocket(token);
  }, [connectSocket]);

  // socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("receive-message", (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("user-joined", (data) => {
      setMessages((prev) => [
        ...prev,
        { system: true, text: data.message },
      ]);
    });

    socket.on("user-left", (data) => {
      setMessages((prev) => [
        ...prev,
        { system: true, text: data.message },
      ]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("user-joined");
      socket.off("user-left");
    };
  }, [socket]);

  const joinChat = () => {
    if (!socket || !username.trim()) return;

    socket.emit("join-room", username);
    setJoined(true);
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    socket?.emit("send-message", {
      username,
      text: input,
    });

    setInput("");
  };

  const handleKey = (e: any) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">

      {!joined ? (
        <div className="bg-white p-8 rounded shadow w-80 flex flex-col gap-4">

          <h1 className="text-xl font-bold text-center">
            Simple Chat
          </h1>

          <input
            placeholder="Enter your name"
            className="border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <button
            onClick={joinChat}
            className="bg-black text-white p-2 rounded"
          >
            Join Chat
          </button>

        </div>
      ) : (
        <div className="w-full max-w-xl h-full flex flex-col bg-white shadow">

          {/* Header */}
          <div className="p-4 border-b font-bold">
            Global Chat Room
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">

            {messages.map((msg, i) => {

              if (msg.system) {
                return (
                  <div key={i} className="text-center text-gray-400 text-sm">
                    {msg.text}
                  </div>
                );
              }

              const isMine = msg.user === username;

              return (
                <div
                  key={i}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`p-2 rounded max-w-xs ${
                      isMine
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {!isMine && (
                      <div className="text-xs font-bold">{msg.user}</div>
                    )}
                    {msg.text}
                  </div>
                </div>
              );
            })}

          </div>

          {/* Input */}
          <div className="flex border-t">

            <input
              className="flex-1 p-3 outline-none"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />

            <button
              onClick={sendMessage}
              className="bg-black text-white px-6"
            >
              Send
            </button>

          </div>

        </div>
      )}
    </div>
  );
}