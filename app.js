const articles = {
  overview: {
    title: "Обзор проекта",
    lead: "Общее описание ArmyVAI. Используйте эту страницу, чтобы объяснить назначение проекта, его аудиторию и основные принципы.",
    sections: [
      ["Что такое ArmyVAI?", "ArmyVAI — база знаний, в которой материалы собраны по темам и доступны через разделы и поиск. Замените этот текст официальным описанием вашего проекта."],
      ["Как пользоваться вики", "Выберите нужный раздел в меню слева или воспользуйтесь поиском справа. Статьи можно расширять, добавляя подзаголовки, списки и справочные блоки."],
      ["Основные принципы", "Актуальность материалов, понятная структура, единые формулировки и ответственное отношение к информации."]
    ]
  },
  guides: {
    title: "Руководства",
    lead: "Инструкции и пошаговые материалы для пользователей и участников проекта.",
    sections: [
      ["Начало работы", "Добавьте сюда порядок регистрации, требования к участникам или первые шаги для новых пользователей."],
      ["Рабочие инструкции", "Каждое руководство должно содержать цель, необходимые условия, последовательность действий и контакты ответственных лиц."],
      ["Рекомендованный формат", "Используйте короткие шаги, понятные заголовки и примеры. Отмечайте дату последнего обновления."]
    ]
  },
  rules: {
    title: "Правила и регламенты",
    lead: "Центральное место для правил, положений, стандартов и внутренних процедур.",
    sections: [
      ["Общие положения", "Разместите здесь утверждённые правила вашего проекта и укажите, на кого они распространяются."],
      ["Процедуры", "Опишите порядок действий в типовых ситуациях, критерии принятия решений и порядок рассмотрения спорных случаев."],
      ["Обновление документов", "Указывайте версию, дату утверждения и ответственного за актуальность каждого документа."]
    ]
  },
  ranks: {
    title: "Звания и структура",
    lead: "Справочная страница для описания организационной структуры, ролей и обязанностей.",
    sections: [
      ["Организационная схема", "Добавьте подразделения, связи между ними и краткое описание назначения каждого направления."],
      ["Роли и обязанности", "Для каждой роли укажите сферу ответственности, полномочия и порядок взаимодействия с другими ролями."],
      ["Система званий", "Если проект использует звания или уровни, добавьте их список и правила присвоения. Не публикуйте личные данные."]
    ]
  },
  faq: {
    title: "Частые вопросы",
    lead: "Короткие ответы на вопросы, которые регулярно возникают у пользователей.",
    sections: [
      ["Как найти нужную статью?", "Введите ключевое слово в поле поиска в правой части страницы. Поиск работает по названиям и описаниям разделов."],
      ["Как предложить исправление?", "Добавьте сюда ваш способ связи, форму обратной связи или инструкции по предложению изменений."],
      ["Куда сообщать об ошибках?", "Укажите официальный канал поддержки или ответственного редактора вашего проекта."]
    ]
  }
};

const pageNames = {
  home: "ГЛАВНАЯ", overview: "ОБЗОР ПРОЕКТА", guides: "РУКОВОДСТВА",
  rules: "ПРАВИЛА И РЕГЛАМЕНТЫ", ranks: "ЗВАНИЯ И СТРУКТУРА", faq: "ЧАСТЫЕ ВОПРОСЫ", howto: "РЕДАКТИРОВАНИЕ"
};
const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");
const crumb = document.getElementById("crumbCurrent");
const homePage = document.getElementById("page-home");
const articlePage = document.getElementById("page-article");
const howtoPage = document.getElementById("page-howto");

function showPage(key) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === key));
  crumb.textContent = pageNames[key] || "РАЗДЕЛ";
  if (key === "home") {
    homePage.classList.add("active");
  } else if (key === "howto") {
    howtoPage.classList.add("active");
  } else {
    const article = articles[key] || articles.overview;
    document.getElementById("articleTitle").textContent = article.title;
    document.getElementById("articleLead").textContent = article.lead;
    const body = document.getElementById("articleBody");
    body.innerHTML = "";
    article.sections.forEach(([heading, paragraph]) => {
      const h = document.createElement("h2"); h.textContent = heading;
      const p = document.createElement("p"); p.textContent = paragraph;
      body.append(h, p);
    });
    articlePage.classList.add("active");
  }
  sidebar.classList.remove("open");
  mobileMenu.setAttribute("aria-expanded", "false");
  document.getElementById("searchResults").hidden = true;
  window.scrollTo({top: 0, behavior: "smooth"});
}

document.addEventListener("click", event => {
  const button = event.target.closest("[data-page]");
  if (button) {
    event.preventDefault();
    showPage(button.dataset.page);
  }
});
mobileMenu.addEventListener("click", () => {
  const open = sidebar.classList.toggle("open");
  mobileMenu.setAttribute("aria-expanded", String(open));
});
document.getElementById("toTop").addEventListener("click", e => {
  e.preventDefault(); window.scrollTo({top: 0, behavior: "smooth"});
});

const searchInput = document.getElementById("searchInput");
const results = document.getElementById("searchResults");
function runSearch() {
  const query = searchInput.value.trim().toLocaleLowerCase("ru");
  results.innerHTML = "";
  if (!query) { results.hidden = true; return; }
  const matches = Object.entries(articles).filter(([key, a]) =>
    (a.title + " " + a.lead + " " + a.sections.map(s => s.join(" ")).join(" ")).toLocaleLowerCase("ru").includes(query)
  );
  matches.forEach(([key, a]) => {
    const btn = document.createElement("button");
    btn.innerHTML = "";
    const title = document.createElement("span"); title.textContent = a.title;
    const small = document.createElement("small"); small.textContent = a.lead.slice(0, 72) + "…";
    btn.append(title, small);
    btn.addEventListener("click", () => showPage(key));
    results.appendChild(btn);
  });
  if (!matches.length) {
    const empty = document.createElement("button"); empty.textContent = "Ничего не найдено. Попробуйте другое слово."; results.appendChild(empty);
  }
  results.hidden = false;
}
searchInput.addEventListener("input", runSearch);
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); searchInput.focus(); }
  if (e.key === "Escape") { results.hidden = true; searchInput.blur(); }
});
