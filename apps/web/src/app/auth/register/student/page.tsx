'use client'; 

import React, { useState, ChangeEvent, FormEvent, CSSProperties } from 'react';
import api from '@/lib/axios'; 
import axios from 'axios'; 

// Assuming UserRole enum value for a student is 'student' (lowercase)
type UserRole = 'student' | 'admin' | 'lecturer'; 
type StudentLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4';

interface CreateUserDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole; 
}

interface StudentDto {
    regNo: string;
    nic?: string; 
    contact?: string; 
    linkedin?: string; 
    group: string;
    level: StudentLevel;
}

interface CreateStudentDto {
    user: CreateUserDto;
    student: StudentDto;
}

interface StudentResponse {
    studentID: string;
}

type StyleObject = {
    [key: string]: CSSProperties;
};

const styles: StyleObject = {
    container: { padding: '2rem', maxWidth: '500px', margin: '2rem auto', border: '1px solid #ddd', borderRadius: '8px' } as CSSProperties,
    input: { display: 'block', width: '100%', padding: '0.5rem', margin: '0.5rem 0', boxSizing: 'border-box' } as CSSProperties,
    select: { display: 'block', width: '100%', padding: '0.5rem', margin: '0.5rem 0', boxSizing: 'border-box' } as CSSProperties,
    button: { padding: '0.75rem 1.5rem', marginTop: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' } as CSSProperties,
    message: { marginTop: '1rem', padding: '1rem', border: '1px solid #ccc', whiteSpace: 'pre-wrap' } as CSSProperties
};

const RegisterPage = () => {
    const [formData, setFormData] = useState<CreateStudentDto>({
        // 💡 FIXED: Role set to lowercase 'student'
        user: { email: '', password: '', firstName: '', lastName: '', role: 'student' as UserRole },
        student: { regNo: '', nic: '', contact: '', linkedin: '', group: 'A', level: 'level_4' }
    });
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [parent, field] = name.split('.') as ['user' | 'student', keyof CreateUserDto | keyof StudentDto]; 

        setFormData(prevData => ({
            ...prevData,
            [parent]: { 
                ...prevData[parent], 
                [field]: value 
            }
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;

        if (file && file.type !== 'application/pdf') {
            setMessage('Error: Only PDF files are allowed for CV.');
            setCvFile(null);
            return;
        }
        setMessage('');
        setCvFile(file);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cvFile) {
            setMessage('Error: CV file is required.');
            return;
        }
        
        const jsonPayload = JSON.stringify(formData, null, 2);
        console.log("--- JSON PAYLOAD SENT TO NESTJS ---");
        console.log(jsonPayload);

        setLoading(true);
        setMessage('Registering...');

        const dataToSend = new FormData();
        dataToSend.append('cv_file', cvFile);
        dataToSend.append('createStudentDto', jsonPayload);

        try {
            const response = await api.post<StudentResponse>('/student/register', dataToSend);

            setMessage(`✅ Registration successful! Student ID: ${response.data.studentID}`);
            
        } catch (error) {
            const status = axios.isAxiosError(error) && error.response 
                ? error.response.status 
                : 'N/A';
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Network or unhandled server error.';
            
            setMessage(`❌ Error (Status: ${status}):\n${errorMessage}`);
            
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2>Student Registration (TS)</h2>
            <form onSubmit={handleSubmit}>
                
                <h3>User Credentials</h3>
                <input style={styles.input} type="text" name="user.firstName" placeholder="Alex" value={formData.user.firstName} onChange={handleChange} required />
                <input style={styles.input} type="text" name="user.lastName" placeholder="Johnson" value={formData.user.lastName} onChange={handleChange} required />
                <input style={styles.input} type="text" name="user.email" placeholder="alex.johnson@uni.edu" value={formData.user.email} onChange={handleChange} required />
                <input style={styles.input} type="password" name="user.password" placeholder="********" value={formData.user.password} onChange={handleChange} required />
                {/* Role field is now implicitly set to 'student' in the state */}

                <h3>Student Information</h3>
                <input style={styles.input} type="text" name="student.regNo" placeholder="S2024001" value={formData.student.regNo} onChange={handleChange} required />
                <input style={styles.input} type="text" name="student.group" placeholder="Group A" value={formData.student.group} onChange={handleChange} required />
                
                <input style={styles.input} type="text" name="student.nic" placeholder="987654321V" value={formData.student.nic} onChange={handleChange} required />
                <input style={styles.input} type="text" name="student.contact" placeholder="0771234567" value={formData.student.contact} onChange={handleChange} required />
                <input style={styles.input} type="text" name="student.linkedin" placeholder="https://linkedin.com/in/profile" value={formData.student.linkedin} onChange={handleChange} />

                <select style={styles.select} name="student.level" value={formData.student.level} onChange={handleChange} required>
                    <option value="level_4">Level 4</option>
                    <option value="level_3">Level 3</option>
                    <option value="level_2">Level 2</option>
                    <option value="level_1">Level 1</option>
                </select>

                <h3>CV Upload (PDF Only)</h3>
                <input type="file" name="cv_file" accept="application/pdf" onChange={handleFileChange} required />
                
                <button type="submit" style={styles.button} disabled={loading || !cvFile}>
                    {loading ? 'Processing...' : 'Register'}
                </button>
            </form>

            <div style={styles.message}>
                {message || 'Awaiting registration data...'}
            </div>
        </div>
    );
}

export default RegisterPage;