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
        <div className='right-side'>
        <NavLink to='/spots/new' className='create-spot'>Create a Spot</NavLink>
        {/* <CreateSpotPage to='/spots/new' className='create-spot'>Create a Spot</CreateSpotPage> */}
        <ProfileButton user={sessionUser} />
        </div>
      </li>
      )}
    </ul>
);
}
export default Navigation;
