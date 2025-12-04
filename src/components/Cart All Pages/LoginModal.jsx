import React, { useState } from 'react';
import styles from './LoginModal.module.css';
import { FcGoogle } from 'react-icons/fc';
import { MdClose, MdEmail, MdLock } from 'react-icons/md';
import { LuLockKeyhole } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';

const LoginModal = ({ isOpen, onClose }) => {
   const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Store user data in localStorage (in real app, use proper authentication)
      const userData = {
        email: email,
        loggedIn: true,
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('cakeUser', JSON.stringify(userData));
      
      setLoading(false);
      
      // Show success message
      alert(isSignUp ? 'Account created successfully!' : 'Login successful!');
      
      // Close modal
      onClose();

      navigate("/details");
      
      // In a real app, you would redirect or update app state here
    }, 1500);
  };

   const goToChapter = () => {
    
  };

  const handleGoogleLogin = () => {
    // In a real app, this would trigger Google OAuth flow
    alert('Google OAuth would be implemented here with backend support');
    
    // Simulate successful Google login
    const userData = {
      email: 'user@gmail.com',
      loggedIn: true,
      loginMethod: 'google',
      loginTime: new Date().toISOString()
    };
    
    localStorage.setItem('cakeUser', JSON.stringify(userData));
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleBackdropClick}>
      <div className={styles.modalContainer}>
        <button className={styles.closeButton} onClick={onClose}>
          <MdClose size={24} />
        </button>

        <div className={styles.modalContent}>
          {/* Left Side - Cake Image */}
          <div className={styles.imageSection}>
            <img
              src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=700&fit=crop"
              alt="Delicious Cake"
              className={styles.modalImage}
            />
          </div>

          {/* Right Side - Login Form */}
          <div className={styles.formSection}>
            <h2 className={styles.heading}>Hello!</h2>
            <p className={styles.subheading}>
              Please {isSignUp ? 'sign up' : 'login'} to place order
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
             {isSignUp && <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>
                <div className={styles.inputWrapper}>
                  <LuMail className={styles.inputIcon} />
                  <input
                    type="text"
                    placeholder="Your Name.."
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  />
                </div>
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>}
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <div className={styles.inputWrapper}>
                  <LuMail className={styles.inputIcon} />
                  <input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors({ ...errors, email: '' });
                      }
                    }}
                    className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  />
                </div>
                {errors.email && (
                  <span className={styles.errorText}>{errors.email}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="password">Password</label>
                <div className={styles.inputWrapper}>
                  <LuLockKeyhole className={styles.inputIcon} />
                  <input
                    type="password"
                    placeholder="Password..."
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors({ ...errors, password: '' });
                      }
                    }}
                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                  />
                </div>
                {errors.password && (
                  <span className={styles.errorText}>{errors.password}</span>
                )}
              </div>

              <button
                type="submit"
                className={styles.continueButton}
                disabled={loading}
                
              >
                {loading ? 'PLEASE WAIT...' : isSignUp ? 'SIGN UP' : 'CONTINUE'}
              </button>
            </form>

            <div className={styles.divider}>
              <span>Or, Login with</span>
            </div>

            <button
              type="button"
              className={styles.googleButton}
              onClick={handleGoogleLogin}
            >
              <FcGoogle size={20} />
              <span>Google</span>
            </button>

            <div className={styles.footer}>
              <p className={`mb-0 ${styles.toggleText}`}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                   
                    setIsSignUp(!isSignUp);
                    setErrors({});
                     
                      goToChapter()
                    
                  }}
                  className={styles.toggleButton}
                >
                  {isSignUp ? 'Login' : 'Sign Up'}

                </button>
              </p>
              {/* <p className={styles.termsText}>
                By continuing, I agree to{' '}
                <a href="#" className={styles.link}>Terms & Conditions</a>
                {' '}and{' '}
                <a href="#" className={styles.link}>Privacy Policy</a>
              </p> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
