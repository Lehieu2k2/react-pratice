import axios from "axios";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import {deleteUser} from "../services/UserService"
import { toast } from "react-toastify";

const ModalConfirm = (props) =>{
    const {handleClose, show, dataUserDelete, handleDeleteTableFromModal} = props;

    const confirmDelete = async() => {
        let res = await deleteUser(dataUserDelete.id)
        if(res && +res.statusCode === 204) {
            handleDeleteTableFromModal(dataUserDelete)
            handleClose()
            toast.success('Delete successfully')
        } else {
            toast.error('Try again');
        }
    }
    return (
        <>
          <Modal 
          show={show} 
          onHide={handleClose}
          backdrop="static"
          keyboard="false"
          >
            <Modal.Header closeButton>
              <Modal.Title>Add new user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to delete this 
                <br />
                <span>Email : {dataUserDelete.email} ?</span>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} >
                Close
              </Button>
              <Button variant="primary" onClick={() => confirmDelete()}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
}
export default ModalConfirm;