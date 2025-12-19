import { generateTaskSuggestions } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { projectDescription, existingTasks } = await req.json();
    
    if (!projectDescription) {
      return NextResponse.json(
        { error: 'Project description is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateTaskSuggestions(
      projectDescription,
      existingTasks || []
    );

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Error in generate-tasks API:', error);
    return NextResponse.json(
      { error: 'Failed to generate task suggestions' },
      { status: 500 }
    );
  }
} 