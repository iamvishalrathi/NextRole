import { generateText } from "ai";
import { google } from "@ai-sdk/google";
import { db } from "@/firebase/admin";

// Helper function to recursively clean undefined values from objects
function cleanObjectForFirestore(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
        return null;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => cleanObjectForFirestore(item)).filter(item => item !== null && item !== undefined);
    }
    
    if (typeof obj === 'object') {
        const cleaned: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
            const cleanedValue = cleanObjectForFirestore(value);
            if (cleanedValue !== null && cleanedValue !== undefined) {
                cleaned[key] = cleanedValue;
            }
        }
        return cleaned;
    }
    
    return obj;
}

export async function POST(request: Request) {
    const requestId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    try {
        const { structureId, userId, resume, generatePersonalized } = await request.json();

        console.log(`[${requestId}] Generating personalized interview for user:`, userId, "from structure:", structureId);

        // Validate required fields
        if (!structureId || !userId) {
            return Response.json({
                success: false,
                error: 'Structure ID and User ID are required'
            }, { status: 400 });
        }

        // Get user profile if generatePersonalized is true
        let userProfile = null;
        if (generatePersonalized) {
            try {
                const profileDoc = await db.collection("profiles").doc(userId).get();
                if (profileDoc.exists) {
                    userProfile = profileDoc.data();
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                // Continue without profile data
            }
        }

        // Get the interview structure from the appropriate collection
        // First try mock, then job interview structures
        let structureDoc = await db.collection('mock_interview_structures').doc(structureId).get();
        let actualInterviewCategory = 'mock';
        
        if (!structureDoc.exists) {
            structureDoc = await db.collection('job_interview_structures').doc(structureId).get();
            actualInterviewCategory = 'job';
        }
        
        if (!structureDoc.exists) {
            return Response.json({
                success: false,
                error: 'Interview structure not found'
            }, { status: 404 });
        }

        const structure = structureDoc.data();
        
        if (!structure) {
            return Response.json({
                success: false,
                error: 'Invalid interview structure data'
            }, { status: 400 });
        }

        // Check for existing interview with this structure and user (robust duplicate check)
        const targetCollection = actualInterviewCategory === 'job' 
            ? 'job_interviews' 
            : 'mock_interviews';
            
        try {
            console.log(`[${requestId}] Checking for existing interview in ${targetCollection} collection`);
            
            const existingQuery = await db.collection(targetCollection)
                .where('structureId', '==', structureId)
                .where('userId', '==', userId)
                .limit(1)
                .get();

            if (!existingQuery.empty) {
                const existingDoc = existingQuery.docs[0];
                console.log(`[${requestId}] Interview already exists for this user and structure, returning existing interview:`, existingDoc.id);
                return Response.json({
                    success: true,
                    interviewId: existingDoc.id,
                    message: 'Interview already exists for this structure',
                    duplicate: true
                }, { status: 200 });
            }
            
            console.log(`[${requestId}] No existing interview found, proceeding with generation`);
        } catch (duplicateCheckError) {
            console.log(`[${requestId}] Could not check for duplicates, proceeding with generation:`, duplicateCheckError);
            // Continue with generation even if duplicate check fails
        }

        // Generate personalized questions based on user profile, resume, and structure
        const profileData = userProfile ? `
USER PROFILE DATA:
- Current Role: ${userProfile.currentRole || 'Not specified'}
- Experience: ${userProfile.experience || 'Not specified'}
- Skills: ${userProfile.skills || 'Not specified'}
- Education: ${userProfile.education || 'Not specified'}
- Location: ${userProfile.location || 'Not specified'}
- Phone: ${userProfile.phone || 'Not specified'}
${userProfile.resume ? `
Resume/Background:
${userProfile.resume}
` : ''}
` : '';

        // Generate personalized questions using the structure's personalized prompt
        const personalizedPrompt = structure.personalizedQuestionPrompt || 
            'Focus on the candidate\'s specific experience, skills mentioned in their profile, and practical scenarios related to their background.';

        console.log(`[${requestId}] Using personalized prompt: ${personalizedPrompt}`);

        const { text: personalizedQuestionsText } = await generateText({
            model: google("gemini-2.0-flash-001"),
            prompt: `Generate EXACTLY ${structure.personalizedQuestions} personalized interview questions based on the candidate's profile, resume, and the specific requirements below:

INTERVIEW STRUCTURE REQUIREMENTS:
- Role: ${structure.role}
- Experience Level: ${structure.level}
- Tech Stack: ${structure.techstack.join(', ')}
- Interview Type: ${structure.type}
- Required Question Count: ${structure.personalizedQuestions}

PERSONALIZATION REQUIREMENTS:
${personalizedPrompt}

${structure.interviewCategory === 'job' ? `
JOB POSTING DETAILS:
- Job Title: ${structure.jobTitle}
- Designation: ${structure.designation}
- Location: ${structure.location}
- CTC: ${structure.ctc}
- Key Responsibilities: ${structure.responsibilities}

Tailor questions to assess if the candidate fits this specific job posting.
` : ''}

CANDIDATE PROFILE:
${profileData}

${resume ? `
CANDIDATE'S RESUME/ADDITIONAL INFO:
${resume}

Use specific details from their resume to create targeted questions.
` : ''}

CRITICAL INSTRUCTIONS:
1. Generate EXACTLY ${structure.personalizedQuestions} questions - no more, no less
2. Each question must be personalized based on the candidate's actual background
3. Use the personalization requirements above as your primary guide
4. Reference specific details from their profile/resume when possible
5. Make questions relevant to the ${structure.role} role and ${structure.level} experience level
6. Follow the ${structure.type} interview type approach
7. Return ONLY a valid JSON object in this exact format: {"questions": ["Question 1", "Question 2", ...]}
8. Do not include any text, markdown, explanations, or code blocks before or after the JSON
9. Do not wrap the JSON in backticks, markdown code blocks, or any other formatting
10. Your response should start with { and end with } - nothing else
11. Avoid special characters that might break voice assistants (no /, *, etc.)
12. Make questions conversational and natural for voice interaction
13. Ensure questions assess both technical skills and cultural fit for the role

EXAMPLES OF GOOD PERSONALIZED QUESTIONS:
- "I see you have ${userProfile?.experience || 'X years'} of experience with ${structure.techstack[0] || 'technology'}. Can you walk me through a challenging project where you used this?"
- "Your background in ${userProfile?.currentRole || 'your current role'} is interesting. How would you apply those skills to ${structure.role}?"
- "I noticed you've worked with ${structure.techstack.join(' and ')}. Which of these technologies do you feel most confident with and why?"

Remember: Generate EXACTLY ${structure.personalizedQuestions} questions based on the personalization requirements and candidate profile.`,
        });

        // Parse and validate the generated personalized questions
        let questions = [];
        const expectedCount = structure.personalizedQuestions;
        
        try {
            // Clean the response text - remove markdown code blocks if present
            let cleanedText = personalizedQuestionsText.trim();
            
            // Handle various markdown formats the AI might use
            if (cleanedText.startsWith('```json')) {
                cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
            } else if (cleanedText.startsWith('```')) {
                cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
            }
            
            // Remove any remaining markdown or extra formatting
            cleanedText = cleanedText.replace(/^\s*json\s*/, '').trim();
            
            // Find the JSON object if it's embedded in other text
            const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                cleanedText = jsonMatch[0];
            }
            
            const parsed = JSON.parse(cleanedText);
            questions = parsed.questions || [];
            console.log(`[${requestId}] Successfully parsed ${questions.length} questions from AI response`);
        } catch (parseError) {
            console.error(`[${requestId}] Error parsing JSON response:`, parseError);
            console.log(`[${requestId}] Raw AI response:`, personalizedQuestionsText);
            
            // Fallback: try to extract questions from text
            const lines = personalizedQuestionsText
                .split('\n')
                .map(line => line.trim())
                .filter(line => {
                    // Look for lines that seem like questions
                    return line.length > 20 && (
                        line.includes('?') || 
                        line.match(/^\d+\./) || 
                        line.toLowerCase().includes('tell me') ||
                        line.toLowerCase().includes('describe') ||
                        line.toLowerCase().includes('explain') ||
                        line.toLowerCase().includes('how would you') ||
                        line.toLowerCase().includes('can you')
                    );
                })
                .map(line => {
                    // Clean up the line
                    return line.replace(/^\d+\.\s*/, '').replace(/^-\s*/, '').replace(/^"\s*/, '').replace(/\s*"$/, '').trim();
                })
                .filter(line => line.length > 20 && !line.includes('{') && !line.includes('}'));
                
            questions = lines.slice(0, expectedCount);
            console.log(`[${requestId}] Fallback extraction found ${questions.length} questions`);
        }

        // Ensure we have exactly the expected number of questions
        if (questions.length !== expectedCount) {
            console.warn(`[${requestId}] Generated ${questions.length} questions but expected exactly ${expectedCount}`);
            
            if (questions.length < expectedCount) {
                // Generate additional generic questions if we're short
                const shortfall = expectedCount - questions.length;
                console.log(`[${requestId}] Generating ${shortfall} additional questions to meet requirement`);
                
                const additionalQuestions = [];
                for (let i = 0; i < shortfall; i++) {
                    const genericQuestions = [
                        `Tell me about your experience with ${structure.techstack[i % structure.techstack.length] || 'the technologies'} relevant to this ${structure.role} role.`,
                        `How would you approach a challenging project as a ${structure.role} at the ${structure.level} level?`,
                        `Describe a situation where you had to learn a new technology quickly. How did you handle it?`,
                        `What interests you most about working as a ${structure.role}?`,
                        `How do you stay updated with the latest developments in ${structure.techstack[0] || 'technology'}?`
                    ];
                    additionalQuestions.push(genericQuestions[i % genericQuestions.length]);
                }
                questions.push(...additionalQuestions.slice(0, shortfall));
            } else if (questions.length > expectedCount) {
                // Trim excess questions
                questions = questions.slice(0, expectedCount);
                console.log(`[${requestId}] Trimmed to exactly ${expectedCount} questions`);
            }
        }

        // Final validation
        if (questions.length !== expectedCount) {
            throw new Error(`Failed to generate exactly ${expectedCount} personalized questions. Got ${questions.length} questions.`);
        }

        console.log(`[${requestId}] Successfully generated exactly ${questions.length} personalized questions using prompt: "${personalizedPrompt.substring(0, 100)}..."`);
        
        // Log the generated questions for debugging
        console.log(`[${requestId}] Generated questions:`, questions.map((q: string, i: number) => `${i + 1}. ${q.substring(0, 100)}...`));

        // Get pre-generated (compulsory) questions from the structure
        const preGeneratedQuestions = structure.questions || [];
        
        // Create the actual interview instance with minimal essential data only
        const interviewId = `${userId}_${structureId}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        // Clean user profile data to avoid undefined values in Firestore
        const cleanUserProfile = userProfile ? {
            id: userId,
            currentRole: userProfile.currentRole || '',
            experience: userProfile.experience || '',
            skills: userProfile.skills || [],
            education: userProfile.education || '',
            location: userProfile.location || '',
            phone: userProfile.phone || '',
            resume: userProfile.resume || ''
        } : {
            id: userId,
            currentRole: '',
            experience: '',
            skills: [],
            education: '',
            location: '',
            phone: '',
            resume: ''
        };

        const essentialInterview = {
            // Essential identifiers
            id: interviewId,
            structureId,
            userId,
            
            // Only the questions data
            preGeneratedQuestions,      // Compulsory questions from structure
            personalizedQuestions: questions,  // Generated personalized questions
            
            // User data who is taking the interview
            userProfile: cleanUserProfile,
            
            // Fields needed for UI components (from structure)
            role: structure.role || 'Interview',
            level: structure.level || 'Entry',
            type: structure.type || 'Technical',
            techstack: structure.techstack || [],
            
            // Minimal metadata for functionality
            createdAt: new Date().toISOString(),
            status: 'ready',
            interviewCategory: actualInterviewCategory,
            finalized: true,
            
            // Request tracking
            requestId
        };

        // Clean the entire interview object to ensure no undefined values
        const cleanedInterview = cleanObjectForFirestore(essentialInterview) as Record<string, unknown>;

        // Save to actual interview collection with duplicate prevention
        const actualInterviewCollection = actualInterviewCategory === 'job' 
            ? 'job_interviews' 
            : 'mock_interviews';
        
        console.log(`[${requestId}] Saving minimal interview data to ${actualInterviewCollection} collection`);
        
        try {
            const interviewDoc = await db.collection(actualInterviewCollection).add(cleanedInterview);
            
            console.log(`[${requestId}] Interview saved successfully with ID: ${interviewDoc.id}`);
            
            // Update structure usage count
            const structureCollection = actualInterviewCategory === 'job' 
                ? 'job_interview_structures' 
                : 'mock_interview_structures';
            
            await db.collection(structureCollection).doc(structureId).update({
                usageCount: (structure.usageCount || 0) + 1,
                lastUsed: new Date().toISOString()
            });

            return Response.json({
                success: true,
                interviewId: interviewDoc.id,
                preGeneratedQuestions,
                personalizedQuestions: questions,
                message: 'Interview generated successfully with minimal data storage!',
                requestId
            }, { status: 200 });
            
        } catch (saveError) {
            console.error(`[${requestId}] Error saving interview:`, saveError);
            
            // If save fails, it might be a duplicate race condition - check again
            try {
                const existingQuery = await db.collection(actualInterviewCollection)
                    .where('structureId', '==', structureId)
                    .where('userId', '==', userId)
                    .limit(1)
                    .get();

                if (!existingQuery.empty) {
                    const existingDoc = existingQuery.docs[0];
                    console.log(`[${requestId}] Found existing interview after save failure, returning existing:`, existingDoc.id);
                    return Response.json({
                        success: true,
                        interviewId: existingDoc.id,
                        message: 'Interview already exists for this structure',
                        duplicate: true,
                        requestId
                    }, { status: 200 });
                }
            } catch (recheckError) {
                console.error(`[${requestId}] Error during recheck:`, recheckError);
            }
            
            throw saveError; // Re-throw the original save error
        }

    } catch (error) {
        console.error(`[${requestId}] Error generating personalized interview:`, error);
        return Response.json({
            success: false,
            error: 'Failed to generate personalized interview',
            requestId
        }, { status: 500 });
    }
}
