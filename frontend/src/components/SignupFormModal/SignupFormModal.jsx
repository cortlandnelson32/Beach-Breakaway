import { useState, useEffect } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

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
          />
        </label>
        {errors.lastName && <p className="signup-form-error">{errors.lastName}</p>}
        <label className="signup-form-label">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="signup-form-input"
          />
        </label>
        {errors.password && <p className="signup-form-error">{errors.password}</p>}
        <label className="signup-form-label">
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="signup-form-input"
          />
        </label>
        {errors.confirmPassword && (
          <p className="signup-form-error">{errors.confirmPassword}</p>
        )}
        <button type="submit" className="signup-form-button" disabled={isSubmitDisabled}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
