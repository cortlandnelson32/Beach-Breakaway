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
          <span className='left-logo'>
          <img className='page-logo' rel="icon" type="image/x-icon" src="/assets/favicon.ico" alt="Beach Breakaway Logo" />
          <h1>Beach Breakaway</h1>
          </span>
        </NavLink>
      </li>
      {isLoaded && (
      <li>
        <div className='right-side'>
        {sessionUser && (
          <NavLink to='/spots/new' className='create-spot'>Create a Spot</NavLink>
        )}
        <ProfileButton user={sessionUser} />
        </div>
      </li>
      )}
    </ul>
);
}
export default Navigation;
