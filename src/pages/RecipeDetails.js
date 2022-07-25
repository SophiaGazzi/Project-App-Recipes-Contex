import React, { useContext } from 'react';
import ReceitasContext from '../hooks/ReceitasContext';

import useActualPath from '../hooks/useActualPath';
import useDetails from '../hooks/useDetails';

function RecipeDetails() {
  const actualpath = useActualPath();

  useDetails(actualpath);

  const {
    recipesData: { recipeInDetail },
    recipesData,
  } = useContext(ReceitasContext);

  const objLength = Object.keys(recipeInDetail).length;

  const generateIngredients = () => {
    const arrayOfIngredients = Object.keys(recipeInDetail)
      .filter((str) => str.includes('strIngredient'))
      .map((item) => recipeInDetail[item])
      .filter((recipe) => recipe !== null);
    const arrayOfMeasures = Object.keys(recipeInDetail)
      .filter((str) => str.includes('strMeasure'))
      .map((item) => recipeInDetail[item])
      .filter((recipe) => recipe !== null);
    return (
      arrayOfIngredients.map((ingredient, index) => (
        <p
          key={ index }
          data-testid={ `${index}-ingredient-name-and-measure` }
        >
          {ingredient}
          {' '}
          {arrayOfMeasures[index]}

        </p>
      ))
    );
  };

  const itemTitle = actualpath.includes('food')
    ? recipeInDetail.strMeal : recipeInDetail.strDrink;

  const imgUrl = actualpath.includes('food')
    ? recipeInDetail.strMealThumb : recipeInDetail.strDrinkThumb;

  const category = recipeInDetail.strCategory;

  const videoUrl = actualpath.includes('food')
    ? recipeInDetail.strYoutube : '';

  const alcohol = actualpath.includes('drink') ? recipeInDetail.strAlcoholic : null;

  const recomendations = actualpath.includes('food')
    ? recipesData.drinksData : recipesData.foodData;

  const maxSliderNum = 6;

  const generateRecomendations = () => {
    const recomendedItems = recomendations
      .filter((_, recIndex) => recIndex < maxSliderNum)
      .map((item, index) => {
        if (item.strDrink) {
          return (
            <div
              key={ item.idDrink }
              className="recomendCard"
              data-testid={ `${index}-recomendation-card` }
            >
              <img
                src={ item.strDrinkThumb }
                alt="thumbnail"
                className="sliderImg"

              />
              <p
                data-testid={ `${index}-recomendation-title` }
              >
                {item.strDrink}

              </p>
            </div>
          );
        }
        return (
          <div
            key={ item.idMeal }
            data-testid={ `${index}-recomendation-card` }
            className="recomendCard"
          >
            {console.log('entrou no return')}
            <img src={ item.strMealThumb } alt="thumbnail" />
            <p
              key={ item.idMeal }
              data-testid={ `${index}-recomendation-title` }
            >
              {item.strMeal}

            </p>
          </div>
        );
      });
    return recomendedItems;
  };

  return (
    <main>
      <div id="detailContainer">
        {
          (objLength)
            ? <h1 data-testid="recipe-title">{itemTitle}</h1>
            : <h1>loading...</h1>
        }
        <img
          src={ imgUrl }
          alt="thumbnail"
          data-testid="recipe-photo"
          className="containerImg"
        />
        <p data-testid="recipe-category">
          Category:
          {category}
          {' '}
          {' '}
          {alcohol}
        </p>
        <p>Ingredients:</p>
        {generateIngredients()}
        <p data-testid="instructions">{recipeInDetail.strInstructions}</p>
        <div className="embedContainer">
          <iframe
            data-testid="video"
            width="853"
            height="480"
            src={ videoUrl?.replace('watch?v=', 'embed/') }
            frameBorder="0"
            allow="autoplay;
            encrypted-media;
            gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"

          />
        </div>
        <div className="recomendations">
          {generateRecomendations()}
        </div>
      </div>
      <button
        type="button"
        data-testid="start-recipe-btn"
        className="startBtn"
      >
        Start Recipe

      </button>
    </main>
  );
}

export default RecipeDetails;
