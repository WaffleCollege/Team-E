document.addEventListener('DOMContentLoaded', function() {
    let logo = document.querySelector('.logo');
    let text = document.querySelector('.text');
  
    logo.addEventListener('mouseover', function() {
      logo.style.transform = 'scale(1.2)'; /* ロゴの拡大率を調整してください */
      text.style.opacity = '1';
    });
  
    logo.addEventListener('mouseout', function() {
      logo.style.transform = 'scale(1)';
      text.style.opacity = '0';
    });
  });