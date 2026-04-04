import { NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Pre-built route data for fallback
const ROUTE_DATA: Record<string, { distance: string; time: string; tips: string[]; places: string[]; bestTime: string; quoteNote: string }> = {
  'mysuru-bengaluru': {
    distance: '150 km',
    time: '3.5 hours',
    tips: ['Start early (6 AM) to beat Bengaluru traffic at NICE Road', 'Stop at Mandya for refreshing sugarcane juice', 'Use NICE Road toll road for faster journey'],
    places: ['Mandya Sugar Cane Juice Stalls', 'Ranganthittu Bird Sanctuary (detour)', 'Channapatna Toy Town'],
    bestTime: 'Oct - Feb (pleasant weather, avoid monsoon flooding on highways)',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'mysuru-coorg': {
    distance: '120 km',
    time: '3 hours',
    tips: ['Hilly roads with hairpin bends - carry motion sickness tablets', 'Fuel up in Mysuru as petrol stations are scarce in Coorg hills', 'Rain can make roads slippery - check weather before departure'],
    places: ['Kushalnagar (Tibetan Golden Temple)', 'Bylakuppe Monastery', 'Dubare Elephant Camp'],
    bestTime: 'Oct - Mar (pleasant, avoid heavy monsoon Jul-Sep)',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'mysuru-ooty': {
    distance: '160 km',
    time: '4.5 hours',
    tips: ['The ghat road has 36 hairpin bends - take it slow', 'Bandipur National Park gate closes at 9 PM, plan accordingly', 'No honking allowed in the forest section'],
    places: ['Bandipur National Park', 'Mudumalai Wildlife Sanctuary', 'Gudalur Tea Estates'],
    bestTime: 'Oct - May (Bandipur closed during peak monsoon, check forest dept timing)',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'mysuru-wayanad': {
    distance: '130 km',
    time: '3.5 hours',
    tips: ['Carry warm clothes for evening in Wayanad hills', 'Roads through Nagarhole forest are beautiful but narrow', 'Book treehouse stays well in advance for weekends'],
    places: ['Nagarhole National Park route', 'Iruppu Falls (seasonal)', 'Kabini River viewpoint'],
    bestTime: 'Oct - Mar (ideal weather), Jul-Sep for lush green landscapes',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'mysuru-goa': {
    distance: '450 km',
    time: '9 hours',
    tips: ['Start by 6 AM to reach Goa by evening', 'NH766 route via Chorla Ghat is most scenic', 'Carry change for tolls along the way'],
    places: ['Dudhsagar Falls viewpoint', 'Chorla Ghat (scenic route)', 'Mollem National Park'],
    bestTime: 'Nov - Feb (peak season), Mar-May for fewer crowds',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'mysuru-kerala': {
    distance: '500 km',
    time: '10 hours',
    tips: ['Break journey at Calicut/Kozhikode for lunch', 'NH66 coastal route is scenic but has many tolls', 'Book houseboat in Alleppey at least 2 weeks ahead'],
    places: ['Kozhikode Beach (lunch stop)', 'Varkala Cliffs (detour)', 'Athirapally Falls (detour)'],
    bestTime: 'Sep - Mar (post-monsoon greenery to pleasant winter)',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'mysuru-hampi': {
    distance: '350 km',
    time: '7 hours',
    tips: ['Carry plenty of water - Hampi is rocky and hot', 'Sunscreen and hat are essential', 'Stay near Virupapura Gaddi for monument access'],
    places: ['Chitradurga Fort (detour)', 'Hospet (nearest railhead)', 'Tungabhadra Dam'],
    bestTime: 'Oct - Feb (pleasant, avoid summer 40°C+ temperatures)',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
  'bengaluru-coorg': {
    distance: '260 km',
    time: '5.5 hours',
    tips: ['Leave early to avoid Bengaluru traffic', 'Stop at Kushalnagar for breakfast', 'Best route via Mysuru highway then turn towards Madikeri'],
    places: ['Ramanagara (Sholay shooting spot)', 'Maddur Tiffany\'s for vada', 'Kushalnagar Tibetan Settlement'],
    bestTime: 'Oct - Mar (cool and pleasant in the hills)',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  },
};

function findBestRoute(from: string, to: string) {
  const fromKey = from.toLowerCase().replace(/[^a-z]/g, '');
  const toKey = to.toLowerCase().replace(/[^a-z]/g, '');

  // Direct lookup
  const directKey = `${fromKey}-${toKey}`;
  const reverseKey = `${toKey}-${fromKey}`;

  if (ROUTE_DATA[directKey]) return ROUTE_DATA[directKey];
  if (ROUTE_DATA[reverseKey]) return ROUTE_DATA[reverseKey];

  // Partial match
  for (const [key, data] of Object.entries(ROUTE_DATA)) {
    if (key.includes(fromKey) || key.includes(toKey) ||
        fromKey.includes(key.split('-')[0]) || fromKey.includes(key.split('-')[1])) {
      return data;
    }
  }

  // Generic fallback
  return {
    distance: `${80 + Math.floor(Math.random() * 200)} km`,
    time: `${2 + Math.floor(Math.random() * 5)} hours`,
    tips: [
      'Start early in the morning for the best driving experience',
      'Check road conditions on Google Maps before departure',
      'Carry snacks and water for the journey'
    ],
    places: ['Scenic viewpoints en route', 'Local dhabas for authentic food', 'Highway refreshment stops'],
    bestTime: 'Oct - Mar for pleasant weather across South India',
    quoteNote: 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation'
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { from, to, travellers, vehicleType, language } = body;

    if (!from || !to) {
      return NextResponse.json(
        { error: 'From and To locations are required' },
        { status: 400 }
      );
    }

    let result = null;

    // Try AI API first
    try {
      const zai = await ZAI.create();

      const systemPrompt = `You are RRM Holidays' expert travel advisor based in Mysuru, South India. You have 9+ years of experience with South India travel routes and vehicle recommendations.

RRM Holidays fleet:
- Sedan (Toyota Etios / Swift Dzire): 4 seats
- MUV (Toyota Innova): 7 seats
- Premium MUV (Innova Crysta): 7 seats
- Tempo Traveller: 12 seats
- Mini Bus (21 Seater): 21 seats
- Bus (25 Seater): 25 seats
- Bus (33 Seater): 33 seats
- Luxury Coach (50 Seater): 50 seats

Do NOT provide any pricing or cost estimates. All quotations are custom and provided via WhatsApp.

Return ONLY valid JSON (no markdown, no code fences):
{
  "from": "origin",
  "to": "destination",
  "distance": "120 km",
  "estimatedTime": "3 hrs",
  "vehicleSuggestion": "recommended vehicle and reason",
  "quoteNote": "Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation",
  "tips": ["tip1", "tip2", "tip3"],
  "bestTimeToVisit": "best months with reason",
  "placesEnRoute": ["place1", "place2", "place3"]
}`;

      const langHint = language && language !== 'en' ? ` IMPORTANT: Respond in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'ta' ? 'Tamil' : language === 'ml' ? 'Malayalam' : 'English'}. Keep place names in English.` : '';
      const userMessage = `Travel from ${from} to ${to}. Travellers: ${travellers || 'not specified'}. Vehicle: ${vehicleType || 'need suggestion'}.${langHint}`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        let cleaned = content.trim();
        if (cleaned.startsWith('```')) {
          cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
        }
        result = JSON.parse(cleaned);
      }
    } catch (aiError) {
      console.log('AI API unavailable, using fallback data');
    }

    // Fallback
    if (!result) {
      const routeData = findBestRoute(from, to);
      const vehicleSuggestion = travellers && parseInt(travellers) > 7
        ? 'Tempo Traveller or Mini Bus - ideal for large groups'
        : travellers && parseInt(travellers) > 4
          ? 'Toyota Innova - spacious 7-seater, best value for small groups'
          : 'Toyota Etios/Swift Dzire - economical and comfortable for 2-3 people';

      result = {
        from,
        to,
        distance: routeData.distance,
        estimatedTime: routeData.time,
        vehicleSuggestion,
        quoteNote: routeData.quoteNote || 'Contact RRM Holidays on WhatsApp +91 91085 97154 for a custom quotation',
        tips: routeData.tips,
        bestTimeToVisit: routeData.bestTime,
        placesEnRoute: routeData.places,
      };
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Smart Deals API error:', error);
    return NextResponse.json(
      { from: 'Error', to: 'Error', distance: 'N/A', estimatedTime: 'N/A', vehicleSuggestion: 'Please contact us directly', quoteNote: 'Please WhatsApp RRM Holidays at +91 91085 97154 for a custom quotation', tips: ['Reach out to us on WhatsApp for a personalized travel quote'], bestTimeToVisit: 'Contact us for details', placesEnRoute: [] },
      { status: 200 }
    );
  }
}
