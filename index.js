let isDragging = false;
let currentElement = 0;
let playerCards = [
  { imageURL: "assets/img/lemonade.png", audioURL: "assets/audio/beyonce.mp3", title: "Beyonce", subtitle: "Don't Hurt Yourself" },
  { imageURL: "assets/img/dontstartnow.png", audioURL: "assets/audio/dontstartnow.mp3", title: "Dua Lipa", subtitle: "Don't Start Now" },
  { imageURL: "assets/img/mat.jpg", audioURL: "assets/audio/Matt.mp3", title: "Matt Pokora", subtitle: "Reflet" },
  { imageURL: "assets/img/Charlie.jpg", audioURL: "assets/audio/Charlie.mp3", title: "Charlie Puth", subtitle: "One Call Away" },
  { imageURL: "assets/img/Loud.webp", audioURL: "assets/audio/Loud.mp3", title: "Loud Luxury", subtitle: "Crash" },
  { imageURL: "assets/img/emen.jpg", audioURL: "assets/audio/Eminem.mp3", title: "Eminem", subtitle: "Beautiful" },
];

// formatTime - перевод секунд в минуты
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds}`;
}

// checkReady - после подгрузки метаданных, записывает в durationElement продолжительность текущей песни
function checkReady(audio, durationElement) {
  if (audio.readyState >= 1) {
    durationElement.textContent = formatTime(audio.duration.toFixed(2));
  } else {
    audio.onloadedmetadata = () => {
      durationElement.textContent = formatTime(audio.duration.toFixed(2));
    };
  }
}

function playMedia(obj) {
  obj.audio.play();
  obj.imgCard.classList.add("zoom");
  obj.playButton.classList.add("none");
  obj.pauseButton.classList.remove("none");
}

// addPageLayout - добавляет шаблон страницы, возвращая созданные элементы
function addPageLayout(obj) {
  const wrapperImg = document.createElement("div");
  wrapperImg.classList.add("wrapper__img");

  const imgFon = document.createElement("img");
  imgFon.classList.add("img__fon");
  imgFon.src = obj.imageURL;

  const audio = document.createElement("audio");
  audio.classList.add("audio");
  audio.src = obj.audioURL;
  audio.preload = "auto";

  wrapperImg.appendChild(imgFon);
  wrapperImg.appendChild(audio);

  const mediaCard = document.createElement("div");
  mediaCard.classList.add("media__card");

  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("card__wrapper");

  const imgCardWrapper = document.createElement("div");
  imgCardWrapper.classList.add("img__card-wrapper");

  const imgCard = document.createElement("img");
  imgCard.classList.add("img__card");
  imgCard.src = obj.imageURL;

  imgCardWrapper.appendChild(imgCard);

  const mediaWrapper = document.createElement("div");
  mediaWrapper.classList.add("media__wrapper");

  const firstRow = document.createElement("div");
  firstRow.classList.add("first__row");

  const playButton = document.createElement("img");
  playButton.classList.add("play");
  playButton.src = "assets/svg/play.png";
  playButton.height = 50;
  playButton.width = 50;

  const pauseButton = document.createElement("img");
  pauseButton.classList.add("pause", "none");
  pauseButton.src = "assets/svg/pause.png";
  pauseButton.height = 50;
  pauseButton.width = 50;

  const mediaText = document.createElement("div");
  mediaText.classList.add("media__text");

  const title = document.createElement("div");
  title.classList.add("media__title");
  title.textContent = obj.title;

  const subtitle = document.createElement("div");
  subtitle.classList.add("media__subtitle");
  subtitle.textContent = obj.subtitle;

  mediaText.appendChild(title);
  mediaText.appendChild(subtitle);

  const arrows = document.createElement("div");
  arrows.classList.add("arrows");

  const lastArrow = document.createElement("img");
  lastArrow.classList.add("last__arrow");
  lastArrow.src = "assets/svg/backward.png";
  lastArrow.height = 30;
  lastArrow.width = 30;

  const nextArrow = document.createElement("img");
  nextArrow.classList.add("next__arrow");
  nextArrow.src = "assets/svg/forward.png";
  nextArrow.height = 30;
  nextArrow.width = 30;

  arrows.appendChild(lastArrow);
  arrows.appendChild(nextArrow);

  firstRow.appendChild(playButton);
  firstRow.appendChild(pauseButton);
  firstRow.appendChild(mediaText);
  firstRow.appendChild(arrows);

  const secondRow = document.createElement("div");
  secondRow.classList.add("second__row");

  const progress = document.createElement("input");
  progress.classList.add("progress");
  progress.type = "range";
  progress.value = 0;
  progress.min = 0;
  progress.max = 100;

  const currentTime = document.createElement("div");
  currentTime.classList.add("currentTime", "time");
  currentTime.textContent = "0:00";

  const durationTime = document.createElement("div");
  durationTime.classList.add("durationTime", "time");

  secondRow.appendChild(progress);
  secondRow.appendChild(currentTime);
  secondRow.appendChild(durationTime);

  mediaWrapper.appendChild(firstRow);
  mediaWrapper.appendChild(secondRow);

  cardWrapper.appendChild(imgCardWrapper);
  cardWrapper.appendChild(mediaWrapper);

  mediaCard.appendChild(cardWrapper);

  document.body.appendChild(wrapperImg);
  document.body.appendChild(mediaCard);

  return {
    audio,
    imgCard,
    playButton,
    pauseButton,
    progress,
    currentTime,
    durationTime,
    lastArrow,
    nextArrow,
  };
}

// addFunctionality - добавляет функционал определенным элементам на странице
function addFunctionality(obj) {
  const { audio, imgCard, playButton, pauseButton, progress, currentTime, durationTime, lastArrow, nextArrow } = addPageLayout(obj);

  checkReady(audio, durationTime);

  // отслеживает момент, когда пользователь нажал на ползунок
  progress.addEventListener("mousedown", () => {
    isDragging = true;
  });

  // отслеживает момент, когда пользователь отпустил ползунок
  progress.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // "input" - слушатель на движение ползунка
  progress.addEventListener("input", (event) => {
    let curentPosition = Number(event.target.value);
    let newTime = (curentPosition / 100) * audio.duration;
    currentTime.textContent = formatTime(newTime);
    audio.currentTime = newTime;
  });

  // timeupdate -  срабатывается каждый раз, когда обновляется текущая позиция воспроизведения
  audio.addEventListener("timeupdate", (value) => {
    if (!isDragging) {
      currentTime.textContent = formatTime(audio.currentTime);
      progress.value = String((audio.currentTime / audio.duration) * 100);
    }
  });

  playButton.addEventListener("click", (event) => {
    audio.play();
    imgCard.classList.add("zoom");
    playButton.classList.add("none");
    pauseButton.classList.remove("none");
  });

  pauseButton.addEventListener("click", (event) => {
    audio.pause();
    imgCard.classList.remove("zoom");
    pauseButton.classList.add("none");
    playButton.classList.remove("none");
  });

  nextArrow.addEventListener("click", (event) => {
    document.body.innerHTML = "";
    currentElement += 1;
    if (currentElement >= playerCards.length) {
      currentElement = 0;
      let elements = addFunctionality(playerCards[currentElement]);
      playMedia(elements);
    } else {
      let elements = addFunctionality(playerCards[currentElement]);
      playMedia(elements);
    }
  });

  lastArrow.addEventListener("click", (event) => {
    document.body.innerHTML = "";
    currentElement -= 1;
    if (currentElement === -1) {
      currentElement = playerCards.length - 1;
      let elements = addFunctionality(playerCards[currentElement]);
      playMedia(elements);
    } else {
      let elements = addFunctionality(playerCards[currentElement]);
      playMedia(elements);
    }
  });

  return { audio, imgCard, playButton, pauseButton };
}

addFunctionality(playerCards[0]);
