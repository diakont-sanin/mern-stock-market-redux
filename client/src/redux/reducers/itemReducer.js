import {
  GET_ITEMS,
  DELETE_ITEM,
  ITEMS_LOADING,
  GET_WATCH_ITEM,
  GET_INDEXES,
  ADD_CASH,
  GET_TOTAL,
  ADD_WATCH,
  ADD_HOLD,
  GET_HOLD_ITEM,
} from '../actions/types'
import { createBrowserHistory } from 'history'
const initialState = {
  items: [],
  loading: false,
}
const history = createBrowserHistory()
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ITEMS:
      return {
        ...state,
        items: action.payload,
        loading: false,
      }
    case GET_WATCH_ITEM:
      return {
        ...state,
        ticker: action.payload,
        loading: false,
      }
    case GET_HOLD_ITEM:
      return {
        ...state,
        ticker: action.payload,
        loading: false,
      }
    case GET_INDEXES:
      return {
        ...state,
        indexes: action.payload,
      }
    case GET_TOTAL:
      return {
        ...state,
        total: action.payload,
        loading: false,
      }
    case DELETE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item._id !== action.payload),
      }
    case ADD_HOLD:
      history.go(0)
      return {
        ...state,
        items: [action.payload],
      }

    case ADD_WATCH:
      //history.go(0)
      return {
        ...state,
        items: [action.payload],
      }
    case ADD_CASH:
      return {
        ...state,
        cash: [action.payload],
      }
    case ITEMS_LOADING:
      return {
        ...state,
        loading: true,
      }
    default:
      return state
  }
}
