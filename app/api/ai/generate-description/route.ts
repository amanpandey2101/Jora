import { generateTaskDescription } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { taskTitle, projectContext } = await req.json();
    
    if (!taskTitle || !projectContext) {
      return NextResponse.json(
        { error: 'Task title and project context are required' },
        { status: 400 }
      );
    }

    const description = await generateTaskDescription(taskTitle, projectContext);

    return NextResponse.json({ description });
  } catch (error) {
    console.error('Error in generate-description API:', error);
    return NextResponse.json(
      { error: 'Failed to generate task description' },
      { status: 500 }
    );
  }
} 