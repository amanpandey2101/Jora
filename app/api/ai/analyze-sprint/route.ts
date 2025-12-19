import { analyzeSprint } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { sprintData } = await req.json();
    
    if (!sprintData) {
      return NextResponse.json(
        { error: 'Sprint data is required' },
        { status: 400 }
      );
    }

    const analysis = await analyzeSprint(sprintData);

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error in analyze-sprint API:', error);
    return NextResponse.json(
      { error: 'Failed to analyze sprint' },
      { status: 500 }
    );
  }
} 