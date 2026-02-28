(async function() {
 const inputString = prompt("Enter stock sell information:");
 if (!inputString) return;

// "SELL","USD","US3723032062","GENMAB A/S -SP ADR","DK","2026-01-20","-24","-625.011936","-1.00468","751.51532"

  const TARGET_CURRENCY = "EUR";
  const DEFAULT_COUNTRY = "США";

  function getCountryByCountryCode(code) {
     if (code === "NO") return "Норвегия";
     if (code === "DK") return "Дания";
     if (code === "CN") return "Китайская Республика";
     if (code === "BR") return "Бразилия";
     if (code === "HK") return "Гонконг";
     return DEFAULT_COUNTRY;
  }

  function reformatDate(input) {
    const [year, month, day] = input.split("-");
    return `${day}.${month}.${year}`;
  }

  function dispatchEventInput(control) {
      control.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function dispatchEventChange(control) {
      control.dispatchEvent(new Event("change", { bubbles: true }));
  }

  function makePositiveNumber(value) {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) {
      alert("Unable to parse number: " + value);
      return value;
    }
    return String(Math.abs(parsedValue));
  }

  console.log("Input string: " + inputString);

  const inputRawArr = inputString.split(",");
  console.log("After split: " + inputRawArr);

  // Remove extra spaces and quotes
  const arr = inputRawArr.map(item => {
    let s = (item || "").trim();
    if (s.length >= 2 && s.startsWith('"') && s.endsWith('"')) {
      s = s.slice(1, -1);
    }
    return s;
  });

  console.log("Cleaned fields: " + arr);
  if (arr.length !== 10) {
      alert("Please enter a valid comma separated string");
      return;
  }

  if (arr[0] !== "SELL") {
      alert("Only SELL transactions are supported");
      return;
  }

  const sellCurrency = arr[1];

  const data = {
    isin: arr[2],
    name: arr[3],
    country_code: arr[4],
    date: arr[5],
    volume: makePositiveNumber(arr[6]),
    priceBuy: makePositiveNumber(arr[7]),
    commission: makePositiveNumber(arr[8]),
    priceSell: makePositiveNumber(arr[9]) 
  }

  if (sellCurrency !== TARGET_CURRENCY) {
    try {
      const response = await fetch(`https://api.frankfurter.app/${data.date}?amount=1&from=${sellCurrency}&to=${TARGET_CURRENCY}`);
      const conversionData = await response.json();
      const rate = conversionData.rates[TARGET_CURRENCY];
      console.log(`Conversion rate from ${sellCurrency} to ${TARGET_CURRENCY}: ${rate}`);
      data.priceSell = (parseFloat(data.priceSell) * parseFloat(rate)).toFixed(2);
      data.priceBuy = (parseFloat(data.priceBuy) * parseFloat(rate)).toFixed(2);
      data.commission = (parseFloat(data.commission) * parseFloat(rate)).toFixed(2);
    } catch (error) {
      console.error("Error converting currency:", error);
      alert("Failed to convert currency. Please check the console for details.");
      return;
    }
  }

  const isin = data.isin;
  console.log("isin: " + isin);
  const name = data.name;
  console.log("name: " + name);
  const countryCode = data.country_code;
  console.log("country code: " + countryCode);
  const date = data.date;
  console.log("date: " + date);
  const volume = data.volume;
  console.log("volume: " + volume);
  const priceBuy = data.priceBuy;
  console.log("priceBuy: " + priceBuy);
  const commission = data.commission;
  console.log("commission: " + commission);
  const priceSell = data.priceSell;
  console.log("priceSell: " + priceSell);

  // Simulate clicking the "New Row" button
  const newRowBtn = document.querySelector("#stockfunds-new-row-button");
  if (newRowBtn) {
      newRowBtn.click();
  } else {
      alert("No new button found");
  }

  await new Promise(r => setTimeout(r, 500));

  const inputFieldIsin = document.querySelector("#add_stockfunds_isinCode");
  if (inputFieldIsin) {
    inputFieldIsin.value = isin;
    dispatchEventInput(inputFieldIsin);
  }

  const inputFieldName = document.querySelector("#add_stockfunds_name");
  if (inputFieldName) {
    inputFieldName.value = name;
    dispatchEventInput(inputFieldName);
  }

  function selectCountry(valueToSelect) {
    setTimeout(() => {
      document.querySelector('#add_stockfunds_state').click();

      setTimeout(() => {
        const options = [...document.querySelectorAll('[id^="add_stockfunds_state-"]')];
        console.log("Country option length: " + options.length);
        console.log("Country options: " + options.map(el => el.textContent.trim()).join(", "));

        const foundItem = options.find(el => 
          el.textContent.trim() === valueToSelect
        );

        if (foundItem) {
          console.log('Found option: ' + foundItem.textContent.trim());
          foundItem.click();
          const event = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13
          });
          foundItem.dispatchEvent(event);

        } else {
          console.log('Option ' + valueToSelect + ' not found');
          document.querySelector('#add_stockfunds_state').click();
        }
      }, 100);
    }, 200);
  }

  selectCountry(getCountryByCountryCode(countryCode));
  await new Promise(r => setTimeout(r, 320));

  function selectType() {
    const dropdownButton = document.querySelector('#add_stockfunds_type');
    if (!dropdownButton) return;

    dropdownButton.click();

    setTimeout(() => {
      // Always "Stock"
      const inputElement = document.querySelector('#add_stockfunds_type-0');
      inputElement.click();

      const event = new KeyboardEvent('keydown', {
        bubbles: true,
        cancelable: true,
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        which: 13
      });
      inputElement.dispatchEvent(event);
    }, 200);
  }
  selectType();

  function setDate() {
    const inputFieldDate = document.querySelector('#add_stockfunds_date');
    if (!inputFieldDate) return;

    inputFieldDate.click();

    setTimeout(() => {
      inputFieldDate.value = reformatDate(date);
      dispatchEventInput(inputFieldDate);
      dispatchEventChange(inputFieldDate);
    }, 500);
  }
  setDate(date);

  const inputFieldAmount = document.querySelector("#add_stockfunds_amount");
  if (inputFieldAmount) {
    inputFieldAmount.value = volume;
    dispatchEventInput(inputFieldAmount);
  }

  const inputFieldCostAmount = document.querySelector("#add_stockfunds_costAmount");
  if (inputFieldCostAmount) {
    inputFieldCostAmount.value = priceBuy;
    dispatchEventInput(inputFieldCostAmount);
  }

  if (commission >= 0.5) {
    const inputFieldAppropriationCost = document.querySelector("#add_stockfunds_appropriationCost");
    if (inputFieldAppropriationCost) {
      const finalCommission = Math.round(commission * 100) / 100;
      inputFieldAppropriationCost.value = Math.round(finalCommission);
      dispatchEventInput(inputFieldAppropriationCost);
    }
  }

  const inputFieldSellingPrice = document.querySelector("#add_stockfunds_sellingPrice");
  if (inputFieldSellingPrice) {
    inputFieldSellingPrice.value = priceSell;
    dispatchEventInput(inputFieldSellingPrice);
  }

  await new Promise(r => setTimeout(r, 900));

  const saveBtn = document.querySelector("#add-stockfunds-save-button");
  if (saveBtn) {
      saveBtn.click();
  }

  await new Promise(r => setTimeout(r, 900));

  const xpath = "/html/body/div/div[2]/div/div/div/div/div/a";
  const element = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
  ).singleNodeValue;

  if (element) {
    element.click();
  }
})();
