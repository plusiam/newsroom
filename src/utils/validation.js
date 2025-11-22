// 이메일 유효성 검사
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 필수 입력 검사
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// 최소 길이 검사
export const minLength = (value, min) => {
  if (typeof value === 'string') {
    return value.trim().length >= min;
  }
  return false;
};

// 최대 길이 검사
export const maxLength = (value, max) => {
  if (typeof value === 'string') {
    return value.trim().length <= max;
  }
  return false;
};

// HTML 컨텐츠 유효성 검사 (빈 에디터 체크)
export const hasContent = (htmlContent) => {
  if (!htmlContent) return false;

  // HTML 태그 제거
  const text = htmlContent.replace(/<[^>]*>/g, '').trim();

  // 공백 문자만 있는지 확인
  return text.length > 0;
};

// 에러 메시지 생성
export const getErrorMessage = (field, validationType, options = {}) => {
  const messages = {
    required: `${field}을(를) 입력해주세요.`,
    email: '올바른 이메일 형식이 아닙니다.',
    minLength: `${field}은(는) 최소 ${options.min}자 이상이어야 합니다.`,
    maxLength: `${field}은(는) 최대 ${options.max}자 이하여야 합니다.`,
    content: '내용을 입력해주세요.'
  };

  return messages[validationType] || '유효하지 않은 입력입니다.';
};
