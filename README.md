# 🎮 CartoonCodeStreet - 3D Interactive Portfolio

A stunning 3D interactive portfolio built with React Three Fiber, featuring a cartoon-style street environment where visitors can explore projects, play mini-games, and experience your work in an immersive way.

![Portfolio Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![Mobile Friendly](https://img.shields.io/badge/Mobile-Friendly-blue) ![3D Experience](https://img.shields.io/badge/3D-Experience-purple)

## ✨ Features

### 🏠 **Interactive Portfolio**
- **3D Houses**: Each house represents a different project
- **Project Details**: Click houses to view comprehensive project information
- **Immersive Navigation**: Walk through your portfolio like a virtual neighborhood

### 🎯 **Mini-Games & Interactions**
- **Tic-Tac-Toe** at fire hydrants
- **Hangman** at mailboxes  
- **Checkers** at trees
- **Interactive Objects**: Seesaw, fountain, and more with animations
- **Audio Feedback**: Sound effects and background music

### 📱 **Cross-Platform Experience**
- **Desktop**: Full keyboard/mouse controls with advanced features
- **Mobile**: Touch-friendly virtual controls with responsive design
- **Seamless**: Same great experience across all devices

### 🎨 **Visual & Audio**
- **Cartoon Art Style**: Colorful, engaging 3D environment
- **Dynamic Lighting**: Interactive lamp posts and ambient lighting
- **Spatial Audio**: Background music that adapts to activities
- **Smooth Animations**: Character movement and object interactions

## 🚀 Live Demo

**[Visit CartoonCodeStreet →](https://your-netlify-url.netlify.app)**

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Deployment**: Netlify
- **Mobile**: Custom touch controls and responsive design

## 🎮 Controls & Navigation

### 🖥️ **Desktop Controls**
```
Movement:
W/↑ - Move forward    |  S/↓ - Move backward
A/← - Turn left       |  D/→ - Turn right

Interaction:
E/Space - Interact with objects
Mouse - Look around (click and hold)
+/- - Zoom in/out
```

### 📱 **Mobile Controls**
- **🕹️ Virtual Joystick** (bottom left): Move and turn your character
- **👀 Look Pad** (bottom right): Control camera and look around  
- **🎯 Interact Button** (bottom center): Interact with houses and objects

## 🏗️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/MSMITH71910/CartoonCodeStreet.git
cd CartoonCodeStreet
```

2. **Install dependencies:**
```bash
npm install
# or
yarn install
```

3. **Start development server:**
```bash
npm run dev
# or  
yarn dev
```

4. **Open your browser:**
Navigate to [http://localhost:5000](http://localhost:5000)

## 📁 Project Structure

```
CartoonCodeStreet/
├── client/                     # Frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── games/         # Mini-game components
│   │   │   ├── ui/            # UI components
│   │   │   └── ...            # 3D scene components
│   │   ├── lib/               # Utilities and stores
│   │   │   ├── stores/        # Zustand state management
│   │   │   └── data/          # Project data
│   │   ├── hooks/             # Custom React hooks
│   │   └── pages/             # Page components
│   └── public/                # Static assets
├── server/                    # Backend (for local development)
├── shared/                    # Shared utilities
├── netlify.toml              # Netlify deployment config
└── vite.config.netlify.reference.ts  # Netlify build config
```

## 🚀 Deployment

### Quick Deploy to Netlify

1. **Build for Netlify:**
```bash
npm run build:netlify
```

2. **Deploy:**
   - Connect your GitHub repo to Netlify
   - Build command: `npm run build:netlify`
   - Publish directory: `dist/client`

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production (full-stack)
npm run build:netlify # Build for Netlify (client-only)
npm run start        # Start production server
```

## 🎯 What Makes This Special

### 🌟 **Unique Features**
- **First-of-its-kind** 3D portfolio experience
- **Mobile-optimized** 3D interactions
- **Game-like exploration** of your professional work
- **Interactive storytelling** through spatial design

### 🎮 **Gaming Elements**
- **Mini-games** that showcase different skills
- **Achievement system** through exploration
- **Interactive objects** that respond to user actions
- **Immersive audio** that enhances the experience

### 📱 **Mobile Innovation**
- **Virtual joystick** for 3D navigation on mobile
- **Touch-optimized** camera controls
- **Responsive UI** that adapts to screen size
- **Mobile-first** interaction design

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature-amazing-feature`
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Three Fiber** community for amazing 3D web capabilities
- **Three.js** for powerful 3D graphics
- **Netlify** for seamless deployment
- **Open source community** for inspiration and tools

## 📞 Contact

**Michael Smith** - [@MSMITH71910](https://github.com/MSMITH71910)

**Project Link**: [https://github.com/MSMITH71910/CartoonCodeStreet](https://github.com/MSMITH71910/CartoonCodeStreet)

---

⭐ **Star this repo** if you found it helpful!

🎮 **Experience the future of portfolios** - where your work comes to life in 3D!