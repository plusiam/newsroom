
const STORAGE_KEYS = {
    USERS: 'users',
    ARTICLES: 'articles',
    NEWSPAPERS: 'newspapers',
    ORG_SETTINGS: 'orgSettings'
};

// 기본 관리자 계정
const DEFAULT_ADMIN = {
    id: 1,
    name: '관리자',
    email: 'admin@newspaper.com',
    role: 'admin',
    memberId: null
};

// 기본 조직 설정
const DEFAULT_ORG_SETTINGS = {
    name: '우리 신문사',
    subtitle: '함께 만드는 이야기',
    categories: ['일반소식', '행사/이벤트', '인터뷰', '문화/생활', '의견/칼럼', '기타']
};

const storage = {
    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error reading ${key} from localStorage`, error);
            return null;
        }
    },

    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error writing ${key} to localStorage`, error);
        }
    },

    // Users
    getUsers: () => {
        const users = storage.get(STORAGE_KEYS.USERS);
        if (!users || users.length === 0) {
            const initialUsers = [DEFAULT_ADMIN];
            storage.set(STORAGE_KEYS.USERS, initialUsers);
            return initialUsers;
        }
        return users;
    },

    saveUsers: (users) => {
        storage.set(STORAGE_KEYS.USERS, users);
    },

    // Articles
    getArticles: () => {
        return storage.get(STORAGE_KEYS.ARTICLES) || [];
    },

    saveArticles: (articles) => {
        storage.set(STORAGE_KEYS.ARTICLES, articles);
    },

    // Newspapers
    getNewspapers: () => {
        return storage.get(STORAGE_KEYS.NEWSPAPERS) || [];
    },

    saveNewspapers: (newspapers) => {
        storage.set(STORAGE_KEYS.NEWSPAPERS, newspapers);
    },

    // Org Settings
    getOrgSettings: () => {
        return storage.get(STORAGE_KEYS.ORG_SETTINGS) || DEFAULT_ORG_SETTINGS;
    },

    saveOrgSettings: (settings) => {
        storage.set(STORAGE_KEYS.ORG_SETTINGS, settings);
    }
};

export default storage;
