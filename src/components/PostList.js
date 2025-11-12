import React, { useState, useEffect } from 'react';
import { toggleLike, getPostLikeStatus, isVIP } from '../utils/postStorage';
import CommentSection from './CommentSection';

const PostList = ({ posts, onLikeUpdate }) => {
  const [likeStates, setLikeStates] = useState({});
  const [animatingPosts, setAnimatingPosts] = useState(new Set());

  useEffect(() => {
    // 각 게시글의 좋아요 상태 초기화
    const states = {};
    posts.forEach(post => {
      const status = getPostLikeStatus(post.id);
      states[post.id] = {
        likes: post.likes || status.likes || 0,
        isLiked: status.isLiked,
      };
    });
    setLikeStates(states);
  }, [posts]);

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

  const handleLikeClick = (postId) => {
    // 애니메이션 시작
    setAnimatingPosts(prev => new Set(prev).add(postId));
    
    // 좋아요 토글
    const result = toggleLike(postId);
    
    if (result) {
      setLikeStates(prev => ({
        ...prev,
        [postId]: {
          likes: result.likes,
          isLiked: result.isLiked,
        },
      }));
      
      // 부모 컴포넌트에 알림
      if (onLikeUpdate) {
        onLikeUpdate();
      }
    }
    
    // 애니메이션 종료 (0.6초 후)
    setTimeout(() => {
      setAnimatingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }, 600);
  };

  if (posts.length === 0) {
    return (
      <div className="empty-posts">
        <p>아직 게시글이 없습니다. 첫 번째 게시글을 작성해보세요!</p>
      </div>
    );
  }

  const userIsVIP = isVIP();

  return (
    <div className="post-list">
      {posts.map((post) => {
        const likeState = likeStates[post.id] || { likes: post.likes || 0, isLiked: false };
        const isAnimating = animatingPosts.has(post.id);
        const isVIPPost = post.isVIP === true;
        const isNonVIPPost = post.isNonVIP === true;
        // VIP 유저는 모든 게시물을 볼 수 있음 (일반, VIP 전용, 일반 사용자 전용 모두)
        // 일반 사용자는 VIP 전용 게시물을 볼 수 없음
        const canViewPost = userIsVIP || !isVIPPost;
        
        return (
          <div key={post.id} className={`post-item ${isVIPPost ? 'vip-post' : ''}`}>
            <div className="post-header">
              <div className="post-title-wrapper">
                <h3 className="post-title">
                  {isVIPPost && <span className="vip-badge">👑 VIP</span>}
                  {isNonVIPPost && <span className="non-vip-badge">👥 일반 사용자 전용</span>}
                  {post.title}
                </h3>
              </div>
              <div className="post-meta">
                <span className="post-author">{post.author}</span>
                <span className="post-date">{formatDate(post.createdAt)}</span>
              </div>
            </div>
            
            {/* VIP 게시물: 이미지와 내용 미리보기 (블러 처리) */}
            {isVIPPost && !userIsVIP ? (
              <>
                {post.image && (
                  <div className="post-image vip-blurred">
                    <img src={post.image} alt={post.title} />
                    <div className="vip-blur-overlay">
                      <div className="vip-lock-icon-large">🔒</div>
                    </div>
                  </div>
                )}
                
                <div className="post-content vip-blurred">
                  <p>{post.content}</p>
                  <div className="vip-blur-overlay">
                    <div className="vip-preview-text">
                      <div className="vip-lock-icon-large">🔒</div>
                      <h4>VIP 전용 콘텐츠</h4>
                      <p>이 게시물의 내용은 VIP 회원만 볼 수 있습니다.</p>
                      <p className="vip-upgrade-text">VIP로 업그레이드하여 프리미엄 콘텐츠를 확인하세요!</p>
                    </div>
                  </div>
                </div>
                
                <div className="post-actions">
                  <button
                    className={`like-btn ${likeState.isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
                    onClick={() => handleLikeClick(post.id)}
                    aria-label="좋아요"
                  >
                    <span className="like-icon">❤️</span>
                    <span className="like-count">{likeState.likes}</span>
                  </button>
                </div>
              </>
            ) : !canViewPost ? (
              <div className="vip-locked-content">
                <div className="vip-lock-icon">🔒</div>
                <h4>일반 사용자 전용 게시물</h4>
                <p>이 게시물은 일반 사용자만 볼 수 있습니다.</p>
              </div>
            ) : (
              <>
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt={post.title} />
                  </div>
                )}
                
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                
                <div className="post-actions">
                  <button
                    className={`like-btn ${likeState.isLiked ? 'liked' : ''} ${isAnimating ? 'animating' : ''}`}
                    onClick={() => handleLikeClick(post.id)}
                    aria-label="좋아요"
                  >
                    <span className="like-icon">❤️</span>
                    <span className="like-count">{likeState.likes}</span>
                  </button>
                </div>

                {/* 댓글 섹션 */}
                <CommentSection 
                  postId={post.id} 
                  onCommentUpdate={onLikeUpdate}
                />
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PostList;

