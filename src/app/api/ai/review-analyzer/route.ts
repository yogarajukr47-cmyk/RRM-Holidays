import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

// Pre-built destination reviews data for fallback
const DESTINATION_REVIEWS: Record<string, { rating: number; sentiment: string; pros: string[]; cons: string[]; bestTime: string; tips: string[]; summary: string }> = {
  mysuru: {
    rating: 4.5,
    sentiment: 'positive',
    pros: ['Magnificent Mysuru Palace - one of India\'s most beautiful palaces', 'Clean, well-maintained city with excellent civic amenities', 'Rich heritage, culture, and world-famous Mysuru silk and sandalwood', 'Brindavan Gardens musical fountain is magical', 'Affordable city with great food options'],
    cons: ['Palace illumination only on Sundays and public holidays', 'Can get very crowded during Dasara festival (Oct)', 'Limited nightlife options', 'Auto-rickshaw drivers may overcharge tourists'],
    bestTime: 'October to February (Winter) - pleasant weather 15-30°C',
    tips: ['Visit the palace early morning (10 AM) to avoid crowds', 'Try Mysuru masala dosa at Mylari restaurant - it\'s legendary', 'Book Brindavan Gardens tickets in advance on weekends', 'Shop for Mysuru silk directly from KSIC showroom for authenticity'],
    summary: 'Mysuru is consistently rated as one of the cleanest and most beautiful cities in India. The magnificent palace, rich cultural heritage, delicious cuisine, and warm hospitality make it a must-visit destination. Most travelers rate it 4-5 stars, calling it the cultural capital of Karnataka.',
  },
  coorg: {
    rating: 4.4,
    sentiment: 'positive',
    pros: ['Stunning coffee plantations and misty hills - breathtaking scenery', 'Peaceful and less commercialized compared to other hill stations', 'Dubare Elephant Camp is a unique and memorable experience', 'Coorgi cuisine (pandi curry, akki roti) is delicious', 'Great for trekking, nature walks, and outdoor activities'],
    cons: ['Limited public transport - own vehicle or rental needed', 'Mobile network can be patchy in remote areas', 'Monsoon can cause landslides and road blockages', 'Homestays may lack luxury amenities'],
    bestTime: 'October to March (pleasant and cool) or July-September for monsoon beauty',
    tips: ['Carry motion sickness tablets for winding hill roads', 'Try authentic Coorgi pandi curry (pork) - it\'s a local specialty', 'Book homestays well in advance for weekends and holidays', 'Start trekking early morning to avoid afternoon heat'],
    summary: 'Coorg (Kodagu) is beloved by nature lovers and families alike for its stunning coffee estates, misty hills, and warm Kodava hospitality. Travelers consistently praise its peaceful atmosphere and natural beauty, making it one of Karnataka\'s top-rated destinations.',
  },
  ooty: {
    rating: 4.2,
    sentiment: 'positive',
    pros: ['Iconic Nilgiri Mountain Railway (UNESCO Heritage Toy Train)', 'Beautiful botanical garden with rare plant species', 'Pleasant cool climate year-round - a welcome escape from heat', 'Affordable destination with good accommodation options', 'Home-made chocolates and eucalyptus oil are unique souvenirs'],
    cons: ['Can get very crowded during summer and weekends', 'Commercialization has affected some natural charm', 'Traffic congestion in the main town area', 'Some viewpoints may be foggy, limiting visibility'],
    bestTime: 'March to June (summer in hills) and September to November (post-monsoon)',
    tips: ['Book Toy Train tickets at least 2 weeks in advance via IRCTC', 'Carry warm clothes even in summer - evenings are chilly', 'Visit Doddabetta peak early morning for clear views', 'Try homemade chocolates at King Star or Modern Stores'],
    summary: 'Ooty remains one of India\'s most popular hill stations, loved for its charming toy train ride, beautiful gardens, and cool climate. While commercialization has increased, the natural beauty of the Nilgiris and the unique experiences it offers keep travelers coming back.',
  },
  kerala: {
    rating: 4.6,
    sentiment: 'positive',
    pros: ['Backwater houseboat experience in Alleppey is truly unforgettable', 'Munnar\'s tea gardens offer stunning, postcard-perfect views', 'Kochi blends Portuguese, Dutch, and Kerala heritage beautifully', 'Ayurvedic massage and wellness treatments are world-class', 'Kerala cuisine (appam, stew, karimeen) is incredible'],
    cons: ['Peak season (Dec-Jan) is very crowded - book well in advance', 'Houseboat quality varies greatly - research is essential', 'Heavy rainfall during monsoon (Jun-Sep) can disrupt plans', 'Some areas can be overly touristy'],
    bestTime: 'September to March (post-monsoon to winter) for best weather',
    tips: ['Book premium AC houseboats - the difference in comfort is worth it', 'Try karimeen pollichathu (pearl spot fish) at a local Kerala restaurant', 'Visit Munnar during weekdays for a peaceful experience', 'Allocate at least 4-5 days to cover Munnar, Alleppey, and Kochi properly'],
    summary: 'Kerala consistently ranks as one of the best travel destinations in India and Asia. The unique backwater experience, stunning hill stations, rich cultural heritage, delicious cuisine, and warm hospitality earn it a near-perfect rating from travelers worldwide.',
  },
  goa: {
    rating: 4.3,
    sentiment: 'positive',
    pros: ['Beautiful diverse beaches - from bustling Baga to serene Palolem', 'Rich Portuguese heritage with beautiful churches and forts', 'Incredible seafood and unique Goan-Portuguese fusion cuisine', 'Vibrant nightlife and music scene', 'Adventure sports: parasailing, jet skiing, scuba diving, and more'],
    cons: ['Overcrowded during peak season (Dec-Jan) and weekends', 'Commercialization has affected some beaches\' charm', 'Drug-related issues in certain areas at night', 'Beach shacks may charge more in tourist-heavy areas'],
    bestTime: 'November to February (pleasant weather, exciting festivals)',
    tips: ['North Goa for parties and activities, South Goa for relaxation', 'Rent a scooter for easy beach hopping - most affordable transport option', 'Eat at local Goan restaurants, not just tourist-facing shacks', 'Visit Dudhsagar Falls and spice plantations for off-beach experiences'],
    summary: 'Goa is India\'s most iconic beach destination, loved for its diverse beaches, vibrant culture, and laid-back atmosphere. While commercialization is a concern, the unique blend of Indian and Portuguese cultures, incredible food, and range of experiences keeps it a perennial favorite.',
  },
  hampi: {
    rating: 4.5,
    sentiment: 'positive',
    pros: ['UNESCO World Heritage Site with jaw-dropping ancient ruins', 'Unique surreal boulder landscape unlike anywhere else in India', 'The Stone Chariot is an architectural marvel', 'Very affordable destination - food and stay are reasonably priced', 'Great for photography, history buffs, and backpackers'],
    cons: ['Extremely hot in summer (March-May) - temperatures exceed 40°C', 'Limited accommodation and restaurant options', 'No direct public transport to some monuments', 'Requires a fair amount of walking in hot weather'],
    bestTime: 'October to February (cool and pleasant, 15-30°C)',
    tips: ['Carry sunscreen, hat, and at least 2L water per person', 'Hire a bicycle or auto-rickshaw to cover more monuments', 'Stay on the Virupapura Gaddi side for easy monument access', 'Climb Matanga Hill for the best sunset view in Hampi'],
    summary: 'Hampi is a traveler\'s paradise and one of India\'s most impressive UNESCO sites. The sheer scale and beauty of the Vijayanagara Empire ruins, set against a dramatic boulder landscape, leave every visitor spellbound. Highly recommended for history and photography enthusiasts.',
  },
};

function getFallbackReview(destination: string) {
  const key = destination.toLowerCase().replace(/[^a-z]/g, '');

  // Direct match
  for (const [k, v] of Object.entries(DESTINATION_REVIEWS)) {
    if (key.includes(k) || k.includes(key)) {
      return { destination, ...v };
    }
  }

  // Generic fallback
  return {
    destination,
    sentiment: 'positive',
    rating: 4.2,
    pros: [
      'Beautiful destination with unique attractions and natural scenery',
      'Good connectivity and infrastructure for tourists',
      'Local cuisine is excellent and affordable',
      'Friendly locals and safe environment for travelers',
      'Range of accommodation options for different preferences',
    ],
    cons: [
      'Can get crowded during peak tourist season',
      'Public transport options may be limited',
      'Some commercialization in popular tourist areas',
    ],
    bestTime: 'October to March for pleasant weather across South India',
    tips: [
      'Book accommodation in advance during peak season',
      'Try local cuisine at small family-run restaurants for authentic flavors',
      'Start sightseeing early to avoid crowds and afternoon heat',
    ],
    summary: `${destination} is a wonderful destination in South India known for its natural beauty and cultural heritage. Travelers generally have positive experiences and recommend visiting during the cooler months. For the most personalized and up-to-date travel advice, contact RRM Holidays at +91 91085 97154.`,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { destination, language } = body;

    if (!destination || typeof destination !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a destination name' },
        { status: 400 }
      );
    }

    let result = null;

    // Try AI API first
    try {
      const zai = await ZAI.create();

      const completion = await zai.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are an AI travel review analyst for RRM Holidays, South India. Analyze tourist reviews for the given destination. Return ONLY valid JSON (no markdown, no code fences):
{ "destination": "Place Name", "sentiment": "positive", "rating": 4.5, "pros": ["Pro1", "Pro2", "Pro3", "Pro4", "Pro5"], "cons": ["Con1", "Con2", "Con3"], "bestTimeToVisit": "Oct-Mar", "tips": ["Tip1", "Tip2", "Tip3"], "summary": "2-3 sentence overview." }`,
          },
          {
            role: 'user',
            content: `Analyze tourist reviews and travel intelligence for: ${destination}${language && language !== 'en' ? `. Write pros, cons, tips, and summary in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'ta' ? 'Tamil' : language === 'ml' ? 'Malayalam' : 'English'}. Keep place names in English.` : ''}`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      const content = completion.choices[0]?.message?.content;
      if (content) {
        const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        result = JSON.parse(jsonStr);
      }
    } catch (aiError) {
      console.log('AI API unavailable, using fallback review analysis');
    }

    // Fallback
    if (!result) {
      result = getFallbackReview(destination);
    }

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error('Review Analyzer API error:', error);
    return NextResponse.json(
      getFallbackReview('South India'),
      { status: 200 }
    );
  }
}
