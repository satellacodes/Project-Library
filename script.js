// Array untuk menyimpan semua buku
const myLibrary = [];

// Constructor function untuk membuat objek Book
// Tujuan: Membuat blueprint untuk objek buku dengan properti yang konsisten
function Book(title, author, pages, read) {
  this.id = crypto.randomUUID(); // Membuat ID unik untuk setiap buku
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

// Method untuk mengubah status baca buku
// Tujuan: Memungkinkan perubahan status baca pada instance buku
Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Fungsi untuk menambahkan buku ke library
// Tujuan: Memisahkan logika pembuatan buku dari penambahannya ke array
function addBookToLibrary(title, author, pages, read) {
  const newBook = new Book(title, author, pages, read);
  myLibrary.push(newBook);
  return newBook;
}

// Fungsi untuk menampilkan buku di halaman
// Tujuan: Memisahkan logika tampilan dari data (separation of concerns)
function displayBooks() {
  const bookContainer = document.getElementById("book-container");
  bookContainer.innerHTML = ""; // Kosongkan container sebelum menambahkan buku

  // Jika tidak ada buku, tampilkan pesan
  if (myLibrary.length === 0) {
    bookContainer.innerHTML =
      '<div class="empty-library">Tidak ada buku di perpustakaan. Tambahkan buku baru!</div>';
    return;
  }

  // Loop melalui array buku dan buat elemen untuk masing-masing buku
  myLibrary.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "book-card";
    bookCard.dataset.bookId = book.id; // Menyimpan ID buku sebagai data attribute

    bookCard.innerHTML = `
                    <h3>${book.title}</h3>
                    <p><strong>Penulis:</strong> ${book.author}</p>
                    <p><strong>Jumlah Halaman:</strong> ${book.pages}</p>
                    <p><strong>Status:</strong> <span class="read-status ${book.read ? "read-true" : "read-false"}">${book.read ? "Sudah dibaca" : "Belum dibaca"}</span></p>
                    <div class="book-actions">
                        <button class="btn-toggle-read">Ubah Status</button>
                        <button class="btn-remove">Hapus</button>
                    </div>
                `;

    bookContainer.appendChild(bookCard);
  });

  // Menambahkan event listeners untuk tombol hapus dan ubah status
  attachBookEventListeners();
}

// Fungsi untuk menambahkan event listeners ke tombol pada kartu buku
// Tujuan: Memisahkan logika event handling untuk menjaga kebersihan kode
function attachBookEventListeners() {
  // Event listener untuk tombol hapus
  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", function (e) {
      const bookCard = this.closest(".book-card");
      const bookId = bookCard.dataset.bookId;

      // Cari index buku berdasarkan ID
      const bookIndex = myLibrary.findIndex((book) => book.id === bookId);

      if (bookIndex !== -1) {
        myLibrary.splice(bookIndex, 1); // Hapus buku dari array
        displayBooks(); // Perbarui tampilan
      }
    });
  });

  // Event listener untuk tombol ubah status
  document.querySelectorAll(".btn-toggle-read").forEach((button) => {
    button.addEventListener("click", function (e) {
      const bookCard = this.closest(".book-card");
      const bookId = bookCard.dataset.bookId;

      // Cari buku berdasarkan ID
      const book = myLibrary.find((book) => book.id === bookId);

      if (book) {
        book.toggleRead(); // Ubah status baca
        displayBooks(); // Perbarui tampilan
      }
    });
  });
}

// Fungsi untuk menampilkan dialog form
// Tujuan: Menangani UI untuk form tambah buku
function showDialog() {
  const dialog = document.getElementById("book-dialog");
  dialog.showModal();
}

// Fungsi untuk menyembunyikan dialog form
// Tujuan: Menangani UI untuk menutup form
function closeDialog() {
  const dialog = document.getElementById("book-dialog");
  dialog.close();
}

// Fungsi untuk mereset form
// Tujuan: Membersihkan form setelah pengiriman
function resetForm() {
  document.getElementById("book-form").reset();
}

// Event listener ketika DOM sudah dimuat sepenuhnya
// Tujuan: Memastikan semua elemen HTML sudah tersedia sebelum menambahkan event listeners
document.addEventListener("DOMContentLoaded", function () {
  // Menambahkan beberapa buku contoh untuk demonstrasi
  addBookToLibrary(
    "The Pragmatic Programmer",
    "Andrew Hunt, David Thomas",
    352,
    true,
  );
  addBookToLibrary("Clean Code", "Robert C. Martin", 464, false);
  addBookToLibrary(
    "Design Patterns",
    "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    395,
    true,
  );

  // Tampilkan buku-buku
  displayBooks();

  // Event listener untuk tombol tampilkan dialog
  document.getElementById("show-dialog").addEventListener("click", showDialog);

  // Event listener untuk tombol batal di dialog
  document
    .getElementById("cancel-dialog")
    .addEventListener("click", closeDialog);

  // Event listener untuk form buku
  document.getElementById("book-form").addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah form dari pengiriman default

    // Ambil nilai dari form
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const pages = parseInt(document.getElementById("pages").value);
    const read = document.getElementById("read").checked;

    // Tambahkan buku baru ke library
    addBookToLibrary(title, author, pages, read);

    // Perbarui tampilan
    displayBooks();

    // Tutup dan reset form
    closeDialog();
    resetForm();
  });
});
