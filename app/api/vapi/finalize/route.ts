import { getRandomInterviewCover } from "@/lib/utils";
import { db } from "@/firebase/admin";

export async function POST(request: Request) {
    try {
        const { 
            type, role, level, techstack, userid, visibility,
            interviewCategory, jobTitle, responsibilities, ctc, location, designation,
            questions, categorizedQuestions, amount
        } = await request.json();

        console.log("Creating interview structure for user:", userid);

        // Validate required fields
        if (!questions || questions.length === 0) {
            return Response.json({
                success: false,
                error: 'Questions are required'
            }, { status: 400 });
        }

        // Create interview structure (template)
        const interviewStructure = {
            role, 
            level, 
            type, 
            techstack: techstack.split(',').map((tech: string) => tech.trim()), 
            templateQuestions: questions,
            ...(categorizedQuestions && { categorizedQuestions }),
            userId: userid, 
            visibility: visibility !== undefined ? visibility : false,
            coverImage: getRandomInterviewCover(),
            createdAt: new Date().toISOString(),
            
            // Template metadata
            isTemplate: true,
            questionCount: amount || questions.length,
            usageCount: 0, // Track how many times this template has been used
            
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

        // Use structure collections instead of actual interview collections
        const collectionName = interviewCategory === 'job' 
            ? 'job_interview_structures' 
            : 'mock_interview_structures';
            
        const docRef = await db.collection(collectionName).add(interviewStructure);
        
        return Response.json({
            success: true,
            structureId: docRef.id,
            message: `${interviewCategory === 'job' ? 'Job' : 'Mock'} interview structure created successfully!`
        }, { status: 200 });
    } catch (error) {
        console.error('Error creating interview structure:', error);
        return Response.json({
            success: false,
            error: 'Failed to create interview structure'
        }, { status: 500 });
    }
}
