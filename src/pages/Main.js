import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import PostList from '../components/PostList';
import { getAllPosts, searchPosts, filterVIPPosts } from '../utils/postStorage';

const Main = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOptions, setSearchOptions] = useState({ category: 'all', sortBy: 'latest' });
  const [showSearchResults, setShowSearchResults] = useState(false);

  const categories = [
    {
      name: '사회이슈',
      path: '/social-issue',
      description: '사회이슈 관련 아이디어를 공유해보세요',
      icon: '🌍',
    },
    {
      name: '환경문제',
      path: '/environmental-problem',
      description: '환경문제 해결 방안을 제안해보세요',
      icon: '🌱',
    },
    {
      name: '이야기',
      path: '/writing-idea',
      description: '책이나 영상에서 떠오른 아이디어를 기록하세요',
      icon: '📚',
    },
    {
      name: '과학',
      path: '/science',
      description: '과학 관련 아이디어와 이미지를 공유하세요',
      icon: '🔬',
    },
    {
      name: '이벤트',
      path: '/event',
      description: '이벤트 관련 아이디어를 나눠보세요',
      icon: '🎉',
    },
  ];

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const visiblePosts = filterVIPPosts(posts);
    if (searchQuery || searchOptions.category !== 'all') {
      const results = searchPosts(visiblePosts, searchQuery, searchOptions);
      setFilteredPosts(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  }, [searchQuery, searchOptions, posts]);

  const loadPosts = () => {
    const allPosts = getAllPosts();
    const visiblePosts = filterVIPPosts(allPosts);
    setPosts(visiblePosts);
    if (searchQuery || searchOptions.category !== 'all') {
      const results = searchPosts(visiblePosts, searchQuery, searchOptions);
      setFilteredPosts(results);
    }
  };

  const handleSearch = (query, options) => {
    setSearchQuery(query);
    setSearchOptions(options);
  };

  const handleFilterChange = (options) => {
    setSearchOptions(options);
  };

  const handleLikeUpdate = () => {
    loadPosts();
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

  return (
    <section className="main-page">
      <div className="container">
        {/* 통합 검색 섹션 */}
        <div className="main-search-section">
          <h2 className="main-search-title">전체 게시물 검색</h2>
          <p className="main-search-subtitle">모든 카테고리의 게시물을 한 번에 검색하세요</p>
          <SearchBar 
            onSearch={handleSearch}
            placeholder="제목 또는 내용으로 검색... (여러 단어 입력 가능)"
            showFilters={true}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* 검색 결과 섹션 */}
        {showSearchResults && (
          <div className="search-results-section">
            <div className="search-results-header">
              <h2>검색 결과</h2>
              <div className="search-results-info">
                총 {filteredPosts.length}개의 게시물을 찾았습니다
                {searchOptions.category !== 'all' && (
                  <span className="category-badge">{getCategoryName(searchOptions.category)}</span>
                )}
              </div>
            </div>
            <PostList posts={filteredPosts} onLikeUpdate={handleLikeUpdate} />
          </div>
        )}

        {/* 서비스 소개 섹션 */}
        {!showSearchResults && (
          <>
            <div className="intro-section">
              <div className="intro-content">
                <h1 className="main-title">COMU-D</h1>
                <p className="main-subtitle">기획자와 일반인을 위한 아이디어 저장소</p>
                <p className="main-description">
                  일상 속에서 떠오른 아이디어, 영감, 그리고 해결책을 자유롭게 공유하고 저장하세요.
                  <br />
                  익명으로 작성할 수 있으며, 이미지와 함께 아이디어를 기록할 수 있습니다.
                </p>
                <div className="features">
                  <div className="feature-item">
                    <span className="feature-icon">✍️</span>
                    <span className="feature-text">익명으로 자유롭게 작성</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🖼️</span>
                    <span className="feature-text">이미지와 함께 아이디어 공유</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">❤️</span>
                    <span className="feature-text">좋아요로 아이디어 응원하기</span>
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">📂</span>
                    <span className="feature-text">카테고리별로 정리된 아이디어</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 카테고리 선택 섹션 */}
            <div className="categories-section">
              <h2 className="section-title">카테고리 선택</h2>
              <p className="section-subtitle">관심 있는 주제를 선택하여 아이디어를 탐색하거나 공유하세요</p>
              <div className="Category">
                {categories.map((category) => (
                  <Link key={category.path} to={category.path} className="box-link">
                    <div className="box">
                      <div className="box-icon">{category.icon}</div>
                      <h3 className="box-title">{category.name}</h3>
                      <p className="box-description">{category.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Main;

