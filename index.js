const inputField = document.querySelector(".inputId");
const errorMessage = document.querySelector("form h1");
const congratulationMessage = document.querySelector("form h2");
const button = document.querySelector(".buttonSubmit");

const elementId = document.querySelector(".loyalty-top-right h1");
const elementClientName = document.querySelector(".profile-details h1");
const elementClientSince = document.querySelector(".profile-details p");
const elementProfileImage = document.querySelector(".profile-image img");
const elementCutCount = document.querySelector(".history-top p");
const elementAppointmentHistory = document.querySelector(".history-list");
const elementCutsRemaining = document.querySelector(".countRemainingCuts h1");
const elementCutsRemainingText = document.querySelector(".countRemainingCuts span");
const elementTotalCuts = document.querySelector(".gradient-bar");
const elementProgressBarSize = document.querySelector(".gradient-bar div");
const elementsCheckLoyalty = document.querySelectorAll(".loyalty-item img");

// Evento quando submeter o formulário
document.querySelector("form").onsubmit = function (event) {
  // Regex para validar o formato 123-456-789-123
  const regex = /^\d{3}-\d{3}-\d{3}-\d{3}$/;
  // Verificando se o input se encaixa no regex ou não
  if (!regex.test(inputField.value)) {
    // Alterando a mensagem de erro
    errorMessage.classList.add("errorMessage");
    errorMessage.textContent = "O formato deve ser 000-000-000-000";
    // Timeout para remover a mensagem de erro após 5 segundos
    setTimeout(function () {
      errorMessage.textContent = "";
      errorMessage.classList.remove("errorMessage");
    }, 3000);
  }
  event.preventDefault(); // Evita o envio do formulário se o padrão não for correspondido
  buscarDadosClientes(inputField.value);
};

// Evento quando inserir o ID
document.querySelector(".inputId").oninput = function (event) {
  // Campo do input
  const inputField = event.target;
  // Desativar o botão caso input esteja vazio
  if (inputField.value === "") {
    button.setAttribute("disabled", "disabled");
  } else {
    button.removeAttribute("disabled");
  }
  // Remove qualquer caractere que não seja número
  let value = inputField.value.replace(/\D/g, "");
  // Adiciona os hífens automaticamente conforme o usuário digita
  if (value.length > 3) {
    value = value.substring(0, 3) + "-" + value.substring(3);
  }
  if (value.length > 7) {
    value = value.substring(0, 7) + "-" + value.substring(7);
  }
  if (value.length > 11) {
    value = value.substring(0, 11) + "-" + value.substring(11);
  }
  inputField.value = value.substring(0, 15);
};

// Buscar informações do Cliente
async function buscarDadosClientes(id) {
  const response = await fetch(`http://localhost:3333/clients/${id}`);

  if (response.status === 404) {
    errorMessage.classList.add("errorMessage");
    errorMessage.textContent = `O ID: ${id} é Inválido ou não existente.`;
    setTimeout(function () {
      errorMessage.textContent = "";
      errorMessage.classList.remove("errorMessage");
    }, 3000);
  }

  const data = await response.json();

  elementId.textContent = `ID: ${data.id}`;
  elementClientName.textContent = data.name;
  elementClientSince.textContent = `Cliente desde ${data.clientSince}`;
  elementProfileImage.setAttribute("src", data.profileImage);
  elementCutCount.textContent =
    data.loyaltyCard["totalCuts"] > 1 ? `${data.loyaltyCard["totalCuts"]} cortes` : `${data.loyaltyCard["totalCuts"]} corte`;
  data.appointmentHistory.map((history) => {
    let newHistoryElement = document.createElement("li");
    newHistoryElement.classList.add("history-list-item");
    newHistoryElement.innerHTML = `
    <div class="list-left">
      <h1>${history["date"]}</h1>
      <p>${history["time"]}</p>
    </div>
      <div class="list-right">
      <img src="./assets/SealCheck.svg" />
    </div>
    `;
    elementAppointmentHistory.appendChild(newHistoryElement);
  });
  elementCutsRemaining.textContent = data.loyaltyCard["cutsRemaining"];
  elementCutsRemainingText.textContent = data.loyaltyCard["cutsRemaining"] > 1 ? `cortes restantes` : `corte restante`;
  elementTotalCuts.dataset.content = `${data.loyaltyCard["totalCuts"]} de ${data.loyaltyCard["cutsNeeded"]}`;
  elementProgressBarSize.style.width = `${data.loyaltyCard["totalCuts"] * 10}%`;

  const arrayElementsCheckLoyalty = Array.from(elementsCheckLoyalty);
  let arrayCheckedLoyalty = [];
  arrayElementsCheckLoyalty.map((item, index) => {
    if (index + 1 <= data.loyaltyCard["totalCuts"]) {
      arrayCheckedLoyalty.push(item);
    }
  });
  arrayCheckedLoyalty.map((item) => {
    item.dataset.content = "checked";
  });

  if (data.loyaltyCard["totalCuts"] === 10) {
    setTimeout(function () {
      congratulationMessage.classList.add("congratulationMessage");
      congratulationMessage.textContent = "Parabéns! Seu próximo corte é gratuito!";
      setTimeout(function () {
        congratulationMessage.textContent = "";
        congratulationMessage.classList.remove("congratulationMessage");
      }, 3000);
    }, 2000);
  }
}
