import React, { useEffect } from 'react'
import AppNavbar from './components/Navbar/AppNavbar'

import { BrowserRouter as Router } from 'react-router-dom'

import { Provider } from 'react-redux'
import store from './redux/store'
import { loadUser } from './redux/actions/authActions'
import 'bootstrap/dist/css/bootstrap.min.css'

import { useRoutes } from './routes'

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser())
  }, [])
  const auth = store.getState().auth.token
  const token = !!auth
  const routes = useRoutes(token)

  return (
    <Provider store={store}>
      <Router>
        {token && <AppNavbar />}
        <div>{routes}</div>
      </Router>
    </Provider>
  )
}

export default App
