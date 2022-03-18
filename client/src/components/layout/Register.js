import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";
import { Button, Form, Card, Container } from "react-bootstrap";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { name, email, password, password2, errors } = this.state;

    return (
      <>
        <Container className="d-flex flex-column align-items-center">
          <Card className="shadow w-50 mt-5">
            <Link
              to="/"
              class="text-decoration-none text-white bg-dark pl-5 pt-3"
            >
              <i className="fa fa-arrow-circle-left  "></i> Back to Home
            </Link>
            <Card.Header className="pl-5 pt-3 pb-2 bg-dark text-white">
              <h2>
                <strong>Register</strong>
              </h2>
            </Card.Header>
            <Card.Body className="px-5">
              <Form onSubmit={this.onSubmit}>
                <Form.Group className="mt-2 mb-3">
                  <Form.Control
                    type="text"
                    id="name"
                    placeholder="Name"
                    value={name}
                    error={errors.name}
                    onChange={this.onChange}
                    className={classnames("form-control", {
                      invalid: errors.name,
                    })}
                    isInvalid={!!errors.name}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-2 mb-3">
                  <Form.Control
                    type="email"
                    id="email"
                    placeholder="Email Address"
                    value={email}
                    error={errors.email}
                    onChange={this.onChange}
                    className={classnames("form-control", {
                      invalid: errors.email,
                    })}
                    isInvalid={!!errors.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-2 mb-3">
                  <Form.Control
                    type="password"
                    id="password"
                    placeholder="Password"
                    value={password}
                    error={errors.password}
                    onChange={this.onChange}
                    className={classnames("form-control", {
                      invalid: errors.password,
                    })}
                    isInvalid={!!errors.password}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mt-2 mb-3">
                  <Form.Control
                    type="password"
                    id="password2"
                    placeholder="Confirm Password"
                    value={password2}
                    error={errors.password2}
                    onChange={this.onChange}
                    className={classnames("form-control", {
                      invalid: errors.password2,
                    })}
                    isInvalid={!!errors.password2}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password2}
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-flex flex-column align-items-center mt-3">
                  <Button variant="primary" type="submit">
                    Sign up
                  </Button>
                </div>
                <div className="text-center mt-3">
                  Already have an account?{" "}
                  <Link to="/login" class="text-decoration-none">
                    Login here
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
