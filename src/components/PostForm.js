import React, { useState } from 'react';
import { addPost, convertImageToBase64, containsBannedWords, isVIP } from '../utils/postStorage';

const PostForm = ({ category, onPostAdded }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [postType, setPostType] = useState('normal'); // 'normal', 'vip', 'non-vip'

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }
      
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() && !content.trim()) {
      alert('제목 또는 내용을 입력해주세요.');
      return;
    }

    // 금지어 체크
    const titleCheck = containsBannedWords(title);
    const contentCheck = containsBannedWords(content);
    
    if (titleCheck.contains) {
      alert(titleCheck.message);
      return;
    }
    
    if (contentCheck.contains) {
      alert(contentCheck.message);
      return;
    }

    setIsSubmitting(true);

    try {
      let imageBase64 = null;
      if (image) {
        imageBase64 = await convertImageToBase64(image);
      }

      const newPost = {
        category,
        title: title.trim() || '제목 없음',
        content: content.trim(),
        image: imageBase64,
        author: '익명', // 항상 익명
        isVIP: postType === 'vip' && isVIP(), // VIP 전용
        isNonVIP: postType === 'non-vip', // 일반 사용자 전용
      };

      addPost(newPost);
      
      // 폼 초기화
      setTitle('');
      setContent('');
      setImage(null);
      setImagePreview(null);
      setPostType('normal');
      
      if (onPostAdded) {
        onPostAdded();
      }
      
      let message = '게시글이 등록되었습니다!';
      if (postType === 'vip') {
        message = 'VIP 전용 게시글이 등록되었습니다! 👑';
      } else if (postType === 'non-vip') {
        message = '일반 사용자 전용 게시글이 등록되었습니다! 👥';
      }
      alert(message);
    } catch (error) {
      console.error('게시글 등록 오류:', error);
      alert('게시글 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-form">
      <h2>새 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">제목 (선택사항)</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="아이디어나 내용을 입력하세요"
            rows={6}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">이미지 (선택사항)</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="미리보기" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="remove-image-btn"
              >
                이미지 제거
              </button>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="postType">게시물 타입</label>
          <select
            id="postType"
            value={postType}
            onChange={(e) => setPostType(e.target.value)}
            className="post-type-select"
          >
            <option value="normal">일반 게시물 (모두 볼 수 있음)</option>
            {isVIP() && (
              <option value="vip">👑 VIP 전용 게시물 (VIP 회원만 볼 수 있음)</option>
            )}
            <option value="non-vip">👥 일반 사용자 전용 게시물 (VIP 제외, 일반 사용자만 볼 수 있음)</option>
          </select>
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting} className="submit-btn">
            {isSubmitting ? '등록 중...' : 
             postType === 'vip' ? '👑 VIP 전용 게시하기' :
             postType === 'non-vip' ? '👥 일반 사용자 전용 게시하기' :
             '익명으로 게시하기'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;

