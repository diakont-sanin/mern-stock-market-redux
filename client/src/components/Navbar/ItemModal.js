import React, { useState } from 'react'
import { Button, Modal, Form, FormGroup } from 'react-bootstrap'
import { connect } from 'react-redux'
import { addItem } from '../../redux/actions/itemActions'

const ItemModal = ({ isAuthenticated, addItem }) => {
  const [modal, setModal] = useState(false)
  const [name, setName] = useState('')

  const handleToggle = () => setModal(!modal)

  const handleChangeName = (e) => setName(e.target.value)

  const handleOnSubmit = (e) => {
    e.preventDefault()

    const newItem = {
      name,
    }

    addItem(newItem)
    // Close modal
    handleToggle()
  }

  return (
    <div>
      {isAuthenticated && (
        <Button
          variant="primary"
          style={{ marginBottom: '2rem' }}
          onClick={handleToggle}
        >
         Добавить
        </Button>
      )}

      <Modal show={modal} onHide={handleToggle}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormGroup>
              <Form.Label htmlFor="item">Item</Form.Label>
              <Form.Control
                type="text"
                name="name"
                id="item"
                placeholder="Add shopping item"
                onChange={handleChangeName}
              />
              <Button
                color="dark"
                style={{ marginTop: '2rem' }}
                onClick={handleOnSubmit}
                onKeyDown={handleOnSubmit}
              >
                Add Item
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

export default connect(mapStateToProps, { addItem })(ItemModal)
