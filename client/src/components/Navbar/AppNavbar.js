import React, { Fragment, useState, useEffect } from 'react'
import {
  Navbar,
  Nav,
  NavItem,
  Container,
  Badge,
  Col,
  Row,
  Spinner,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import RegisterModal from '../auth/RegisterModal'
import LoginModal from '../auth/LoginModal'
import Logout from '../auth/Logout'
import { getIndexes } from '../../redux/actions/itemActions'

import { SearchTicker } from './SearchTicker'
import { Search } from 'react-bootstrap-icons'
import { useHistory } from 'react-router-dom'
import AddHold from '../AddHold'

const AppNavbar = ({ auth, getIndexes, indexes }) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleToggle = () => setIsOpen(!isOpen)
  const [display, setDisplay] = useState(false)
  const history = useHistory()
  const pathname = history.location.pathname
  const authLinks = (
    <Fragment>
      <NavItem>
        <Logout />
      </NavItem>
    </Fragment>
  )

  const guestLinks = (
    <Fragment>
      <NavItem>
        <LoginModal />
      </NavItem>
      <NavItem>
        <RegisterModal />
      </NavItem>
    </Fragment>
  )
  const checkVariant = (profitPercent) => {
    return String(profitPercent).indexOf('-') === 0 ? 'danger' : 'success'
  }

  const formatName = (name) => {
    switch (name) {
      case 'Нефть Brent':
        return 'Brent'
      case 'Инд. МосБиржи':
        return 'ММВБ'
      case 'USD/RUB TOM':
        return 'Рубль'
      case 'S&P 500':
        return 'S&P500'
      default:
        return 'Unknown'
    }
  }

  useEffect(() => {
    getIndexes()
  }, [getIndexes])

  return (
    <div>
      <Navbar color="dark" expand="sm">
      <Container fluid>
          <Navbar.Brand href="/">Мои инвестиции</Navbar.Brand>
          <AddHold />
          <Search size={25} onClick={() => setDisplay(!display)} />
          {display && <SearchTicker />}
          <Navbar.Toggle onClick={handleToggle} />

          <Row>
            <Col>
              <Navbar.Collapse>
                <Nav className="ml-auto">
                  {auth && auth.isAuthenticated ? authLinks : guestLinks}
                </Nav>
              </Navbar.Collapse>
            </Col>
          </Row>
        </Container>
      </Navbar>
      <Container fluid>
      <Row style={{ marginBottom: '1rem' }}>
        {(indexes &&
          indexes.map((item, index) => {
            return (
              <Col
                xs={6}
                md={6}
                key={index}
                style={{ padding: '0', textAlign: 'center' }}
              >
                {formatName(item.shortName)}
                <Badge pill variant={checkVariant(item.profitPercent)}>
                  {item.close} {item.profitPercent}
                </Badge>
              </Col>
            )
          })) || (
          <Col style={{ textAlign: 'center' }}>
            <Spinner animation="grow" />
          </Col>
        )}
      </Row>
      </Container>
      <Nav variant="tabs" defaultActiveKey={pathname}>
        <Nav.Item>
          <Nav.Link href="/watchlist">Вочлист</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/holdlist">Портфель</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link href="/total">Обзор</Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  )
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  indexes: state.item.indexes,
})

export default connect(mapStateToProps, { getIndexes })(AppNavbar)
