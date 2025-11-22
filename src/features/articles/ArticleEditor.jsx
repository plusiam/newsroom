import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';
import RichTextEditor from '../../components/RichTextEditor';

const ArticleEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAuth();
    const { orgSettings, addArticle, updateArticle, articles } = useAppData();

    const isEditMode = !!id;
    const existingArticle = isEditMode ? articles.find(a => a.id === parseInt(id)) : null;

    const [articleForm, setArticleForm] = useState({
        title: '',
        content: '',
        author: '',
        category: orgSettings.categories[0] || '일반소식',
        image: null
    });

    useEffect(() => {
        if (isEditMode && existingArticle) {
            // 수정 권한 확인
            if (existingArticle.authorId !== user.id) {
                alert('본인의 기사만 수정할 수 있습니다.');
                navigate('/articles');
                return;
            }
            if (existingArticle.status === 'approved') {
                alert('승인된 기사는 수정할 수 없습니다.');
                navigate('/articles');
                return;
            }
            setArticleForm({
                title: existingArticle.title,
                content: existingArticle.content,
                category: existingArticle.category,
                image: existingArticle.image
            });
        }
    }, [isEditMode, existingArticle, user.id]);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setArticleForm({ ...articleForm, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (status) => {
        if (!articleForm.title || !articleForm.content) {
            alert('제목과 내용을 입력해주세요.');
            return;
        }

        if (isEditMode) {
            // 수정 모드
            updateArticle(existingArticle.id, {
                ...articleForm,
                status: status,
                updatedAt: new Date().toISOString()
            });
            alert(status === 'draft' ? '임시 저장되었습니다!' : '검토 요청이 제출되었습니다!');
        } else {
            // 새 기사
            const newArticle = {
                id: Date.now(),
                ...articleForm,
                author: user.name,
                authorId: user.id,
                status: status,
                createdAt: new Date().toISOString()
            };
            addArticle(newArticle);
            alert(status === 'draft' ? '임시 저장되었습니다!' : '기사가 제출되었습니다!');
        }
        navigate('/articles');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">{isEditMode ? '기사 수정' : '새 기사 작성'}</h1>
                    <button
                        onClick={() => navigate('/articles')}
                        className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                    >
                        돌아가기
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold mb-2">카테고리</label>
                                <select
                                    value={articleForm.category}
                                    onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })}
                                    className="w-full p-2 border rounded-lg"
                                >
                                    {orgSettings.categories.map(cat => (
                                        <option key={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block font-bold mb-2">대표 이미지 (선택)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="w-full p-2 border rounded-lg"
                                />
                            </div>
                        </div>

                        {articleForm.image && (
                            <div className="mb-4">
                                <p className="text-sm text-gray-500 mb-1">대표 이미지 미리보기:</p>
                                <img src={articleForm.image} alt="Preview" className="max-h-48 rounded-lg object-cover" />
                            </div>
                        )}

                        <div>
                            <label className="block font-bold mb-2">기사 제목</label>
                            <input
                                type="text"
                                value={articleForm.title}
                                onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                                className="w-full p-3 border rounded-lg text-lg font-bold"
                                placeholder="기사 제목을 입력하세요"
                            />
                        </div>

                        <div>
                            <label className="block font-bold mb-2">기사 내용</label>
                            <RichTextEditor
                                content={articleForm.content}
                                onChange={(html) => setArticleForm({ ...articleForm, content: html })}
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => handleSubmit('draft')}
                                className="flex-1 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-bold text-lg"
                            >
                                💾 임시 저장
                            </button>
                            <button
                                onClick={() => handleSubmit('pending')}
                                className="flex-1 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-bold text-lg"
                            >
                                📤 검토 요청
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleEditor;
