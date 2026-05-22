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
        const infoCol = appSection.querySelector('.app-showcase-info');
        const visualCol = appSection.querySelector('.app-showcase-visual');
        const strip = appSection.querySelector('.app-available-strip');
        let refreshTimer = null;

        if (infoCol) {
            infoCol.style.opacity = '0';
            infoCol.style.transform = 'translateY(40px)';
            infoCol.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        }
        if (visualCol) {
            visualCol.style.opacity = '0';
            visualCol.style.transform = 'translateY(40px)';
            visualCol.style.transition = 'opacity 0.9s ease-out 0.15s, transform 0.9s ease-out 0.15s';
        }
        if (strip) {
            strip.style.opacity = '0';
            strip.style.transition = 'opacity 0.6s ease-out 0.4s';
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (infoCol) {
                        infoCol.style.opacity = '1';
                        infoCol.style.transform = 'translateY(0)';
                    }
                    if (visualCol) {
                        visualCol.style.opacity = '1';
                        visualCol.style.transform = 'translateY(0)';
                    }
                    if (strip) {
                        strip.style.opacity = '1';
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        observer.observe(appSection);

        const defaultExpoGoUrl = 'https://expo.dev/go';

        const setSectionState = (config = {}) => {
            const state = config.status || 'pending';
            const mode = config.mode || 'expo-go';
            appSection.dataset.sessionState = state;
            appSection.dataset.sessionMode = mode;
        };

        const renderFallbackQr = (qrImage, loadingState, message, detail) => {
            if (!qrImage) {
                return;
            }

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

        const loadQrImage = (qrImage, loadingState, targetUrl, fallbackUrl, message, detail) => {
            if (!qrImage) {
                return;
            }

            qrImage.style.opacity = '0';
            if (loadingState) {
                loadingState.classList.remove('is-hidden');
            }

            const preload = new Image();
            preload.onload = () => {
                qrImage.src = preload.src;
                qrImage.style.opacity = '1';
                if (loadingState) {
                    loadingState.classList.add('is-hidden');
                }
            };
            preload.onerror = () => {
                if (fallbackUrl && qrImage.src !== fallbackUrl) {
                    qrImage.src = fallbackUrl;
                    return;
                }

                renderFallbackQr(qrImage, loadingState, message, detail);
            };
            preload.src = targetUrl;
        };

        const scheduleRefresh = (delay) => {
            if (refreshTimer) {
                window.clearTimeout(refreshTimer);
            }
            refreshTimer = window.setTimeout(refreshExpoSessionState, delay);
        };

        async function refreshExpoSessionState() {
            try {
                const response = await fetch('/api/expo-session', {
                    cache: 'no-store'
                });

                if (!response.ok) {
                    throw new Error(`Session request failed with status ${response.status}`);
                }

                const payload = await response.json();
                const config = payload?.data || payload;

                if (!config) {
                    throw new Error('Session payload is missing');
                }

                setSectionState(config);

                const qrImage = appSection.querySelector('[data-qr-image]');
                const qrLink = appSection.querySelector('[data-qr-link]');
                const openExpoLink = appSection.querySelector('[data-open-expo-link]');
                const copyExpoButton = appSection.querySelector('[data-copy-expo-link]');
                const retryQrButton = appSection.querySelector('[data-retry-qr-link]');
                const apkButton = appSection.querySelector('[data-apk-link]');
                const loadingState = appSection.querySelector('[data-qr-loading-state]');
                const supportNote = appSection.querySelector('[data-mobile-support-note]');
                const statusBadges = appSection.querySelectorAll('[data-qr-status-badge]');
                const validityNodes = appSection.querySelectorAll('[data-qr-validity-text]');
                const destinationNodes = appSection.querySelectorAll('[data-qr-destination-text]');
                const lastUpdatedNodes = appSection.querySelectorAll('[data-qr-last-updated]');
                const guideNodes = appSection.querySelectorAll('[data-qr-guide-step]');
                const state = config.status || 'pending';
                const mode = config.mode || 'expo-go';
                const primaryUrl = config.primaryUrl || config.expoUrl || config.fallbackUrl || defaultExpoGoUrl;
                const qrTargetUrl = config.qrTargetUrl || primaryUrl;
                const qrImageUrl = config.qrImageUrl || config.qrUrl || '';
                const fallbackSvgUrl = `/api/expo-qr.svg?t=${Date.now()}`;
                const qrMessage = config.sessionTitle || config.qrBadge || 'BharatFarm';
                const qrDetail = config.qrValidity || 'Waiting for live session';

                if (qrImage) {
                    qrImage.dataset.expoUrl = config.expoUrl || '';
                    qrImage.dataset.primarySrc = qrImageUrl || fallbackSvgUrl;
                    qrImage.dataset.fallbackSrc = fallbackSvgUrl;
                    loadQrImage(
                        qrImage,
                        loadingState,
                        qrImageUrl || fallbackSvgUrl,
                        fallbackSvgUrl,
                        qrMessage,
                        qrDetail
                    );

                    if (copyExpoButton) {
                        copyExpoButton.onclick = async () => {
                            try {
                                await navigator.clipboard.writeText(primaryUrl || defaultExpoGoUrl);
                                copyExpoButton.textContent = config.expoUrl ? 'Copied Live Link' : 'Copied Expo Go Link';
                                window.setTimeout(() => {
                                    copyExpoButton.textContent = 'Copy Expo Link';
                                }, 1800);
                            } catch (_copyError) {
                                copyExpoButton.textContent = 'Copy Failed';
                            }
                        };
                    }

                    if (retryQrButton) {
                        retryQrButton.onclick = () => {
                            if (!qrImage) {
                                return;
                            }
                            loadQrImage(
                                qrImage,
                                loadingState,
                                qrImageUrl || fallbackSvgUrl,
                                fallbackSvgUrl,
                                qrMessage,
                                qrDetail
                            );
                        };
                    }

                    if (apkButton) {
                        const hasApk = mode === 'apk' && !!primaryUrl;
                        apkButton.href = hasApk ? primaryUrl : '#';
                        apkButton.setAttribute('aria-disabled', hasApk ? 'false' : 'true');
                        apkButton.classList.toggle('is-disabled', !hasApk);
                        const apkLabel = apkButton.querySelector('strong');
                        const apkSmall = apkButton.querySelector('.app-dl-small');
                        if (apkLabel) {
                            apkLabel.textContent = hasApk ? 'Download APK' : 'Production APK Coming Soon';
                        }
                        if (apkSmall) {
                            apkSmall.textContent = hasApk ? 'Android install' : 'Future release';
                        }
                    }
                }

                if (qrLink) {
                    qrLink.href = primaryUrl || defaultExpoGoUrl;
                }

                if (openExpoLink) {
                    openExpoLink.href = primaryUrl || defaultExpoGoUrl;
                    const openExpoLabel = openExpoLink.querySelector('strong');
                    const openExpoSmall = openExpoLink.querySelector('.app-dl-small');
                    if (openExpoLabel) {
                        openExpoLabel.textContent = state === 'live'
                            ? 'Open Live Session'
                            : state === 'lan-fallback'
                                ? 'Open LAN Session'
                                : mode === 'apk'
                                    ? 'Install APK'
                                    : 'Open in Expo Go';
                    }
                    if (openExpoSmall) {
                        openExpoSmall.textContent = state === 'live'
                            ? 'Live route'
                            : state === 'lan-fallback'
                                ? 'Same WiFi required'
                                : mode === 'apk'
                                    ? 'Primary route'
                                    : 'Primary route';
                    }
                }

                const destinationLabel = mode === 'apk' ? 'APK' : 'Expo Go';

                statusBadges.forEach((node) => {
                    node.textContent = config.qrBadge || 'Requires Expo Go';
                });

                validityNodes.forEach((node) => {
                    node.textContent = config.qrValidity || 'Waiting for the live Expo session';
                });

                destinationNodes.forEach((node) => {
                    node.textContent = destinationLabel;
                });

                if (supportNote) {
                    supportNote.textContent = state === 'live'
                        ? 'Live Expo session publishing now'
                        : state === 'apk'
                            ? 'Android APK ready'
                            : state === 'lan-fallback'
                                ? (config.wifiNote || 'Connect phone to same WiFi')
                                : state === 'offline'
                                    ? 'Expo session offline, waiting for heartbeat'
                                    : 'Expo Go required';
                }

                guideNodes.forEach((node, index) => {
                    const stepText = Array.isArray(config.guideSteps) && config.guideSteps[index]
                        ? config.guideSteps[index]
                        : node.textContent;
                    node.textContent = stepText;
                });

                lastUpdatedNodes.forEach((node) => {
                    const updatedAt = new Date(config.updatedAt || Date.now());
                    node.textContent = `Last synced ${updatedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                });

                if (loadingState) {
                    loadingState.classList.add('is-hidden');
                }

                scheduleRefresh(state === 'live' ? 15000 : 4000);
            } catch (error) {
                console.warn('[BharatFarm QR] Expo session config refresh failed:', error.message);

                setSectionState({ status: 'lan-fallback', mode: 'expo-go' });

                const qrImage = appSection.querySelector('[data-qr-image]');
                const loadingState = appSection.querySelector('[data-qr-loading-state]');

                // Generate a local LAN QR fallback when API is unreachable
                if (qrImage) {
                    renderFallbackQr(qrImage, loadingState, 'LAN Session', 'Connect phone to same WiFi');
                }

                const validityNodes = appSection.querySelectorAll('[data-qr-validity-text]');
                validityNodes.forEach((node) => {
                    node.textContent = 'Connect phone to same WiFi network and retry.';
                });

                if (loadingState) {
                    loadingState.classList.add('is-hidden');
                }

                const supportNote = appSection.querySelector('[data-mobile-support-note]');
                if (supportNote) {
                    supportNote.textContent = 'LAN session — same WiFi required';
                }

                const guideNodes = appSection.querySelectorAll('[data-qr-guide-step]');
                guideNodes.forEach((node, index) => {
                    const fallbackSteps = [
                        'Connect your phone to the same WiFi network.',
                        'Run npm run start-stable in the mobile folder.',
                        'Scan the QR code or enter the exp:// URL manually.'
                    ];
                    node.textContent = fallbackSteps[index] || node.textContent;
                });

                scheduleRefresh(4000);
            }
        }

        refreshExpoSessionState();
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                refreshExpoSessionState();
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
