import React, { useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../../contexts/AppDataContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const NewspaperViewer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { newspapers, articles, orgSettings } = useAppData();
    const newspaperRef = useRef(null);

    const newspaper = newspapers.find(n => n.id === Number(id));

    if (!newspaper) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>신문을 찾을 수 없습니다.</p>
                <button onClick={() => navigate('/newspapers')}>목록으로</button>
            </div>
        );
    }

    const handleExportPDF = async () => {
        if (!newspaperRef.current) return;

        try {
            const canvas = await html2canvas(newspaperRef.current, {
                scale: 2, // 고해상도
                useCORS: true, // 이미지 로딩 허용
                logging: false
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${newspaper.title}.pdf`);
        } catch (error) {
            console.error('PDF Export Error:', error);
            alert('PDF 변환 중 오류가 발생했습니다.');
        }
    };

    const renderContent = () => {
        const selectedArticles = newspaper.articles
            .map(id => articles.find(a => a.id === id))
            .filter(Boolean);

        const layout = newspaper.layout || 'classic';

        if (layout === 'magazine') {
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

        if (layout === 'grid') {
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

        // Classic Layout
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
        <div className="min-h-screen bg-gray-200 py-8">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/newspapers')}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
                    >
                        &larr; 목록으로 돌아가기
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition shadow-lg flex items-center gap-2"
                    >
                        PDF로 저장
                    </button>
                </div>

                <div ref={newspaperRef} className="bg-white shadow-2xl max-w-4xl mx-auto p-12">
                    <div className="text-center border-b-4 border-black pb-8 mb-8">
                        <h1 className="text-5xl font-serif font-bold mb-4">{orgSettings.name}</h1>
                        <div className="flex justify-between items-center border-t-2 border-b-2 border-black py-2 px-4">
                            <span className="font-serif">{newspaper.publishDate}</span>
                            <span className="font-serif font-bold text-xl">{newspaper.title}</span>
                            <span className="font-serif">{orgSettings.subtitle}</span>
                        </div>
                    </div>

                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default NewspaperViewer;
