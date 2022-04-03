import React, { useState, useEffect } from "react";
import { QRCode } from "react-qr-svg";
import {
  Alert,
  Card,
  Container,
  Accordion,
  Button,
  Toast,
  ToastContainer,
  Row,
  Col,
  Table,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";
import socketio from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

require("dotenv").config();
const LOCAL_IP = process.env.REACT_APP_LOCAL_IP;
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT;

const Verification = () => {
  const localUserData = useSelector((state) => state.auth.user);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [toastMssg, setToastMssg] = useState("");
  const [sharedCreds, setSharedCred] = useState([]);

  useEffect(() => {
    axios
      .get("http://" + LOCAL_IP + ":" + BACKEND_PORT + "/api/users/info", {
        params: {
          email: localUserData.email,
        },
      })
      .then((response) => {
        axios
          .get("http://" + LOCAL_IP + ":" + BACKEND_PORT + "/api/users/info", {
            params: {
              email: "admin@admin.com",
            },
          })
          .then((res) => {
            console.log(res.data);
            setQrCode(
              JSON.stringify({
                url:
                  "http://" +
                  LOCAL_IP +
                  ":" +
                  BACKEND_PORT +
                  "/api/credential/send",
                userId: response.data.studentId,
                receiverDid: res.data.did,
              })
            );
            axios
              .get(
                "http://" +
                  LOCAL_IP +
                  ":" +
                  BACKEND_PORT +
                  "/api/credential/getByUser/" +
                  localUserData.email
              )
              .then((res) => {
                console.log("cred data:", res.data);
                setSharedCred(res.data.creds);
              });
          });
      });
  }, []);

  const onClick = (event) => {
    event.preventDefault();
    const socketEndpoint = "http://" + LOCAL_IP + ":" + BACKEND_PORT;
    const socket = socketio(socketEndpoint);
    socket.on("connect", () => {
      console.log("connected via socket io");
      socket.emit("checkUpdate", localUserData.email);
    });
    socket.on("credentialUpdated", () => {
      setToastMssg("Credential Access Rights Given");
      setShowQrCode(false);
      socket.disconnect();
    });
    socket.on("credentialAdded", () => {
      setToastMssg("Credential Received");
      setShowQrCode(false);
      socket.disconnect();
    });
    setShowQrCode(true);
  };

  return (
    <>
      <Container className="d-flex flex-column align-items-center w-75">
        <ToastContainer position="top-end" className="p-3">
          <Toast
            show={toastMssg !== ""}
            onClose={() => setToastMssg("")}
            animation={true}
            bg="success"
            position="top-end"
          >
            <Toast.Header
              className="mx-3 my-2 bg-success text-white"
              closeVariant="white"
            >
              <FontAwesomeIcon
                icon={faCheckCircle}
                size="2x"
                className="mr-2"
              />
              <strong className="me-auto"> {toastMssg} </strong>
            </Toast.Header>
          </Toast>
        </ToastContainer>
        {qrCode.receiverDid !== "" ? (
          <>
            <Card className="shadow w-60 mt-5">
              <Card.Body className="px-5 d-flex flex-column align-items-center">
                <h5 className="my-3">
                  Scan the below QR code to verify that you are a student
                </h5>
                {showQrCode ? (
                  <QRCode
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                    level="Q"
                    style={{ width: 256 }}
                    value={qrCode}
                    className="my-4"
                  />
                ) : (
                  <>
                    <Button onClick={onClick}>Display QR Code</Button>
                  </>
                )}
              </Card.Body>
            </Card>
            {sharedCreds.length === 0 ? (
              <Alert variant="info">No Credential has been shared yet</Alert>
            ) : (
              <>
                <Container className="mt-4">
                  <Row className="mt-4">
                    <Col>
                      <Card className="shadow px-1 pt-2">
                        <Card.Title className="primary px-1 pt-2 text-center">
                          <h2 className="text-center mt-2 mb-3">
                            Previously Shared Credentials
                          </h2>
                        </Card.Title>
                        <Card.Body>
                          <Table hover className="text-center">
                            <thead>
                              <tr>
                                <th className="col-3">Credential Name</th>
                                <th className="col-1">User ID</th>
                                <th className="col-1">Time Shared</th>
                                <th className="col-1">Access Given</th>
                              </tr>
                            </thead>
                            <tbody>
                              {sharedCreds.map((cred, index) => {
                                console.log(cred);
                                return (
                                  <>
                                    <tr>
                                      <td>{cred.credName}</td>
                                      <td>{cred.studentId}</td>
                                      <td>{cred.date}</td>
                                      <td>
                                        {cred.credAccess ? (
                                          <FontAwesomeIcon
                                            icon={faCheck}
                                            size="2x"
                                            color="limegreen"
                                          />
                                        ) : (
                                          <FontAwesomeIcon
                                            icon={faXmark}
                                            size="2x"
                                            color="red"
                                          />
                                        )}
                                      </td>
                                    </tr>
                                  </>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </>
            )}
          </>
        ) : (
          <Alert variant="danger" className="mt-5 w-60">
            The admin hasn't created the DID yet
          </Alert>
        )}
      </Container>
    </>
  );
};

export default Verification;
