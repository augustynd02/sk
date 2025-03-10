const gallery = document.querySelector('.gallery-container');
const galleryItems = document.querySelectorAll('.item');
let isDragging = false;
let initialX = 0;
let galleryX = 0;
const galleryWidth = gallery.offsetWidth;

gallery.innerHTML += gallery.innerHTML;

gallery.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    initialX = e.clientX;
})

gallery.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = initialX - e.clientX;
        initialX = e.clientX;
        galleryX += deltaX
        gallery.style.transform = `translateX(${-galleryX}px)`;

        galleryItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + itemRect.width / 2;

            if (Math.abs(window.innerWidth / 2 - itemCenter) < itemRect.width / 2) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        })

        console.log(galleryX, galleryWidth);

        if (galleryX > galleryWidth - 500) {

        }
    }
})

gallery.addEventListener('mouseup', () => {
    isDragging = false;
})
