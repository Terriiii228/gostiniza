// ===== ДАННЫЕ НОМЕРОВ =====
const roomsData = [
    {
        id: 1,
        name: "Стандарт",
        category: "standard",
        price: "3 900 ₽/сутки",
        description: "Уютный номер для одного или двоих гостей. В номере: двуспальная кровать, телевизор, кондиционер, санузел с душем.",
        image: "images/1.png",
        amenities: ["Wi-Fi", "ТВ", "Кондиционер", "Душ"]
    },
    {
        id: 2,
        name: "Комфорт",
        category: "standard",
        price: "5 700 ₽/сутки",
        description: "Просторный номер с улучшенной планировкой. В номере: две кровати, телевизор, мини-бар, санузел с ванной.",
        image: "images/2.png",
        amenities: ["Wi-Fi", "ТВ", "Мини-бар", "Ванна"]
    },
    {
        id: 3,
        name: "Комфорт+",
        category: "standard",
        price: "7 200 ₽/сутки",
        description: "Номер повышенной комфортности. Гостиная зона, рабочее место, панорамные окна.",
        image: "images/3.png",
        amenities: ["Wi-Fi", "ТВ", "Гостиная зона", "Ванна"]
    },
    {
        id: 4,
        name: "Люкс",
        category: "luxury",
        price: "9 900 ₽/сутки",
        description: "Премиум номер с джакузи и панорамным видом. Отдельная спальня и гостиная.",
        image: "images/4.png",
        amenities: ["Wi-Fi", "ТВ", "Джакузи", "Панорамный вид"]
    },
    {
        id: 5,
        name: "Президентский Люкс",
        category: "luxury",
        price: "15 000 ₽/сутки",
        description: "Самый роскошный номер. Две спальни, кабинет, терраса, персональный консьерж.",
        image: "images/5.png",
        amenities: ["Wi-Fi", "ТВ", "Джакузи", "Терраса", "Консьерж"]
    },
    {
        id: 6,
        name: "Эконом",
        category: "economy",
        price: "2 500 ₽/сутки",
        description: "Бюджетный вариант для командировок. Компактно, чисто, есть всё необходимое.",
        image: "images/6.png",
        amenities: ["Wi-Fi", "ТВ", "Душ"]
    }
];

// ===== ОТРИСОВКА НОМЕРОВ =====
function renderRooms(filter = "all") {
    const roomsGrid = document.getElementById("roomsGrid");
    if (!roomsGrid) return;
    
    let filteredRooms = roomsData;
    if (filter !== "all") {
        filteredRooms = roomsData.filter(room => room.category === filter);
    }
    
    roomsGrid.innerHTML = filteredRooms.map(room => `
        <div class="room-card" data-category="${room.category}">
            <img src="${room.image}" alt="${room.name}">
            <h3>${room.name}</h3>
            <p>${room.description.substring(0, 80)}...</p>
            <div class="price">от ${room.price}</div>
            <a href="#" class="book-btn" onclick="showBookingForm('${room.name}', ${room.price.replace(/[^0-9]/g, '')})">Забронировать</a>
        </div>
    `).join("");
    
    // Заполняем select в форме бронирования
    const roomSelect = document.getElementById("roomSelect");
    if (roomSelect) {
        roomSelect.innerHTML = '<option value="">Выберите номер</option>' + 
            filteredRooms.map(room => `<option value="${room.name}">${room.name} - от ${room.price}</option>`).join("");
    }
}

// ===== ФИЛЬТРАЦИЯ =====
function setupFilters() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            const filter = btn.getAttribute("data-filter");
            renderRooms(filter);
        });
    });
}

// ===== ПОКАЗ ФОРМЫ БРОНИРОВАНИЯ =====
function showBookingForm(roomName, price) {
    const bookingSection = document.querySelector(".booking-section");
    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" });
        const roomSelect = document.getElementById("roomSelect");
        if (roomSelect) {
            for(let i = 0; i < roomSelect.options.length; i++) {
                if(roomSelect.options[i].value === roomName) {
                    roomSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

// ===== ВАЛИДАЦИЯ ДАТ =====
function setupDateValidation() {
    const checkin = document.getElementById("checkin");
    const checkout = document.getElementById("checkout");
    if (!checkin || !checkout) return;
    
    const today = new Date().toISOString().split('T')[0];
    checkin.min = today;
    
    checkin.addEventListener("change", () => {
        checkout.min = checkin.value;
        if (checkout.value && checkout.value < checkin.value) {
            checkout.value = checkin.value;
        }
    });
}

// ===== ОТПРАВКА ФОРМЫ =====
function setupBookingForm() {
    const form = document.getElementById("bookingForm");
    if (!form) return;
    
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const name = form.querySelector('input[placeholder="Ваше имя"]').value;
        const phone = form.querySelector('input[placeholder="Телефон"]').value;
        const email = form.querySelector('input[placeholder="Email"]').value;
        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const room = document.getElementById("roomSelect").value;
        const messageDiv = document.getElementById("formMessage");
        
        if (!name || !phone || !email || !checkin || !checkout || !room) {
            messageDiv.innerHTML = '<div class="form-message error">Пожалуйста, заполните все поля!</div>';
            return;
        }
        
        // Здесь можно отправить данные на сервер
        // Пока просто показываем успешное сообщение
        const bookingData = { name, phone, email, checkin, checkout, room };
        console.log("Заявка на бронирование:", bookingData);
        
        messageDiv.innerHTML = '<div class="form-message success">Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.</div>';
        form.reset();
        
        // Очистить сообщение через 5 секунд
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    });
}

// ===== АНИМАЦИЯ ПРИ СКРОЛЛЕ =====
function setupScrollAnimation() {
    const cards = document.querySelectorAll(".room-card, .advantage-card, .team-card");
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        observer.observe(card);
    });
}

// ===== ИНИЦИАЛИЗАЦИЯ =====
document.addEventListener("DOMContentLoaded", () => {
    renderRooms("all");
    setupFilters();
    setupDateValidation();
    setupBookingForm();
    setupScrollAnimation();
    
    // Добавляем текущий год в футер
    const footer = document.querySelector("footer p");
    if (footer) {
        footer.innerHTML = `&copy; ${new Date().getFullYear()} Отель «Тихий Двор». Все права защищены.`;
    }
});