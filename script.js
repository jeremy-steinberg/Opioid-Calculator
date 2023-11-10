// Updated conversion ratios based on the new table
const conversionFactors = {
  codeine: 0.15,
  fentanyl: 2.4, // for transdermal patches in mcg/hr
  hydrocodone: 1.0,
  hydromorphone: 5.0,
  methadone: 4.7,
  morphine: 1.0,
  oxycodone: 1.5,
  oxymorphone: 3.0,
  tapentadol: 0.4,
  tramadol: 0.2
};

function calculateMME(dose, opioid) {
  // Convert the input dose to MME (Morphine Milligram Equivalent)
  const mme = dose * conversionFactors[opioid];
  return mme;
}

function convertOpioid(fromDose, fromOpioid, toOpioid) {
  // First, convert the dose from the original opioid to MME
  const fromMME = calculateMME(fromDose, fromOpioid);
  
  // Then, convert from MME to the target opioid dose
  // This is done by dividing by the target opioid's conversion factor
  const toDose = fromMME / conversionFactors[toOpioid];
  
  return toDose;
}

document.addEventListener('DOMContentLoaded', function() {
  const modeSelection = document.getElementById('modeSelection');
  const singleOpioidSection = document.getElementById('singleOpioid');
  const multipleOpioidsSection = document.getElementById('multipleOpioids');
  const opioidContainer = document.getElementById('opioidInputs');
  const resultElement = document.getElementById('singleResult');
  const totalMMEResultElement = document.getElementById('totalMME');

  // Hide or show the remove button based on the number of opioid inputs
  function updateRemoveButtonsVisibility() {
    const removeButtons = document.getElementsByClassName('removeOpioid');
    if (removeButtons.length === 1) {
      removeButtons[0].style.display = 'none';
    } else {
      Array.from(removeButtons).forEach(button => button.style.display = 'inline');
    }
  }

  // Toggle calculator mode based on dropdown selection
  modeSelection.addEventListener('change', function() {
    if (this.value === 'single') {
      singleOpioidSection.classList.remove('hidden');
      multipleOpioidsSection.classList.add('hidden');
    } else {
      singleOpioidSection.classList.add('hidden');
      multipleOpioidsSection.classList.remove('hidden');
    }
  });

  // Event listener for single opioid calculation
  document.getElementById('calculateSingle').addEventListener('click', function() {
    const fromDose = parseFloat(document.getElementById('fromDose').value);
    const fromOpioid = document.getElementById('fromOpioid').value;
    const toOpioid = document.getElementById('toOpioid').value;
    
    if (isNaN(fromDose)) {
      resultElement.textContent = "Please enter a valid dose.";
      return;
    }
    if (fromOpioid === toOpioid) {
      resultElement.textContent = "Please select two different opioids for conversion.";
      return;
    }
    const convertedDose = convertOpioid(fromDose, fromOpioid, toOpioid);
    resultElement.textContent = `The equivalent dose of ${toOpioid} is ${convertedDose.toFixed(2)} mg.`;
  });

  // Event listener for adding an opioid
  document.getElementById('addOpioid').addEventListener('click', function() {
    const newOpioidInput = opioidContainer.firstElementChild.cloneNode(true);
    newOpioidInput.querySelector('.opioidDose').value = ''; // Reset the dose input
    const removeButton = newOpioidInput.querySelector('.removeOpioid');
    removeButton.style.display = 'inline'; // Show the remove button for the new input
    removeButton.addEventListener('click', function() {
      this.parentElement.remove();
      updateRemoveButtonsVisibility();
    });
    opioidContainer.appendChild(newOpioidInput);
    updateRemoveButtonsVisibility();
  });

  // Event listener for calculating total MME
  document.getElementById('calculateMultiple').addEventListener('click', function() {
    let totalMME = 0;
    const opioidInputs = document.getElementsByClassName('opioidInput');
    Array.from(opioidInputs).forEach(input => {
      const opioidType = input.getElementsByClassName('opioidType')[0].value;
      const dose = parseFloat(input.getElementsByClassName('opioidDose')[0].value);
      
      if (!isNaN(dose)) {
        totalMME += calculateMME(dose, opioidType);
      }
    });

    totalMMEResultElement.textContent = `The total Morphine Milligram Equivalent (MME) is: ${totalMME.toFixed(2)}`;
  });

  // Set the first remove button to hide and bind its event
  const firstRemoveButton = opioidContainer.querySelector('.removeOpioid');
  firstRemoveButton.style.display = 'none';
  firstRemoveButton.addEventListener('click', function() {
    this.parentElement.remove();
    updateRemoveButtonsVisibility();
  });

  // Update the visibility of remove buttons on initial load
  updateRemoveButtonsVisibility();
});

