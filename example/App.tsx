import React from 'react';
import { HeroUIProvider } from "@heroui/react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Navigation } from "./components/Navigation";
import VotingScreen from "./components/VotingScreen";

const App: React.FC = () => {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-primary-900 to-secondary-500 text-foreground relative overflow-hidden">
          <div className="absolute inset-0">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="star"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
              />
            ))}
          </div>
          <Navigation />
          <main className="container mx-auto px-4 py-8 relative z-10">
            <VotingScreen />
          </main>
        </div>
      </ThemeProvider>
    </HeroUIProvider>
  );
};

export default App;