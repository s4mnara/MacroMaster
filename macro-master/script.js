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

    //referência para o botao gerar PDF
    const downloadPdfBtn = document.getElementById("download-pdf-btn");

    // Inicializa valor do ajuste e das calorias ajustadas
    const dietSection = document.getElementById("diet-plan");        // Seção da dieta
    const dietContent = document.getElementById("diet-content");     // Container do texto da dieta

    // Inicializa valor do ajuste e calorias ajustadas
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

      localStorage.setItem("macro_protein", proteinGrams);
      localStorage.setItem("macro_carbs", carbsGrams);
      localStorage.setItem("macro_fats", fatsGrams);

      // Gera a dieta personalizada e exibe na página
      const dietaHTML = gerarDietaPersonalizada(proteinGrams, carbsGrams, fatsGrams);
      dietContent.innerHTML = dietaHTML;
      dietSection.style.display = "block";
    });

        // Função para gerar dieta personalizada baseada nos macros
    function gerarDietaPersonalizada(proteinTarget, carbsTarget, fatsTarget) {
      const dietaBase = [
        {
          refeicao: "Café da manhã",
          alimentos: [
            { nome: "Ovos mexidos", qtd: 150, unidade: "g", cal: 210, prot: 18, carb: 2, fat: 15 },
            { nome: "Aveia", qtd: 50, unidade: "g", cal: 190, prot: 6, carb: 32, fat: 3.5 },
            { nome: "Banana", qtd: 1, unidade: "unidade média", cal: 90, prot: 1, carb: 23, fat: 0.3 },
          ]
        },
        {
          refeicao: "Lanche",
          alimentos: [
            { nome: "Iogurte natural integral", qtd: 170, unidade: "g", cal: 120, prot: 8, carb: 12, fat: 5 },
            { nome: "Amêndoas", qtd: 15, unidade: "g", cal: 90, prot: 3, carb: 3, fat: 8 },
          ]
        },
        {
          refeicao: "Almoço",
          alimentos: [
            { nome: "Peito de frango grelhado", qtd: 150, unidade: "g", cal: 248, prot: 45, carb: 0, fat: 5 },
            { nome: "Arroz integral", qtd: 100, unidade: "g (cozido)", cal: 130, prot: 3, carb: 28, fat: 1 },
            { nome: "Brócolis cozido", qtd: 100, unidade: "g", cal: 35, prot: 3, carb: 7, fat: 0.5 },
          ]
        },
        {
          refeicao: "Lanche",
          alimentos: [
            { nome: "Maçã", qtd: 1, unidade: "unidade média", cal: 80, prot: 0, carb: 22, fat: 0.3 },
            { nome: "Pasta de amendoim", qtd: 15, unidade: "g", cal: 90, prot: 4, carb: 3, fat: 8 },
          ]
        },
        {
          refeicao: "Jantar",
          alimentos: [
            { nome: "Filé de salmão", qtd: 150, unidade: "g", cal: 280, prot: 35, carb: 0, fat: 18 },
            { nome: "Batata doce", qtd: 100, unidade: "g", cal: 90, prot: 2, carb: 20, fat: 0.1 },
            { nome: "Salada verde", qtd: 0, unidade: "à vontade", cal: 20, prot: 1, carb: 4, fat: 0 },
          ]
        },
        {
          refeicao: "Ceia",
          alimentos: [
            { nome: "Queijo cottage", qtd: 100, unidade: "g", cal: 80, prot: 12, carb: 3, fat: 1 },
          ]
        }
      ];

      // Soma totais base de macros
      let totalProtBase = 0, totalCarbBase = 0, totalFatBase = 0;
      dietaBase.forEach(refeicao => {
        refeicao.alimentos.forEach(alimento => {
          totalProtBase += alimento.prot;
          totalCarbBase += alimento.carb;
          totalFatBase += alimento.fat;
        });
      });

      // Fatores individuais para ajuste dos macros
      const fatorProt = proteinTarget / totalProtBase || 1;
      const fatorCarb = carbsTarget / totalCarbBase || 1;
      const fatorFat = fatsTarget / totalFatBase || 1;

      let resultadoHTML = `<h3>Dieta personalizada ajustada para seus macros</h3>`;

      dietaBase.forEach(refeicao => {
        resultadoHTML += `<h4>${refeicao.refeicao}</h4><ul>`;

    refeicao.alimentos.forEach(alimento => {
      const macroTotal = alimento.prot + alimento.carb + alimento.fat;
      const pesoProt = macroTotal ? alimento.prot / macroTotal : 0;
      const pesoCarb = macroTotal ? alimento.carb / macroTotal : 0;
      const pesoFat = macroTotal ? alimento.fat / macroTotal : 0;

          // Fator médio ponderado para ajustar quantidade
          const fatorMedio = (fatorProt * pesoProt) + (fatorCarb * pesoCarb) + (fatorFat * pesoFat);

          let qtdAjustada = alimento.qtd * fatorMedio;

          // Arredondar para unidades, ou formatar para gramas com uma casa decimal
          if (alimento.unidade.includes("unidade")) {
            qtdAjustada = Math.max(1, Math.round(qtdAjustada));
          } else {
            qtdAjustada = qtdAjustada.toFixed(1);
          }

          resultadoHTML += `<li><strong>${alimento.nome}</strong>: ${qtdAjustada} ${alimento.unidade}</li>`;
        });

        resultadoHTML += `</ul>`;
      });

      return resultadoHTML;
    }






    // Função para renderizar gráfico Chart.js
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
          //torna o botao gerar PDF visivel 
          if (downloadPdfBtn) {
            downloadPdfBtn.style.display = "inline-block";
          }
    }

      //////////////////////////////////////////////////////PDF///////////////////////////////////////////////////////////////

      //Preencher dados PDF
      function preencherPDFCampos() {
        const tdee = localStorage.getItem("tdee");
        const weight = localStorage.getItem("weight");
        const height = localStorage.getItem("height");
        const adjustedCals = document.getElementById("adjusted-calories").textContent;

        const heightMeters = height / 100;
        const bmi = weight / (heightMeters ** 2);
        const idealWeight = Math.round(22 * heightMeters ** 2);

        // Classificação IMC
            function getBmiClassification(bmi) {
              if (bmi < 18.5) return "Abaixo do peso";
              if (bmi < 24.9) return "Peso normal";
              if (bmi < 29.9) return "Sobrepeso";
              if (bmi < 34.9) return "Obesidade grau I";
              if (bmi < 39.9) return "Obesidade grau II";
              return "Obesidade grau III";
            }

        // Preenche todos os campos do PDF com os dados corretos
        document.getElementById("pdf-tdee").textContent = tdee;
        document.getElementById("pdf-bmi").textContent = bmi.toFixed(1);
        document.getElementById("pdf-bmi-class").textContent = getBmiClassification(bmi);
        document.getElementById("pdf-ideal-weight").textContent = idealWeight;
        document.getElementById("pdf-adjusted-calories").textContent = adjustedCals;
        
        document.getElementById("pdf-protein-result").textContent = localStorage.getItem("macro_protein") || "--";
        document.getElementById("pdf-carbs-result").textContent = localStorage.getItem("macro_carbs") || "--";
        document.getElementById("pdf-fats-result").textContent = localStorage.getItem("macro_fats") || "--";
      }

      // Dieta no PDF:
      const proteinGrams = parseInt(localStorage.getItem("macro_protein")) || 0;
      const carbsGrams = parseInt(localStorage.getItem("macro_carbs")) || 0;
      const fatsGrams = parseInt(localStorage.getItem("macro_fats")) || 0;

      const dietaHTML = gerarDietaPersonalizada(proteinGrams, carbsGrams, fatsGrams);
      const dietaContainer = document.getElementById("pdf-diet-content");
      dietaContainer.innerHTML = dietaHTML;
    }


            window.gerarPDF = async function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      const tdee = localStorage.getItem("tdee") || "--";
      const weight = localStorage.getItem("weight") || "--";
      const height = localStorage.getItem("height") || "--";
      const adjustedCals = document.getElementById("adjusted-calories").textContent || "--";
      const protein = localStorage.getItem("macro_protein") || "--";
      const carbs = localStorage.getItem("macro_carbs") || "--";
      const fats = localStorage.getItem("macro_fats") || "--";

      const heightMeters = height / 100;
      const bmi = weight / (heightMeters ** 2);
      const bmiClass = getBmiClassification(bmi);
      const idealWeight = Math.round(22 * heightMeters ** 2);

      // Cabeçalho
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Macro Master 🧮", 20, 20);

      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      doc.text("📄 Relatório de Resultados", 20, 30);

      doc.text(`TDEE (Gasto Energético Total): ${tdee} kcal`, 20, 40);
      doc.text(`IMC: ${bmi.toFixed(1)} - ${bmiClass}`, 20, 50);
      doc.text(`Peso Ideal: ${idealWeight} kg`, 20, 60);
      doc.text(`Calorias Ajustadas: ${adjustedCals} kcal`, 20, 70);

      doc.text("📈 Macronutrientes", 20, 85);
      doc.text(`Proteínas: ${protein} g`, 20, 95);
      doc.text(`Carboidratos: ${carbs} g`, 20, 105);
      doc.text(`Gorduras: ${fats} g`, 20, 115);

      doc.save("relatorio_macro_master.pdf");

      // Classificação IMC auxiliar
      function getBmiClassification(bmi) {
        if (bmi < 18.5) return "Abaixo do peso";
        if (bmi < 24.9) return "Peso normal";
        if (bmi < 29.9) return "Sobrepeso";
        if (bmi < 34.9) return "Obesidade grau I";
        if (bmi < 39.9) return "Obesidade grau II";
        return "Obesidade grau III";
      }
    };


     





  });

