import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';

const ApprovalQueue = () => {
    const navigate = useNavigate();
    const { articles, updateArticle } = useAppData();
    const pendingArticles = articles.filter(a => a.status === 'pending');

    const handleApprove = (id, approve) => {
        updateArticle(id, { status: approve ? 'approved' : 'rejected' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg" role="banner">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">기사 검토 대기열</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                        aria-label="대시보드로 돌아가기"
                    >
                        돌아가기
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {pendingArticles.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">검토 대기 중인 기사가 없습니다.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingArticles.map(article => (
                            <div key={article.id} className="bg-white rounded-lg shadow p-6 flex gap-6">
                                {article.image && (
                                    <img src={article.image} alt={article.title} className="w-48 h-32 object-cover rounded-lg" />
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-indigo-600 font-semibold">{article.category}</span>
                                        <span className="text-sm text-gray-500">{article.author}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{article.title}</h3>
                                    {/* 리치 텍스트 미리보기 - 프로덕션에서는 DOMPurify 사용 권장 */}
                                    <div
                                        className="text-gray-600 mb-4 prose prose-sm max-w-none line-clamp-3"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleApprove(article.id, true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                            aria-label={`${article.title} 기사 승인`}
                                        >
                                            <CheckCircle className="w-4 h-4" aria-hidden="true" />
                                            승인
                                        </button>
                                        <button
                                            onClick={() => handleApprove(article.id, false)}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                            aria-label={`${article.title} 기사 반려`}
                                        >
                                            <XCircle className="w-4 h-4" aria-hidden="true" />
                                            반려
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ApprovalQueue;
