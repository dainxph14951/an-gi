const rarityLabels = {
  common: "Phổ biến",
  rare: "Đáng thử",
  epic: "Đổi gió",
  legendary: "Kèo ngon",
};

const categoryLabels = {
  meal: "Bữa chính",
  snack: "Ăn vặt",
  drink: "Đồ uống",
  group: "Đi nhóm",
};

const STORAGE_KEY = "vsii-os-lunch-box:dishes";

let dishes = [
  {
    name: "Cơm tấm",
    icon: "🍚",
    category: "meal",
    price: 55,
    rarity: "common",
    note: "Sườn nướng, bì, chả và nước mắm ngọt mặn. Chốt nhanh mà vẫn chắc bụng.",
  },
  {
    name: "Bún bò Huế",
    icon: "🍜",
    category: "meal",
    price: 65,
    rarity: "rare",
    note: "Nước dùng cay thơm, thịt bò mềm, hợp lúc cần một bữa thật đã.",
  },
  {
    name: "Bún cá",
    icon: "🐟",
    category: "meal",
    price: 55,
    rarity: "rare",
    note: "Nước dùng thanh, cá chiên hoặc cá hấp thơm nhẹ. Hợp bữa trưa muốn ăn gọn mà vẫn đủ vị.",
  },
  {
    name: "Miến-bún ngan",
    icon: "🦆",
    category: "meal",
    price: 65,
    rarity: "rare",
    note: "Ngan mềm, nước dùng ngọt, chọn miến hay bún đều ổn cho ngày cần đổi vị.",
  },
  {
    name: "Bún cháo lòng",
    icon: "🍲",
    category: "meal",
    price: 50,
    rarity: "common",
    note: "Tô nóng, topping lòng đầy đặn, ăn nhanh mà ấm bụng.",
  },
  {
    name: "Bún chả",
    icon: "🥢",
    category: "meal",
    price: 60,
    rarity: "rare",
    note: "Chả nướng thơm, nước mắm chua ngọt, ăn cùng bún và rau sống rất cuốn.",
  },
  {
    name: "Bánh mì chảo",
    icon: "🍳",
    category: "meal",
    price: 55,
    rarity: "rare",
    note: "Trứng, pate, xúc xích và sốt nóng trong chảo. Chấm bánh mì là no chắc bụng.",
  },
  {
    name: "Phở bò",
    icon: "🍲",
    category: "meal",
    price: 70,
    rarity: "rare",
    note: "Nước dùng thơm, bánh phở mềm. Một lựa chọn rất khó sai.",
  },
  {
    name: "Bún đậu",
    icon: "🥢",
    category: "group",
    price: 85,
    rarity: "epic",
    note: "Đậu giòn, bún lá, thịt luộc và mắm tôm. Hợp nhất khi đi cùng hội.",
  },
  {
    name: "Gà nướng",
    icon: "🍗",
    category: "group",
    price: 120,
    rarity: "epic",
    note: "Da thơm, thịt mềm, hợp ngày muốn ăn đậm vị.",
  },
  {
    name: "Mì Quảng",
    icon: "🍛",
    category: "meal",
    price: 60,
    rarity: "rare",
    note: "Sợi mì vàng, nước dùng sánh, ăn kèm rau và bánh tráng mè.",
  },
  {
    name: "Bánh xèo",
    icon: "🥞",
    category: "snack",
    price: 75,
    rarity: "epic",
    note: "Vỏ giòn, nhân tôm thịt, cuốn rau chấm mắm chua ngọt.",
  },
  {
    name: "Gỏi cuốn",
    icon: "🥗",
    category: "snack",
    price: 45,
    rarity: "common",
    note: "Tươi nhẹ, nhiều rau, hợp khi muốn ăn vừa đủ.",
  },
  {
    name: "Nem nướng",
    icon: "🍢",
    category: "snack",
    price: 70,
    rarity: "rare",
    note: "Cuốn bánh tráng, rau tươi, chấm sốt béo bùi.",
  },
  {
    name: "Vịt quay",
    icon: "🦆",
    category: "group",
    price: 160,
    rarity: "legendary",
    note: "Da giòn, thịt thơm, gọi thêm cơm hoặc bánh mì là hết ý.",
  },
].map((dish, index) => ({ ...dish, id: `dish-${index}`, enabled: true }));

dishes = loadSavedDishes(dishes);

const reel = document.querySelector("#reel");
const openButton = document.querySelector("#open-case");
const rerollButton = document.querySelector("#reroll");
const resultRarity = document.querySelector("#result-rarity");
const resultIcon = document.querySelector("#result-icon");
const resultName = document.querySelector("#result-name");
const resultNote = document.querySelector("#result-note");
const mapLink = document.querySelector("#map-link");
const poolCount = document.querySelector("#pool-count");
const budget = document.querySelector("#budget");
const budgetValue = document.querySelector("#budget-value");
const budgetLabel = document.querySelector("#budget-label");
const categoryFilters = document.querySelector("#category-filters");
const dishList = document.querySelector("#dish-list");
const customForm = document.querySelector("#custom-form");
const customDish = document.querySelector("#custom-dish");

let activeCategory = "all";

function loadSavedDishes(defaultDishes) {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return defaultDishes;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return defaultDishes;

    const savedById = new Map(parsed.map((dish) => [dish.id, dish]));
    const savedByName = new Map(parsed.map((dish) => [dish.name, dish]));
    const mergedDefaults = defaultDishes.map((dish) => {
      const savedDish = savedById.get(dish.id) || savedByName.get(dish.name);
      return savedDish ? { ...dish, enabled: savedDish.enabled } : dish;
    });
    const customDishes = parsed.filter((dish) =>
      String(dish.id).startsWith("custom-"),
    );

    return [...customDishes, ...mergedDefaults];
  } catch {
    return defaultDishes;
  }
}

function persistDishes() {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes));
  } catch {
    // Keep the app usable even when private browsing blocks localStorage.
  }
}

function moneyLabel(value) {
  return `${value}k`;
}

function getPool() {
  const maxBudget = Number(budget.value);
  return dishes.filter((dish) => {
    const matchesCategory =
      activeCategory === "all" || dish.category === activeCategory;
    return dish.enabled && matchesCategory && dish.price <= maxBudget;
  });
}

function createReelCard(dish) {
  const card = document.createElement("div");
  card.className = `reel-card ${dish.rarity}`;
  card.innerHTML = `
    <span class="emoji" aria-hidden="true">${dish.icon}</span>
    <strong>${dish.name}</strong>
    <span>${moneyLabel(dish.price)} · ${rarityLabels[dish.rarity]}</span>
  `;
  return card;
}

function renderIdleReel() {
  const pool = getPool();
  reel.classList.remove("spinning");
  reel.style.transform = "translateX(0)";
  reel.replaceChildren();

  const visible = pool.length ? pool : dishes.filter((dish) => dish.enabled);
  const sample = [...visible, ...visible, ...visible].slice(0, 18);
  sample.forEach((dish) => reel.appendChild(createReelCard(dish)));

  poolCount.textContent = `${pool.length} món khả dụng`;
  budgetValue.textContent = budget.value;
  budgetLabel.textContent = `Dưới ${budget.value}k`;
}

function renderDishList() {
  dishList.replaceChildren();

  dishes.forEach((dish) => {
    const card = document.createElement("article");
    card.className = `dish-card ${dish.enabled ? "" : "disabled"}`;
    card.innerHTML = `
      <label>
        <input type="checkbox" ${dish.enabled ? "checked" : ""} data-id="${dish.id}" />
        <div>
          <div class="dish-name"><span aria-hidden="true">${dish.icon}</span>${dish.name}</div>
          <div class="dish-meta">
            <span>${categoryLabels[dish.category]}</span>
            <span>${moneyLabel(dish.price)}</span>
            <span>${rarityLabels[dish.rarity]}</span>
          </div>
        </div>
      </label>
    `;
    dishList.appendChild(card);
  });
}

function setResult(dish) {
  resultRarity.className = `rarity-pill ${dish.rarity}`;
  resultRarity.textContent = rarityLabels[dish.rarity];
  resultIcon.textContent = dish.icon;
  resultName.textContent = dish.name;
  resultNote.textContent = dish.note;
  mapLink.href = `https://www.google.com/maps/search/${encodeURIComponent(`${dish.name} gần tôi`)}`;
}

function buildSpinSequence(pool, winner) {
  const sequence = [];
  const rounds = 34;

  for (let index = 0; index < rounds; index += 1) {
    sequence.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  sequence.push(winner);

  for (let index = 0; index < 8; index += 1) {
    sequence.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  return sequence;
}

function openCase() {
  const pool = getPool();

  if (!pool.length) {
    resultName.textContent = "Không còn món phù hợp";
    resultNote.textContent =
      "Hãy tăng ngân sách, đổi bộ lọc hoặc tick lại vài món trong kho.";
    return;
  }

  const winner = pool[Math.floor(Math.random() * pool.length)];
  const sequence = buildSpinSequence(pool, winner);

  reel.classList.remove("spinning");
  reel.style.transform = "translateX(0)";
  reel.replaceChildren();
  sequence.forEach((dish) => reel.appendChild(createReelCard(dish)));

  openButton.disabled = true;
  openButton.querySelector("span").textContent = "Đang mở...";

  window.requestAnimationFrame(() => {
    const cards = reel.querySelectorAll(".reel-card");
    const winningCard = cards[34];
    const windowCenter = reel.parentElement.offsetWidth / 2;
    const cardCenter = winningCard.offsetLeft + winningCard.offsetWidth / 2;
    const jitter = Math.floor(Math.random() * 38) - 19;

    reel.classList.add("spinning");
    reel.style.transform = `translateX(${windowCenter - cardCenter + jitter}px)`;
  });

  window.setTimeout(() => {
    setResult(winner);
    openButton.disabled = false;
    openButton.querySelector("span").textContent = "Khai mở tiếp";
  }, 4550);
}

categoryFilters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;
  categoryFilters
    .querySelectorAll(".chip")
    .forEach((chip) => chip.classList.remove("active"));
  button.classList.add("active");
  renderIdleReel();
});

budget.addEventListener("input", renderIdleReel);

dishList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("input[data-id]");
  if (!checkbox) return;

  dishes = dishes.map((dish) =>
    dish.id === checkbox.dataset.id
      ? { ...dish, enabled: checkbox.checked }
      : dish,
  );
  persistDishes();
  renderDishList();
  renderIdleReel();
});

customForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = customDish.value.trim();
  if (!name) return;

  dishes = [
    {
      id: `custom-${Date.now()}`,
      name,
      icon: "🍽️",
      category: "meal",
      price: 70,
      rarity: "rare",
      enabled: true,
      note: `${name} vừa được thêm vào két. Nếu hợp mood thì chốt luôn.`,
    },
    ...dishes,
  ];

  persistDishes();
  customDish.value = "";
  renderDishList();
  renderIdleReel();
});

openButton.addEventListener("click", openCase);
rerollButton.addEventListener("click", openCase);

renderDishList();
renderIdleReel();
