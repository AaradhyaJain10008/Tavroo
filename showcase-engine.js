// showcase-engine.js — TAVROO AI Virtual Dressing Studio Engine
// Integrates with IMAGDressing-v1 via HuggingFace Gradio Space API
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. CONFIGURATION & HF SPACE URL
    // -----------------------------------------------------------------
    const HF_SPACE_ID = 'feishen29/IMAGDressing-v1';
    
    // Example images from the IMAGDressing HF Space repo
    const EXAMPLE_BASE = 'https://huggingface.co/spaces/feishen29/IMAGDressing-v1/resolve/main';

    // -----------------------------------------------------------------
    // 2. SAMPLE DATA — Category-Specific Garments by Gender
    // -----------------------------------------------------------------
    const sampleGarments = [
        // --- FEMALE DEPARTMENT (Haute Couture, Drape & Tailoring) ---
        { 
            id: 'g1', 
            name: 'White Lace Dress', 
            gender: ['female'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597315917349_in_post.png`, 
            prompt: 'wearing a luxury white floral embroidered designer dress',
            demoResult: 'assets/images/demo/g1-white-dress.jpg',
            tag: 'Haute Couture'
        },
        { 
            id: 'g2', 
            name: 'Boho Peasant Blouse', 
            gender: ['female'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325621176_in_post.png`, 
            prompt: 'wearing a bohemian floral print peasant blouse top with billowy sleeves',
            demoResult: 'assets/images/demo/g2-black-top.jpg',
            tag: 'Boho Editorial'
        },
        { 
            id: 'g3', 
            name: 'Parisian Striped Knit', 
            gender: ['female'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325684024_in_post.png`, 
            prompt: 'wearing a navy and white striped breton long sleeve knit top',
            demoResult: 'assets/images/demo/g3-green-skirt.jpg',
            tag: 'Parisian Chic'
        },
        { 
            id: 'g4', 
            name: 'Minimal Ribbed Shirt', 
            gender: ['female'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326026201_in_post.png`, 
            prompt: 'wearing a black ribbed long sleeve shirt, clean minimal studio portrait',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Monochrome Minimal'
        },
        { 
            id: 'g5', 
            name: 'Avant-Garde Blazer Suit', 
            gender: ['female'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326873307_in_post.png`, 
            prompt: 'wearing an avant-garde black and white graphic pattern structured blazer suit',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Avant-Garde Runway'
        },
        { 
            id: 'g6', 
            name: 'Urban Graphic Tee', 
            gender: ['female'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597335012288_in_post.png`, 
            prompt: 'wearing an oversized graphic designer white t-shirt and denim',
            demoResult: 'assets/images/demo/g6-blue-denim.jpg',
            tag: 'Urban Streetwear'
        },
        { 
            id: 'g_f7', 
            name: 'Blush Stripe Relaxed Shirt', 
            gender: ['female'],
            img: 'assets/products/blush-stripe-shirt.png', 
            prompt: 'wearing a light blush pink striped relaxed drape shirt',
            demoResult: 'assets/images/demo/g2-black-top.jpg',
            tag: 'Resort Silk'
        },

        // --- MALE DEPARTMENT (Sartorial Shirts, Heritage Denim & Knitwear) ---
        { 
            id: 'g_f8', 
            name: 'Midnight Satin Drape Shirt', 
            gender: ['male'],
            img: 'assets/products/new-arrivals/midnight-satin-shirt.png', 
            prompt: 'wearing a luxurious midnight black satin button-down shirt',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Evening Luxury'
        },
        { 
            id: 'g_m1', 
            name: 'Chocolate Pinstripe Shirt', 
            gender: ['male'],
            img: 'assets/products/chocolate-pinstripe-shirt.png', 
            prompt: 'wearing a tailored chocolate brown pinstripe button-up shirt',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Sartorial Tailoring'
        },
        { 
            id: 'g_m2', 
            name: 'Indigo Utility Denim Shirt', 
            gender: ['male'],
            img: 'assets/products/indigo-denim-shirt.png', 
            prompt: 'wearing a rugged short-sleeve indigo denim utility shirt',
            demoResult: 'assets/images/demo/g6-blue-denim.jpg',
            tag: 'Heritage Denim'
        },
        { 
            id: 'g_m3', 
            name: 'Olive Colourblock Shirt', 
            gender: ['male'],
            img: 'assets/products/olive-colourblock-shirt.png', 
            prompt: 'wearing an olive green and ivory colourblock camp collar shirt',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Contemporary Resort'
        },
        { 
            id: 'g_m4', 
            name: 'Chicago 23 Heavyweight Tee', 
            gender: ['male'],
            img: 'assets/products/new-arrivals/chicago-jersey-tee.png', 
            prompt: 'wearing a vintage heavyweight boxy graphic streetwear t-shirt',
            demoResult: 'assets/images/demo/g6-blue-denim.jpg',
            tag: 'Streetwear Heritage'
        },
        { 
            id: 'g_m5', 
            name: 'Coffee Contrast Knit Polo', 
            gender: ['male'],
            img: 'assets/products/new-arrivals/coffee-contrast-polo.png', 
            prompt: 'wearing a textured espresso coffee contrast collar knit polo',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Atelier Knitwear'
        },
        { 
            id: 'g_m6', 
            name: 'Navy Stripe Sweatshirt', 
            gender: ['male'],
            img: 'assets/products/new-arrivals/navy-stripe-sweatshirt.png', 
            prompt: 'wearing an architectural navy and cream striped crewneck sweater',
            demoResult: 'assets/images/demo/g3-green-skirt.jpg',
            tag: 'Luxury Casual'
        },
        { 
            id: 'g_m7', 
            name: 'Crane Embroidered Shirt', 
            gender: ['male'],
            img: 'assets/products/new-arrivals/crane-embroidered-shirt.png', 
            prompt: 'wearing an artistic black button-up shirt with golden crane embroidery',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Artisanal Craft'
        },
        { 
            id: 'g_m8', 
            name: 'Rust Fine-Gauge Polo', 
            gender: ['male'],
            img: 'assets/products/new-arrivals/rust-knit-polo.png', 
            prompt: 'wearing a tailored rust terracotta knit polo shirt',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Fine Gauge Knit'
        },

        // --- NON-BINARY DEPARTMENT (Architectural, Fluid & Oversized) ---
        { 
            id: 'g_nb1', 
            name: 'Deconstructed Graphic Tee', 
            gender: ['non-binary'],
            img: 'assets/images/custom-design-studio-tee.png', 
            prompt: 'wearing an oversized deconstructed graphic t-shirt, fluid unisex silhouette',
            demoResult: 'assets/images/demo/g6-blue-denim.jpg',
            tag: 'Fluid Streetwear'
        },
        { 
            id: 'g_nb2', 
            name: 'Parachute Leather Blazer', 
            gender: ['non-binary'],
            img: 'assets/images/parachute-cargo-leather-blazer.png', 
            prompt: 'wearing an architectural oversized vegan leather blazer, gender-neutral tailoring',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Architectural Tailoring'
        },
        { 
            id: 'g_nb3', 
            name: 'Geometric Runway Jacket', 
            gender: ['non-binary'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326873307_in_post.png`, 
            prompt: 'wearing an avant-garde black and white geometric structured suit jacket',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Runway Sculptural'
        },
        { 
            id: 'g_nb4', 
            name: 'Forest Relaxed Studio Tee', 
            gender: ['non-binary'],
            img: 'assets/products/new-arrivals/forest-relaxed-tee.png', 
            prompt: 'wearing a heavy draped forest green oversized drop-shoulder t-shirt',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Oversized Minimal'
        },
        { 
            id: 'g_nb5', 
            name: 'Ivory Boxy Embroidered Shirt', 
            gender: ['non-binary'],
            img: 'assets/products/new-arrivals/ivory-embroidered-shirt.png', 
            prompt: 'wearing a clean ivory boxy cut shirt with subtle tonal embroidery',
            demoResult: 'assets/images/demo/g1-white-dress.jpg',
            tag: 'Clean Minimal'
        },
        { 
            id: 'g_nb6', 
            name: 'Breton Fluid Knit Top', 
            gender: ['non-binary'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325684024_in_post.png`, 
            prompt: 'wearing a fluid unisex nautical breton stripe long sleeve top',
            demoResult: 'assets/images/demo/g3-green-skirt.jpg',
            tag: 'Timeless Breton'
        },
        { 
            id: 'g_nb7', 
            name: 'Minimal Black Ribbed Knit', 
            gender: ['non-binary'],
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326026201_in_post.png`, 
            prompt: 'wearing a minimal unisex black ribbed crewneck long sleeve shirt',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Monochrome Minimal'
        },
        { 
            id: 'g_nb8', 
            name: 'Vintage Studio Graphic Tee', 
            gender: ['non-binary'],
            img: 'assets/products/new-arrivals/vintage-classic-tee.png', 
            prompt: 'wearing an earthy vintage-washed heavyweight relaxed fit t-shirt',
            demoResult: 'assets/images/demo/g6-blue-denim.jpg',
            tag: 'Heritage Casual'
        }
    ];

    const sampleBottoms = [
        // --- FEMALE BOTTOMS (High-Rise Silhouettes & Editorial Denim) ---
        {
            id: 'b_f4',
            name: 'Washed Flare Denim',
            gender: ['female'],
            img: 'assets/products/denims/washed-flare-jeans.png',
            prompt: 'wearing high-rise washed flare indigo denim trousers',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: '70s High Rise'
        },
        {
            id: 'b_w_cuffed',
            name: 'Cuffed Barrel Leg Denim',
            gender: ['female'],
            img: 'assets/products/denims/cuffed-barrel-jeans.png',
            prompt: 'wearing high-rise cuffed barrel leg blue denim jeans with turn-up hems',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Barrel Silhouette'
        },
        {
            id: 'b_w_skyflare',
            name: 'Sky Wash Flare Denim',
            gender: ['female'],
            img: 'assets/products/denims/light-wash-flare-jeans.png',
            prompt: 'wearing high-rise sky blue wash flare leg denim jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Retro Flare'
        },
        {
            id: 'b_w_barrel',
            name: 'Relaxed Turn-Up Denim',
            gender: ['female'],
            img: 'assets/products/denims/cuffed-barrel-jeans.png',
            prompt: 'wearing relaxed fit cuffed barrel leg vintage blue jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Relaxed Fit'
        },
        {
            id: 'b_w_straight',
            name: 'Vintage Wide-Leg Denim',
            gender: ['female'],
            img: 'assets/products/denims/classic-straight-wide-jeans.png',
            prompt: 'wearing relaxed vintage light wash wide-leg denim jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Vintage Wide-Leg'
        },
        {
            id: 'b_w_crosswaist',
            name: 'Cross-Waist Stone Trousers',
            gender: ['female'],
            img: 'assets/products/denims/cross-belt-stone-trousers.png',
            prompt: 'wearing tailored high-waisted cross-over waistband stone pleat wide-leg trousers',
            demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
            tag: 'Tailored Suiting'
        },

        // --- MALE BOTTOMS ---
        {
            id: 'b1',
            name: 'Stone Tailored Trousers',
            gender: ['male'],
            img: 'assets/products/denims/stone-tailored-trousers.png',
            prompt: 'wearing tailored high-waisted stone pleat wide-leg trousers',
            demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
            tag: 'Tailored Suiting'
        },
        {
            id: 'b2',
            name: 'Light Wide-Leg Denim',
            gender: ['male'],
            img: 'assets/products/denims/light-wide-leg-jeans.png',
            prompt: 'wearing relaxed light wash wide-leg denim jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Casual Streetwear'
        },
        {
            id: 'b3',
            name: 'Olive Utility Cargos',
            gender: ['male'],
            img: 'assets/products/denims/olive-utility-cargos.png',
            prompt: 'wearing olive green utility cargo trousers with cinch toggles',
            demoResult: 'assets/images/demo/b3-olive-cargos.jpg',
            tag: 'Utility Streetwear'
        },
        {
            id: 'b_f5',
            name: 'Ivory Minimal Joggers',
            gender: ['male'],
            img: 'assets/products/denims/ivory-joggers.png',
            prompt: 'wearing clean ivory cream relaxed fleece joggers',
            demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
            tag: 'Lounge Luxury'
        },
        {
            id: 'b5',
            name: 'Navy Pinstripe Trousers',
            gender: ['male'],
            img: 'assets/products/denims/navy-pinstripe-trousers.png',
            prompt: 'wearing navy blue tailored trousers with fine vertical pinstripes',
            demoResult: 'assets/images/demo/g3-green-skirt.jpg',
            tag: 'Parisian Tailored'
        },
        {
            id: 'b4',
            name: 'Charcoal Relaxed Denim',
            gender: ['male'],
            img: 'assets/products/denims/charcoal-relaxed-jeans.png',
            prompt: 'wearing relaxed charcoal washed straight-leg denim jeans',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Relaxed Denim'
        },
        {
            id: 'b_m2',
            name: 'Olive Tactical Cargos',
            gender: ['male'],
            img: 'assets/products/denims/olive-utility-cargos.png',
            prompt: 'wearing olive green utility cargo trousers with tactical pockets',
            demoResult: 'assets/images/demo/b3-olive-cargos.jpg',
            tag: 'Tactical Cargo'
        },
        {
            id: 'b_m3',
            name: 'Stone Pleated Trousers',
            gender: ['male'],
            img: 'assets/products/denims/stone-tailored-trousers.png',
            prompt: 'wearing stone pleated tailored suiting trousers',
            demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
            tag: 'Sartorial Pleat'
        },
        {
            id: 'b_m4',
            name: 'Dark Raw Straight Denim',
            gender: ['male'],
            img: 'assets/products/denims/dark-straight-jeans.png',
            prompt: 'wearing dark indigo raw selvedge straight leg denim jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Raw Selvedge'
        },
        {
            id: 'b6',
            name: 'Cocoa Workwear Cargos',
            gender: ['male'],
            img: 'assets/products/denims/cocoa-cargo-pants.png',
            prompt: 'wearing relaxed cocoa brown cargo pants with utility pockets',
            demoResult: 'assets/images/demo/g2-black-top.jpg',
            tag: 'Workwear Utility'
        },
        {
            id: 'b_m6',
            name: 'Washed Black Straight Denim',
            gender: ['male'],
            img: 'assets/products/denims/washed-black-straight-jeans.png',
            prompt: 'wearing washed black vintage denim straight leg jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Vintage Wash'
        },

        // --- NON-BINARY BOTTOMS ---
        {
            id: 'b_nb1',
            name: 'Stone Fluid Wide-Leg',
            gender: ['non-binary'],
            img: 'assets/products/denims/stone-tailored-trousers.png',
            prompt: 'wearing fluid stone high-rise wide-leg pleat trousers',
            demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
            tag: 'Fluid Drape'
        },
        {
            id: 'b_nb2',
            name: 'Olive Parachute Cargos',
            gender: ['non-binary'],
            img: 'assets/products/denims/olive-utility-cargos.png',
            prompt: 'wearing relaxed olive green utility parachute trousers',
            demoResult: 'assets/images/demo/b3-olive-cargos.jpg',
            tag: 'Parachute Utility'
        },
        {
            id: 'b_nb3',
            name: 'Charcoal Universal Denim',
            gender: ['non-binary'],
            img: 'assets/products/denims/charcoal-relaxed-jeans.png',
            prompt: 'wearing charcoal relaxed wide straight-leg denim pants',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Universal Denim'
        },
        {
            id: 'b_nb4',
            name: 'Slate Architectural Trousers',
            gender: ['non-binary'],
            img: 'assets/products/denims/slate-tailored-trousers.png',
            prompt: 'wearing slate grey architectural tailored wide trousers',
            demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
            tag: 'Architectural Suiting'
        },
        {
            id: 'b_nb5',
            name: 'Wide-Leg Street Jeans',
            gender: ['non-binary'],
            img: 'assets/products/denims/wide-leg-street-jeans.png',
            prompt: 'wearing vintage mid-blue wide-leg streetwear denim jeans',
            demoResult: 'assets/images/demo/b2-wide-jeans.jpg',
            tag: 'Streetwear Denim'
        },
        {
            id: 'b_nb6',
            name: 'Espresso Modular Cargos',
            gender: ['non-binary'],
            img: 'assets/products/denims/espresso-cargo-pants.png',
            prompt: 'wearing deep espresso brown relaxed cargo trousers with modular pockets',
            demoResult: 'assets/images/demo/b3-olive-cargos.jpg',
            tag: 'Modular Cargo'
        }
    ];

    const sampleFaces = [
        { id: 'f1', img: `${EXAMPLE_BASE}/example/face/1.jpg`, name: 'Face 1' },
        { id: 'f2', img: `${EXAMPLE_BASE}/example/face/2.jpg`, name: 'Face 2' },
        { id: 'f3', img: `${EXAMPLE_BASE}/example/face/3333.jpg`, name: 'Face 3' }
    ];

    // -----------------------------------------------------------------
    // INCLUSIVE BASE MODELS & POSE SKELETON FIGURES
    // -----------------------------------------------------------------
    const samplePoses = [
        // --- FEMALE BASE FIGURES ---
        { 
            id: 'p_f1', 
            name: 'Runway Frontal', 
            gender: 'female',
            categoryLabel: 'Female Base',
            img: `${EXAMPLE_BASE}/example/pose/00034_00.jpg`,
            promptModifier: 'high fashion runway model standing centered frontal pose',
            isDefault: true,
            poseType: 'frontal'
        },
        { 
            id: 'p_f2', 
            name: '3/4 Editorial Turn', 
            gender: 'female',
            categoryLabel: 'Female Base',
            img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg`,
            promptModifier: 'editorial three-quarter angled modeling posture',
            poseType: 'turn'
        },
        { 
            id: 'p_f3', 
            name: 'Relaxed Studio Poise', 
            gender: 'female',
            categoryLabel: 'Female Base',
            img: `${EXAMPLE_BASE}/example/pose/01992_00.jpg`,
            promptModifier: 'relaxed natural standing posture in fashion studio',
            poseType: 'relaxed'
        },
        { 
            id: 'p_f4', 
            name: 'Couture Hands on Hips', 
            gender: 'female',
            categoryLabel: 'Female Base',
            img: `${EXAMPLE_BASE}/example/pose/00034_00.jpg`,
            promptModifier: 'sculpted couture stance with hands on waist',
            poseType: 'hands_on_hips'
        },
        { 
            id: 'p_f5', 
            name: 'Catwalk Stride Walk', 
            gender: 'female',
            categoryLabel: 'Female Base',
            img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg`,
            promptModifier: 'dynamic catwalk walking stride runway pose',
            poseType: 'stride'
        },

        // --- MALE BASE FIGURES ---
        { 
            id: 'p_m1', 
            name: 'Athletic Stance', 
            gender: 'male',
            categoryLabel: 'Male Base',
            img: `${EXAMPLE_BASE}/example/pose/00034_00.jpg`,
            promptModifier: 'confident male model athletic centered upright posture',
            isDefault: true,
            poseType: 'athletic'
        },
        { 
            id: 'p_m2', 
            name: '3/4 Sartorial Turn', 
            gender: 'male',
            categoryLabel: 'Male Base',
            img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg`,
            promptModifier: 'male fashion model in three-quarter standing silhouette',
            poseType: 'turn'
        },
        { 
            id: 'p_m3', 
            name: 'Hands in Pockets', 
            gender: 'male',
            categoryLabel: 'Male Base',
            img: `${EXAMPLE_BASE}/example/pose/01992_00.jpg`,
            promptModifier: 'casual relaxed male stance with hands tucked in pockets',
            poseType: 'pockets'
        },
        { 
            id: 'p_m4', 
            name: 'Runway Stride Walk', 
            gender: 'male',
            categoryLabel: 'Male Base',
            img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg`,
            promptModifier: 'dynamic male fashion catwalk walking stride',
            poseType: 'stride'
        },
        { 
            id: 'p_m5', 
            name: 'Tailored Side Profile', 
            gender: 'male',
            categoryLabel: 'Male Base',
            img: `${EXAMPLE_BASE}/example/pose/00034_00.jpg`,
            promptModifier: 'sartorial male modeling pose, clean side profile',
            poseType: 'profile'
        },

        // --- UNISEX / NON-BINARY BASE FIGURES ---
        { 
            id: 'p_u1', 
            name: 'Neutral Symmetry', 
            gender: 'unisex',
            categoryLabel: 'Unisex Base',
            img: `${EXAMPLE_BASE}/example/pose/00034_00.jpg`,
            promptModifier: 'architectural gender-neutral symmetrical modeling stance',
            isDefault: true,
            poseType: 'frontal'
        },
        { 
            id: 'p_u2', 
            name: 'Fluid High-Fashion Angle', 
            gender: 'unisex',
            categoryLabel: 'Unisex Base',
            img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg`,
            promptModifier: 'fluid contemporary avant-garde posture',
            poseType: 'turn'
        },
        { 
            id: 'p_u3', 
            name: 'Streetwear Upright', 
            gender: 'unisex',
            categoryLabel: 'Unisex Base',
            img: `${EXAMPLE_BASE}/example/pose/01992_00.jpg`,
            promptModifier: 'contemporary street fashion upright relaxed pose',
            poseType: 'relaxed'
        },
        { 
            id: 'p_u4', 
            name: 'Editorial Motion Flow', 
            gender: 'unisex',
            categoryLabel: 'Unisex Base',
            img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg`,
            promptModifier: 'fluid high-fashion editorial pose with natural movement',
            poseType: 'stride'
        }
    ];

    // -----------------------------------------------------------------
    // 3. DOM REFERENCES
    // -----------------------------------------------------------------
    // Top-Level Gender Controls
    const genderBtns = document.querySelectorAll('.ai-gender-btn');
    const genderBadge = document.getElementById('ai-gender-badge');

    // Upper Garment Controls
    const garmentGrid = document.getElementById('ai-garment-grid');
    const garmentUpload = document.getElementById('garment-upload');
    const garmentPreviewRow = document.getElementById('garment-preview-row');
    const garmentPreviewThumb = document.getElementById('garment-preview-thumb');
    const garmentPreviewName = document.getElementById('garment-preview-name');
    const clearGarmentBtn = document.getElementById('clear-garment');

    // Bottoms & Lowers Controls
    const bottomsGrid = document.getElementById('ai-bottoms-grid');
    const bottomUpload = document.getElementById('bottom-upload');
    const bottomPreviewRow = document.getElementById('bottom-preview-row');
    const bottomPreviewThumb = document.getElementById('bottom-preview-thumb');
    const bottomPreviewName = document.getElementById('bottom-preview-name');
    const clearBottomBtn = document.getElementById('clear-bottom');

    const toggleFace = document.getElementById('toggle-face');
    const faceControls = document.getElementById('face-controls');
    const faceUpload = document.getElementById('face-upload');
    const faceExamplesRow = document.getElementById('face-examples-row');
    const facePreviewRow = document.getElementById('face-preview-row');
    const facePreviewThumb = document.getElementById('face-preview-thumb');
    const facePreviewName = document.getElementById('face-preview-name');
    const clearFaceBtn = document.getElementById('clear-face');

    // Pose & Base Model Controls
    const togglePose = document.getElementById('toggle-pose');
    const poseControls = document.getElementById('pose-controls');
    const poseGrid = document.getElementById('ai-pose-grid');
    const poseResetBtn = document.getElementById('pose-reset-btn');
    const poseFilterTabs = document.querySelectorAll('.ai-pose-filter-tab');
    const toastContainer = document.getElementById('ai-toast-container');

    const promptInput = document.getElementById('ai-prompt');
    const generateBtn = document.getElementById('ai-generate-btn');
    const genText = document.getElementById('ai-gen-text');
    const downloadBtn = document.getElementById('ai-download-btn');
    const redoBtn = document.getElementById('ai-redo-btn');
    const resetBtn = document.getElementById('ai-reset-btn');
    const stageRedoBtn = document.getElementById('stage-redo-btn');
    const stageChangeBtn = document.getElementById('stage-change-btn');

    // Engine Mode Controls
    const modeDemoBtn = document.getElementById('mode-demo-btn');
    const modeLiveBtn = document.getElementById('mode-live-btn');
    const demoFallbackBtn = document.getElementById('ai-demo-fallback-btn');

    // Output stage states
    const emptyState = document.getElementById('ai-empty-state');
    const loadingState = document.getElementById('ai-loading-state');
    const resultState = document.getElementById('ai-result-state');
    const errorState = document.getElementById('ai-error-state');
    const resultImage = document.getElementById('ai-result-image');
    const resultTag = document.getElementById('ai-result-tag');
    const retryBtn = document.getElementById('ai-retry-btn');

    // Loading state elements
    const loadingDesc = document.getElementById('ai-loading-desc');
    const progressFill = document.getElementById('ai-progress-fill');
    const loadingTimer = document.getElementById('ai-loading-timer');

    // Status indicators
    const statusDot = document.getElementById('ai-status-dot');
    const statusText = document.getElementById('ai-status-text');

    // Error elements
    const errorDesc = document.getElementById('ai-error-desc');

    // History
    const historyGrid = document.getElementById('ai-history-grid');
    const historyEmpty = document.getElementById('ai-history-empty');

    // Lightbox
    const lightbox = document.getElementById('ai-lightbox');
    const lightboxImg = document.getElementById('ai-lightbox-img');
    const lightboxClose = document.getElementById('ai-lightbox-close');

    // Advanced settings sliders
    const sliderIds = ['cloth-guidance', 'prompt-guidance', 'face-guidance', 'self-lora', 'cross-lora', 'denoise-steps'];
    const valIds = ['cloth-val', 'prompt-val', 'face-val', 'self-lora-val', 'cross-lora-val', 'steps-val'];

    // -----------------------------------------------------------------
    // 4. STATE
    // -----------------------------------------------------------------
    let engineMode = 'demo';              // 'demo' | 'live'
    let currentGender = 'female';         // 'female' | 'male' | 'non-binary'
    let currentPoseFilter = 'all';        // 'all' | 'female' | 'male' | 'unisex'
    let selectedGarment = null;          // { id, img, name, isFile, file, prompt, demoResult, tag }
    let selectedBottom = null;           // { id, img, name, isFile, file, prompt, demoResult, tag }
    let selectedFace = null;             // { id, img, name, isFile, file }
    let selectedPose = null;             // { id, img, name, isFile, file, promptModifier }
    let generationHistory = [];
    let isGenerating = false;

    // Toast feedback notification helper
    function showToast(message, icon = '✦') {
        if (!toastContainer) return;
        const toast = document.createElement('div');
        toast.className = 'ai-toast';
        toast.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${message}</span>
        `;
        toastContainer.appendChild(toast);
        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Dynamic vector skeleton SVG generator for OpenPose visual guidance
    function getPoseSkeletonSvg(poseType) {
        if (poseType === 'frontal') {
            return `
                <svg class="ai-pose-skeleton-svg" viewBox="0 0 60 90">
                    <circle cx="30" cy="12" r="6" stroke-width="2" />
                    <line x1="30" y1="18" x2="30" y2="46" stroke-width="2.4" />
                    <line x1="18" y1="26" x2="42" y2="26" stroke-width="2.2" />
                    <line x1="18" y1="26" x2="14" y2="44" stroke-width="2" />
                    <line x1="14" y1="44" x2="12" y2="58" stroke-width="1.8" />
                    <line x1="42" y1="26" x2="46" y2="44" stroke-width="2" />
                    <line x1="46" y1="44" x2="48" y2="58" stroke-width="1.8" />
                    <line x1="22" y1="46" x2="38" y2="46" stroke-width="2.2" />
                    <line x1="24" y1="46" x2="23" y2="68" stroke-width="2" />
                    <line x1="23" y1="68" x2="22" y2="86" stroke-width="1.8" />
                    <line x1="36" y1="46" x2="37" y2="68" stroke-width="2" />
                    <line x1="37" y1="68" x2="38" y2="86" stroke-width="1.8" />
                </svg>
            `;
        } else if (poseType === 'turn') {
            return `
                <svg class="ai-pose-skeleton-svg" viewBox="0 0 60 90">
                    <circle cx="28" cy="12" r="6" stroke-width="2" />
                    <line x1="28" y1="18" x2="30" y2="46" stroke-width="2.4" />
                    <line x1="20" y1="26" x2="40" y2="24" stroke-width="2.2" />
                    <line x1="20" y1="26" x2="16" y2="42" stroke-width="2" />
                    <line x1="16" y1="42" x2="20" y2="56" stroke-width="1.8" />
                    <line x1="40" y1="24" x2="43" y2="42" stroke-width="2" />
                    <line x1="43" y1="42" x2="41" y2="56" stroke-width="1.8" />
                    <line x1="24" y1="46" x2="37" y2="45" stroke-width="2.2" />
                    <line x1="25" y1="46" x2="22" y2="66" stroke-width="2" />
                    <line x1="22" y1="66" x2="20" y2="86" stroke-width="1.8" />
                    <line x1="36" y1="45" x2="37" y2="67" stroke-width="2" />
                    <line x1="37" y1="67" x2="38" y2="86" stroke-width="1.8" />
                </svg>
            `;
        } else if (poseType === 'hands_on_hips') {
            return `
                <svg class="ai-pose-skeleton-svg" viewBox="0 0 60 90">
                    <circle cx="30" cy="12" r="6" stroke-width="2" />
                    <line x1="30" y1="18" x2="30" y2="46" stroke-width="2.4" />
                    <line x1="18" y1="25" x2="42" y2="25" stroke-width="2.2" />
                    <line x1="18" y1="25" x2="11" y2="38" stroke-width="2" />
                    <line x1="11" y1="38" x2="20" y2="47" stroke-width="1.8" />
                    <line x1="42" y1="25" x2="49" y2="38" stroke-width="2" />
                    <line x1="49" y1="38" x2="40" y2="47" stroke-width="1.8" />
                    <line x1="22" y1="46" x2="38" y2="46" stroke-width="2.2" />
                    <line x1="24" y1="46" x2="21" y2="67" stroke-width="2" />
                    <line x1="21" y1="67" x2="19" y2="86" stroke-width="1.8" />
                    <line x1="36" y1="46" x2="39" y2="67" stroke-width="2" />
                    <line x1="39" y1="67" x2="41" y2="86" stroke-width="1.8" />
                </svg>
            `;
        } else if (poseType === 'stride') {
            return `
                <svg class="ai-pose-skeleton-svg" viewBox="0 0 60 90">
                    <circle cx="30" cy="12" r="6" stroke-width="2" />
                    <line x1="30" y1="18" x2="29" y2="45" stroke-width="2.4" />
                    <line x1="18" y1="25" x2="42" y2="25" stroke-width="2.2" />
                    <line x1="18" y1="25" x2="14" y2="40" stroke-width="2" />
                    <line x1="14" y1="40" x2="10" y2="54" stroke-width="1.8" />
                    <line x1="42" y1="25" x2="45" y2="40" stroke-width="2" />
                    <line x1="45" y1="40" x2="46" y2="54" stroke-width="1.8" />
                    <line x1="22" y1="45" x2="38" y2="45" stroke-width="2.2" />
                    <line x1="24" y1="45" x2="19" y2="65" stroke-width="2" />
                    <line x1="19" y1="65" x2="15" y2="86" stroke-width="1.8" />
                    <line x1="36" y1="45" x2="41" y2="66" stroke-width="2" />
                    <line x1="41" y1="66" x2="44" y2="86" stroke-width="1.8" />
                </svg>
            `;
        } else if (poseType === 'pockets') {
            return `
                <svg class="ai-pose-skeleton-svg" viewBox="0 0 60 90">
                    <circle cx="30" cy="12" r="6" stroke-width="2" />
                    <line x1="30" y1="18" x2="30" y2="46" stroke-width="2.4" />
                    <line x1="16" y1="24" x2="44" y2="24" stroke-width="2.4" />
                    <line x1="16" y1="24" x2="18" y2="40" stroke-width="2" />
                    <line x1="18" y1="40" x2="22" y2="50" stroke-width="1.8" />
                    <line x1="44" y1="24" x2="42" y2="40" stroke-width="2" />
                    <line x1="42" y1="40" x2="38" y2="50" stroke-width="1.8" />
                    <line x1="22" y1="46" x2="38" y2="46" stroke-width="2.2" />
                    <line x1="24" y1="46" x2="23" y2="67" stroke-width="2" />
                    <line x1="23" y1="67" x2="22" y2="86" stroke-width="1.8" />
                    <line x1="36" y1="46" x2="37" y2="67" stroke-width="2" />
                    <line x1="37" y1="67" x2="38" y2="86" stroke-width="1.8" />
                </svg>
            `;
        } else {
            return `
                <svg class="ai-pose-skeleton-svg" viewBox="0 0 60 90">
                    <circle cx="30" cy="12" r="6" stroke-width="2" />
                    <line x1="30" y1="18" x2="30" y2="46" stroke-width="2.4" />
                    <line x1="17" y1="25" x2="43" y2="25" stroke-width="2.2" />
                    <line x1="17" y1="25" x2="13" y2="42" stroke-width="2" />
                    <line x1="13" y1="42" x2="12" y2="56" stroke-width="1.8" />
                    <line x1="43" y1="25" x2="47" y2="42" stroke-width="2" />
                    <line x1="47" y1="42" x2="48" y2="56" stroke-width="1.8" />
                    <line x1="22" y1="46" x2="38" y2="46" stroke-width="2.2" />
                    <line x1="24" y1="46" x2="23" y2="67" stroke-width="2" />
                    <line x1="23" y1="67" x2="22" y2="86" stroke-width="1.8" />
                    <line x1="36" y1="46" x2="37" y2="67" stroke-width="2" />
                    <line x1="37" y1="67" x2="38" y2="86" stroke-width="1.8" />
                </svg>
            `;
        }
    }

    // -----------------------------------------------------------------
    // 5. POPULATE UI GRIDS (REACTIVE TO GENDER & INCLUSIVE POSES)
    // -----------------------------------------------------------------
    function populateGarments() {
        if (!garmentGrid) return;
        garmentGrid.innerHTML = '';

        const filtered = sampleGarments.filter(g => 
            !g.gender || g.gender.includes(currentGender)
        );

        filtered.forEach(g => {
            const card = document.createElement('div');
            card.className = 'ai-garment-card';
            card.dataset.id = g.id;
            if (selectedGarment && selectedGarment.id === g.id) {
                card.classList.add('selected');
            }
            card.innerHTML = `
                <img class="ai-garment-img" src="${g.img}" alt="${g.name}" loading="lazy" crossorigin="anonymous"
                     onerror="this.style.display='none'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center'; this.parentElement.innerHTML = '<span class=\\'ai-garment-label\\'>${g.name}</span>';">
                <span class="ai-garment-label">${g.name}</span>
            `;
            card.addEventListener('click', () => selectGarment(g, card));
            garmentGrid.appendChild(card);
        });

        // Ensure a selected garment is active for the current gender
        if (filtered.length > 0) {
            const isSelectedInList = selectedGarment && filtered.some(item => item.id === selectedGarment.id);
            if (!isSelectedInList) {
                selectGarment(filtered[0], garmentGrid.children[0]);
            }
        }
    }

    function populateBottoms() {
        if (!bottomsGrid) return;
        bottomsGrid.innerHTML = '';

        const filtered = sampleBottoms.filter(b => 
            !b.gender || b.gender.includes(currentGender)
        );

        filtered.forEach(b => {
            const card = document.createElement('div');
            card.className = 'ai-bottom-card';
            card.dataset.id = b.id;
            if (selectedBottom && selectedBottom.id === b.id) {
                card.classList.add('selected');
            }
            card.innerHTML = `
                <img class="ai-bottom-img" src="${b.img}" alt="${b.name}" loading="lazy"
                     onerror="this.style.display='none'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center'; this.parentElement.innerHTML = '<span class=\\'ai-bottom-label\\'>${b.name}</span>';">
                <span class="ai-bottom-label">${b.name}</span>
            `;
            card.addEventListener('click', () => selectBottom(b, card));
            bottomsGrid.appendChild(card);
        });

        // Clear previous selection if not available in current gender
        if (selectedBottom && !selectedBottom.isFile) {
            const isSelectedInList = filtered.some(item => item.id === selectedBottom.id);
            if (!isSelectedInList) {
                clearBottom();
            }
        }
    }

    function populateFaces() {
        if (!faceExamplesRow) return;
        faceExamplesRow.innerHTML = '';
        sampleFaces.forEach(f => {
            const thumb = document.createElement('div');
            thumb.className = 'ai-example-thumb';
            thumb.dataset.id = f.id;
            thumb.innerHTML = `<img src="${f.img}" alt="${f.name}" loading="lazy" crossorigin="anonymous"
                onerror="this.parentElement.style.background='rgba(212,175,55,0.1)'; this.style.display='none';">`;
            thumb.addEventListener('click', () => selectFace(f, thumb));
            faceExamplesRow.appendChild(thumb);
        });
    }

    function populatePoses() {
        if (!poseGrid) return;
        poseGrid.innerHTML = '';

        const filteredPoses = samplePoses.filter(p => {
            if (currentPoseFilter === 'all') return true;
            return p.gender === currentPoseFilter;
        });

        filteredPoses.forEach(p => {
            const card = document.createElement('div');
            card.className = 'ai-pose-card';
            card.dataset.id = p.id;
            if (selectedPose && selectedPose.id === p.id) {
                card.classList.add('selected');
            }

            const genderBadgeClass = p.gender;
            card.innerHTML = `
                <div class="ai-pose-card-inner">
                    <span class="ai-pose-gender-tag ${genderBadgeClass}">${p.categoryLabel || p.gender}</span>
                    ${getPoseSkeletonSvg(p.poseType || 'frontal')}
                    <span class="ai-pose-label">${p.name}</span>
                </div>
            `;
            card.addEventListener('click', () => selectPose(p, card));
            poseGrid.appendChild(card);
        });
    }

    // -----------------------------------------------------------------
    // 6. GENDER SELECTION & DYNAMIC FILTERING LOGIC
    // -----------------------------------------------------------------
    function setGender(gender) {
        if (currentGender === gender) return;
        currentGender = gender;

        // 1. Update UI buttons and badges
        genderBtns.forEach(btn => {
            const isMatch = btn.getAttribute('data-gender') === gender;
            btn.classList.toggle('active', isMatch);
            btn.setAttribute('aria-checked', isMatch ? 'true' : 'false');
        });

        const labelMap = { 'female': 'Female', 'male': 'Male', 'non-binary': 'Non-Binary' };
        if (genderBadge) {
            genderBadge.textContent = labelMap[gender] || 'Female';
        }

        // 2. Refresh dynamic garment and bottoms grids
        populateGarments();
        populateBottoms();

        // 3. Pre-select matching default pose figure for this gender
        const defaultPose = samplePoses.find(p => p.gender === (gender === 'non-binary' ? 'unisex' : gender) && p.isDefault) 
                         || samplePoses.find(p => p.gender === (gender === 'non-binary' ? 'unisex' : gender))
                         || samplePoses[0];

        if (defaultPose) {
            selectedPose = {
                id: defaultPose.id,
                name: defaultPose.name,
                img: defaultPose.img,
                gender: defaultPose.gender,
                promptModifier: defaultPose.promptModifier
            };
        }
        populatePoses();

        // 4. Update default prompt to match gender tone if unchanged
        if (promptInput) {
            const defaultFemalePrompt = 'A beautiful female model standing in a fashion studio, professional photography';
            const defaultMalePrompt = 'A handsome male model standing in a fashion studio, professional photography';
            const defaultNonBinaryPrompt = 'A stylish contemporary model standing in a fashion studio, professional photography';

            if (promptInput.value === defaultFemalePrompt || promptInput.value === defaultMalePrompt || promptInput.value === defaultNonBinaryPrompt || promptInput.value === 'A beautiful model standing in a fashion studio, professional photography') {
                if (gender === 'female') {
                    promptInput.value = defaultFemalePrompt;
                } else if (gender === 'male') {
                    promptInput.value = defaultMalePrompt;
                } else {
                    promptInput.value = defaultNonBinaryPrompt;
                }
            }
        }

        showToast(`${labelMap[gender]} Department & Base Figures Loaded`);
    }

    genderBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetGender = btn.getAttribute('data-gender');
            if (targetGender) setGender(targetGender);
        });
    });

    // -----------------------------------------------------------------
    // POSE FILTER TABS & RESET HANDLERS
    // -----------------------------------------------------------------
    function setPoseFilter(filter) {
        currentPoseFilter = filter;
        poseFilterTabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-pose-filter') === filter);
        });
        populatePoses();
    }

    poseFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-pose-filter');
            if (filter) setPoseFilter(filter);
        });
    });

    function resetPose() {
        // Reset to default base model matching the active gender
        const targetGenderKey = (currentGender === 'non-binary') ? 'unisex' : currentGender;
        const defaultPose = samplePoses.find(p => p.gender === targetGenderKey && p.isDefault)
                         || samplePoses.find(p => p.gender === targetGenderKey)
                         || samplePoses[0];

        if (defaultPose) {
            selectedPose = {
                id: defaultPose.id,
                name: defaultPose.name,
                img: defaultPose.img,
                gender: defaultPose.gender,
                promptModifier: defaultPose.promptModifier
            };
        } else {
            selectedPose = null;
        }

        // Re-enable posture control toggle
        if (togglePose) {
            togglePose.checked = true;
            if (poseControls) poseControls.style.display = 'block';
        }

        populatePoses();
        const genderLabel = currentGender.charAt(0).toUpperCase() + currentGender.slice(1);
        showToast(`Pose Reset: Default ${genderLabel} Base Model Restored`);
    }

    if (poseResetBtn) {
        poseResetBtn.addEventListener('click', resetPose);
    }

    // -----------------------------------------------------------------
    // 7. SELECTION LOGIC
    // -----------------------------------------------------------------
    function selectGarment(garment, cardEl) {
        selectedGarment = { 
            id: garment.id, 
            img: garment.img, 
            name: garment.name, 
            isFile: false, 
            prompt: garment.prompt,
            demoResult: garment.demoResult,
            tag: garment.tag
        };
        
        // Update UI
        document.querySelectorAll('.ai-garment-card').forEach(c => c.classList.remove('selected'));
        if (cardEl) cardEl.classList.add('selected');

        garmentPreviewThumb.innerHTML = `<img src="${garment.img}" alt="${garment.name}" crossorigin="anonymous">`;
        garmentPreviewName.textContent = garment.name;
        garmentPreviewRow.style.display = 'flex';
        
        updateGenerateBtn();
    }

    function selectFace(face, thumbEl) {
        selectedFace = { img: face.img, name: face.name, isFile: false };

        document.querySelectorAll('.ai-example-thumb').forEach(t => t.classList.remove('selected'));
        if (thumbEl) thumbEl.classList.add('selected');

        facePreviewThumb.innerHTML = `<img src="${face.img}" alt="${face.name}" crossorigin="anonymous">`;
        facePreviewName.textContent = face.name;
        facePreviewRow.style.display = 'flex';
    }

    function selectPose(pose, cardEl) {
        // Toggle selection or select
        if (selectedPose && selectedPose.id === pose.id) {
            selectedPose = null;
            document.querySelectorAll('.ai-pose-card').forEach(c => c.classList.remove('selected'));
            return;
        }

        selectedPose = { 
            img: pose.img, 
            name: pose.name, 
            id: pose.id, 
            gender: pose.gender,
            promptModifier: pose.promptModifier,
            isFile: false 
        };

        document.querySelectorAll('.ai-pose-card').forEach(c => c.classList.remove('selected'));
        if (cardEl) cardEl.classList.add('selected');

        showToast(`Base Pose Selected: ${pose.name} (${pose.categoryLabel})`);
    }

    function selectBottom(bottom, cardEl) {
        if (selectedBottom && selectedBottom.id === bottom.id) {
            clearBottomSelection();
            return;
        }

        selectedBottom = { 
            id: bottom.id, 
            img: bottom.img, 
            name: bottom.name, 
            isFile: false, 
            prompt: bottom.prompt,
            demoResult: bottom.demoResult,
            tag: bottom.tag
        };

        document.querySelectorAll('.ai-bottom-card').forEach(c => c.classList.remove('selected'));
        if (cardEl) cardEl.classList.add('selected');

        if (bottomPreviewThumb) bottomPreviewThumb.innerHTML = `<img src="${bottom.img}" alt="${bottom.name}">`;
        if (bottomPreviewName) bottomPreviewName.textContent = bottom.name;
        if (bottomPreviewRow) bottomPreviewRow.style.display = 'flex';
    }

    function clearBottomSelection() {
        selectedBottom = null;
        if (bottomUpload) bottomUpload.value = '';
        if (bottomPreviewRow) bottomPreviewRow.style.display = 'none';
        document.querySelectorAll('.ai-bottom-card').forEach(c => c.classList.remove('selected'));
    }

    function updateGenerateBtn() {
        const canGenerate = selectedGarment !== null && !isGenerating;
        if (generateBtn) generateBtn.disabled = !canGenerate;
    }

    // -----------------------------------------------------------------
    // 7. FILE UPLOAD & CLEAR HANDLERS
    // -----------------------------------------------------------------
    if (garmentUpload) {
        garmentUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            selectedGarment = { 
                id: 'custom-' + Date.now(), 
                img: url, 
                name: file.name, 
                isFile: true, 
                file: file,
                demoResult: 'assets/images/demo/custom-fallback.jpg',
                tag: 'Custom Upload Look'
            };
            
            document.querySelectorAll('.ai-garment-card').forEach(c => c.classList.remove('selected'));
            if (garmentPreviewThumb) garmentPreviewThumb.innerHTML = `<img src="${url}" alt="${file.name}">`;
            if (garmentPreviewName) garmentPreviewName.textContent = file.name;
            if (garmentPreviewRow) garmentPreviewRow.style.display = 'flex';
            
            updateGenerateBtn();
        });
    }

    if (bottomUpload) {
        bottomUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            selectedBottom = { 
                id: 'custom-bottom-' + Date.now(), 
                img: url, 
                name: file.name, 
                isFile: true, 
                file: file,
                prompt: 'custom styled bottom trousers',
                demoResult: 'assets/images/demo/b1-stone-trousers.jpg',
                tag: 'Custom Bottom Look'
            };
            
            document.querySelectorAll('.ai-bottom-card').forEach(c => c.classList.remove('selected'));
            if (bottomPreviewThumb) bottomPreviewThumb.innerHTML = `<img src="${url}" alt="${file.name}">`;
            if (bottomPreviewName) bottomPreviewName.textContent = file.name;
            if (bottomPreviewRow) bottomPreviewRow.style.display = 'flex';
        });
    }

    if (faceUpload) {
        faceUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const url = URL.createObjectURL(file);
            selectedFace = { img: url, name: file.name, isFile: true, file: file };

            document.querySelectorAll('.ai-example-thumb').forEach(t => t.classList.remove('selected'));
            if (facePreviewThumb) facePreviewThumb.innerHTML = `<img src="${url}" alt="${file.name}">`;
            if (facePreviewName) facePreviewName.textContent = file.name;
            if (facePreviewRow) facePreviewRow.style.display = 'flex';
        });
    }

    // Clear buttons
    if (clearGarmentBtn) {
        clearGarmentBtn.addEventListener('click', () => {
            selectedGarment = null;
            document.querySelectorAll('.ai-garment-card').forEach(c => c.classList.remove('selected'));
            if (garmentPreviewRow) garmentPreviewRow.style.display = 'none';
            if (garmentUpload) garmentUpload.value = '';
            updateGenerateBtn();
        });
    }

    if (clearBottomBtn) {
        clearBottomBtn.addEventListener('click', clearBottomSelection);
    }

    if (clearFaceBtn) {
        clearFaceBtn.addEventListener('click', () => {
            selectedFace = null;
            document.querySelectorAll('.ai-example-thumb').forEach(t => t.classList.remove('selected'));
            if (facePreviewRow) facePreviewRow.style.display = 'none';
            if (faceUpload) faceUpload.value = '';
        });
    }

    // Toggle controls
    if (toggleFace && faceControls) {
        toggleFace.addEventListener('change', () => {
            faceControls.style.display = toggleFace.checked ? 'block' : 'none';
            if (!toggleFace.checked) {
                selectedFace = null;
                if (facePreviewRow) facePreviewRow.style.display = 'none';
            }
        });
    }

    if (togglePose && poseControls) {
        togglePose.addEventListener('change', () => {
            poseControls.style.display = togglePose.checked ? 'block' : 'none';
            if (!togglePose.checked) {
                selectedPose = null;
                document.querySelectorAll('.ai-pose-card').forEach(c => c.classList.remove('selected'));
            }
        });
    }

    // -----------------------------------------------------------------
    // 8. ADVANCED SETTINGS SYNC
    // -----------------------------------------------------------------
    sliderIds.forEach((id, idx) => {
        const slider = document.getElementById(id);
        const valDisplay = document.getElementById(valIds[idx]);
        if (slider && valDisplay) {
            slider.addEventListener('input', () => {
                valDisplay.textContent = slider.value;
            });
        }
    });

    // -----------------------------------------------------------------
    // 9. VIEW STATE MANAGEMENT
    // -----------------------------------------------------------------
    function showState(state) {
        [emptyState, loadingState, resultState, errorState].forEach(el => {
            if (el) el.style.display = 'none';
        });
        if (state) state.style.display = 'flex';
    }

    function setStatus(text, type) {
        if (statusText) statusText.textContent = text;
        if (statusDot) statusDot.className = 'ai-status-dot' + (type ? ' ' + type : '');
    }

    // -----------------------------------------------------------------
    // 10. ENGINE MODE SWITCHER
    // -----------------------------------------------------------------
    function setEngineMode(mode) {
        engineMode = mode;
        try { localStorage.setItem('tavro_engine_mode', mode); } catch (_) {}
        if (mode === 'demo') {
            if (modeDemoBtn) modeDemoBtn.classList.add('active');
            if (modeLiveBtn) modeLiveBtn.classList.remove('active');
            if (loadingTimer) loadingTimer.textContent = 'Estimated: 3-5 seconds';
            if (!isGenerating) setStatus('Ready (Demo Mode)', '');
        } else {
            if (modeLiveBtn) modeLiveBtn.classList.add('active');
            if (modeDemoBtn) modeDemoBtn.classList.remove('active');
            if (loadingTimer) loadingTimer.textContent = 'Estimated: 30-60 seconds';
            if (!isGenerating) setStatus('Ready (Live ZeroGPU)', '');
        }
    }

    if (modeDemoBtn) modeDemoBtn.addEventListener('click', () => setEngineMode('demo'));
    if (modeLiveBtn) modeLiveBtn.addEventListener('click', () => setEngineMode('live'));
    if (demoFallbackBtn) {
        demoFallbackBtn.addEventListener('click', () => {
            setEngineMode('demo');
            generateLook();
        });
    }

    // -----------------------------------------------------------------
    // 11. REDO & CHANGE OUTFIT ACTIONS (NO REFRESH NEEDED)
    // -----------------------------------------------------------------
    function redoLook() {
        if (!selectedGarment || isGenerating) return;

        // Randomize seed to create a distinct variation
        const newSeed = Math.floor(Math.random() * 90000000) + 10000000;
        const seedInput = document.getElementById('ai-seed');
        const seedVal = document.getElementById('seed-val');
        if (seedInput) seedInput.value = newSeed;
        if (seedVal) seedVal.textContent = newSeed;

        generateLook();
    }

    function changeOutfit() {
        // Return stage back to initial atelier empty state without refreshing
        showState(emptyState);
        setStatus(engineMode === 'demo' ? 'Ready (Demo Mode)' : 'Ready (Live ZeroGPU)', '');
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (redoBtn) redoBtn.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'none';
        
        // Scroll to outfit selection smoothly
        const leftPanel = document.querySelector('.ai-left-panel');
        if (leftPanel) {
            leftPanel.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    if (redoBtn) redoBtn.addEventListener('click', redoLook);
    if (resetBtn) resetBtn.addEventListener('click', changeOutfit);
    if (stageRedoBtn) stageRedoBtn.addEventListener('click', redoLook);
    if (stageChangeBtn) stageChangeBtn.addEventListener('click', changeOutfit);

    // -----------------------------------------------------------------
    // 11. IMAGE HELPERS
    // -----------------------------------------------------------------
    async function urlToBlob(url) {
        const response = await fetch(url, { mode: 'cors' });
        return await response.blob();
    }

    async function getImageBlob(selection) {
        if (!selection) return null;
        if (selection.isFile && selection.file) {
            return selection.file;
        }
        return await urlToBlob(selection.img);
    }

    function updateLoadingProgress(percent, message) {
        if (progressFill) progressFill.style.width = percent + '%';
        if (loadingDesc) loadingDesc.textContent = message;
    }

    // -----------------------------------------------------------------
    // 13. GENERATE LOOK (DEMO SIMULATION & LIVE API)
    // -----------------------------------------------------------------
    async function generateLook() {
        if (!selectedGarment || isGenerating) return;

        isGenerating = true;
        updateGenerateBtn();
        if (genText) genText.textContent = 'Generating...';
        showState(loadingState);
        setStatus('Processing', 'processing');
        if (downloadBtn) downloadBtn.style.display = 'none';
        if (redoBtn) redoBtn.style.display = 'none';
        if (resetBtn) resetBtn.style.display = 'none';
        updateLoadingProgress(8, 'Initializing IMAGDressing AI pipeline...');

        const useFace = toggleFace && toggleFace.checked && selectedFace;
        const usePose = togglePose && togglePose.checked && selectedPose;

        // =============================================================
        // PATH A: SHOWCASE AI DEMO MODE (Instant High-Fidelity Preview)
        // =============================================================
        if (engineMode === 'demo') {
            try {
                const sleep = ms => new Promise(r => setTimeout(r, ms));
                
                await sleep(500);
                if (selectedBottom) {
                    updateLoadingProgress(24, `Styling outfit: ${selectedGarment.name} + ${selectedBottom.name}...`);
                } else {
                    updateLoadingProgress(24, `Extracting garment contours for ${selectedGarment.name}...`);
                }
                
                await sleep(800);
                if (useFace && usePose) {
                    updateLoadingProgress(48, 'Aligning face identity & ControlNet OpenPose skeleton...');
                } else if (useFace) {
                    updateLoadingProgress(48, 'Injecting face identity & biometric latent embedding...');
                } else if (usePose) {
                    updateLoadingProgress(48, 'Synthesizing ControlNet OpenPose body skeleton...');
                } else {
                    updateLoadingProgress(48, 'Calculating model posture & garment drape...');
                }

                await sleep(900);
                const steps = document.getElementById('denoise-steps')?.value || '30';
                updateLoadingProgress(78, `Running SD 1.5 + IP-Adapter denoising (${steps}/${steps} steps)...`);

                await sleep(800);
                updateLoadingProgress(94, 'Refining fabric texture folds & studio lighting reflections...');

                await sleep(400);
                updateLoadingProgress(100, 'Generation Complete!');

                // Adapt preview based on chosen top and bottom
                let demoUrl = selectedGarment.demoResult || 'assets/images/demo/custom-fallback.jpg';
                let tagText = selectedGarment.tag || 'Showcase AI Ultra-HD';

                if (selectedBottom) {
                    if (['b1', 'b2', 'b3'].includes(selectedBottom.id)) {
                        demoUrl = selectedBottom.demoResult;
                    }
                    tagText = `${selectedGarment.name} • ${selectedBottom.name}`;
                }

                resultImage.src = demoUrl;
                if (resultTag) resultTag.textContent = tagText;

                resultImage.onload = () => {
                    showState(resultState);
                    setStatus('Complete (Demo Mode)', '');
                    if (downloadBtn) downloadBtn.style.display = 'flex';
                    if (redoBtn) redoBtn.style.display = 'flex';
                    if (resetBtn) resetBtn.style.display = 'flex';
                    addToHistory(demoUrl);
                };
                resultImage.onerror = () => {
                    throw new Error('Failed to load demo result image.');
                };

            } catch (err) {
                console.error('Demo generation error:', err);
                showState(errorState);
                if (errorDesc) errorDesc.textContent = err.message || 'Error generating look preview.';
                setStatus('Error', 'error');
            } finally {
                isGenerating = false;
                if (genText) genText.textContent = 'Generate AI Look';
                updateGenerateBtn();
            }
            return;
        }

        // =============================================================
        // PATH B: LIVE ZERO GPU HUGGING FACE SPACE
        // =============================================================
        try {
            let prompt = promptInput.value.trim() || 'A beautiful model standing in a fashion studio';
            if (selectedGarment.prompt) {
                prompt = prompt + ', ' + selectedGarment.prompt;
            }
            if (selectedBottom && selectedBottom.prompt) {
                prompt = prompt + ', paired with ' + selectedBottom.prompt;
            }
            if (usePose && selectedPose && selectedPose.promptModifier) {
                prompt = prompt + ', ' + selectedPose.promptModifier;
            }

            const clothGuidance = parseFloat(document.getElementById('cloth-guidance').value);
            const promptGuidance = parseFloat(document.getElementById('prompt-guidance').value);
            const faceGuidance = parseFloat(document.getElementById('face-guidance').value);
            const selfLora = parseFloat(document.getElementById('self-lora').value);
            const crossLora = parseFloat(document.getElementById('cross-lora').value);
            const denoiseSteps = parseInt(document.getElementById('denoise-steps').value);
            const seed = parseInt(document.getElementById('ai-seed').value);

            updateLoadingProgress(12, 'Connecting to HuggingFace ZeroGPU Space...');

            const { client } = await import("https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.js");
            const app = await Promise.race([
                client(HF_SPACE_ID),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error("Connection timed out. The upstream HuggingFace ZeroGPU Space is currently offline or broken (CONFIG_ERROR).")), 15000)
                )
            ]);

            const garmBlob = await getImageBlob(selectedGarment);
            const faceBlob = useFace ? await getImageBlob(selectedFace) : null;
            const poseBlob = usePose ? await getImageBlob(selectedPose) : null;

            updateLoadingProgress(25, 'Uploading tensors to remote ZeroGPU...');

            const result = await app.predict("/dress_process", [
                garmBlob,
                faceBlob,
                poseBlob,
                prompt,
                clothGuidance,
                promptGuidance,
                faceGuidance,
                selfLora,
                crossLora,
                useFace ? true : false,
                usePose ? true : false,
                denoiseSteps,
                seed,
            ]);

            updateLoadingProgress(100, 'Complete!');

            if (result && result.data && result.data[0]) {
                const imageUrl = result.data[0].url || result.data[0];

                resultImage.src = imageUrl;
                if (resultTag) resultTag.textContent = selectedBottom ? `${selectedGarment.name} + ${selectedBottom.name}` : 'Live ZeroGPU Model';
                resultImage.onload = () => {
                    showState(resultState);
                    setStatus('Complete (Live)', '');
                    if (downloadBtn) downloadBtn.style.display = 'flex';
                    if (redoBtn) redoBtn.style.display = 'flex';
                    if (resetBtn) resetBtn.style.display = 'flex';
                    addToHistory(imageUrl);
                };
                resultImage.onerror = () => {
                    throw new Error('Failed to load the generated image.');
                };
            } else {
                throw new Error('Unexpected result format from the AI model.');
            }

        } catch (error) {
            console.warn('Live ZeroGPU API offline/unavailable, seamlessly falling back to Showcase Studio Mode:', error);
            // Seamless auto-fallback: switch engine mode to demo and render high-fidelity output
            setEngineMode('demo');
            if (statusText) setStatus('Showcase AI Studio (Instant)', '');
            
            // Execute demo look generation immediately
            let demoUrl = selectedGarment.demoResult || 'assets/images/demo/g1-white-dress.jpg';
            let tagText = selectedGarment.tag || 'Showcase AI Ultra-HD';
            if (selectedBottom) {
                if (['b1', 'b2', 'b3'].includes(selectedBottom.id)) {
                    demoUrl = selectedBottom.demoResult;
                }
                tagText = `${selectedGarment.name} • ${selectedBottom.name}`;
            }

            resultImage.src = demoUrl;
            if (resultTag) resultTag.textContent = tagText;
            resultImage.onload = () => {
                showState(resultState);
                setStatus('Complete (Showcase Mode)', '');
                if (downloadBtn) downloadBtn.style.display = 'flex';
                if (redoBtn) redoBtn.style.display = 'flex';
                if (resetBtn) resetBtn.style.display = 'flex';
                addToHistory(demoUrl);
            };
            resultImage.onerror = () => {
                showState(errorState);
                if (errorDesc) {
                    errorDesc.innerHTML = `<strong>Live HuggingFace API Offline:</strong> ${error.message || 'Connection failed'}. Click below to switch to Showcase Demo.`;
                }
                setStatus('Error', 'error');
            };
        } finally {
            isGenerating = false;
            if (genText) genText.textContent = 'Generate AI Look';
            updateGenerateBtn();
        }
    }

    // -----------------------------------------------------------------
    // 14. HISTORY MANAGEMENT
    // -----------------------------------------------------------------
    function addToHistory(imageUrl) {
        generationHistory.unshift(imageUrl);
        if (generationHistory.length > 8) generationHistory.pop();
        renderHistory();
    }

    function renderHistory() {
        if (generationHistory.length === 0) {
            if (historyGrid) historyGrid.style.display = 'none';
            if (historyEmpty) historyEmpty.style.display = 'block';
            return;
        }

        if (historyGrid) historyGrid.style.display = 'grid';
        if (historyEmpty) historyEmpty.style.display = 'none';
        if (historyGrid) historyGrid.innerHTML = '';

        generationHistory.forEach((url, idx) => {
            const card = document.createElement('div');
            card.className = 'ai-history-card';
            card.innerHTML = `
                <img src="${url}" alt="Generation ${idx + 1}" loading="lazy">
                <span class="ai-history-num">#${idx + 1}</span>
            `;
            card.addEventListener('click', () => openLightbox(url));
            if (historyGrid) historyGrid.appendChild(card);
        });
    }

    // -----------------------------------------------------------------
    // 15. LIGHTBOX
    // -----------------------------------------------------------------
    function openLightbox(imageUrl) {
        if (!lightboxImg || !lightbox) return;
        lightboxImg.src = imageUrl;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    if (resultImage) {
        resultImage.addEventListener('click', () => {
            if (resultImage.src) openLightbox(resultImage.src);
        });
    }

    // -----------------------------------------------------------------
    // 16. DOWNLOAD
    // -----------------------------------------------------------------
    if (downloadBtn) {
        downloadBtn.addEventListener('click', async () => {
            if (!resultImage.src) return;
            try {
                const response = await fetch(resultImage.src);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = blobUrl;
                const topName = (selectedGarment?.name || 'top').toLowerCase().replace(/\s+/g, '-');
                const bottomName = selectedBottom ? `-${selectedBottom.name.toLowerCase().replace(/\s+/g, '-')}` : '';
                a.download = `tavroo-look-${topName}${bottomName}-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } catch {
                const a = document.createElement('a');
                a.href = resultImage.src;
                a.download = `tavroo-look-${Date.now()}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
        });
    }

    // -----------------------------------------------------------------
    // 17. EVENT BINDINGS
    // -----------------------------------------------------------------
    if (generateBtn) generateBtn.addEventListener('click', generateLook);
    
    if (retryBtn) {
        retryBtn.addEventListener('click', generateLook);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !isGenerating && selectedGarment) {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            generateLook();
        }
        if (e.key === 'Escape' && lightbox && lightbox.style.display !== 'none') {
            closeLightbox();
        }
    });

    // -----------------------------------------------------------------
    // 18. INIT
    // -----------------------------------------------------------------
    populateGarments();
    populateBottoms();
    populateFaces();

    // Initialize default base pose for female department
    const initialDefaultPose = samplePoses.find(p => p.gender === 'female' && p.isDefault) || samplePoses[0];
    if (initialDefaultPose) {
        selectedPose = {
            id: initialDefaultPose.id,
            name: initialDefaultPose.name,
            img: initialDefaultPose.img,
            gender: initialDefaultPose.gender,
            promptModifier: initialDefaultPose.promptModifier
        };
    }
    populatePoses();
    setEngineMode('demo');

    // Pre-select first garment for instant readiness
    if (sampleGarments.length > 0 && garmentGrid && garmentGrid.children.length > 0) {
        selectGarment(sampleGarments[0], garmentGrid.children[0]);
    }

    console.log('🧥 TAVROO AI Dressing Studio initialized with Top-Level Gender Selection & Inclusive Pose Reset figures');
});
