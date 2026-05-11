import {
    verifyDashboardAuthentication,
    initializeDashboardLayout,
} from "../utils/dashboardAuth.js";

document.addEventListener("DOMContentLoaded", async function () {
    if (verifyDashboardAuthentication()) {
        initializeDashboardLayout();

        const tipoUsuario = sessionStorage.getItem("tipoUsuario");

        if (tipoUsuario === "Aluno") {
            await carregarMentoriasAluno();
        }

        if (tipoUsuario === "Professor") {
            await carregarSolicitacoes();
        }
    }
});

window.aceitarMentoria = aceitarMentoria;

async function carregarSolicitacoes() {
    try {
        const professorId = sessionStorage.getItem("userId");

        if (!professorId) return;

        const response = await fetch(
            `http://localhost:8080/api/mentorships/teacher/${professorId}`,
        );

        if (!response.ok) {
            throw new Error("Erro ao buscar mentorias.");
        }

        const mentorias = await response.json();

        const container = document.getElementById("solicitacoesMentoria");

        if (!container) return;

        container.innerHTML = "";

        const pendentes = mentorias.filter((m) => m.status === "PENDING");

        if (pendentes.length === 0) {
            container.innerHTML = `
                <p class="text-gray-500">Nenhuma solicitação pendente.</p>
            `;
            return;
        }

        pendentes.forEach((m) => {
            container.innerHTML += `
                <div class="border rounded-lg p-3 mb-3 flex justify-between items-center">
    
                    <div>
                        <strong>${m.studentName}</strong><br>
                        Solicitou mentoria
                    </div>
    
                    <button
                        onclick="aceitarMentoria(${m.id})"
                        class="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Aceitar
                    </button>
    
                </div>
            `;
        });
    } catch (error) {
        console.error(error);

        const container = document.getElementById("solicitacoesMentoria");

        if (container) {
            container.innerHTML = `
                <div class="text-red-500">
                    Erro ao carregar solicitações.
                </div>
            `;
        }
    }
}

async function aceitarMentoria(id) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/mentorships/${id}/accept`,
            {
                method: "PUT",
            },
        );

        if (!response.ok) {
            throw new Error("Erro ao aceitar mentoria.");
        }

        alert("Mentoria aceita com sucesso!");

        await carregarSolicitacoes();
    } catch (error) {
        console.error(error);
        alert("Erro ao aceitar mentoria.");
    }
}

async function carregarMentoriasAluno() {
    try {
        const studentId = sessionStorage.getItem("userId");

        const response = await fetch(
            `http://localhost:8080/api/mentorships/student/${studentId}`,
        );

        if (!response.ok) {
            throw new Error("Erro ao carregar mentorias.");
        }

        const mentorias = await response.json();

        const container = document.getElementById("minhasMentorias");

        if (!container) return;

        container.innerHTML = "";

        if (mentorias.length === 0) {
            container.innerHTML = `
                <p class="text-gray-500">
                    Você ainda não possui mentorias.
                </p>
            `;
            return;
        }

        mentorias.forEach((m) => {
            const statusColor =
                m.status === "ACCEPTED"
                    ? "text-green-600"
                    : m.status === "PENDING"
                      ? "text-yellow-600"
                      : "text-red-600";

            const statusText =
                m.status === "ACCEPTED"
                    ? "Aceita"
                    : m.status === "PENDING"
                      ? "Pendente"
                      : "Recusada";

            container.innerHTML += `
                <div class="border rounded-xl p-4 mb-4 shadow-sm bg-white flex items-center justify-between hover:shadow-md transition">

                    <div class="flex items-center gap-4">

                        <img 
                            src="${m.teacherPhoto}" 
                            class="w-16 h-16 rounded-full object-cover border"
                        >

                        <div>
                            <h3 class="font-semibold text-lg text-gray-800">
                                ${m.teacherName}
                            </h3>

                            <p class="text-sm text-gray-500">
                                ${m.disciplina}
                            </p>

                            <small class="${statusColor} font-medium">
                                ${statusText}
                            </small>
                        </div>

                    </div>

                </div>
            `;
        });
    } catch (error) {
        console.error(error);

        const container = document.getElementById("minhasMentorias");

        if (container) {
            container.innerHTML = `
                <p class="text-red-500">
                    Erro ao carregar mentorias.
                </p>
            `;
        }
    }
}
