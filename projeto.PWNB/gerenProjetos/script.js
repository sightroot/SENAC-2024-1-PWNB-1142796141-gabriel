document.addEventListener('DOMContentLoaded', () => {
    const projectForm = document.getElementById('project-form');
    const pendingProjectsList = document.getElementById('pending-projects');
    const inProgressProjectsList = document.getElementById('in-progress-projects');
    const completedProjectsList = document.getElementById('completed-projects');

    projectForm.addEventListener('submit', addProject);

    function addProject(e) {
        e.preventDefault();

        const projectName = document.getElementById('project-name').value;
        const teamMember = document.getElementById('team-member').value;
        const deadline = document.getElementById('deadline').value;
        const status = document.getElementById('status').value;
        const progress = document.getElementById('progress').value;
        const projectVersion = document.getElementById('project-version').value;
        const projectFileInput = document.getElementById('project-file');
        
        if (!isValidDate(deadline)) {
            alert('Por favor, insira uma data válida.');
            return;
        }

        const projectFile = projectFileInput.files[0];
        if (!projectFile) {
            alert('Por favor, selecione um arquivo.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const project = {
                projectName,
                teamMembers: [{ name: teamMember }],
                deadline,
                status,
                progress,
                projectVersion,
                projectFile: {
                    name: projectFile.name,
                    data: event.target.result
                }
            };

            let projects = getProjectsFromLocalStorage();
            projects.push(project);
            localStorage.setItem('projects', JSON.stringify(projects));

            resetForm();
            displayProjects();
        };
        reader.readAsDataURL(projectFile);
    }

    function isValidDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set the time to midnight to compare only dates
        return date instanceof Date && !isNaN(date) && date >= today;
    }

    function getProjectsFromLocalStorage() {
        let projects = localStorage.getItem('projects');
        return projects ? JSON.parse(projects) : [];
    }

    function displayProjects() {
        pendingProjectsList.innerHTML = '';
        inProgressProjectsList.innerHTML = '';
        completedProjectsList.innerHTML = '';

        const projects = getProjectsFromLocalStorage();

        projects.forEach((project, index) => {
            const projectDiv = createProjectElement(project, index);

            switch (project.status) {
                case 'pending':
                    pendingProjectsList.appendChild(projectDiv);
                    break;
                case 'in-progress':
                    inProgressProjectsList.appendChild(projectDiv);
                    break;
                case 'completed':
                    completedProjectsList.appendChild(projectDiv);
                    break;
            }
        });
    }

    function createProjectElement(project, index) {
        const projectDiv = document.createElement('div');
        projectDiv.className = `project-item status-${project.status}`;
        projectDiv.innerHTML = `
            <h3>${project.projectName}</h3>
            <p>Prazo: ${project.deadline}</p>
            <p>Status: ${translateStatus(project.status)}</p>
            <p>Versão: ${project.projectVersion}</p>
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${project.progress}%;"></div>
            </div>
            <p>Progresso: ${project.progress}%</p>
            <div class="team-members">
                <h4>Membros da equipe:</h4>
                <ul id="team-list-${index}">
                    ${project.teamMembers.map((member) => `
                        <li>${member.name} <button data-index="${index}" data-member="${member.name}" class="delete-team-member">Excluir</button></li>`).join('')}
                </ul>
                <input type="text" id="team-member-${index}" placeholder="Nome do Membro da Equipe">
                <button data-index="${index}" class="add-team-member">Adicionar Membro</button>
            </div>
            <div class="project-files">
                <h4>Arquivos:</h4>
                <a href="${project.projectFile.data}" download="${project.projectFile.name}">${project.projectFile.name}</a>
            </div>
            <button data-index="${index}" class="change-status">Alterar Status</button>
            <button data-index="${index}" class="update-progress">Alterar Progresso</button>
            <button data-index="${index}" class="change-version">Alterar Versão</button>
            <button data-index="${index}" class="delete-project">Excluir Projeto</button>
        `;

        return projectDiv;
    }

    function translateStatus(status) {
        switch (status) {
            case 'pending':
                return 'Pendente';
            case 'in-progress':
                return 'Em Progresso';
            case 'completed':
                return 'Completo';
            default:
                return status;
        }
    }

    function resetForm() {
        document.getElementById('project-form').reset();
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('change-status')) {
            const index = e.target.getAttribute('data-index');
            let projects = getProjectsFromLocalStorage();
            const currentStatus = projects[index].status;

            switch (currentStatus) {
                case 'pending':
                    projects[index].status = 'in-progress';
                    break;
                case 'in-progress':
                    projects[index].status = 'completed';
                    break;
                case 'completed':
                    projects[index].status = 'pending';
                    break;
            }

            localStorage.setItem('projects', JSON.stringify(projects));
            displayProjects();
        } else if (e.target.classList.contains('delete-project')) {
            const index = e.target.getAttribute('data-index');
            let projects = getProjectsFromLocalStorage();
            projects.splice(index, 1);
            localStorage.setItem('projects', JSON.stringify(projects));
            displayProjects();
        } else if (e.target.classList.contains('add-team-member')) {
            const index = e.target.getAttribute('data-index');
            const newTeamMember = document.getElementById(`team-member-${index}`).value.trim();
            if (newTeamMember !== '') {
                let projects = getProjectsFromLocalStorage();
                projects[index].teamMembers.push({ name: newTeamMember });
                localStorage.setItem('projects', JSON.stringify(projects));
                displayProjects();
            }
        } else if (e.target.classList.contains('delete-team-member')) {
            const index = e.target.getAttribute('data-index');
            const memberName = e.target.getAttribute('data-member');
            let projects = getProjectsFromLocalStorage();
            projects[index].teamMembers = projects[index].teamMembers.filter(member => member.name !== memberName);
            localStorage.setItem('projects', JSON.stringify(projects));
            displayProjects();
        } else if (e.target.classList.contains('update-progress')) {
            const index = e.target.getAttribute('data-index');
            const newProgress = prompt('Digite o novo progresso (%):');

            if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
                let projects = getProjectsFromLocalStorage();
                projects[index].progress = newProgress;
                localStorage.setItem('projects', JSON.stringify(projects));
                displayProjects();
            } else {
                alert('Por favor, insira um valor válido para o progresso (entre 0 e 100).');
            }
        } else if (e.target.classList.contains('change-version')) {
            const index = e.target.getAttribute('data-index');
            const newVersion = prompt('Digite a nova versão do projeto:');
            
            if (newVersion !== null && newVersion.trim() !== '') {
                let projects = getProjectsFromLocalStorage();
                projects[index].projectVersion = newVersion.trim();
                localStorage.setItem('projects', JSON.stringify(projects));
                displayProjects();
            } else {
                alert('Por favor, insira um valor válido para a versão do projeto.');
            }
        }
    });

    displayProjects();
});
