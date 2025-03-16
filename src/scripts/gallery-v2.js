const slideshows = document.querySelectorAll('.slideshow-container');

slideshows.forEach(slideshowContainer => {
    const buttons = [slideshowContainer.children[0], slideshowContainer.children[1]];
    const slideshow = slideshowContainer.children[2];

    const carouselNavigation = document.createElement('div');
    carouselNavigation.classList.add('carousel-navigation');
    for(let i = 0; i < slideshow.children.length; i++) {
        const carouselDot = document.createElement('div');
        carouselDot.classList.add('carousel-dot');
        carouselDot.setAttribute('data-index', i);
        carouselNavigation.appendChild(carouselDot);
    }
    carouselNavigation.children[0].classList.add('current-dot');
    slideshowContainer.appendChild(carouselNavigation);

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('clicked');
            moveSlideshow(slideshow, carouselNavigation, button.getAttribute('data-direction'));
        })
    })
})

const moveSlideshow = (slideshow, carouselNavigation, direction) => {
    const slideshowLength = slideshow.children.length;
    let currentIndex = parseInt(slideshow.getAttribute('data-current-index'));
    let currentDot = carouselNavigation.querySelector(`[data-index="${currentIndex}"]`);
    let nextIndex;

    if (direction == 'left') {
        currentIndex == 0 ? nextIndex = slideshowLength - 1 : nextIndex = currentIndex - 1;
    }
    if (direction == 'right') {
        currentIndex == slideshowLength - 1 ? nextIndex = 0 : nextIndex = currentIndex + 1;
    }

    currentDot.classList.remove('current-dot');
    const nextDot = carouselNavigation.querySelector(`[data-index="${nextIndex}"]`);
    nextDot.classList.add('current-dot');

    if ((direction === 'right' && currentIndex === slideshowLength - 1) ||
        (direction === 'left' && currentIndex === 0)) {

        const cloneSlide = slideshow.children[nextIndex].cloneNode(true);

        if (direction === 'right') {
            slideshow.appendChild(cloneSlide);

            slideshow.style.transition = '0.5s ease-out';
            slideshow.style.transform = `translateX(-${slideshowLength * 100}%)`;

            setTimeout(() => {
                slideshow.style.transition = 'none';
                slideshow.style.transform = `translateX(0%)`;
                slideshow.removeChild(cloneSlide);
                slideshow.setAttribute('data-current-index', 0);

                setTimeout(() => {
                    slideshow.style.transition = '0.5s ease-out';
                }, 50);
            }, 500);
        } else {
            slideshow.insertBefore(cloneSlide, slideshow.firstChild);

            slideshow.style.transition = 'none';
            slideshow.style.transform = `translateX(-100%)`;

            slideshow.offsetHeight;

            slideshow.style.transition = '0.5s ease-out';
            slideshow.style.transform = `translateX(0)`;

            setTimeout(() => {
                slideshow.style.transition = 'none';
                slideshow.style.transform = `translateX(-${(slideshowLength - 1) * 100}%)`;
                slideshow.removeChild(cloneSlide);
                slideshow.setAttribute('data-current-index', slideshowLength - 1);

                setTimeout(() => {
                    slideshow.style.transition = '0.5s ease-out';
                }, 50);
            }, 500);
        }
    } else {
        slideshow.setAttribute('data-current-index', nextIndex);
        slideshow.style.transition = '0.5s ease-out';
        slideshow.style.transform = `translateX(-${nextIndex * 100}%)`;
    }
}
