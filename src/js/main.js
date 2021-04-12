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
      modal = document.querySelector(".modal");

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

   //закрытие мод окна по клику вне формы
   modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.getAttribute("data-close") == "") {
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
   const modalTimeId = setTimeout(openModal, 50000);

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
   //получение ресурсов с сервера
   const getResource = async (url) => {
      //определяем асинхронный код async
      const res = await fetch(url);
      //обрабатываем ошибку обращения
      if (!res.ok) {
         throw new Error(`Could not fetch ${url}, status ${res.status}`);
      }

      return await res.json(); // ждем ответ await
   };

   /*  //Создаем карточки
   //получаем массив объекта
   getResource("http://localhost:3000/menu").then((data) => {
      //перебор массива с деструктурезацией по частям
      data.forEach(({ img, altimg, title, descr, price }) => {
         //передаем в конструктор для создания карточки
         new MenuCard(
            img,
            altimg,
            title,
            descr,
            price,
            ".menu .container"
         ).render();
      });
   }); */

   /*  //Тоже но без шаблонизатора по классам
   getResource('http://localhost:3000/menu')
       .then(data => createCard(data));

   function createCard(data) {
       data.forEach(({img, altimg, title, descr, price}) => {
           const element = document.createElement('div');

           element.classList.add("menu__item");

           element.innerHTML = `
               <img src=${img} alt=${altimg}>
               <h3 class="menu__item-subtitle">${title}</h3>
               <div class="menu__item-descr">${descr}</div>
               <div class="menu__item-divider"></div>
               <div class="menu__item-price">
                   <div class="menu__item-cost">Цена:</div>
                   <div class="menu__item-total"><span>${price}</span> грн/день</div>
               </div>
           `;
           document.querySelector(".menu .container").append(element);
       });
   } */

   // создание карточек с запросом на сервер через
   axios.get("http://localhost:3000/menu").then((data) => {
      data.data.forEach(({ img, altimg, title, descr, price }) => {
         //передаем в конструктор для создания карточки
         new MenuCard(
            img,
            altimg,
            title,
            descr,
            price,
            ".menu .container"
         ).render();
      });
   });

   //Forms

   const forms = document.querySelectorAll("form");
   const message = {
      loading: "img/form/spinner.svg",
      success: "Спасибо! Скоро мы с вами свяжемся",
      failure: "Что-то пошло не так...",
   };

   forms.forEach((item) => {
      bindPostData(item); //вызываем функцию обрабртки
   });

   const postData = async (url, data) => {
      //определяем асинхронный код async
      const res = await fetch(url, {
         // ждем ответ await
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: data,
      });
      return await res.json(); // ждем ответ await
   };

   function bindPostData(form) {
      form.addEventListener("submit", (e) => {
         e.preventDefault();

         const statusMessage = document.createElement("img"); //создаем элемент
         statusMessage.src = message.loading;
         statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
         `;
         form.insertAdjacentElement("afterend", statusMessage);

         const formData = new FormData(form); //конструктор сбора данных

         // преобразовываем formData в массив для JSON
         //       formData.entries() преобр в массив массивов
         //    Object.fromEntries() преобр в объект
         const json = JSON.stringify(Object.fromEntries(formData.entries()));

         //запрос на сервер через fetch
         postData("http://localhost:3000/requests", json)
            .then((data) => {
               console.log(data);
               showThanksModal(message.success);
               statusMessage.remove();
            })
            .catch(() => {
               showThanksModal(message.failure);
            })
            .finally(() => {
               form.reset();
            });
      });
   }

   function showThanksModal(message) {
      const prevModalDialog = document.querySelector(".modal__dialog");

      prevModalDialog.classList.add("hide");
      prevModalDialog.classList.remove("show");
      openModal();

      const thanksModal = document.createElement("div");
      thanksModal.classList.add("modal__dialog");
      thanksModal.innerHTML = `
      <div class="modal__content">
         <div class="modal__close" data-close>&times;</div>
         <div class="modal__title">${message}</div>
      </div>
      `;

      document.querySelector(".modal").append(thanksModal);
      setTimeout(() => {
         thanksModal.remove();
         prevModalDialog.classList.add("show");
         prevModalDialog.classList.remove("hide");
         closeModal();
      }, 4000);
   }

   //Slider

   const slides = document.querySelectorAll(".offer__slide"),
      slider = document.querySelector(".offer__slider"),
      prev = document.querySelector(".offer__slider-prev"),
      next = document.querySelector(".offer__slider-next"),
      total = document.querySelector("#total"),
      current = document.querySelector("#current"),
      slidesWrapper = document.querySelector(".offer__slider-wrapper"),
      slidesField = document.querySelector(".offer__slider-inner"),
      width = window.getComputedStyle(slidesWrapper).width;
   let slideIndex = 1,
      offset = 0;

   if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
      current.textContent = `0${slideIndex}`;
   } else {
      total.textContent = slides.length;
      current.textContent = slideIndex;
   }

   slidesField.style.width = 100 * slides.length + "%";
   slidesField.style.display = "flex";
   slidesField.style.transition = "0.5s all";

   slidesWrapper.style.overflow = "hidden";

   slides.forEach((slide) => {
      slide.style.width = width;
   });

   slider.style.position = "relative";

   const indicators = document.createElement("ol"),
      dots = [];

   indicators.classList.add("carousel-indicators");
   indicators.style.cssText = `
         position: absolute;
         right: 0;
         bottom: 0;
         left: 0;
         z-index: 15;
         display: flex;
         justify-content: center;
         margin-right: 15%;
         margin-left: 15%;
         list-style: none;
      `;
   slider.append(indicators);

   for (let i = 0; i < slides.length; i++) {
      const dot = document.createElement("li");
      dot.setAttribute("data-slide-to", i + 1);
      dot.style.cssText = `
         box-sizing: content-box;
         flex: 0 1 auto;
         width: 30px;
         height: 6px;
         margin-right: 3px;
         margin-left: 3px;
         cursor: pointer;
         background-color: #fff;
         background-clip: padding-box;
         border-top: 10px solid transparent;
         border-bottom: 10px solid transparent;
         opacity: .5;
         transition: opacity .6s ease;
      `;
      if (i == 0) {
         dot.style.opacity = 1;
      }
      indicators.append(dot);
      dots.push(dot);
   }

   next.addEventListener("click", () => {
      if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
         offset = 0;
      } else {
         offset += +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;
      if (slideIndex == slides.length) {
         slideIndex = 1;
      } else {
         slideIndex++;
      }
      if (slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
      dots.forEach((dot) => (dot.style.opacity = ".5"));
      dots[slideIndex - 1].style.opacity = 1;
   });

   prev.addEventListener("click", () => {
      if (offset == 0) {
         offset = +width.slice(0, width.length - 2) * (slides.length - 1);
      } else {
         offset -= +width.slice(0, width.length - 2);
      }

      slidesField.style.transform = `translateX(-${offset}px)`;

      if (slideIndex == 1) {
         slideIndex = slides.length;
      } else {
         slideIndex--;
      }
      if (slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
      dots.forEach((dot) => (dot.style.opacity = ".5"));
      dots[slideIndex - 1].style.opacity = 1;
   });

   dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
         const slideTo = e.target.getAttribute("data-slide-to");

         slideIndex = slideTo;
         offset = +width.slice(0, width.length - 2) * (slideTo - 1);
         slidesField.style.transform = `translateX(-${offset}px)`;

         if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
         } else {
            current.textContent = slideIndex;
         }

         dots.forEach((dot) => (dot.style.opacity = ".5"));
         dots[slideIndex - 1].style.opacity = 1;
      });
   });

   /*  showSlides(slideIndex);

   if (slides.length < 10) {
      total.textContent = `0${slides.length}`;
   } else {
      total.textContent = slides.length;
   }

   function showSlides(n) {
      if (n > slides.length) {
         slideIndex = 1;
      }
      if (n < 1) {
         slideIndex = slides.length;
      }

      slides.forEach((item) => (item.style.display = "none"));
      slides[slideIndex - 1].style.display = "block";

      if (slides.length < 10) {
         current.textContent = `0${slideIndex}`;
      } else {
         current.textContent = slideIndex;
      }
   }
   function plusSlides(n) {
      showSlides((slideIndex += n));
   }
   prev.addEventListener("click", () => {
      plusSlides(-1);
   });
   next.addEventListener("click", () => {
      plusSlides(1);
   }); */
});
