import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { postCreateUser } from "../services/UserService";
import { toast } from "react-toastify";
import { putUpdateUser } from "../services/UserService";

const ModalEditUser = (props) =>{
    const {handleClose, show, dataUserEdit, handleEditTableFromModal} = props;
    const [job, setJob] = useState("");
    const [name, setName] = useState("");

    const handleEditUser = async () => {
        let res = await putUpdateUser(name, job);
        if(res && res.updatedAt) {
            handleEditTableFromModal({
                first_name: name,
                id: dataUserEdit.id,
            }) 
            handleClose();
            toast.success('Updated successfully')
        }
    }

    useEffect(() => {
        if(show) {
            setName(dataUserEdit.first_name)
        }
    },[dataUserEdit])

    console.log(dataUserEdit)
    return (
        <>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add new user</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" value={name} onChange={(event) => setName(event.target.value)}/>
                </div>
                <div className="mb-3">
                    <label className="form-label">Job</label>
                    <input type="text" className="form-control" value={job} onChange={(event) => setJob(event.target.value)}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose} >
                Close
              </Button>
              <Button variant="primary" onClick={() => handleEditUser()}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      );
}
export default ModalEditUser;