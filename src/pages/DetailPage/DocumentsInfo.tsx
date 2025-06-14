import React from 'react';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

interface Document {
    type: string;
    documentFilePaths?: string[]; // undefined olabilir, string[] olmalı
}

interface Props {
    documents: Document[];
}

const DocumentsInfo: React.FC<Props> = ({ documents }) => {

    const getFileExtension = (filename: string): string => {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    };

    const getFileIcon = (filename: string): string => {
        const extension = getFileExtension(filename).toLowerCase();
        switch (extension) {
            case 'pdf': return '📄';
            case 'doc': case 'docx': return 'Word';
            case 'xls': case 'xlsx': return 'Excel';
            case 'jpg': case 'jpeg': case 'png': case 'gif': return '🖼️';
            default: return '';
        }
    };

    const downloadFile = (url: string, filename: string) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
        })
            .then(response => response.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(error => {
                console.error('Download error:', error);

            });
    };

    return (
        <div className="w-full mb-40">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md text-[#4570EA] font-semibold">Documents</h3>
            </div>
            {documents.map((document, index) => (
                <div key={index} className="mb-4 p-4 rounded relative">
                    <div className="flex flex-col">
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Document Type:</label>
                            <div className="p-4 w-[400px]">
                                {document.type}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Documents Files:</label>
                            <div className="p-4 w-[400px]">
                                {document.documentFilePaths && document.documentFilePaths.length > 0 ? (
                                    <ul>
                                        {document.documentFilePaths.map((path, idx) => {
                                            const filename = path.split('/').pop() || 'document'; // Dosya adını çıkar
                                            return (
                                                <li key={idx}>
                                                    <Space direction="horizontal" align="center">
                                                        <Text>{getFileIcon(path)}</Text>
                                                        <Button type="primary" size="small" onClick={(e) => {
                                                            e.preventDefault();
                                                            downloadFile(path, filename); // Fonksiyonu doğru parametrelerle çağır
                                                        }}>
                                                            Download File
                                                        </Button>
                                                    </Space>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <div>No files uploaded.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DocumentsInfo;