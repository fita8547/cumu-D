import React, { useState } from 'react';

const SearchBar = ({ onSearch, placeholder = '제목 또는 내용으로 검색...', showFilters = false, onFilterChange, initialCategory = 'all', initialSort = 'latest' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value, { category, sortBy });
    }
  };

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    setCategory(newCategory);
    if (onSearch) {
      onSearch(searchQuery, { category: newCategory, sortBy });
    }
    if (onFilterChange) {
      onFilterChange({ category: newCategory, sortBy });
    }
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    if (onSearch) {
      onSearch(searchQuery, { category, sortBy: newSort });
    }
    if (onFilterChange) {
      onFilterChange({ category, sortBy: newSort });
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('', { category, sortBy });
    }
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleChange}
        />
        {searchQuery && (
          <button
            type="button"
            className="search-clear-btn"
            onClick={handleClear}
            aria-label="검색어 지우기"
          >
            ✕
          </button>
        )}
      </div>
      {showFilters && (
        <div className="search-filters">
          <select 
            className="filter-select"
            value={category}
            onChange={handleCategoryChange}
          >
            <option value="all">전체 카테고리</option>
            <option value="social-issue">사회이슈</option>
            <option value="environmental-problem">환경문제</option>
            <option value="writing-idea">이야기</option>
            <option value="science">과학</option>
            <option value="event">이벤트</option>
          </select>
          <select 
            className="filter-select"
            value={sortBy}
            onChange={handleSortChange}
          >
            <option value="latest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="likes">좋아요순</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchBar;

