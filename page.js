const backLink = document.querySelector(".fullpage__back");

if (backLink) {
  backLink.addEventListener("click", (event) => {
    event.preventDefault();
    const url = backLink.getAttribute("href");
    window.location.href = url;
  });
}
