import React from 'react';
import moment from 'moment';
import { Button, Space, Typography } from 'antd';

const { Text } = Typography;

// Define the allowed values for 'relation'
export type GuardianRelation = 'mother' | 'father' | 'grandparent' | 'sibling' | 'uncle' | 'aunt';  // Add 'export'

export interface Guardian {  // Add 'export'
    relation: GuardianRelation; // Use the specific type
    first_name: string;
    last_name: string;
    father_name: string;
    date_of_birth: string;
    place_of_birth: string;
    phone: string;
    address: string;
    work_place: string;
    documentFilePaths?: string[];
}

export interface Document {
    id: number;
    file: {
        path: string;
    } | null;
}

interface Props {
    guardians: Guardian[];
}

const GuardiansInfo: React.FC<Props> = ({ guardians }) => {

    const formatDateForInput = (dateString: string): string => {
        if (!dateString) return '';
        return moment(dateString, 'DD.MM.YYYY').format('DD.MM.YYYY');
    };

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
        <div className="mb-16">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-md text-[#4570EA] font-semibold">Guardians</h3>
            </div>
            {guardians.map((guardian, index) => (
                <div key={index} className="mb-4 p-4 rounded relative">

                    <div className="flex flex-col">
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Relation:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.relation}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">First Name:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.first_name}
                            </div>
                        </div>

                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Last Name:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.last_name}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Father's Name:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.father_name}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Date of Birth:</label>
                            <div className="p-4 w-[400px]">
                                {formatDateForInput(guardian.date_of_birth)}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">
                                Place of Birth:
                            </label>
                            <div className="p-4 w-[400px]">
                                {guardian.place_of_birth}
                            </div>
                        </div>

                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Phone:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.phone}
                            </div>
                        </div>

                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Address:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.address}
                            </div>
                        </div>

                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Work Place:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.work_place}
                            </div>
                        </div>
                        <div className="flex items-center space-x-5 mb-2">
                            <label className="p-3 font-medium w-48">Guardian Documents:</label>
                            <div className="p-4 w-[400px]">
                                {guardian.documentFilePaths && guardian.documentFilePaths.length > 0 ? (
                                    <ul>
                                        {guardian.documentFilePaths.map((path, idx) => (
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
                                ) : (
                                    <div>No documents uploaded.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default GuardiansInfo;