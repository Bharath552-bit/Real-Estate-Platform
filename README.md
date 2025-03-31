<img alt="PropEase - a realestate platform" src="/frontend/public/homepage.png">

<h1 align="center">Propease</h1>

<p align="center">
    RealEstate Platform
</p>


<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#running-locally"><strong>Running Locally</strong></a> ·
</p>
<br/>

## Introduction

The Propease Real Estate Platform, developed under Workcohol, is a full-stack web application designed to streamline property management, buying, and selling through a seamless and interactive interface. With the growing demand for digital real estate solutions, this platform aims to enhance the property search experience by offering features such as real-time property listings, one-on-one chat functionality, mortgage calculations, and wishlist management.

## Features

Here are the core features of the project:

- User Authentication: Secure login and registration using JWT tokens.  
- Property Listings: Browse and view detailed property listings for sale or rent.  
- Filtering & Sorting: Search by location, filter by property type (sell or rent), and sort properties by price.  
- Property Details Page: Detailed view of properties including images, description, and specifications.  
- Wishlist Management: Add or remove properties from your personal wishlist.  
- Real-time Chat: Integrated chat system to directly contact property sellers.  
- Cloudinary Image Uploads: Seamless image management and hosting via Cloudinary.  
- EMI Calculator: Built-in tool to estimate monthly payments for prospective buyers.  
- Responsive Design: Optimized for both desktop and mobile devices using Tailwind CSS and Next.js.

## Tech Stack

Here’s the tech stack used in this project:

- Frontend:
  - Next.js  
  - React  
  - Tailwind CSS  
  - Framer Motion  
- Backend: 
  - Django  
  - Django REST Framework  
  - Django Channels (for real-time chat support)  
- Database: 
  - MySQL Server  
- Authentication:  
  - JWT-based authentication  
- Image Hosting:
  - Cloudinary  
- API Requests:  
  - Axios  

## Screenshots

### Add Property Modal

<img alt="Add Property Modal" src="/frontend/public/addproperty.png">

### Chats

<img alt="Chats" src="/frontend/public/chats.png">

### Chatroom

<img alt="Chatscreen" src="/frontend/public/chatroom.png">

### My dashboard

<img alt="My dashboard" src="/frontend/public/dashboard.png">

### property details

<img alt="property detail" src="/frontend/public/propertydetails.png">


## Running Locally

### Cloning the repository to the local machine.

```bash
git clone
```

### Go to frontend folder

```bash
cd frontend
```

### Installing the dependencies.

```bash
npm install
```

### Running the application.

Then, run the application in the command line and it will be available at `http://localhost:3000`.

```bash
npm run dev
```

### Go to backend

```bash
cd backend
```
###Create & Activate Virtual Environment:
```bash
python -m venv venv
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate
```
###Install Dependencies:
```bash
pip install -r requirements.txt
```

### Storing API key in .env file.

Create a file in backend root directory of project named **.env**. And store your MySQL and cloudinary keys in it, as shown in the .env file.
DB_NAME= "your_db_name"
DB_USER= "your_db_user"
DB_PASSWORD= "your_db_password"
DB_HOST= "localhost"
DB_PORT= "3306"
CLOUDINARY_CLOUD_NAME= "your_cloud_name"
CLOUDINARY_API_KEY= "your_api_key"
CLOUDINARY_API_SECRET= "your_api_secret"

###Migrate Database & Create Superuser:
###Install Dependencies:
```bash
python manage.py migrate
python manage.py createsuperuser
```

###Run the Django Server:
```bash
python manage.py runserver
```



