// firebase-app.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onChildAdded,
  remove,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

const firebaseConfig = {};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const komentarRef = ref(db, "komentar-rara-wijaya");

const form = document.getElementById("commentForm");
const commentsContainer = document.getElementById("comments-container");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const nama = document.getElementById("comment-name").value.trim();
  const isi = document.getElementById("comment-message").value.trim();

  if (nama && isi) {
    const waktu = new Date().toISOString();
    push(komentarRef, { nama, isi, waktu });
    form.reset();

    // Show success notification
    Swal.fire({
      icon: "success",
      title: "Terima kasih!",
      text: "Ucapan Anda telah terkirim",
      showConfirmButton: false,
      timer: 1500,
    });
  }
});

onChildAdded(komentarRef, (data) => {
  const { nama, isi, waktu } = data.val();
  const key = data.key;
  const tgl = new Date(waktu);
  const formatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const waktuFormatted = formatter.format(tgl);
  // Create comment card
  const div = document.createElement("div");
  div.className =
    "bg-white relative p-5 shadow-md border border-pink-100 hover:shadow-lg transition-all duration-300";

  const firstLetter = nama.charAt(0).toUpperCase();

  div.innerHTML = `
    <div class="flex items-center mb-3">
      <div class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-300 to-pink-500 flex items-center justify-center text-white font-bold">
        ${firstLetter}
      </div>
      <div class="ml-3">
        <h4 class="font-semibold text-gray-800" style="font-family: 'Quicksand', sans-serif;">${nama}</h4>
        <p class="text-xs text-gray-500" style="font-family: 'Quicksand', sans-serif;">${waktuFormatted}</p>
      </div>
    </div>
    <p class="text-gray-700" style="font-family: 'Quicksand', sans-serif;">
      ${isi}
    </p>
  `;

  // Add to the beginning of the comments container
  commentsContainer.prepend(div);
});
