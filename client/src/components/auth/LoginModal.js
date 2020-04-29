import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { Button, Modal, Form, FormGroup, Alert, NavLink } from 'react-bootstrap'
import { connect } from 'react-redux'
import { login } from '../../redux/actions/authActions'
import { clearErrors } from '../../redux/actions/errorActions'

export const LoginModal = ({ isAuthenticated, error, login, clearErrors }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState(null)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const handleToggle = useCallback(() => {
    // Clear errors
    clearErrors()

    setShow(!show)
  }, [clearErrors, show])

  const handleChangeEmail = (e) => setEmail(e.target.value)
  const handleChangePassword = (e) => setPassword(e.target.value)

  const handleOnSubmit = (e) => {
    e.preventDefault()

    const user = { email, password }
    
    
    // Attempt to login
    login(user)
    
    
  }

  useEffect(() => {
    // Check for login error
    if (error.id === 'LOGIN_FAIL') {
      setMsg(error.msg.msg)
    } else {
      setMsg(null)
    }

    // If authenticated, close modal
    if (show) {
      if (isAuthenticated) {
        handleToggle()
      }
    }
  }, [error, handleToggle, isAuthenticated, show])

  return (
    <>
      <Fragment>
        <NavLink href="#" onClick={handleShow} style={{display:"unset"}}>
          Вход
        </NavLink>
      </Fragment>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Вход</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msg ? <Alert variant="danger">{msg}</Alert> : null}
          <Form>
            <FormGroup>
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={handleChangeEmail}
              />

              <Form.Label htmlFor="password">Пароль</Form.Label>
              <Form.Control
                type="password"
                name="password"
                id="password"
                placeholder="Пароль"
                className="mb-3"
                onChange={handleChangePassword}
              />
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={handleOnSubmit}>
            Войти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error,
})

export default connect(mapStateToProps, { login, clearErrors })(LoginModal)
