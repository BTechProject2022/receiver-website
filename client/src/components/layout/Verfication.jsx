import React, { useState, useEffect } from "react";
import { QRCode } from "react-qr-svg";
import { Alert, Card, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

require("dotenv").config();
const LOCAL_IP = process.env.REACT_APP_LOCAL_IP;
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT;

const Verification = () => {
  const localUserData = useSelector((state) => state.auth.user);
  const [qrCode, setQrCode] = useState("");

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
          });
      });
  }, []);

  return (
    <>
      <Container className="d-flex flex-column align-items-center">
        {qrCode.receiverDid !== "" ? (
          <Card className="shadow w-60 mt-5 mb-5">
            <Card.Body className="px-5 d-flex flex-column align-items-center">
              <h5 className="my-3">
                Scan the below QR code to verify that you are a student
              </h5>
              <QRCode
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="Q"
                style={{ width: 256 }}
                value={qrCode}
                className="my-4"
              />
            </Card.Body>
          </Card>
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
