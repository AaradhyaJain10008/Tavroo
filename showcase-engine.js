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
        { id: 'g1', name: 'White Dress', img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597315917349_in_post.png`, prompt: 'wearing a white dress' },
        { id: 'g2', name: 'Black Top', img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325621176_in_post.png`, prompt: 'wearing a black top' },
        { id: 'g3', name: 'Green Skirt', img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597325684024_in_post.png`, prompt: 'wearing a green skirt' },
        { id: 'g4', name: 'Patterned Blouse', img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326026201_in_post.png`, prompt: 'wearing a patterned blouse' },
        { id: 'g5', name: 'Red Suit', img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597326873307_in_post.png`, prompt: 'wearing a red suit' },
        { id: 'g6', name: 'Blue Denim', img: `${EXAMPLE_BASE}/example/cloth/NAP_1647597335012288_in_post.png`, prompt: 'wearing a denim piece' },
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

    // Output stage states
    const emptyState = document.getElementById('ai-empty-state');
    const loadingState = document.getElementById('ai-loading-state');
    const resultState = document.getElementById('ai-result-state');
    const errorState = document.getElementById('ai-error-state');
    const resultImage = document.getElementById('ai-result-image');
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
    let selectedGarment = null;   // { img: url/blob, name: str, isFile: bool, file: File? }
    let selectedFace = null;      // { img: url/blob, name: str, isFile: bool, file: File? }
    let selectedPose = null;      // { img: url, name: str, isFile: bool, file: File? }
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
        selectedGarment = { img: garment.img, name: garment.name, isFile: false, prompt: garment.prompt };
        
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
        selectedGarment = { img: url, name: file.name, isFile: true, file: file };
        
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
        statusText.textContent = text;
        statusDot.className = 'ai-status-dot' + (type ? ' ' + type : '');
    }

    // -----------------------------------------------------------------
    // 10. IMAGE CONVERSION HELPERS
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

    // -----------------------------------------------------------------
    // 11. GRADIO API — Call HuggingFace Space
    // -----------------------------------------------------------------
    function updateLoadingProgress(percent, message) {
        if (progressFill) progressFill.style.width = percent + '%';
        if (loadingDesc) loadingDesc.textContent = message;
    }

    async function generateLook() {
        if (!selectedGarment || isGenerating) return;

        isGenerating = true;
        updateGenerateBtn();
        genText.textContent = 'Generating...';
        showState(loadingState);
        setStatus('Processing', 'processing');
        downloadBtn.style.display = 'none';
        updateLoadingProgress(5, 'Preparing images...');

        try {
            // Build prompt
            let prompt = promptInput.value.trim() || 'A beautiful model standing in a fashion studio';
            if (selectedGarment.prompt) {
                prompt = prompt + ', ' + selectedGarment.prompt;
            }

            // Get advanced settings
            const clothGuidance = parseFloat(document.getElementById('cloth-guidance').value);
            const promptGuidance = parseFloat(document.getElementById('prompt-guidance').value);
            const faceGuidance = parseFloat(document.getElementById('face-guidance').value);
            const selfLora = parseFloat(document.getElementById('self-lora').value);
            const crossLora = parseFloat(document.getElementById('cross-lora').value);
            const denoiseSteps = parseInt(document.getElementById('denoise-steps').value);
            const seed = parseInt(document.getElementById('ai-seed').value);

            const useFace = toggleFace.checked && selectedFace;
            const usePose = togglePose.checked && selectedPose;

            updateLoadingProgress(10, 'Connecting to IMAGDressing AI...');

            // Connect to Gradio Space
            const app = await client(HF_SPACE_ID);

            // Get image blobs
            const garmBlob = await getImageBlob(selectedGarment);
            const faceBlob = useFace ? await getImageBlob(selectedFace) : null;
            const poseBlob = usePose ? await getImageBlob(selectedPose) : null;

            updateLoadingProgress(20, 'Sending data to GPU...');

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
            
            console.log("Result:", result);

            if (result && result.data && result.data[0]) {
                const imageUrl = result.data[0].url || result.data[0];

                resultImage.src = imageUrl;
                resultImage.onload = () => {
                    showState(resultState);
                    setStatus('Complete', '');
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
            errorDesc.textContent = error.message || 'An unexpected error occurred.';
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
    downloadBtn.addEventListener('click', () => {
        if (!resultImage.src) return;
        const a = document.createElement('a');
        a.href = resultImage.src;
        a.download = `tavroo-ai-look-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
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
    updateGenerateBtn();

    console.log('🧥 TAVROO AI Dressing Studio initialized');
});
