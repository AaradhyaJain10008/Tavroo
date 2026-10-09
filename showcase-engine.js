// showcase-engine.js — TAVROO AI Virtual Dressing Studio Engine
// Integrates with IMAGDressing-v1 via HuggingFace Gradio Space API
// =================================================================

import { client } from "https://cdn.jsdelivr.net/npm/@gradio/client@0.1.4/dist/index.js";

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. CONFIGURATION & HF SPACE URL
    // -----------------------------------------------------------------
    const HF_SPACE_ID = 'feishen29/IMAGDressing-v1';
    
    // Example images from the IMAGDressing HF Space repo
    const EXAMPLE_BASE = 'https://huggingface.co/spaces/feishen29/IMAGDressing-v1/resolve/main';

    // -----------------------------------------------------------------
    // 2. SAMPLE DATA — Garments, Faces, Poses
    // -----------------------------------------------------------------
    const sampleGarments = [
        { 
            id: 'g1', 
            name: 'White Dress', 
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597315917349_in_post.png`, 
            prompt: 'wearing a luxury white floral embroidered designer dress',
            demoResult: 'assets/images/demo/g1-white-dress.jpg',
            tag: 'Haute Couture'
        },
        { 
            id: 'g2', 
            name: 'Black Top', 
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325621176_in_post.png`, 
            prompt: 'wearing a bohemian floral print peasant blouse top with billowy sleeves',
            demoResult: 'assets/images/demo/g2-black-top.jpg',
            tag: 'Boho Editorial'
        },
        { 
            id: 'g3', 
            name: 'Green Skirt', 
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325684024_in_post.png`, 
            prompt: 'wearing a navy and white striped breton long sleeve knit top',
            demoResult: 'assets/images/demo/g3-green-skirt.jpg',
            tag: 'Parisian Chic'
        },
        { 
            id: 'g4', 
            name: 'Patterned Blouse', 
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326026201_in_post.png`, 
            prompt: 'wearing a black ribbed long sleeve shirt, clean minimal studio portrait',
            demoResult: 'assets/images/demo/g4-patterned-blouse.jpg',
            tag: 'Monochrome Minimal'
        },
        { 
            id: 'g5', 
            name: 'Red Suit', 
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326873307_in_post.png`, 
            prompt: 'wearing an avant-garde black and white graphic pattern structured blazer suit',
            demoResult: 'assets/images/demo/g5-red-suit.jpg',
            tag: 'Avant-Garde Runway'
        },
        { 
            id: 'g6', 
            name: 'Blue Denim', 
            img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597335012288_in_post.png`, 
            prompt: 'wearing an oversized graphic designer white t-shirt and denim',
            demoResult: 'assets/images/demo/g6-blue-denim.jpg',
            tag: 'Urban Streetwear'
        },
    ];

    const sampleFaces = [
        { id: 'f1', img: `${EXAMPLE_BASE}/example/face/1.jpg`, name: 'Face 1' },
        { id: 'f2', img: `${EXAMPLE_BASE}/example/face/2.jpg`, name: 'Face 2' },
        { id: 'f3', img: `${EXAMPLE_BASE}/example/face/3333.jpg`, name: 'Face 3' }
    ];

    const samplePoses = [
        { id: 'p1', name: 'Pose 1', img: `${EXAMPLE_BASE}/example/pose/00034_00.jpg` },
        { id: 'p2', name: 'Pose 2', img: `${EXAMPLE_BASE}/example/pose/00121_00.jpg` },
        { id: 'p3', name: 'Pose 3', img: `${EXAMPLE_BASE}/example/pose/01992_00.jpg` }
    ];

    // -----------------------------------------------------------------
    // 3. DOM REFERENCES
    // -----------------------------------------------------------------
    const garmentGrid = document.getElementById('ai-garment-grid');
    const garmentUpload = document.getElementById('garment-upload');
    const garmentPreviewRow = document.getElementById('garment-preview-row');
    const garmentPreviewThumb = document.getElementById('garment-preview-thumb');
    const garmentPreviewName = document.getElementById('garment-preview-name');
    const clearGarmentBtn = document.getElementById('clear-garment');

    const toggleFace = document.getElementById('toggle-face');
    const faceControls = document.getElementById('face-controls');
    const faceUpload = document.getElementById('face-upload');
    const faceExamplesRow = document.getElementById('face-examples-row');
    const facePreviewRow = document.getElementById('face-preview-row');
    const facePreviewThumb = document.getElementById('face-preview-thumb');
    const facePreviewName = document.getElementById('face-preview-name');
    const clearFaceBtn = document.getElementById('clear-face');

    const togglePose = document.getElementById('toggle-pose');
    const poseControls = document.getElementById('pose-controls');
    const poseGrid = document.getElementById('ai-pose-grid');

    const promptInput = document.getElementById('ai-prompt');
    const generateBtn = document.getElementById('ai-generate-btn');
    const genText = document.getElementById('ai-gen-text');
    const downloadBtn = document.getElementById('ai-download-btn');

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
    let engineMode = 'demo';       // 'demo' | 'live'
    let selectedGarment = null;   // { id, img, name, isFile, file, prompt, demoResult, tag }
    let selectedFace = null;      // { id, img, name, isFile, file }
    let selectedPose = null;      // { id, img, name, isFile, file }
    let generationHistory = [];
    let isGenerating = false;

    // -----------------------------------------------------------------
    // 5. POPULATE UI GRIDS
    // -----------------------------------------------------------------
    function populateGarments() {
        garmentGrid.innerHTML = '';
        sampleGarments.forEach(g => {
            const card = document.createElement('div');
            card.className = 'ai-garment-card';
            card.dataset.id = g.id;
            card.innerHTML = `
                <img class="ai-garment-img" src="${g.img}" alt="${g.name}" loading="lazy" crossorigin="anonymous"
                     onerror="this.style.display='none'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center'; this.parentElement.innerHTML = '<span style=\\'font-size:2rem; opacity:0.4\\'>👕</span><span class=\\'ai-garment-label\\'>${g.name}</span>';">
                <span class="ai-garment-label">${g.name}</span>
            `;
            card.addEventListener('click', () => selectGarment(g, card));
            garmentGrid.appendChild(card);
        });
    }

    function populateFaces() {
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
        poseGrid.innerHTML = '';
        samplePoses.forEach(p => {
            const card = document.createElement('div');
            card.className = 'ai-pose-card';
            card.dataset.id = p.id;
            card.innerHTML = `
                <img class="ai-pose-img" src="${p.img}" alt="${p.name}" loading="lazy" crossorigin="anonymous"
                     onerror="this.style.display='none'; this.parentElement.style.display='flex'; this.parentElement.style.alignItems='center'; this.parentElement.style.justifyContent='center'; this.parentElement.innerHTML = '<span style=\\'font-size:2rem; opacity:0.4\\'>🧍</span><span class=\\'ai-pose-label\\'>${p.name}</span>';">
                <span class="ai-pose-label">${p.name}</span>
            `;
            card.addEventListener('click', () => selectPose(p, card));
            poseGrid.appendChild(card);
        });
    }

    // -----------------------------------------------------------------
    // 6. SELECTION LOGIC
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
        // Toggle selection
        if (selectedPose && selectedPose.id === pose.id) {
            selectedPose = null;
            document.querySelectorAll('.ai-pose-card').forEach(c => c.classList.remove('selected'));
            return;
        }

        selectedPose = { img: pose.img, name: pose.name, id: pose.id, isFile: false };
        document.querySelectorAll('.ai-pose-card').forEach(c => c.classList.remove('selected'));
        if (cardEl) cardEl.classList.add('selected');
    }

    function updateGenerateBtn() {
        const canGenerate = selectedGarment !== null && !isGenerating;
        generateBtn.disabled = !canGenerate;
    }

    // -----------------------------------------------------------------
    // 7. FILE UPLOAD HANDLERS
    // -----------------------------------------------------------------
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
        garmentPreviewThumb.innerHTML = `<img src="${url}" alt="${file.name}">`;
        garmentPreviewName.textContent = file.name;
        garmentPreviewRow.style.display = 'flex';
        
        updateGenerateBtn();
    });

    faceUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        selectedFace = { img: url, name: file.name, isFile: true, file: file };

        document.querySelectorAll('.ai-example-thumb').forEach(t => t.classList.remove('selected'));
        facePreviewThumb.innerHTML = `<img src="${url}" alt="${file.name}">`;
        facePreviewName.textContent = file.name;
        facePreviewRow.style.display = 'flex';
    });

    // Clear buttons
    clearGarmentBtn.addEventListener('click', () => {
        selectedGarment = null;
        document.querySelectorAll('.ai-garment-card').forEach(c => c.classList.remove('selected'));
        garmentPreviewRow.style.display = 'none';
        garmentUpload.value = '';
        updateGenerateBtn();
    });

    clearFaceBtn.addEventListener('click', () => {
        selectedFace = null;
        document.querySelectorAll('.ai-example-thumb').forEach(t => t.classList.remove('selected'));
        facePreviewRow.style.display = 'none';
        faceUpload.value = '';
    });

    // Toggle controls
    toggleFace.addEventListener('change', () => {
        faceControls.style.display = toggleFace.checked ? 'block' : 'none';
        if (!toggleFace.checked) {
            selectedFace = null;
            facePreviewRow.style.display = 'none';
        }
    });

    togglePose.addEventListener('change', () => {
        poseControls.style.display = togglePose.checked ? 'block' : 'none';
        if (!togglePose.checked) {
            selectedPose = null;
            document.querySelectorAll('.ai-pose-card').forEach(c => c.classList.remove('selected'));
        }
    });

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
    // 12. GENERATE LOOK (DEMO SIMULATION & LIVE API)
    // -----------------------------------------------------------------
    async function generateLook() {
        if (!selectedGarment || isGenerating) return;

        isGenerating = true;
        updateGenerateBtn();
        genText.textContent = 'Generating...';
        showState(loadingState);
        setStatus('Processing', 'processing');
        downloadBtn.style.display = 'none';
        updateLoadingProgress(8, 'Initializing IMAGDressing AI pipeline...');

        const useFace = toggleFace.checked && selectedFace;
        const usePose = togglePose.checked && selectedPose;

        // =============================================================
        // PATH A: SHOWCASE AI DEMO MODE (Instant High-Fidelity Preview)
        // =============================================================
        if (engineMode === 'demo') {
            try {
                const sleep = ms => new Promise(r => setTimeout(r, ms));
                
                await sleep(600);
                updateLoadingProgress(22, 'Extracting garment geometry & cloth mask...');
                
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

                await sleep(1000);
                const steps = document.getElementById('denoise-steps')?.value || '30';
                updateLoadingProgress(78, `Running SD 1.5 + IP-Adapter denoising (${steps}/${steps} steps)...`);

                await sleep(900);
                updateLoadingProgress(94, 'Refining fabric texture folds & studio lighting reflections...');

                await sleep(500);
                updateLoadingProgress(100, 'Generation Complete!');

                const demoUrl = selectedGarment.demoResult || 'assets/images/demo/custom-fallback.jpg';
                const tagText = selectedGarment.tag || 'Showcase AI Ultra-HD';

                resultImage.src = demoUrl;
                if (resultTag) resultTag.textContent = tagText;

                resultImage.onload = () => {
                    showState(resultState);
                    setStatus('Complete (Demo Mode)', '');
                    downloadBtn.style.display = 'flex';
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
                genText.textContent = 'Generate AI Look';
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

            const clothGuidance = parseFloat(document.getElementById('cloth-guidance').value);
            const promptGuidance = parseFloat(document.getElementById('prompt-guidance').value);
            const faceGuidance = parseFloat(document.getElementById('face-guidance').value);
            const selfLora = parseFloat(document.getElementById('self-lora').value);
            const crossLora = parseFloat(document.getElementById('cross-lora').value);
            const denoiseSteps = parseInt(document.getElementById('denoise-steps').value);
            const seed = parseInt(document.getElementById('ai-seed').value);

            updateLoadingProgress(12, 'Connecting to HuggingFace ZeroGPU Space...');

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
                if (resultTag) resultTag.textContent = 'Live ZeroGPU Model';
                resultImage.onload = () => {
                    showState(resultState);
                    setStatus('Complete (Live)', '');
                    downloadBtn.style.display = 'flex';
                    addToHistory(imageUrl);
                };
                resultImage.onerror = () => {
                    throw new Error('Failed to load the generated image.');
                };
            } else {
                throw new Error('Unexpected result format from the AI model.');
            }

        } catch (error) {
            console.error('Generation failed:', error);
            showState(errorState);
            if (errorDesc) {
                errorDesc.innerHTML = `<strong>Live HuggingFace API Offline:</strong> ${error.message || 'Connection failed'}. Click below to view instant photorealistic virtual dressing in Showcase AI Demo mode.`;
            }
            setStatus('Error', 'error');
        } finally {
            isGenerating = false;
            genText.textContent = 'Generate AI Look';
            updateGenerateBtn();
        }
    }

    // -----------------------------------------------------------------
    // 13. HISTORY MANAGEMENT
    // -----------------------------------------------------------------
    function addToHistory(imageUrl) {
        generationHistory.unshift(imageUrl);
        if (generationHistory.length > 8) generationHistory.pop();
        renderHistory();
    }

    function renderHistory() {
        if (generationHistory.length === 0) {
            historyGrid.style.display = 'none';
            historyEmpty.style.display = 'block';
            return;
        }

        historyGrid.style.display = 'grid';
        historyEmpty.style.display = 'none';
        historyGrid.innerHTML = '';

        generationHistory.forEach((url, idx) => {
            const card = document.createElement('div');
            card.className = 'ai-history-card';
            card.innerHTML = `
                <img src="${url}" alt="Generation ${idx + 1}" loading="lazy">
                <span class="ai-history-num">#${idx + 1}</span>
            `;
            card.addEventListener('click', () => openLightbox(url));
            historyGrid.appendChild(card);
        });
    }

    // -----------------------------------------------------------------
    // 14. LIGHTBOX
    // -----------------------------------------------------------------
    function openLightbox(imageUrl) {
        lightboxImg.src = imageUrl;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
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
    // 15. DOWNLOAD
    // -----------------------------------------------------------------
    downloadBtn.addEventListener('click', async () => {
        if (!resultImage.src) return;
        try {
            const response = await fetch(resultImage.src);
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            const garmentName = (selectedGarment?.name || 'outfit').toLowerCase().replace(/\s+/g, '-');
            a.download = `tavroo-ai-look-${garmentName}-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        } catch {
            const a = document.createElement('a');
            a.href = resultImage.src;
            a.download = `tavroo-ai-look-${Date.now()}.jpg`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    // -----------------------------------------------------------------
    // 16. EVENT BINDINGS
    // -----------------------------------------------------------------
    generateBtn.addEventListener('click', generateLook);
    
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
        if (e.key === 'Escape' && lightbox.style.display !== 'none') {
            closeLightbox();
        }
    });

    // -----------------------------------------------------------------
    // 17. INIT
    // -----------------------------------------------------------------
    populateGarments();
    populateFaces();
    populatePoses();
    setEngineMode('demo');

    // Pre-select first garment for instant readiness
    if (sampleGarments.length > 0 && garmentGrid.children.length > 0) {
        selectGarment(sampleGarments[0], garmentGrid.children[0]);
    }

    console.log('🧥 TAVROO AI Dressing Studio initialized with Demo Simulation Mode');
});
