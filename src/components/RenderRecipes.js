import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';
import ReceitasContext from '../hooks/ReceitasContext';
import useNumberOfCards from '../hooks/useNumberOfCards';

function RenderRecipes() {
  const history = useHistory();
  const actualPath = history.location.pathname;
  const { recipesData, categoriesFoods, categoriesDrinks } = useContext(ReceitasContext);
  const numberOfCards = useNumberOfCards();
  console.log(actualPath);

  const getId = (recipe) => {
    if (actualPath === '/foods') {
      const { idMeal } = recipe;
      return `/foods/${idMeal}`;
    }
    if (actualPath === '/drinks') {
      const { idDrink } = recipe;
      return `/drinks/${idDrink}`;
    }
  };

  const renderCards = (recipes, recipeName, thumb) => recipes.map((recipe, index) => {
    const id = getId(recipe);
    return (
      <Link to={ id } key={ `${recipe}_${index}` } className="linkCard">
        <article
          data-testid={ `${index}-recipe-card` }
          className="recipeCard"
        >
          <img
            data-testid={ `${index}-card-img` }
            src={ recipe[thumb] }
            alt={ `thumb of ${recipe[recipeName]}` }
          />
          <h3 data-testid={ `${index}-card-name` }>{ recipe[recipeName] }</h3>
        </article>
      </Link>
    );
  });

  const getRecipesCards = (recipesKind) => {
    if (recipesKind === 'food') {
      const recipes = [...recipesData.foodData].slice(0, numberOfCards);
      const thumb = 'strMealThumb';
      const recipeName = 'strMeal';
      return renderCards(recipes, recipeName, thumb);
    }

    if (recipesKind === 'drinks') {
      const recipes = [...recipesData.drinksData].slice(0, numberOfCards);
      const thumb = 'strDrinkThumb';
      const recipeName = 'strDrink';
      return renderCards(recipes, recipeName, thumb);
    }
  };

  const categoriesBtn = (array) => array.map((category, index) => (
    <button
      type="button"
      key={ `${category.strCategory}_${index}` }
      data-testid={ `${category.strCategory}-category-filter` }
    >
      {category.strCategory}
    </button>
  ));

  return (
    <div className="cardGrid">
      {
        actualPath === '/foods'
          ? categoriesBtn(categoriesFoods)
          : categoriesBtn(categoriesDrinks)
      }

      {
        (actualPath === '/foods')
          ? getRecipesCards('food')
          : getRecipesCards('drinks')
      }
    </div>
  );
}

export default RenderRecipes;
