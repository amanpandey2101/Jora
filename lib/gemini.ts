import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

export async function generateTaskSuggestions(projectDescription: string, existingTasks: string[]) {
  const prompt = `
    Based on this project description: "${projectDescription}"
    And these existing tasks: ${existingTasks.join(', ')}
    
    Generate 5 new relevant task suggestions that would be helpful for this project. 
    Each task should be actionable and specific.
    
    Return the response as a JSON array of objects with this structure:
    [
      {
        "title": "Task title",
        "description": "Detailed task description",
        "priority": "HIGH" | "MEDIUM" | "LOW",
        "estimatedHours": number
      }
    ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response =  result.response;
    const text = response.text();
    
    // Clean the response to extract JSON
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating task suggestions:', error);
    return [];
  }
}

export async function generateTaskDescription(taskTitle: string, projectContext: string) {
  const prompt = `
    Given this task title: "${taskTitle}"
    In the context of this project: "${projectContext}"
    
    Generate a detailed, professional task description that includes:
    - Clear objective
    - Acceptance criteria (3-5 bullet points)
    - Potential considerations or dependencies
    
    Keep it concise but comprehensive, suitable for a development team.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response =  result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating task description:', error);
    return '';
  }
}

export async function analyzeSprint(sprintData: any) {
  const prompt = `
    Analyze this sprint data and provide insights:
    Sprint Name: ${sprintData.name}
    Total Issues: ${sprintData.issues?.length || 0}
    Status Distribution: ${JSON.stringify(sprintData.statusDistribution || {})}
    
    Provide a brief analysis covering:
    - Sprint health assessment
    - Potential bottlenecks
    - Recommendations for improvement
    
    Keep it concise and actionable.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response =  result.response;
    return response.text();
  } catch (error) {
    console.error('Error analyzing sprint:', error);
    return 'Unable to analyze sprint at this time.';
  }
}

export async function generateSmartComments(issueTitle: string, issueDescription: string, currentStatus: string) {
  const prompt = `
    For this issue:
    Title: "${issueTitle}"
    Description: "${issueDescription}"
    Current Status: "${currentStatus}"
    
    Generate 3 helpful, professional comments that could be useful for this issue:
    - One technical suggestion
    - One process/workflow suggestion  
    - One testing/quality assurance suggestion
    
    Return as a JSON array of strings.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    return [];
  } catch (error) {
    console.error('Error generating smart comments:', error);
    return [];
  }
} 