// 게시글 데이터를 로컬 스토리지에 저장하고 관리하는 유틸리티

const STORAGE_KEY = 'comu_d_posts';

// 모든 게시글 가져오기
export const getAllPosts = () => {
  const posts = localStorage.getItem(STORAGE_KEY);
  return posts ? JSON.parse(posts) : [];
};

// 특정 카테고리의 게시글만 가져오기
export const getPostsByCategory = (category) => {
  const allPosts = getAllPosts();
  return allPosts.filter(post => post.category === category);
};

// 새 게시글 추가
export const addPost = (post) => {
  // 금지어 체크 (모든 카테고리에서 게시물 등록 시 금지어 검사)
  const titleCheck = containsBannedWords(post.title || '');
  const contentCheck = containsBannedWords(post.content || '');
  
  if (titleCheck.contains) {
    throw new Error(titleCheck.message);
  }
  
  if (contentCheck.contains) {
    throw new Error(contentCheck.message);
  }
  
  const posts = getAllPosts();
  const newPost = {
    id: Date.now().toString(),
    ...post,
    createdAt: new Date().toISOString(),
    likes: 0,
    likedBy: [], // 좋아요를 누른 사용자 ID 저장 (익명이므로 브라우저별로 구분)
  };
  posts.unshift(newPost); // 최신 게시글이 위에 오도록
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
};

// 좋아요 토글
export const toggleLike = (postId) => {
  const posts = getAllPosts();
  const userId = getUserId(); // 브라우저별 고유 ID
  
  const postIndex = posts.findIndex(post => post.id === postId);
  if (postIndex === -1) return null;
  
  const post = posts[postIndex];
  if (!post.likedBy) post.likedBy = [];
  if (!post.likes) post.likes = 0;
  
  const isLiked = post.likedBy.includes(userId);
  
  if (isLiked) {
    // 좋아요 취소
    post.likedBy = post.likedBy.filter(id => id !== userId);
    post.likes = Math.max(0, post.likes - 1);
  } else {
    // 좋아요 추가
    post.likedBy.push(userId);
    post.likes = (post.likes || 0) + 1;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return { likes: post.likes, isLiked: !isLiked };
};

// 게시글의 좋아요 상태 확인
export const getPostLikeStatus = (postId) => {
  const posts = getAllPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return { likes: 0, isLiked: false };
  
  const userId = getUserId();
  const isLiked = post.likedBy && post.likedBy.includes(userId);
  
  return {
    likes: post.likes || 0,
    isLiked: isLiked || false,
  };
};

// 브라우저별 고유 ID 생성/가져오기
const getUserId = () => {
  let userId = localStorage.getItem('comu_d_user_id');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('comu_d_user_id', userId);
  }
  return userId;
};

// 게시글 삭제
export const deletePost = (postId) => {
  const posts = getAllPosts();
  const filteredPosts = posts.filter(post => post.id !== postId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPosts));
};

// 이미지를 Base64로 변환
export const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// 금지어 관리
const BANNED_WORDS_KEY = 'comu_d_banned_words';

// 금지어 목록 가져오기
export const getBannedWords = () => {
  const words = localStorage.getItem(BANNED_WORDS_KEY);
  return words ? JSON.parse(words) : [];
};

// 금지어 추가
export const addBannedWord = (word) => {
  const words = getBannedWords();
  const trimmedWord = word.trim().toLowerCase();
  
  if (!trimmedWord) {
    return { success: false, message: '금지어를 입력해주세요.' };
  }
  
  if (words.includes(trimmedWord)) {
    return { success: false, message: '이미 등록된 금지어입니다.' };
  }
  
  words.push(trimmedWord);
  localStorage.setItem(BANNED_WORDS_KEY, JSON.stringify(words));
  return { success: true, message: '금지어가 추가되었습니다.' };
};

// 금지어 삭제
export const removeBannedWord = (word) => {
  const words = getBannedWords();
  const filteredWords = words.filter(w => w !== word);
  localStorage.setItem(BANNED_WORDS_KEY, JSON.stringify(filteredWords));
  return { success: true, message: '금지어가 삭제되었습니다.' };
};

// 텍스트에 금지어가 포함되어 있는지 확인
export const containsBannedWords = (text) => {
  const bannedWords = getBannedWords();
  const lowerText = text.toLowerCase();
  
  for (const word of bannedWords) {
    if (lowerText.includes(word)) {
      return { 
        contains: true, 
        bannedWord: word,
        message: `금지어 "${word}"가 포함되어 있습니다.`
      };
    }
  }
  
  return { contains: false };
};

// 게시글 검색 (제목, 내용에서 검색)
export const searchPosts = (posts, searchQuery, options = {}) => {
  let filteredPosts = posts;
  
  // 검색어 필터링
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.trim().toLowerCase();
    const words = query.split(/\s+/).filter(word => word.length > 0);
    
    filteredPosts = filteredPosts.filter(post => {
      const title = (post.title || '').toLowerCase();
      const content = (post.content || '').toLowerCase();
      
      // 모든 단어가 포함되어 있는지 확인 (AND 검색)
      if (words.length > 1) {
        return words.every(word => title.includes(word) || content.includes(word));
      }
      // 단일 단어 검색
      return title.includes(query) || content.includes(query);
    });
  }
  
  // 카테고리 필터링
  if (options.category && options.category !== 'all') {
    filteredPosts = filteredPosts.filter(post => post.category === options.category);
  }
  
  // 정렬 옵션
  if (options.sortBy) {
    filteredPosts = [...filteredPosts].sort((a, b) => {
      switch (options.sortBy) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });
  }
  
  return filteredPosts;
};

// 댓글 관리
const COMMENTS_KEY = 'comu_d_comments';

// 게시글의 댓글 가져오기
export const getCommentsByPostId = (postId) => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (!comments) return [];
  
  const allComments = JSON.parse(comments);
  return allComments.filter(comment => comment.postId === postId);
};

// 댓글 추가
export const addComment = (postId, content) => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  const allComments = comments ? JSON.parse(comments) : [];
  
  const newComment = {
    id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
    postId,
    content: content.trim(),
    author: generateRandomName(),
    createdAt: new Date().toISOString(),
  };
  
  allComments.push(newComment);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(allComments));
  return newComment;
};

// 댓글 삭제
export const deleteComment = (commentId) => {
  const comments = localStorage.getItem(COMMENTS_KEY);
  if (!comments) return false;
  
  const allComments = JSON.parse(comments);
  const filteredComments = allComments.filter(comment => comment.id !== commentId);
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(filteredComments));
  return true;
};

// 랜덤 이름 생성 (재미있는 익명 이름)
const generateRandomName = () => {
  const adjectives = ['멋진', '똑똑한', '재밌는', '친절한', '활발한', '조용한', '밝은', '차분한', '열정적인', '유쾌한'];
  const nouns = ['고양이', '강아지', '토끼', '펭귄', '곰', '사자', '호랑이', '여우', '늑대', '판다', '코알라', '다람쥐', '햄스터', '앵무새', '돌고래'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 999) + 1;
  
  return `${adjective}${noun}${number}`;
};

// VIP 관리
const VIP_KEY = 'comu_d_vip_status';

// VIP 상태 확인
export const isVIP = () => {
  const vipStatus = localStorage.getItem(VIP_KEY);
  if (!vipStatus) return false;
  
  const vip = JSON.parse(vipStatus);
  // VIP 만료일 체크
  if (vip.expiresAt && new Date(vip.expiresAt) < new Date()) {
    localStorage.removeItem(VIP_KEY);
    return false;
  }
  
  return vip.isActive === true;
};

// VIP 활성화
export const activateVIP = (days = 30) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);
  
  const vipStatus = {
    isActive: true,
    activatedAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
  };
  
  localStorage.setItem(VIP_KEY, JSON.stringify(vipStatus));
  return vipStatus;
};

// VIP 로그아웃 (비활성화)
export const deactivateVIP = () => {
  localStorage.removeItem(VIP_KEY);
  return true;
};

// VIP 상태 가져오기
export const getVIPStatus = () => {
  const vipStatus = localStorage.getItem(VIP_KEY);
  if (!vipStatus) return null;
  
  const vip = JSON.parse(vipStatus);
  if (vip.expiresAt && new Date(vip.expiresAt) < new Date()) {
    localStorage.removeItem(VIP_KEY);
    return null;
  }
  
  return vip;
};

// VIP 게시물 필터링
// VIP 유저는 모든 게시물을 볼 수 있음 (일반, VIP 전용, 일반 사용자 전용 모두)
// 일반 사용자는 VIP 전용 게시물을 볼 수 없음
export const filterVIPPosts = (posts, showVIPOnly = false) => {
  const userIsVIP = isVIP();
  
  if (showVIPOnly) {
    // VIP 전용 게시물만 보기
    return posts.filter(post => post.isVIP === true);
  }
  
  // 게시물 타입에 따라 필터링
  return posts.filter(post => {
    // VIP 유저는 모든 게시물을 볼 수 있음
    if (userIsVIP) {
      return true;
    }
    
    // 일반 사용자는 VIP 전용 게시물을 볼 수 없음
    if (post.isVIP === true) {
      return false;
    }
    
    // 일반 게시물과 일반 사용자 전용 게시물은 모두 보임
    return true;
  });
};

