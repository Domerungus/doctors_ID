let doctorsData = [];
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

// Modal Elements
const modalOverlay = document.getElementById('doctorModal');
const closeModalBtn = document.getElementById('closeModal');
const modalName = document.getElementById('modalName');
const modalSpecialty = document.getElementById('modalSpecialty');
const modalIestKods = document.getElementById('modalIestKods');
const modalId = document.getElementById('modalId');

// Load Data
async function loadDoctors() {
  try {
    const response = await fetch('./doctors.json');
    doctorsData = await response.json();
    // Start with empty list to prompt user to search
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <p style="color: #ff5252;">Ошибка при загрузке данных о врачах.</p>
      </div>
    `;
  }
}

// Search Logic
function filterDoctors(query) {
  if (!query) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🩺</div>
        <p>Начните вводить имя врача для поиска</p>
      </div>
    `;
    return;
  }
  
  query = query.toLowerCase().trim();
  const tokens = query.split(/\s+/);
  
  const results = doctorsData.filter(doctor => {
    const name = String(doctor.ARSTS).toLowerCase();
    // The doctor name must match all search tokens
    return tokens.every(token => name.includes(token));
  });
  
  renderResults(results.slice(0, 50)); // Limit to 50 results to keep UI smooth
}

function renderResults(results) {
  if (results.length === 0) {
    resultsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <p>Врач не найден</p>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = '';
  
  results.forEach((doctor, index) => {
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.style.animationDelay = `${index * 0.03}s`;
    
    card.innerHTML = `
      <div class="doctor-avatar">👨‍⚕️</div>
      <div class="doctor-info">
        <div class="doctor-name">${doctor.ARSTS}</div>
        <div class="doctor-specialty">${doctor.SPECIALITATE || 'Специальность не указана'}</div>
      </div>
    `;
    
    card.addEventListener('click', () => showModal(doctor));
    resultsContainer.appendChild(card);
  });
}

// Modal Logic
function showModal(doctor) {
  modalName.textContent = doctor.ARSTS;
  modalSpecialty.textContent = doctor.SPECIALITATE || 'Не указана';
  modalIestKods.textContent = doctor.IEST_KODS || '-';
  modalId.textContent = doctor.ID || '-';
  
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Event Listeners
searchInput.addEventListener('input', (e) => {
  filterDoctors(e.target.value);
});

closeModalBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    closeModal();
  }
});

// Initialize
loadDoctors();
