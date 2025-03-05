document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('multistep-form');
  const steps = document.querySelectorAll('.step');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const nextBtns = document.querySelectorAll('.next-btn');
  const progressBar = document.getElementById('progress-bar');
  const currentStepText = document.getElementById('current-step');
  let currentStep = 1;

  // Funzione per aggiornare la visibilità degli step con animazione
  function updateStep() {
    steps.forEach((step, index) => {
      const isVisible = index + 1 === currentStep;
      step.classList.toggle('hidden', !isVisible);
      if (isVisible) {
        step.classList.remove('visible');
        void step.offsetWidth;
        step.classList.add('visible');
      }
    });
    prevBtn.classList.toggle('hidden', currentStep === 1);
    nextBtn.classList.toggle('hidden', currentStep === steps.length);
    progressBar.style.width = `${(currentStep / steps.length) * 100}%`;
    currentStepText.textContent = currentStep;
  }

  // Eventi di navigazione
  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateStep();
    }
  });

  nextBtn.addEventListener('click', () => {
    const currentInput = steps[currentStep - 1].querySelector('input, select');
    if (currentInput && currentInput.checkValidity()) {
      if (currentStep < steps.length) {
        currentStep++;
        updateStep();
      }
    } else {
      currentInput.reportValidity();
    }
  });

  nextBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentInput = steps[currentStep - 1].querySelector('input, select');
      if (currentInput && currentInput.checkValidity()) {
        if (currentStep < steps.length) {
          currentStep++;
          updateStep();
        } else if (currentStep === steps.length) {
          form.dispatchEvent(new Event('submit'));
        }
      } else {
        currentInput.reportValidity();
      }
    });
  });

  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && currentStep <= steps.length) {
      e.preventDefault();
      const currentInput = steps[currentStep - 1].querySelector('input, select');
      if (currentInput && currentInput.checkValidity()) {
        if (currentStep < steps.length) {
          currentStep++;
          updateStep();
        } else {
          form.dispatchEvent(new Event('submit'));
        }
      } else {
        currentInput.reportValidity();
      }
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const messageElement = document.getElementById('form-message');

    try {
      const response = await fetch('https://hook.eu2.make.com/vy5unn8r6xabfywepd8e58xt8uvuj7jv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        messageElement.textContent = 'Grazie, la tua richiesta è stata inviata, a breve verrai contattato da un docente di Brix-IA';
        messageElement.classList.remove('text-red-400');
        messageElement.classList.add('text-[#80FDBE]');
        // Non resettiamo il form né torniamo al primo step
        // form.reset();
        // currentStep = 1;
        // updateStep();
      } else {
        messageElement.textContent = 'Ops! Qualcosa è andato storto.';
        messageElement.classList.remove('text-[#80FDBE]');
        messageElement.classList.add('text-red-400');
      }
    } catch (error) {
      messageElement.textContent = 'Errore di connessione. Riprova più tardi.';
      messageElement.classList.remove('text-[#80FDBE]');
      messageElement.classList.add('text-red-400');
    }
  });

  updateStep(); // Inizializza il form
});