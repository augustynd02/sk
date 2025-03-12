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
    let totalItemCount = 0;
    let activeIndex = 0;

    let velocityX = 0;
    let lastX = 0;
    let timestamp = 0;
    let animationFrame = null;
    let isAdjusting = false;

    // setup gallery - calculate total width and clone nodes
    galleryItems.forEach(item => {
        const width = item.offsetWidth;
        const marginLeft = parseInt(getComputedStyle(item).marginLeft);
        const marginRight = parseInt(getComputedStyle(item).marginRight);

        if (width > largestWidth) {
            largestWidth = width;
        }

        itemWidths.push(width);
        itemMargins.push({ left: marginLeft, right: marginRight });
        galleryWidth += width + marginLeft + marginRight;
    });

    totalItemCount = galleryItems.length;

    galleryItems.forEach(item => {
        const clone = item.cloneNode(true);
        clone.classList.add("clone");
        gallery.appendChild(clone);
    });


    function calculateItemPositions() {
        const positions = [];
        let currentPosition = 0;

        for (let i = 0; i < totalItemCount; i++) {
            const itemWidth = itemWidths[i];
            const itemMargin = itemMargins[i];

            positions.push({
                start: currentPosition,
                center: currentPosition + (itemWidth / 2) + itemMargin.left,
                end: currentPosition + itemWidth + itemMargin.left + itemMargin.right,
                index: i
            });

            currentPosition += itemWidth + itemMargin.left + itemMargin.right;
        }

        // 2nd time for clones
        for (let i = 0; i < totalItemCount; i++) {
            const itemWidth = itemWidths[i];
            const itemMargin = itemMargins[i];

            positions.push({
                start: currentPosition,
                center: currentPosition + (itemWidth / 2) + itemMargin.left,
                end: currentPosition + itemWidth + itemMargin.left + itemMargin.right,
                index: i
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
            if (i % totalItemCount === index) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    function adjustGalleryPosition() {
        if (isAdjusting) return;

        isAdjusting = true;
        activeIndex = determineActiveItem();

        const originalVelocity = velocityX;

        // scrolling right
        if (galleryX > galleryWidth) {
            galleryX = galleryX % galleryWidth;
            gallery.style.transition = 'none';
            gallery.style.transform = `translateX(${-galleryX}px)`;
            gallery.offsetHeight;
        }

        // scrolling left
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

    function centerInitialItem() {
        const viewportCenter = window.innerWidth / 2;

        const itemIndex = 0;

        const positions = calculateItemPositions();

        const itemCenter = positions[itemIndex + totalItemCount].center;

        galleryX = itemCenter - viewportCenter;

        gallery.style.transform = `translateX(${-galleryX}px)`;

        activeIndex = itemIndex;
        updateActiveClass(activeIndex);

        adjustGalleryPosition();
    }

    function snapToClosestItem() {
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

        if (closestItem) {
            const targetX = closestItem.center - centerViewport;

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

    gallery.addEventListener('mousedown', (e) => {
        e.preventDefault();

        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        isDragging = true;
        initialX = e.clientX;
        lastX = e.clientX;
        timestamp = Date.now();
        velocityX = 0;

        gallery.style.transition = 'none';
    });

    gallery.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = initialX - e.clientX;
            initialX = e.clientX;

            const now = Date.now();
            const dt = now - timestamp;
            if (dt > 0) {
                velocityX = (lastX - e.clientX) / dt * 20;
            }
            lastX = e.clientX;
            timestamp = now;

            galleryX += deltaX;
            gallery.style.transform = `translateX(${-galleryX}px)`;

            if (galleryX > galleryWidth || galleryX < 0) {
                adjustGalleryPosition();
            }

            activeIndex = determineActiveItem();
            updateActiveClass(activeIndex);
        }
    });

    gallery.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;

            if (Math.abs(velocityX) > 0.5) {
                gallery.style.transition = 'none';
                animationFrame = requestAnimationFrame(momentumScroll);
            } else {
                snapToClosestItem();
            }
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;

            if (Math.abs(velocityX) > 0.5) {
                gallery.style.transition = 'none';
                animationFrame = requestAnimationFrame(momentumScroll);
            } else {
                snapToClosestItem();
            }
        }
    });

    window.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;

            if (Math.abs(velocityX) > 0.5) {
                gallery.style.transition = 'none';
                animationFrame = requestAnimationFrame(momentumScroll);
            } else {
                snapToClosestItem();
            }
        }
    });

    gallery.addEventListener('touchstart', (e) => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }

        isDragging = true;
        initialX = e.touches[0].clientX;
        lastX = e.touches[0].clientX;
        timestamp = Date.now();
        velocityX = 0;

        gallery.style.transition = 'none';
    });

    gallery.addEventListener('touchmove', (e) => {
        if (isDragging) {
            const deltaX = initialX - e.touches[0].clientX;
            initialX = e.touches[0].clientX;

            const now = Date.now();
            const dt = now - timestamp;
            if (dt > 0) {
                velocityX = (lastX - e.touches[0].clientX) / dt * 20;
            }
            lastX = e.touches[0].clientX;
            timestamp = now;

            galleryX += deltaX;
            gallery.style.transform = `translateX(${-galleryX}px)`;

            if (galleryX > galleryWidth || galleryX < 0) {
                adjustGalleryPosition();
            }

            activeIndex = determineActiveItem();
            updateActiveClass(activeIndex);
        }
    });

    gallery.addEventListener('touchend', () => {
        if (isDragging) {
            isDragging = false;

            if (Math.abs(velocityX) > 0.5) {
                gallery.style.transition = 'none';
                animationFrame = requestAnimationFrame(momentumScroll);
            } else {
                snapToClosestItem();
            }
        }
    });

    setTimeout(() => {
        centerInitialItem();
    }, 100);

    setTimeout(() => {
        activeIndex = determineActiveItem();
        updateActiveClass(activeIndex);
    }, 100);
});
