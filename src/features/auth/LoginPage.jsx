import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Newspaper, UserPlus, LogIn } from 'lucide-react';
import { ROLES } from '../../services/permissions';
import { useAuth } from '../../contexts/AuthContext';
import { useAppData } from '../../contexts/AppDataContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { user, login, signup, quickLogin } = useAuth();
    const { orgSettings } = useAppData();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [memberId, setMemberId] = useState('');

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (login(email)) {
            navigate('/dashboard');
        } else {
            alert('존재하지 않는 계정입니다.');
        }
    };

    const handleSignup = (e) => {
        e.preventDefault();
        if (!email || !name) {
            alert('이름과 이메일을 모두 입력해주세요.');
            return;
        }
        const newUser = {
            id: Date.now(),
            email,
            name,
            role: ROLES.REPORTER,
            memberId: memberId || null,
            joinedAt: new Date().toISOString()
        };
        signup(newUser);
        alert('가입이 완료되었습니다! 이제 로그인해주세요.');
        setIsLogin(true);
    };

    const handleQuickLogin = (role) => {
        if (quickLogin(role)) {
            navigate('/dashboard');
        } else {
            alert(`${role} 역할의 사용자가 없습니다.`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="p-8 text-center bg-indigo-50">
                    <Newspaper className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">{orgSettings.name}</h1>
                    <p className="text-indigo-600 font-medium">{orgSettings.subtitle}</p>
                </div>

                <div className="p-8">
                    <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
                        <button
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition ${isLogin ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            로그인
                        </button>
                        <button
                            className={`flex-1 py-2 rounded-md text-sm font-bold transition ${!isLogin ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            회원가입
                        </button>
                    </div>

                    <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
                        {!isLogin && (
                            <>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">이름</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        placeholder="홍길동"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">회원번호 (선택)</label>
                                    <input
                                        type="text"
                                        value={memberId}
                                        onChange={(e) => setMemberId(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                        placeholder="12345"
                                    />
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">이메일</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                placeholder="example@email.com"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
                        >
                            {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                            {isLogin ? '로그인' : '가입하기'}
                        </button>
                    </form>

                    {/* 데모용 빠른 로그인 버튼들 */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-xs text-center text-gray-400 mb-4">개발용 빠른 로그인</p>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => handleQuickLogin(ROLES.ADMIN)} className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600">
                                관리자로 로그인
                            </button>
                            <button onClick={() => handleQuickLogin(ROLES.CHIEF_EDITOR)} className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600">
                                수석 편집자로 로그인
                            </button>
                            <button onClick={() => handleQuickLogin(ROLES.EDITOR)} className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600">
                                편집자로 로그인
                            </button>
                            <button onClick={() => handleQuickLogin(ROLES.REPORTER)} className="p-2 text-xs bg-gray-100 hover:bg-gray-200 rounded text-gray-600">
                                기자로 로그인
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
