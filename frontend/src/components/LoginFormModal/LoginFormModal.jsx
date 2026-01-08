import { useState, useEffect, useCallback } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { closeModal } = useModal();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    setCredential("");
    setPassword("");
    setErrors({});
    setIsButtonDisabled(true);
    setIsLoading(false);
  }, []);

  // Validate inputs and update button state
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

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      await dispatch(sessionActions.login({ credential, password }));
      closeModal();
    } catch (res) {
      setIsLoading(false);
      const data = await res.json();
      if (data?.errors) {
        setErrors({ 
          ...data.errors, 
          general: "The provided credentials were invalid" 
        });
      }
    }
  }, [dispatch, credential, password, closeModal]);

  const demoSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await dispatch(sessionActions.login({ 
        credential: 'demo@user.io', 
        password: 'password' 
      }));
      closeModal();
    } catch (error) {
      setIsLoading(false);
      setErrors({ general: "Demo login failed. Please try again." });
    }
  }, [dispatch, closeModal]);

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
            disabled={isLoading}
          />
        </label>
        {errors.credential && (
          <p className="login-form-error">{errors.credential}</p>
        )}
        <label className="login-form-label">
          Password
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-form-input"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </label>
        {errors.password && (
          <p className="login-form-error">{errors.password}</p>
        )}
        <button 
          type="submit" 
          className="login-form-button" 
          disabled={isButtonDisabled || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Logging in...
            </>
          ) : (
            'Log In'
          )}
        </button>
        <div className='demo-user'>
          <a onClick={(e) => demoSubmit(e)}>Demo User</a>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
