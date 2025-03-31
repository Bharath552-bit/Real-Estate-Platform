# Property Listings Application

A real estate application built with a Django backend and a Next.js frontend. This application allows users to view, filter, and interact with property listings—whether properties are for sale or rent. Users can search, sort, add properties to their wishlist, and contact sellers through an integrated chat system.

## Table of Contents

- [Environment Setup](#environment-setup)
- [Backend Setup (Django)](#backend-setup-django)
- [Frontend Setup (Next.js)](#frontend-setup-nextjs)
- [Running Both Servers](#running-both-servers)
- [Useful Commands](#useful-commands)
  

## Environment Setup

### Prerequisites

- **Python 3.10+** for the Django backend  
- **Node.js 18+** and **npm/yarn** for the Next.js frontend  
- **MySQL Server 8.0+** for database operations  
- **Cloudinary account** for image hosting  
- **Postman** (optional) for API testing  
- **Git** for version control (optional)  
- **VS Code** or **PyCharm** as the IDE  

### Clone the Repository

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

"BACKEND SETUP"

Navigate to the Backend Directory:


cd backend

Create & Activate a Virtual Environment:

python -m venv venv
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

Install Dependencies:

pip install -r requirements.txt
Configure Environment Variables:

Create a .env file in the backend directory with your MySQL and Cloudinary settings:

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=3306
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Migrate & Create Superuser:
python manage.py migrate
python manage.py createsuperuser

Run the Django Server (with ASGI for real-time chat):

python manage.py runserver



"FRONTEND SETUP":

Navigate to the Frontend Directory:
cd ../frontend

Install Dependencies:
npm install
# or
yarn install
Configure Environment Variables:

Create a .env.local file in the frontend directory with the following:

NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_upload_preset
Start the Next.js Development Server:


npm run dev
# or
yarn dev

"RUNNING BOTH SERVERS"

Open two terminal windows:

In the first terminal, navigate to the backend folder and run the Django server.
In the second terminal, navigate to the frontend folder and run the Next.js development server.

Verify that both servers are running:

Frontend: http://localhost:3000
Backend: http://127.0.0.1:8000

"USEFUL COMMANDS"
Backend (Django)
Activate Virtual Environment:
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
Install Dependencies:

pip install -r requirements.txt
Migrate Database:

python manage.py migrate
Create Superuser:

python manage.py createsuperuser
Run Server:

python manage.py runserver
Frontend (Next.js)
Install Dependencies:

npm install
# or
yarn install
Start Development Server:

npm run dev
# or
yarn dev
