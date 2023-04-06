import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useMatch, useNavigate} from "react-router-dom";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../axiosInstance.js";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../features/user/userSlice.js";

export default function Header() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isPlayer = useSelector(state => state.user.isPlayer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isProfile = Boolean(useMatch('/profile')) || Boolean(useMatch('/update-password'));

    function logout() {
        axiosInstance.post('api/token/blacklist/', {
            refresh: localStorage.getItem('refresh_token')
        });
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');
        dispatch(userLogout());
        Notify.success('Successful logout', {
            position: 'center-bottom',
        });
        navigate('/login');
    }

    return (
        <Navbar bg="light" expand="lg" className="shadow">
            <Container>
                <Navbar.Brand>FFRM</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" active={Boolean(useMatch('/'))}>Home</Nav.Link>
                        {
                            isAuthenticated
                            &&
                            <NavDropdown title="Reservations" active={isProfile}>
                                {
                                    isPlayer
                                    &&
                                    <NavDropdown.Item as={Link} to="/reservations/available"
                                                      active={Boolean(useMatch('/reservations/available'))}
                                    >Available</NavDropdown.Item>
                                }
                            </NavDropdown>
                        }
                    </Nav>
                    <Nav>
                        {isAuthenticated ?
                            (<>
                                <NavDropdown title="Profile" active={isProfile}>
                                    <NavDropdown.Item as={Link} to="/profile"
                                                      active={Boolean(useMatch('/profile'))}
                                    >Information</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/update-password"
                                                      active={Boolean(useMatch('/update-password'))}
                                    >Update password</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link onClick={logout}>Logout</Nav.Link>
                            </>)
                            :
                            (<>
                                <Nav.Link as={Link} to="/login"
                                          active={Boolean(useMatch('/login'))}>Login</Nav.Link>
                                <Nav.Link as={Link} to="/register"
                                          active={Boolean(useMatch('/register'))}>Register</Nav.Link>
                            </>)
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}