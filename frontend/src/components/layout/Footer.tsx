import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { PenTool, Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    blog: [
      { name: 'All Posts', href: '/posts' },
      { name: 'Authors', href: '/authors' },
      { name: 'Tags', href: '/tags' },
      { name: 'Archives', href: '/archives' },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin' },
      { name: 'Create Post', href: '/create' },
      { name: 'Manage Posts', href: '/admin/posts' },
      { name: 'Analytics', href: '/admin/analytics' },
    ],
    support: [
      { name: 'About', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
  };

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: Github },
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
    { name: 'Email', href: 'mailto:contact@blogapp.com', icon: Mail },
  ];

  return (
    <footer className="footer mt-auto py-5">
      <Container>
        <Row className="g-4">
          {/* Brand Section */}
          <Col lg={4} md={6}>
            <div className="footer-brand d-flex align-items-center mb-3">
              <PenTool size={24} className="me-2" />
              BlogApp
            </div>
            <p className="footer-description">
              A modern, feature-rich blog platform built with React and Spring Boot. 
              Share your thoughts, engage with readers, and build your community.
            </p>
            
            {/* Social Links */}
            <div className="social-links">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="social-link"
                    aria-label={social.name}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </Col>

          {/* Blog Links */}
          <Col lg={2} md={6}>
            <div className="footer-section">
              <h5>Blog</h5>
              <ul>
                {footerLinks.blog.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Admin Links */}
          <Col lg={3} md={6}>
            <div className="footer-section">
              <h5>Admin</h5>
              <ul>
                {footerLinks.admin.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>

          {/* Support Links */}
          <Col lg={3} md={6}>
            <div className="footer-section">
              <h5>Support</h5>
              <ul>
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href}>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>

        {/* Bottom Section */}
        <div className="footer-bottom mt-4 pt-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p className="mb-2 mb-md-0">
            © {currentYear} BlogApp. All rights reserved.
          </p>
          <p className="mb-0">
            Built with ❤️ using React & Spring Boot
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;