// Menampilkan pesan waktu sholat
function showPrayerTimeMessage() {
    const prayerTimes = {
        "Subuh": { hour: 3, minute: 43 },
        "Dhuhur": { hour: 11, minute: 16 },
        "Ashar": { hour: 14, minute: 32 },
        "Maghrib": { hour: 17, minute: 27 },
        "Isya": { hour: 18, minute: 39 },
    };

    const currentTime = new Date();
    const currentTimeInMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    let nextPrayer = "Subuh"; // Default ke Subuh
    let currentPrayer = null;

    // Mencari waktu adzan saat ini dan selanjutnya
    for (const [prayer, time] of Object.entries(prayerTimes)) {
        const prayerTimeInMinutes = time.hour * 60 + time.minute;

        if (prayerTimeInMinutes === currentTimeInMinutes) {
            currentPrayer = prayer;
            nextPrayer = null; // Jika sekarang waktu sholat, tidak perlu mencari yang berikutnya
            break;
        } else if (prayerTimeInMinutes > currentTimeInMinutes) {
            nextPrayer = prayer;
            break; // Dapatkan waktu sholat berikutnya
        }
    }

    // Jika sudah lewat semua waktu, tetapkan ke Subuh hari berikutnya
    if (!nextPrayer) {
        if (currentTimeInMinutes > (3 * 60 + 43)) {
            nextPrayer = "Subuh"; // Tetap gunakan azan Subuh
        }
    }

    const nextPrayerTime = prayerTimes[nextPrayer];
    const nextPrayerDate = new Date(currentTime);
    
    // Tentukan tanggal untuk Subuh hari berikutnya jika sudah lewat
    if (nextPrayer === "Subuh" && currentTimeInMinutes > (3 * 60 + 43)) {
        nextPrayerDate.setDate(nextPrayerDate.getDate() + 1); // Set ke hari berikutnya
    }

    nextPrayerDate.setHours(nextPrayerTime.hour, nextPrayerTime.minute, 0, 0);

    // Hitung detik sampai azan berikutnya
    let totalSecondsUntilNextPrayer = Math.floor((nextPrayerDate - currentTime) / 1000);

    const runningText = document.getElementById('runningText');
    const nextPrayerText = document.getElementById('nextPrayerText');
    const clock = document.getElementById('clock');
    const audio = document.getElementById('azanAudio');

    if (currentPrayer) {
        runningText.textContent = `Sekarang Sudah Masuk Waktu Adzan Sholat ${currentPrayer}!`;
        runningText.style.display = 'block';
        nextPrayerText.style.display = 'none'; 
        clock.classList.add('prayer-time');

        // Memilih audio berdasarkan waktu sholat
        audio.src = currentPrayer === "Subuh" ? "azan_subuh.mp3" : "azan.mp3";
        audio.currentTime = 0; 
        
        // Menunda 1 menit (60 detik) setelah waktu azan
        setTimeout(() => {
            audio.play();
        }, 60000); // 60000 ms = 1 menit

        // Pastikan running text tetap tampil selama audio diputar
        audio.onplaying = function() {
            runningText.style.display = 'block'; // Menampilkan running text
        };
        audio.onended = function() {
            runningText.style.display = 'none'; // Menyembunyikan running text ketika audio selesai
        };
    } else {
        runningText.style.display = 'none'; 
        nextPrayerText.style.display = 'block'; 
        clock.classList.remove('prayer-time');

        const updateNextPrayerText = () => {
            const hoursRemaining = Math.floor(totalSecondsUntilNextPrayer / 3600);
            const minutesRemaining = Math.floor((totalSecondsUntilNextPrayer % 3600) / 60);
            const secondsRemaining = totalSecondsUntilNextPrayer % 60;

            nextPrayerText.textContent = `Adzan ${nextPrayer} Kurang ${String(hoursRemaining).padStart(2, '0')}:${String(minutesRemaining).padStart(2, '0')}:${String(secondsRemaining).padStart(2, '0')}`;
            totalSecondsUntilNextPrayer--;

            if (totalSecondsUntilNextPrayer < 0) {
                clearInterval(countdownInterval);
                showPrayerTimeMessage(); // Perbarui pesan
            }
        };

        updateNextPrayerText(); // Tampilkan waktu awal

        const countdownInterval = setInterval(updateNextPrayerText, 1000);
    }
}

// Menambahkan logika untuk memutar audio otomatis pada pukul 3:01
function playAudioAtSpecificTime() {
    const currentTime = new Date();
    const targetHour = 3;
    const targetMinute = 1;

    // Mengecek apakah sekarang pukul 3:01
    if (currentTime.getHours() === targetHour && currentTime.getMinutes() === targetMinute) {
        const audio = document.getElementById('azanAudio');
        audio.src = "doa.mp3";  // Ganti dengan path audio yang sesuai
        audio.currentTime = 0; // Mulai dari awal
        
        // Tentukan waktu pemutaran selama 5 menit
        const playEndTime = Date.now() + (5 * 60 * 1000); // 5 menit = 5 * 60 * 1000 ms
        
        // Fungsi untuk memutar audio dalam loop selama 5 menit
        function playAudioLoop() {
            // Jika waktu lebih dari 5 menit, berhenti
            if (Date.now() >= playEndTime) {
                audio.pause();  // Hentikan audio
                return;
            }

            // Jika audio sudah selesai, putar lagi dari awal
            audio.play();  // Putar audio
            audio.onended = function() {
                audio.currentTime = 0;  // Mulai dari awal
                playAudioLoop();  // Panggil lagi untuk memutar audio berulang
            };
        }

        // Mulai loop audio
        playAudioLoop();
    }
}

// Panggil fungsi ini dalam fungsi updateTime() atau sesuai kebutuhan
function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0'); 
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    document.getElementById('clock').innerHTML = `${hours}:${minutes}:<span class="seconds">${seconds}</span>`;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString('id-ID', options);
    const days = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const currentDay = days[now.getDay()];

    document.getElementById('date').textContent = `${currentDay}, ${currentDate}`;
    showPrayerTimeMessage();
    changeBorderColor(seconds); 

    // Cek dan putar audio pada waktu yang ditentukan (3:01)
    playAudioAtSpecificTime();

    // Refresh halaman setiap 10 menit (600000 ms)
    setInterval(function() {
        location.reload();  // Halaman akan di-refresh
    }, 600000); // 10 menit dalam milidetik
}


// Mengubah warna border berdasarkan detik
function changeBorderColor(seconds) {
    const clockElement = document.getElementById('clock');
    const colorValue = Math.floor((seconds / 60) * 360); 
    const color = `hsl(${colorValue}, 100%, 50%)`; 

    clockElement.style.border = `11px solid ${color}`; 
}

setInterval(updateTime, 1000); 
updateTime();


// animasi refresh
window.addEventListener('load', function() {
    // Pilih elemen-elemen yang ingin diberi efek fade-in dan slide from bottom
    const elements = document.querySelectorAll('#clock, #date, #runningText, #nextPrayerText');
    
    // Iterasi untuk setiap elemen dan tambahkan delay secara berurutan
    elements.forEach(function(element, index) {
        // Tambahkan kelas 'fade-in-visible' dan atur delay berdasarkan index
        element.style.transitionDelay = `${index * 0.5}s`; // Delay 0.5 detik per elemen
        element.classList.add('fade-in-visible');
    });
});

// element particel
particlesJS("particles-js", {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: [
                "#ff0000", // Merah
                "#ff7f00", // Oranye
                "#ffff00", // Kuning
                "#7fff00", // Hijau
                "#00ff00", // Hijau Muda
                "#00ffff", // Cyan
                "#007fff", // Biru
                "#0000ff", // Biru Tua
                "#7f00ff", // Ungu
                "#ff00ff"  // Magenta
            ]
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: "img/github.svg",
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 5,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "out",
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: {
                enable: true,
                mode: "repulse"
            },
            onclick: {
                enable: true,
                mode: "push"
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

