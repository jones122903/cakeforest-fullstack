import React, { useState } from 'react';
import styles from './LoginModal.module.css';
import { FcGoogle } from 'react-icons/fc';
import { MdClose} from 'react-icons/md';
import { LuLockKeyhole } from "react-icons/lu";
import { LuMail } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';
import { setToken } from "../../redux/slice/authSlice";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useGoogleLogin } from "@react-oauth/google";


const LoginModal = ({ isOpen, onClose }) => {
   const navigate = useNavigate();
   const dispatch = useDispatch();

 const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  
const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        access_token: tokenResponse.access_token
      });

      // Backend gives you user + JWT
      dispatch(setToken({
        token: res.data.token,
        user: res.data.user
      }));

      alert("Login successful!");
      onClose();
      navigate("/details");
    } catch (error) {
      console.error(error);
      alert("Google Login Failed");
    }
  },
  onError: () => {
    alert("Google Login Error");
  },
});

  

  if (!isOpen) return null;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

     if (isSignUp && !name.trim()) {
      newErrors.name = 'Name is required';
    }
    
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

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const endpoint = isSignUp ? '/register' : '/login';
      
      const payload = isSignUp 
        ? { name, email, password }
        : { email, password };

      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      console.log("ghjkl;lkjhghjkjhghjk",response)

      // Success response
      if (response.data.success) {
        // Store token and user in Redux
       dispatch(setToken({
        token: response.data.token,
        user: {
          id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email
        }
      }));


        // Show success message
        alert(isSignUp ? 'Account created successfully!' : 'Login successful!');
        
        // Reset form
        setEmail('');
        setPassword('');
        setName('');
        setErrors({});
        
        // Close modal
        onClose();

        // Navigate to details page
        navigate("/details");
        // goToChapter()
      }
    } catch (error) {
      setLoading(false);
      
      // Handle errors
      if (error.response) {
        // Server responded with error
        const errorMsg = error.response.data.message || 'An error occurred';
        
        if (error.response.status === 401) {
          setErrors({ password: 'Invalid email or password' });
        } else if (error.response.status === 409) {
          setErrors({ email: 'Email already exists' });
        } else {
          alert(errorMsg);
        }
      } else if (error.request) {
        // Request made but no response
        alert('Unable to connect to server. Please check your connection.');
      } else {
        // Other errors
        alert('An error occurred. Please try again.');
      }
      
      console.error('Login/Signup error:', error);
    } finally {
      setLoading(false);
    }
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
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors({ ...errors, name: '' });
                      }
                    }}
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                  />
                </div>
                {errors.name && (
                  <span className={styles.errorText}>{errors.name}</span>
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
                    setEmail('');
                    setPassword('');
                    setName('');
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
