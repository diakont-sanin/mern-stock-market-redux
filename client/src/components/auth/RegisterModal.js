import React, { useState, useEffect, useCallback, Fragment } from 'react'
import { Button, Modal, Form, FormGroup, Alert, NavLink } from 'react-bootstrap'
import { connect } from 'react-redux'
import { register } from '../../redux/actions/authActions'
import { clearErrors } from '../../redux/actions/errorActions'

export const RegisterModal = ({
  isAuthenticated,
  error,
  register,
  clearErrors,
}) => {
  const [name, setName] = useState('')
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

  const handleChangeName = (e) => setName(e.target.value)
  const handleChangeEmail = (e) => setEmail(e.target.value)
  const handleChangePassword = (e) => setPassword(e.target.value)

  const handleOnSubmit = (e) => {
    e.preventDefault()

    const user = { name, email, password }

    // Attempt to login
    register(user)
  }

  useEffect(() => {
    // Check for register error
    if (error.id === 'REGISTER_FAIL') {
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
        <NavLink href="#" onClick={handleShow} style={{display:"unset"}} >
          Регистрация
        </NavLink>
      </Fragment>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Регистрация</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msg ? <Alert variant="danger">{msg}</Alert> : null}
          <Form>
            <FormGroup>
              <Form.Control
                type="text"
                name="name"
                id="name"
                placeholder="Имя"
                className="mb-3"
                onChange={handleChangeName}
              />
              <Form.Control
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                className="mb-3"
                onChange={handleChangeEmail}
              />

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
            Зарегистрироваться
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

export default connect(mapStateToProps, { register, clearErrors })(
  RegisterModal
)
