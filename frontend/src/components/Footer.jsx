import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-8 px-6 bg-surface">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Questly</span>
        </div>

        <p className="text-text-secondary text-sm">
          © {new Date().getFullYear()} Questly Inc. All rights reserved.
        </p>

        <div className="flex gap-6">
          <a
            href="#"
            className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-text-secondary hover:text-primary transition-colors text-sm font-medium"
          >
            Support
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
