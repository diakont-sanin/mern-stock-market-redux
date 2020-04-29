import React, { useState } from 'react'
import {
  Button,
  Modal,
  Form,
  FormGroup,
  ButtonGroup,
  Row,
  Col,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { addHoldItem } from '../redux/actions/itemActions'
import { Briefcase } from 'react-bootstrap-icons'
import { Typeahead } from 'react-bootstrap-typeahead'
import { options } from '../tickerbase/symbol.tickerbase'
import AddCash from './AddCash'

const AddHold = ({ isAuthenticated, addHoldItem }) => {
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState({
    ticker: '',
    price: '',
    quantity: '',
    side: 'Buy',
  })

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleToggle = () => setModal(!modal)

  //const handleChangeName = (e) => setName(e.target.value)

  const handleOnSubmit = (e) => {
    e.preventDefault()

    const newItem = {
      ticker: form.ticker,
      price: form.price,
      quantity: form.quantity,
      side: 'Buy',
    }

    addHoldItem(newItem)
    // Close modal
    handleToggle()
  }
  const filterByCallback = (options, props) =>
    String(options.label).toLowerCase().indexOf(props.text.toLowerCase()) !==
      -1 ||
    String(options.fullname).toLowerCase().indexOf(props.text.toLowerCase()) !==
      -1

  return (
    <div>
      {isAuthenticated && (
        <Button variant="link" onClick={handleToggle}>
          <Briefcase size={25} />
        </Button>
      )}

      <Modal show={modal} onHide={handleToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить в портфель</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <Typeahead
                style={{ marginBottom: '1rem' }}
                onKeyDown={(e) => setForm({ ...form, ticker: e.target.value })}
                selectHintOnEnter={true}
                filterBy={filterByCallback}
                id="ticker"
                type="text"
                placeholder="Тикер"
                /*console.log(e.length? e:[{label:''}])*/
                onChange={(e) =>
                  e.length
                    ? setForm({ ...form, ticker: e[0].label })
                    : setForm({ ...form, ticker: [{ label: '' }] })
                }
                name="ticker"
                options={options}
                renderMenuItemChildren={(option) => (
                  <div>
                    {option.fullname}
                    <div>
                      <small>{option.label}</small>
                    </div>
                  </div>
                )}
              />
              <Form.Control
                style={{ marginBottom: '1rem' }}
                required
                type="number"
                placeholder="Цена"
                onChange={changeHandler}
                name="price"
              />
              <Form.Control
                style={{ marginBottom: '1rem' }}
                required
                type="number"
                placeholder="Количество"
                onChange={changeHandler}
                name="quantity"
              />
              <Row>
                <Col xs={4} md={4}>
                  <ButtonGroup
                    style={{ marginBottom: '1rem' }}
                    required
                    type="radio"
                    name="radio"
                    defaultValue={'Buy'}
                    onChange={(e) => setForm({ ...form, side: e })}
                  >
                    <Button value={'Buy'}>Buy</Button>
                    <Button value={'Sell'}>Sell</Button>
                  </ButtonGroup>
                </Col>
                <Col xs={8} md={8}>
                  <AddCash />
                </Col>
              </Row>
              <Button
                variant="secondary"
                onClick={handleOnSubmit}
              >
                Закрыть
              </Button>
              <Button
                variant="primary"
                onClick={handleOnSubmit}
                style={{ marginLeft: '1rem' }}
              >
                Сохранить
              </Button>
            </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  item: state.item,
  isAuthenticated: state.auth.isAuthenticated,
})

export default connect(mapStateToProps, { addHoldItem })(AddHold)
