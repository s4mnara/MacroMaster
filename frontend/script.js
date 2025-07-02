document.addEventListener("DOMContentLoaded", function () {
  const healthForm = document.getElementById("health-form");
  const goalForm = document.getElementById("goal-form");
  const macrosForm = document.getElementById("macros-form");
  const adjustmentInput = document.getElementById("adjustment");
  const adjustmentValue = document.getElementById("adjustment-value");

  let tdee = 0;
  let adjustedCalories = 0;
  let chartInstance = null;

  healthForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Pega os dados do formulário
    const age = +document.getElementById("age").value;
    const sex = document.getElementById("sex").value;
    const weight = +document.getElementById("weight").value;
    const height = +document.getElementById("height").value;
    const activity = +document.getElementById("activity").value;

    // Calcula BMR (Mifflin-St Jeor)
    const bmr = sex === "male"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    // TDEE = BMR * fator atividade
    tdee = Math.round(bmr * activity);

    // Calcula IMC
    const heightMeters = height / 100;
    const bmi = weight / (heightMeters ** 2);
    const bmiClass = getBmiClassification(bmi);

    // Peso ideal (média do intervalo IMC saudável)
    const idealWeight = Math.round(22 * heightMeters ** 2);

    // Mostra resultados
    document.getElementById("tdee-result").textContent = tdee;
    document.getElementById("bmi-result").textContent = bmi.toFixed(1);
    document.getElementById("bmi-class").textContent = bmiClass;
    document.getElementById("ideal-weight").textContent = idealWeight;

    document.getElementById("health-results").style.display = "block";
  });

  // Atualiza texto da porcentagem do ajuste
  adjustmentInput.addEventListener("input", () => {
    adjustmentValue.textContent = `${adjustmentInput.value}%`;
  });

  goalForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const goal = document.getElementById("goal").value;
    const adjustment = +adjustmentInput.value;

    adjustedCalories = Math.round(tdee * (1 + adjustment / 100));
    document.getElementById("adjusted-calories").textContent = adjustedCalories;
  });

  macrosForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const proteinPct = +document.getElementById("protein").value;
    const carbsPct = +document.getElementById("carbs").value;
    const fatsPct = +document.getElementById("fats").value;

    const total = proteinPct + carbsPct + fatsPct;
    if (total !== 100) {
      alert("A soma dos macronutrientes deve ser 100%");
      return;
    }

    // Converte % para calorias
    const proteinCals = adjustedCalories * (proteinPct / 100);
    const carbsCals = adjustedCalories * (carbsPct / 100);
    const fatsCals = adjustedCalories * (fatsPct / 100);

    // Converte calorias para gramas
    const proteinGrams = Math.round(proteinCals / 4);
    const carbsGrams = Math.round(carbsCals / 4);
    const fatsGrams = Math.round(fatsCals / 9);

    // Mostra resultados
    document.getElementById("protein-result").textContent = `${proteinGrams}`;
    document.getElementById("carbs-result").textContent = `${carbsGrams}`;
    document.getElementById("fats-result").textContent = `${fatsGrams}`;
    document.getElementById("macros-result").style.display = "block";

    // Gera gráfico
    renderChart(proteinGrams, carbsGrams, fatsGrams);
  });

  function getBmiClassification(bmi) {
    if (bmi < 18.5) return "Abaixo do peso";
    if (bmi < 24.9) return "Peso normal";
    if (bmi < 29.9) return "Sobrepeso";
    if (bmi < 34.9) return "Obesidade grau I";
    if (bmi < 39.9) return "Obesidade grau II";
    return "Obesidade grau III";
  }

  function renderChart(protein, carbs, fats) {
    const ctx = document.getElementById("macroChart").getContext("2d");

    // Destroi gráfico anterior
    if (chartInstance) chartInstance.destroy();

    chartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Proteínas", "Carboidratos", "Gorduras"],
        datasets: [{
          data: [protein, carbs, fats],
          backgroundColor: ["#4caf50", "#2196f3", "#ff9800"]
        }]
      },
    options: {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    animateScale: true,     // anima a escala do gráfico (expansão)
    animateRotate: true     // anima a rotação dos arcos
  },
  plugins: {
    legend: {
      position: "bottom"
    }
  }
}


    });
  }
});
