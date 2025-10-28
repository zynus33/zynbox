const fileInput = document.getElementById("fileInput");
const dropZone = document.getElementById("dropZone");
const progressContainer = document.getElementById("progressContainer");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");
const resultContainer = document.getElementById("resultContainer");
const resultList = document.getElementById("resultList");

fileInput.addEventListener("change", handleFiles);
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragover");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragover")
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragover");
  handleFiles(e.dataTransfer.files);
});

function handleFiles(files) {
  if (!files.length) return;

  resultList.innerHTML = "";
  resultContainer.classList.add("hidden");
  progressContainer.classList.remove("hidden");

  Array.from(files).forEach(uploadFile);
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append("reqtype", "fileupload");
  formData.append("fileToUpload", file);

  const xhr = new XMLHttpRequest();
  xhr.open("POST", "https://catbox.moe/user/api.php");

  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + "%";
      progressText.textContent = `Mengunggah: ${percent}%`;
    }
  });

  xhr.onload = () => {
    progressContainer.classList.add("hidden");
    if (xhr.status === 200) {
      const url = xhr.responseText.trim();
      addResult(file.name, url);
    } else {
      alert("Gagal upload file: " + file.name);
    }
  };

  xhr.onerror = () => alert("Terjadi kesalahan jaringan saat upload.");

  xhr.send(formData);
}

function addResult(name, url) {
  resultContainer.classList.remove("hidden");
  const div = document.createElement("div");
  div.className = "result-item";
  div.innerHTML = `
    <input type="text" value="${url}" readonly />
    <button class="btn small" onclick="copyToClipboard('${url}')">Copy</button>
  `;
  resultList.appendChild(div);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => alert("Link disalin!"));
}
