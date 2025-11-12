import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: '사회이슈', path: '/social-issue' },
    { name: '환경문제', path: '/environmental-problem' },
    { name: '이야기', path: '/writing-idea' },
    { name: '과학', path: '/science' },
    { name: '이벤트', path: '/event' },
  ];

  return (
    <footer>
      <div className="inner">
        <div className="footer-content">
          {/* 서비스 소개 */}
          <div className="footer-section">
            <h3 className="footer-title">COMU-D</h3>
            <p className="footer-description">
              기획자와 일반인을 위한 아이디어 저장소
              <br />
              일상 속에서 떠오른 아이디어와 영감을 자유롭게 공유하세요
            </p>
          </div>

          {/* 카테고리 링크 */}
          <div className="footer-section">
            <h4 className="footer-heading">카테고리</h4>
            <ul className="footer-links">
              {categories.map((category) => (
                <li key={category.path}>
                  <Link to={category.path}>{category.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 서비스 특징 */}
          <div className="footer-section">
            <h4 className="footer-heading">서비스 특징</h4>
            <ul className="footer-features">
              <li>✍️ 익명으로 자유롭게 작성</li>
              <li>🖼️ 이미지와 함께 아이디어 공유</li>
              <li>❤️ 좋아요로 아이디어 응원</li>
              <li>💬 채팅형 댓글 기능</li>
            </ul>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} COMU-D. All rights reserved.
          </p>
          <p className="footer-tagline">
            당신의 아이디어가 세상을 바꿉니다 💡
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

