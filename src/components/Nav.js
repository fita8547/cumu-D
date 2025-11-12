import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Nav = () => {
  const location = useLocation();

  const navItems = [
    { name: '사회이슈', path: '/social-issue' },
    { name: '환경', path: '/environmental-problem' },
    { name: '이야기', path: '/writing-idea' },
    { name: '과학', path: '/science' },
    { name: '이벤트', path: '/event' },
  ];

  return (
    <nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;

