import { useState, useEffect } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  // Reset state when the modal is opened
  useEffect(() => {
    setCredential("");
    setPassword("");
    setErrors({});
    setIsButtonDisabled(true);
  }, []);

  useEffect(() => {
    const newErrors = {};
    if (credential.length > 0 && credential.length < 4) {
      newErrors.credential = 'Username or Email must be at least 4 characters';
    }
    if (password.length > 0 && password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    setIsButtonDisabled(credential.length < 4 || password.length < 6);
  }, [credential, password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors({ ...data.errors, general: "The provided credentials were invalid" });
          setIsButtonDisabled(false);
        }
      });
  };

  const demoSubmit = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential: 'demo@user.io', password: 'password' }))
    .then(closeModal);
  }

  return (
    <>
      <h1 className="login-form-title">Log In</h1>
      {errors.general && (
          <p className="login-form-error">{errors.general}</p>
      )}
      <form className="login-form" onSubmit={handleSubmit}>
        <label className="login-form-label">
          Username or Email
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
            className="login-form-input"
          />
        </label>
        {errors.credential && (
          <p className="login-form-error">{errors.credential}</p>
        )}
        <label className="login-form-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-form-input"
          />
        </label>
        {errors.password && (
          <p className="login-form-error">{errors.password}</p>
        )}
        <button type="submit" className="login-form-button" disabled={isButtonDisabled}>Log In</button>
        <div className='demo-user'>
          <a onClick={(e) => demoSubmit(e)}>Demo User</a>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
