// Componenta JSX convertită din HTML
import React, { useState } from 'react';
import './bgHome.css'; // Asigură-te că ai stilurile necesare în acest fișier
const NavigationComponent = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
     
      
      <div className="wrapper">
        <div 
          className="page-header section-dark" 
          style={{
            backgroundImage: "url('https://preview.redd.it/v41wn7nbe7m61.jpg?width=1080&crop=smart&auto=webp&s=c6e5e626fbc5b31e964b7494bb8b9ce7f49bbcac')"
          }}
        >
          <div className="filter"></div>
          <div className="content-center">
            <div className="container">
              <div className="title-brand">
               <h1 
        className="text-green-600"
        style={{
          fontSize: '100px',
          fontWeight: 'bold',
          lineHeight: '1.1',
          letterSpacing: '10px',
          textShadow: '4px 4px 2px rgba(0, 0, 0, 1)',
        }}
      >
        Tree Lives
      </h1>
                <div className="fog-low">
                  <img 
                    src="http://demos.creative-tim.com/paper-kit-2/assets/img/fog-low.png" 
                    alt="Fog effect" 
                  />
                </div>
                <div className="fog-low right">
                  <img 
                    src="http://demos.creative-tim.com/paper-kit-2/assets/img/fog-low.png" 
                    alt="Fog effect" 
                  />
                </div>
              </div>
              <h2 className=" mt-4 text-yellow-400 text-center font-bold "
              style={{letterSpacing: '8px',
                    fontSize: '80px',
                    textShadow: '3px 3px 5px black'


              }}
              >Matter</h2>
            </div>
          </div>
          <div 
            className="moving-clouds" 
            style={{
              backgroundImage: "url('http://demos.creative-tim.com/paper-kit-2/assets/img/clouds.png')"
            }}
          >
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationComponent;