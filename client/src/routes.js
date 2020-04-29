import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import AppNavbar from './components/Navbar/AppNavbar'
import WatchList from './components/WatchList'
import DetailWatch from './components/DetailWatch'
import HoldList from './components/HoldList'
import TotalPieChart from './components/TotalPieChart'
import DetailHold from './components/DetailHold'
import LoginModal from './components/auth/LoginModal'
import RegisterModal from './components/auth/RegisterModal'
import { Alert } from 'react-bootstrap'

export const useRoutes = (token) => {
  if (token) {
    return (
      <Switch>
        <Route path="/watchlist" exact>
          <WatchList />
        </Route>
        <Route path="/watchlist/:id" exact>
          <DetailWatch />
        </Route>
        <Route path="/holdlist" exact>
          <HoldList />
        </Route>
        <Route path="/holdlist/:id" exact>
          <DetailHold />
        </Route>
        <Route path="/total" exact>
          <TotalPieChart />
        </Route>
        <Redirect to="/watchlist" />
      </Switch>
    )
  }
  return (
    <Switch>
      <Route path="/" exact>
        <AppNavbar />
        <Alert variant="warning">
        Необходим <LoginModal /> или <RegisterModal />
        </Alert>
      </Route>
      <Redirect to="/" />
    </Switch>
  )
}
