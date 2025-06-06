import React from 'react';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#fafae0] text-[#553535] flex flex-col">
      
      {/* Top Navbar */}
      <header className="flex justify-between items-center p-4 shadow-md bg-[#fff5f5]">
        <h1 className="text-2xl font-bold">Lokat</h1>
        <div className="flex gap-4">
          <SecondaryButton text="Login" to="/login" />
          <PrimaryButton text="Register" to="/register" />
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-5xl font-extrabold mb-4">Welcome to Lokat</h2>
        <p className="text-lg max-w-2xl mb-6">
          Lokat is your private location-sharing app. Share your live location every 5 minutes — 
          only with your trusted friends. No stalkers. No nonsense.
        </p>

        <PrimaryButton text="Get Started" to="/dashboard" />

        {/* Project Info */}
        <section className="mt-12 max-w-3xl text-sm opacity-80">
          <p className="mb-2">
            🔐 <strong>Privacy-first:</strong> No permanent storage of your location history. Temporary, encrypted updates.
          </p>
          <p className="mb-2">
            🤝 <strong>Friends-only sharing:</strong> Only approved users can see your location.
          </p>
          <p className="mb-2">
            ⏱️ <strong>Automatic Refresh:</strong> Share your live location every 5 minutes, no manual steps.
          </p>
          <p>
            💡 <strong>Simple UI:</strong> No noise, just a fast, focused interface for real use.
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-xs p-4 opacity-70">
        Built for people who don’t want to be tracked by everyone. Just the right ones.
      </footer>
    </div>
  );
};

export default LandingPage;
