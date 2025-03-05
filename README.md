# Real Estate Website

A modern real estate website inspired by meqasa.com, built with React and Supabase.

## Features

- Property listings with detailed information
- Advanced search functionality with filters
- User authentication and profiles
- Property submission and management for agents
- Real-time messaging system
- Interactive notifications
- Review and rating system
- Financial tools (Mortgage & Affordability calculators)

## Tech Stack

- Frontend: React with Material-UI
- Backend: Supabase
- Authentication: Supabase Auth
- Database: Supabase PostgreSQL
- Storage: Supabase Storage
- Real-time: Supabase Real-time subscriptions

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd real-estate-website
   ```

2. Install dependencies:
   ```bash
   cd client
   npm install
   ```

3. Create a .env file in the client directory with your Supabase credentials:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm start
   ```

## Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Set up the following tables:
   - users (extends default auth.users)
   - properties
   - messages
   - reviews
   - saved_properties
   - notifications

## Deployment

1. Frontend deployment (Vercel):
   - Connect your GitHub repository
   - Add environment variables
   - Deploy

2. Database:
   - Supabase handles the backend deployment automatically

## Environment Variables

Create a .env file in the client directory with the following:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
