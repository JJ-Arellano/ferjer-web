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

// ===== Storage =====
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
  LS.set("ferjer_session", { name: user.name, email: user.email, role: user.role });
}
function getSession() { return LS.get("ferjer_session", null); }
function clearSession() {
  localStorage.removeItem("ferjer_logged");
  localStorage.removeItem("ferjer_session");
}
function isLogged() { return localStorage.getItem("ferjer_logged") === "1"; }

// ===== UI =====
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
      <button type="button" class="nav-link btn btn-link text-start" id="navMisEquipos">Mis equipos</button>
      <button type="button" class="nav-link btn btn-link text-start" id="navProductos">Productos</button>
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
    <div class="mt-2 px-3 text-uppercase text-secondary small fw-semibold">Naveganet</div>
    <a class="nav-link" href="productos-admin.html">Productos</a>
    ${role === "Administrador" ? `<a class="nav-link" href="naveganet-usuarios.html">Usuarios</a>` : ``}
  `;
}

// ===== Protección =====
function protectRoutes() {
  let page = window.location.pathname.split("/").pop();
  if (!page) page = "index.html";

  const role = getSession()?.role || "";
  const publicPages = ["index.html", "login.html", "register.html"];

  if (publicPages.includes(page)) return;

  if (!isLogged()) {
    window.location.href = "login.html";
    return;
  }

  const clientPages = ["cliente-mis-equipos.html", "cliente-productos.html"];
  const staffPages  = [
    "dashboard.html", "equipos.html", "nuevo-equipo.html",
    "detalle-equipo.html", "productos-admin.html", "naveganet-usuarios.html"
  ];

  if (role === "Cliente" && staffPages.includes(page)) {
    window.location.href = "cliente-mis-equipos.html";
    return;
  }
  if (role !== "Cliente" && clientPages.includes(page)) {
    window.location.href = "dashboard.html";
    return;
  }
  if (page === "naveganet-usuarios.html" && role !== "Administrador") {
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

      const email = (document.getElementById("email")?.value || "").trim().toLowerCase();
      const password = (document.getElementById("password")?.value || "").trim();
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

        window.location.href = (data.user.rol === "Cliente")
          ? "cliente-mis-equipos.html"
          : "dashboard.html";

      } catch (err) {
        if (loginMsg) loginMsg.textContent = err.message || "Error al iniciar sesión";
      }
    });
  }

  // ===== NUEVO EQUIPO (MySQL) =====
  const equipoForm = document.getElementById("equipoForm");
  if (equipoForm) {
    equipoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const cliente = document.getElementById("cliente");
      const clienteEmail = document.getElementById("clienteEmail");
      const tipo = document.getElementById("tipo");
      const modelo = document.getElementById("modelo");
      const falla = document.getElementById("falla");

      // Validación simple
      let ok = true;
      [cliente, clienteEmail, tipo, modelo, falla].forEach(el => {
        if (!el || !String(el.value || "").trim()) { el?.classList.add("is-invalid"); ok = false; }
        else el.classList.remove("is-invalid");
      });
      if (clienteEmail && !clienteEmail.value.includes("@")) { clienteEmail.classList.add("is-invalid"); ok = false; }
      if (!ok) return;

      try {
        const data = await apiFetch("api/equipos/create.php", {
          method: "POST",
          body: JSON.stringify({
            cliente: cliente.value.trim(),
            clienteEmail: clienteEmail.value.trim().toLowerCase(),
            tipo: tipo.value.trim(),
            modelo: modelo.value.trim(),
            falla: falla.value.trim()
          })
        });

        // si tu API devuelve folio
        const folioInput = document.getElementById("folio");
        if (folioInput && data.folio) folioInput.value = data.folio;

        // redirige a lista
        window.location.href = "equipos.html";
      } catch (err) {
        alert(err.message || "Error al registrar equipo");
      }
    });
  }

  // ===== EQUIPOS LIST =====
  const equiposBody = document.getElementById("equiposBody");
  if (equiposBody) {
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const btnClear = document.getElementById("btnClear");
    const emptyState = document.getElementById("emptyState");

    async function renderEquipos() {
      const q = (searchInput?.value || "").trim();
      const st = (statusFilter?.value || "").trim();

      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (st) params.set("status", st);

      try {
        const data = await apiFetch("api/equipos/list.php" + (params.toString() ? "?" + params.toString() : ""));
        const equipos = data.data || [];

        equiposBody.innerHTML = equipos.map(x => `
          <tr>
            <td class="fw-semibold">${x.folio}</td>
            <td>${x.cliente}</td>
            <td class="text-secondary">${x.correo || "-"}</td>
            <td>${x.tipo_equipo} - ${x.modelo}<div class="text-secondary small">${x.fecha_ingreso}</div></td>
            <td><span class="badge ${badgeClass(x.estatus)}">${x.estatus}</span></td>
            <td class="text-end">
              <a class="btn btn-sm btn-outline-secondary"
                 href="detalle-equipo.html?folio=${encodeURIComponent(x.folio)}">Detalle</a>
            </td>
          </tr>
        `).join("");

        if (equipos.length === 0) emptyState?.classList.remove("d-none");
        else emptyState?.classList.add("d-none");

      } catch (err) {
        equiposBody.innerHTML = `<tr><td colspan="6" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    }

    renderEquipos();
    searchInput?.addEventListener("input", renderEquipos);
    statusFilter?.addEventListener("change", renderEquipos);
    btnClear?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (statusFilter) statusFilter.value = "";
      renderEquipos();
    });
  }

  // ===== CLIENTE: Mis equipos =====
  const myEquiposBody = document.getElementById("myEquiposBody");
  if (myEquiposBody) {
    (async () => {
      try {
        const email = (getSession()?.email || "").toLowerCase();
        const data = await apiFetch("api/equipos/mine.php?email=" + encodeURIComponent(email));
        const equipos = data.data || [];

        myEquiposBody.innerHTML = equipos.map(e => `
          <tr>
            <td class="fw-semibold">${e.folio}</td>
            <td>${e.tipo_equipo} - ${e.modelo}</td>
            <td><span class="badge ${badgeClass(e.estatus)}">${e.estatus}</span></td>
            <td class="text-secondary">${e.fecha_ingreso}</td>
          </tr>
        `).join("");

        const empty = document.getElementById("myEquiposEmpty");
        if (equipos.length === 0) empty?.classList.remove("d-none");
        else empty?.classList.add("d-none");
      } catch (err) {
        myEquiposBody.innerHTML = `<tr><td colspan="4" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    })();
  }

  // ===== DETALLE EQUIPO + HISTORIAL =====
  const histBody = document.getElementById("histBody");
  if (histBody) {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const folio = params.get("folio");

      const err = document.getElementById("histErr");
      const empty = document.getElementById("histEmpty");

      if (!folio) {
        err?.classList.remove("d-none");
        if (err) err.textContent = "Folio no especificado en la URL.";
        return;
      }

      try {
        const det = await apiFetch("api/equipos/get.php?folio=" + encodeURIComponent(folio));
        const d = det.data;

        document.getElementById("detFolio").textContent = d.folio;
        document.getElementById("detEstatus").textContent = d.estatus;
        document.getElementById("detCliente").textContent = d.cliente;
        document.getElementById("detCorreo").textContent = d.correo || "-";
        document.getElementById("detEquipo").textContent = `${d.tipo_equipo} - ${d.modelo}`;
        document.getElementById("detFecha").textContent = d.fecha_ingreso;
        document.getElementById("detFalla").textContent = d.falla;

        const h = await apiFetch("api/historial/seguimiento.php?folio=" + encodeURIComponent(folio));
        const rows = h.data || [];

        histBody.innerHTML = rows.map(r => `
          <tr>
            <td class="text-secondary">${r.fecha_movimiento}</td>
            <td><span class="badge ${badgeClass(r.estatus)}">${r.estatus}</span></td>
            <td>${(r.comentario || "-")}</td>
          </tr>
        `).join("");

        if (rows.length === 0) empty?.classList.remove("d-none");
        else empty?.classList.add("d-none");

      } catch (ex) {
        err?.classList.remove("d-none");
        if (err) err.textContent = ex.message || "Error cargando detalle/historial";
      }
    })();
  }

  // ===== CLIENTE/GENERAL: Productos (MySQL) =====
  const productsGrid = document.getElementById("productsGrid");
  if (productsGrid) {
    (async () => {
      try {
        const data = await apiFetch("api/productos/list.php");
        const products = data.data || [];

        productsGrid.innerHTML = products.map(p => `
          <div class="col-sm-6 col-lg-3">
            <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
              <div class="bg-light" style="height:190px;display:flex;align-items:center;justify-content:center;">
                ${
                  p.imagen_url
                    ? `<img src="${p.imagen_url}" alt="${p.nombre}" style="max-height:100%;max-width:100%;object-fit:contain;">`
                    : `<div class="text-secondary small">Sin imagen</div>`
                }
              </div>
              <div class="card-body">
                <div class="text-secondary small">ID: ${p.id_producto}</div>
                <h6 class="fw-semibold mt-1 mb-2">${p.nombre}</h6>
                <div class="d-flex align-items-center justify-content-between">
                  <div class="fw-bold">$${Number(p.precio).toFixed(2)} MXN</div>
                  <span class="badge text-bg-light border">Stock: ${p.stock}</span>
                </div>
              </div>
            </div>
          </div>
        `).join("");

      } catch (err) {
        productsGrid.innerHTML = `<div class="text-danger">Error: ${err.message}</div>`;
      }
    })();
  }

  // ===== ADMIN: Productos CRUD (crear + listar + eliminar) =====
  const prodAdminBody = document.getElementById("prodAdminBody"); // tbody
  const prodAdminForm = document.getElementById("prodAdminForm"); // form
  if (prodAdminBody || prodAdminForm) {

    async function renderProductosAdmin() {
      if (!prodAdminBody) return;
      try {
        const data = await apiFetch("api/productos/list.php");
        const products = data.data || [];

        prodAdminBody.innerHTML = products.map(p => `
          <tr>
            <td class="text-secondary">${p.id_producto}</td>
            <td class="fw-semibold">${p.nombre}</td>
            <td>$${Number(p.precio).toFixed(2)}</td>
            <td>${p.stock}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-danger"
                      data-action="del"
                      data-id="${p.id_producto}">
                Eliminar
              </button>
            </td>
          </tr>
        `).join("");

      } catch (err) {
        prodAdminBody.innerHTML = `<tr><td colspan="5" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    }

    prodAdminBody?.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      if (btn.getAttribute("data-action") !== "del") return;

      const id = btn.getAttribute("data-id");
      if (!id) return;

      if (!confirm("¿Eliminar producto " + id + "?")) return;

      try {
        await apiFetch("api/productos/delete.php", {
          method: "POST",
          body: JSON.stringify({ id_producto: id })
        });
        renderProductosAdmin();
      } catch (err) {
        alert(err.message || "No se pudo eliminar");
      }
    });

    prodAdminForm?.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = document.getElementById("pNombre");
      const precio = document.getElementById("pPrecio");
      const stock = document.getElementById("pStock");
      const imagen = document.getElementById("pImagenUrl");
      const msg = document.getElementById("pMsg");

      const payload = {
        nombre: (nombre?.value || "").trim(),
        precio: Number(precio?.value || 0),
        stock: Number(stock?.value || 0),
        imagen_url: (imagen?.value || "").trim()
      };

      if (!payload.nombre) return alert("Nombre requerido");
      if (!Number.isFinite(payload.precio)) return alert("Precio inválido");
      if (!Number.isFinite(payload.stock)) return alert("Stock inválido");

      try {
        msg?.classList.remove("d-none");
        if (msg) msg.textContent = "Guardando...";

        await apiFetch("api/productos/create.php", {
          method: "POST",
          body: JSON.stringify(payload)
        });

        prodAdminForm.reset();
        if (msg) msg.textContent = "Producto creado ✅";
        renderProductosAdmin();

        setTimeout(() => msg?.classList.add("d-none"), 1200);
      } catch (err) {
        if (msg) {
          msg.classList.remove("d-none");
          msg.textContent = err.message || "No se pudo crear";
        }
      }
    });

    renderProductosAdmin();
  }
});