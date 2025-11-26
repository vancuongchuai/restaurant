import * as ActionTypes from './ActionTypes';

export const comments = (
  state = {
    isLoading: true,
    errMess: null,
    comments: []
  },
  action
) => {
  switch (action.type) {

    case ActionTypes.ADD_COMMENTS:
      return {
        ...state,
        isLoading: false,
        errMess: null,
        comments: action.payload
      };

    case ActionTypes.COMMENTS_FAILED:
      return {
        ...state,
        isLoading: false,
        errMess: action.payload,
        comments: []
      };

    case ActionTypes.COMMENTS_LOADING:
      return {
        ...state,
        isLoading: true,
        errMess: null,
        comments: []
      };

    // ⭐⭐⭐ SỬA FULL PHẦN NÀY ⭐⭐⭐
    case ActionTypes.ADD_COMMENT: {
      const newComment = {
        ...action.payload,               // tạo object mới
        id:
          state.comments.length > 0
            ? Math.max(...state.comments.map((c) => c.id)) + 1
            : 1,
        date: new Date().toISOString()
      };

      return {
        ...state,
        comments: [...state.comments, newComment]  // immutable
      };
    }

    default:
      return state;
  }
};
