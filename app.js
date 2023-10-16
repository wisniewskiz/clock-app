// LOADING SCREEN
window.addEventListener("DOMContentLoaded", () => {
  const loader = document.querySelector(".loader");
  loader.addEventListener("transitioned", () => {
    document.body.removeChild("loader");
  });
});

// GLOBAL VARIABLES
let lat;
let long;

// HELPER FUNCTIONS
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
  const res = await fetch("https://api.quotable.io/random?minLength=100");
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
  lat = getCoords.coords.latitude;
  long = getCoords.coords.longitude;

  const res = await fetch(
    `https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`
  );
  const data = await res.json();const loader = document.querySelector(".loader");
  cityText.innerText = `${data.address.city}, ${data.address.country_code}`;
  loader.classList.add("loader-hidden");
};

loadCity();

// GET TIME
const timeText = document.querySelector(".main__body--time");
const greetingCurrently = document.querySelector(".currently");
const greetingText = document.querySelector(".main__heading--greeting");
const zoneAbrText = document.querySelector(".main__body--zone");
const timezoneText = document.getElementById("timezone");
const dayYearText = document.getElementById("dayofyear");
const dayWeekText = document.getElementById("dayofweek");
const weekNumText = document.getElementById("weeknumber");
const greetingIcon = document.getElementById("greeting__icon");
let isMorning;

const getTime = async () => {
  let riseTime;
  let setTime;
  const date = new Date(Date());
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const resTime = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${long}&date=today`
  );
  const dataTime = await resTime.json();
  const sunRise = dataTime.results.sunrise.slice(0, -2).split(":");
  const sunSet = dataTime.results.sunset.slice(0, -2).split(":");
  riseTime = Number(sunRise[0] * 60) + Number(sunRise[1]);
  setTime = (Number(sunSet[0]) + 12) * 60 + Number(sunSet[1]);
  let checkTime = hours * 60 + minutes;
  if (checkTime >= riseTime && checkTime <= setTime) {
    greetingText.innerText = "good morning";
    changeBackground("assets/desktop/bg-image-daytime.jpg");
    changeIcon(
      "greeting__icon",
      "assets/desktop/icon-sun.svg",
      "icon showing the moon"
      );
    } else {
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
const buttonIconGraphic = document.getElementById("details--more");
const detailsContent = document.querySelector(".details");
const headerWrapper = document.querySelector(".header__wrapper");
const quoteWrapper = document.getElementById("quote__wrapper");

const changeToActive = () => {
  buttonIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#303030"/>
  <path d="M14 23L20 17L26 23" stroke="white" stroke-width="2"/>
</svg>`;

  buttonInfoText.innerText = "less";
  buttonInfo.className = "acive";

  if (window.screen.width < 700) {
    headerWrapper.style = "transform: translateY(-16rem)";
    detailsContent.style = "transform: translateY(-16rem)";
  } else {
    headerWrapper.style = "transform: translateY(-25rem)";
    detailsContent.style = "transform: translateY(-25rem)";
  }
};

const changeToInactive = () => {
  buttonIcon.innerHTML = ` <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <circle cx="20" cy="20" r="20" fill="#303030"/>
  <path d="M14 17L20 23L26 17" stroke="white" stroke-width="2"/>
  </svg>`;

  buttonInfoText.innerText = "more";
  buttonInfo.className = "inactive";
  headerWrapper.style = "transform: translateY(0)";
  detailsContent.style = "transform: translateY(0)";
};

const changeDetails = () => {
  if (buttonInfo.classList.contains("inactive")) {
    changeToActive();
  } else {
    changeToInactive();
  }
};

buttonInfo.addEventListener("click", changeDetails);

// CHANGE SVG SIZE
window.addEventListener("resize", function (event) {
  var svgWidth = buttonIconGraphic.getAttribute("width");
  var svgHeight = buttonIconGraphic.getAttribute("height");
  var container = buttonIconGraphic.parentNode;
  var containerWidth = container.offsetWidth;
  var containerHeight = container.offsetHeight;
  var aspectRatio = svgWidth / svgHeight;
  var newWidth, newHeight;

  if (containerWidth / containerHeight > aspectRatio) {
    newWidth = containerHeight * aspectRatio;
    newHeight = containerHeight;
  } else {
    newWidth = containerWidth;
    newHeight = containerWidth / aspectRatio;
  }

  buttonIconGraphic.setAttribute("width", newWidth);
  buttonIconGraphic.setAttribute("height", newHeight);
});
