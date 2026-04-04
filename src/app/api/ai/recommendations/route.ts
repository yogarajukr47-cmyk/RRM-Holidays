import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Pre-built destination database for fallback recommendations
const DESTINATION_DB = [
  {
    name: 'Mysuru (Mysore)',
    state: 'Karnataka',
    tags: ['culture', 'temples', 'heritage', 'family', 'food'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Feb',
    duration: '2-3 days',
    description: 'The City of Palaces with magnificent Mysuru Palace, Brindavan Gardens, Chamundi Hills, and rich heritage. Perfect for culture lovers, families, and food enthusiasts. Famous for Mysuru silk, sandalwood, and filter coffee.',
  },
  {
    name: 'Coorg (Kodagu)',
    state: 'Karnataka',
    tags: ['nature', 'hills', 'adventure', 'food', 'couple'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Mar',
    duration: '2-3 days',
    description: 'Scotland of India with misty coffee plantations, Abbey Falls, Raja\'s Seat, and Dubare Elephant Camp. Ideal for nature lovers and couples seeking a peaceful hill station getaway.',
  },
  {
    name: 'Kerala Backwaters',
    state: 'Kerala',
    tags: ['nature', 'beaches', 'romantic', 'relaxation', 'food'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Sep - Mar',
    duration: '3-4 days',
    description: 'God\'s Own Country offers serene backwater cruises in Alleppey, tea gardens of Munnar, and beautiful Kochi. Perfect for honeymoons, relaxation, and experiencing traditional Kerala culture.',
  },
  {
    name: 'Goa',
    state: 'Goa',
    tags: ['beaches', 'adventure', 'nightlife', 'food', 'friends'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Nov - Feb',
    duration: '3-4 days',
    description: 'India\'s beach paradise with stunning beaches, Portuguese heritage forts, water sports, vibrant nightlife, and incredible seafood. Great for friends, couples, and family beach holidays.',
  },
  {
    name: 'Ooty (Udhagamandalam)',
    state: 'Tamil Nadu',
    tags: ['nature', 'hills', 'family', 'romantic', 'relaxation'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Mar - Jun, Sep - Nov',
    duration: '2-3 days',
    description: 'Queen of the Nilgiris with the famous toy train ride, Botanical Garden, Doddabetta Peak, and beautiful tea estates. A perfect family-friendly hill station retreat.',
  },
  {
    name: 'Hampi',
    state: 'Karnataka',
    tags: ['heritage', 'adventure', 'culture', 'photography', 'solo'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Feb',
    duration: '2-3 days',
    description: 'UNESCO World Heritage Site with stunning ruins of the Vijayanagara Empire. surreal boulder landscape, ancient temples, and the iconic Stone Chariot. A paradise for history buffs and photographers.',
  },
  {
    name: 'Wayanad',
    state: 'Kerala',
    tags: ['nature', 'wildlife', 'adventure', 'family', 'hills'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Mar',
    duration: '2-3 days',
    description: 'Green paradise with Edakkal Caves (ancient petroglyphs), Banasura Sagar Dam, Wayanad Wildlife Sanctuary, and beautiful bamboo forests. Great for wildlife enthusiasts and adventure seekers.',
  },
  {
    name: 'Pondicherry',
    state: 'Tamil Nadu',
    tags: ['beaches', 'culture', 'romantic', 'food', 'friends'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Mar',
    duration: '2-3 days',
    description: 'French colonial charm meets Tamil culture. Beautiful beaches, Auroville township, French Quarter streets, and a vibrant caf\u00e9 culture. Perfect for couples and weekend getaways.',
  },
  {
    name: 'Kodaikanal',
    state: 'Tamil Nadu',
    tags: ['nature', 'hills', 'romantic', 'family', 'relaxation'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Apr - Jun, Sep - Nov',
    duration: '2-3 days',
    description: 'Princess of Hill Stations with star-shaped Kodai Lake, Coaker\'s Walk, Pillar Rocks, and Bryant Park. Ideal for couples and families seeking a cool mountain retreat.',
  },
  {
    name: 'Andaman & Nicobar',
    state: 'Andaman & Nicobar',
    tags: ['beaches', 'adventure', 'scuba', 'romantic', 'nature'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - May',
    duration: '4-5 days',
    description: 'Crystal-clear turquoise waters, pristine white beaches, and incredible coral reefs. Radhanagar Beach, Cellular Jail, and scuba diving at Havelock Island. A dream destination for beach and adventure lovers.',
  },
  {
    name: 'Chikmagalur',
    state: 'Karnataka',
    tags: ['nature', 'hills', 'coffee', 'adventure', 'relaxation'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Mar',
    duration: '2-3 days',
    description: 'Coffee capital of Karnataka with lush coffee estates, Mullayanagiri peak (highest in Karnataka), Hebbe Falls, and Baba Budangiri hills. Great for trekking and nature experiences.',
  },
  {
    name: 'Mahabalipuram',
    state: 'Tamil Nadu',
    tags: ['heritage', 'beaches', 'culture', 'photography', 'family'],
    quoteNote: 'Custom quotation available on WhatsApp',
    bestTime: 'Oct - Mar',
    duration: '1-2 days',
    description: 'UNESCO Heritage Site with ancient 7th-century Pallava rock-cut temples, Shore Temple, Pancha Rathas, and beautiful beach. A perfect day trip from Chennai for history and architecture lovers.',
  },
];

function getFallbackRecommendations(interests: string[], budget: string, groupType: string, month: string) {
  const interestMap: Record<string, string[]> = {
    'Beaches': ['beaches'],
    'Temples': ['temples', 'heritage', 'culture'],
    'Nature': ['nature', 'hills'],
    'Adventure': ['adventure'],
    'Food': ['food'],
    'Culture': ['culture', 'heritage'],
    'Wildlife': ['wildlife', 'nature'],
    'Hills': ['hills', 'nature'],
    'Water Sports': ['beaches', 'adventure'],
    'Photography': ['photography', 'heritage', 'nature'],
    'Romantic': ['romantic', 'beaches'],
    'Relaxation': ['relaxation', 'nature'],
    'Nightlife': ['nightlife', 'beaches', 'friends'],
    'History': ['heritage', 'culture'],
    'Scuba Diving': ['beaches', 'adventure'],
    'Trekking': ['adventure', 'hills', 'nature'],
  };

  const groupTags: Record<string, string[]> = {
    'Solo': ['solo', 'photography'],
    'Couple': ['romantic', 'couple'],
    'Family': ['family'],
    'Friends': ['friends', 'adventure'],
    'Corporate': ['culture', 'relaxation'],
  };

  // Score each destination
  const scored = DESTINATION_DB.map((dest) => {
    let score = 50; // base score
    const destTagsLower = dest.tags.map(t => t.toLowerCase());

    // Match interests
    for (const interest of interests) {
      const mappedTags = interestMap[interest] || [interest.toLowerCase()];
      for (const tag of mappedTags) {
        if (destTagsLower.includes(tag)) score += 20;
      }
    }

    // Match group type
    const groupTagsList = groupTags[groupType] || [];
    for (const tag of groupTagsList) {
      if (destTagsLower.includes(tag)) score += 15;
    }

    // Add some randomness for variety
    score += Math.floor(Math.random() * 10);

    return { ...dest, matchPercent: Math.min(score, 98) };
  });

  // Sort by score, take top 5
  scored.sort((a, b) => b.matchPercent - a.matchPercent);
  return scored.slice(0, 5).map((d) => ({
    name: d.name,
    state: d.state,
    reason: d.description,
    matchPercent: d.matchPercent,
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation',
    bestTime: d.bestTime,
    duration: d.duration,
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { interests, budget, travelStyle, groupType, month, language } = body;

    if (!interests || !Array.isArray(interests) || interests.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one interest' },
        { status: 400 }
      );
    }

    let recommendations = null;

    // Try AI API first
    try {
      const zai = await ZAI.create();

      const systemPrompt = `You are RRM Holidays' AI travel recommendation engine for South India (Karnataka, Kerala, Tamil Nadu, Goa, Andhra Pradesh, Telangana).

Suggest 5 destinations matching user preferences. Do NOT provide any pricing or budget estimates. All quotations are custom and provided via WhatsApp.

Return ONLY valid JSON (no markdown, no code fences):
{
  "recommendations": [
    {
      "name": "Destination Name",
      "state": "State Name",
      "reason": "2-3 sentence explanation why this matches",
      "matchPercent": 95,
      "quoteNote": "Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation",
      "bestTime": "Oct - Mar",
      "duration": "2-3 days"
    }
  ]
}

Rules: matchPercent 70-99, sort descending, cover different states.`;

      const langHint = language && language !== 'en' ? `\nIMPORTANT: Write the "reason" field in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'ta' ? 'Tamil' : language === 'ml' ? 'Malayalam' : 'English'}. Keep destination names in English.` : '';
      const userMessage = `My travel preferences:
- Interests: ${interests.join(', ')}
- Group type: ${groupType || 'Not specified'}
- Travel month: ${month || 'Flexible'}
- Travel style: ${travelStyle || 'Not specified'}

Recommend 5 destinations in South India.${langHint}`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        let cleaned = content.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }
        recommendations = JSON.parse(cleaned);
      }
    } catch (aiError) {
      console.log('AI API unavailable, using fallback recommendations');
    }

    // Fallback
    if (!recommendations) {
      recommendations = {
        recommendations: getFallbackRecommendations(interests, budget || '', groupType || '', month || ''),
      };
    }

    return NextResponse.json(recommendations);
  } catch (error: unknown) {
    console.error('Recommendations API error:', error);
    return NextResponse.json(
      { recommendations: getFallbackRecommendations(['Nature', 'Temples'], '', 'Family', '') },
      { status: 200 }
    );
  }
}
