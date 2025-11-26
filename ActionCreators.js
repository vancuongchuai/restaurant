import * as ActionTypes from './ActionTypes';
import { baseUrl } from '../shared/baseUrl';

// ======================================================
// LEADERS
// ======================================================

export const fetchLeaders = () => (dispatch) => {
  dispatch(leadersLoading());

  setTimeout(() => {
    return fetch(baseUrl + 'leaders')
      .then((response) => {
        if (!response.ok)
          throw Error('Error ' + response.status + ': ' + response.statusText);
        return response.json();
      })
      .then((leaders) => dispatch(addLeaders(leaders)))
      .catch((error) => dispatch(leadersFailed(error.message)));
  }, 2000);
};

const leadersLoading = () => ({
  type: ActionTypes.LEADERS_LOADING
});

const leadersFailed = (errmess) => ({
  type: ActionTypes.LEADERS_FAILED,
  payload: errmess
});

const addLeaders = (leaders) => ({
  type: ActionTypes.ADD_LEADERS,
  payload: leaders
});

// ======================================================
// DISHES
// ======================================================

export const fetchDishes = () => (dispatch) => {
  dispatch(dishesLoading());

  setTimeout(() => {
    return fetch(baseUrl + 'dishes')
      .then((response) => {
        if (!response.ok)
          throw Error('Error ' + response.status + ': ' + response.statusText);
        return response.json();
      })
      .then((dishes) => dispatch(addDishes(dishes)))
      .catch((error) => dispatch(dishesFailed(error.message)));
  }, 2000);
};

const dishesLoading = () => ({
  type: ActionTypes.DISHES_LOADING
});

const dishesFailed = (errmess) => ({
  type: ActionTypes.DISHES_FAILED,
  payload: errmess
});

const addDishes = (dishes) => ({
  type: ActionTypes.ADD_DISHES,
  payload: dishes
});

// ======================================================
// PROMOTIONS
// ======================================================

export const fetchPromos = () => (dispatch) => {
  dispatch(promosLoading());

  setTimeout(() => {
    return fetch(baseUrl + 'promotions')
      .then((response) => {
        if (!response.ok)
          throw Error('Error ' + response.status + ': ' + response.statusText);
        return response.json();
      })
      .then((promos) => dispatch(addPromos(promos)))
      .catch((error) => dispatch(promosFailed(error.message)));
  }, 2000);
};

export const promosLoading = () => ({
  type: ActionTypes.PROMOS_LOADING
});

export const promosFailed = (errmess) => ({
  type: ActionTypes.PROMOS_FAILED,
  payload: errmess
});

export const addPromos = (promos) => ({
  type: ActionTypes.ADD_PROMOS,
  payload: promos
});

// ======================================================
// FAVORITES
// ======================================================

export const postFavorite = (dishId) => (dispatch) => {
  dispatch(addFavorite(dishId));
};

export const addFavorite = (dishId) => ({
  type: ActionTypes.ADD_FAVORITE,
  payload: dishId
});

export const deleteFavorite = (dishId) => ({
  type: ActionTypes.DELETE_FAVORITE,
  payload: dishId
});

// ======================================================
// COMMENTS
// ======================================================

// FETCH COMMENTS
export const fetchComments = () => (dispatch) => {
  dispatch(commentsLoading());

  return fetch(baseUrl + 'comments')
    .then((response) => {
      if (!response.ok)
        throw Error('Error ' + response.status + ': ' + response.statusText);
      return response.json();
    })
    .then((comments) => dispatch(addComments(comments)))
    .catch((error) => dispatch(commentsFailed(error.message)));
};

export const commentsLoading = () => ({
  type: ActionTypes.COMMENTS_LOADING
});

export const commentsFailed = (errmess) => ({
  type: ActionTypes.COMMENTS_FAILED,
  payload: errmess
});

export const addComments = (comments) => ({
  type: ActionTypes.ADD_COMMENTS,
  payload: comments
});

// ADD COMMENT
export const postComment = (dishId, rating, author, comment) => (dispatch) => {
  const newComment = {
    dishId,
    rating,
    author,
    comment,
    date: new Date().toISOString()
  };

  return fetch(baseUrl + 'comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newComment)
  })
    .then((response) => {
      if (!response.ok)
        throw Error('Error ' + response.status + ': ' + response.statusText);
      return response.json();
    })
    .then((serverComment) => {
      dispatch(addComment(serverComment));   // Cập nhật Redux ngay lập tức
    })
    .catch((error) => dispatch(commentsFailed(error.message)));
};

// ACTION ADD COMMENT
export const addComment = (comment) => ({
  type: ActionTypes.ADD_COMMENT,
  payload: comment
});
