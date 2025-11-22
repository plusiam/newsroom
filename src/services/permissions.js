
export const ROLES = {
    ADMIN: 'admin',
    CHIEF_EDITOR: 'chief_editor',
    EDITOR: 'editor',
    REPORTER: 'reporter'
};

const ROLE_NAMES = {
    [ROLES.ADMIN]: '관리자',
    [ROLES.CHIEF_EDITOR]: '수석 편집자',
    [ROLES.EDITOR]: '편집자',
    [ROLES.REPORTER]: '기자'
};

const permissions = {
    // 역할 이름 반환
    getRoleName: (role) => {
        return ROLE_NAMES[role] || role;
    },

    // 멤버 관리 접근 권한 (관리자, 수석 편집자)
    canManageUsers: (user) => {
        return user?.role === ROLES.ADMIN || user?.role === ROLES.CHIEF_EDITOR;
    },

    // 조직 설정 접근 권한 (관리자만)
    canManageOrgSettings: (user) => {
        return user?.role === ROLES.ADMIN;
    },

    // 기사 검토 권한 (관리자, 수석 편집자, 편집자)
    canReviewArticles: (user) => {
        return [ROLES.ADMIN, ROLES.CHIEF_EDITOR, ROLES.EDITOR].includes(user?.role);
    },

    // 신문 발행 권한 (관리자, 수석 편집자, 편집자)
    canPublishNewspaper: (user) => {
        return [ROLES.ADMIN, ROLES.CHIEF_EDITOR, ROLES.EDITOR].includes(user?.role);
    },

    // 기사 삭제 권한 (본인 또는 관리자급)
    canDeleteArticle: (user, article) => {
        if (!user || !article) return false;
        // 본인 기사는 삭제 가능
        if (article.authorId === user.id) return true;
        // 관리자나 수석 편집자는 모든 기사 삭제 가능
        return [ROLES.ADMIN, ROLES.CHIEF_EDITOR].includes(user.role);
    },

    // 기사 수정 권한 (본인이고 승인되지 않은 기사)
    canEditArticle: (user, article) => {
        if (!user || !article) return false;
        // 본인 기사만 수정 가능
        if (article.authorId !== user.id) return false;
        // 승인된 기사는 수정 불가
        if (article.status === 'approved') return false;
        return true;
    },

    // 역할 변경 권한
    canAssignRole: (user, targetUser, newRole) => {
        if (!user || !targetUser) return false;

        // 관리자는 모든 역할 변경 가능
        if (user.role === ROLES.ADMIN) return true;

        // 수석 편집자는 기사를 편집자로 임명하거나 해제 가능
        if (user.role === ROLES.CHIEF_EDITOR) {
            // 대상이 기자이고, 새로운 역할이 편집자 또는 기자인 경우 허용
            // 또는 대상이 편집자이고, 새로운 역할이 기자인 경우 허용 (해제)
            if (targetUser.role === ROLES.REPORTER && (newRole === ROLES.EDITOR || newRole === ROLES.REPORTER)) return true;
            if (targetUser.role === ROLES.EDITOR && newRole === ROLES.REPORTER) return true;
        }

        return false;
    }
};

export default permissions;
