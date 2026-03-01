console.log("✅ app.js cargó");

// ===== CONFIG ENDPOINT =====
const BASE_API = "api/";
const EQUIPOS_STATUS_ENDPOINT = BASE_API + "equipos/update_status.php";

// ===== API Helper =====
async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(path, {
      credentials: "same-origin",
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(localStorage.getItem("token") ? { "Authorization": `Bearer ${localStorage.getItem("token")}` } : {}),
        ...(options.headers || {})
      }
    });

    const text = await res.text();
    console.log(`📥 Respuesta de ${path}:`, text.substring(0, 200)); // Log primeros 200 caracteres
    
    let data;
    try { 
      data = JSON.parse(text); 
    } catch (e) {
      console.error("❌ Error parseando JSON:", text);
      throw new Error("Respuesta no JSON: " + text.substring(0, 100));
    }

    if (!res.ok || data.ok === false) {
      throw new Error(data.error || `Error HTTP ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error(`❌ Error en apiFetch a ${path}:`, error);
    throw error;
  }
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
  const roleClean = String(user.role || user.rol || "").trim();
  localStorage.setItem("ferjer_logged", "1");
  LS.set("ferjer_session", { 
    id:    user.id || user.id_usuario || null,
    name:  user.name, 
    email: user.email, 
    role:  roleClean 
  });
}
function getSession() { return LS.get("ferjer_session", null); }
function clearSession() {
  localStorage.removeItem("ferjer_logged");
  localStorage.removeItem("ferjer_session");
}
function isLogged() { return localStorage.getItem("ferjer_logged") === "1"; }

// ===== Roles =====
function normRole(role) { return String(role || "").trim().toLowerCase(); }
function isClient(role)    { return normRole(role) === "cliente"; }
function isCliente(role)   { return normRole(role) === "cliente"; }
function isTecnico(role)   { return normRole(role) === "tecnico"; }
function isEmpleado(role)  { return normRole(role) === "empleado"; }
function isAdminRole(role) { const r = normRole(role); return r === "administrador" || r === "admin"; }
function isStaff(role)     { return isAdminRole(role) || isTecnico(role) || isEmpleado(role); }

function canVerEquipos(role)          { return isStaff(role); }
function canRegistrarEquipo(role)     { return isStaff(role); }
function canCambiarEstatus(role)      { return isStaff(role); }
function canCambiarEstatusCompleto(role) { return isAdminRole(role) || isTecnico(role); }
function canVerHistorial(role)        { return isAdminRole(role) || isTecnico(role); }
function canCrearUsuarios(role)       { return isAdminRole(role); }
function canVerTienda(role)           { return isCliente(role) || isAdminRole(role) || isEmpleado(role); }
function canVerEntregas(role)         { return isAdminRole(role) || isEmpleado(role); }

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

  if (isCliente(role)) {
    nav.innerHTML = `
      <a class="nav-link rounded-3 px-3 py-2" href="cliente-mis-equipos.html">Mis equipos</a>
      <a class="nav-link rounded-3 px-3 py-2" href="cliente-productos.html">Tienda</a>
      <a class="nav-link rounded-3 px-3 py-2" href="cliente-mis-pedidos.html">Mis pedidos</a>

    `;
    return;
  }

  let links = `<a class="nav-link rounded-3 px-3 py-2" href="dashboard.html">Dashboard</a>`;
  if (canVerEquipos(role))      links += `<a class="nav-link rounded-3 px-3 py-2" href="equipos.html">Equipos</a>`;
  if (canRegistrarEquipo(role)) links += `<a class="nav-link rounded-3 px-3 py-2" href="nuevo-equipo.html">Nuevo registro</a>`;
  if (canVerEntregas(role))     links += `<a class="nav-link rounded-3 px-3 py-2" href="entregas.html">Entregas pendientes</a>`;

  links += `<div class="mt-2 px-3 text-uppercase text-secondary small fw-semibold">Naveganet</div>`;
  if (canVerTienda(role)) {
    const paginaProductos = isAdminRole(role) ? "inventario.html" : "cliente-productos.html";
    links += `<a class="nav-link rounded-3 px-3 py-2" href="${paginaProductos}">Productos</a>`;
  }

  if (canCrearUsuarios(role))   links += `<a class="nav-link rounded-3 px-3 py-2" href="gestionU.html">Usuarios</a>`;

  nav.innerHTML = links;
}
// ===== Protección =====
function protectRoutes() {
  let page = window.location.pathname.split("/").pop();
  if (!page) page = "index.html";

  const publicPages = ["index.html", "login.html", "register.html"];
  if (publicPages.includes(page)) return;

  if (!isLogged()) { window.location.href = "login.html"; return; }

  const role = getSession()?.role || "";
  const clientPages = ["cliente-mis-equipos.html"];
  const staffPages  = [
    "dashboard.html", "equipos.html", "nuevo-equipo.html",
    "detalle-equipo.html", "productos-admin.html", "naveganet-usuarios.html", "entregas.html", "inventario.html"
  ];

  if (isCliente(role) && staffPages.includes(page))  { window.location.href = "cliente-mis-equipos.html"; return; }
  if (isStaff(role)   && clientPages.includes(page)) { window.location.href = "dashboard.html"; return; }
  if (page === "naveganet-usuarios.html" && !canCrearUsuarios(role)) { window.location.href = "dashboard.html"; return; }
}

// ===== Modal status (Bootstrap) =====
function ensureStatusModal() {
  console.log("Verificando si existe statusModal...");
  if (document.getElementById("statusModal")) {
    console.log("✅ Modal ya existe");
    return;
  }

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
  
  // Verificar que se creó correctamente
  setTimeout(() => {
    console.log("✅ Modal creado, smGuardar existe?", !!document.getElementById("smGuardar"));
  }, 100);
}

function setModalMsg(type, text) {
  const el = document.getElementById("smMsg");
  if (!el) {
    console.error("❌ Elemento smMsg no encontrado");
    return;
  }
  el.className = `alert alert-${type}`;
  el.textContent = text;
  el.classList.remove("d-none");
  console.log(`📢 Modal message: ${type} - ${text}`);
}

function clearModalMsg() {
  const el = document.getElementById("smMsg");
  if (el) el.classList.add("d-none");
}

// ================= DOMContentLoaded =================
document.addEventListener("DOMContentLoaded", () => {
  console.log("📌 DOMContentLoaded");
  
  protectRoutes();
  renderSidebarNav();

  // Topbar usuario
  const topbar = document.getElementById("topbarUsuario");
  if (topbar) {
    const session = getSession();
    if (session) topbar.textContent = `${session.role}: ${session.name}`;
  }

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
        const data = await apiFetch(BASE_API + "auth/login.php", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });

        setSession({ name: data.user.nombre, email: data.user.email, role: data.user.rol, id: data.user.id_usuario });

        // Guardar token si el backend lo envía (para móvil y también para web)
        if (data.token) localStorage.setItem("token", data.token);

        window.location.href = isClient(data.user.rol)
          ? "cliente-mis-equipos.html"
          : "dashboard.html";

      } catch (err) {
        console.error("❌ Error login:", err);
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

      let rol = "cliente"; // Por defecto, el registro es para clientes

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
        await apiFetch(BASE_API + "auth/register.php", {
          method: "POST",
          body: JSON.stringify({ nombre, email, password, rol })
        });

    okMsg?.classList.remove("d-none");
    if (okMsg) okMsg.textContent = "Usuario creado ✅";
    registerForm.reset();
    setTimeout(async () => {
      try {
        const login = await apiFetch(BASE_API + "auth/login.php", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        setSession({ name: login.user.nombre, email: login.user.email, role: login.user.rol, id: login.user.id_usuario });
        if (login.token) localStorage.setItem("token", login.token);
        window.location.href = "cliente-mis-equipos.html";
      } catch {
        window.location.href = "login.html";
      }
    }, 1000);

      } catch (err) {
        console.error("❌ Error register:", err);
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
        const data = await apiFetch(BASE_API + "equipos/create.php", {
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
        console.error("❌ Error creando equipo:", err);
        alert(err.message || "Error al registrar equipo");
      }
    });
  }

  // ===== EQUIPOS LIST + MODAL STATUS (ADMIN) =====
  const equiposBody = document.getElementById("equiposBody");
  if (equiposBody) {
    console.log("📌 Inicializando equiposBody");
    
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const btnClear = document.getElementById("btnClear");
    const emptyState = document.getElementById("emptyState");

    const allowed = ["Recibido", "Diagnóstico", "Reparación", "Listo", "Entregado"];

    // Variables para el modal
    let currentFolio = null;
    let currentActual = "";
    let modal = null;

    async function renderEquipos() {
      const q = (searchInput?.value || "").trim();
      const st = (statusFilter?.value || "").trim();

      const params = new URLSearchParams();
      if (q) params.set("search", q);
      if (st) params.set("status", st);

      try {
        console.log("🔄 Cargando equipos...");
        const data = await apiFetch(BASE_API + "equipos/list.php" + (params.toString() ? "?" + params.toString() : ""));
        const equipos = data.data || [];
        console.log(`✅ ${equipos.length} equipos cargados`);

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

              <button class="btn btn-sm btn-outline-primary btn-cambiar-estatus"
                      data-folio="${x.folio}"
                      data-estatus="${x.estatus}">
                Cambiar
              </button>
            </td>
          </tr>
        `).join("");

        if (equipos.length === 0) emptyState?.classList.remove("d-none");
        else emptyState?.classList.add("d-none");

      } catch (err) {
        console.error("❌ Error cargando equipos:", err);
        equiposBody.innerHTML = `<tr><td colspan="6" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    }

    // Inicializar el modal
    ensureStatusModal();
    
    // Obtener referencia al modal de Bootstrap
    const modalEl = document.getElementById("statusModal");
    if (modalEl && window.bootstrap) {
      modal = new bootstrap.Modal(modalEl);
      console.log("✅ Modal de Bootstrap inicializado");
    } else {
      console.error("❌ No se pudo inicializar el modal");
    }

    const smFolio = document.getElementById("smFolio");
    const smActualBadge = document.getElementById("smActualBadge");
    const smNuevo = document.getElementById("smNuevo");
    const smComentario = document.getElementById("smComentario");
    const smGuardar = document.getElementById("smGuardar");

    if (smNuevo && smNuevo.options.length === 0) {
      smNuevo.innerHTML = allowed.map(s => `<option value="${s}">${s}</option>`).join("");
      console.log("✅ Opciones del select cargadas");
    }

    // Evento para abrir modal (usando delegación en equiposBody)
    equiposBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-cambiar-estatus");
      if (!btn) return;

      currentFolio = btn.getAttribute("data-folio");
      currentActual = btn.getAttribute("data-estatus") || "";

      console.log("📌 Abriendo modal - Folio:", currentFolio, "Estatus:", currentActual);

      if (!currentFolio) {
        alert("Folio inválido");
        return;
      }

      if (smFolio) smFolio.textContent = currentFolio;
      if (smActualBadge) {
        smActualBadge.className = `badge ${badgeClass(currentActual)}`;
        smActualBadge.textContent = currentActual || "-";
      }
      if (smNuevo) smNuevo.value = currentActual;
      if (smComentario) smComentario.value = "";

      clearModalMsg();
      
      if (modal) {
        modal.show();
        console.log("✅ Modal mostrado");
      } else {
        console.error("❌ Modal no inicializado");
      }
    });

// Evento para guardar cambios
if (smGuardar) {
  console.log("✅ Evento guardar registrado");
  
  smGuardar.addEventListener("click", async function handler() {
    if (smGuardar.dataset.busy === "1") return;
    smGuardar.dataset.busy = "1";

    const smMsgEl = document.getElementById("smMsg");

    function showMsg(type, text) {
      if (!smMsgEl) return;
      smMsgEl.className = `alert alert-${type}`;
      smMsgEl.textContent = text;
      smMsgEl.classList.remove("d-none");
    }

    const nuevo = String(smNuevo?.value || "").trim();
    const comentario = String(smComentario?.value || "").trim() || "Cambio de estatus";

    if (!allowed.includes(nuevo)) { showMsg("danger", "Estatus inválido."); smGuardar.dataset.busy = "0"; return; }
    if (!currentFolio) { showMsg("danger", "Folio inválido."); smGuardar.dataset.busy = "0"; return; }
    if (nuevo === currentActual) { showMsg("warning", "⚠️ Selecciona un estatus diferente."); smGuardar.dataset.busy = "0"; return; }

    smGuardar.disabled = true;
    smGuardar.textContent = "Guardando...";

    try {
      const folioNum = parseInt(currentFolio, 10);
      const resp = await apiFetch(EQUIPOS_STATUS_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ folio: folioNum, estatus: nuevo, comentario })
      });

      console.log("✅ Guardado:", resp);
      await renderEquipos();
      currentActual = nuevo;
      modal.hide();

    } catch (err) {
      showMsg("danger", err.message || "No se pudo actualizar");
    } finally {
      smGuardar.disabled = false;
      smGuardar.textContent = "Guardar";
      smGuardar.dataset.busy = "0";
    }
  });
} else {
  console.error("❌ smGuardar no encontrado en el DOM");
}

    // Cargar equipos inicialmente
    renderEquipos();
    
    // Eventos de filtros
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
        console.log("📌 Cargando mis equipos para:", email);
        
        const data = await apiFetch(BASE_API + "equipos/mine.php?email=" + encodeURIComponent(email));
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
        console.error("❌ Error cargando mis equipos:", err);
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
        console.log("📌 Cargando detalle para folio:", folio);
        
        const det = await apiFetch(BASE_API + "equipos/get.php?folio=" + encodeURIComponent(folio));
        const d = det.data;

        document.getElementById("detFolio").textContent = d.folio;
        document.getElementById("detEstatus").textContent = d.estatus;
        document.getElementById("detCliente").textContent = d.cliente;
        document.getElementById("detCorreo").textContent = d.correo || "-";
        document.getElementById("detEquipo").textContent = `${d.tipo_equipo} - ${d.modelo}`;
        document.getElementById("detFecha").textContent = d.fecha_ingreso;
        document.getElementById("detFalla").textContent = d.falla;

        const h = await apiFetch(BASE_API + "historial/seguimiento.php?folio=" + encodeURIComponent(folio));
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
        console.error("❌ Error cargando detalle:", ex);
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
        console.log("📌 Cargando productos...");
        
        const data = await apiFetch(BASE_API + "productos/list.php");
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
        console.error("❌ Error cargando productos:", err);
        productsGrid.innerHTML = `<div class="text-danger">Error: ${err.message}</div>`;
      }
    })();
  }

  // ===== INVENTARIO (inventario.html) =====
  const inventarioBody = document.getElementById("inventarioBody");
  if (inventarioBody) {
    if (!isAdminRole(getSession()?.role)) {
  document.getElementById("btnNuevoProducto")?.classList.add("d-none");
    }

    let todosProductos = [];
    let productoAEliminar = null;
    let modoEdicion = false;

    async function cargarInventario() {
      try {
        const data = await apiFetch(BASE_API + "productos/list.php");
        todosProductos = data.data || [];
        renderInventario(todosProductos);
        actualizarContadoresInv(todosProductos);
      } catch (err) {
        inventarioBody.innerHTML = `<tr><td colspan="6" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    }

    function actualizarContadoresInv(lista) {
      document.getElementById("totalProductos").textContent = lista.length;
      document.getElementById("totalStock").textContent = lista.filter(p => p.stock > 0).length;
      document.getElementById("sinStock").textContent = lista.filter(p => p.stock <= 0).length;
    }

    function renderInventario(lista) {
      const empty = document.getElementById("inventarioEmpty");
      if (!lista.length) {
        inventarioBody.innerHTML = "";
        empty?.classList.remove("d-none");
        return;
      }
      empty?.classList.add("d-none");
      inventarioBody.innerHTML = lista.map(p => `
        <tr>
          <td class="text-secondary small">${p.id_producto}</td>
          <td style="width:70px;">
            ${p.imagen_url ? `<img src="${p.imagen_url}" style="width:60px;height:45px;object-fit:contain;">` : `<span class="text-secondary small">-</span>`}
          </td>
          <td class="fw-semibold">${p.nombre}</td>
          <td>$${Number(p.precio).toFixed(2)} <span class="text-secondary small">MXN</span></td>
          <td>
            <span class="badge rounded-pill ${p.stock > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}">
              Stock: ${p.stock}
            </span>
          </td>
          <td>
            ${isAdminRole(getSession()?.role) ? `
            <button class="btn btn-outline-secondary btn-sm me-1 btn-editar-prod" data-id="${p.id_producto}">Editar</button>
            <button class="btn btn-outline-danger btn-sm btn-eliminar-prod" data-id="${p.id_producto}">Eliminar</button>
          ` : '-'}
          </td>
        </tr>
      `).join("");
    }

    function filtrarInventario() {
      const texto = document.getElementById("searchInput").value.toLowerCase();
      const stock = document.getElementById("stockFilter").value;
      const lista = todosProductos.filter(p => {
        const matchTexto = p.nombre.toLowerCase().includes(texto) || String(p.id_producto).includes(texto);
        const matchStock = stock === "" ? true : stock === "con" ? p.stock > 0 : p.stock <= 0;
        return matchTexto && matchStock;
      });
      renderInventario(lista);
    }

    document.getElementById("searchInput")?.addEventListener("input", filtrarInventario);
    document.getElementById("stockFilter")?.addEventListener("change", filtrarInventario);
    document.getElementById("btnClear")?.addEventListener("click", () => {
      document.getElementById("searchInput").value = "";
      document.getElementById("stockFilter").value = "";
      renderInventario(todosProductos);
    });

    // Abrir modal nuevo
    document.getElementById("btnNuevoProducto")?.addEventListener("click", () => {
      modoEdicion = false;
      document.getElementById("modalProductoTitulo").textContent = "Nuevo producto";
      document.getElementById("productoId").value = "";
      document.getElementById("prodNombre").value = "";
      document.getElementById("prodPrecio").value = "";
      document.getElementById("prodStock").value = "";
      document.getElementById("prodImagen").value = "";
      document.getElementById("prodErr").classList.add("d-none");
      document.getElementById("prodMsg").classList.add("d-none");
    });

    // Editar
    inventarioBody.addEventListener("click", (e) => {
      const btnEditar = e.target.closest(".btn-editar-prod");
      if (btnEditar) {
        const id = btnEditar.dataset.id;
        const p = todosProductos.find(x => String(x.id_producto) === String(id));
        if (!p) return;
        modoEdicion = true;
        document.getElementById("modalProductoTitulo").textContent = "Editar producto";
        document.getElementById("productoId").value = p.id_producto;
        document.getElementById("prodNombre").value = p.nombre;
        document.getElementById("prodPrecio").value = p.precio;
        document.getElementById("prodStock").value = p.stock;
        document.getElementById("prodImagen").value = "";
        document.getElementById("prodErr").classList.add("d-none");
        document.getElementById("prodMsg").classList.add("d-none");
        new bootstrap.Modal(document.getElementById("modalProducto")).show();
      }

      const btnEliminar = e.target.closest(".btn-eliminar-prod");
      if (btnEliminar) {
        productoAEliminar = btnEliminar.dataset.id;
        new bootstrap.Modal(document.getElementById("modalEliminar")).show();
      }
    });

    // Guardar (crear o editar)
    document.getElementById("btnGuardarProducto")?.addEventListener("click", async () => {
      const nombre = document.getElementById("prodNombre").value.trim();
      const precio = document.getElementById("prodPrecio").value;
      const stock = document.getElementById("prodStock").value;
      const imagen = document.getElementById("prodImagen").files[0];
      const err = document.getElementById("prodErr");
      const msg = document.getElementById("prodMsg");

      err.classList.add("d-none");
      msg.classList.add("d-none");

      if (!nombre || precio === "" || stock === "") {
        err.textContent = "Completa los campos obligatorios.";
        err.classList.remove("d-none");
        return;
      }

      const endpoint = modoEdicion
        ? BASE_API + "productos/update.php"
        : BASE_API + "productos/create.php";

      const body = { nombre, precio: parseFloat(precio), stock: parseInt(stock), imagen: "" };
      if (modoEdicion) body.id = document.getElementById("productoId").value;

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          credentials: "same-origin",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}` 
          },
          body: JSON.stringify(body)
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { throw new Error("Respuesta no JSON"); }
        if (!res.ok || data.ok === false) throw new Error(data.error || "Error al guardar");

        msg.textContent = modoEdicion ? "Producto actualizado ✅" : "Producto creado ✅";
        msg.classList.remove("d-none");
        setTimeout(() => {
          bootstrap.Modal.getInstance(document.getElementById("modalProducto")).hide();
          cargarInventario();
        }, 1000);
      } catch (e) {
        err.textContent = e.message;
        err.classList.remove("d-none");
      }
    });



    // Confirmar eliminar
    document.getElementById("btnConfirmarEliminar")?.addEventListener("click", async () => {
      try {
        await apiFetch(BASE_API + "productos/delete.php", {
          method: "POST",
          body: JSON.stringify({ id: productoAEliminar })
        });
        bootstrap.Modal.getInstance(document.getElementById("modalEliminar")).hide();
        cargarInventario();
      } catch (e) {
        console.error("Error eliminando:", e);
      }
    });

    cargarInventario();
  }

// ===== USUARIOS (naveganet-usuarios.html) =====
  const usuariosBody = document.getElementById("usuariosBody");
  if (usuariosBody) {
    let todosUsuarios = [];
    let usuarioAEliminar = null;
    let modoEdicionUsuario = false;

    async function cargarUsuarios() {
      try {
        const data = await apiFetch(BASE_API + "usuarios/list.php");
        todosUsuarios = data.data || [];
        renderUsuarios(todosUsuarios);
        actualizarContadoresUsuarios(todosUsuarios);
      } catch (err) {
        usuariosBody.innerHTML = `<tr><td colspan="6" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    }

    function rolBadge(rol) {
      const r = normRole(rol);
      if (r === "administrador" || r === "admin") return "text-bg-primary";
      if (r === "tecnico")  return "text-bg-warning";
      if (r === "empleado") return "text-bg-info";
      return "text-bg-light border";
    }

    function actualizarContadoresUsuarios(lista) {
      document.getElementById("totalUsuarios").textContent = lista.length;
      document.getElementById("totalAdmins").textContent   = lista.filter(u => normRole(u.rol) === "administrador" || normRole(u.rol) === "admin").length;
      document.getElementById("totalTecnicos").textContent = lista.filter(u => normRole(u.rol) === "tecnico").length;
      document.getElementById("totalClientes").textContent = lista.filter(u => normRole(u.rol) === "cliente").length;
    }

    function renderUsuarios(lista) {
      const empty = document.getElementById("usuariosEmpty");
      if (!lista.length) {
        usuariosBody.innerHTML = "";
        empty?.classList.remove("d-none");
        return;
      }
      empty?.classList.add("d-none");
      usuariosBody.innerHTML = lista.map(u => `
        <tr>
          <td class="text-secondary small">${u.id_usuario ?? u.id}</td>
          <td class="fw-semibold">${u.nombre}</td>
          <td class="text-secondary">${u.email}</td>
          <td><span class="badge ${rolBadge(u.rol)}">${u.rol}</span></td>
          <td class="text-secondary small">${u.fecha_registro ?? "-"}</td>
          <td>
            <button class="btn btn-outline-secondary btn-sm me-1 btn-editar-usuario"
              data-id="${u.id_usuario ?? u.id}"
              data-nombre="${u.nombre}"
              data-email="${u.email}"
              data-rol="${u.rol}">Editar</button>
            <button class="btn btn-outline-danger btn-sm btn-eliminar-usuario"
              data-id="${u.id_usuario ?? u.id}">Eliminar</button>
          </td>
        </tr>
      `).join("");
    }

    // Filtrar
    function filtrarUsuarios() {
      const texto = document.getElementById("searchUsuario").value.toLowerCase();
      const rol   = document.getElementById("rolFilter").value.toLowerCase();
      const lista = todosUsuarios.filter(u => {
        const matchTexto = u.nombre.toLowerCase().includes(texto) || u.email.toLowerCase().includes(texto);
        const matchRol   = rol === "" ? true : normRole(u.rol) === rol;
        return matchTexto && matchRol;
      });
      renderUsuarios(lista);
    }

    document.getElementById("searchUsuario")?.addEventListener("input", filtrarUsuarios);
    document.getElementById("rolFilter")?.addEventListener("change", filtrarUsuarios);
    document.getElementById("btnClearUsuarios")?.addEventListener("click", () => {
      document.getElementById("searchUsuario").value = "";
      document.getElementById("rolFilter").value = "";
      renderUsuarios(todosUsuarios);
    });

    // Abrir modal nuevo
    document.getElementById("btnNuevoUsuario")?.addEventListener("click", () => {
      modoEdicionUsuario = false;
      document.getElementById("modalUsuarioTitulo").textContent = "Nuevo usuario";
      document.getElementById("usuarioId").value = "";
      document.getElementById("uNombre").value = "";
      document.getElementById("uEmail").value = "";
      document.getElementById("uPassword").value = "";
      document.getElementById("uPassword").required = true;
      document.getElementById("uPasswordHint").textContent = "";
      document.getElementById("uRol").value = "Cliente";
      document.getElementById("btnGuardarUsuario").textContent = "Crear usuario";
      document.getElementById("uErr").classList.add("d-none");
      document.getElementById("uMsg").classList.add("d-none");
    });

    // Delegación de eventos en la tabla
    usuariosBody.addEventListener("click", (e) => {
      // Editar
      const btnEditar = e.target.closest(".btn-editar-usuario");
      if (btnEditar) {
        modoEdicionUsuario = true;
        document.getElementById("modalUsuarioTitulo").textContent = "Editar usuario";
        document.getElementById("usuarioId").value  = btnEditar.dataset.id;
        document.getElementById("uNombre").value    = btnEditar.dataset.nombre;
        document.getElementById("uEmail").value     = btnEditar.dataset.email;
        document.getElementById("uPassword").value  = "";
        document.getElementById("uPassword").required = false;
        document.getElementById("uPasswordHint").textContent = "Deja en blanco para no cambiar la contraseña";
        document.getElementById("uRol").value       = btnEditar.dataset.rol;
        document.getElementById("btnGuardarUsuario").textContent = "Guardar cambios";
        document.getElementById("uErr").classList.add("d-none");
        document.getElementById("uMsg").classList.add("d-none");
        new bootstrap.Modal(document.getElementById("modalUsuario")).show();
      }

      // Eliminar
      const btnEliminar = e.target.closest(".btn-eliminar-usuario");
      if (btnEliminar) {
        usuarioAEliminar = btnEliminar.dataset.id;
        bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEliminarUsuario")).show();
      }
    });

    // Guardar (crear o editar)
    document.getElementById("btnGuardarUsuario")?.addEventListener("click", async () => {
      const nombre   = document.getElementById("uNombre").value.trim();
      const email    = document.getElementById("uEmail").value.trim().toLowerCase();
      const password = document.getElementById("uPassword").value.trim();
      const rol      = document.getElementById("uRol").value;
      const err = document.getElementById("uErr");
      const msg = document.getElementById("uMsg");

      err.classList.add("d-none");
      msg.classList.add("d-none");

      if (!nombre || !email) {
        err.textContent = "Nombre y correo son obligatorios.";
        err.classList.remove("d-none");
        return;
      }
      if (!email.includes("@")) {
        err.textContent = "El correo no es válido.";
        err.classList.remove("d-none");
        return;
      }
      if (!modoEdicionUsuario && password.length < 6) {
        err.textContent = "La contraseña debe tener al menos 6 caracteres.";
        err.classList.remove("d-none");
        return;
      }
      if (modoEdicionUsuario && password && password.length < 6) {
        err.textContent = "La contraseña debe tener al menos 6 caracteres.";
        err.classList.remove("d-none");
        return;
      }

      try {
        if (modoEdicionUsuario) {
          const body = { id: document.getElementById("usuarioId").value, nombre, email, rol };
          if (password) body.password = password;
          await apiFetch(BASE_API + "usuarios/update.php", {
            method: "POST",
            body: JSON.stringify(body)
          });
        } else {
          await apiFetch(BASE_API + "usuarios/create.php", {
            method: "POST",
            body: JSON.stringify({ nombre, email, password, rol })
          });
        }

        msg.textContent = modoEdicionUsuario ? "Usuario actualizado ✅" : "Usuario creado ✅";
        msg.classList.remove("d-none");

        setTimeout(() => {
          bootstrap.Modal.getInstance(document.getElementById("modalUsuario")).hide();
          cargarUsuarios();
        }, 1000);

      } catch (e) {
        err.textContent = e.message || "No se pudo guardar el usuario.";
        err.classList.remove("d-none");
      }
    });

    // Confirmar eliminar
    document.getElementById("btnConfirmarEliminarUsuario")?.addEventListener("click", async () => {
      try {
        await apiFetch(BASE_API + "usuarios/delete.php", {
          method: "POST",
          body: JSON.stringify({ id: usuarioAEliminar })
        });
        bootstrap.Modal.getOrCreateInstance(document.getElementById("modalEliminarUsuario")).hide();
        cargarUsuarios();
      } catch (e) {
        console.error("Error eliminando usuario:", e);
      }
    });

    cargarUsuarios();
  }

  // ===== ENTREGAS PENDIENTES =====
  const entregasBody = document.getElementById("entregasBody");
  if (entregasBody) {
    let pedidoSeleccionado = null;
    const modalEntrega = new bootstrap.Modal(document.getElementById("modalEntrega"));

    async function cargarEntregas() {
      entregasBody.innerHTML = `<tr><td colspan="7" class="text-center text-app-muted py-4">Cargando...</td></tr>`;
      document.getElementById("emptyEntregas")?.classList.add("d-none");

      try {
        const data = await apiFetch(BASE_API + "pedidos/entregas.php");
        const pedidos = data.data || [];

        // KPIs
        document.getElementById("kpiPendientes").textContent = pedidos.length;

        // Entregados hoy: hay que pedirlos aparte si el backend los filtra,
        // por ahora dejamos el contador en 0 ya que el endpoint solo trae Pagado/Listo
        // Si en el futuro el backend los incluye, se puede filtrar aquí

        if (!pedidos.length) {
          entregasBody.innerHTML = "";
          document.getElementById("emptyEntregas")?.classList.remove("d-none");
          return;
        }

        entregasBody.innerHTML = pedidos.map(p => `
          <tr>
            <td class="fw-semibold">#${p.id_pedido}</td>
            <td>
              <div>${p.cliente}</div>
              <div class="text-app-muted small">${p.email}</div>
            </td>
            <td class="text-app-muted small">${p.productos || "-"}</td>
            <td>$${Number(p.total || 0).toFixed(2)}</td>
            <td class="text-app-muted small">${p.fecha_pedido || "-"}</td>
            <td><span class="badge ${p.estatus === "Listo" ? "text-bg-success" : "text-bg-warning"}">${p.estatus}</span></td>
            <td class="text-end">
              <button class="btn btn-sm btn-success btn-entregar"
                data-id="${p.id_pedido}"
                data-cliente="${p.cliente}"
                data-productos="${p.productos || '-'}">
                ✓ Entregar
              </button>
            </td>
          </tr>
        `).join("");

      } catch (err) {
        console.error("❌ Error cargando entregas:", err);
        entregasBody.innerHTML = `<tr><td colspan="7" class="text-danger text-center py-3">Error: ${err.message}</td></tr>`;
      }
    }

    // Abrir modal al hacer clic en "Entregar"
    entregasBody.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn-entregar");
      if (!btn) return;
      pedidoSeleccionado = btn.dataset.id;
      document.getElementById("meCliente").textContent   = btn.dataset.cliente;
      document.getElementById("mePedido").textContent    = "#" + btn.dataset.id;
      document.getElementById("meProductos").textContent = btn.dataset.productos;
      document.getElementById("meMsg").classList.add("d-none");
      modalEntrega.show();
    });

    // Confirmar entrega
    document.getElementById("btnConfirmarEntrega")?.addEventListener("click", async () => {
      const btn = document.getElementById("btnConfirmarEntrega");
      const msg = document.getElementById("meMsg");
      btn.disabled = true;
      btn.textContent = "Guardando...";
      try {
        await apiFetch(BASE_API + "pedidos/entregas.php", {
          method: "POST",
          body: JSON.stringify({ id_pedido: pedidoSeleccionado })
        });
        // Sumar entregados hoy
        const kpiHoy = document.getElementById("kpiEntregadosHoy");
        if (kpiHoy) kpiHoy.textContent = (parseInt(kpiHoy.textContent) || 0) + 1;
        modalEntrega.hide();
        cargarEntregas();
      } catch (err) {
        msg.className = "alert alert-danger";
        msg.textContent = err.message || "No se pudo confirmar la entrega.";
        msg.classList.remove("d-none");
      } finally {
        btn.disabled = false;
        btn.textContent = "✓ Confirmar entrega";
      }
    });

    document.getElementById("btnRefresh")?.addEventListener("click", cargarEntregas);
    cargarEntregas();
  }

  // ===== DASHBOARD =====
  const kpiTotal = document.getElementById("kpiTotal");
  if (kpiTotal) {
    (async () => {
      try {
        const session = getSession();

        // Mostrar nombre del usuario en el topbar
        const spanUsuario = document.querySelector("header .fw-semibold");
        if (spanUsuario && session?.name) spanUsuario.textContent = session.name;

        // Cargar todos los equipos
        const data = await apiFetch(BASE_API + "equipos/list.php");
        const equipos = data.data || [];

        // KPIs
        document.getElementById("kpiTotal").textContent  = equipos.length;
        document.getElementById("kpiDiag").textContent   = equipos.filter(e => e.estatus === "Diagnóstico").length;
        document.getElementById("kpiRep").textContent    = equipos.filter(e => e.estatus === "Reparación").length;
        document.getElementById("kpiListo").textContent  = equipos.filter(e => e.estatus === "Listo").length;

        // Últimos 5 registros
        const recientes = [...equipos].slice(0, 5);
        const tbody = document.getElementById("tblRecientes");

        if (!recientes.length) {
          tbody.innerHTML = `<tr><td colspan="5" class="text-secondary text-center py-3">No hay registros aún.</td></tr>`;
          return;
        }

        tbody.innerHTML = recientes.map(e => `
          <tr>
            <td class="fw-semibold">${e.folio}</td>
            <td>${e.cliente}</td>
            <td>${e.tipo_equipo} - ${e.modelo}</td>
            <td><span class="badge ${badgeClass(e.estatus)}">${e.estatus}</span></td>
            <td class="text-secondary small">${e.fecha_ingreso}</td>
          </tr>
        `).join("");

      } catch (err) {
        console.error("❌ Error cargando dashboard:", err);
        document.getElementById("tblRecientes").innerHTML =
          `<tr><td colspan="5" class="text-danger">Error: ${err.message}</td></tr>`;
      }
    })();
  }
});