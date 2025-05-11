document.addEventListener("DOMContentLoaded", function() {
    const userLang = navigator.language || navigator.userLanguage; 
    const lang = userLang.startsWith('ru') ? 'ru' : 'en';
    
    fetch(`local/${lang}.json`)
        .then(response => response.json())
        .then(translations => {
            document.getElementById('title').innerText = translations.title;
            document.getElementById('page-title').innerText = translations.title;
            document.getElementById('online-status').innerText = translations.online + "100"; // Пример
            document.getElementById('server-status').innerText = translations.server_status; // Исправлено на 'server-status'
            document.getElementById('rates').innerText = translations.rates;
            document.getElementById('download-btn').innerText = translations.download;
            document.getElementById('registration-btn').innerText = translations.registration;
            document.getElementById('registration-info').innerText = translations.registration_info;

            // Обратный отсчет до открытия сервера
            const openingDate = new Date("2025-07-16T20:00:00+03:00").getTime();
            const countdownElement = document.getElementById('countdown');

            const countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = openingDate - now;

                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                countdownElement.innerText = `${translations.countdown} ${days}d ${hours}h ${minutes}m ${seconds}s`;

                if (distance < 0) {
                    clearInterval(countdownInterval);
                    countdownElement.innerText = "Server is now open!";
                }
            }, 1000);

            // Обработка клика по кнопке "Регистрация"
            const registrationModal = document.getElementById('registration-modal');
            const closeModal = document.getElementsByClassName('close')[0];

            document.getElementById('registration-btn').onclick = function() {
                registrationModal.style.display = "block";
            }

            closeModal.onclick = function() {
                registrationModal.style.display = "none";
            }

            window.onclick = function(event) {
                if (event.target == registrationModal) {
                    registrationModal.style.display = "none";
                }
            }
        })
        .catch(error => console.error('Error loading localization:', error));
});
