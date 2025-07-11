import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button as BSButton, Offcanvas } from 'react-bootstrap';
import { PenTool, Home, FileText, User, Tag, Settings } from 'lucide-react';

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Posts', href: '/posts', icon: FileText },
    { name: 'Authors', href: '/authors', icon: User },
    { name: 'Tags', href: '/tags', icon: Tag },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleCloseMobileMenu = () => setShowMobileMenu(false);

  return (
    <>
      <Navbar expand="lg" className="navbar sticky-top" bg="light">
        <Container>
          {/* Brand */}
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <span className="brand-icon">
              <PenTool size={20} />
            </span>
            <span className="d-none d-sm-inline">BlogApp</span>
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <Nav className="mx-auto d-none d-lg-flex">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Nav.Link
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`d-flex align-items-center ${isActive(item.href) ? 'active' : ''}`}
                >
                  <Icon size={18} className="me-2" />
                  {item.name}
                </Nav.Link>
              );
            })}
          </Nav>

          {/* Action Buttons - Desktop */}
          <div className="d-none d-md-flex align-items-center">
            <Link to="/admin" className="me-3">
              <BSButton variant="outline-primary" size="sm" className="d-flex align-items-center">
                <Settings size={16} className="me-2" />
                <span className="d-none d-lg-inline">Admin</span>
              </BSButton>
            </Link>
            <Link to="/create">
              <BSButton variant="primary" size="sm">
                Write Post
              </BSButton>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <BSButton
            variant="outline-secondary"
            className="d-lg-none"
            onClick={() => setShowMobileMenu(true)}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </BSButton>
        </Container>
      </Navbar>

      {/* Mobile Menu Offcanvas */}
      <Offcanvas show={showMobileMenu} onHide={handleCloseMobileMenu} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <span className="d-flex align-items-center">
              <span className="brand-icon me-2">
                <PenTool size={20} />
              </span>
              BlogApp
            </span>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Nav.Link
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className={`d-flex align-items-center py-3 ${isActive(item.href) ? 'active' : ''}`}
                  onClick={handleCloseMobileMenu}
                >
                  <Icon size={18} className="me-3" />
                  {item.name}
                </Nav.Link>
              );
            })}
          </Nav>
          
          <hr className="my-4" />
          
          <div className="d-flex flex-column gap-3">
            <Link to="/admin" onClick={handleCloseMobileMenu}>
              <BSButton variant="outline-primary" className="w-100 d-flex align-items-center justify-content-center">
                <Settings size={16} className="me-2" />
                Admin Dashboard
              </BSButton>
            </Link>
            <Link to="/create" onClick={handleCloseMobileMenu}>
              <BSButton variant="primary" className="w-100">
                Write New Post
              </BSButton>
            </Link>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;