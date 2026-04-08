document.addEventListener("DOMContentLoaded", () => {
  const BASE_URL =
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

  const dropDowns = document.querySelectorAll(".dropdown select");
  const getExchange = document.querySelector(".getExchange");
  const inputAmount = document.querySelector("#inputAmmount");
  const fromCurr = document.querySelector(".fromSelectOption");
  const toCurr = document.querySelector(".toSelectOption");
  const message = document.querySelector(".massage");
  const resetButton = document.querySelector(".resetButton");
  const submitImg = document.querySelector("#submitImg");

  // ✅ SAFE CHECK
  if (typeof countryList === "undefined") {
    console.error("countryList not found!");
    return;
  }

  /* ---------------- FLAG UPDATE ---------------- */
  const updateFlag = (element) => {
    const currCode = element.value;
    const info = countryList[currCode];
    const img = element.parentElement.querySelector("img");

    if (info && info.countryCode) {
      img.src = `https://flagsapi.com/${info.countryCode}/shiny/64.png`;
      img.style.display = "inline-block";
    } else {
      img.style.display = "none";
    }
  };

  /* ---------------- DROPDOWN SETUP ---------------- */
  dropDowns.forEach((select) => {
    const isFrom = select.name === "from";

    select.innerHTML = `
      <option value="" disabled selected>
        ${isFrom ? "FROM" : "TO"}
      </option>
    `;

    Object.keys(countryList).forEach((currCode) => {
      const info = countryList[currCode];
      const option = document.createElement("option");

      option.value = currCode;
      option.innerText = info?.countryName || currCode;

      select.appendChild(option);
    });

    select.addEventListener("change", (e) => updateFlag(e.target));
  });

  /* ---------------- SWAP ---------------- */
  submitImg.addEventListener("click", () => {
    if (!fromCurr.value || !toCurr.value) return;

    const temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;

    updateFlag(fromCurr);
    updateFlag(toCurr);
  });

  /* ---------------- EXCHANGE ---------------- */
  const exchangeResult = async (e) => {
    e.preventDefault();

    const amount = Number(inputAmount.value);

    if (!fromCurr.value || !toCurr.value) {
      showMessage("Please select both currencies ❗", "error");
      return;
    }

    if (!amount || amount < 1) {
      inputAmount.value = 1;
    }

    if (amount > 10000) {
      showMessage("Max limit is 10000", "error");
      return;
    }

    try {
      showMessage("Fetching rate...", "loading");

      const res = await fetch(
        `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`
      );
      const data = await res.json();

      const rate =
        data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

      const finalAmount = (amount * rate).toFixed(2);

      showMessage(
        `${amount} ${fromCurr.value} → ${finalAmount} ${toCurr.value}`,
        "success"
      );
    } catch (err) {
      showMessage("Something went wrong 😓", "error");
    }
  };

  /* ---------------- MESSAGE SYSTEM ---------------- */
  const showMessage = (text, type) => {
    message.innerText = text;
    message.className = `massage ${type}`;
  };

  getExchange.addEventListener("click", exchangeResult);
  submitImg.addEventListener("click", exchangeResult);

  /* ---------------- RESET ---------------- */
  resetButton.addEventListener("click", () => {
    inputAmount.value = "";
    message.innerText = "";
    message.className = "massage";

    fromCurr.selectedIndex = 0;
    toCurr.selectedIndex = 0;

    document.querySelectorAll(".flagImg").forEach((img) => {
      img.style.display = "none";
    });
  });
});
