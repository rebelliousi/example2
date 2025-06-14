import React from 'react';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

interface Institution {
    name: string;
    school_gpa: number;
    graduated_year: number;
    certificateFilePaths?: string[]; // undefined olabilir
}

interface Props {
    institutions: Institution[];
}

const InstitutionsInfo: React.FC<Props> = ({ institutions }) => {

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
                    Educational Institutions
                </h3>
            </div>

            {institutions.map((institution, index) => (
                <div key={index} className="mb-4 p-4 rounded relative">

                    <div className="flex flex-col">
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">
                                Institution Name:
                            </label>
                            <div className="p-4 w-[400px]">
                                {institution.name}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">School GPA:</label>
                            <div className="p-4 w-[400px]">
                                {institution.school_gpa}
                            </div>
                        </div>

                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">
                                Graduated Year:
                            </label>
                            <div className="p-4 w-[400px]">
                                {institution.graduated_year}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Certificates:</label>
                            <div className="p-4 w-[400px]">
                                {institution.certificateFilePaths && Array.isArray(institution.certificateFilePaths) && institution.certificateFilePaths.length > 0 ? (
                                    <ul>
                                        {institution.certificateFilePaths.map((path, idx) => (
                                            <li key={idx}>
                                                <Space direction="horizontal" align="center">
                                                    <Text>{getFileIcon(path)}</Text>
                                                    <Button type="primary" size="small" onClick={(e) => {
                                                        e.preventDefault();
                                                        downloadFile(path, path.substring(path.lastIndexOf('/') + 1));
                                                    }}>
                                                        Download Certificate
                                                    </Button>
                                                </Space>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div>No certificates uploaded.</div>
                                )}
                            </div>
                        </div>


                    </div>
                </div>
            ))}

        </div>
    );
};

export default InstitutionsInfo;