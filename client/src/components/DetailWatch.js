import React, { useEffect, useState } from 'react'

import { connect } from 'react-redux'
import { getWatchItem, addWatchItem, deleteWatchItem } from '../redux/actions/itemActions'
import { Spinner, Card, Table, Accordion } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import { Star, StarFill } from 'react-bootstrap-icons'
import { Chart } from './Chart'

const DetailWatch = ({
  getWatchItem,
  item,
  ticker,
  isAuthenticated,
  addWatchItem,
  deleteWatchItem,
}) => {
  const { loading } = item
  const link = window.location.pathname.split('/').pop()
  const history = useHistory()
  const pathname = history.location.pathname
  console.log(ticker)
  const exist = (ticker  && ticker[0].item.length === 1) || false
 
  const hasDividend = ticker && ticker[0].dividend.length !== 0

  const [show, setShow] = useState(false)
  const handleAddItem = () => {
    addWatchItem({ name: link })
    setShow(true)
  }
  const handledeleteWatchItem = () => {
    deleteWatchItem(link)
    setShow(false)
  }

  useEffect(() => {
    getWatchItem(link)
  }, [link, getWatchItem, isAuthenticated, pathname])

  useEffect(() => {
    if (exist) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [exist])
  

  const devidendTable = ticker && ticker[0].dividend[0]
  const price = ticker && ticker[0].chart.W.c.pop()
  const chart = ticker && ticker[0].chart
  const details = ticker && ticker[0].details

  if (loading)
    return (
      <div style={{ textAlign: 'center' }}>
        <Spinner animation="border" />
      </div>
    )
  return (
    <div>
      {show && <StarFill size={25} onClick={handledeleteWatchItem} />}
      {!show && <Star size={25} onClick={handleAddItem} />}
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

export default connect(mapStateToProps, { getWatchItem, addWatchItem, deleteWatchItem })(
  DetailWatch
)
