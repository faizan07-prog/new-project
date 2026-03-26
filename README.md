# Faizan Hassan's Portfolio Website

A full-stack portfolio website built with Node.js, Express, and PostgreSQL, ready for deployment on Render.

## Project Structure

```
.
├── server.js                 # Main Express server
├── frontend/
│   ├── index.html           # HTML template
│   ├── script.js            # Frontend JavaScript
│   └── style.css            # Styling
├── backend/
│   ├── db.js                # PostgreSQL connection configuration
│   └── routes.js            # API routes
├── package.json             # Dependencies
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
└── render.yaml              # Render deployment configuration
```

## Local Setup

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm

### Installation

1. **Clone or navigate to the project directory:**

   ```bash
   cd "path/to/new project"
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file from `.env.example`:**

   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your local PostgreSQL credentials:**

   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   ```

   Or for production:

   ```bash
   npm start
   ```

6. **Access the website:**
   Open http://localhost:3001 in your browser

## Database Setup

The server automatically creates the `contact_messages` table on startup. The table structure is:

```sql
CREATE TABLE contact_messages (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

- **POST /api/contact** - Submit contact form

  ```json
  {
    "name": "Your Name",
    "email": "your.email@example.com",
    "message": "Your message"
  }
  ```

- **GET /api/contact/messages** - Retrieve all contact messages (add authentication in production)

- **GET /health** - Health check endpoint

## Deployment on Render

### Step 1: Push to GitHub

1. Initialize git repository (if not already done):

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a new repository on GitHub and push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Connect your GitHub repository

### Step 3: Deploy with render.yaml

1. Click **"New +"** → **"Blueprint"**
2. Select your repository
3. Render will automatically detect `render.yaml` and create:
   - A web service (Node.js)
   - A PostgreSQL database

4. Configure environment variables if needed and deploy

### Step 4: Get Your URLs

After deployment, Render will provide:

- **Web Service URL**: https://your-app-name.onrender.com
- **Database URL**: Will be automatically set as `DATABASE_URL`

### Manual Deployment Alternative

If you prefer manual setup:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set up environment variables:
   - `NODE_ENV`: production
   - `DATABASE_URL`: Use Render's database
4. Create a PostgreSQL database on Render
5. Deploy

## Environment Variables for Production

On Render, set these variables:

- `NODE_ENV=production`
- `DATABASE_URL=<Render PostgreSQL connection string>`
- `FRONTEND_URL=<Your Render domain>`
- `PORT=3001`

## Important Notes

1. **SSL Connection**: Production environment automatically uses SSL for database connection
2. **CORS**: Configured to accept requests from `FRONTEND_URL`
3. **Static Files**: Frontend is served from the same server
4. **Database Initialization**: Tables are created automatically on first run

## Security Recommendations

Before production deployment:

- Add authentication for `/api/contact/messages` endpoint
- Implement rate limiting on contact form
- Add input validation and sanitization
- Set up email notifications for new messages
- Enable HTTPS (Render does this automatically)

## Troubleshooting

**Connection Error to Database:**

- Ensure `DATABASE_URL` is correctly set
- Check if PostgreSQL is running locally
- For Render, wait a few minutes after deployment for database to be ready

**Port Issues:**

- Change `PORT` in `.env` if 3001 is already in use
- Render automatically handles port assignment

**Static Files Not Loading:**

- Ensure `frontend/` folder contains your assets
- Check the `express.static` path in `server.js`

## Support

For issues or questions, check the respective documentation:

- [Express.js](https://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Render Docs](https://render.com/docs)
