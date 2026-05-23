import React, { useEffect, useRef, useState } from "react";
import axios from "axios";


const API_URL = "https://spesial-kiran-production.up.railway.app/api/time";
const TARGET_TIMESTAMP = new Date("2026-05-24T00:00:00+07:00").getTime();

const photos = [
  "/photos/foto1.jpeg",
  "/photos/foto2.jpeg",
  "/photos/foto3.jpeg",
  "/photos/foto4.jpeg"

  // Setelah foto asli dimasukkan, kamu bisa ganti menjadi:
  // "/photos/foto1.jpg",
  // "/photos/foto2.jpg",
  // "/photos/foto3.jpg",
  // "/photos/foto4.jpg"
];

function App() {
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [targetTimestamp, setTargetTimestamp] = useState(TARGET_TIMESTAMP);
  const [photoIndex, setPhotoIndex] = useState(0);

useEffect(() => {
  const startApp = async () => {
    try {
      const response = await axios.get(API_URL);

      setCurrentTime(new Date(response.data.now).getTime());
      setTargetTimestamp(response.data.targetTimestamp);
    } catch (error) {
      console.log("Backend tidak aktif, memakai waktu browser:", error);
      setCurrentTime(Date.now());
      setTargetTimestamp(TARGET_TIMESTAMP);
    }

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  startApp();
}, []);

  useEffect(() => {
    if (!currentTime) return;

    const timer = setInterval(() => {
      setCurrentTime((prev) => prev + 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentTime]);

  useEffect(() => {
    const carouselTimer = setInterval(() => {
      setPhotoIndex((prev) => (prev + 1) % photos.length);
    }, 3500);

    return () => clearInterval(carouselTimer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  

  const isBirthdayToday = checkBirthdayDate(currentTime);

return (
  <div className="app">
    <FloatingHearts />

    {isBirthdayToday ? (
      opened ? (
        <BirthdayPage
          currentTime={currentTime}
          photoIndex={photoIndex}
          setPhotoIndex={setPhotoIndex}
          autoPlayMusic={true}
        />
      ) : (
        <OpenGiftScreen onOpen={() => setOpened(true)} />
      )
    ) : (
      <CountdownPage
        currentTime={currentTime}
        targetTimestamp={targetTimestamp}
      />
    )}
  </div>
);
}

function checkBirthdayDate(timestamp) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(new Date(timestamp)) === "2026-05-24";
}

function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loader-heart">💗</div>
      <h1>Menyiapkan kejutan...</h1>
      <p>Sebentar ya, sayang.</p>

      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
    </div>
  );
}

function OpenGiftScreen({ onOpen }) {
  return (
    <main className="page open-gift-page">
      <section className="glass-card open-gift-card">
        <div className="big-gift">🎁</div>

        <h1>Ada Kejutan Untukmu</h1>

        <p>
          Hari ini adalah hari spesialmu. Klik tombol di bawah ini untuk membuka
          hadiah kecil yang sudah aku siapkan.
        </p>

        <button className="open-gift-button" onClick={onOpen}>
          Buka Kadonya 💗
        </button>
      </section>
    </main>
  );
}

function CountdownPage({ currentTime, targetTimestamp }) {
  const distance = targetTimestamp - currentTime;

  const days = Math.max(0, Math.floor(distance / (1000 * 60 * 60 * 24)));
  const hours = Math.max(
    0,
    Math.floor((distance / (1000 * 60 * 60)) % 24)
  );
  const minutes = Math.max(0, Math.floor((distance / (1000 * 60)) % 60));
  const seconds = Math.max(0, Math.floor((distance / 1000) % 60));

  return (
    <main className="page countdown-page">
      <section className="glass-card countdown-card">
        <div className="gift-icon">🎁</div>

        <h1>Website ini belum waktunya dibuka cantikk</h1>

        <p className="subtitle">
          Kejutan spesial ini akan terbuka pada:
        </p>

        <h2>24 Mei 2026</h2>

        <div className="countdown-grid">
          <TimeBox label="Hari" value={days} />
          <TimeBox label="Jam" value={hours} />
          <TimeBox label="Menit" value={minutes} />
          <TimeBox label="Detik" value={seconds} />
        </div>

        <p className="romantic-text">
          Setiap detik menuju hari spesialmu adalah bagian dari kejutan kecil
          yang aku siapkan untukmu.
        </p>
      </section>
    </main>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="time-box">
      <strong>{String(value).padStart(2, "0")}</strong>
      <span>{label}</span>
    </div>
  );
}

function BirthdayPage({ currentTime, photoIndex, setPhotoIndex, autoPlayMusic }) {
  const audioRef = useRef(null);
  const [musicStarted, setMusicStarted] = useState(false);
  const [musicBlocked, setMusicBlocked] = useState(false);
  useEffect(() => {
  const playMusic = async () => {
    try {
      if (!audioRef.current) return;

      audioRef.current.volume = 0.55;
      audioRef.current.loop = true;

      await audioRef.current.play();

      setMusicStarted(true);
      setMusicBlocked(false);
    } catch (error) {
      console.log("Musik tetap diblokir browser:", error);
      setMusicBlocked(true);
    }
  };

  if (autoPlayMusic) {
    playMusic();
  }
}, [autoPlayMusic]);

  const playMusicByClick = async () => {
    try {
      if (!audioRef.current) return;

      audioRef.current.volume = 0.55;
      audioRef.current.loop = true;

      await audioRef.current.play();

      setMusicStarted(true);
      setMusicBlocked(false);
    } catch (error) {
      console.log("Musik gagal diputar:", error);
    }
  };

  const pauseMusic = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setMusicStarted(false);
  };

  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "medium"
  }).format(new Date(currentTime));

  const nextPhoto = () => {
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <main className="page birthday-page">
      <audio ref={audioRef} src="/music/happy-birthday.mp3" preload="auto" />

      <section className="hero glass-card">
        <div className="cake">🎂</div>

        <h1>Happy Birthday, Kiran Sayang!</h1>

        <p className="time-now">{formattedTime}</p>

        <p className="message">
          Hari ini seseorang bernama Maria Kirana Megumi Setiawan sedang berulang tahun🎉🥳, Seseorang yang sangat
           ceria dan sedikit lucu ini sedang berulang tahun yeayy. Mas doain kamu yaa sayang, Semoga semua doa baik,
          kebahagiaan, kesehatan, dan cinta selalu menyertai langkahmu. Selamat juga, akhirnya cita2 kamu masuk UNDIP tercapai juga ya dee.
          waktu gak berasa begitu cepat yaa, mas berasa baru kmrin kenal kamu, tapi sekarang kmu udah lulus sma dan bentar lagi kuliiahh.. sekarang jadi mba2 kuliah yaa dee😂.
          Sekali lagi, mas ucapin selamat ulang tahun yang ke 18 kirann 🎉🥳?, bener kan yaa ?(maaf kalo salah, hehe😂)
        </p>

        <div className="birthday-icons">
          <span>🎁</span>
          <span>💝</span>
          <span>🌸</span>
          <span>🎉</span>
          <span>🍰</span>
        </div>

        <div className="music-box">
          {musicBlocked && (
            <p className="music-note">
              Browser memblokir autoplay. Klik tombol ini untuk memutar lagu.
            </p>
          )}

          {!musicStarted ? (
            <button className="music-button" onClick={playMusicByClick}>
              ▶ Putar Lagu Happy Birthday
            </button>
          ) : (
            <button className="music-button" onClick={pauseMusic}>
              ❚❚ Jeda Lagu
            </button>
          )}
        </div>
      </section>

      <section className="carousel-section glass-card">
        <h2>Galeri Cantiknya Kamu</h2>

        <div className="carousel">
          <button className="carousel-btn left" onClick={prevPhoto}>
            ‹
          </button>

          <img
            src={photos[photoIndex]}
            alt={`Foto ${photoIndex + 1}`}
            className="carousel-image"
          />

          <button className="carousel-btn right" onClick={nextPhoto}>
            ›
          </button>
        </div>

        <div className="dots">
          {photos.map((_, index) => (
            <button
              key={index}
              className={index === photoIndex ? "dot active" : "dot"}
              onClick={() => setPhotoIndex(index)}
            ></button>
          ))}
        </div>
      </section>

      <section className="letter glass-card">
        <h2>Surat Kecil Untukmu</h2>

        <p>
          Di umurmu yang baru ini, jangan pernah takut untuk mencoba hal-hal baru. Kegagalan bukan akhir dari segalanya,
          tapi bagian dari proses untuk membuatmu semakin kuat dan bijaksana. Teruslah belajar, teruslah berusaha,
          dan jangan mudah menyerah.


        </p>

        <p>
          Mas percaya kamu punya banyak kemampuan hebat di dalam dirimu. Mungkin sekarang 
          belum semuanya terlihat, tapi pelan-pelan, 
          dengan usaha dan doa, kamu pasti bisa menjadi versi terbaik dari dirimu sendiri.
          Ingat, hidup tidak selalu mudah, tapi kamu tidak pernah sendirian. Ada keluarga yang selalu mendukungmu,
          mendoakanmu, dan percaya bahwa kamu mampu melewati setiap tantangan.
        </p>

        <h3>Tetap semangat, tetap rendah hati, dan terus kejar impianmu. Mas selalu bangga padamu dee⸜(｡˃ ᵕ ˂ )⸝♡</h3>
      </section>
    </main>
  );
}

function FloatingHearts() {
  return (
    <div className="floating-hearts">
      {Array.from({ length: 18 }).map((_, index) => (
        <span key={index} style={{ "--i": index }}>
          💗
        </span>
      ))}
    </div>
  );
}

export default App;
