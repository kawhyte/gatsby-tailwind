import PropTypes from "prop-types";
import React from "react";
import Footer from "./footer";

import Header from "./header";

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen font-sans  text-gray-900">
      <Header />

      <main className="flex-1 w-full container  px-4 py-8 mx-auto md:px-12 md:py-16">
        {children}
      </main>
      <Footer />

      
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
