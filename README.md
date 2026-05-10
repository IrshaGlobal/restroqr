# Restaurant QR Ordering System

A modern restaurant ordering system that allows customers to scan QR codes to view menus, place orders, and track their order status. Built with React, TypeScript, Vite, and Supabase.

## Features

- 📱 Mobile-first responsive design
- 🍽️ Digital menu with categories and items
- 🛒 Shopping cart functionality
- 📋 Order management for staff
- 👥 Staff dashboard with role-based access
- 📊 Analytics and reporting
- 🎨 Customizable themes (light/dark mode)
- 🔐 Secure authentication with Supabase
- 📱 QR code generation for tables

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Routing**: React Router DOM
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd resto
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deployment to Vercel

This project is configured for easy deployment to Vercel:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the Vite configuration
4. Add your environment variables in the Vercel dashboard
5. Deploy!

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── stores/         # Zustand state stores
├── lib/            # Utility functions and configurations
├── styles/         # Global styles
└── ...
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.