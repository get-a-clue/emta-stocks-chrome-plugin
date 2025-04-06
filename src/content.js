(async function() {
 const inputString = prompt("Enter stock sell information:");
 if (!inputString) return;

 // example:
 // US6792951054,OKTA INC,2024-01-16,1,66.76,0.03,76.02

  const DEFAULT_COUNTRY = "Соединенные Штаты Америки";

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

  console.log("Input string: " + inputString);

  const arr = inputString.split(",");
  console.log("After split: " + arr);
  if (arr.length < 7) {
      alert("Please enter a valid comma separated string");
      return;
  }

  const isin = arr[0];
  console.log("isin: " + isin);
  const name = arr[1];
  console.log("name: " + name);
  const date = arr[2];
  console.log("date: " + date);
  const volume = arr[3];
  console.log("volume: " + volume);
  const priceBuy = arr[4];
  console.log("priceBuy: " + priceBuy);
  const commission = arr[5];
  console.log("commission: " + commission);
  const priceSell = arr[6];
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
    const dropdownButton = document.querySelector('#add_stockfunds_state');
    if (!dropdownButton) return;

    dropdownButton.click();

    setTimeout(() => {
      const inputElement = document.querySelector('#select-user-input-element');
      inputElement.value = valueToSelect;
      dispatchEventInput(inputElement);

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
  selectCountry(DEFAULT_COUNTRY);

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

  if (commission >= 0.95) {
    const inputFieldAppropriationCost = document.querySelector("#add_stockfunds_appropriationCost");
    if (inputFieldAppropriationCost) {
      const finalCommission = commission < 1.3 ? 1 : Math.round(commission * 100) / 100;
      inputFieldAppropriationCost.value = Math.round(finalCommission);
      dispatchEventInput(inputFieldAppropriationCost);
    }
  }

  const inputFieldSellingPrice = document.querySelector("#add_stockfunds_sellingPrice");
  if (inputFieldSellingPrice) {
    inputFieldSellingPrice.value = priceSell;
    dispatchEventInput(inputFieldSellingPrice);
  }

  await new Promise(r => setTimeout(r, 800));

  const saveBtn = document.querySelector("#add-stockfunds-save-button");
  if (saveBtn) {
      saveBtn.click();
  }

  await new Promise(r => setTimeout(r, 800));

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
