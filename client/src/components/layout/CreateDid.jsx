import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Row,
  Col,
  FormControl,
  Button,
  Form,
  Card,
  Container,
} from "react-bootstrap";
import PulseLoader from "react-spinners/PulseLoader";

require("dotenv").config();
const LOCAL_IP = process.env.REACT_APP_LOCAL_IP;
const BACKEND_PORT = process.env.REACT_APP_BACKEND_PORT;

const CreateSchema = () => {
  const [isLoading, setIsLoading] = useState(false);
  const userEmail = useSelector((state) => state.auth.user.email);
  const [user, setUser] = useState({
    orgName: "",
    address: "",
    publicKey: "",
    privateKey: "",
    did: "",
  });

  const [input, setInput] = useState({
    orgName: "",
    address: "",
    publicKey: "",
    privateKey: "",
  });

  useEffect(() => {
    axios
      .get("http://" + LOCAL_IP + ":" + BACKEND_PORT + "/api/users/info", {
        params: {
          email: userEmail,
        },
      })
      .then((data) => {
        data = data.data;
        setUser({
          orgName: data.orgName,
          address: data.address,
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          did: data.did,
        });
      });
  }, []);

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post("http://" + LOCAL_IP + ":" + BACKEND_PORT + "/api/did/create", {
        email: userEmail,
        orgName: input.orgName,
        address: input.address,
        publicKey: input.publicKey,
        privateKey: input.privateKey,
      })
      .then((res) => res.data)
      .then((data) => {
        console.log("data:", data.did);
        setUser({
          orgName: data.orgName,
          address: data.address,
          publicKey: data.publicKey,
          privateKey: data.privateKey,
          did: data.did,
        });
        setInput({
          orgName: "",
          address: "",
          publicKey: "",
          privateKey: "",
        });
        setIsLoading(false);
      });
  };

  return (
    <>
      <Container className="d-flex flex-column align-items-center">
        <Card className="shadow w-75 mt-5 mb-5">
          <Card.Header className="pl-5 pt-3 pb-2 d-flex flex-column align-items-center bg-dark text-white">
            <h2>
              <strong>DID</strong>
            </h2>
          </Card.Header>
          <Card.Body className="px-5">
            <Form onSubmit={onSubmit}>
              {isLoading ? (
                <div className="d-flex flex-column align-items-center">
                  <h4>Creating Did</h4>
                  <PulseLoader size="13" margin="5" />
                </div>
              ) : (
                <>
                  {!!user.did ? (
                    <>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Org Name:
                        </Form.Label>
                        <Col sm="10">{user.orgName}</Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          DID:
                        </Form.Label>
                        <Col sm="10">{user.did}</Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Address:
                        </Form.Label>
                        <Col sm="10">{user.address}</Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Public Key:
                        </Form.Label>
                        <Col sm="10">{user.publicKey}</Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Private Key:
                        </Form.Label>
                        <Col sm="10">{user.privateKey}</Col>
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Org Name
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            value={input.orgName}
                            name="orgName"
                            onChange={onChange}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Address
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            value={input.address}
                            name="address"
                            onChange={onChange}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-4">
                        <Form.Label column sm="2">
                          Public Key
                        </Form.Label>
                        <Col sm="10">
                          <FormControl
                            type="text"
                            value={input.publicKey}
                            name="publicKey"
                            onChange={onChange}
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-4">
                        <Form.Label column sm="2">
                          Private Key
                        </Form.Label>
                        <Col sm="10">
                          <FormControl
                            type="text"
                            value={input.privateKey}
                            name="privateKey"
                            onChange={onChange}
                          />
                        </Col>
                      </Form.Group>
                      <div className="d-flex flex-column align-items-center mt-3">
                        <Button variant="primary" type="submit">
                          Submit
                        </Button>
                      </div>
                    </>
                  )}
                </>
              )}{" "}
            </Form>{" "}
          </Card.Body>{" "}
        </Card>
      </Container>
    </>
  );
};

export default CreateSchema;
