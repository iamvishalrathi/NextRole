import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
    try {
        const { 
            type, role, level, techstack, amount, 
            interviewCategory, jobTitle, responsibilities, ctc, location, designation,
            regenerate 
        } = await request.json();

        const { text: questions } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `${regenerate ? 'Regenerate completely new and different questions' : 'Generate questions'} for a job interview.
            The job role is ${role}.
            The job experience level is ${level}.
            The tech stack used in the job is: ${techstack}.
            The focus between behavioural and technical questions should lean towards: ${type}.
            The amount of questions required is: ${amount}.
            ${interviewCategory === 'job' ? `
            This is for an actual job opening with these details:
            - Job Title: ${jobTitle}
            - Designation: ${designation}
            - Location: ${location}
            - CTC: ${ctc}
            - Key Responsibilities: ${responsibilities}
            
            Please tailor the questions to be more specific to this job opening and its requirements.
            ` : 'This is a mock interview for practice purposes.'}
            
            ${regenerate ? 'Make sure these questions are completely different from any previous set of questions for the same role and requirements.' : ''}
            
            Please return only the questions, without any additional text.
            The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
            Return the questions formatted like this:
            ["Question 1", "Question 2", "Question 3"]
            
            Thank you! <3
        `,
        });

        return Response.json({
            success: true,
            questions: JSON.parse(questions)
        }, { status: 200 });
    } catch (error) {
        console.error('Error generating questions:', error);
        return Response.json({
            success: false,
            error: 'Failed to generate questions'
        }, { status: 500 });
    }
}
