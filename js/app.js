// ===== Helpers LocalStorage =====
console.log("✅ app.js cargó");

// ===== API Helper =====
async function apiFetch(path, options = {}) {
  const res = await fetch(path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); }
  catch { throw new Error("Respuesta no JSON: " + text); }

  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Error HTTP ${res.status}`);
  }
  return data;
}

const LS = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

// ===== Sesión =====
function setSession(user) {
  localStorage.setItem("ferjer_logged", "1");
  LS.set("ferjer_session", {
    name: user.name,
    email: user.email,
    role: user.role
  });
}

function getSession() {
  return LS.get("ferjer_session", null);
}

function clearSession() {
  localStorage.removeItem("ferjer_logged");
  localStorage.removeItem("ferjer_session");
}

function isLogged() {
  return localStorage.getItem("ferjer_logged") === "1";
}

// ===== UI Helpers =====
function badgeClass(status) {
  if (status === "Diagnóstico") return "text-bg-warning";
  if (status === "Reparación") return "text-bg-primary";
  if (status === "Listo") return "text-bg-success";
  if (status === "Entregado") return "text-bg-dark";
  return "text-bg-secondary";
}

// ===== Menú por rol =====
function renderSidebarNav() {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;

  const session = getSession();
  const role = session?.role || "";

  if (role === "Cliente") {
    nav.innerHTML = `
      <button type="button" class="nav-link btn btn-link text-start" id="navMisEquipos">
        Mis equipos
      </button>
      <button type="button" class="nav-link btn btn-link text-start" id="navProductos">
        Productos
      </button>
    `;

    document.getElementById("navMisEquipos")?.addEventListener("click", () => {
      window.location.href = "cliente-mis-equipos.html";
    });

    document.getElementById("navProductos")?.addEventListener("click", () => {
      window.location.href = "cliente-productos.html";
    });

    return;
  }

  nav.innerHTML = `
    <a class="nav-link" href="dashboard.html">Dashboard</a>
    <a class="nav-link" href="equipos.html">Equipos</a>
    <a class="nav-link" href="nuevo-equipo.html">Nuevo registro</a>
    <a class="nav-link" href="productos-admin.html">Productos</a>
    ${role === "Administrador" ? `<a class="nav-link" href="naveganet-usuarios.html">Usuarios</a>` : ""}
  `;
}

// ===== Protección =====
function protectRoutes() {
  let page = window.location.pathname.split("/").pop();
  if (!page) page = "index.html";

  const session = getSession();
  const role = session?.role || "";

  const publicPages = ["index.html", "login.html", "register.html"];

  if (publicPages.includes(page)) return;

  if (!isLogged()) {
    window.location.href = "login.html";
    return;
  }

  if (role === "Cliente" &&
      ["dashboard.html","equipos.html","nuevo-equipo.html","naveganet-usuarios.html"].includes(page)) {
    window.location.href = "cliente-mis-equipos.html";
  }

  if (role !== "Cliente" &&
      ["cliente-mis-equipos.html","cliente-productos.html"].includes(page)) {
    window.location.href = "dashboard.html";
  }
}

// ================= DOMContentLoaded =================
document.addEventListener("DOMContentLoaded", () => {

  protectRoutes();
  renderSidebarNav();

  // ===== LOGOUT =====
  document.getElementById("btnLogout")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "login.html";
  });

  // ===== LOGIN =====
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email")?.value.trim().toLowerCase();
      const password = document.getElementById("password")?.value.trim();
      const loginMsg = document.getElementById("loginMsg");

      loginMsg?.classList.remove("d-none");
      if (loginMsg) loginMsg.textContent = "Procesando...";

      try {
        const data = await apiFetch("api/auth/login.php", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        setSession({
          name: data.user.nombre,
          email: data.user.email,
          role: data.user.rol
        });

        window.location.href =
          data.user.rol === "Cliente"
            ? "cliente-mis-equipos.html"
            : "dashboard.html";

      } catch (err) {
        if (loginMsg) loginMsg.textContent = err.message;
      }
    });
  }

  // ===== PRODUCTOS (MySQL) =====
  const productsGrid = document.getElementById("productsGrid");
  if (productsGrid) {
    (async () => {
      try {
        const data = await apiFetch("api/productos/list.php");
        const products = data.data || [];

        productsGrid.innerHTML = products.map(p => `
          <div class="col-sm-6 col-lg-3">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="text-secondary small">ID: ${p.id_producto}</div>
                <h6 class="fw-semibold mt-1">${p.nombre}</h6>
                <div class="fw-bold">$${Number(p.precio).toFixed(2)} MXN</div>
                <span class="badge bg-light text-dark">Stock: ${p.stock}</span>
              </div>
            </div>
          </div>
        `).join("");

      } catch (err) {
        productsGrid.innerHTML =
          `<div class="text-danger">Error: ${err.message}</div>`;
      }
    })();
  }

});