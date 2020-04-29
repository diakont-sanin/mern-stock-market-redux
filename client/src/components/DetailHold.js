import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import { getHoldItem } from '../redux/actions/itemActions'
import { Spinner, Card, Table, Accordion } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Chart } from './Chart'

const DetailHold = ({ getHoldItem, item, ticker, isAuthenticated }) => {
  const link = window.location.pathname.split('/').pop()
  const history = useHistory()
  const pathname = history.location.pathname
  const hasDividend = ticker && ticker[0].dividend.length !== 0

  useEffect(() => {
    getHoldItem(link)
  }, [link, getHoldItem, isAuthenticated, pathname])

  const { loading } = item

  const devidendTable = ticker && ticker[0].dividend[0]
  const price = ticker && ticker[0].chart.W.c.pop()
  const chart = ticker && ticker[0].chart
  const details = ticker && ticker[0].details
  console.log(ticker)
  if (loading)
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner animation="border" />
      </div>
    )
  return (
    <div>
      <Card className="text-center" style={{ fontSize: '0.98rem' }}>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              График
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Chart price={price} chart={chart} />
            </Accordion.Collapse>
          </Card>
          {details && (
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="1">
                О компании
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <Card.Header>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: details.description,
                    }}
                  />
                </Card.Header>
              </Accordion.Collapse>
            </Card>
          )}
          {hasDividend && (
            <Card>
              <Accordion.Toggle as={Card.Header} eventKey="2">
                Дивиденды
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Дата отсечки</th>
                        <th>Дивиденд</th>
                        <th>Процент</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{devidendTable.lastDate}</td>
                        <td>{devidendTable.devidendSize}</td>
                        <td>{devidendTable.percent}</td>
                      </tr>
                    </tbody>
                    <tbody>
                      {devidendTable.previousDividends.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{item.lastDate}</td>
                            <td>{item.devidendSize}</td>
                            <td>{item.percent}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </Table>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          )}
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="3">
              Транзакции
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="3">
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Сделка</th>
                      <th>Кол-во</th>
                      <th>Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticker &&
                      ticker[0].transactions.map((item, index) => {
                        //console.log(item)
                        return (
                          <tr key={index}>
                            <td>
                              {new Date(item.date).toLocaleDateString('ru-RU')}
                            </td>
                            <td
                              style={
                                item.side === 'Buy'
                                  ? { color: 'green' }
                                  : { color: 'red' }
                              }
                            >
                              {item.side}
                            </td>
                            <td>{item.quantity}</td>
                            <td>
                              {item.price}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </Table>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </Card>
    </div>
  )
}

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
  ticker: state.item.ticker,
})

export default connect(mapStateToProps, {
  getHoldItem,
})(DetailHold)
