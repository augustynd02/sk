const offerSection = document.querySelector('#szkolenia');
const offerItems = document.querySelectorAll('.offer-item');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        offerItems.forEach(item => {
            item.classList.add('appear-from-bottom');
        });
      }
    });
  }, {
    threshold: 0.5
  });

  observer.observe(offerSection);
