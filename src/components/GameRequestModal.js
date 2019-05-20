import React from "react";
import { Modal, Button } from "reactstrap";

export default ({ msg, isOpen, cb }) => {
    return (<Modal isOpen={isOpen} toggle={cb}>
        {msg}
        <Button color="primary" onClick={}></Button>
        <Button color="danger" onClick={}></Button>
    </Modal>)
}