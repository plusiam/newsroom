import React, { createContext, useContext, useState, useEffect } from 'react';
import storage from '../services/storage';

const AppDataContext = createContext(null);

export const AppDataProvider = ({ children }) => {
    const [articles, setArticles] = useState([]);
    const [newspapers, setNewspapers] = useState([]);
    const [orgSettings, setOrgSettings] = useState({
        name: '우리 신문사',
        subtitle: '함께 만드는 이야기',
        categories: ['일반소식', '행사/이벤트', '인터뷰', '문화/생활', '의견/칼럼', '기타']
    });

    useEffect(() => {
        setArticles(storage.getArticles());
        setNewspapers(storage.getNewspapers());
        setOrgSettings(storage.getOrgSettings());
    }, []);

    useEffect(() => {
        storage.saveArticles(articles);
    }, [articles]);

    useEffect(() => {
        storage.saveNewspapers(newspapers);
    }, [newspapers]);

    useEffect(() => {
        storage.saveOrgSettings(orgSettings);
    }, [orgSettings]);

    const addArticle = (article) => {
        setArticles(prev => [...prev, article]);
    };

    const updateArticle = (id, updates) => {
        setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const deleteArticle = (id) => {
        setArticles(prev => prev.filter(a => a.id !== id));
    };

    const addNewspaper = (newspaper) => {
        setNewspapers(prev => [...prev, newspaper]);
    };

    const updateOrgSettings = (newSettings) => {
        setOrgSettings(newSettings);
    };

    return (
        <AppDataContext.Provider value={{
            articles,
            newspapers,
            orgSettings,
            addArticle,
            updateArticle,
            deleteArticle,
            addNewspaper,
            updateOrgSettings
        }}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error('useAppData must be used within an AppDataProvider');
    }
    return context;
};
