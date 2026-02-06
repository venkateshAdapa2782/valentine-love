const backLink = document.querySelector(".fullpage__back");

if (backLink) {
  backLink.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.add("fade-out");
    const url = backLink.getAttribute("href");
    setTimeout(() => {
      window.location.href = url;
    }, 320);
  });
}
