import React, { useState, useEffect, useRef } from 'react';
import { getCommentsByPostId, addComment } from '../utils/postStorage';

const CommentSection = ({ postId, onCommentUpdate }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    loadComments();
    // 주기적으로 댓글 새로고침
    const interval = setInterval(loadComments, 2000);
    return () => clearInterval(interval);
  }, [postId]);

  useEffect(() => {
    // 댓글이 추가되면 스크롤을 맨 아래로
    if (showComments && commentsEndRef.current) {
      commentsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments, showComments]);

  const loadComments = () => {
    const postComments = getCommentsByPostId(postId);
    setComments(postComments);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      addComment(postId, newComment);
      setNewComment('');
      loadComments();
      
      if (onCommentUpdate) {
        onCommentUpdate();
      }
      
      // 댓글 섹션 열기
      if (!showComments) {
        setShowComments(true);
      }
    } catch (error) {
      console.error('댓글 등록 오류:', error);
      alert('댓글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    
    return date.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <div className="comment-section">
      <div className="comment-header">
        <button 
          className="comment-toggle-btn"
          onClick={toggleComments}
        >
          💬 댓글 {comments.length > 0 && <span className="comment-count">({comments.length})</span>}
          <span className="toggle-icon">{showComments ? '▼' : '▶'}</span>
        </button>
      </div>

      {showComments && (
        <>
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>아직 댓글이 없습니다. 첫 댓글을 남겨보세요! 💭</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-avatar">
                    {comment.author.charAt(comment.author.length - 1) % 10 === 0 ? '🐱' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 1 ? '🐶' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 2 ? '🐰' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 3 ? '🐧' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 4 ? '🐻' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 5 ? '🦁' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 6 ? '🐯' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 7 ? '🦊' :
                     comment.author.charAt(comment.author.length - 1) % 10 === 8 ? '🐺' : '🐼'}
                  </div>
                  <div className="comment-content-wrapper">
                    <div className="comment-author">{comment.author}</div>
                    <div className="comment-text">{comment.content}</div>
                    <div className="comment-time">{formatDate(comment.createdAt)}</div>
                  </div>
                </div>
              ))
            )}
            <div ref={commentsEndRef} />
          </div>

          <form className="comment-form" onSubmit={handleSubmit}>
            <div className="comment-input-wrapper">
              <input
                type="text"
                className="comment-input"
                placeholder="댓글을 입력하세요... (이모지도 사용 가능해요! 😊)"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                maxLength={500}
              />
              <button
                type="submit"
                className="comment-submit-btn"
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? '전송 중...' : '💬'}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default CommentSection;

