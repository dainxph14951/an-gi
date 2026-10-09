const dishes = [
  {
    name: "Vịt quay",
    icon: "🦆",
    note: "Da giòn, thịt mềm, ăn cùng dưa leo và nước chấm đậm vị."
  },
  {
    name: "Gà nướng",
    icon: "🍗",
    note: "Thơm mùi than, hợp bữa trưa cần nhiều năng lượng."
  },
  {
    name: "Bún riêu",
    icon: "🍜",
    note: "Nước dùng chua nhẹ, riêu cua béo và topping đầy bát."
  },
  {
    name: "Bún đậu",
    icon: "🥢",
    note: "Đậu giòn, bún lá, rau thơm và mắm tôm thật dậy mùi."
  },
  {
    name: "Nem nướng",
    icon: "🍢",
    note: "Cuốn rau tươi, bánh tráng và sốt chấm béo bùi."
  },
  {
    name: "Cơm tấm",
    icon: "🍚",
    note: "Sườn nướng, bì, chả và nước mắm ngọt mặn vừa miệng."
  },
  {
    name: "Bánh mì",
    icon: "🥖",
    note: "Nhanh gọn, vỏ giòn, nhân đầy đặn cho ngày bận rộn."
  },
  {
    name: "Lẩu thái",
    icon: "🥘",
    note: "Chua cay nóng hổi, rất hợp khi đi ăn cùng nhóm."
  },
  {
    name: "Phở bò",
    icon: "🍲",
    note: "Nước dùng thơm quế hồi, thịt mềm, ăn lúc nào cũng ổn."
  },
  {
    name: "Gỏi cuốn",
    icon: "🥗",
    note: "Tươi nhẹ, nhiều rau, chấm tương đậu phộng."
  },
  {
    name: "Mì Quảng",
    icon: "🍛",
    note: "Sợi mì vàng, nước dùng sánh, thêm bánh tráng mè giòn."
  },
  {
    name: "Bánh xèo",
    icon: "🥞",
    note: "Vỏ vàng giòn, nhân tôm thịt, cuốn rau chấm mắm."
  }
];

const wheel = document.querySelector("#wheel");
const spinButton = document.querySelector("#spin-button");
const shuffleButton = document.querySelector("#shuffle-button");
const resultEmoji = document.querySelector("#result-emoji");
const resultName = document.querySelector("#result-name");
const resultNote = document.querySelector("#result-note");

let currentRotation = 0;
let orderedDishes = [...dishes];
const sector = 360 / dishes.length;

function renderWheel() {
  wheel.querySelectorAll(".wheel-item").forEach((item) => item.remove());

  orderedDishes.forEach((dish, index) => {
    const item = document.createElement("div");
    item.className = "wheel-item";
    item.style.transform = `rotate(${index * sector + sector / 2}deg) translateY(-50%)`;
    item.innerHTML = `
      <span class="food-name">${dish.name}</span>
      <span class="food-icon" aria-hidden="true">${dish.icon}</span>
    `;
    wheel.appendChild(item);
  });
}

function shuffleDishes() {
  orderedDishes = [...orderedDishes].sort(() => Math.random() - 0.5);
  renderWheel();
}

function spinWheel() {
  spinButton.disabled = true;
  spinButton.querySelector("span").textContent = "Đang quay...";

  const selectedIndex = Math.floor(Math.random() * orderedDishes.length);
  const fullTurns = 6 + Math.floor(Math.random() * 3);
  const targetAngle = 360 - (selectedIndex * sector + sector / 2);
  currentRotation += fullTurns * 360 + targetAngle;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  window.setTimeout(() => {
    const selectedDish = orderedDishes[selectedIndex];
    resultEmoji.textContent = selectedDish.icon;
    resultName.textContent = selectedDish.name;
    resultNote.textContent = selectedDish.note;
    spinButton.disabled = false;
    spinButton.querySelector("span").textContent = "Quay lại";
  }, 5300);
}

spinButton.addEventListener("click", spinWheel);
shuffleButton.addEventListener("click", shuffleDishes);
renderWheel();
