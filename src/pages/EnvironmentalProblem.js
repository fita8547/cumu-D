import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostList from '../components/PostList';
import SearchBar from '../components/SearchBar';
import { getPostsByCategory, searchPosts, filterVIPPosts } from '../utils/postStorage';

const EnvironmentalProblem = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const category = 'environmental-problem';

  const loadPosts = () => {
    const categoryPosts = getPostsByCategory(category);
    const visiblePosts = filterVIPPosts(categoryPosts);
    setPosts(visiblePosts);
    setFilteredPosts(searchPosts(visiblePosts, searchQuery, { sortBy: 'latest' }));
  };

  useEffect(() => {
    loadPosts();
    const interval = setInterval(loadPosts, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredPosts(searchPosts(posts, searchQuery, { sortBy: 'latest' }));
  }, [searchQuery, posts]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleLikeUpdate = () => {
    loadPosts();
  };

  return (
    <section>
      <div className="container">
        <div className="page-header">
          <h1>환경문제</h1>
          <p>환경문제에서 해결할 수 있는 방안을 적어주세요.</p>
          <Link to={`/write?category=${category}`} className="write-btn">
            글쓰기
          </Link>
        </div>
        
        <div className="posts-section">
          <div className="posts-header">
            <h2>게시글 목록</h2>
            <SearchBar onSearch={handleSearch} />
          </div>
          {searchQuery && (
            <div className="search-results-info">
              검색 결과: {filteredPosts.length}개
            </div>
          )}
          <PostList posts={filteredPosts} onLikeUpdate={handleLikeUpdate} />
        </div>
      </div>
    </section>
  );
};

export default EnvironmentalProblem;

