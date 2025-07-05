import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
    try {
        const { 
            type, role, level, techstack, userid, visibility,
            interviewCategory, jobTitle, responsibilities, ctc, location, designation,
            questions
        } = await request.json();

        console.log("Finalizing interview for user:", userid);

        // Validate required fields
        if (!questions || questions.length === 0) {
            return Response.json({
                success: false,
                error: 'Questions are required'
            }, { status: 400 });
        }

        const interview = {
            role, 
            level, 
            type, 
            techstack: techstack.split(',').map((tech: string) => tech.trim()), 
            questions: questions,
            userId: userid, 
            finalized: true,
            visibility: visibility !== undefined ? visibility : false,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            // Add job-specific fields if it's a job interview
            ...(interviewCategory === 'job' ? {
                interviewCategory,
                jobTitle,
                responsibilities,
                ctc,
                location,
                designation
            } : {
                interviewCategory: interviewCategory || 'mock'
            })
        };

        const docRef = await db.collection("interviews").add(interview);
        
        return Response.json({
            success: true,
            interviewId: docRef.id
        }, { status: 200 });
    } catch (error) {
        console.error('Error finalizing interview:', error);
        return Response.json({
            success: false,
            error: 'Failed to create interview'
        }, { status: 500 });
    }
}
