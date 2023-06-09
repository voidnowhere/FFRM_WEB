import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {Link, useMatch, useNavigate} from "react-router-dom";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import axiosInstance from "../axiosInstance.js";
import {useDispatch, useSelector} from "react-redux";
import {userLogout} from "../features/user/userSlice.js";
import logo from '../assets/logo.png';

export default function Header() {
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const isPlayer = useSelector(state => state.user.isPlayer);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isProfile = Boolean(useMatch('/profile')) || Boolean(useMatch('/update-password'));
    const isReservations = Boolean(useMatch('/reservations')) || Boolean(useMatch('/reservations/available'));
    const isOwner = useSelector(state => state.user.isOwner);

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
        <Navbar bg="light" expand="lg" className="shadow" style={{display: "block"}}>
            <Container>
                <Navbar.Brand>
                    <img src={logo} width="30" height="30" alt="Logo"/>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/" active={Boolean(useMatch('/'))}>Home</Nav.Link>
                        {
                            !isOwner
                            &&
                            <Nav.Link as={Link} to="/booking" active={Boolean(useMatch('/booking'))}>Booking</Nav.Link>
                        }
                        {
                            isAuthenticated && isOwner
                            &&
                            <>
                                <Nav.Link as={Link} to="/field-types" active={Boolean(useMatch('/field-types'))}
                                >Field types</Nav.Link>
                                <Nav.Link as={Link} to="/fields" active={Boolean(useMatch('/fields'))}
                                >Fields</Nav.Link>
                                <Nav.Link as={Link} to="/paid-reservations" active={Boolean(useMatch('/paid-reservations'))}
                                >Reservations</Nav.Link>
                            </>
                        }
                        {
                            isAuthenticated && isPlayer
                            &&
                            <NavDropdown title="Reservations" active={isReservations}>
                                <NavDropdown.Item as={Link} to="/reservations"
                                                  active={Boolean(useMatch('/reservations'))}
                                >Reservations</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/reservations/available"
                                                  active={Boolean(useMatch('/reservations/available'))}
                                >Available</NavDropdown.Item>
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
