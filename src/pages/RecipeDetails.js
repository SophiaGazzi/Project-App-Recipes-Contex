import React, { useContext, useState, useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import ReceitasContext from '../hooks/ReceitasContext';
import useActualPath from '../hooks/useActualPath';
import useDetails from '../hooks/useDetails';
import useCopyToClipBoard from '../hooks/useCopyToClipboard';
import useFavoriteButton from '../hooks/useFavoriteButton';

function RecipeDetails() {
  const { params: { id } } = useRouteMatch();
  const actualpath = useActualPath();
  const history = useHistory();
  const [isLinkInClipBoard, setLinkInClipBoard] = useState(false);
  const [isFavorite, setFavorite] = useState(false);
  const { toggleClipboardMessage } = useCopyToClipBoard(isLinkInClipBoard);
  const { getFavoriteButton } = useFavoriteButton();

  useDetails(actualpath);

  useEffect(() => {
    const favorites = localStorage.getItem('favoriteRecipes');
    const favoriteRecipes = JSON.parse(favorites);
    if (favoriteRecipes !== null && favoriteRecipes.some((item) => item.id === id)) {
      setFavorite(true);
    }
  }, [id]);

  const {
    recipesData: { recipeInDetail },
    recipesData,
  } = useContext(ReceitasContext);

  const objLength = Object.keys(recipeInDetail).length;

  const shareClick = () => {
    const url = window.location.href;
    clipboardCopy(url);
    return setLinkInClipBoard(!isLinkInClipBoard);
  };

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

  const checkDoneItem = () => {
    const doneRecipes = localStorage.getItem('doneRecipes');
    const arrayOfDoneRecipes = JSON.parse(doneRecipes);
    if (arrayOfDoneRecipes) {
      return (arrayOfDoneRecipes.some((item) => item.id === id));
    }
    return false;
  };

  const renderTextBtn = () => {
    const inProgressData = localStorage.getItem('inProgressRecipes');
    const inProgressRecipes = JSON.parse(inProgressData);
    if (inProgressRecipes !== null) {
      const mealsId = Object.keys(inProgressRecipes.meals);
      const drinksId = Object.keys(inProgressRecipes.cocktails);
      const testMeals = (mealsId.some((item) => item === id));
      const testDrinks = (drinksId.some((item) => item === id));
      if (testMeals || testDrinks) { return 'Continue Recipe'; }
    }
    return 'Start Recipe';
  };

  const goToInProgress = () => {
    const url = `${actualpath}/in-progress`;
    return history.push(url);
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
          {' '}
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
            allowFullScreen
            title="Embedded youtube"

          />
        </div>
        <div>
          <button type="button" data-testid="share-btn" onClick={ shareClick }>
            { toggleClipboardMessage() }
          </button>
          { getFavoriteButton(isFavorite, setFavorite) }
        </div>
        <div className="recomendations">
          {generateRecomendations()}
        </div>
        {
          (!checkDoneItem()) && (
            <button
              type="button"
              data-testid="start-recipe-btn"
              className="startBtn"
              onClick={ goToInProgress }
            >
              { renderTextBtn() }
            </button>
          )
        }
      </div>
    </main>
  );
}

export default RecipeDetails;
