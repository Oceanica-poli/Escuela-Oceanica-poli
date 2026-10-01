import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Button,
} from 'react-bootstrap';

const AppNavbar: React.FC = () => {
  const { isAuthenticated, userRole, user, logout } = useAuth();

  const dashboardLink = () => {
    if (userRole === 1) return '/admin';
    if (userRole === 2) return '/profesor';
    return '/estudiante';
  };

  const rolLabel = () => {
    if (userRole === 1) return 'Administrador';
    if (userRole === 2) return 'Profesor';
    return 'Estudiante';
  };

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="sticky-top">
      <Container>
        <BsNavbar.Brand as={Link} to={isAuthenticated ? dashboardLink() : '/login'}>
          🌊 Oceánica
        </BsNavbar.Brand>

        <BsNavbar.Toggle aria-controls="navbar-main" />

        <BsNavbar.Collapse id="navbar-main">
          <Nav className="me-auto">
            {isAuthenticated && (
              <Nav.Link as={Link} to={dashboardLink()}>
                Inicio
              </Nav.Link>
            )}
          </Nav>

          {isAuthenticated && (
            <Nav className="align-items-center gap-3">
              <span className="text-light small">
                {user?.nombres} &mdash; <em>{rolLabel()}</em>
              </span>
              <Button
                variant="outline-light"
                size="sm"
                onClick={logout}
              >
                Cerrar sesión
              </Button>
            </Nav>
          )}
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default AppNavbar;