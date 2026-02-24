console.log("✅ app.js cargó");

// ===== CONFIG ENDPOINT =====
const EQUIPOS_STATUS_ENDPOINT = "api/equipos/update_status.php";

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

// ===== LocalStorage helper (solo sesión) =====
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
  const roleClean = String(user.role || "").trim();
  localStorage.setItem("ferjer_logged", "1");
  LS.set("ferjer_session", { name: user.name, email: user.email, role: roleClean });
}
function getSession() { return LS.get("ferjer_session", null); }
function clearSession() {
  localStorage.removeItem("ferjer_logged");
  localStorage.removeItem("ferjer_session");
}
function isLogged() { return localStorage.getItem("ferjer_logged") === "1"; }

// ===== Roles =====
function normRole(role) { return String(role || "").trim().toLowerCase(); }
function isClient(role) { return normRole(role) === "cliente"; }
function isAdminRole(role) {
  const r = normRole(role);
  return r === "administrador" || r === "admin";
}

// ===== UI =====
function badgeClass(status) {
  if (status === "Diagnóstico") return "text-bg-warning";
  if (status === "Reparación") return "text-bg-primary";
  if (status === "Listo") return "text-bg-success";
  if (status === "Entregado") return "text-bg-dark";
  return "text-bg-secondary"; // Recibido
}

// ===== Menú por rol =====
function renderSidebarNav() {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;

  const role = getSession()?.role || "";

  if (isClient(role)) {
    nav.innerHTML = `
      <button type="button" class="nav-link rounded-3 px-3 py-2 btn btn-link text-start" id="navMisEquipos">
        Mis equipos
      </button>
      <button type="button" class="nav-link rounded-3 px-3 py-2 btn btn-link text-start" id="navProductos">
        Productos Naveganet
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
    <a class="nav-link rounded-3 px-3 py-2" href="dashboard.html">Dashboard</a>
    <a class="nav-link rounded-3 px-3 py-2" href="equipos.html">Equipos</a>
    <a class="nav-link rounded-3 px-3 py-2" href="nuevo-equipo.html">Nuevo registro</a>

    <div class="mt-2 px-3 text-uppercase text-secondary small fw-semibold">Naveganet</div>
    <a class="nav-link rounded-3 px-3 py-2" href="productos-admin.html">Productos</a>

    ${isAdminRole(role) ? `<a class="nav-link rounded-3 px-3 py-2" href="naveganet-usuarios.html">Usuarios</a>` : ""}
  `;
}

// ===== Protección =====
function protectRoutes() {
  let page = window.location.pathname.split("/").pop();
  if (!page) page = "index.html";

  const publicPages = ["index.html", "login.html", "register.html"];
  if (publicPages.includes(page)) return;

  if (!isLogged()) {
    window.location.href = "login.html";
    return;
  }

  const role = getSession()?.role || "";

  const clientPages = ["cliente-mis-equipos.html", "cliente-productos.html"];
  const staffPages = [
    "dashboard.html", "equipos.html", "nuevo-equipo.html",
    "detalle-equipo.html", "productos-admin.html", "naveganet-usuarios.html"
  ];

  if (isClient(role) && staffPages.includes(page)) {
    window.location.href = "cliente-mis-equipos.html";
    return;
  }
  if (!isClient(role) && clientPages.includes(page)) {
    window.location.href = "dashboard.html";
    return;
  }
  if (page === "naveganet-usuarios.html" && !isAdminRole(role)) {
    window.location.href = "dashboard.html";
  }
}

// ===== Modal status (Bootstrap) =====
function ensureStatusModal() {
  if (document.getElementById("statusModal")) return;

  document.body.insertAdjacentHTML("beforeend", `
<div class="modal fade" id="statusModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content rounded-4">
      <div class="modal-header">
        <h5 class="modal-title">Cambiar estatus</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body">
        <div class="mb-2">
          <div class="small text-secondary">Folio</div>
          <div class="fw-semibold" id="smFolio">-</div>
        </div>

        <div class="mb-3">
          <div class="small text-secondary">Estatus actual</div>
          <span class="badge" id="smActualBadge">-</span>
        </div>

        <div class="mb-3">
          <label class="form-label">Nuevo estatus</label>
          <select class="form-select" id="smNuevo"></select>
        </div>

        <div class="mb-2">
          <label class="form-label">Comentario</label>
          <textarea class="form-control" id="smComentario" rows="3"
            placeholder="Ej: Se diagnosticó, se solicitó refacción..."></textarea>
          <div class="form-text">Este comentario se guarda en el historial.</div>
        </div>

        <div class="alert d-none mt-3" id="smMsg"></div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-primary" id="smGuardar">Guardar</button>
      </div>
    </div>
  </div>
</div>
  `);
}

function setModalMsg(type, text) {
  const el = document.getElementById("smMsg");
  if (!el) return;
  el.className = `alert alert-${type}`;
  el.textContent = text;
  el.classList.remove("d-none");
}
function clearModalMsg() {
  document.getElementById("smMsg")?.classList.add("d-none");
}

// ================= DOMContentLoaded =================
document.addEventListener("DOMContentLoaded", () => {
  protectRoutes();
  renderSidebarNav();

  // Logout
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

        setSession({ name: data.user.nombre, email: data.user.email, role: data.user.rol });

        window.location.href = isClient(data.user.rol)
          ? "cliente-mis-equipos.html"
          : "dashboard.html";

      } catch (err) {
        if (loginMsg) loginMsg.textContent = err.message || "Error al iniciar sesión";
      }
    });
  }

  // ===== REGISTER =====
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre = (document.getElementById("regName")?.value || "").trim();
      const email = (document.getElementById("regEmail")?.value || "").trim().toLowerCase();
      const password = (document.getElementById("regPass")?.value || "").trim();
      const password2 = (document.getElementById("regPass2")?.value || "").trim();

      let rol = String(document.getElementById("regRole")?.value || "Cliente").trim();
      const allowedRoles = ["Cliente", "Administrador"];
      if (!allowedRoles.includes(rol)) rol = "Cliente";

      const okMsg = document.getElementById("regMsgOk");
      const errMsg = document.getElementById("regMsgErr");
      okMsg?.classList.add("d-none");
      errMsg?.classList.add("d-none");

      if (!nombre || !email || !password) {
        errMsg?.classList.remove("d-none");
        if (errMsg) errMsg.textContent = "Faltan datos.";
        return;
      }
      if (!email.includes("@")) {
        errMsg?.classList.remove("d-none");
        if (errMsg) errMsg.textContent = "Email inválido.";
        return;
      }
      if (password.length < 6) {
        errMsg?.classList.remove("d-none");
        if (errMsg) errMsg.textContent = "La contraseña debe tener al menos 6 caracteres.";
        return;
      }
      if (password !== password2) {
        errMsg?.classList.remove("d-none");
        if (errMsg) errMsg.textContent = "Las contraseñas no coinciden.";
        return;
      }

      try {
        await apiFetch("api/auth/register.php", {
          method: "POST",
          body: JSON.stringify({ nombre, email, password, rol })
        });

        okMsg?.classList.remove("d-none");
        if (okMsg) okMsg.textContent = "Usuario creado ✅";
        registerForm.reset();

      } catch (err) {
        errMsg?.classList.remove("d-none");
        if (errMsg) errMsg.textContent = err.message || "No se pudo crear el usuario.";
      }
    });
  }

  // ===== NUEVO EQUIPO =====
  const equipoForm = document.getElementById("equipoForm");
  if (equipoForm) {
    const folioInput = document.getElementById("folio");
    if (folioInput) folioInput.value = "";

    equipoForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const cliente = document.getElementById("cliente");
      const clienteEmail = document.getElementById("clienteEmail");
      const tipo = document.getElementById("tipo");
      const modelo = document.getElementById("modelo");
      const falla = document.getElementById("falla");

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

        if (folioInput && data.folio) folioInput.value = data.folio;
        window.location.href = "equipos.html";
      } catch (err) {
        alert(err.message || "Error al registrar equipo");
      }
    });
  }

  // ===== EQUIPOS LIST + MODAL STATUS (ADMIN) =====
  const equiposBody = document.getElementById("equiposBody");
  if (equiposBody) {
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const btnClear = document.getElementById("btnClear");
    const emptyState = document.getElementById("emptyState");

    const allowed = ["Recibido", "Diagnóstico", "Reparación", "Listo", "Entregado"];

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

            <td><span class="badge ${badgeClass(x.estatus)}" data-role="badge">${x.estatus}</span></td>

            <td class="text-end">
              <a class="btn btn-sm btn-outline-secondary me-2"
                 href="detalle-equipo.html?folio=${encodeURIComponent(x.folio)}">Detalle</a>

              <button class="btn btn-sm btn-outline-primary"
                      data-action="openStatus"
                      data-folio="${parseInt(x.folio, 10)}"
                      data-estatus="${x.estatus}">
                Cambiar
              </button>
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

    // Modal setup
    ensureStatusModal();
    const modalEl = document.getElementById("statusModal");
    const modal = (window.bootstrap && modalEl) ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

    const smFolio = document.getElementById("smFolio");
    const smActualBadge = document.getElementById("smActualBadge");
    const smNuevo = document.getElementById("smNuevo");
    const smComentario = document.getElementById("smComentario");
    const smGuardar = document.getElementById("smGuardar");

    if (smNuevo && smNuevo.options.length === 0) {
      smNuevo.innerHTML = allowed.map(s => `<option value="${s}">${s}</option>`).join("");
    }

    let currentRow = null;
    let currentFolio = 0;
    let currentActual = "";

    // abrir modal
    equiposBody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action='openStatus']");
      if (!btn) return;

      currentRow = btn.closest("tr");
      currentFolio = parseInt(btn.getAttribute("data-folio") || "0", 10);
      currentActual = String(btn.getAttribute("data-estatus") || "");

      if (!currentFolio || Number.isNaN(currentFolio)) {
        alert("Folio inválido (no numérico). Revisa list.php.");
        return;
      }

      if (smFolio) smFolio.textContent = String(currentFolio || "-");
      if (smActualBadge) {
        smActualBadge.className = `badge ${badgeClass(currentActual)}`;
        smActualBadge.textContent = currentActual || "-";
      }
      if (smNuevo) smNuevo.value = currentActual;
      if (smComentario) smComentario.value = "";

      clearModalMsg();
      modal?.show();
    });

    // guardar
    smGuardar?.addEventListener("click", async () => {
      clearModalMsg();

      const nuevo = String(smNuevo?.value || "").trim();
      const comentario = String(smComentario?.value || "").trim() || "Cambio de estatus";

      if (!allowed.includes(nuevo)) {
        setModalMsg("danger", "Estatus inválido.");
        return;
      }
      if (!currentFolio || Number.isNaN(currentFolio)) {
        setModalMsg("danger", "Folio inválido.");
        return;
      }
      if (nuevo === currentActual) {
        setModalMsg("secondary", "No hubo cambios.");
        return;
      }

      smGuardar.disabled = true;

      try {
        await apiFetch(EQUIPOS_STATUS_ENDPOINT, {
          method: "POST",
          body: JSON.stringify({ folio: currentFolio, estatus: nuevo, comentario })
        });

        // ✅ CLAVE: refresca desde backend para garantizar que SÍ se guardó en BD
        await renderEquipos();
        currentActual = nuevo;

        modal?.hide();

      } catch (err) {
        setModalMsg("danger", err.message || "No se pudo actualizar el estatus");
      } finally {
        smGuardar.disabled = false;
      }
    });
  }

  // ===== CLIENTE: Mis equipos (mine.php => equipo) =====
  const myEquiposBody = document.getElementById("myEquiposBody");
  if (myEquiposBody) {
    (async () => {
      try {
        const email = (getSession()?.email || "").toLowerCase();
        const data = await apiFetch("api/equipos/mine.php?email=" + encodeURIComponent(email));
        const equipos = data.data || [];

        myEquiposBody.innerHTML = equipos.map(e => `
          <tr>
            <td class="fw-semibold">${e.folio ?? "-"}</td>
            <td>${e.equipo ?? "-"}</td>
            <td><span class="badge ${badgeClass(e.estatus)}">${e.estatus ?? "-"}</span></td>
            <td class="text-secondary">${e.fecha_ingreso ?? "-"}</td>
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

  // ===== DETALLE + HISTORIAL =====
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

  // ===== Productos (grid cliente) =====
  const productsGrid = document.getElementById("productsGrid");
  if (productsGrid) {
    (async () => {
      try {
        const data = await apiFetch("api/productos/list.php");
        const products = data.data || [];

        productsGrid.innerHTML = products.map(p => {
          const img = p.imagen_url || p.imagen || "";
          return `
            <div class="col-sm-6 col-lg-3">
              <div class="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                <div class="bg-light" style="height:190px;display:flex;align-items:center;justify-content:center;">
                  ${
                    img
                      ? `<img src="${img}" alt="${p.nombre}" style="max-height:100%;max-width:100%;object-fit:contain;">`
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
          `;
        }).join("");

      } catch (err) {
        productsGrid.innerHTML = `<div class="text-danger">Error: ${err.message}</div>`;
      }
    })();
  }
});