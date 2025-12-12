document.addEventListener('DOMContentLoaded', () => {
    // Scroll Animations (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));

    // Sticky Header
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll Notification Logic
    const scrollNotif = document.querySelector('.scroll-notification');
    const audio = document.getElementById('sale-sound');
    let hasNotified = false;

    // AUDIO UNLOCK: Browsers block audio unless the user interacts first.
    // We listen to every possible "start" event to unlock the audio engine ASAP.
    const unlockAudio = () => {
        if (audio) {
            audio.muted = true; // Mute for unlock
            audio.play().then(() => {
                audio.pause();
                audio.currentTime = 0;
                audio.muted = false; // Unmute for later
            }).catch(e => {
                // Ignore errors here, just trying to unlock
            });
        }
        // Remove all listeners once triggered
        ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'].forEach(evt =>
            document.removeEventListener(evt, unlockAudio)
        );
    };

    // Listen to every possible interaction
    ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown'].forEach(evt =>
        document.addEventListener(evt, unlockAudio)
    );


    window.addEventListener('scroll', () => {
        // Trigger after scrolling past 400px
        if (window.scrollY > 400 && !hasNotified) {
            hasNotified = true;
            scrollNotif.classList.add('active');

            // Play Actual sound file
            if (audio) {
                audio.currentTime = 0;
                audio.play().catch(error => {
                    console.log('Audio autoplay prevented.', error);
                });
            }

            // Hide after 5 seconds
            setTimeout(() => {
                scrollNotif.classList.remove('active');
            }, 5000);
        }
    });

    // Reset notification on scroll to top (optional for testing/revisiting)
    window.addEventListener('scroll', () => {
        if (window.scrollY < 100) {
            hasNotified = false; // Allow re-trigger if user goes back to top
            scrollNotif.classList.remove('active');
        }
    });

});
