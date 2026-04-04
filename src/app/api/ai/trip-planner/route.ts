import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

const SYSTEM_PROMPT = `You are an expert South India trip planner for RRM Holidays, a travel company based in Mysuru, Karnataka. You cover Karnataka, Kerala, Tamil Nadu, Goa, Andhra Pradesh, and Telangana.

Vehicle fleet (customized to your needs):
- Sedan (Toyota Etios / Maruti Swift Dzire): 4 seater
- MUV (Toyota Innova): 7 seater
- Premium MUV (Innova Crysta): 7 seater
- Tempo Traveller (12 seater): perfect for medium groups
- Mini Bus (21 seater): for large groups
- Bus (25/33/50 seater): for school/corporate trips
- Luxury Coach (50 seater): for very large groups

All vehicles come with experienced driver-guides. No fixed pricing — quotations are customized.

Generate a detailed day-wise itinerary based on the user's preferences. For each day include: morning activity, afternoon activity, evening activity, and a useful tip. Also suggest best vehicle type for the group size and hotel area to stay.

IMPORTANT: Return ONLY valid JSON in this exact format, no markdown or extra text:
{
  "destination": "string",
  "summary": "string - 2-3 sentence trip overview",
  "vehicleSuggestion": "string - vehicle type and reason",
  "hotelSuggestion": "string - best area to stay and hotel type",
  "days": [
    {
      "day": 1,
      "title": "string - day title",
      "morning": "string - morning activity description",
      "afternoon": "string - afternoon activity description",
      "evening": "string - evening activity description",
      "tip": "string - useful travel tip for this day"
    }
  ]
}

Do NOT include any pricing, costs, or budget amounts. For quotation, direct users to WhatsApp +91 91085 97154.
Keep the itinerary realistic and practical. Use real place names. Tailor suggestions to the user's travel style (budget/comfort/luxury).`;

// Pre-built itineraries for fallback
const FALLBACK_ITINERARIES: Record<string, {
  destination: string;
  summary: string;
  vehicleSuggestion: string;
  hotelSuggestion: string;
  days: Array<{ day: number; title: string; morning: string; afternoon: string; evening: string; tip: string }>;
}> = {
  kerala: {
    destination: 'Kerala - God\'s Own Country',
    summary: 'Experience the magical beauty of Kerala with its serene backwaters, lush tea gardens, pristine beaches, and rich cultural heritage. This itinerary covers the best of Munnar, Alleppey, and Kochi in a perfect blend of nature and culture.',
    vehicleSuggestion: 'Toyota Innova - Best for family trips with comfortable seating for hilly terrain of Munnar',
    hotelSuggestion: 'Stay near Munnar town for tea estate views, Alleppey near the boat jetty for backwater access',
    days: [
      { day: 1, title: 'Arrival in Kochi & City Explore', morning: 'Arrive in Kochi, check into your hotel near Fort Kochi. Visit the iconic Chinese Fishing Nets and St. Francis Church, the oldest European church in India.', afternoon: 'Explore the Jewish Synagogue and spice markets in Mattancherry. Enjoy authentic Kerala lunch at a local restaurant with appam and stew.', evening: 'Watch the mesmerizing Kathakali dance performance at a cultural center. Walk along Marine Drive for a beautiful sunset view of the harbor.', tip: 'Book Kathakali tickets in advance. Fort Kochi has the best heritage boutique hotels.' },
      { day: 2, title: 'Munnar - Tea Garden Paradise', morning: 'Drive to Munnar (4 hrs). En route, enjoy stunning Cheeyappara and Valara waterfalls. Stop at Karadippara viewpoint for panoramic Western Ghats scenery.', afternoon: 'Visit Eravikulam National Park (home to endangered Nilgiri Tahr) and the Tea Museum to learn about Munnar\'s tea legacy spanning over a century.', evening: 'Relax at your resort overlooking endless tea plantations. Enjoy a cup of fresh garden tea and try local Kerala cuisine for dinner.', tip: 'Start early to avoid crowds at Eravikulam. The park is closed during calving season (Feb-Apr).' },
      { day: 3, title: 'Munnar Sightseeing', morning: 'Visit Mattupetty Dam for boating with mountain reflections, and Echo Point where your voice bounces off the hills. The misty morning views are breathtaking.', afternoon: 'Drive through rolling tea estates to Top Station for the highest viewpoint in Munnar. On clear days, you can see the neighbouring state of Tamil Nadu.', evening: 'Explore the local markets in Munnar town. Buy fresh tea, spices, and homemade chocolates - Munnar is famous for these!', tip: 'Wear warm clothes - Munnar can be chilly, especially in the mornings and evenings.' },
      { day: 4, title: 'Alleppey Backwaters', morning: 'Drive to Alleppey (4 hrs). Board a traditional houseboat (Kettuvallam) for an unforgettable backwater cruise through serene canals and lakes.', afternoon: 'Float past coconut palms, paddy fields, and village life on the houseboat. Enjoy freshly cooked Kerala meals (karimeen pollichathu, avail, payasam) served on board.', evening: 'The houseboat anchors at a scenic spot for the night. Fall asleep to the gentle sounds of water and crickets - a truly magical experience.', tip: 'Opt for an AC premium houseboat for comfort. The overnight stay on the backwater is the highlight of any Kerala trip.' },
    ]
  },
  coorg: {
    destination: 'Coorg (Kodagu) - Scotland of India',
    summary: 'Discover the misty hills, coffee plantations, and cascading waterfalls of Coorg. Known as the Scotland of India, this beautiful hill station offers a perfect blend of nature, adventure, and Coorgi culture with its unique cuisine and warm hospitality.',
    vehicleSuggestion: 'Toyota Innova or Sedan - Both work well; roads are well-maintained but hilly with winding curves',
    hotelSuggestion: 'Madikeri town center for convenience, or a coffee estate homestay for an authentic Coorg experience',
    days: [
      { day: 1, title: 'Arrival & Madikeri Explore', morning: 'Arrive in Madikeri, check into your homestay. Visit Raja\'s Seat - a beautiful garden with panoramic views of the Western Ghats, perfect for morning coffee.', afternoon: 'Explore Madikeri Fort and the ancient Omkareshwara Temple. Enjoy Coorgi pandi curry (pork) at a local restaurant for an authentic culinary experience.', evening: 'Visit Abbey Falls - a stunning 70-foot waterfall surrounded by coffee and spice plantations. The evening light makes it magical for photography.', tip: 'Try Coorgi cuisine - akki roti, kadambuttu, and pandi curry are must-haves!' },
      { day: 2, title: 'Coffee Plantations & Nature', morning: 'Visit a working coffee plantation for a guided tour. Learn about coffee processing from bean to cup, and enjoy a fresh brew amidst the estate.', afternoon: 'Head to Dubare Elephant Camp where you can bathe, feed, and interact with elephants in a natural river setting - a hit with families and kids.', evening: 'Visit Bylakuppe - one of the largest Tibetan settlements in India. Explore the magnificent Namdroling Monastery with its golden Buddhas.', tip: 'Book elephant interactions early at Dubare. The monastery visit is free and very peaceful.' },
      { day: 3, title: 'Tadiandamol Peak & Departure', morning: 'Trek to Tadiandamol, the highest peak in Coorg (1,748m). The 3-hour trek through shola forests offers incredible panoramic views of the Western Ghats.', afternoon: 'Visit Nisargadhama - a beautiful island formed by the Cauvery river with bamboo groves, deer park, and hanging bridge. Perfect for relaxation before departure.', evening: 'Shop for Coorgi honey, coffee, spices, and homemade wine before heading back. Stop at Cauvery Nisargadhama for one last photo.', tip: 'Start the Tadiandamol trek by 7 AM to avoid afternoon heat. Carry water and snacks.' },
    ]
  },
  ooty: {
    destination: 'Ooty - Queen of Hill Stations',
    summary: 'Escape to the cool, misty hills of Ooty (Udhagamandalam), the Queen of the Nilgiris. Famous for its toy train, botanical gardens, tea estates, and eucalyptus forests, Ooty offers a perfect retreat with colonial charm and stunning mountain scenery.',
    vehicleSuggestion: 'Sedan (Etios/Dzire) - Ideal for the winding ghat roads, compact and fuel-efficient for hill station driving',
    hotelSuggestion: 'Stay near Ooty Lake or Charing Cross for easy access to attractions and the botanical garden',
    days: [
      { day: 1, title: 'Ooty Town & Gardens', morning: 'Arrive in Ooty, check into your hotel. Visit the Government Botanical Garden - a 55-acre garden with rare ferns, orchids, and a fossilized tree trunk believed to be 20 million years old.', afternoon: 'Enjoy boating on Ooty Lake and visit the adjacent Rose Garden with over 3,000 varieties of roses. The Toy Train Station is nearby for booking rides.', evening: 'Stroll through the Ooty market area. Try homemade chocolates, eucalyptus oil, and Ooty varkey (a local snack). Visit St. Stephen\'s Church.', tip: 'The Nilgiri Mountain Railway (Toy Train) books out fast. Book tickets online at irctc.co.in.' },
      { day: 2, title: 'Coonoor & Nilgiri Views', morning: 'Take the famous Toy Train from Ooty to Coonoor (1.5 hrs) through 16 tunnels and stunning viaducts. Alternatively, drive down to Coonoor through the hairpin bends.', afternoon: 'Visit Sim\'s Park (a beautiful botanical garden), Dolphin\'s Nose viewpoint, and Lamb\'s Rock for breathtaking views of the Coonoor valley and Catherine Falls.', evening: 'Visit Tea Factory and Tea Museum in Coonoor. Learn about tea processing and sample fresh Nilgiri tea. Return to Ooty for dinner.', tip: 'Carry a jacket - Coonoor viewpoints can be windy and cold. Morning fog adds to the beauty.' },
      { day: 3, title: 'Pykara & Departure', morning: 'Visit Pykara Waterfalls and Pykara Lake (21 km from Ooty). The falls are among the most beautiful in the Nilgiris, surrounded by dense shola forests.', afternoon: 'Visit the 9th Mile Shooting Point (used in many Bollywood films), and Wenlock Downs - vast grasslands perfect for a peaceful walk with panoramic Nilgiri views.', evening: 'Visit Doddabetta Peak (highest in Nilgiris at 2,637m) for a stunning 360-degree view. The telescope house offers magnified views of the surrounding plains and hills.', tip: 'Doddabetta is often foggy in the afternoon. Visit in the morning for clearer views.' },
    ]
  },
  goa: {
    destination: 'Goa - Pearl of the Orient',
    summary: 'Experience the perfect blend of sun, sand, Portuguese heritage, and vibrant nightlife in Goa. From pristine beaches and historic forts to spice plantations and water sports, Goa offers something for every traveler - whether you seek relaxation or adventure.',
    vehicleSuggestion: 'Sedan or MUV - Sedan for couples, Innova for families; bikes/scooters available for local beach hopping',
    hotelSuggestion: 'North Goa (Candolim/Calangute) for beaches and nightlife, South Goa (Palolem/Agonda) for peaceful retreats',
    days: [
      { day: 1, title: 'North Goa Beaches & Forts', morning: 'Visit Fort Aguada, a 17th-century Portuguese fort with stunning Arabian Sea views. Explore the lighthouse and the adjacent Sinquerim Beach.', afternoon: 'Enjoy water sports at Calangute or Baga Beach - parasailing, jet skiing, banana boat rides. Relax at a beach shack with Goan fish curry rice.', evening: 'Explore the vibrant Saturday Night Market in Arpora (if visiting on Saturday) or the Wednesday flea market at Anjuna. Enjoy beachside nightlife at Tito\'s Lane.', tip: 'Book water sports as bundle deals for better value. Start early to avoid crowds.' },
      { day: 2, title: 'Old Goa Heritage & Spice Plantation', morning: 'Explore Old Goa\'s UNESCO churches - Basilica of Bom Jesus (housing St. Francis Xavier\'s remains), Se Cathedral (largest church in Asia), and Church of St. Francis of Assisi.', afternoon: 'Visit a spice plantation in Ponda for a guided tour showcasing black pepper, cardamom, vanilla, and cashew. Enjoy a traditional Goan lunch served on banana leaves.', evening: 'Visit Dona Paula viewpoint for a romantic sunset over the Arabian Sea. Try Goan specialties like bebinca, sorpotel, and feni at a local restaurant.', tip: 'Dress modestly for church visits. The spice plantation lunch is included in the tour ticket.' },
      { day: 3, title: 'South Goa Beaches & Relaxation', morning: 'Drive to South Goa. Visit Palolem Beach - one of the most beautiful crescent-shaped beaches in India. Enjoy a peaceful morning swim or kayaking.', afternoon: 'Take a boat trip to see dolphins at Palolem or visit Butterfly Beach (accessible only by boat). Explore Colva Beach and the peaceful Benaulim stretch.', evening: 'Watch a magical sunset at Cabo de Rama Fort with panoramic ocean views. Enjoy fresh seafood at a beachside restaurant in South Goa before departure.', tip: 'South Goa beaches are less crowded on weekdays. Book dolphin trips in the morning for best sightings.' },
    ]
  },
  hampi: {
    destination: 'Hampi - City of Ruins',
    summary: 'Step back in time at Hampi, a UNESCO World Heritage Site and the ruins of the once-magnificent Vijayanagara Empire. The surreal landscape of boulder-strewn hills, ancient temples, and intricate carvings makes Hampi one of the most fascinating archaeological sites in India.',
    vehicleSuggestion: 'Sedan for access roads; auto-rickshaws and bicycles ideal for exploring the monument complex',
    hotelSuggestion: 'Stay in Hampi Bazaar area (Virupapura Gaddi) for easy access to monuments and the riverside',
    days: [
      { day: 1, title: 'Sacred Centre & Temples', morning: 'Visit the Virupaksha Temple, Hampi\'s oldest functioning temple dating to the 7th century, with its towering gopuram and sacred elephant. Explore the Hampi Bazaar ruins.', afternoon: 'Walk to the Hemakuta Hill for panoramic views of Hampi\'s ruins against the backdrop of boulder hills. Visit the stunning Krishna Temple and Badavilinga Temple.', evening: 'Cross the Tungabhadra River by coracle boat to Virupapura Gaddi. Climb Matanga Hill for the most breathtaking sunset view over the entire Hampi landscape.', tip: 'Coracle ride across the river is an experience in itself. Book it in advance during peak season.' },
      { day: 2, title: 'Royal Enclosure & Vittala Temple', morning: 'Explore the Royal Enclosure - see the Mahanavami Dibba (royal viewing platform), Queen\'s Bath with its Indo-Islamic architecture, and the Lotus Mahal with its lotus-shaped dome.', afternoon: 'Visit the iconic Vittala Temple complex with its famous Stone Chariot (a UNESCO World Heritage monument), musical pillars that produce the seven notes, and intricately carved mandapas.', evening: 'Explore the underground Shiva Temple and the Hazara Rama Temple with its exquisite Ramayana carvings. Enjoy dinner at a rooftop restaurant overlooking the boulder landscape.', tip: 'The Vittala Temple is 2 km from the main area. Hire an auto-rickshaw or rent a bicycle.' },
      { day: 3, title: 'Boulder Hills & Riverside', morning: 'Visit the Achyutaraya Temple and climb to the top for stunning views. Explore the monolithic Narasimha statue (6.7m tall) and the nearby Pattabhirama Temple.', afternoon: 'Relax by the Tungabhadra River. Visit the Sanapur Lake for coracle rides and cliff jumping (for adventure lovers). The paddy fields around Sanapur are beautiful.', evening: 'Shop for Hampi\'s famous banana fiber crafts and Havell\'s artifacts. Enjoy the last sunset from the Riverside ruins before departing.', tip: 'Hampi gets very hot in summer (Mar-May). Best visited Oct-Feb. Carry plenty of water.' },
    ]
  },
  karnataka: {
    destination: 'Karnataka/Mysuru - Heritage City',
    summary: 'Discover the royal grandeur of Mysuru, known as the City of Palaces. From the magnificent Amba Vilas Palace illuminated by 97,000 bulbs to the serene Brindavan Gardens, Chamundi Hills, and the heritage buildings of the city, Mysuru offers a perfect blend of history, culture, and natural beauty.',
    vehicleSuggestion: 'Sedan (Etios/Dzire) - Perfect for Mysuru city sightseeing and nearby excursions',
    hotelSuggestion: 'Stay near Mysuru Palace area or Sayyaji Rao Road for central location and easy access to attractions',
    days: [
      { day: 1, title: 'Mysuru Palace & City Heritage', morning: 'Visit the magnificent Mysuru Palace (Amba Vilas) - one of the most spectacular palaces in India with Indo-Saracenic architecture. Explore the Durbar Hall, Kalyana Mantapa, and the royal portrait gallery.', afternoon: 'Visit the Jaganmohan Palace Art Gallery with its collection of Raja Ravi Varma paintings. Explore the Devaraja Market for Mysuru silk, sandalwood, and spices.', evening: 'Watch the spectacular Palace illumination (Sundays and holidays, 7-8 PM). Visit the Brindavan Gardens for the mesmerizing musical fountain show.', tip: 'Palace illumination happens only on Sundays and public holidays. Brindavan Gardens fountain show starts at 6:30 PM.' },
      { day: 2, title: 'Chamundi Hills & Around Mysuru', morning: 'Drive up Chamundi Hills (13 km) to visit the Chamundeshwari Temple with its 7-storey gopuram. Climb the 1,000 steps for fitness and amazing views. See the huge Nandi Bull statue.', afternoon: 'Visit St. Philomena\'s Church - one of the largest churches in Asia with Neo-Gothic architecture and beautiful stained glass windows. Explore the Mysuru Zoo.', evening: 'Enjoy a traditional Mysuru dinner - Mysuru masala dosa at Mylari, or a thali at a heritage restaurant. Walk around the illuminated KR Circle area.', tip: 'Zoo is closed on Mondays. Chamundi Hills temple is less crowded in the early morning.' },
      { day: 3, title: 'Srirangapatna & Ranganthittu', morning: 'Visit Srirangapatna (20 km) - the island fortress of Tipu Sultan. See the Daria Daulat Bagh (Summer Palace), Gumbaz (Tipu\'s mausoleum), and the spot where Tipu fell.', afternoon: 'Visit Ranganthittu Bird Sanctuary (5 km from Srirangapatna) - take a boat ride among crocodiles and thousands of migratory birds including painted storks and pelicans.', evening: 'Return to Mysuru for shopping - Mysuru silk sarees, sandalwood products, Mysuru pak (sweet), and filter coffee before departure.', tip: 'Boat rides at Ranganthittu are available from 9 AM-5 PM. Best for birdwatching is early morning.' },
    ]
  },
  'tamil nadu': {
    destination: 'Tamil Nadu - Temple Trail',
    summary: 'Embark on a spiritual and cultural journey through Tamil Nadu, the land of magnificent Dravidian temples, classical dance, and ancient traditions. From the towering gopurams of Madurai to the French charm of Pondicherry and the hill station beauty of Kodaikanal, Tamil Nadu offers a rich tapestry of experiences.',
    vehicleSuggestion: 'Toyota Innova - Best for long-distance travel between cities with comfortable seating for the whole family',
    hotelSuggestion: 'Stay near temple areas in Madurai, French Quarter in Pondicherry, and lake area in Kodaikanal',
    days: [
      { day: 1, title: 'Madurai - Temple City', morning: 'Visit the iconic Meenakshi Amman Temple - one of the largest temple complexes in India with 14 towering gopurams covered in thousands of colorful stucco figures depicting Hindu mythology.', afternoon: 'Explore the Thirumalai Nayak Palace with its grand arches and Indo-Saracenic architecture. Visit the Gandhi Museum and walk through the bustling markets around the temple.', evening: 'Attend the spectacular evening ceremony (Palliarai Deepam) at Meenakshi Temple where Lord Shiva is carried to Meenakshi\'s chamber. Enjoy South Indian thali for dinner.', tip: 'Temple opens early (4 AM). Visit in the morning for fewer crowds and cooler temperatures.' },
      { day: 2, title: 'Madurai to Pondicherry', morning: 'Drive from Madurai to Pondicherry (approx 5-6 hours). En route, stop at Chidambaram to see the famous Nataraja Temple dedicated to the cosmic dancer Shiva.', afternoon: 'Arrive in Pondicherry, check into a heritage boutique hotel in the French Quarter. Stroll through the charming streets with colonial buildings, bougainvillea, and mustard-yellow walls.', evening: 'Walk along Promenade Beach, visit the French War Memorial and Gandhi Statue. Enjoy French-Tamil fusion cuisine at a seaside restaurant. Try caf\u00e9 au lait and croissants at Auroville bakeries.', tip: 'Two-wheelers are the best way to explore Pondicherry. Rent one for a day.' },
      { day: 3, title: 'Pondicherry & Auroville', morning: 'Visit Auroville - the experimental township dedicated to human unity. See the Matrimandir, a golden sphere meditation chamber set in peaceful gardens. Book the viewing in advance.', afternoon: 'Explore the Sri Aurobindo Ashram in Pondicherry. Visit the Pondicherry Museum, Bharathi Park, and the beautiful Immaculate Conception Cathedral.', evening: 'Relax at Serenity Beach or Paradise Beach. Enjoy the vibrant caf\u00e9 culture with live music and craft beer. Shop for handmade paper products and aromatherapy items.', tip: 'Matrimandir viewing requires booking 1 day in advance. No phones or bags allowed inside.' },
      { day: 4, title: 'Kodaikanal & Hill Station', morning: 'Drive to Kodaikanal (6 hrs from Pondicherry, or visit as a separate trip). Arrive at the "Princess of Hill Stations" surrounded by misty mountains and eucalyptus forests.', afternoon: 'Enjoy boating on Kodai Lake (star-shaped), walk through Coaker\'s Walk for valley views, and visit Bryant Park with its rare flowers and greenhouse.', evening: 'Visit Pillar Rocks for dramatic sunset views of three giant rock pillars. Explore the local market for homemade chocolates, eucalyptus oil, and spices.', tip: 'Kodaikanal can be chilly year-round. Carry layers. Coaker\'s Walk is best at sunrise/sunset.' },
    ]
  },
};

function getFallbackItinerary(destination: string, days: number, travellers: string, interests: string[]) {
  const key = destination.toLowerCase().replace(/[^a-z]/g, '');
  let match = FALLBACK_ITINERARIES.karnataka;

  for (const [k, v] of Object.entries(FALLBACK_ITINERARIES)) {
    if (key.includes(k) || k.includes(key)) {
      match = v;
      break;
    }
  }
  if (key.includes('mysor') || key.includes('mysuru')) match = FALLBACK_ITINERARIES.karnataka;

  // Adjust number of days
  const selectedDays = match.days.slice(0, Math.min(days, match.days.length));

  return {
    destination: match.destination,
    summary: match.summary,
    vehicleSuggestion: match.vehicleSuggestion,
    hotelSuggestion: match.hotelSuggestion,
    days: selectedDays,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, days, travellers, interests, language } = body;

    if (!destination || !days) {
      return NextResponse.json(
        { error: 'Destination and number of days are required' },
        { status: 400 }
      );
    }

    let itinerary = null;

    // Try AI API first
    try {
      const zai = await ZAI.create();
      const userMessage = `Plan a ${days}-day trip to ${destination}.
Travellers: ${travellers || 'Not specified'}
Interests: ${interests?.join(', ') || 'General sightseeing'}
${language && language !== 'en' ? `IMPORTANT: Write the entire itinerary in ${language === 'hi' ? 'Hindi' : language === 'kn' ? 'Kannada' : language === 'ta' ? 'Tamil' : language === 'ml' ? 'Malayalam' : 'English'} language. Keep place names in English.` : ''}

Generate a complete day-wise itinerary as JSON.`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      });

      const rawResponse = completion.choices[0]?.message?.content?.trim();

      if (rawResponse) {
        try {
          const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)```/);
          const jsonStr = jsonMatch ? jsonMatch[1].trim() : rawResponse;
          itinerary = JSON.parse(jsonStr);
        } catch {
          console.log('Failed to parse AI itinerary JSON, using fallback');
        }
      }
    } catch (aiError) {
      console.log('AI API unavailable, using fallback itinerary');
    }

    // Use fallback if AI failed
    if (!itinerary) {
      itinerary = getFallbackItinerary(destination, days, travellers || '', interests || []);
    }

    return NextResponse.json({ itinerary });
  } catch (error) {
    console.error('Trip Planner API error:', error);
    return NextResponse.json(
      { itinerary: getFallbackItinerary('Karnataka', 3, '', []) },
      { status: 200 }
    );
  }
}
