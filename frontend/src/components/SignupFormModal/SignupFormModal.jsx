import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { closeModal } = useModal();

  // Reset state when the modal is opened
  useEffect(() => {
    setEmail("");
    setUsername("");
    setFirstName("");
    setLastName("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    setIsSubmitDisabled(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const newErrors = {};
    if (email.length > 0 && email.length < 2) {
      newErrors.email = "Email is required";
    }
    if (username.length > 0 && username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }
    if (firstName.length > 0 && firstName.length < 2) {
      newErrors.firstName = "First Name is required";
    }
    if (lastName.length > 0 && lastName.length < 2) {
      newErrors.lastName = "Last Name is required";
    }
    if (password.length > 0 && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (confirmPassword.length > 0 && confirmPassword.length < 6) {
      newErrors.confirmPassword = "Confirm Password must be at least 6 characters";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords must match";
    }
    setErrors(newErrors);
    setIsSubmitDisabled(
      email.length < 1 ||
      username.length < 4 ||
      firstName.length < 1 ||
      lastName.length < 1 ||
      password.length < 6 ||
      confirmPassword.length < 6 ||
      password !== confirmPassword
    );
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrors({
        confirmPassword: "Passwords must match"
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      );
      closeModal();
    } catch (res) {
      setIsLoading(false);
      const data = await res.json();
      if (data?.errors) {
        setErrors(data.errors);
      }
    }
  }, [dispatch, email, username, firstName, lastName, password, confirmPassword, closeModal]);

  return (
    <>
      <h1 className="signup-form-title">Sign Up</h1>
      <form className="signup-form" onSubmit={handleSubmit}>
        <label className="signup-form-label">
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="signup-form-input"
            disabled={isLoading}
          />
        </label>
        {errors.email && <p className="signup-form-error">{errors.email}</p>}
        <label className="signup-form-label">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="signup-form-input"
            disabled={isLoading}
          />
        </label>
        {errors.username && <p className="signup-form-error">{errors.username}</p>}
        <label className="signup-form-label">
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="signup-form-input"
            disabled={isLoading}
          />
        </label>
        {errors.firstName && <p className="signup-form-error">{errors.firstName}</p>}
        <label className="signup-form-label">
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="signup-form-input"
            disabled={isLoading}
          />
        </label>
        {errors.lastName && <p className="signup-form-error">{errors.lastName}</p>}
        <label className="signup-form-label">
          Password
          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="signup-form-input"
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
        {errors.password && <p className="signup-form-error">{errors.password}</p>}
        <label className="signup-form-label">
          Confirm Password
          <div className="password-input-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="signup-form-input"
              disabled={isLoading}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
        </label>
        {errors.confirmPassword && (
          <p className="signup-form-error">{errors.confirmPassword}</p>
        )}
        <button 
          type="submit" 
          className="signup-form-button" 
          disabled={isSubmitDisabled || isLoading}
        >
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>
    </>
  );
}

export default SignupFormModal;
