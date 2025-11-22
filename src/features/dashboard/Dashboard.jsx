import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Newspaper, Settings, UserCog, FileText, Send } from 'lucide-react';
import permissions, { ROLES } from '../../services/permissions';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';

const Dashboard = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { articles, newspapers, orgSettings } = useAppData();

    const myArticles = articles.filter(a => a.authorId === user.id);
    const pendingArticles = articles.filter(a => a.status === 'pending');
    const canReview = permissions.canReviewArticles(user);
    const canManageUsers = permissions.canManageUsers(user);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Newspaper className="w-8 h-8" />
                        <div>
                            <h1 className="text-2xl font-bold">{orgSettings.name}</h1>
                            <p className="text-sm text-indigo-200">
                                {user.name}님 ({permissions.getRoleName(user.role)})
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                    >
                        로그아웃
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <FileText className="w-6 h-6 text-blue-500" />
                            <h3 className="font-bold text-lg">전체 기사</h3>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{articles.length}</p>
                    </div>

                    {canReview && (
                        <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <Send className="w-6 h-6 text-orange-500" />
                                <h3 className="font-bold text-lg">검토 대기</h3>
                            </div>
                            <p className="text-3xl font-bold text-orange-600">{pendingArticles.length}</p>
                        </div>
                    )}

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center gap-3 mb-2">
                            <Newspaper className="w-6 h-6 text-green-500" />
                            <h3 className="font-bold text-lg">발행 신문</h3>
                        </div>
                        <p className="text-3xl font-bold text-green-600">{newspapers.length}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <button
                        onClick={() => navigate('/articles/new')}
                        className="p-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex flex-col items-center gap-2"
                    >
                        <Plus className="w-8 h-8" />
                        <span className="font-bold">새 기사 작성</span>
                    </button>

                    <button
                        onClick={() => navigate('/articles')}
                        className="p-6 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition flex flex-col items-center gap-2"
                    >
                        <FileText className="w-8 h-8" />
                        <span className="font-bold">기사 목록</span>
                    </button>

                    {canReview && (
                        <button
                            onClick={() => navigate('/articles/review')}
                            className="p-6 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition flex flex-col items-center gap-2"
                        >
                            <Edit className="w-8 h-8" />
                            <span className="font-bold">기사 검토</span>
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/newspapers')}
                        className="p-6 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex flex-col items-center gap-2"
                    >
                        <Newspaper className="w-8 h-8" />
                        <span className="font-bold">발행 신문</span>
                    </button>

                    {canManageUsers && (
                        <button
                            onClick={() => navigate('/settings/users')}
                            className="p-6 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex flex-col items-center gap-2"
                        >
                            <UserCog className="w-8 h-8" />
                            <span className="font-bold">멤버 관리</span>
                        </button>
                    )}

                    {permissions.canManageOrgSettings(user) && (
                        <button
                            onClick={() => navigate('/settings/org')}
                            className="p-6 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition flex flex-col items-center gap-2"
                        >
                            <Settings className="w-8 h-8" />
                            <span className="font-bold">조직 설정</span>
                        </button>
                    )}
                </div>

                {user.role === ROLES.REPORTER && myArticles.length > 0 && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-bold mb-4">내 최근 기사</h2>
                        <div className="space-y-3">
                            {myArticles.slice(-3).reverse().map(article => (
                                <div key={article.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <h3 className="font-semibold">{article.title}</h3>
                                        <p className="text-sm text-gray-600">{article.category}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-sm ${article.status === 'approved' ? 'bg-green-100 text-green-700' :
                                            article.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {article.status === 'approved' ? '승인됨' :
                                            article.status === 'rejected' ? '거절됨' : '검토중'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
