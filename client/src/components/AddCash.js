import React, { useState } from 'react'
import {
  Accordion,
  Card,
  InputGroup,
  FormControl,
  Button,
} from 'react-bootstrap'
import { connect } from 'react-redux'
import { addPortfolioCash } from '../redux/actions/itemActions'

const AddCash = ({addPortfolioCash}) => {
  const [form, setForm] = useState({
    rub: null,
    usd: null,
  })

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) })
  }

  const handleSubmit =()=>{
    const money ={
        rub:form.rub,
        usd:form.usd
    }  
    addPortfolioCash(money)
  }

  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          + Деньги
        </Accordion.Toggle>

        <Accordion.Collapse eventKey="0">
          <Card.Body>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">₽</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                type="number"
                onChange={changeHandler}
                name="rub"
              />
            </InputGroup>
            <InputGroup size="sm" className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-sm">$</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                required
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                type="number"
                onChange={changeHandler}
                name="usd"
              />
            </InputGroup>
            <Button onClick={handleSubmit} size="sm" variant="outline-info">
              Добавить
            </Button>
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  )
}

const mapStateToProps = (state) => ({
    cash: state.item.cash,
  })

export default connect(mapStateToProps, { addPortfolioCash })(AddCash)