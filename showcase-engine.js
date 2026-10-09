// showcase-engine.js — TAVROO AI Virtual Dressing Studio Engine
// Integrates with IMAGDressing-v1 via HuggingFace Gradio Space API
// =================================================================

document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. CONFIGURATION & HF SPACE URL
    // -----------------------------------------------------------------
    const HF_SPACE_URL = 'https://feishen29-imagdressing-v1.hf.space';
    const HF_API_ENDPOINT = HF_SPACE_URL + '/api/predict';
    const HF_QUEUE_JOIN = HF_SPACE_URL + '/queue/join';
    const HF_QUEUE_DATA = HF_SPACE_URL + '/queue/data';
    const HF_UPLOAD = HF_SPACE_URL + '/upload';

    // Example images from the IMAGDressing HF Space repo
    const EXAMPLE_BASE = 'https://huggingface.co/spaces/feishen29/IMAGDressing-v1/resolve/main/example';

    // -----------------------------------------------------------------
    // 2. SAMPLE DATA — Garments, Faces, Poses
    // -----------------------------------------------------------------
    const sampleGarments = [
        { id: 'g1', name: 'Blue Jacket', img: `${EXAMPLE_BASE}/cloth/00035_00.jpg`, prompt: 'wearing a blue jacket' },
        { id: 'g2', name: 'Striped Shirt', img: `${EXAMPLE_BASE}/cloth/00055_00.jpg`, prompt: 'wearing a striped shirt' },
        { id: 'g3', name: 'Red Dress', img: `${EXAMPLE_BASE}/cloth/00069_00.jpg`, prompt: 'wearing a red dress' },
        { id: 'g4', name: 'Black T-shirt', img: `${EXAMPLE_BASE}/cloth/00126_00.jpg`, prompt: 'wearing a black t-shirt' },
        { id: 'g5', name: 'Floral Top', img: `${EXAMPLE_BASE}/cloth/03615_00.jpg`, prompt: 'wearing a floral top' },
        { id: 'g6', name: 'Denim Jacket', img: `${EXAMPLE_BASE}/cloth/03780_00.jpg`, prompt: 'wearing a denim jacket' },
    ];

    const sampleFaces = [
        { id: 'f1', img: `${EXAMPLE_BASE}/face/01.png`, name: 'Face 1' },
        { id: 'f2', img: `${EXAMPLE_BASE}/face/03.png`, name: 'Face 2' },
        { id: 'f3', img: `${EXAMPLE_BASE}/face/06.png`, name: 'Face 3' },
        { id: 'f4', img: `${EXAMPLE_BASE}/face/10.png`, name: 'Face 4' },
    ];

    const samplePoses = [
        { id: 'p1', name: 'Standing', img: `${EXAMPLE_BASE}/pose/01.png` },
        { id: 'p2', name: 'Walking', img: `${EXAMPLE_BASE}/pose/02.png` },
        { id: 'p3', name: 'Casual', img: `${EXAMPLE_BASE}/pose/04.png` },
        { id: 'p4', name: 'Side View', img: `${EXAMPLE_BASE}/pose/05.png` },
        { id: 'p5', name: 'Sitting', img: `${EXAMPLE_BASE}/pose/06.png` },
        { id: 'p6', name: 'Dynamic', img: `${EXAMPLE_BASE}/pose/07.png` },
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
    let selectedPose = null;      // { img: url, name: str }
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

        selectedPose = { img: pose.img, name: pose.name, id: pose.id };
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

    async function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    async function urlToBase64(url) {
        try {
            const blob = await urlToBlob(url);
            const file = new File([blob], 'image.png', { type: blob.type });
            return await fileToBase64(file);
        } catch (e) {
            // If CORS blocks, try loading through a canvas
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = reject;
                img.src = url;
            });
        }
    }

    async function getImageData(selection) {
        if (!selection) return null;
        if (selection.isFile && selection.file) {
            return await fileToBase64(selection.file);
        }
        return await urlToBase64(selection.img);
    }

    // -----------------------------------------------------------------
    // 11. GRADIO API — Call HuggingFace Space
    // -----------------------------------------------------------------
    async function callGradioAPI(garmentData, faceData, poseData, prompt, settings) {
        // The IMAGDressing-v1 Gradio interface expects:
        // fn: dress_process
        // inputs: [garm_img, face_img, pose_img, prompt, cloth_guidance_scale,
        //          caption_guidance_scale, face_guidance_scale, self_guidance_scale,
        //          cross_guidance_scale, if_ipa, if_control, denoise_steps, seed]
        // api_name: 'IMAGDressing-v1'

        const useFace = toggleFace.checked && faceData;
        const usePose = togglePose.checked && poseData;

        // Step 1: Get a session hash
        const sessionHash = Math.random().toString(36).substring(2);

        // Step 2: Send request to queue/join
        const payload = {
            data: [
                garmentData,                    // Garment image (base64)
                useFace ? faceData : null,      // Face image (base64 or null)
                usePose ? poseData : null,       // Pose image (base64 or null)
                prompt,                          // Text prompt
                settings.clothGuidance,          // Cloth guidance scale
                settings.promptGuidance,         // Caption guidance scale
                settings.faceGuidance,           // Face guidance scale
                settings.selfLora,               // Self-attention LoRA scale
                settings.crossLora,              // Cross-attention LoRA scale
                useFace,                         // if_ipa (use face)
                usePose,                         // if_control (use pose)
                settings.denoiseSteps,           // Denoising steps
                settings.seed                    // Seed
            ],
            fn_index: 0,
            session_hash: sessionHash
        };

        updateLoadingProgress(10, 'Connecting to AI model...');

        // Try the Gradio queue API (for Spaces with queuing enabled)
        try {
            // Join the queue
            const joinResponse = await fetch(HF_QUEUE_JOIN, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!joinResponse.ok) {
                throw new Error(`Queue join failed: ${joinResponse.status}`);
            }

            updateLoadingProgress(20, 'In queue, waiting for GPU...');

            // Stream results using SSE
            const result = await pollQueueForResult(sessionHash);
            return result;

        } catch (queueError) {
            console.warn('Queue API failed, trying direct predict:', queueError);
            
            // Fallback: Try direct /api/predict
            try {
                updateLoadingProgress(15, 'Trying direct API call...');
                
                const predictResponse = await fetch(HF_API_ENDPOINT, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: payload.data,
                        fn_index: 0
                    })
                });

                if (!predictResponse.ok) {
                    throw new Error(`Predict API failed: ${predictResponse.status}`);
                }

                const result = await predictResponse.json();
                return result.data[0];

            } catch (predictError) {
                console.warn('Direct predict also failed:', predictError);
                throw new Error(
                    'The IMAGDressing AI model is currently unavailable. ' +
                    'The HuggingFace Space may be sleeping or experiencing high traffic. ' +
                    'Please try again in a few minutes, or visit the space directly at: ' +
                    'https://huggingface.co/spaces/feishen29/IMAGDressing-v1'
                );
            }
        }
    }

    async function pollQueueForResult(sessionHash) {
        return new Promise((resolve, reject) => {
            const eventSource = new EventSource(`${HF_QUEUE_DATA}?session_hash=${sessionHash}`);
            let progressPercent = 20;

            eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.msg === 'estimation') {
                        const eta = data.rank_eta ? Math.round(data.rank_eta) : 30;
                        updateLoadingProgress(25, `Queue position: #${data.rank || '?'} · ETA: ~${eta}s`);
                        if (loadingTimer) loadingTimer.textContent = `Estimated: ${eta} seconds`;
                    }

                    if (data.msg === 'process_starts') {
                        updateLoadingProgress(40, 'GPU is generating your look...');
                    }

                    if (data.msg === 'process_generating') {
                        progressPercent = Math.min(progressPercent + 5, 85);
                        updateLoadingProgress(progressPercent, 'Generating...');
                    }

                    if (data.msg === 'process_completed') {
                        eventSource.close();
                        updateLoadingProgress(100, 'Complete!');
                        
                        if (data.output && data.output.data && data.output.data[0]) {
                            resolve(data.output.data[0]);
                        } else {
                            reject(new Error('No output image received from the model.'));
                        }
                    }

                    if (data.msg === 'queue_full') {
                        eventSource.close();
                        reject(new Error('The AI model queue is full. Please try again later.'));
                    }

                } catch (e) {
                    // Ignore parse errors on heartbeat messages
                }
            };

            eventSource.onerror = () => {
                eventSource.close();
                reject(new Error('Connection to AI model lost. The Space may be sleeping.'));
            };

            // Timeout after 3 minutes
            setTimeout(() => {
                eventSource.close();
                reject(new Error('Generation timed out after 3 minutes. Please try again.'));
            }, 180000);
        });
    }

    function updateLoadingProgress(percent, message) {
        if (progressFill) progressFill.style.width = percent + '%';
        if (loadingDesc) loadingDesc.textContent = message;
    }

    // -----------------------------------------------------------------
    // 12. GENERATION FLOW
    // -----------------------------------------------------------------
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
            // Get image data
            const garmentData = await getImageData(selectedGarment);
            const faceData = toggleFace.checked ? await getImageData(selectedFace) : null;
            const poseData = togglePose.checked && selectedPose ? await urlToBase64(selectedPose.img) : null;

            updateLoadingProgress(15, 'Images prepared, sending to AI...');

            // Build prompt
            let prompt = promptInput.value.trim() || 'A beautiful model standing in a fashion studio';
            if (selectedGarment.prompt) {
                prompt = prompt + ', ' + selectedGarment.prompt;
            }

            // Get advanced settings
            const settings = {
                clothGuidance: parseFloat(document.getElementById('cloth-guidance').value),
                promptGuidance: parseFloat(document.getElementById('prompt-guidance').value),
                faceGuidance: parseFloat(document.getElementById('face-guidance').value),
                selfLora: parseFloat(document.getElementById('self-lora').value),
                crossLora: parseFloat(document.getElementById('cross-lora').value),
                denoiseSteps: parseInt(document.getElementById('denoise-steps').value),
                seed: parseInt(document.getElementById('ai-seed').value)
            };

            // Call the API
            const result = await callGradioAPI(garmentData, faceData, poseData, prompt, settings);

            // Display result
            let imageUrl;
            if (typeof result === 'string') {
                if (result.startsWith('data:')) {
                    imageUrl = result;
                } else if (result.startsWith('http')) {
                    imageUrl = result;
                } else {
                    // It might be a file path on the server
                    imageUrl = HF_SPACE_URL + '/file=' + result;
                }
            } else if (result && result.url) {
                imageUrl = result.url;
            } else if (result && result.path) {
                imageUrl = HF_SPACE_URL + '/file=' + result.path;
            } else {
                throw new Error('Unexpected result format from the AI model.');
            }

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

    // Result image also opens lightbox
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

    // Keyboard shortcut: Enter to generate
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !isGenerating && selectedGarment) {
            // Don't trigger if focused on an input
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                return;
            }
            generateLook();
        }
    });

    // ESC to close lightbox
    document.addEventListener('keydown', (e) => {
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
    console.log('📡 Connected to IMAGDressing-v1 HuggingFace Space');
});
