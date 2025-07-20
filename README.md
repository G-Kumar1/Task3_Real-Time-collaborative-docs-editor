# Task3_Real-Time-collaborative-docs-editor
# 📝 Real-Time Collaborative Document Editor

A powerful Google Docs–like collaborative editor built with **React**, **Quill**, **Socket.io**, **Firebase Auth**, and **MongoDB**. Users can create, edit, and collaborate on documents in real-time.

---

## 🚀 Features

- ✅ Real-time text editing with multiple users
- ✅ Font styling and formatting (bold, italic, underline, font size, etc.)
- ✅ Firebase authentication (Google/email)
- ✅ Shareable document link
- ✅ Live user presence indicator
- ✅ Auto-save every 2 seconds
- ✅ Light/Dark theme toggle
- 🚧 Planned: Live cursor tracking

---

## 🔧 Tech Stack

- **Frontend:** React, Quill (react-quill), Tailwind CSS
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB (Mongoose)
- **Auth:** Firebase Authentication

---

## 📂 Folder Structure
<img width="431" height="383" alt="image" src="https://github.com/user-attachments/assets/27d90ea4-d480-48cd-aeda-db0723890c8e" />

### Put the index.html and logo1 in the docs-editor/client/public

---
## 📸 Editor Interface Screenshot
<img width="1919" height="868" alt="image" src="https://github.com/user-attachments/assets/2d1a048c-bc05-4bb1-b7d3-a5db52e3776a" />


## 🛠️ Installation and Setup

### 1️⃣ Clone the repo:
```bash
git clone https://github.com/your-username/docs-editor.git
cd docs-editor

2️⃣ Set up Firebase (for Auth)
Create a Firebase project at https://console.firebase.google.com

Enable Email/Password or Google sign-in

Replace the Firebase config inside client/src/firebase.js with your own.

3️⃣ Install dependencies
Server:
cd server
npm install

Client:
cd ../client
npm install

4️⃣ Create .env for MongoDB
In the /server folder, create a file .env with:
MONGO_URL=your_mongodb_connection_string
PORT=5000

🧪 Run the App
Start server:
cd server
node index.js

Start client:
cd client
npm start




