
'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.querySelector('.viewport');
    const track = document.querySelector('.track');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevButton = document.querySelector('.arrow--prev');
    const nextButton = document.querySelector('.arrow--next');
    const dots = Array.from(document.querySelectorAll('.dot'));
    const pageCount = document.querySelector('.page-count');

    let currentPage = 0;
    let slidesPerPage = getSlidesPerPage();

    function getSlidesPerPage() {
        return window.matchMedia('(max-width: 700px)').matches ? 1 : 3;
    }

    function getPageCount() {
        return Math.ceil(slides.length / slidesPerPage);
    }

    function updateGallery() {
        const slideWidth = slides[0].getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(track).gap) || 0;

        track.style.transform =
            `translateX(-${currentPage * slidesPerPage * (slideWidth + gap)}px)`;

        dots.forEach((dot, index) => {
            if (index === currentPage) {
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.removeAttribute('aria-current');
            }
        });

        prevButton.disabled = currentPage === 0;
        nextButton.disabled = currentPage === getPageCount() - 1;

        pageCount.textContent =
            `${String(currentPage + 1).padStart(2, '0')} / ${String(getPageCount()).padStart(2, '0')}`;
    }

    function goToPage(page) {
        currentPage = Math.max(0, Math.min(page, getPageCount() - 1));
        updateGallery();
    }

    prevButton.addEventListener('click', () => {
        goToPage(currentPage - 1);
    });

    nextButton.addEventListener('click', () => {
        goToPage(currentPage + 1);
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToPage(index);
        });
    });

    window.addEventListener('resize', () => {
        const newSlidesPerPage = getSlidesPerPage();

        if (newSlidesPerPage !== slidesPerPage) {
            slidesPerPage = newSlidesPerPage;
            currentPage = 0;
        }

        goToPage(currentPage);
    });

    let touchStartX = 0;

    viewport.addEventListener('touchstart', event => {
        touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', event => {
        const touchEndX = event.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (Math.abs(difference) > 45) {
            goToPage(currentPage + (difference > 0 ? 1 : -1));
        }
    }, { passive: true });

    updateGallery();
});
