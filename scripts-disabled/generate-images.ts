import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const outputDir = path.join(process.cwd(), 'public');

async function generateImage(prompt: string, filename: string, size: string = '1344x768') {
  console.log(`Generating: ${filename}...`);
  try {
    const zai = await ZAI.create();
    const response = await zai.images.generations.create({ prompt, size });
    const imageBase64 = response.data[0].base64;
    const buffer = Buffer.from(imageBase64, 'base64');
    fs.writeFileSync(path.join(outputDir, filename), buffer);
    console.log(`✅ Saved: ${filename} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (error: any) {
    console.error(`❌ Failed ${filename}: ${error.message}`);
  }
}

async function main() {
  const images = [
    // AI Tools backgrounds
    { prompt: 'A beautiful digital collage of South India travel destinations - Mysuru Palace, Kerala backwaters, tea gardens - with a futuristic AI holographic overlay showing travel planning interface, warm golden ambient lighting, professional travel website hero banner style, 4k quality', filename: 'ai-trip-planner.jpg', size: '1344x768' },
    { prompt: 'Scenic winding road through lush green Western Ghats mountains in South India, coconut palms, misty hills, breathtaking travel route landscape, golden hour lighting, professional travel photography', filename: 'ai-popular-routes.jpg', size: '1344x768' },
    { prompt: 'Sparkling magical discovery concept - beautiful hidden waterfall in tropical South India forest, golden light rays filtering through canopy, mystical travel destination being revealed, ethereal glow, professional photography', filename: 'ai-recommendations.jpg', size: '1344x768' },
    { prompt: 'Aerial drone view of a scenic mountain road trip route through South India, map overlay with waypoints and pins, GPS navigation concept, lush green landscape, professional travel photography style', filename: 'ai-route-planner.jpg', size: '1344x768' },
    { prompt: 'Five golden stars rating review concept overlaid on a beautiful South India travel scene - luxury houseboat on Kerala backwaters at sunset, warm golden tones, professional travel photography with review overlay aesthetic', filename: 'ai-review-analyzer.jpg', size: '1344x768' },
    { prompt: 'Friendly AI chatbot concept for travel - holographic chat interface floating above a beautiful South India landscape with temples and palm trees, blue and golden futuristic glow, modern tech aesthetic blended with travel, professional quality', filename: 'ai-chatbot.jpg', size: '1344x768' },

    // Testimonial trip photos
    { prompt: 'Stunning Kerala backwaters at golden hour, traditional houseboat on calm waters lined with coconut palm trees, vibrant green landscape, mirror-like water reflections, professional travel photography', filename: 'testimonial-kerala.jpg', size: '1344x768' },
    { prompt: 'Beautiful misty hills of Coorg Kodagu South India, lush green coffee plantations with morning fog, rolling hills landscape, golden sunlight, professional travel photography', filename: 'testimonial-coorg.jpg', size: '1344x768' },
    { prompt: 'Scenic Nilgiri mountain railway toy train going through lush green tea plantations in Ooty South India, blue sky, misty mountains, charming vintage train, professional travel photography', filename: 'testimonial-ooty.jpg', size: '1344x768' },

    // Avatar photos
    { prompt: 'Professional portrait photo of a young Indian woman named Priya, warm smile, casual travel outfit, natural outdoor lighting, friendly face, professional headshot photography', filename: 'avatar-priya.jpg', size: '1024x1024' },
    { prompt: 'Professional portrait photo of a middle-aged Indian man named Rajesh, friendly smile, casual travel outfit, natural outdoor lighting, professional headshot photography', filename: 'avatar-rajesh.jpg', size: '1024x1024' },
    { prompt: 'Professional portrait photo of a young Indian woman named Anita, elegant smile, casual travel outfit, natural outdoor lighting, professional headshot photography', filename: 'avatar-anita.jpg', size: '1024x1024' },

    // Gallery photos
    { prompt: 'Magnificent Mysuru Palace illuminated at night with golden lights, grand architecture, reflection in water, professional architectural photography, India', filename: 'gallery-1-mysuru-palace.jpg', size: '1344x768' },
    { prompt: 'Serene Kerala backwaters with traditional houseboat, palm trees reflecting in calm turquoise water, golden sunset light, professional travel photography', filename: 'gallery-2-kerala-backwater.jpg', size: '1344x768' },
    { prompt: 'Ancient ruins of Hampi with massive boulders and historic temples, dramatic sky, warm golden light, professional travel photography, UNESCO world heritage site India', filename: 'gallery-3-hampi-ruins.jpg', size: '1344x768' },
    { prompt: 'Lush green rolling hills of Coorg with coffee plantations, morning mist, golden sunlight streaming through, breathtaking landscape photography', filename: 'gallery-4-coorg-hills.jpg', size: '1344x768' },
    { prompt: 'Beautiful Goa beach with golden sand, turquoise ocean waves, palm trees swaying, sunset sky with orange and purple hues, professional beach photography', filename: 'gallery-5-goa-beach.jpg', size: '1344x768' },
    { prompt: 'Historic Nilgiri Mountain toy train on a bridge amid lush green tea gardens and misty mountains of Ooty, vintage blue engine, professional travel photography', filename: 'gallery-6-ooty-train.jpg', size: '1344x768' },
    { prompt: 'Vast green tea gardens of Munnar with neatly trimmed tea bushes covering rolling hills, morning fog, workers picking tea leaves, professional landscape photography', filename: 'gallery-7-munnar-tea.jpg', size: '1344x768' },
    { prompt: 'Magnificent ancient South Indian Hindu temple with towering gopuram covered in colorful sculptures, intricate stone carvings, dramatic sky, professional architectural photography', filename: 'gallery-8-temple.jpg', size: '1344x768' },
    { prompt: 'Traditional Kerala wooden houseboat kettuvallam cruising through emerald green backwaters, coconut palms, blue sky with white clouds, professional travel photography', filename: 'gallery-9-wood-houseboat.jpg', size: '1344x768' },
    { prompt: 'Delicious South Indian cuisine spread on banana leaf - dosa, sambar, chutney, idli, vada, payasam, colorful and appetizing, overhead food photography', filename: 'gallery-10-indian-food.jpg', size: '1344x768' },
    { prompt: 'Breathtaking orange and purple sunset over a serene South India beach, silhouette of palm trees, gentle waves, golden reflections on water, professional sunset photography', filename: 'gallery-11-sunset-beach.jpg', size: '1344x768' },
    { prompt: 'Scenic mountain road trip through Western Ghats, winding asphalt road through lush green forest, misty valleys below, dramatic clouds, aerial perspective, professional travel photography', filename: 'gallery-12-mountain-road.jpg', size: '1344x768' },
  ];

  // Process in batches of 3 to avoid overwhelming the API
  for (let i = 0; i < images.length; i += 3) {
    const batch = images.slice(i, i + 3);
    await Promise.all(batch.map(img => generateImage(img.prompt, img.filename, img.size)));
    if (i + 3 < images.length) {
      console.log('Waiting 2 seconds before next batch...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  console.log('\n🎉 All images generated!');
}

main();
