window.addEventListener("DOMContentLoaded", () => {
   //Tabs
   const tabs = document.querySelectorAll(".tabheader__item"),
      tabsContent = document.querySelectorAll(".tabcontent"),
      tabsParent = document.querySelector(".tabheader__items");

   function hideTabContent() {
      tabsContent.forEach((item) => {
         //item.style.display = "none"; // инлайн вариант
         item.classList.add("hide"); // вариант при помощи замены класса
         item.classList.remove("show", "fade");
      });

      tabs.forEach((item) => {
         item.classList.remove("tabheader__item_active");
      });
   }

   function showTabContent(i = 0) {
      //если без аргумента то 0
      //tabsContent[i].style.display = "block";// инлайн вариант
      tabsContent[i].classList.add("show", "fade"); // вариант заменa класса
      tabsContent[i].classList.remove("hide");
      tabs[i].classList.add("tabheader__item_active");
   }
   hideTabContent();
   showTabContent();

   tabsParent.addEventListener("click", (event) => {
      const target = event.target;

      if (target && target.classList.contains("tabheader__item")) {
         tabs.forEach((item, i) => {
            if (target == item) {
               hideTabContent();
               showTabContent(i);
            }
         });
      }
   });
   //Timer

   const deadline = "2021-05-05"; //поступление кон даты
   //расчет оставшегося времени
   function getTimeRemaining(endtime) {
      const t = Date.parse(endtime) - Date.parse(new Date()),
         days = Math.floor(t / (1000 * 60 * 60 * 24)),
         hours = Math.floor((t / (1000 * 60 * 60)) % 24),
         minutes = Math.floor((t / 1000 / 60) % 60),
         seconds = Math.floor((t / 1000) % 60);

      return {
         total: t,
         days: days,
         hours: hours,
         minutes: minutes,
         seconds: seconds,
      };
   }
   //добавление 0 спереди если цифра одна или 00
   function getZero(num) {
      if (num < 0) {
         return `00`;
      } else if (num >= 0 && num < 10) {
         return `0${num}`;
      } else {
         return num;
      }
   }
   //установка времени на странице
   function setClock(selector, endtime) {
      const timer = document.querySelector(selector),
         days = timer.querySelector("#days"),
         hours = timer.querySelector("#hours"),
         minutes = timer.querySelector("#minutes"),
         seconds = timer.querySelector("#seconds"),
         timeInterval = setInterval(updateClock, 1000);

      updateClock(); // устранение задержки обнавления

      function updateClock() {
         const t = getTimeRemaining(endtime);

         days.innerHTML = getZero(t.days);
         hours.innerHTML = getZero(t.hours);
         minutes.innerHTML = getZero(t.minutes);
         seconds.innerHTML = getZero(t.seconds);

         if (t.total <= 0) {
            clearInterval(timeInterval);
         }
      }
   }

   setClock(".timer", deadline);

   //Modal

   const modalTrigger = document.querySelectorAll("[data-modal]"),
      modal = document.querySelector(".modal"),
      modalCloseBtn = document.querySelector("[data-close]");

   function openModal() {
      modal.classList.add("show");
      modal.classList.remove("hide");
      document.body.style.overflow = "hidden";
      clearInterval(modalTimeId);
   }

   modalTrigger.forEach((btn) => {
      btn.addEventListener("click", openModal);
   });

   function closeModal() {
      modal.classList.add("hide");
      modal.classList.remove("show");
      document.body.style.overflow = "";
   }

   modalCloseBtn.addEventListener("click", closeModal);
   //закрытие мод окна по клику вне формы
   modal.addEventListener("click", (e) => {
      if (e.target === modal) {
         closeModal();
      }
   });
   //закрытие мод окна по Esc
   document.addEventListener("keydown", (e) => {
      if (e.code === "Escape" && modal.classList.contains("show")) {
         closeModal();
      }
   });
   //открытие модального окна через время
   const modalTimeId = setTimeout(openModal, 5000);

   function showModalByScroll() {
      if (
         //открытие мод окна при скролле до конца страницы
         window.pageYOffset + document.documentElement.clientHeight >=
         document.documentElement.scrollHeight
      ) {
         openModal();
         //удаление события, мод окно появится 1 раз
         window.removeEventListener("scroll", showModalByScroll);
      }
   }
   window.addEventListener("scroll", showModalByScroll);

   //Используем классы для карточек

   class MenuCard {
      constructor(src, alt, title, descr, price, parentSelector, ...classes) {
         this.src = src;
         this.alt = alt;
         this.title = title;
         this.descr = descr;
         this.price = price;
         this.classes = classes;
         this.parent = document.querySelector(parentSelector);
         this.transfer = 27;
         this.changeToUAH();
      }

      changeToUAH() {
         this.price = this.price * this.transfer;
      }

      render() {
         const element = document.createElement("div");
         if (this.classes.length === 0) {
            this.element = "menu__item"; // добавл класса если нет в списке
            element.classList.add(this.element);
         } else {
            this.classes.forEach(
               // добавл класса из списка
               (className) => element.classList.add(className)
            );
         }

         element.innerHTML = `
                  <img src=${this.src} alt=${this.alt} />
                  <h3 class="menu__item-subtitle">${this.title}</h3>
                  <div class="menu__item-descr">${this.descr}</div>
                  <div class="menu__item-divider"></div>
                  <div class="menu__item-price">
                     <div class="menu__item-cost">Цена:</div>
                     <div class="menu__item-total">
                        <span>${this.price}</span> грн/день
                     </div>
                  </div>
         `;
         this.parent.append(element);
      }
   }

   new MenuCard(
      "img/tabs/vegy.jpg",
      "vegy",
      'Меню "Фитнес"',
      'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
      9,
      ".menu .container"
      //класс отсутствует - добавление по умолчанию
   ).render();

   new MenuCard(
      "img/tabs/elite.jpg",
      "elite",
      "Меню “Премиум”",
      "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
      14,
      ".menu .container",
      "menu__item"
   ).render();

   new MenuCard(
      "img/tabs/post.jpg",
      "post",
      'Меню "Постное"',
      "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
      21,
      ".menu .container",
      "menu__item"
   ).render();

   //Forms

   const forms = document.querySelectorAll("form");
   const message = {
      loading: "Загрузка...",
      success: "Спасибо! Скоро мы с вами свяжемся",
      failure: "Что-то пошло не так...",
   };

   forms.forEach((item) => {
      postData(item); //вызываем функцию обрабртки
   });

   function postData(form) {
      form.addEventListener("submit", (e) => {
         e.preventDefault();

         let statusMessage = document.createElement("div"); //создаем элемент
         statusMessage.classList.add("status"); //присваеваем уму класс
         statusMessage.textContent = message.loading; //доб.сообщение "Загрузка"
         form.appendChild(statusMessage); //добавляем форму на страницу

         const request = new XMLHttpRequest(); //создаем конструктор запроса
         request.open("POST", "server.php"); //открываем настройку запроса

         //настройка заголовков для JSON
         request.setRequestHeader(
            "Content-type", // тип какого то контента
            "application/json; charset=utf-8"
         );
         const formData = new FormData(form); //конструктор сбора данных

         // преобразовываем formData в JSON
         const object = {};
         formData.forEach(function (value, key) {
            object[key] = value;
         });
         const json = JSON.stringify(object); //до сюда

         request.send(json); //отправляем json данные

         request.addEventListener("load", () => {
            //проверка что запрос прошел
            if (request.status === 200) {
               console.log(request.response);
               //изменяем сообщение  на success
               statusMessage.textContent = message.success;
               form.reset(); //сброс формы после отправки
               setTimeout(() => {
                  statusMessage.remove(); //удаляем блок сообщения
               }, 2000); //через 2 секунды
            } else {
               //сообщение об ошибке
               statusMessage.textContent = message.failure;
            }
         });
      });
   }
});
