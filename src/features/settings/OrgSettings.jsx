import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import { useAppData } from '../../contexts/AppDataContext';

const OrgSettings = () => {
    const navigate = useNavigate();
    const { orgSettings, updateOrgSettings } = useAppData();

    const [settingsForm, setSettingsForm] = useState(orgSettings);
    const [newCategory, setNewCategory] = useState('');

    const handleAddCategory = () => {
        if (newCategory && !settingsForm.categories.includes(newCategory)) {
            setSettingsForm({
                ...settingsForm,
                categories: [...settingsForm.categories, newCategory]
            });
            setNewCategory('');
        }
    };

    const removeCategory = (cat) => {
        setSettingsForm({
            ...settingsForm,
            categories: settingsForm.categories.filter(c => c !== cat)
        });
    };

    const handleUpdate = () => {
        updateOrgSettings(settingsForm);
        alert('조직 설정이 저장되었습니다!');
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">조직 설정</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                    >
                        돌아가기
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div>
                        <label className="block font-bold mb-2">신문사 이름</label>
                        <input
                            type="text"
                            value={settingsForm.name}
                            onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2">부제목 / 슬로건</label>
                        <input
                            type="text"
                            value={settingsForm.subtitle}
                            onChange={(e) => setSettingsForm({ ...settingsForm, subtitle: e.target.value })}
                            className="w-full p-3 border rounded-lg"
                        />
                    </div>

                    <div>
                        <label className="block font-bold mb-2">기사 카테고리 관리</label>
                        <div className="flex gap-2 mb-3">
                            <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="flex-1 p-2 border rounded-lg"
                                placeholder="새 카테고리 이름"
                            />
                            <button
                                onClick={handleAddCategory}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                추가
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {settingsForm.categories.map(cat => (
                                <span key={cat} className="px-3 py-1 bg-gray-100 rounded-full flex items-center gap-2">
                                    {cat}
                                    <button
                                        onClick={() => removeCategory(cat)}
                                        className="text-red-500 hover:text-red-700 font-bold"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleUpdate}
                        className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                    >
                        <Save className="w-5 h-5" />
                        설정 저장하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrgSettings;
