import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { InputGroup , Button , Form , Card , Container } from "react-bootstrap";

class Login extends Component{
    constructor(){
        super()
        this.state = {
            email:"",
            password:"",
            errors:{}
        }
    }
    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
          this.props.history.push("/dashboard");
        }
      }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
          this.props.history.push("/dashboard"); 
        }
        
    if (nextProps.errors) {
          this.setState({
            errors: nextProps.errors
          });
        }
      }

    onChange = e => {
        this.setState({[e.target.id]:e.target.value})
    }

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            email:this.state.email,
            password:this.state.password,
        }
        this.props.loginUser(userData);
    }
    render(){
        const {email, password, errors} = this.state;
        return(<>
        <Container className="d-flex flex-column align-items-center">
        <Card className="shadow w-50 mt-5">
            <Link to="/" class="text-decoration-none text-white bg-dark pl-5 pt-3"><i className="fa fa-arrow-circle-left  "></i> Back to Home</Link>
            <Card.Header className='pl-5 pt-3 pb-2 bg-dark text-white'>
                <h2><strong>Login</strong></h2>
            </Card.Header>
            <Card.Body className='px-5'>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group className="mt-2 mb-3">
                        <Form.Control
                            type="email" 
                            id="email"
                            placeholder="Email Address" 
                            value={email} 
                            error={errors}
                            onChange={this.onChange}
                            isInvalid={!!errors.email || !!errors.emailnotfound}
                        />
                        <Form.Control.Feedback type='invalid'>
                            {errors.email}
                            {errors.emailnotfound}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mt-3 mb-3">
                        <InputGroup>
                            <Form.Control
                                type="password"
                                id="password" 
                                placeholder="Password" 
                                value={password} 
                                error={errors}
                                onChange={this.onChange}
                                className={classnames("form-control", {
                                    invalid: errors.password || errors.passwordincorrect })}
                                isInvalid={!!errors.password || !!errors.passwordincorrect}
                            />
                            <Form.Control.Feedback type='invalid'>
                                {errors.password}
                                {errors.passwordincorrect}
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <div className='d-flex flex-column align-items-center mt-3'>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </div>
                    <div className="text-center mt-3">Don't have an account? <Link to="/register" class="text-decoration-none">Register</Link></div>
                </Form>
            </Card.Body>
        </Card>
        </Container>
        </>)
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
  };
  
  const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
  });

  export default connect(
    mapStateToProps,
    { loginUser }
  )(Login);