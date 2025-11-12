import React, { useState } from 'react';

const LoginModal = ({ isOpen, onClose, onLogin, title = '로그인' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      alert('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 나중에 서버 연결 시 여기에 API 호출
      // const response = await fetch('/api/login', { ... });
      
      // 임시: 로그인 성공 처리
      if (onLogin) {
        onLogin({ email, password });
      }
      
      setEmail('');
      setPassword('');
      onClose();
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={(e) => e.stopPropagation()}>
        <div className="login-modal-header">
          <h2>{title}</h2>
          <button 
            className="login-modal-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="login-modal-content">
          <form onSubmit={handleSubmit}>
            <div className="login-form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
                required
              />
            </div>
            
            <div className="login-form-group">
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            
            <div className="login-form-actions">
              <button 
                type="button" 
                className="login-cancel-btn"
                onClick={onClose}
              >
                취소
              </button>
              <button 
                type="submit" 
                className="login-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </button>
            </div>
          </form>
          
          <div className="login-modal-footer">
            <p className="login-note">
              * 서버 연결 후 실제 로그인 기능이 활성화됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

