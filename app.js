// FUNCTIONS
const changeBackground = (path) => {
  document.getElementById(
    "body"
  ).style = `background: url(${path}) no-repeat; background-size:cover;`;
};

const changeIcon = (id, path, alt) => {
  const img = document.getElementById(`${id}`);
  img.src = `${path}`;
  img.alt = `${alt}`;
};

// GET QUOTE
const quoteText = document.querySelector(".quote__body--text");
const quoteAuthor = document.querySelector(".quote__footer h5");

const loadQuote = async () => {
  const res = await fetch("https://api.quotable.io/random?minLength=200");
  const quote = await res.json();
  quoteText.innerText = quote.content;
  quoteAuthor.innerText = quote.author;
};

loadQuote();

// GET CITY
const cityText = document.querySelector(".main__footer--city");
const loadCity = async () => {
  const getCoords = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  const lat = getCoords.coords.latitude;
  const long = getCoords.coords.longitude;

  const res = await fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`
  );
  const data = await res.json();
  cityText.innerText = `${data.address.city}, ${data.address.country_code}`;
};

loadCity();

// GET TIME
const timeText = document.querySelector(".main__body--time");
const greetingText = document.querySelector(".main__heading--greeting");
const zoneAbrText = document.querySelector(".main__body--zone");
const timezoneText = document.getElementById("timezone");
const dayYearText = document.getElementById("dayofyear");
const dayWeekText = document.getElementById("dayofweek");
const weekNumText = document.getElementById("weeknumber");
const greetingIcon = document.getElementById("greeting__icon");
let isMorning;
const getTime = async () => {
  const date = new Date(Date());
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = ("0" + minutes).slice(-2);
  }
  if (hours <= 12) {
    isMorning = true;
    greetingText.innerText = "good morning";
    changeBackground("assets/desktop/bg-image-daytime.jpg");
    changeIcon(
      "greeting__icon",
      "assets/desktop/icon-sun.svg",
      "icon showing the moon"
    );
  } else {
    isMorning = false;
    greetingText.innerText = "good evening";
    changeBackground("assets/desktop/bg-image-nighttime.jpg");
    changeIcon(
      "greeting__icon",
      "assets/desktop/icon-moon.svg",
      "icon showing the moon"
    );
  }
  timeText.innerText = `${hours}:${minutes}`;

  let timeRegion = Intl.DateTimeFormat().resolvedOptions().timeZone;
  timezoneText.innerText = timeRegion;
  const res = await fetch(`http://worldtimeapi.org/api/timezone/${timeRegion}`);
  const data = await res.json();
  zoneAbrText.innerText = data.abbreviation;
  dayYearText.innerText = data.day_of_year;
  dayWeekText.innerText = data.day_of_week;
  weekNumText.innerText = data.week_number;
};

getTime();

// EVENT LISTENERS
const quoteRefresh = document.getElementById("quote__refresh");
quoteRefresh.addEventListener("click", loadQuote);

const buttonInfo = document.getElementById("more-information");
const buttonInfoText = document.querySelector(".button--more");
const buttonIcon = document.querySelector(".button--icon");
const detailsContent = document.querySelector(".details");
const headerWrapper = document.querySelector(".header__wrapper");
const quoteWrapper = document.getElementById("quote__wrapper");

const changeToActive = () => {
  buttonInfoText.innerText = "less";
  buttonInfo.className = "acive";
  detailsContent.classList.toggle("hidden");
  buttonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#303030"/>
  <path d="M14 23L20 17L26 23" stroke="white" stroke-width="2"/>
</svg>`;
headerWrapper.style = "height: auto;";
quoteWrapper.classList.toggle("hidden");
};

const changeToInactive = () => {
  buttonInfoText.innerText = "more";
  buttonInfo.className = "inactive";
  detailsContent.classList.toggle("hidden");
  buttonIcon.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#303030"/>
  <path d="M14 17L20 23L26 17" stroke="white" stroke-width="2"/>
  </svg>`;
  quoteWrapper.classList.toggle("hidden");
  headerWrapper.style = "height: 100vh;";
};

const changeDetails = () => {
  if (
    buttonInfo.classList.contains("inactive") &&
    detailsContent.classList.contains("hidden")
  ) {
    changeToActive();
  } else {
    changeToInactive();
  }
};

buttonInfo.addEventListener("click", changeDetails);
