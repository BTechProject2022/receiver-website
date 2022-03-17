import React, { useState, useEffect } from "react";
import { QRCode } from "react-qr-svg";
import {
  Modal,
  Card,
  Row,
  Col,
  Button,
  Container,
  Table,
  Accordion,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { useSelector } from "react-redux";

require("dotenv").config();
const LOCAL_IP = process.env.REACT_APP_LOCAL_IP;
const PORT = process.env.REACT_APP_PORT;
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT;
const MAIN_BACKEND_PORT = process.env.REACT_APP_MAIN_BACKEND_PORT;

const CredentialList = () => {
  const localUserData = useSelector((state) => state.auth.user);
  const [credList, setCredList] = useState([]);
  const [userData, setUserData] = useState({});
  const [show, setShow] = useState(false);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    axios
      .get("http://" + LOCAL_IP + ":" + BACKEND_PORT + "/api/credential/getAll")
      .then((response) => {
        console.log(response.data.credentials);
        setCredList(response.data.credentials);
      });
  }, []);

  return (
    <>
      <Container className="mt-3 w-75">
        <Accordion>
          <h2 className="text-center my-5">Available Credentials</h2>
          {credList.map((value, ind) => {
            return (
              <Accordion.Item eventKey={ind}>
                <Accordion.Header>
                  <div>
                    <strong>Name</strong> : {value.name}
                    {" | "}
                    <strong>User ID</strong> : {value.id} {" | "}
                    <strong>Time Shared</strong> : {value.date}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  {!value.msg ? (
                    Object.keys(value).map((key, index) => {
                      return (
                        <div>
                          <strong>{key}</strong> : {value[key]}
                        </div>
                      );
                    })
                  ) : (
                    <Alert variant="danger">{value.msg}</Alert>
                  )}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>
      </Container>
    </>
  );
};

export default CredentialList;
