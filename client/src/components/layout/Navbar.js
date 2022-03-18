import React from "react";
import { Button, Container, Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../actions/authActions";

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const onLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
  };
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <h4>Receiver Website</h4>
          </Navbar.Brand>
          {isAuthenticated && (
            <>
              <Nav className="me-auto">
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>
                {user.isAdmin && (
                  <>
                    <Nav.Link href="/createDid">DID</Nav.Link>
                    <Nav.Link href="/credentials">Credentials</Nav.Link>
                  </>
                )}
                {!user.isAdmin && (
                  <>
                    <Nav.Link href="/verification">Verification</Nav.Link>
                  </>
                )}
              </Nav>
              <Navbar.Collapse className="justify-content-end">
                <div className="text-light mr-3">Signed in as: {user.name}</div>
                <Button onClick={onLogout} variant="light">
                  Logout
                </Button>
              </Navbar.Collapse>
            </>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default NavBar;
