// =========================================================================
// CINEMATIC SCROLL ANIMATION - BHARATFARM
// Built with GSAP & ScrollTrigger using HTML5 Canvas for peak performance
// =========================================================================

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Setup
    const canvas = document.getElementById("hero-lightpass");
    const context = canvas.getContext("2d");
    const frameCount = 240; // Total frames inside Landing_Page
    const images = [];

    // UI Elements
    const loader = document.getElementById("landing-loader");
    const progressBar = document.getElementById("loader-progress");
    const nav = document.querySelector(".landing-nav");

    // We store the current frame in an object so GSAP can uniquely animate it
    const heroState = {
        frame: 0
    };

    // 2. Base Configuration depending on screen size
    // Calculate aspect ratio covering the browser elegantly
    function resizeCanvas() {
        // Handle high DPI screens for sharp rendering
        const dpr = window.devicePixelRatio || 1;
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        // Internal resolution (buffer)
        canvas.width = winWidth * dpr;
        canvas.height = winHeight * dpr;
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        // CSS visual size
        canvas.style.width = `${winWidth}px`;
        canvas.style.height = `${winHeight}px`;

        // Initial render constraint
        if (images[heroState.frame] && images[heroState.frame].complete) {
            render();
        }
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas(); // Set initially

    // 3. Preloading System
    // We preload sequentially. We hide the loader after the first ~30 frames load
    // so the user can begin, whilst the rest load in the background.
    const currentFrame = index => {
        // Generate padded string e.g., "001" to "240"
        let numStr = (index + 1).toString().padStart(3, '0');
        return `Landing_Page/ezgif-frame-${numStr}.jpg`;
    };

    let loadedCount = 0;
    const initialLoadThreshold = Math.min(30, frameCount); // When to reveal UI

    function preloadImages() {
        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            img.onload = () => {
                loadedCount++;

                // Update Progress Bar
                const percent = Math.floor((loadedCount / frameCount) * 100);
                progressBar.style.width = `${percent}%`;

                // If threshold reached, reveal page
                if (loadedCount === initialLoadThreshold) {
                    revealPage();
                }

                // Initial render specifically when First image finishes
                if (i === 0) {
                    render();
                }
            };
            img.src = currentFrame(i);
            images.push(img);
        }
    }

    function revealPage() {
        // Fade out loader
        loader.style.opacity = "0";
        setTimeout(() => {
            loader.style.display = "none";
        }, 800);

        // Fade in first section
        gsap.to("#intro .text-box", {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            delay: 0.2
        });
    }

    // 4. Rendering Function
    function render() {
        const img = images[heroState.frame];
        if (img && img.complete) {
            const dpr = window.devicePixelRatio || 1;
            const winWidth = window.innerWidth;
            const winHeight = window.innerHeight;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Calculate "Cover" logic manually to ensure maximum sharpness
            const imgRatio = img.width / img.height;
            const winRatio = winWidth / winHeight;

            let drawWidth, drawHeight, offsetX, offsetY;

            if (winRatio > imgRatio) {
                drawWidth = canvas.width;
                drawHeight = canvas.width / imgRatio;
                offsetX = 0;
                offsetY = (canvas.height - drawHeight) / 2;
            } else {
                drawWidth = canvas.height * imgRatio;
                drawHeight = canvas.height;
                offsetX = (canvas.width - drawWidth) / 2;
                offsetY = 0;
            }

            context.drawImage(img, Math.floor(offsetX), Math.floor(offsetY), Math.ceil(drawWidth), Math.ceil(drawHeight));
        }
    }

    // 5. GSAP ScrollTrigger Integration
    gsap.registerPlugin(ScrollTrigger);

    // Timeline spanning the entire scroll-content height
    // We bind the `frame` property so scrolling interpolates 0 -> 239.
    gsap.to(heroState, {
        frame: frameCount - 1,
        snap: "frame", // Snap to whole numbers exclusively (cannot draw fraction of frame)
        ease: "none",
        scrollTrigger: {
            trigger: ".scroll-content",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.5, // 0.5s scrubbing smooths fast scrolls
            onUpdate: render // Fire render on every scrub tick
        }
    });

    // 6. Content Section Overlays Animations
    // Dynamically fade sections in and out when they enter viewport
    const sections = gsap.utils.toArray('.step');

    sections.forEach((section, i) => {
        // Skip intro (handled at initial load)
        if (i === 0) return;

        const box = section.querySelector('.text-box');

        ScrollTrigger.create({
            trigger: section,
            start: "top center+=20%", // Trigger when section top enters vertically lower
            end: "bottom center-=20%",
            onEnter: () => gsap.to(box, { opacity: 1, y: 0, duration: 0.8 }),
            onLeave: () => gsap.to(box, { opacity: 0, y: -50, duration: 0.5 }),
            onEnterBack: () => gsap.to(box, { opacity: 1, y: 0, duration: 0.8 }),
            onLeaveBack: () => gsap.to(box, { opacity: 0, y: 50, duration: 0.5 })
        });
    });

    // 7. Navbar Styling on Scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            nav.classList.add("scrolled");
        } else {
            nav.classList.remove("scrolled");
        }
    });

    // Kickoff Preloading
    preloadImages();

    // 8. App Showcase Section — Standalone Entrance Animation
    // This section lives OUTSIDE .scroll-content so GSAP ScrollTrigger won't touch it.
    // We use a simple IntersectionObserver for a clean entrance reveal.
    const appSection = document.querySelector('.app-showcase-section');
    if (appSection) {
        // Set initial hidden state
        const header = appSection.querySelector('.app-showcase-header');
        const cardsContainer = appSection.querySelector('.app-cards-container');
        const strip = appSection.querySelector('.app-available-strip');
        let refreshTimer = null;

        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(30px)';
            header.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }
        if (cardsContainer) {
            cardsContainer.style.opacity = '0';
            cardsContainer.style.transform = 'translateY(40px)';
            cardsContainer.style.transition = 'opacity 0.9s ease-out 0.15s, transform 0.9s ease-out 0.15s';
        }
        if (strip) {
            strip.style.opacity = '0';
            strip.style.transition = 'opacity 0.6s ease-out 0.4s';
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (header) {
                        header.style.opacity = '1';
                        header.style.transform = 'translateY(0)';
                    }
                    if (cardsContainer) {
                        cardsContainer.style.opacity = '1';
                        cardsContainer.style.transform = 'translateY(0)';
                    }
                    if (strip) {
                        strip.style.opacity = '1';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(appSection);

        const renderFallbackQr = (qrImage, loadingState, message, detail) => {
            if (!qrImage) return;

            qrImage.src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                    <defs>
                        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
                            <stop offset="0%" stop-color="#ffffff"/>
                            <stop offset="100%" stop-color="#f0f4f0"/>
                        </linearGradient>
                    </defs>
                    <rect width="300" height="300" rx="24" fill="url(#g)"/>
                    <rect x="18" y="18" width="264" height="264" rx="18" fill="none" stroke="#111" stroke-width="12" stroke-dasharray="12 10"/>
                    <text x="150" y="133" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" font-weight="700" fill="#111">BharatFarm</text>
                    <text x="150" y="166" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#333">${message}</text>
                    <text x="150" y="194" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="#4caf50">${detail}</text>
                </svg>
            `)}`;

            qrImage.style.opacity = '1';
            if (loadingState) {
                loadingState.classList.add('is-hidden');
            }
        };

        const loadQrImage = (qrImage, loadingState, targetUrl) => {
            if (!qrImage) return;

            qrImage.style.opacity = '0.3';
            if (loadingState) {
                loadingState.classList.remove('is-hidden');
            }

            const qrUrl = `/api/expo-qr.svg?url=${encodeURIComponent(targetUrl)}&t=${Date.now()}`;
            const preload = new Image();
            preload.onload = () => {
                qrImage.src = preload.src;
                qrImage.style.opacity = '1';
                if (loadingState) {
                    loadingState.classList.add('is-hidden');
                }
            };
            preload.onerror = () => {
                renderFallbackQr(qrImage, loadingState, 'Connection Lost', 'Live trial offline');
            };
            preload.src = qrUrl;
        };

        const scheduleRefresh = (delay) => {
            if (refreshTimer) {
                window.clearTimeout(refreshTimer);
            }
            refreshTimer = window.setTimeout(refreshSessionState, delay);
        };

        async function refreshSessionState() {
            try {
                const response = await fetch('/api/expo-session', {
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }

                const payload = await response.json();
                const config = payload?.data || payload;

                if (!config) {
                    throw new Error('Payload is missing');
                }

                // ── Update Card 1: Standalone APK Card ──
                const apkQrImage = appSection.querySelector('[data-apk-qr-image]');
                const apkLink = appSection.querySelector('[data-apk-link]');
                
                // Static direct or config-based production APK URL
                const productionApkUrl = config.apkUrl || 'https://bharatfarm-api.onrender.com/download-apk-placeholder';
                
                if (apkQrImage) {
                    apkQrImage.src = `/api/expo-qr.svg?url=${encodeURIComponent(productionApkUrl)}`;
                }
                if (apkLink) {
                    apkLink.href = productionApkUrl;
                }

                // ── Update Card 2: Live Demo Card ──
                const qrImage = appSection.querySelector('[data-qr-image]');
                const qrLink = appSection.querySelector('[data-qr-link]');
                const openExpoLink = appSection.querySelector('[data-open-expo-link]');
                const copyExpoButton = appSection.querySelector('[data-copy-expo-link]');
                const loadingState = appSection.querySelector('[data-qr-loading-state]');
                const statusBadge = appSection.querySelector('[data-qr-status-badge]');
                const liveBadgeContainer = appSection.querySelector('#demo-live-badge');
                
                const demoStatus = config.demoStatus || 'inactive';
                const demoUrl = config.demoUrl || '';

                if (liveBadgeContainer) {
                    if (demoStatus === 'live') {
                        liveBadgeContainer.style.background = 'rgba(76, 175, 80, 0.2)';
                        liveBadgeContainer.style.borderColor = 'rgba(76, 175, 80, 0.4)';
                        liveBadgeContainer.style.color = '#81c784';
                        if (statusBadge) statusBadge.textContent = 'Live Session Active';
                    } else if (demoStatus === 'reconnecting') {
                        liveBadgeContainer.style.background = 'rgba(255, 193, 7, 0.15)';
                        liveBadgeContainer.style.borderColor = 'rgba(255, 193, 7, 0.3)';
                        liveBadgeContainer.style.color = '#ffe7a8';
                        if (statusBadge) statusBadge.textContent = 'Reconnecting...';
                    } else {
                        liveBadgeContainer.style.background = 'rgba(255, 255, 255, 0.08)';
                        liveBadgeContainer.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                        liveBadgeContainer.style.color = '#888';
                        if (statusBadge) statusBadge.textContent = 'Awaiting Metro Boot';
                    }
                }

                if (demoStatus === 'live' && demoUrl) {
                    if (qrImage) loadQrImage(qrImage, loadingState, demoUrl);
                    if (qrLink) qrLink.href = demoUrl;
                    if (openExpoLink) openExpoLink.href = demoUrl;
                } else {
                    if (qrImage) {
                        renderFallbackQr(
                            qrImage, 
                            loadingState, 
                            'Demo Offline', 
                            'Run npx expo start --tunnel'
                        );
                    }
                    if (qrLink) qrLink.href = '#';
                    if (openExpoLink) openExpoLink.href = '#';
                }

                if (copyExpoButton) {
                    copyExpoButton.onclick = async () => {
                        if (!demoUrl || demoUrl === '#') {
                            alert('No live session active to copy!');
                            return;
                        }
                        try {
                            await navigator.clipboard.writeText(demoUrl);
                            const textNode = copyExpoButton.querySelector('#copy-btn-text');
                            if (textNode) {
                                textNode.textContent = 'Copied!';
                                window.setTimeout(() => {
                                    textNode.textContent = 'Copy Link';
                                }, 1800);
                            }
                        } catch (_err) {
                            console.warn('Copy failed');
                        }
                    };
                }

                scheduleRefresh(demoStatus === 'live' ? 12000 : 6000);
            } catch (error) {
                console.warn('[BharatFarm] Dynamic showcase update error:', error.message);
                
                // Offline/error fallbacks
                const qrImage = appSection.querySelector('[data-qr-image]');
                const loadingState = appSection.querySelector('[data-qr-loading-state]');
                
                if (qrImage) {
                    renderFallbackQr(
                        qrImage, 
                        loadingState, 
                        'Awaiting Session', 
                        'Run npx expo start'
                    );
                }
                
                scheduleRefresh(8000);
            }
        }

        refreshSessionState();
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                refreshSessionState();
            }
        });
    }
});

// Global About Modal Control
function showAboutPage() {
    const modal = document.getElementById("aboutPage");
    if (modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function hideAboutPage() {
    const modal = document.getElementById("aboutPage");
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = "";
    }
}
