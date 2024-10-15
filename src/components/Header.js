import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import { Nav } from "react-bootstrap";
import { NavDropdown } from "react-bootstrap";
import logoApp from "../assets/images/logo192.png";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext, useState } from "react";

const Header = (props) => {
  const { logout, user } = useContext(UserContext);

  const [hideHeader, setHideHeader] = useState(false);

  // useEffect(() => {
  //   if (window.location.pathname === "/login") {
  //     setHideHeader(true);
  //   }
  // }, []);
  let location = useLocation();
  const navigate = useNavigate();
  const handleLogOut = () => {
    logout();
    navigate("/");
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={logoApp}
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
          Practice
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* if user already login or in homepage then show header */}
          {(user && user.auth || (window.location.pathname === '/')) && (
            <>
              <Nav className="me-auto">
                <NavLink to="/" className="nav-link">
                  Home
                </NavLink>
                <NavLink to="/users" className="nav-link">
                  Manage Users
                </NavLink>
              </Nav>
              <Nav>
                {user && user.email && (
                  <span className="nav-link">Welcome {user.email}</span>
                )}
                <NavDropdown title="Setting" id="basic-nav-dropdown">
                  {user && user.auth === true ? ( // Check if user already logged in or not
                    <NavDropdown.Item onClick={() => handleLogOut()}>
                      Logout
                    </NavDropdown.Item>
                  ) : (
                    <NavLink to="/login" className="dropdown-item">
                      Login
                    </NavLink>
                  )}
                </NavDropdown>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
