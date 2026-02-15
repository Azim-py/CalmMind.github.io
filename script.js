// ===== تنظیم پس‌زمینه‌ی رندوم که هر ۵ ثانیه عوض شود =====
const totalImages = 32; // تعداد عکس‌ها
const backgroundImages = [];

for (let i = 1; i <= totalImages; i++) {
  backgroundImages.push(`images/pic${i}.jpg`);
}

// پیش‌لود کردن تصاویر برای جلوگیری از چشمک
backgroundImages.forEach(src => {
  const img = new Image();
  img.src = src;
});



  // هر چندتا عکس خواستی اضافه کن
;

let currentBgIndex = Math.floor(Math.random() * backgroundImages.length);


function changeBackground() {
  if (backgroundImages.length === 0) return;
  document.body.style.backgroundImage = `url('${backgroundImages[currentBgIndex]}')`;
  currentBgIndex = (currentBgIndex + 1) % backgroundImages.length;
}

// بار اول
changeBackground();
// هر ۵ ثانیه
setInterval(changeBackground, 10000);

// ===== موزیک پس‌زمینه با پلی‌لیست =====
const musicFiles = [
  "music/mus1.mp3",
  "music/mus2.mp3",
  "music/mus3.mp3",
  // ...
];

const audio = document.getElementById("bg-music");
const toggleMuteBtn = document.getElementById("toggle-mute-btn");
const nextTrackBtn = document.getElementById("next-track-btn");

let currentTrackIndex = 0;
let isMuted = false;

// تنظیم ترک فعلی
function setTrack(index) {
  if (musicFiles.length === 0) return;
  currentTrackIndex = index % musicFiles.length;
  audio.src = musicFiles[currentTrackIndex];
}

// رفتن به ترک بعدی
function playNextTrack() {
  if (musicFiles.length === 0) return;
  currentTrackIndex = (currentTrackIndex + 1) % musicFiles.length;
  setTrack(currentTrackIndex);
  audio.play().catch(() => {
    // اگر مرورگر اجازه نداد، کاری نکنیم
  });
}

// وقتی موزیک تموم شد، خودکار بره ترک بعدی
audio.addEventListener("ended", playNextTrack);

// دکمه‌ی موزیک بعدی
nextTrackBtn.addEventListener("click", () => {
  playNextTrack();
});

// دکمه‌ی بی‌صدا/با صدا
toggleMuteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  audio.muted = isMuted;
  toggleMuteBtn.textContent = isMuted ? "🔇 صدا قطع" : "🔊 صدا روشن";
});

// تلاش برای شروع خودکار بعد از اولین کلیک کاربر روی صفحه
document.addEventListener("click", function initAudioOnce() {
  if (musicFiles.length === 0) return;
  setTrack(currentTrackIndex);
  audio.loop = false;
  audio.muted = isMuted;
  audio.play().catch(() => {
    // اگر باز هم نشد، کاربر می‌تونه با دکمه‌ها کنترل کنه
  });
  // فقط یک بار
  document.removeEventListener("click", initAudioOnce);
}, { once: true });


// ===== متن‌های تصادفی از فایل txt =====
// ساختار فایل: مثلا این‌طوری بنویس:
// -----
// متن اول آرامش‌بخش...
// -----
// متن دوم انگیزشی...
// -----
// متن سوم...

const quotesUrl = "quotes.txt"; // مسیر فایل متنت

let quotes = [];
let quotesLoaded = false;

function parseQuotes(rawText) {
  // جدا کردن بر اساس "-----" (می‌تونی هر علامتی دوست داشتی بذاری)
  return rawText
    .split("-----")
    .map(q => q.trim())
    .filter(q => q.length > 0);
}

function loadQuotesIfNeeded() {
  if (quotesLoaded) return Promise.resolve(quotes);

  return fetch(quotesUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("خطا در خواندن فایل متن");
      }
      return response.text();
    })
    .then(text => {
      quotes = parseQuotes(text);
      quotesLoaded = true;
      return quotes;
    })
    .catch(err => {
      console.error(err);
      return [];
    });
}

const quoteTextEl = document.getElementById("quote-text");
const randomQuoteBtn = document.getElementById("random-quote-btn");

function showRandomQuote() {
  if (!quotes || quotes.length === 0) {
    quoteTextEl.textContent = "فعلاً متنی پیدا نشد. لطفاً فایل متن را بررسی کن.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteTextEl.textContent = quotes[randomIndex];
}

randomQuoteBtn.addEventListener("click", () => {
  loadQuotesIfNeeded().then(() => {
    showRandomQuote();
  });
});
