import { useContext } from 'react';
import { ENDPOINT_DETAIL_DRINK, ENDPOINT_DETAIL_FOOD } from './endpoints';
import ReceitasContext from './ReceitasContext';

function useDetails(actualPath) {
  const { setRecipeDetail } = useContext(ReceitasContext);

  const fetchDetails = async (endpoint, key) => {
    const response = await fetch(endpoint);
    const data = await response.json();
    const recipe = data[key][0];
    return setRecipeDetail(recipe);
  };

  if (actualPath.includes('foods')) {
    const removeFoods = 7;
    const id = actualPath.slice(removeFoods);
    const endpoint = ENDPOINT_DETAIL_FOOD + id;
    const key = 'meals';
    return fetchDetails(endpoint, key);
  }

  if (actualPath.includes('drinks')) {
    const removeDrinks = 8;
    const id = actualPath.slice(removeDrinks);
    const endpoint = ENDPOINT_DETAIL_DRINK + id;
    const key = 'drinks';
    return fetchDetails(endpoint, key);
  }

  return console.log('erro');
}

export default useDetails;
