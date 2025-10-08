document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* ==============================
     NOTIFICHE
  ============================== */
  const notification = document.getElementById("notification");
  const notificationBody = document.querySelector(".notification-body");

  function showSendFormNotification(text) {
    notificationBody.innerHTML = text;
    notification.classList.add("show");
    notification.style.display = "block";

    const hide = () => notification.classList.add("hide");
    notification.addEventListener("click", hide);
    notificationBody.addEventListener("click", hide);

    setTimeout(hide, 5000);
    setTimeout(() => {
      notification.style.display = "none";
      notification.classList.remove("show", "hide");
    }, 7000);
  }

  /* ==============================
     GESTIONE FORM CLASSICO (PHP)
  ============================== */
  document.querySelectorAll(".needs-validation").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      form.classList.add("was-validated");

      if (!form.checkValidity()) {
        return;
      }

      form.querySelector("button[type='submit']").classList.add("disabled");

      showSendFormNotification(`
        <div class="d-flex align-items-center">
          <div class="spinner-border text-primary me-2" role="status" aria-hidden="true"></div>
          <span>Invio dei dati in corso...</span>
        </div>
      `);

      sendFormData(form);
    });
  });

  function sendFormData(form) {
    fetch("php/sendForm.php", {
      method: "POST",
      body: new FormData(form),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        showSendFormNotification(data);
        form.reset();
        form
          .querySelector("button[type='submit']")
          .classList.remove("disabled");
      })
      .catch((error) => {
        console.error("ERRORE NEL PHP", error);
      });
  }

  /* ==============================
     ANIMAZIONE CAMBIO SEZIONE
  ============================== */
  const openBtn = document.getElementById("openFormBtn");
  const serviceContent = document.querySelector(".service-content");
  const serviceForm = document.querySelector(".service-form");

  openBtn.addEventListener("click", () => {
    serviceContent.classList.remove("animate__fadeInRight");
    serviceContent.classList.add("animate__fadeOutLeft");

    setTimeout(() => {
      serviceContent.classList.add("d-none");
      serviceContent.classList.remove("fade", "show", "animate__fadeOutLeft");

      serviceForm.classList.remove("d-none");
      serviceForm.classList.add("fade", "show", "animate__fadeInRight");
    }, 300);
  });

  /* ==============================
     PERCORSI DOMANDE
  ============================== */
  const questionPaths = {
    //############################################################
    //AGGIUNGERE DOMANDA E INPUT IN COMUNE QUANDO VIENE FINITO UNO DEI 2 PATH
    //############################################################

    newpc: [
      {
        text: "Valuteresti dei componenti usati?",
        options: [
          "No, preferisco acquistare componenti nuovi",
          "Si, vanno bene anche usati",
          "Si, voglio solo componenti usati",
        ],
      },
      {
        text: "Hai già uno schermo?",
        options: ["Si, ne ho già uno", "No, ho anche bisogno di uno schermo"],
      },
      {
        text: "Puoi indicarmi il tuo budget?",
        options: ["€ 500-800", "€ 800-1200", "Oltre €1200"],
      },
    ],
    assistance: [
      {
        text: "Che tipo di problema hai?",
        options: ["Hardware", "Software"],
      },
      //###########################################
      // AGGIUNGERE INPUT PER CHIEDERE DESCRIZIONE DEL PROBLEMA
      //###########################################
      {
        text: "Hai bisogno di intervento a domicilio?",
        options: ["Sì", "No"],
      },
    ],
  };

  /* ==============================
     VARIABILI GLOBALI FORM
  ============================== */
  const formContainer = document.getElementById("main-form");
  let answers = {};
  let currentPath = [];
  let stepIndex = 0;

  /* ==============================
     FUNZIONE ANIMAZIONE
  ============================== */
  function animateForm(container) {
    container.classList.remove("animate__fadeInRight");
    void container.offsetWidth; // forza reflow
    container.classList.add("animate__fadeInRight");
  }

  /* ==============================
     MOSTRA DOMANDE
  ============================== */
  function showQuestion(step) {
    formContainer.innerHTML = "";
    const q = currentPath[step];

    // titolo domanda
    const h2 = document.createElement("h2");
    h2.textContent = q.text;
    formContainer.appendChild(h2);

    // opzioni
    const ul = document.createElement("ul");
    ul.style.fontSize = "1.2rem";
    q.options.forEach((opt) => {
      const li = document.createElement("li");
      const p = document.createElement("p");
      p.className = "service-form-btn";
      p.textContent = opt;
      p.addEventListener("click", () => {
        answers[q.text] = opt;
        stepIndex++;
        if (stepIndex < currentPath.length) {
          showQuestion(stepIndex);
        } else {
          submitForm(); // fine percorso senza domanda finale
        }
      });
      li.appendChild(p);
      ul.appendChild(li);
    });
    formContainer.appendChild(ul);

    formContainer.classList.remove("d-none");
    formContainer.classList.add("fade", "show");
    animateForm(formContainer);
  }

  /* ==============================
     SCELTA PERCORSO INIZIALE
  ============================== */
  formContainer.querySelectorAll(".service-form-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const choice = e.target.dataset.choice;
      if (!choice) return;
      currentPath = questionPaths[choice];
      stepIndex = 0;
      showQuestion(stepIndex);
    });
  });

  /* ==============================
     INVIO RISPOSTE
  ============================== */
  function submitForm() {
    console.log("Risposte raccolte:", answers);
    // qui puoi inviare con fetch() a PHP se vuoi
  }
});

// const domande = [
//   { id: "domanda1", data: "Questa è la prima domanda" },
//   { id: "domanda2", data: "Questa è la seconda domanda" },
// ];

// const strutturaDomande = {
//   ramo00: ["ramo02", "ramo01"],
//   ramo01: ["domanda1", "domanda2"],
//   ramo02: ["domanda2", "ramo01"],
// };

// function ricorsivami(id){
//   const oggetto = strutturaDomande.id;
//   // fa parte dei rami
//   if (oggetto){
//     oggetto.forEach(element => {
//       ricorsivami(element)
//     });

//     // è una domanda
//   } else {
//     const domanda = domande.find() where domande.id === id
//     console.log('Domanda:')
//     console.log(domanda)
//   }
// }
