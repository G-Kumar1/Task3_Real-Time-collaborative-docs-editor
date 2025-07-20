import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { CustomToolbar } from "./CustomToolbar";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import Quill from "quill";

// Font Family
const Font = Quill.import("formats/font");
Font.whitelist = ["arial", "times-new-roman", "calibri", "comic-sans"];
Quill.register(Font, true);

// Font Size
const Size = Quill.import("formats/size");
Size.whitelist = ["8px", "10px", "12px", "14px", "16px", "18px", "20px", "24px", "28px"];
Quill.register(Size, true);

const SAVE_INTERVAL_MS = 2000;
const SOCKET_SERVER = "http://localhost:5000";

// Toolbar modules
const modules = {
  toolbar: { container: "#toolbar" },
};
const formats = [
  "font", "size", "bold", "italic", "underline", "strike",
  "color", "background", "script", "header", "blockquote",
  "code-block", "list", "bullet", "indent", "link", "image", "video",
];

function TextEditor() {
  const { id: documentId } = useParams();
  const [value, setValue] = useState("");
  const [saveStatus, setSaveStatus] = useState("All changes saved");
  const [isDark, setIsDark] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);
  const [userName, setUserName] = useState("");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `${window.location.origin}/docs/${documentId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const socketRef = useRef();
  const editorRef = useRef();

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    document.documentElement.classList.toggle("dark");
  };

  const logout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User signed out");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "User");
      } else {
        setUserName("Guest_" + Math.floor(Math.random() * 1000));
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userName) return;

    const socket = io(SOCKET_SERVER);
    socketRef.current = socket;

    socket.once("load-document", (document) => {
      editorRef.current.getEditor().setContents(document); // <-- FIXED
      editorRef.current.getEditor().enable();
    });

    socket.emit("get-document", documentId);
    socket.emit("join-document", { documentId, userName });

    socket.on("receive-changes", (delta) => {
      editorRef.current.getEditor().updateContents(delta);
    });

    socket.on("active-users", (users) => {
      setActiveUsers(users);
    });

    return () => socket.disconnect();
  }, [documentId, userName]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (socketRef.current) {
        const delta = editorRef.current.getEditor().getContents();
        socketRef.current.emit("save-document", delta);
        setSaveStatus("Saving...");
        setTimeout(() => setSaveStatus("All changes saved"), 1000);
      }
    }, SAVE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [value]);

  useEffect(() => {
    if (editorRef.current) {
      const quill = editorRef.current.getEditor();
      quill.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.setAttribute("accept", "image/*");
        input.click();

        input.onchange = async () => {
          const file = input.files[0];
          if (!file) return;

          const reader = new FileReader();
          reader.onload = () => {
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", reader.result);
          };
          reader.readAsDataURL(file);
        };
      });
    }
  }, []);

  const handleChange = (content, delta, source) => {
    setValue(content);
    if (source === "user" && socketRef.current) {
      socketRef.current.emit("send-changes", delta);
    }
  };

  if (!userName) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-300 mt-10">
        🔄 Loading user...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-all">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-3 border-b dark:border-gray-700">
        <h1 className="text-lg font-bold">📄 DocsEditor</h1>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-500 dark:text-gray-300">Welcome, {userName}</span>
          <button onClick={logout} className="px-3 py-1 bg-red-500 text-white rounded">Logout</button>
          <button onClick={toggleTheme} className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1 bg-blue-500 text-white rounded"
          >
            Share
          </button>
        </div>
      </div>

      {/* Save Status & Active Users */}
      <div className="flex justify-between items-center px-6 pt-2 text-xs text-gray-500 dark:text-gray-400">
        <div>{saveStatus}</div>
        <div>🟢 {activeUsers.length} Online</div>
      </div>

      {/* Toolbar */}
      <CustomToolbar />

      {/* Editor */}
      <div className="flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-800 px-4 py-6 flex justify-center">
        <div className="bg-white dark:bg-gray-900 text-black dark:text-white w-full max-w-[794px] min-h-[1123px] p-6 shadow-md rounded-md">
          <ReactQuill
            ref={editorRef}
            theme="snow"
            value={value}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            className="h-full font-sans text-base"
          />
        </div>
      </div>

      {/* Share Modal */}
      {isShareModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40"
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-md w-[90%] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-4">Share Document</h2>
            <input
              type="text"
              value={`${window.location.origin}/docs/${documentId}`}
              readOnly
              className="w-full p-2 border rounded dark:bg-gray-900 dark:text-white"
            />
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TextEditor;
