Certainly! Here's the updated `README.md` template with the modification in step 3 to include instructions for adding a `service-account.json` file:

```markdown
# 24PDInsight BackEnd

This repository contains the backend code for the 24PDInsight project. The backend is developed using JavaScript and the Express.js framework, and it is deployed on Google Cloud Platform (GCP) using Cloud Run.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Database Setup](#database-setup)
- [Authentication](#authentication)
- [Contributing](#contributing)
- [License](#license)

## Features

- Backend services for 24PDInsight project.
- Developed using Express.js.
- Deployed on Google Cloud Platform (Cloud Run).
- Integration with Google Cloud Storage and Firestore for data management.
- User authentication via Firebase.

## Technology Stack

- **Frontend**: Developed using React.js with Tailwind CSS (found in [24PDInsight-FrontEnd](https://github.com/C241-SA02/24PDInsight-FrontEnd))
- **Backend**: JavaScript, Express.js
- **Deployment**: Google Cloud Platform (Cloud Run, App Engine)
- **Database**: Google Cloud Storage (for audio files), Firestore (for processed results)
- **Authentication**: Firebase

## Setup Instructions

1. **Clone the repository:**

   ```sh
   git clone https://github.com/C241-SA02/24PDInsight-BackEnd.git
   cd 24PDInsight-BackEnd
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Add Firebase service account credentials:**
   
   Download your Firebase service account JSON file (`service-account.json`) from the Firebase console.

   Place the `service-account.json` file in the root directory of this project.

4. **Run the development server:**

   ```sh
   npm start
   ```

## Database Setup

- **Google Cloud Storage**: Used for temporary storage of audio files.
- **Firestore**: Used to store the processed results.

Ensure that your Google Cloud project has these services enabled and configured.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Feel free to modify this template to better suit the specifics of your project.
```