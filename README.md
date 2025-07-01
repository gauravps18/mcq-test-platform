# MCQ Test Platform

A comprehensive React-based platform for taking multiple-choice question tests with modern UI, detailed analytics, and modular test management.

## ✨ Features

### Core Functionality

- **Modular Test Structure**: Each test is stored as a separate JSON file for easy management
- **Multi-Section Tests**: Support for multiple sections within a single test
- **Question Navigation**: Easy navigation between questions within sections
- **Section Switching**: Quick switching between test sections with tabs
- **Real-time Progress**: Visual progress indicators and question status tracking

### User Experience

- **Dark Theme**: Modern dark UI theme for better user experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **LaTeX Support**: Mathematical expressions rendered beautifully
- **Instant Feedback**: Immediate result calculation after submission

### Analytics & Results

- **Detailed Result Analysis**: Question-by-question breakdown showing correct vs submitted answers
- **Section-wise Performance**: Performance metrics for each test section
- **Visual Indicators**: Color-coded question status (correct/incorrect/unanswered)
- **Score Calculation**: Configurable marking scheme (+3 for correct, -1 for incorrect by default)

### Administration

- **Easy Test Addition**: Simple process to add new test papers
- **Category Management**: Organize tests by categories and difficulty levels
- **Active/Inactive Tests**: Control which tests are available to users
- **Metadata Support**: Rich metadata including duration estimates and descriptions

## 🛠 Technology Stack

- **Frontend**: React 19+ with TypeScript
- **Routing**: React Router DOM 7+
- **Styling**: Bootstrap 5+ with custom dark theme
- **State Management**: React Context API
- **Backend**: Custom Express.js server
- **Data Storage**: JSON files with modular structure
- **HTTP Client**: Axios for API communication

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mcq-test-platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the backend server**

   ```bash
   npm run server
   ```

   Server will run on http://localhost:3001

4. **Start the frontend (in a new terminal)**
   ```bash
   npm start
   ```
   Application will open at http://localhost:3000

## 📁 Project Structure

```
mcq-test-platform/
├── public/                 # Static files
├── src/
│   ├── components/        # React components
│   │   ├── Question.tsx           # Individual question display
│   │   ├── QuestionNavigation.tsx # Question navigation
│   │   ├── ResultSummary.tsx      # Results overview
│   │   ├── DetailedResults.tsx    # Detailed result analysis
│   │   └── SectionTabs.tsx        # Section navigation
│   ├── context/          # React context
│   │   └── TestContext.tsx        # Global test state
│   ├── pages/            # Page components
│   │   ├── HomePage.tsx           # Test selection page
│   │   ├── TestPage.tsx           # Test taking interface
│   │   └── ResultPage.tsx         # Results display
│   ├── services/         # API and data services
│   │   ├── api.ts                 # API functions
│   │   └── dataLoader.ts          # Modular data loading
│   ├── types/            # TypeScript definitions
│   │   └── index.ts               # Type definitions
│   └── App.tsx           # Main application component
├── data/                 # Test data
│   ├── db.json                    # Main database index
│   ├── tests/                     # Test files organized in folders
│   │   └── test1/                 # Test category folder
│   │       ├── c-cat-section-A.json   # Sample test A
│   │       └── c-cat-section-B.json   # Sample test B
│   ├── db.schema.json             # JSON schema for validation
│   └── README.md                  # Data structure documentation
├── docs/                 # Documentation
│   └── ADDING_NEW_TESTS.md        # Guide for adding tests
├── server.js             # Express server
└── package.json          # Dependencies and scripts
```

## 🎯 Usage

### Taking a Test

1. Navigate to the home page
2. Select a test from the available options
3. Read the instructions and click "Start Test"
4. Answer questions using the multiple-choice options
5. Navigate between questions and sections as needed
6. Submit the test when complete
7. View detailed results with correct answers

### Adding New Tests

See the comprehensive guide: [docs/ADDING_NEW_TESTS.md](docs/ADDING_NEW_TESTS.md)

## 📊 API Endpoints

The platform provides several API endpoints:

- `GET /db` - Main database with test metadata
- `GET /testfiles/:folder/:filename` - Individual test file content (nested)
- `GET /testfiles/:filename` - Individual test file content (root level)
- `GET /tests` - All active tests (legacy compatibility)
- `GET /tests/:id` - Specific test by ID (legacy compatibility)
- `GET /api/test-files` - List of all available test files

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run server`

Starts the JSON Server for the mock API on port 3001.\
Open [http://localhost:3001/tests](http://localhost:3001/tests) to view the test data.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

### Documentation

- [Adding New Tests Guide](docs/ADDING_NEW_TESTS.md) - Comprehensive guide for adding new test papers
- [Data Structure Documentation](data/README.md) - Database schema and structure details

### React Resources

- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [React documentation](https://reactjs.org/)

## 🔧 Development

### Code Structure

The project follows a modular architecture:

- **Components**: Reusable UI components with TypeScript
- **Pages**: Top-level page components with routing
- **Services**: API and data management layers
- **Types**: Comprehensive TypeScript definitions
- **Context**: Global state management

### Adding Features

1. Follow the existing code patterns
2. Update TypeScript types as needed
3. Test thoroughly with both backend and frontend
4. Update documentation for new features

### Testing

```bash
npm test                    # Run unit tests
npm run build              # Test production build
npm run server && npm start # Test full application
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Server Deployment

1. Ensure Node.js is installed on the server
2. Copy the entire project directory
3. Run `npm install` to install dependencies
4. Use a process manager like PM2 for the backend:
   ```bash
   npm install -g pm2
   pm2 start server.js --name mcq-platform
   ```
5. Serve the built frontend using a web server (nginx, Apache, etc.)

### Environment Variables

Create a `.env` file for configuration:

```
REACT_APP_API_URL=http://localhost:3001
PORT=3000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Bootstrap team for the excellent UI framework
- React team for the powerful frontend library
- Express.js team for the robust backend framework
