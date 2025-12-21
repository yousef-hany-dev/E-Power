const minRange = document.querySelector(".min-range");
const maxRange = document.querySelector(".max-range");

const minInput = document.querySelector(".min-input");
const maxInput = document.querySelector(".max-input");

const progress = document.querySelector(".progress");

function updateSlider() {
  let minVal = parseInt(minRange.value);
  let maxVal = parseInt(maxRange.value);

  if (maxVal - minVal < 500) {
    if (event.target === minRange) {
      minRange.value = maxVal - 500;
    } else {
      maxRange.value = minVal + 500;
    }
    return;
  }

  minInput.value = minVal;
  maxInput.value = maxVal;

  progress.style.left = (minVal / 10000) * 100 + "%";
  progress.style.right = 100 - (maxVal / 10000) * 100 + "%";
}

minRange.oninput = updateSlider;
maxRange.oninput = updateSlider;

minInput.oninput = () => {
  minRange.value = minInput.value;
  updateSlider();
};

maxInput.oninput = () => {
  maxRange.value = maxInput.value;
  updateSlider();
};

updateSlider();
