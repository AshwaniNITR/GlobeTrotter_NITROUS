// app/api/places/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { location } = await req.json();
    if (!location) {
      return NextResponse.json({ error: 'Location is required' }, { status: 400 });
    }

    // Prompt for LLM
    const prompt = `You are a travel planner AI. Given the location "${location}",
    produce a JSON array where each element contains:
    - name: the name of a place to visit in that location
    - budget: estimated budget in USD for visiting this place (including entry fees, food, transport)
    - activities: an array of activities that can be done at this place.
    Example format:
    [
      {"name": "Place 1", "budget": 50, "activities": ["Activity A", "Activity B"]}
    ]
    Return only valid JSON with no extra text.`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful travel assistant that returns data in strict JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 500,
    });

    const content = completion.choices[0].message?.content?.trim();

    let data;
    try {
      data = JSON.parse(content || '[]');
    } catch (err) {
      return NextResponse.json({ error: 'Invalid JSON from model', raw: content }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}