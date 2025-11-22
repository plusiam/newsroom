import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';

const NewspaperBuilder = () => {
    const navigate = useNavigate();
    const { articles, addNewspaper, orgSettings } = useAppData();
    const approvedArticles = articles.filter(a => a.status === 'approved');

    const [editingNewspaper, setEditingNewspaper] = useState({
        id: Date.now(),
        title: '',
        publishDate: new Date().toISOString().split('T')[0],
        articles: [],
        layout: 'classic', // classic, magazine, grid
        status: 'draft'
    });

    useEffect(() => {
        if (approvedArticles.length === 0) {
            alert('발행할 승인된 기사가 없습니다.');
            navigate('/dashboard');
        }
    }, [approvedArticles, navigate]);

    const toggleArticleSelection = (articleId) => {
        const currentArticles = editingNewspaper.articles;
        const newArticles = currentArticles.includes(articleId)
            ? currentArticles.filter(id => id !== articleId)
            : [...currentArticles, articleId];

        setEditingNewspaper({ ...editingNewspaper, articles: newArticles });
    };

    const handlePublish = () => {
        if (!editingNewspaper.title) {
            alert('신문 제목을 입력해주세요.');
            return;
        }
        if (editingNewspaper.articles.length === 0) {
            alert('최소 1개 이상의 기사를 선택해주세요.');
            return;
        }

        const published = {
            ...editingNewspaper,
            status: 'published',
            publishedAt: new Date().toISOString()
        };

        addNewspaper(published);
        alert('신문이 발행되었습니다!');
        navigate('/newspapers');
    };

    const renderPreview = () => {
        const selectedArticles = editingNewspaper.articles
            .map(id => articles.find(a => a.id === id))
            .filter(Boolean);

        if (editingNewspaper.layout === 'magazine') {
            return (
                <div className="grid grid-cols-3 gap-6">
                    {selectedArticles.map((article, index) => (
                        <div key={article.id} className={`${index === 0 ? 'col-span-3 mb-8' : 'col-span-1'} bg-white`}>
                            {article.image && (
                                <img
                                    src={article.image}
                                    alt={article.title}
                                    className={`w-full object-cover mb-4 ${index === 0 ? 'h-96' : 'h-48'}`}
                                />
                            )}
                            <h2 className={`${index === 0 ? 'text-4xl' : 'text-lg'} font-serif font-bold mb-2`}>
                                {article.title}
                            </h2>
                            <p className="text-sm text-gray-600 mb-2 font-serif">
                                {article.category} | {article.author}
                            </p>
                            <div
                                className={`font-serif text-justify leading-relaxed text-gray-800 prose prose-sm max-w-none ${index === 0 ? 'prose-lg' : ''}`}
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        if (editingNewspaper.layout === 'grid') {
            return (
                <div className="columns-2 gap-8 space-y-8">
                    {selectedArticles.map((article) => (
                        <div key={article.id} className="break-inside-avoid mb-8 bg-gray-50 p-4 rounded">
                            {article.image && (
                                <img src={article.image} alt={article.title} className="w-full h-48 object-cover mb-4 rounded" />
                            )}
                            <h2 className="text-xl font-serif font-bold mb-2">{article.title}</h2>
                            <p className="text-sm text-gray-600 mb-2 font-serif">
                                {article.category} | {article.author}
                            </p>
                            <div
                                className="font-serif text-justify leading-relaxed text-gray-800 text-sm prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                        </div>
                    ))}
                </div>
            );
        }

        // Classic Layout (Default)
        return (
            <div className="grid grid-cols-2 gap-8">
                {selectedArticles.map((article, index) => (
                    <div key={article.id} className={`${index === 0 ? 'col-span-2' : 'col-span-1'} mb-8`}>
                        {article.image && (
                            <img src={article.image} alt={article.title} className="w-full h-64 object-cover mb-4 grayscale" />
                        )}
                        <h2 className={`${index === 0 ? 'text-3xl' : 'text-xl'} font-serif font-bold mb-2`}>
                            {article.title}
                        </h2>
                        <p className="text-sm text-gray-600 mb-2 font-serif">
                            {article.category} | {article.author}
                        </p>
                        <div
                            className="font-serif text-justify leading-relaxed text-gray-800 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">신문 편집</h1>
                    <div className="flex gap-3">
                        <button
                            onClick={handlePublish}
                            className="px-6 py-2 bg-green-500 font-bold rounded-lg hover:bg-green-600 transition shadow-lg"
                        >
                            발행하기
                        </button>
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                        >
                            취소
                        </button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 flex gap-8">
                {/* 왼쪽: 설정 및 기사 선택 */}
                <div className="w-1/3 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="font-bold text-lg mb-4">기본 정보</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">신문 제목</label>
                                <input
                                    type="text"
                                    value={editingNewspaper.title}
                                    onChange={(e) => setEditingNewspaper({ ...editingNewspaper, title: e.target.value })}
                                    className="w-full p-2 border rounded"
                                    placeholder="예: 11월 3주차 소식지"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">발행일</label>
                                <input
                                    type="date"
                                    value={editingNewspaper.publishDate}
                                    onChange={(e) => setEditingNewspaper({ ...editingNewspaper, publishDate: e.target.value })}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">레이아웃</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['classic', 'magazine', 'grid'].map(layout => (
                                        <button
                                            key={layout}
                                            onClick={() => setEditingNewspaper({ ...editingNewspaper, layout })}
                                            className={`p-2 text-sm rounded border ${editingNewspaper.layout === layout
                                                ? 'bg-indigo-600 text-white border-indigo-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {layout === 'classic' && '클래식'}
                                            {layout === 'magazine' && '매거진'}
                                            {layout === 'grid' && '그리드'}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h2 className="font-bold text-lg mb-4">기사 선택 ({editingNewspaper.articles.length}개)</h2>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {approvedArticles.map(article => (
                                <div
                                    key={article.id}
                                    onClick={() => toggleArticleSelection(article.id)}
                                    className={`p-3 rounded border cursor-pointer transition ${editingNewspaper.articles.includes(article.id)
                                        ? 'border-indigo-500 bg-indigo-50'
                                        : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <h3 className="font-bold text-sm mb-1">{article.title}</h3>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>{article.author}</span>
                                        <span>{article.category}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 미리보기 */}
                <div className="w-2/3">
                    <div className="bg-white shadow-2xl min-h-[800px] p-12">
                        <div className="text-center border-b-4 border-black pb-8 mb-8">
                            <h1 className="text-5xl font-serif font-bold mb-4">{orgSettings.name}</h1>
                            <div className="flex justify-between items-center border-t-2 border-b-2 border-black py-2 px-4">
                                <span className="font-serif">{editingNewspaper.publishDate}</span>
                                <span className="font-serif font-bold text-xl">{editingNewspaper.title}</span>
                                <span className="font-serif">{orgSettings.subtitle}</span>
                            </div>
                        </div>

                        {renderPreview()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewspaperBuilder;
