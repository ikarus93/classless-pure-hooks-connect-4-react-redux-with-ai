import Game from "./components/Game";
import React from 'react';
import ReactDOM from "react-dom";
import "./main.scss";
import ioClient from 'socket.io-client';

let socket = ioClient("/");


ReactDOM.render(<Game socket={socket} />, document.getElementById("app"));

