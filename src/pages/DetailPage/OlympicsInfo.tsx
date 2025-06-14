import React from 'react';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

interface Olympic {
    type: string;
    description: string;
    olympicFilePaths?: string[] | string; // undefined olabilir, string veya string[] olabilir
}

interface Props {
    olympics: Olympic[];
}

const OlympicsInfo: React.FC<Props> = ({ olympics }) => {

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
                <h3 className="text-md text-[#4570EA] font-semibold">
                    Olympic Participation
                </h3>
            </div>
            {olympics.map((olympic, index) => (
                <div key={index} className="mb-4 p-4 rounded relative">

                    <div className="flex flex-col">
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Olympic Type:</label>
                            <div className="p-4 w-[400px]">
                                {olympic.type}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Description:</label>
                            <div className="p-4 w-[400px]">
                                {olympic.description}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Olympic Files:</label>
                            <div className="p-4 w-[400px]">
                                {(() => {
                                    if (olympic.olympicFilePaths && typeof olympic.olympicFilePaths === 'string') {
                                        // olympicFilePaths bir string ise
                                        return (
                                            <ul>
                                                <li key={0}>
                                                    <Space direction="horizontal" align="center">
                                                        <Text>{getFileIcon(olympic.olympicFilePaths)}</Text>
                                                        <Button type="primary" size="small" onClick={(e) => {
                                                            e.preventDefault();
                                                            downloadFile(olympic.olympicFilePaths, olympic.olympicFilePaths.substring(olympic.olympicFilePaths.lastIndexOf('/') + 1));
                                                        }}>
                                                            Download File
                                                        </Button>
                                                    </Space>
                                                </li>
                                            </ul>
                                        );
                                    } else if (olympic.olympicFilePaths && Array.isArray(olympic.olympicFilePaths) && olympic.olympicFilePaths.length > 0) {
                                        // olympicFilePaths bir array ise
                                        return (
                                            <ul>
                                                {olympic.olympicFilePaths.map((path, idx) => (
                                                    <li key={idx}>
                                                        <Space direction="horizontal" align="center">
                                                            <Text>{getFileIcon(path)}</Text>
                                                            <Button type="primary" size="small" onClick={(e) => {
                                                                e.preventDefault();
                                                                downloadFile(path, path.substring(path.lastIndexOf('/') + 1));
                                                            }}>
                                                                Download File
                                                            </Button>
                                                        </Space>
                                                    </li>
                                                ))}
                                            </ul>
                                        );
                                    } else {
                                        // olympicFilePaths undefined veya boş ise
                                        return <div>No files uploaded.</div>;
                                    }
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OlympicsInfo;