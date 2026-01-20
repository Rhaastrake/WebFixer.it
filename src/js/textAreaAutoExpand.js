function enableAutoExpand(textArea) {
  textArea.addEventListener("input", () => {
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + "px";
  });

  if (textArea.value) {
    textArea.style.height = textArea.scrollHeight + "px";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const textAreas = document.querySelectorAll(".auto-expand");
  textAreas.forEach(enableAutoExpand);
});

document.addEventListener("input", (e) => {
  if (e.target.matches(".auto-expand")) {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  }
});
