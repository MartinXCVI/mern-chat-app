# MERN Chat App

## 📄 Introduction

A modern, full-stack real-time chat application built with the MERN stack. Features secure user authentication, instant messaging with Socket.io, image uploads via Cloudinary, and a polished UI using React with Tailwind CSS and DaisyUI components. The application includes state management with Zustand, comprehensive input validation with Zod, and production-ready security features.

---

## 🛰️ Technologies Used

### Frontend
- **React** - A JavaScript library for building user interfaces with component-based architecture
- **TypeScript** - Adds static type definitions to JavaScript for better development experience
- **Tailwind CSS & DaisyUI** - Utility-first styling with beautiful pre-built components
- **Zustand** - Lightweight state management solution
- **React Router Dom** - Client-side routing for single-page application navigation
- **Socket.io Client** - Real-time bidirectional communication with the server
- **Axios** - Promise-based HTTP client for API requests
- **React Hot Toast** - Elegant toast notifications
- **Lucide React** - Pretty and customizable icons

### Backend
- **Node.js** - JavaScript runtime built on Chrome's V8 JavaScript engine
- **Express** - Fast, unopinionated, minimalist web framework for Node.js
- **JWT & Bcrypt** - Secure authentication and password hashing
- **MongoDB** - NoSQL document database for flexible data storage
- **Socket.io** - Enables real-time bidirectional event-based communication
- **Cloudinary** - Cloud-based image storage and optimization
- **Zod** - Schema validation for request/response data
- **Helmet** - Security middleware for Express apps
- **Express Rate Limit** - API rate limiting for protection against abuse

---

## 📋 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Cloudinary account (for image uploads)

### Clone the Repository
```bash
git clone https://github.com/MartinXCVI/mern-chat-app.git
cd mern-chat-app
```

### Backend Setup
```bash
cd backend
npm install
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

---

## ⚙️ Environment Variables

### Frontend (.env)
Create a `.env` file in the frontend directory:
```env
VITE_API_URL=
VITE_SOCKET_URL=
```

### Backend (.env)
Create a `.env` file in the backend directory:
```env
NODE_ENV=
DATABASE_URI=
PORT_ENV=
CLIENT_URL=
SERVER_URL=
SERVER_BASE_URL=
SALT_ROUNDS=
JWT_SECRET=
JWT_REFRESH_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

---

## 🚀 Running the Project

### Development Mode

#### Backend
```bash
cd backend
npm run dev
```
This will start the backend server using nodemon, which automatically restarts the server when files change.

#### Frontend
```bash
cd frontend
npm run dev
```
This will start the Vite development server with hot module replacement.

### Production Build

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
npm run preview
```

### Additional Scripts

#### Frontend
- `npm run lint` - Run ESLint to check for code quality issues
- `npm run preview` - Preview the production build locally

#### Backend
- `npm run build` - Compile TypeScript to JavaScript in the dist folder

---

## 📚 Learn More

- [Node.js latest documentation](https://nodejs.org/docs/latest/api/)
- [React official documentation](https://react.dev/)
- [TypeScript official documentation](https://www.typescriptlang.org/docs/)
- [Zustand documentation for getting started](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [Axios official documentation](https://axios-http.com/docs/intro)
- [Vite official documentation](https://vitejs.dev/guide/)
- [Tailwind With Vite installation guide](https://tailwindcss.com/docs/installation/using-vite)
- [React Router's home page](https://reactrouter.com/home)
- [Socket.IO official page](https://socket.io/)
- [socket.io-client NPM package](https://www.npmjs.com/package/socket.io-client)
- [Nodemon project website](https://nodemon.io/)
- [lucide-react documentation and guides](https://lucide.dev/guide/packages/lucide-react)
- [Getting started with Express.js](https://expressjs.com/en/starter/installing.html)
- [TailwindCSS installation guides](https://tailwindcss.com/docs/installation/framework-guides)
- [DaisyUI official site](https://daisyui.com/)
- [Dotenv repository](https://github.com/motdotla/dotenv#readme)
- [Zod NPM package](https://www.npmjs.com/package/zod)
- [Helmet.js documentation page](https://helmetjs.github.io/)
- [MongoDB documentation](https://www.mongodb.com/docs/)
- [Mongoose documentation](https://mongoosejs.com/docs/)
- [bcrypt NPM package](https://www.npmjs.com/package/bcrypt)
- [cookie-parser NPM package](https://www.npmjs.com/package/cookie-parser)
- [Cross Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [express-rate-limit usage guide](https://express-rate-limit.mintlify.app/quickstart/usage)
- [JSON Web Tokens official website's introduction](https://jwt.io/introduction)
- [Cloudinary Node SDK](https://www.npmjs.com/package/cloudinary)

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🧑‍💻 Developer

- [**MartinXCVI**](https://github.com/MartinXCVI)