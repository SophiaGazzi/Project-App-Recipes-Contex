import React from 'react';
import Header from '../components/Header';
import underConstrucion from '../images/under_construction.svg';
import Footer from '../components/Footer';

function Recipes() {
  return (
    <div>
      <Header />
      <img
        src={ underConstrucion }
        alt="site em construção..."
        className="under_construction"
      />
      <h4>mulheres e homens trabalhando!</h4>
      <Footer />
    </div>
  );
}

export default Recipes;
