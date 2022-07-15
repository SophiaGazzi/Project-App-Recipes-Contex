import React from 'react';
import underConstrucion from '../images/under_construction.svg';

function RecipeDetails() {
  return (
    <main>
      <img
        src={ underConstrucion }
        alt="site em construção..."
        className="under_construction"
      />
      <h4>mulheres e homens trabalhando!</h4>
    </main>
  );
}

export default RecipeDetails;
