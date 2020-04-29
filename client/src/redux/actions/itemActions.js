import axios from 'axios'
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
} from './types'
import { tokenConfig } from './authActions'
import { returnErrors } from './errorActions'

export const getWatchItems = () => (dispatch, getState) => {
  dispatch(setItemsLoading())
  axios
    .get('/api/watchlist', tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_ITEMS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const getHoldItems = () => (dispatch, getState) => {
  dispatch(setItemsLoading())
  axios
    .get('/api/holdlist', tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_ITEMS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const getTotal = () => (dispatch, getState) => {
  dispatch(setItemsLoading())
  axios
    .get('/api/total', tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_TOTAL,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const getWatchItem = (id) => (dispatch, getState) => {
  dispatch(setItemsLoading())
  axios
    .get(`/api/watchlist/${id}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_WATCH_ITEM,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const getHoldItem = (id) => (dispatch, getState) => {
  dispatch(setItemsLoading())
  axios
    .get(`/api/holdlist/${id}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_HOLD_ITEM,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const getIndexes = () => (dispatch, getState) => {
  axios
    .get(`/api/indexes`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: GET_INDEXES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const addWatchItem = (item) => (dispatch, getState) => {
  axios
    .post('/api/watchlist', item, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: ADD_WATCH,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const addHoldItem = (item) => (dispatch, getState) => {
  axios
    .post('/api/holdlist', item, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: ADD_HOLD,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const addPortfolioCash = (item) => (dispatch, getState) => {
  axios
    .post('/api/cash', item, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: ADD_CASH,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const deleteWatchItem = (id) => (dispatch, getState) => {
  axios
    .delete(`/api/watchlist/${id}`, tokenConfig(getState))
    .then((res) =>
      dispatch({
        type: DELETE_ITEM,
        payload: id,
      })
    )
    .catch((err) =>
      dispatch(returnErrors(err.response.data, err.response.status))
    )
}

export const setItemsLoading = () => {
  return {
    type: ITEMS_LOADING,
  }
}
