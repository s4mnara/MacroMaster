document.addEventListener("DOMContentLoaded", function () {
  const isIndexPage = !!document.getElementById("health-form");
  const isMacrosPage = !!document.getElementById("goal-form");

  if (isIndexPage) {
    // Página 1: coleta dados e calcula TDEE/IMC
    const healthForm = document.getElementById("health-form");
    const resultsSection = document.getElementById("health-results");
    const btnToMacros = document.getElementById("to-macros");

    healthForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const age = +document.getElementById("age").value;
      const sex = document.getElementById("sex").value;
      const weight = +document.getElementById("weight").value;
      const height = +document.getElementById("height").value;
      const activity = +document.getElementById("activity").value;

      const bmr = sex === "male"
        ? 10 * weight + 6.25 * height - 5 * age + 5
        : 10 * weight + 6.25 * height - 5 * age - 161;

      const tdee = Math.round(bmr * activity);

      const heightMeters = height / 100;
      const bmi = weight / (heightMeters ** 2);
      const bmiClass = getBmiClassification(bmi);
      const idealWeight = Math.round(22 * heightMeters ** 2);

      // Mostra resultados na página
      document.getElementById("tdee-result").textContent = tdee;
      document.getElementById("bmi-result").textContent = bmi.toFixed(1);
      document.getElementById("bmi-class").textContent = bmiClass;
      document.getElementById("ideal-weight").textContent = idealWeight;

      resultsSection.style.display = "block";

      // Salva dados no localStorage para próxima página
      localStorage.setItem("tdee", tdee);
      localStorage.setItem("weight", weight);
      localStorage.setItem("height", height);

      // Mostra botão para ir para página dos macros
      btnToMacros.style.display = "inline-block";
    });

    // Função para classificar o IMC
    function getBmiClassification(bmi) {
      if (bmi < 18.5) return "Abaixo do peso";
      if (bmi < 24.9) return "Peso normal";
      if (bmi < 29.9) return "Sobrepeso";
      if (bmi < 34.9) return "Obesidade grau I";
      if (bmi < 39.9) return "Obesidade grau II";
      return "Obesidade grau III";
    }

    // Ao clicar no botão, vai para macros.html
    btnToMacros.addEventListener("click", function () {
      window.location.href = "macros.html";
    });
  }

  if (isMacrosPage) {
    // Página 2: metas e macros
    let tdee = +localStorage.getItem("tdee") || 0;
    if (!tdee || tdee === 0) {
      alert("Por favor, preencha os dados na página inicial primeiro.");
      window.location.href = "index.html";
      return;
    }

    let adjustedCalories = tdee;

    const adjustmentInput = document.getElementById("adjustment");
    const adjustmentValue = document.getElementById("adjustment-value");
    const goalForm = document.getElementById("goal-form");
    const macrosForm = document.getElementById("macros-form");

    // Inicializa valor do ajuste e das calorias ajustadas
    adjustmentValue.textContent = `${adjustmentInput.value}%`;
    document.getElementById("adjusted-calories").textContent = adjustedCalories;

    adjustmentInput.addEventListener("input", () => {
      adjustmentValue.textContent = `${adjustmentInput.value}%`;
    });

    goalForm.addEventListener("submit", function (e) {
      e.preventDefault();

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

      const proteinCals = adjustedCalories * (proteinPct / 100);
      const carbsCals = adjustedCalories * (carbsPct / 100);
      const fatsCals = adjustedCalories * (fatsPct / 100);

      const proteinGrams = Math.round(proteinCals / 4);
      const carbsGrams = Math.round(carbsCals / 4);
      const fatsGrams = Math.round(fatsCals / 9);

      document.getElementById("protein-result").textContent = proteinGrams;
      document.getElementById("carbs-result").textContent = carbsGrams;
      document.getElementById("fats-result").textContent = fatsGrams;
      document.getElementById("macros-result").style.display = "block";

      renderChart(proteinGrams, carbsGrams, fatsGrams);
    });

    function renderChart(protein, carbs, fats) {
      const ctx = document.getElementById("macroChart").getContext("2d");
      if (window.chartInstance) window.chartInstance.destroy();

      window.chartInstance = new Chart(ctx, {
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
            animateScale: true,
            animateRotate: true
          },
          plugins: {
            legend: { position: "bottom" }
          }
        }
      });
    }
  }
});
