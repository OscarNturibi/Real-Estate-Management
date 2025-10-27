// src/pages/messages/Message.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/message.css"; // Ensure this path matches your folder structure
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

const Message = () => {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch messages from Flask backend
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/messages", {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(data.received_messages || []);
        setUnreadCount(data.unread_count || 0);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();

    // Connect to Flask-SocketIO
    const socket = io("http://localhost:5000", {
      transports: ["websocket"],
      withCredentials: true,
    });

    // Handle new incoming messages
    socket.on("receive_message", (msg) => {
      const newMessage = {
        id: msg.message_id,
        sender: { username: msg.sender },
        property_re: { title: msg.property_title },
        message: msg.content,
        read: false,
      };
      setMessages((prev) => [newMessage, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="container py-5">
      {/* Header Section */}
      <div className="d-flex justify-content-center mb-4">
        <nav className="dashboard">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/messages" className="nav-link">
                <FontAwesomeIcon icon={faEnvelope} /> Messages
                {unreadCount > 0 && (
                  <span className="badge bg-danger ms-2">{unreadCount}</span>
                )}
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Messages Section */}
      <div className="d-flex justify-content-center">
        <div className="messages-list w-75">
          <h2 className="text-center mb-4">Inbox</h2>

          <ul className="list-unstyled">
            {messages.length > 0 ? (
              messages.map((msg) => (
                <li
                  key={msg.id}
                  className={`card mb-3 message-card ${
                    !msg.read ? "unread" : ""
                  }`}
                >
                  <a
                    href={`/messages/${msg.id}`}
                    className="text-dark text-decoration-none"
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0">
                          {msg.sender.username}
                        </h5>
                        {!msg.read && (
                          <span className="badge bg-success">New</span>
                        )}
                      </div>
                      <small className="text-muted">
                        {msg.property_re?.title || "No property linked"}
                      </small>
                      <p className="card-text mt-2">
                        {msg.message.length > 50
                          ? `${msg.message.slice(0, 50)}...`
                          : msg.message}
                      </p>
                    </div>
                  </a>
                </li>
              ))
            ) : (
              <li className="text-center py-3">
                <em>No messages yet</em>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Message;
