let data = [];
let currentIndex = 0;

// Fetch data.json and merge any stored questions
async function loadData() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) throw new Error("Could not load data.json");
    data = await response.json();

    const stored = localStorage.getItem("userQuestions");
    if (stored) {
      const saved = JSON.parse(stored);
      data.forEach((item, i) => {
        if (saved[i]) item.questions = saved[i];
      });
    }

    renderContent();
  } catch (err) {
    console.error(err);
    document.getElementById("content").innerHTML =
      '<p style="color:red;">Error loading data.json</p>';
  }
}

// Display current video and its questions
function renderContent() {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = "";

  const item = data[currentIndex];
  if (!item) return;

  // Counter
  document.getElementById("videoCounter").textContent =
    `Video ${currentIndex + 1} of ${data.length}`;

  // Title
  const title = document.createElement("h2");
  title.textContent = item.title;
  contentDiv.appendChild(title);

  // Video player
  if (item.type === "type-video") {
    const video = document.createElement("video");
    video.src = item.video;
    video.controls = true;

    // IMPORTANT:
    // Do NOT set a fixed width here (it breaks mobile responsiveness).
    // video.width = 600;  <-- removed

    video.style.borderRadius = "10px";
    video.style.marginBottom = "1rem";
    contentDiv.appendChild(video);
  }

  // Questions
  const header = document.createElement("h3");
  header.textContent = "Reflection Questions";
  contentDiv.appendChild(header);

  const ul = document.createElement("ul");
  ul.id = "questionList";

  if (!item.questions || item.questions.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No questions yet. Add one below!";
    contentDiv.appendChild(p);
  } else {
    item.questions.forEach((q, idx) => {
      const li = document.createElement("li");
      li.textContent = q;

      const del = document.createElement("button");
      del.type = "button";
      del.textContent = "🗑️";
      del.className = "delete-btn";
      del.addEventListener("click", () => deleteQuestion(idx));

      li.appendChild(del);
      ul.appendChild(li);
    });

    contentDiv.appendChild(ul);
  }
}

// Add / delete / navigation
function addQuestion() {
  const input = document.getElementById("newQuestion");
  const q = input.value.trim();
  if (!q) return;

  if (!data[currentIndex].questions) data[currentIndex].questions = [];
  data[currentIndex].questions.push(q);

  saveQuestions();
  input.value = "";
  renderContent();
}

function deleteQuestion(i) {
  data[currentIndex].questions.splice(i, 1);
  saveQuestions();
  renderContent();
}

function showNext() {
  if (currentIndex < data.length - 1) {
    currentIndex++;
    renderContent();
  }
}

function showPrevious() {
  if (currentIndex > 0) {
    currentIndex--;
    renderContent();
  }
}

function goToVideo() {
  const input = document.getElementById("videoSearch");
  const num = parseInt(input.value, 10);

  if (!num || num < 1 || num > data.length) {
    alert(`Enter a valid number between 1 and ${data.length}`);
    return;
  }

  currentIndex = num - 1;
  renderContent();
  input.value = "";
}

function saveQuestions() {
  const all = data.map((item) => item.questions || []);
  localStorage.setItem("userQuestions", JSON.stringify(all));
}

// Event listeners
document.getElementById("nextBtn").addEventListener("click", showNext);
document.getElementById("prevBtn").addEventListener("click", showPrevious);
document
  .getElementById("addQuestionBtn")
  .addEventListener("click", addQuestion);
document.getElementById("goBtn").addEventListener("click", goToVideo);

// Initialize
loadData();