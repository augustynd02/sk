window.addEventListener("load", () => {
    const gallery = document.querySelector('.gallery-container');
    const galleryItems = document.querySelectorAll(".item");

    let galleryWidth = 0;
    let isDragging = false;
    let initialX = 0;
    let galleryX = 0;
    let largestWidth = 0;
    let itemWidths = [];
    let itemMargins = [];
    let totalItemCount = galleryItems.length;
    let activeIndex = 0;
    let velocityX = 0;
    let lastX = 0;
    let timestamp = 0;
    let animationFrame = null;
    let isAdjusting = false;
    let hasMoved = false;
    let lastViewportWidth = window.innerWidth;

    function setupGallery() {
        itemWidths = [];
        itemMargins = [];
        galleryWidth = 0;

        galleryItems.forEach(item => {
            const width = item.offsetWidth;
            const marginLeft = parseInt(getComputedStyle(item).marginLeft);
            const marginRight = parseInt(getComputedStyle(item).marginRight);

            largestWidth = Math.max(largestWidth, width);
            itemWidths.push(width);
            itemMargins.push({ left: marginLeft, right: marginRight });
            galleryWidth += width + marginLeft + marginRight;

            item.addEventListener('click', function(e) {
                if (isDragging || hasMoved) {
                    e.preventDefault();
                }
            });
        });
    }

    function recalculateClones() {
        const existingClones = gallery.querySelectorAll('.clone');
        existingClones.forEach(clone => clone.remove());

        galleryItems.forEach(item => {
            const clone = item.cloneNode(true);
            clone.classList.add("clone");

            clone.addEventListener('click', function(e) {
                if (isDragging || hasMoved) {
                    e.preventDefault();
                }
            });

            gallery.appendChild(clone);
        });
    }

    function calculateItemPositions() {
        const positions = [];
        let currentPosition = 0;

        for (let i = 0; i < totalItemCount * 2; i++) {
            const idx = i % totalItemCount;
            const itemWidth = itemWidths[idx];
            const itemMargin = itemMargins[idx];

            positions.push({
                start: currentPosition,
                center: currentPosition + (itemWidth / 2) + itemMargin.left,
                end: currentPosition + itemWidth + itemMargin.left + itemMargin.right,
                width: itemWidth,
                index: idx
            });

            currentPosition += itemWidth + itemMargin.left + itemMargin.right;
        }

        return positions;
    }

    function determineActiveItem() {
        const positions = calculateItemPositions();
        const centerViewport = window.innerWidth / 2;
        const centerGallery = galleryX + centerViewport;

        let closestItem = null;
        let closestDistance = Infinity;

        positions.forEach(pos => {
            const distance = Math.abs(pos.center - centerGallery);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = pos;
            }
        });

        return closestItem ? closestItem.index : 0;
    }

    function updateActiveClass(index) {
        const allItems = document.querySelectorAll(".item, .clone");
        allItems.forEach((item, i) => {
            item.classList.toggle('active', i % totalItemCount === index);
        });
    }

    function adjustGalleryPosition() {
        if (isAdjusting) return;

        isAdjusting = true;
        activeIndex = determineActiveItem();
        const originalVelocity = velocityX;

        if (galleryX > galleryWidth) {
            galleryX %= galleryWidth;
            gallery.style.transition = 'none';
            gallery.style.transform = `translateX(${-galleryX}px)`;
            gallery.offsetHeight;
        }

        if (galleryX < 0) {
            galleryX = galleryWidth + (galleryX % galleryWidth);
            gallery.style.transition = 'none';
            gallery.style.transform = `translateX(${-galleryX}px)`;
            gallery.offsetHeight;
        }

        updateActiveClass(activeIndex);
        velocityX = originalVelocity;
        isAdjusting = false;
    }

    function momentumScroll() {
        velocityX *= 0.95;
        galleryX += velocityX;
        gallery.style.transform = `translateX(${-galleryX}px)`;

        activeIndex = determineActiveItem();
        updateActiveClass(activeIndex);

        if (galleryX > galleryWidth || galleryX < 0) {
            adjustGalleryPosition();
        }

        if (Math.abs(velocityX) > 0.5) {
            animationFrame = requestAnimationFrame(momentumScroll);
        } else {
            snapToClosestItem();
        }
    }

    function snapToClosestItem() {
        const positions = calculateItemPositions();
        const viewportCenter = window.innerWidth / 2;
        const centerGallery = galleryX + viewportCenter;

        let closestItem = null;
        let closestDistance = Infinity;

        positions.forEach(pos => {
            const distance = Math.abs(pos.center - centerGallery);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestItem = pos;
            }
        });

        if (closestItem) {
            const targetX = closestItem.center - viewportCenter;

            gallery.style.transition = '0.3s ease-out';
            galleryX = targetX;
            gallery.style.transform = `translateX(${-galleryX}px)`;

            activeIndex = closestItem.index;
            updateActiveClass(activeIndex);

            setTimeout(() => {
                gallery.style.transition = 'none';
                adjustGalleryPosition();
                gallery.style.transition = '0.2s ease-in';
            }, 300);
        }
    }

    function centerCurrentItem() {
        const viewportCenter = window.innerWidth / 2;
        const positions = calculateItemPositions();

        const currentCenteredItem = positions.find(pos => pos.index === activeIndex);

        if (currentCenteredItem) {
            galleryX = currentCenteredItem.center - viewportCenter;

            gallery.style.transition = 'none';
            gallery.style.transform = `translateX(${-galleryX}px)`;

            updateActiveClass(activeIndex);
        }
    }

    function recalculateGalleryDimensions() {
        setupGallery();
        recalculateClones();
    }

    function handleResize() {
        if (Math.abs(window.innerWidth - lastViewportWidth) > 10) {
            gallery.style.transition = 'none';

            recalculateGalleryDimensions();

            centerCurrentItem();

            lastViewportWidth = window.innerWidth;

            setTimeout(() => {
                gallery.style.transition = '0.2s ease-in';
            }, 50);
        }
    }

    function centerInitialItem() {
        const viewportCenter = window.innerWidth / 2;
        const positions = calculateItemPositions();

        const itemToCenter = positions[totalItemCount];

        galleryX = itemToCenter.center - viewportCenter;

        gallery.style.transform = `translateX(${-galleryX}px)`;

        activeIndex = 0;
        updateActiveClass(activeIndex);


        setTimeout(snapToClosestItem, 50);
    }

    function handleDragStart(clientX) {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        isDragging = true;
        hasMoved = false;
        initialX = clientX;
        lastX = clientX;
        timestamp = Date.now();
        velocityX = 0;

        gallery.style.transition = 'none';
    }

    function handleDragMove(clientX) {
        if (!isDragging) return;

        const deltaX = initialX - clientX;

        if (Math.abs(deltaX) > 5) {
            hasMoved = true;
        }

        initialX = clientX;

        const now = Date.now();
        const dt = now - timestamp;
        if (dt > 0) {
            velocityX = (lastX - clientX) / dt * 20;
        }
        lastX = clientX;
        timestamp = now;

        galleryX += deltaX;
        gallery.style.transform = `translateX(${-galleryX}px)`;

        if (galleryX > galleryWidth || galleryX < 0) {
            adjustGalleryPosition();
        }

        activeIndex = determineActiveItem();
        updateActiveClass(activeIndex);
    }

    function handleDragEnd() {
        if (!isDragging) return;

        isDragging = false;

        if (Math.abs(velocityX) > 0.5) {
            gallery.style.transition = 'none';
            animationFrame = requestAnimationFrame(momentumScroll);
        } else {
            snapToClosestItem();
        }

        setTimeout(() => {
            hasMoved = false;
        }, 100);
    }

    setupGallery();
    recalculateClones();

    gallery.addEventListener('mousedown', e => {
        e.preventDefault();
        handleDragStart(e.clientX);
    });

    gallery.addEventListener('mousemove', e => handleDragMove(e.clientX));
    gallery.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('mouseup', handleDragEnd);
    window.addEventListener('mouseleave', handleDragEnd);

    gallery.addEventListener('touchstart', e => handleDragStart(e.touches[0].clientX));
    gallery.addEventListener('touchmove', e => handleDragMove(e.touches[0].clientX));
    gallery.addEventListener('touchend', handleDragEnd);

    gallery.querySelectorAll('img').forEach(img => {
        img.addEventListener('load', () => {
            setTimeout(() => {
                galleryItems.forEach((item, index) => {
                    itemWidths[index] = item.offsetWidth;
                });
                snapToClosestItem();
            }, 100);
        });
    });

    window.addEventListener('resize', () => {
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(handleResize, 250);
    });

    setTimeout(() => {
        recalculateGalleryDimensions();
        centerInitialItem();
    }, 500);

    window.addEventListener('load', () => setTimeout(recalculateGalleryDimensions, 1000));
});
