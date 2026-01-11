# ChessApp - Interactive Chess Learning Platform

A comprehensive web-based chess learning platform built with Angular 20, designed to help students learn chess through engaging activities, puzzles, and games. The application provides a structured approach to chess education with multiple interactive features.

## 🎯 Features

### Learning Activities
- **Chess Puzzles** - Practice tactical patterns and improve problem-solving skills
- **Chess Quiz** - Test your chess knowledge with interactive quizzes
- **Coordinates Training** - Master board coordinates and square recognition
- **Knight's Tour** - Learn knight movement patterns through interactive gameplay
- **Capture the Shapes** - Understand piece movement and capture mechanics
- **Game of Independence** - Strategic gameplay exercises
- **Dominance Game** - Learn piece control and board dominance
  - Team Dominance mode for collaborative learning

### Educational Resources
- **Books Section** - Curated chess learning materials
- **Classes** - Structured chess course information
- **Coaches** - Connect with chess instructors
- **Gallery** - Visual chess content and achievements
- **Testimonials** - Student success stories

### School Features
- **About School** - Information about the chess learning institution
- **Contact** - Get in touch with administrators
- **Donations** - Support the chess education program

### User Management
- **User Authentication** - Secure login and signup system
- **Admin Panel** - Administrative tools and user management
- **User Profiles** - Track progress and achievements

## 🛠️ Technology Stack

- **Framework**: Angular 20.3.0
- **Backend**: Firebase (Authentication & Database)
- **Language**: TypeScript 5.9.2
- **Styling**: Custom CSS with responsive design
- **Build Tool**: Angular CLI 20.3.5
- **Additional Libraries**: 
  - RxJS for reactive programming
  - XLSX for Excel file handling
  - Firebase for backend services

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Angular CLI (`npm install -g @angular/cli`)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/alliswellschool/ChessApp.git
cd ChessApp
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Add your Firebase configuration in `src/environments/environment.ts`
   - See [Firebase Setup Guide](docs/FIREBASE_SETUP.md) for details

### Development Server

To start a local development server, run:

```bash
npm start
# or
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

For mobile testing on local network:
```bash
npm run start:mobile
```

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project for production:

```bash
npm run build
# or
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

For development build with watch mode:
```bash
npm run watch
```

## 📁 Project Structure

```
chessactivities/
├── src/
│   ├── app/
│   │   ├── puzzles/           # Chess puzzle activities
│   │   ├── quiz/              # Quiz system
│   │   ├── coordinates/       # Coordinate training
│   │   ├── knights-tour/      # Knight's tour game
│   │   ├── capture-the-shapes/# Shape capture game
│   │   ├── dominance/         # Dominance games
│   │   ├── game-of-independence/ # Independence game
│   │   ├── admin/             # Admin panel
│   │   ├── login/             # Authentication
│   │   ├── services/          # Shared services
│   │   └── shared/            # Shared components
│   ├── environments/          # Environment configs
│   └── styles/                # Global styles
├── docs/                      # Documentation
├── requirements/              # Feature requirements
└── public/                    # Static assets
```

## 🧪 Testing

### Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
npm test
# or
ng test
```

### End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 📚 Documentation

- [Chessboard Component Guide](docs/CHESSBOARD_COMPONENT.md)
- [Firebase Setup](docs/FIREBASE_SETUP.md)
- [Excel Import Format](docs/EXCEL_IMPORT_FORMAT.md)
- [Responsive Design Guide](RESPONSIVE_QUICKSTART.md)
- [Razorpay Payment Setup](docs/RAZORPAY_SETUP.md)

## 🎨 Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of All Is Well School's chess education program.

## 📞 Contact

For questions or support, please visit the contact section of the application or reach out through the school's official channels.

## 🎓 About

ChessApp is developed and maintained as part of All Is Well School's mission to provide quality chess education to students worldwide. The platform combines traditional chess learning with modern web technologies to create an engaging and effective learning experience.

## 🔗 Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
