document.addEventListener("DOMContentLoaded", function() {
    const newsContainer = document.getElementById('news-container');
    const countdownElement = document.getElementById('countdown');

    // Определение языка браузера
    const userLang = navigator.language || navigator.userLanguage; 
    const lang = userLang.startsWith('pl') ? 'pl' :
             userLang.startsWith('en') ? 'en' :
             userLang.startsWith('ja') ? 'ja' : // Японский
             userLang.startsWith('pt') ? 'pt' : // Бразильский португальский
             userLang.startsWith('zh') ? 'zh' : // Китайский
             'en'; // По умолчанию английский


    // Загрузка переводов из JSON-файла
    let translations; // Объявляем переменную translations вне .then()
    
    fetch(`https://la2.wildmoney.pro/wild_lang/translations_${lang}.json`)
        .then(response => response.json())
        .then(data => {
            translations = data; // Присваиваем значение переменной translations
            // Установка текста на странице в зависимости от языка
            document.getElementById('page-title').innerText = translations.title;
            document.getElementById('header-title').innerText = translations.header;
            countdownElement.innerHTML = translations.countdown;
            document.getElementById('register-button').innerText = translations.register;
            document.getElementById('download-button').innerText = translations.download;
            document.getElementById('telegram-button').innerText = translations.telegram;
            document.getElementById('news-title').innerText = translations.news;
            document.getElementById('footer-text').innerText = translations.footer;

            // Получение новостей
            return fetch('https://news-api-la2.wildmoney.pro/');
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                data.items.forEach(item => {
                    const newsItem = document.createElement('div');
                    newsItem.classList.add('news-item');
                    newsItem.innerHTML = `
                        <h3>${item.fromUserFullname} - ${item.date}</h3>
                        <p>${item.post}</p>
                        ${item.imgUrl ? `<img src="${item.imgUrl}" alt="News Image">` : ''}
                        ${item.videoUrl ? `<video controls><source src="${item.videoUrl}" type="video/mp4">Ваш браузер не поддерживает видео.</video>` : ''}
                        <p><a href="https://dkon.app/L2GFx1/post/${item.id}" target="_blank" class="comment-link">${translations.comment}</a></p>
                    `;
                    newsContainer.appendChild(newsItem);
                });
            } else {
                newsContainer.innerHTML = '<p>Не удалось загрузить новости.</p>';
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            newsContainer.innerHTML = '<p>Произошла ошибка при загрузке новостей.</p>';
        });

    // Функция для обратного отсчета
    function startCountdown() {
        const countdownDate = new Date("2025-07-16T20:00:00+03:00").getTime(); // 20:00 по МСК

        const interval = setInterval(function() {
            const now = new Date().getTime();
            const distance = countdownDate - now;

            // Вычисляем дни, часы, минуты и секунды
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Отображаем результат
            countdownElement.innerHTML = `${days}д ${hours}ч ${minutes}м ${seconds}с`;

            // Если обратный отсчет завершен, выводим сообщение
            if (distance < 0) {
                clearInterval(interval);
                countdownElement.innerHTML = "Сервер открыт!";
            }
        }, 1000);
    }

    // Запускаем обратный отсчет
    startCountdown();
});
``
