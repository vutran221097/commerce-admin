import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CustomModal = (props) => {
    const { show, title, onClose, onSubmit, submitText } = props
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {props.children}
            </Modal.Body>

            <Modal.Footer>
                <Button variant="secondary" onClick={() => onClose()}>Close</Button>
                <Button variant={`${submitText === 'Delete' ? 'danger' : 'success'}`} onClick={() => onSubmit()}>{submitText}</Button>
            </Modal.Footer>
        </Modal>

    )
}

export default CustomModal