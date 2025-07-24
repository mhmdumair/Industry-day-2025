'use client';
import { useState } from 'react';

export default function UploadResume() {
    const [file, setFile] = useState<File | null>(null);
    const [uploadUrl, setUploadUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('http://localhost:3001/resumes/upload', {
            method: 'POST',
            body: formData,
        });

        const data = await res.json();
        setUploadUrl(`http://localhost:3001${data.url}`);
    };

    return (
        <div className="max-w-lg mx-auto mt-10">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    Upload Resume
                </button>
            </form>

            {uploadUrl && (
                <p className="mt-4 text-blue-600">
                    Uploaded: <a href={uploadUrl} target="_blank">{uploadUrl}</a>
                </p>
            )}
        </div>
    );
}
