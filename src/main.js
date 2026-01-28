/**
 * HELIO-STER BLOG - Main Script (Native JS)
 * Version: 1.1 (Fixed Captcha & Horizontal Scroll)
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. СОСТОЯНИЕ И ПЕРЕМЕННЫЕ ---
  const state = {
      captchaResult: 0,
      isMenuOpen: false
  };

  const body = document.body;
  const nav = document.getElementById('nav-menu');
  const burger = document.getElementById('burger-menu');
  const contactForm = document.getElementById('ai-contact-form');
  const phoneInput = document.getElementById('user-phone');
  const cookiePopup = document.getElementById('cookie-popup');

  // --- 2. МОБИЛЬНОЕ МЕНЮ (БЕЗ СКРОЛЛА И БАГОВ) ---
  if (burger && nav) {
      const toggleMenu = (isOpen) => {
          state.isMenuOpen = isOpen;
          burger.classList.toggle('open', isOpen);
          nav.classList.toggle('active', isOpen);
          // Блокируем скролл только если меню открыто
          body.style.overflow = isOpen ? 'hidden' : '';
      };

      burger.addEventListener('click', (e) => {
          e.stopPropagation();
          toggleMenu(!state.isMenuOpen);
      });

      // Закрытие при клике на ссылки
      nav.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => toggleMenu(false));
      });

      // Закрытие при клике вне меню
      document.addEventListener('click', (e) => {
          if (state.isMenuOpen && !nav.contains(e.target) && !burger.contains(e.target)) {
              toggleMenu(false);
          }
      });
  }

  // --- 3. ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ) ---
  if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
          // Удаляем всё, кроме цифр
          e.target.value = e.target.value.replace(/[^0-9]/g, '');
      });
  }

  // --- 4. МАТЕМАТИЧЕСКАЯ КАПЧА ---
  function generateCaptcha() {
      const captchaQ = document.getElementById('captcha-question');
      const captchaInput = document.getElementById('captcha-answer');

      if (captchaQ) {
          const a = Math.floor(Math.random() * 10) + 1;
          const b = Math.floor(Math.random() * 10) + 1;
          state.captchaResult = a + b;
          captchaQ.innerText = `${a} + ${b}`;
          if (captchaInput) captchaInput.value = ''; // Очистка при регенерации
      }
  }
  generateCaptcha();

  // --- 5. ОБРАБОТКА ФОРМЫ (AJAX SIMULATION) ---
  if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
          e.preventDefault();

          const answerInput = document.getElementById('captcha-answer');
          const messageBox = document.getElementById('form-message');
          const btn = document.getElementById('submit-btn');
          const userAnswer = parseInt(answerInput.value, 10);

          // Проверка капчи
          if (userAnswer !== state.captchaResult) {
              showFormMessage('Ошибка: Неверный ответ капчи. Попробуйте снова.', 'error');
              generateCaptcha();
              return;
          }

          // Имитация отправки
          btn.disabled = true;
          const originalBtnText = btn.innerHTML;
          btn.innerText = 'Отправка данных...';

          try {
              // Имитируем сетевую задержку 1.5 сек
              await new Promise(resolve => setTimeout(resolve, 1500));

              showFormMessage('Успех! Мы получили ваш запрос и свяжемся с вами.', 'success');
              contactForm.reset();
              generateCaptcha();
          } catch (error) {
              showFormMessage('Произошла ошибка при отправке. Попробуйте позже.', 'error');
          } finally {
              btn.disabled = false;
              btn.innerHTML = originalBtnText;
          }
      });

      function showFormMessage(text, type) {
          const messageBox = document.getElementById('form-message');
          messageBox.innerText = text;
          messageBox.className = `form__message ${type}`;
          messageBox.style.display = 'block';

          // Автоскрытие через 6 секунд
          setTimeout(() => {
              messageBox.style.display = 'none';
          }, 6000);
      }
  }

  // --- 6. COOKIE POPUP (LOCAL STORAGE) ---
  if (cookiePopup) {
      const isAccepted = localStorage.getItem('helio_cookies_accepted');
      const acceptBtn = document.getElementById('cookie-accept');

      if (!isAccepted) {
          setTimeout(() => {
              cookiePopup.classList.add('show');
          }, 3000); // Показываем через 3 сек
      }

      acceptBtn.addEventListener('click', () => {
          localStorage.setItem('helio_cookies_accepted', 'true');
          cookiePopup.classList.remove('show');
      });
  }

  // --- 7. ПЛАВНЫЙ СКРОЛЛ И АНИМАЦИИ ПОЯВЛЕНИЯ ---
  // Плавный скролл для якорей
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
          e.preventDefault();
          const targetId = this.getAttribute('href');
          if (targetId === '#') return;

          const targetElement = document.querySelector(targetId);
          if (targetElement) {
              targetElement.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
              });
          }
      });
  });

  // Intersection Observer для появления блоков (.reveal)
  const revealOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              // Прекращаем наблюдение после активации
              revealObserver.unobserve(entry.target);
          }
      });
  }, revealOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
});