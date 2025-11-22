import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BookOpen, Edit, Users } from 'lucide-react';
import permissions, { ROLES } from '../../services/permissions';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement = () => {
    const navigate = useNavigate();
    const { user, allUsers, updateUserRole } = useAuth();

    const reporters = allUsers.filter(u => u.role === ROLES.REPORTER);
    const editors = allUsers.filter(u => u.role === ROLES.EDITOR);
    const chiefEditors = allUsers.filter(u => u.role === ROLES.CHIEF_EDITOR);
    const admins = allUsers.filter(u => u.role === ROLES.ADMIN);

    const handleRoleChange = (userId, newRole) => {
        if (updateUserRole(userId, newRole)) {
            alert('역할이 변경되었습니다.');
        } else {
            alert('권한이 없습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-indigo-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">멤버 관리</h1>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition"
                    >
                        돌아가기
                    </button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-blue-900 mb-1">권한 안내</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                <li><strong>관리자:</strong> 모든 권한 + 수석 편집자 임명 + 조직 설정</li>
                                <li><strong>수석 편집자:</strong> 기사 검토, 신문 발행, 기자를 편집자로 임명</li>
                                <li><strong>편집자:</strong> 기사 검토, 신문 발행</li>
                                <li><strong>기자:</strong> 기사 작성</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {user.role === ROLES.ADMIN && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-500" />
                            관리자 ({admins.length}명)
                        </h2>
                        <div className="space-y-3">
                            {admins.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                                    <div>
                                        <h3 className="font-bold">{u.name}</h3>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                    </div>
                                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                                        관리자
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-green-500" />
                        수석 편집자 ({chiefEditors.length}명)
                    </h2>
                    <div className="space-y-3">
                        {chiefEditors.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">수석 편집자가 없습니다.</p>
                        ) : (
                            chiefEditors.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                                    <div>
                                        <h3 className="font-bold">{u.name}</h3>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                                            수석 편집자
                                        </span>
                                        {permissions.canAssignRole(user, u, ROLES.REPORTER) && (
                                            <button
                                                onClick={() => handleRoleChange(u.id, ROLES.REPORTER)}
                                                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                                            >
                                                권한 해제
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Edit className="w-6 h-6 text-purple-500" />
                        편집자 ({editors.length}명)
                    </h2>
                    <div className="space-y-3">
                        {editors.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">편집자가 없습니다.</p>
                        ) : (
                            editors.map(u => (
                                <div key={u.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
                                    <div>
                                        <h3 className="font-bold">{u.name}</h3>
                                        <p className="text-sm text-gray-600">{u.email}</p>
                                        {u.memberId && (
                                            <p className="text-xs text-gray-500">회원번호: {u.memberId}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm font-bold">
                                            편집자
                                        </span>
                                        {permissions.canAssignRole(user, u, ROLES.REPORTER) && (
                                            <button
                                                onClick={() => handleRoleChange(u.id, ROLES.REPORTER)}
                                                className="px-3 py-1 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm"
                                            >
                                                해제
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500" />
                        기자 ({reporters.length}명)
                    </h2>
                    <div className="space-y-3">
                        {reporters.map(u => (
                            <div key={u.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div>
                                    <h3 className="font-bold">{u.name}</h3>
                                    <p className="text-sm text-gray-600">{u.email}</p>
                                    {u.memberId && (
                                        <p className="text-xs text-gray-500">회원번호: {u.memberId}</p>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-bold">
                                        기자
                                    </span>
                                    {permissions.canAssignRole(user, u, ROLES.EDITOR) && (
                                        <button
                                            onClick={() => handleRoleChange(u.id, ROLES.EDITOR)}
                                            className="px-3 py-1 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition text-sm"
                                        >
                                            편집자 임명
                                        </button>
                                    )}
                                    {permissions.canAssignRole(user, u, ROLES.CHIEF_EDITOR) && (
                                        <button
                                            onClick={() => handleRoleChange(u.id, ROLES.CHIEF_EDITOR)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition text-sm"
                                        >
                                            수석 편집자 임명
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
