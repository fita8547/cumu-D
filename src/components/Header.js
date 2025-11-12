import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { isVIP, getVIPStatus, activateVIP, deactivateVIP } from '../utils/postStorage';
import LoginModal from './LoginModal';

const Header = () => {
  const [vipStatus, setVipStatus] = useState(null);
  const [showVIPModal, setShowVIPModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedVIPDays, setSelectedVIPDays] = useState(null);

  useEffect(() => {
    updateVIPStatus();
    const interval = setInterval(updateVIPStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const updateVIPStatus = () => {
    const status = getVIPStatus();
    setVipStatus(status);
  };

  const handleVIPPlanClick = (days) => {
    setSelectedVIPDays(days);
    setShowVIPModal(false);
    setShowLoginModal(true);
  };

  const handleLogin = async (credentials) => {
    try {
      // 나중에 서버 연결 시 여기서 로그인 처리
      // 로그인 성공 후 VIP 활성화
      if (selectedVIPDays) {
        activateVIP(selectedVIPDays);
        updateVIPStatus();
        setShowLoginModal(false);
        setSelectedVIPDays(null);
        alert(`로그인 완료! VIP가 ${selectedVIPDays}일간 활성화되었습니다! 👑`);
        window.location.reload();
      }
    } catch (error) {
      console.error('VIP 활성화 오류:', error);
      alert('VIP 활성화 중 오류가 발생했습니다.');
    }
  };

  // 개발/테스트용: VIP 바로 활성화 (로그인 없이)
  const handleQuickVIPActivate = (days) => {
    try {
      activateVIP(days);
      updateVIPStatus();
      alert(`VIP가 ${days}일간 활성화되었습니다! 👑 (테스트용)`);
      window.location.reload();
    } catch (error) {
      console.error('VIP 활성화 오류:', error);
      alert('VIP 활성화 중 오류가 발생했습니다.');
    }
  };

  // VIP 로그아웃
  const handleVIPLogout = () => {
    if (window.confirm('VIP에서 로그아웃하시겠습니까?')) {
      try {
        deactivateVIP();
        updateVIPStatus();
        alert('VIP에서 로그아웃되었습니다.');
        window.location.reload();
      } catch (error) {
        console.error('VIP 로그아웃 오류:', error);
        alert('VIP 로그아웃 중 오류가 발생했습니다.');
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const userIsVIP = isVIP();

  return (
    <>
      <header>
        <Link to="/" className="logo-link">
          <div className="logo">
            <span className="logo-text">COMU</span>
            <span className="logo-dot">•</span>
            <span className="logo-text">D</span>
          </div>
        </Link>
        <div className="header-vip-section">
          {userIsVIP ? (
            <div className="vip-status-active">
              <span className="vip-icon">👑</span>
              <span className="vip-text">VIP</span>
              {vipStatus && vipStatus.expiresAt && (
                <span className="vip-expires">
                  ~{formatDate(vipStatus.expiresAt)}
                </span>
              )}
              <button 
                className="vip-logout-btn"
                onClick={handleVIPLogout}
                title="VIP 로그아웃"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <button 
              className="vip-upgrade-btn"
              onClick={() => setShowVIPModal(true)}
            >
              👑 VIP 구매
            </button>
          )}
        </div>
      </header>

      {showVIPModal && (
        <div className="vip-modal-overlay" onClick={() => setShowVIPModal(false)}>
          <div className="vip-modal" onClick={(e) => e.stopPropagation()}>
            <div className="vip-modal-header">
              <h2>👑 VIP 멤버십 구매</h2>
              <button 
                className="vip-modal-close"
                onClick={() => setShowVIPModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="vip-modal-content">
              <p className="vip-benefits-title">VIP 혜택:</p>
              <ul className="vip-benefits-list">
                <li>✨ VIP 전용 게시물 작성 가능</li>
                <li>🔓 모든 VIP 전용 게시물 열람</li>
                <li>💎 프리미엄 콘텐츠 접근</li>
                <li>⭐ 특별한 VIP 배지 표시</li>
              </ul>
              <div className="vip-plans">
                <div className="vip-plan">
                  <h3>1개월</h3>
                  <p className="vip-price">무료 체험</p>
                  <button 
                    className="vip-plan-btn"
                    onClick={() => handleVIPPlanClick(30)}
                  >
                    구매하기
                  </button>
                </div>
                <div className="vip-plan featured">
                  <div className="vip-plan-badge">인기</div>
                  <h3>3개월</h3>
                  <p className="vip-price">무료 체험</p>
                  <button 
                    className="vip-plan-btn"
                    onClick={() => handleVIPPlanClick(90)}
                  >
                    구매하기
                  </button>
                </div>
                <div className="vip-plan">
                  <h3>1년</h3>
                  <p className="vip-price">무료 체험</p>
                  <button 
                    className="vip-plan-btn"
                    onClick={() => handleVIPPlanClick(365)}
                  >
                    구매하기
                  </button>
                </div>
              </div>
              <p className="vip-note">* 현재는 무료 체험 기간입니다</p>
              
              {/* 개발/테스트용 빠른 VIP 활성화 */}
              <div className="vip-quick-activate">
                <p className="vip-quick-title">🧪 테스트용 빠른 VIP 활성화</p>
                <div className="vip-quick-buttons">
                  <button 
                    className="vip-quick-btn"
                    onClick={() => handleQuickVIPActivate(30)}
                  >
                    30일 활성화
                  </button>
                  <button 
                    className="vip-quick-btn"
                    onClick={() => handleQuickVIPActivate(365)}
                  >
                    1년 활성화
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setSelectedVIPDays(null);
        }}
        onLogin={handleLogin}
        title="VIP 구매를 위해 로그인해주세요"
      />
    </>
  );
};

export default Header;

