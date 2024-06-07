document.addEventListener("DOMContentLoaded", function() {
    var confirmButton = document.getElementById("confirm_button");
    confirmButton.addEventListener("click", function(event) {
        event.preventDefault(); // Prevenir o comportamento padrão do botão
        
        // Verificar se pelo menos um tipo de serviço foi selecionado
        var checkboxes = document.querySelectorAll("input[type='checkbox']");
        var checked = false;
        checkboxes.forEach(function(checkbox) {
            if (checkbox.checked) {
                checked = true;
            }
        });
        
        // Se pelo menos um checkbox estiver marcado, redirecionar para projetos.html
        if (checked) {
            window.location.href = "../gerenProjetos/index.html";
        } else {
            alert("Por favor, selecione pelo menos um tipo de serviço.");
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault(); // Impede o redirecionamento padrão

            // Obtenha o URL para o qual o link está redirecionando
            const href = link.getAttribute('href');

            // Defina o tempo de atraso em milissegundos (1000ms = 1 segundo)
            const delay = 1000; // 1 segundo

            // Aguarde o atraso antes de redirecionar
            setTimeout(() => {
                window.location.href = href; // Redirecione para o URL após o atraso
            }, delay);
        });
    });
});
