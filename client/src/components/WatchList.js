import React, { useEffect } from 'react'
import { Table, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getWatchItems } from '../redux/actions/itemActions'
import { Link } from 'react-router-dom'

const WatchList = ({ getWatchItems, item, isAuthenticated }) => {
  

  useEffect(() => {
    getWatchItems()
  }, [getWatchItems, isAuthenticated])

  const changePercent = (close, open) => {
    const result = ((close / open) * 100 - 100).toFixed(2)
    return result < 0 ? `${result}%` : `+${result}%`
  }
  const { items, loading } = item
  if (loading)
    return (
      <div style={{textAlign:"center"}}>
        <Spinner animation="border" />
    </div>
    )
  return (
    <div>
      {items.length > 0 ? (
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Тикер</th>
              <th>Цена</th>
              <th>Изменение %</th>
            </tr>
          </thead>
          <tbody>
            {isAuthenticated &&
              items &&
              items.map(({ _id, ticker, close, open }) => {
                return (
                  <tr key={_id}>
                    <td>
                      <Link to={`/watchlist/${ticker}`}>{ticker}</Link>
                    </td>
                    <td>{close}</td>
                    <td
                      style={
                        close > open ? { color: 'green' } : { color: 'red' }
                      }
                    >
                      {changePercent(close, open)}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </Table>
      ) : (
        <div>Пока ничего нет</div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { getWatchItems })(WatchList)
