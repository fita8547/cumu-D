import React, { useState, useEffect } from 'react';
import { getAllPosts, deletePost, addPost } from '../utils/postStorage';
import { getBannedWords, addBannedWord, removeBannedWord, containsBannedWords } from '../utils/postStorage';

const Admin = () => {
  const [posts, setPosts] = useState([]);
  const [bannedWords, setBannedWords] = useState([]);
  const [newBannedWord, setNewBannedWord] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPosts();
    loadBannedWords();
  }, []);

  const loadPosts = () => {
    const allPosts = getAllPosts();
    setPosts(allPosts);
  };

  const loadBannedWords = () => {
    const words = getBannedWords();
    setBannedWords(words);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('정말 이 게시물을 삭제하시겠습니까?')) {
      deletePost(postId);
      loadPosts();
      setMessage('게시물이 삭제되었습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddBannedWord = () => {
    const result = addBannedWord(newBannedWord);
    if (result.success) {
      setNewBannedWord('');
      loadBannedWords();
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleRemoveBannedWord = (word) => {
    if (window.confirm(`"${word}" 금지어를 삭제하시겠습니까?`)) {
      const result = removeBannedWord(word);
      loadBannedWords();
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCreateSampleVIPPost = () => {
    try {
      const categories = ['social-issue', 'environmental-problem', 'writing-idea', 'science', 'event'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const title = '👑 VIP 전용 샘플 게시물';
      const content = '이것은 VIP 전용 게시물 샘플입니다.\n\nVIP 회원만 이 게시물의 내용을 볼 수 있습니다.\n일반 사용자에게는 블러 처리된 미리보기와 함께 VIP 업그레이드 안내가 표시됩니다.\n\nVIP로 업그레이드하면 이런 프리미엄 콘텐츠를 모두 볼 수 있습니다!';
      
      // 금지어 체크
      const titleCheck = containsBannedWords(title);
      const contentCheck = containsBannedWords(content);
      
      if (titleCheck.contains) {
        setMessage(titleCheck.message);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      if (contentCheck.contains) {
        setMessage(contentCheck.message);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      const samplePost = {
        category: randomCategory,
        title,
        content,
        author: '익명',
        isVIP: true,
      };

      addPost(samplePost);
      loadPosts();
      setMessage('VIP 전용 샘플 게시물이 생성되었습니다! 일반 사용자는 목록에서 보이지만 내용은 블러 처리됩니다.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('샘플 게시물 생성 오류:', error);
      setMessage(error.message || '샘플 게시물 생성 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCreateSampleNonVIPPost = () => {
    try {
      const categories = ['social-issue', 'environmental-problem', 'writing-idea', 'science', 'event'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const title = '👥 일반 사용자 전용 샘플 게시물';
      const content = '이것은 일반 사용자 전용 게시물 샘플입니다.\n\n일반 사용자만 이 게시물의 내용을 볼 수 있습니다.\nVIP 회원에게는 잠금 아이콘과 함께 안내가 표시됩니다.';
      
      // 금지어 체크
      const titleCheck = containsBannedWords(title);
      const contentCheck = containsBannedWords(content);
      
      if (titleCheck.contains) {
        setMessage(titleCheck.message);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      if (contentCheck.contains) {
        setMessage(contentCheck.message);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      const samplePost = {
        category: randomCategory,
        title,
        content,
        author: '익명',
        isNonVIP: true,
      };

      addPost(samplePost);
      loadPosts();
      setMessage('일반 사용자 전용 샘플 게시물이 생성되었습니다!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('샘플 게시물 생성 오류:', error);
      setMessage(error.message || '샘플 게시물 생성 중 오류가 발생했습니다.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryName = (category) => {
    const categoryMap = {
      'social-issue': '사회이슈',
      'environmental-problem': '환경문제',
      'writing-idea': '이야기',
      'science': '과학',
      'event': '이벤트',
    };
    return categoryMap[category] || category;
  };

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <section className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>관리자 페이지</h1>
          {message && <div className="admin-message">{message}</div>}
        </div>

        {/* 금지어 관리 섹션 */}
        <div className="admin-section">
          <h2>금지어 관리</h2>
          <div className="banned-words-section">
            <div className="add-banned-word">
              <input
                type="text"
                value={newBannedWord}
                onChange={(e) => setNewBannedWord(e.target.value)}
                placeholder="금지어를 입력하세요"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddBannedWord();
                  }
                }}
              />
              <button onClick={handleAddBannedWord} className="add-btn">
                추가
              </button>
            </div>
            
            <div className="banned-words-list">
              <h3>등록된 금지어 ({bannedWords.length}개)</h3>
              {bannedWords.length === 0 ? (
                <p className="empty-message">등록된 금지어가 없습니다.</p>
              ) : (
                <ul>
                  {bannedWords.map((word, index) => (
                    <li key={index} className="banned-word-item">
                      <span className="word-text">{word}</span>
                      <button 
                        onClick={() => handleRemoveBannedWord(word)}
                        className="remove-btn"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 샘플 게시물 생성 섹션 */}
        <div className="admin-section">
          <h2>샘플 게시물 생성</h2>
          <div className="sample-posts-section">
            <p className="sample-posts-description">
              테스트를 위한 샘플 게시물을 생성할 수 있습니다.
            </p>
            <div className="sample-post-buttons">
              <button 
                className="sample-post-btn vip-sample"
                onClick={handleCreateSampleVIPPost}
              >
                👑 VIP 전용 샘플 게시물 생성
              </button>
              <button 
                className="sample-post-btn non-vip-sample"
                onClick={handleCreateSampleNonVIPPost}
              >
                👥 일반 사용자 전용 샘플 게시물 생성
              </button>
            </div>
          </div>
        </div>

        {/* 게시물 관리 섹션 */}
        <div className="admin-section">
          <h2>게시물 관리</h2>
          <div className="post-filter">
            <label>카테고리 필터: </label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="social-issue">사회이슈</option>
              <option value="environmental-problem">환경문제</option>
              <option value="writing-idea">이야기</option>
              <option value="science">과학</option>
              <option value="event">이벤트</option>
            </select>
          </div>

          <div className="admin-posts-list">
            <h3>게시물 목록 ({filteredPosts.length}개)</h3>
            {filteredPosts.length === 0 ? (
              <p className="empty-message">게시물이 없습니다.</p>
            ) : (
              <div className="admin-post-items">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="admin-post-item">
                    <div className="admin-post-header">
                      <div className="admin-post-meta">
                        <span className="admin-post-category">
                          {getCategoryName(post.category)}
                        </span>
                        <span className="admin-post-author">{post.author}</span>
                        <span className="admin-post-date">{formatDate(post.createdAt)}</span>
                      </div>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="delete-post-btn"
                      >
                        삭제
                      </button>
                    </div>
                    <h4 className="admin-post-title">{post.title}</h4>
                    {post.image && (
                      <div className="admin-post-image">
                        <img src={post.image} alt={post.title} />
                      </div>
                    )}
                    <p className="admin-post-content">{post.content}</p>
                    <div className="admin-post-stats">
                      <span>좋아요: {post.likes || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Admin;

