import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

interface CompanyRegistrationRequest {
    companyName: string;
    description: string;
    sponsership: string;
    contactPersonName: string;
    contactPersonDesignation: string;
    contactNumber: string;
    location: string;
    companyWebsite: string;
}

export async function POST(request: NextRequest) {
    try {
        const company: CompanyRegistrationRequest = await request.json();
        console.log('Received company data:', company);

        // Validate required fields
        if (!company.companyName || !company.contactPersonName) {
            console.log('Missing required fields');
            return NextResponse.json(
                { message: 'Missing required fields: company name and contact person name required' },
                { status: 400 }
            );
        }

        // Send email to admin
        const { data, error } = await resend.emails.send({
            from: 'Industry Day 2025 <onboarding@resend.dev>',
            to: ['anuka3382@gmail.com'], // Use verified email in test mode
            subject: `New Company Registration Request - ${company.companyName}`,
            html: `
                <h2>New Company Registration Request</h2>
                <p><strong>Industry Day 2025 - University of Peradeniya</strong></p>

                <hr>

                <h3>Company Information</h3>
                <p><strong>Company Name:</strong> ${company.companyName}</p>
                <p><strong>Description:</strong> ${company.description}</p>
                <p><strong>Sponsorship Level:</strong> ${company.sponsership}</p>
                <p><strong>Location:</strong> ${company.location}</p>
                <p><strong>Website:</strong> <a href="${company.companyWebsite}">${company.companyWebsite}</a></p>

                <hr>

                <h3>Contact Person</h3>
                <p><strong>Name:</strong> ${company.contactPersonName}</p>
                <p><strong>Designation:</strong> ${company.contactPersonDesignation}</p>
                <p><strong>Phone:</strong> ${company.contactNumber}</p>

                <hr>

                <p><em>This is an automated notification from FOSID2025.</em></p>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json(
                { message: 'Failed to send email', error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { message: 'Registration request sent successfully', emailId: data?.id },
            { status: 200 }
        );

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}