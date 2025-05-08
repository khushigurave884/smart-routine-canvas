
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t mt-auto py-4">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Daily Task to Smart Notes Converter</p>
      </div>
    </footer>
  );
};

export default Footer;
