import React from 'react';
import { useNavigate } from 'react-router-dom';
import permissions, { ROLES } from '../../services/permissions';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';

const ArticleList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { articles, deleteArticle, updateArticle } = useAppData();

    const displayArticles = user.role === ROLES.REPORTER
        ? articles.filter(a => a.authorId === user.id)
        : articles;

    const handleDelete = (id) => {
        if (window.confirm('이 기사를 삭제하시겠습니까?')) {
            deleteArticle(id);
        }
    };

    const handleSubmitForReview = (article) => {
        if (window.confirm('이 기사를 검토 요청하시겠습니까?')) {
            updateArticle(article.id, { status: 'pending' });
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            draft: { bg: 'bg-gray-100', text: 'text-gray-700', label: '임시저장' },
            pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: '검토대기' },
            approved: { bg: 'bg-green-100', text: 'text-green-700', label: '승인' },
            rejected: { bg: 'bg-red-100', text: 'text-red-700', label: '거절' }
        };
        const badge = badges[status] || badges.pending;
        return (
            <span className={`px-2 py-1 rounded-full text-xs ${badge.bg} ${badge.text}`}>
                {badge.label}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">기사 목록</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                    >
                        돌아가기
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayArticles.map(article => (
                        <div key={article.id} className="bg-white rounded-lg shadow overflow-hidden">
                            {article.image && (
                                <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                            )}
                            <div className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-indigo-600 font-semibold">{article.category}</span>
                                    {getStatusBadge(article.status)}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                                <div
                                    className="text-gray-600 text-sm mb-3 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: article.content }}
                                />
                                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                                    <span>{article.author}</span>
                                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="space-y-2">
                                    {permissions.canEditArticle(user, article) && (
                                        <button
                                            onClick={() => navigate(`/articles/edit/${article.id}`)}
                                            className="w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition text-sm"
                                        >
                                            ✏️ 수정
                                        </button>
                                    )}
                                    {article.status === 'draft' && article.authorId === user.id && (
                                        <button
                                            onClick={() => handleSubmitForReview(article)}
                                            className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                                        >
                                            📤 검토 요청
                                        </button>
                                    )}
                                    {permissions.canDeleteArticle(user, article) && (
                                        <button
                                            onClick={() => handleDelete(article.id)}
                                            className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
                                        >
                                            🗑️ 삭제
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArticleList;
