const thumbnails = document.querySelectorAll('.thumb');
const featuredImage = document.getElementById('featured-image');

thumbnails.forEach(thumb => {
  thumb.addEventListener('click', () => {
    thumbnails.forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
    featuredImage.src = thumb.src;
  });
});

const colorButtons = document.querySelectorAll('.color-btn');

colorButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    colorButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

const qtyInput = document.getElementById('qty-input');
const btnIncrease = document.getElementById('qty-increase');
const btnDecrease = document.getElementById('qty-decrease');

btnIncrease.addEventListener('click', () => {
  let currentValue = parseInt(qtyInput.value);
  qtyInput.value = currentValue + 1;
});

btnDecrease.addEventListener('click', () => {
  let currentValue = parseInt(qtyInput.value);
  if (currentValue > 1) {
    qtyInput.value = currentValue - 1;
  }
});

const tabLinks = document.querySelectorAll('.tab-link');
const tabPanels = document.querySelectorAll('.tab-panel');

tabLinks.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = tab.getAttribute('data-tab');

    tabLinks.forEach(t => t.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});