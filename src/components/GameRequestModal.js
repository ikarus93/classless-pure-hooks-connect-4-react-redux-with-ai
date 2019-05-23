import React from "react";
import { Modal, Button } from "reactstrap";

export default ({ msg, isOpen, cb }) => {
    return (<Modal isOpen={isOpen} toggle={cb}>
        {msg}
        <Button color="primary" onClick={cb.bind(null, true)}>Accept</Button>
        <Button color="danger" onClick={cb.bind(null, false)}>Reject</Button>
    </Modal>)
}