import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper } from 'lucide-react';
import permissions from '../../services/permissions';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';

const NewspaperList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { newspapers, articles } = useAppData();
    const canCreate = permissions.canPublishNewspaper(user);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">발행된 신문</h1>
                    <div className="flex gap-3">
                        {canCreate && (
                            <button
                                onClick={() => navigate('/newspapers/new')}
                                className="px-4 py-2 bg-green-500 rounded-lg hover:bg-green-600 transition"
                            >
                                신문 만들기
                            </button>
                        )}
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                        >
                            돌아가기
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                {newspapers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">아직 발행된 신문이 없습니다.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {newspapers.map(newspaper => {
                            const newspaperArticles = articles.filter(a => newspaper.articles.includes(a.id));
                            return (
                                <div
                                    key={newspaper.id}
                                    onClick={() => navigate(`/newspapers/${newspaper.id}`)}
                                    className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer overflow-hidden"
                                >
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white">
                                        <Newspaper className="w-12 h-12 mb-3" />
                                        <h3 className="font-bold text-xl mb-1">{newspaper.title}</h3>
                                        <p className="text-indigo-100 text-sm">{newspaper.publishDate}</p>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between text-sm text-gray-600">
                                            <span>{newspaperArticles.length}개 기사</span>
                                            <span>{new Date(newspaper.publishedAt).toLocaleDateString()}</span>
                                        </div>
                                        <button className="mt-3 w-full py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">
                                            신문 보기
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NewspaperList;
