// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from '../ProfileButton/ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
  <ul>
    <li>
      <NavLink to="/">
        <img className='page-logo' rel="icon" type="image/x-icon" src="/assets/favicon.ico" alt="Beach Breakaway Logo" />
      </NavLink>
    </li>
    {isLoaded && (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    )}
  </ul>
);
}
export default Navigation;
