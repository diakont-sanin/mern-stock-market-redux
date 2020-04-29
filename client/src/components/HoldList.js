import React, { useEffect } from 'react'
import { Table, Spinner } from 'react-bootstrap'
import { connect } from 'react-redux'
import { getHoldItems } from '../redux/actions/itemActions'
import { Link } from 'react-router-dom'

const HoldList = ({ getHoldItems, item, isAuthenticated }) => {
  useEffect(() => {
    getHoldItems()
  }, [getHoldItems, isAuthenticated])

  const changePercentDay = (close, open, number) => {
    const result = (((number * close) / (number * open)) * 100 - 100).toFixed(2)
    return result > 0 ? '+' + result : result
  }
  const changeDay = (close, open, number) => {
    const result = (close * number - open * number).toFixed(2)
    return result > 0 ? '+' + result : result
  }
  const changeTotal = (close, number, avg) => {
    const result = (close * number - avg).toFixed(2)
    return result > 0 ? '+' + result : result
  }
  const changeTotalPercent = (close, number, avg) => {
    const result = (((close * number) / 100 / (avg / 100)) * 100 - 100).toFixed(
      2
    )
    return result > 0 ? '+' + result : result
  }

  const { items, loading } = item
console.log(items)
  if (loading)
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner animation="border" />
      </div>
    )
  return (
    <div>
       
       {items.length > 0 ? <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Тикер</th>
            <th>Стоимость</th>
            <th>Изм.день</th>
            <th>Изм.общ</th>
          </tr>
        </thead>

        <tbody>
          {items &&
            items.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link to={`/holdlist/${item._id}`}>
                      {String(item._id).substr(0, 7)}
                    </Link>
                  </td>
                  <td>
                    {(item.c * item.sum).toFixed(2)}
                    <p>{item.avgPrice.toFixed(2)}</p>
                  </td>
                  <td
                    style={
                      changeDay(item.c, item.o, item.sum) < 0
                        ? { color: 'red' }
                        : { color: 'green' }
                    }
                  >
                    {changeDay(item.c, item.o, item.sum)}
                    <p>{changePercentDay(item.c, item.o, item.sum)}%</p>
                  </td>
                  <td
                    style={
                      changeTotal(item.c, item.sum, item.avgPrice) < 0
                        ? { color: 'red' }
                        : { color: 'green' }
                    }
                  >
                    {changeTotal(item.c, item.sum, item.avgPrice)}
                    <p>
                      {changeTotalPercent(item.c, item.sum, item.avgPrice)}%
                    </p>
                  </td>
                </tr>
              )
            })}
        </tbody>
      </Table>:<div>Пока ничего нет</div>}
    </div>
  )
}

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { getHoldItems })(HoldList)
