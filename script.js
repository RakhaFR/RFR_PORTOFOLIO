/***********************************
    =====     active navbar      ======
    ***********************************/
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".navbar a");

function setActiveLink() {
  let scrollY = window.scrollY;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"));

      const activeLink = document.querySelector(
        `.navbar a[href="#${sectionId}"]`,
      );
      if (activeLink) activeLink.classList.add("active");
    }
  });
}

window.addEventListener("scroll", setActiveLink);

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
  });
});


    /***********************************
    ===== Auto klik navbar direct ======
    ***********************************/

const check = document.getElementById("check");

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    check.checked = false;
  });
});

    /***********************************
    =====   pop up image gallery ======
    ***********************************/
const popup = document.getElementById("popupGallery");
const btnMore = document.querySelector(".btn-more");
const btnClose = document.querySelector(".popup-gallery .close");

const selectCategory = document.querySelector(".gallery-thumbs select");
const thumbs = document.querySelectorAll(".thumb-grid .thumb");

selectCategory.addEventListener("change", () => {
  const category = selectCategory.value.toLowerCase();

  thumbs.forEach((thumb) => {
    const thumbCategory = thumb.getAttribute("data-category");

    if (category === "all" || category === "category..." || category === "") {
      thumb.style.display = "block"; // tampil semua
    } else if (thumbCategory === category) {
      thumb.style.display = "block"; // tampil sesuai kategori
    } else {
      thumb.style.display = "none"; // sembunyikan yg lain
    }
  });
});

btnMore.addEventListener("click", () => {
  popup.style.display = "block";
});

btnClose.addEventListener("click", () => {
  popup.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === popup) {
    popup.style.display = "none";
  }
});
