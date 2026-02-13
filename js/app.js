// ===== Helpers LocalStorage =====
console.log("✅ app.js cargó");

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

// Helper: set text safely (evita optional chaining en asignación)
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}
function showEl(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove("d-none");
}
function hideEl(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add("d-none");
}

// ====== Usuarios (registro/login demo) ======
function seedAdminIfMissing() {
  const users = LS.get("ferjer_users", []);

  const exists = users.some(u =>
    String(u.email || "").trim().toLowerCase() === "admin@ferjer.com"
  );

  if (!exists) {
    users.push({
      name: "Admin",
      email: "admin@ferjer.com",
      pass: "123456",
      role: "Administrador"
    });
    LS.set("ferjer_users", users);
  }
}

function setSession(user) {
  localStorage.setItem("ferjer_logged", "1");
  LS.set("ferjer_session", { name: user.name, email: user.email, role: user.role });
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

// ====== Equipos ======
function getEquipos() {
  return LS.get("ferjer_equipos", []);
}
function setEquipos(data) {
  LS.set("ferjer_equipos", data);
}
function nextFolio() {
  const n = LS.get("ferjer_folio_counter", 0) + 1;
  LS.set("ferjer_folio_counter", n);
  return "F-" + String(n).padStart(5, "0");
}

// ====== Productos Naveganet (demo) ======
function seedProductsIfEmpty() {
  const existing = LS.get("naveganet_products", null);
  if (existing && Array.isArray(existing) && existing.length) return;

  const products = [
    { id: "P-001", name: "Paquete Internet 50 Mbps", desc: "Ideal para hogar (streaming y trabajo).", price: 399 },
    { id: "P-002", name: "Paquete Internet 100 Mbps", desc: "Mejor rendimiento para varios dispositivos.", price: 549 },
    { id: "P-003", name: "Extensor WiFi", desc: "Mejora cobertura inalámbrica en el hogar.", price: 299 },
    { id: "P-004", name: "Soporte Técnico Remoto", desc: "Asistencia por llamada/PC remota (1 hora).", price: 250 },
    { id: "P-005", name: "Mantenimiento Preventivo", desc: "Limpieza y optimización del equipo.", price: 350 },
    { id: "P-006", name: "Reinstalación de Sistema", desc: "Formateo + instalación + drivers (demo).", price: 600 },
  ];
  LS.set("naveganet_products", products);
}

function getProducts() {
  return LS.get("naveganet_products", []);
}

// ====== UI ======
function badgeClass(status) {
  if (status === "Diagnóstico") return "text-bg-warning";
  if (status === "Reparación") return "text-bg-primary";
  if (status === "Listo") return "text-bg-success";
  if (status === "Entregado") return "text-bg-dark";
  return "text-bg-secondary"; // Recibido
}

// ====== Menú por rol ======
function renderSidebarNav() {
  const nav = document.getElementById("sidebarNav");
  if (!nav) return;

  const session = getSession();
  const role = session?.role || "";

// Cliente
if (role === "Cliente") {
  nav.innerHTML = `
    <button type="button" class="nav-link rounded-3 px-3 py-2 btn btn-link text-start" id="navMisEquipos">
      Mis equipos
    </button>
    <button type="button" class="nav-link rounded-3 px-3 py-2 btn btn-link text-start" id="navProductos">
      Productos Naveganet
    </button>
  `;

  document.getElementById("navMisEquipos")?.addEventListener("click", () => {
    window.location.href = new URL("cliente-mis-equipos.html", window.location.href).toString();
  });

  document.getElementById("navProductos")?.addEventListener("click", () => {
    window.location.href = new URL("cliente-productos.html", window.location.href).toString();
  });

  return;
}

  // Admin / Staff
  nav.innerHTML = `
    <a class="nav-link rounded-3 px-3 py-2" href="dashboard.html">Dashboard</a>
    <a class="nav-link rounded-3 px-3 py-2" href="equipos.html">Equipos</a>
    <a class="nav-link rounded-3 px-3 py-2" href="nuevo-equipo.html">Nuevo registro</a>
    <div class="mt-2 px-3 text-uppercase text-secondary small fw-semibold">Naveganet</div>
    <a class="nav-link rounded-3 px-3 py-2" href="naveganet-usuarios.html">Usuarios</a>
  `;

  // Si no es admin, oculta Usuarios
  if (role !== "Administrador") {
    nav.innerHTML = `
      <a class="nav-link rounded-3 px-3 py-2" href="dashboard.html">Dashboard</a>
      <a class="nav-link rounded-3 px-3 py-2" href="equipos.html">Equipos</a>
      <a class="nav-link rounded-3 px-3 py-2" href="nuevo-equipo.html">Nuevo registro</a>
    `;
  }
}

// ====== Protecciones por rol ======
function protectRoutes() {
  let page = window.location.pathname.split("/").pop();
  if (page && !page.includes(".html")) page = page + ".html";

  const session = getSession();
  const role = session?.role || "";

  const publicPages = ["index.html", "login.html", "register.html", ""];
  if (publicPages.includes(page)) return;

  // Si no hay sesión
  if (!isLogged()) {
    window.location.href = "login.html";
    return;
  }

  // Páginas de Cliente
  const clientPages = ["cliente-mis-equipos.html", "cliente-productos.html"];
  // Páginas de Staff/Admin
  const staffPages = ["dashboard.html", "equipos.html", "nuevo-equipo.html", "naveganet-usuarios.html"];

  // Cliente no entra a staff
  if (role === "Cliente" && staffPages.includes(page)) {
    window.location.href = "cliente-mis-equipos.html";
    return;
  }

  // Staff/Admin no entra a cliente
  if (role !== "Cliente" && clientPages.includes(page)) {
    window.location.href = "dashboard.html";
    return;
  }

  // Solo admin puede ver usuarios
  if (page === "naveganet-usuarios.html" && role !== "Administrador") {
    window.location.href = "dashboard.html";
    return;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  seedAdminIfMissing();
  seedProductsIfEmpty();
  protectRoutes();
  renderSidebarNav();

  // ====== LOGOUT ======
  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      clearSession();
      window.location.href = "login.html";
    });
  }

  // ====== LOGIN ======
  const loginForm = document.getElementById("loginForm");
  const loginMsg = document.getElementById("loginMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      try {
        const email = document.getElementById("email");
        const password = document.getElementById("password");

        // Mensaje visible
        if (loginMsg) {
          loginMsg.classList.remove("d-none");
          loginMsg.textContent = "Procesando...";
        }

        let ok = true;
        if (!email?.value.includes("@")) { email?.classList.add("is-invalid"); ok = false; }
        else { email?.classList.remove("is-invalid"); email?.classList.add("is-valid"); }

        if ((password?.value || "").length < 6) { password?.classList.add("is-invalid"); ok = false; }
        else { password?.classList.remove("is-invalid"); password?.classList.add("is-valid"); }

        if (!ok) {
          if (loginMsg) loginMsg.textContent = "Revisa correo/contraseña (mínimo 6 caracteres).";
          return;
        }

        const users = LS.get("ferjer_users", []);
        const emailIn = String(email.value || "").trim().toLowerCase();
        const passIn = String(password.value || "").trim();

        const user = users.find(u =>
          String(u.email || "").trim().toLowerCase() === emailIn &&
          String(u.pass || "").trim() === passIn
        );

        if (!user) {
          if (loginMsg) loginMsg.textContent = "Credenciales incorrectas. Prueba admin@ferjer.com / 123456.";
          return;
        }

        setSession(user);

        if (loginMsg) loginMsg.textContent = "Acceso correcto. Redirigiendo...";

        window.location.href = (user.role === "Cliente")
          ? "cliente-mis-equipos.html"
          : "dashboard.html";

      } catch (err) {
        console.error(err);
        if (loginMsg) {
          loginMsg.classList.remove("d-none");
          loginMsg.textContent = "Error en JS. Revisa la consola (F12).";
        }
      }
    });
  }

  // ====== REGISTER ======
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("regName");
      const email = document.getElementById("regEmail");
      const pass = document.getElementById("regPass");
      const pass2 = document.getElementById("regPass2");
      const role = document.getElementById("regRole");

      const okMsg = document.getElementById("regMsgOk");
      const errMsg = document.getElementById("regMsgErr");

      if (okMsg) okMsg.classList.add("d-none");
      if (errMsg) errMsg.classList.add("d-none");

      let ok = true;

      if (!name.value.trim()) { name.classList.add("is-invalid"); ok = false; } else name.classList.remove("is-invalid");
      if (!email.value.includes("@")) { email.classList.add("is-invalid"); ok = false; } else email.classList.remove("is-invalid");
      if (pass.value.length < 6) { pass.classList.add("is-invalid"); ok = false; } else pass.classList.remove("is-invalid");
      if (pass2.value !== pass.value || pass2.value.length < 6) { pass2.classList.add("is-invalid"); ok = false; } else pass2.classList.remove("is-invalid");
      if (!role.value) { role.classList.add("is-invalid"); ok = false; } else role.classList.remove("is-invalid");

      if (!ok) return;

      const users = LS.get("ferjer_users", []);
      const emailIn = String(email.value || "").trim().toLowerCase();

      const exists = users.some(u =>
        String(u.email || "").trim().toLowerCase() === emailIn
      );

      if (exists) {
        if (errMsg) errMsg.classList.remove("d-none");
        return;
      }

      users.push({
        name: String(name.value || "").trim(),
        email: String(email.value || "").trim(),
        pass: String(pass.value || "").trim(),
        role: role.value
      });

      LS.set("ferjer_users", users);

      if (okMsg) okMsg.classList.remove("d-none");
      registerForm.reset();
    });
  }

  // ====== NUEVO EQUIPO ======
  const equipoForm = document.getElementById("equipoForm");
  if (equipoForm) {
    const folioInput = document.getElementById("folio");
    const estatusInput = document.getElementById("estatus");
    const saveOk = document.getElementById("saveOk");

    if (folioInput) folioInput.value = nextFolio();
    if (estatusInput) estatusInput.value = "Recibido";

    equipoForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const cliente = document.getElementById("cliente");
      const clienteEmail = document.getElementById("clienteEmail");
      const tipo = document.getElementById("tipo");
      const modelo = document.getElementById("modelo");
      const falla = document.getElementById("falla");

      let ok = true;
      [cliente, clienteEmail, tipo, modelo, falla].forEach(el => {
        if (!el || !el.value.trim()) { el?.classList.add("is-invalid"); ok = false; }
        else el.classList.remove("is-invalid");
      });

      if (clienteEmail && !clienteEmail.value.includes("@")) { clienteEmail.classList.add("is-invalid"); ok = false; }

      if (!ok) return;

      const equipos = getEquipos();
      const fecha = new Date().toLocaleDateString("es-MX");

      equipos.unshift({
        folio: folioInput ? folioInput.value : nextFolio(),
        cliente: cliente.value.trim(),
        clienteEmail: clienteEmail.value.trim().toLowerCase(),
        equipo: `${tipo.value} - ${modelo.value.trim()}`,
        estatus: "Recibido",
        fecha,
        falla: falla.value.trim()
      });

      setEquipos(equipos);
      if (saveOk) saveOk.classList.remove("d-none");

      equipoForm.reset();
      const est = document.getElementById("estatus");
      const fol = document.getElementById("folio");
      if (est) est.value = "Recibido";
      if (fol) fol.value = nextFolio();
    });
  }

  // ====== EQUIPOS: listar + buscar + filtrar ======
  const equiposBody = document.getElementById("equiposBody");
  if (equiposBody) {
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const btnClear = document.getElementById("btnClear");
    const emptyState = document.getElementById("emptyState");

    function render() {
      const equipos = getEquipos();
      const q = (searchInput?.value || "").toLowerCase();
      const st = statusFilter?.value || "";

      const filtered = equipos.filter(x => {
        const matchQ =
          String(x.folio || "").toLowerCase().includes(q) ||
          String(x.cliente || "").toLowerCase().includes(q) ||
          String(x.clienteEmail || "").toLowerCase().includes(q) ||
          String(x.equipo || "").toLowerCase().includes(q);
        const matchSt = st ? x.estatus === st : true;
        return matchQ && matchSt;
      });

      equiposBody.innerHTML = filtered.map(x => `
        <tr>
          <td class="fw-semibold">${x.folio}</td>
          <td>${x.cliente}</td>
          <td class="text-secondary">${x.clienteEmail || "-"}</td>
          <td>${x.equipo}<div class="text-secondary small">${x.fecha}</div></td>
          <td><span class="badge ${badgeClass(x.estatus)}">${x.estatus}</span></td>
          <td><button class="btn btn-sm btn-outline-secondary" disabled>Detalle</button></td>
        </tr>
      `).join("");

      if (equipos.length === 0) emptyState?.classList.remove("d-none");
      else emptyState?.classList.add("d-none");
    }

    render();
    searchInput?.addEventListener("input", render);
    statusFilter?.addEventListener("change", render);
    btnClear?.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (statusFilter) statusFilter.value = "";
      render();
    });
  }

  // ====== DASHBOARD KPIs ======
  const tblRecientes = document.getElementById("tblRecientes");
  if (tblRecientes) {
    const equipos = getEquipos();

    const total = equipos.length;
    const diag = equipos.filter(x => x.estatus === "Diagnóstico").length;
    const rep = equipos.filter(x => x.estatus === "Reparación").length;
    const listo = equipos.filter(x => x.estatus === "Listo").length;

    // ✅ Sin optional chaining del lado izquierdo
    setText("kpiTotal", total);
    setText("kpiDiag", diag);
    setText("kpiRep", rep);
    setText("kpiListo", listo);

    const recientes = equipos.slice(0, 6);
    tblRecientes.innerHTML = recientes.map(x => `
      <tr>
        <td class="fw-semibold">${x.folio}</td>
        <td>${x.cliente}</td>
        <td>${x.equipo}</td>
        <td><span class="badge ${badgeClass(x.estatus)}">${x.estatus}</span></td>
        <td class="text-secondary">${x.fecha}</td>
      </tr>
    `).join("");

    if (recientes.length === 0) {
      tblRecientes.innerHTML = `<tr><td colspan="5" class="text-center text-secondary py-4">
        Aún no hay registros. Crea uno en “Nuevo registro”.
      </td></tr>`;
    }
  }

  // ====== CLIENTE: Mis equipos ======
  const myEquiposBody = document.getElementById("myEquiposBody");
  if (myEquiposBody) {
    const session = getSession();
    const email = (session?.email || "").toLowerCase();
    const equipos = getEquipos().filter(e => (e.clienteEmail || "").toLowerCase() === email);

    myEquiposBody.innerHTML = equipos.map(e => `
      <tr>
        <td class="fw-semibold">${e.folio}</td>
        <td>${e.equipo}</td>
        <td><span class="badge ${badgeClass(e.estatus)}">${e.estatus}</span></td>
        <td class="text-secondary">${e.fecha}</td>
      </tr>
    `).join("");

    const empty = document.getElementById("myEquiposEmpty");
    if (equipos.length === 0) empty?.classList.remove("d-none");
    else empty?.classList.add("d-none");
  }

  // ====== CLIENTE: Productos Naveganet ======
  const productsGrid = document.getElementById("productsGrid");
  if (productsGrid) {
    const products = getProducts();
    productsGrid.innerHTML = products.map(p => `
      <div class="col-sm-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0 rounded-4">
          <div class="card-body">
            <div class="text-secondary small">${p.id}</div>
            <h5 class="fw-semibold mt-1">${p.name}</h5>
            <p class="text-secondary mb-3">${p.desc}</p>
            <div class="d-flex align-items-center justify-content-between">
              <span class="fw-bold">$${p.price} MXN</span>
              <button class="btn btn-sm btn-outline-primary" disabled>Solicitar</button>
            </div>
          </div>
        </div>
      </div>
    `).join("");
  }
});

// ====== NAVEGANET | USUARIOS (CRUD demo) ======
function getUsers() { return LS.get("ferjer_users", []); }
function setUsers(users) { LS.set("ferjer_users", users); }

document.addEventListener("DOMContentLoaded", () => {
  const usersBody = document.getElementById("usersBody");
  if (!usersBody) return;

  const userSearch = document.getElementById("userSearch");
  const btnUserClear = document.getElementById("btnUserClear");

  const userModalEl = document.getElementById("userModal");
  const deleteModalEl = document.getElementById("deleteModal");
  const userModal = (window.bootstrap && userModalEl) ? bootstrap.Modal.getOrCreateInstance(userModalEl) : null;
  const deleteModal = (window.bootstrap && deleteModalEl) ? bootstrap.Modal.getOrCreateInstance(deleteModalEl) : null;

  const btnNewUser = document.getElementById("btnNewUser");
  const userForm = document.getElementById("userForm");
  const userErr = document.getElementById("userErr");

  const uName = document.getElementById("uName");
  const uEmail = document.getElementById("uEmail");
  const uPass = document.getElementById("uPass");
  const uRole = document.getElementById("uRole");
  const editEmailOriginal = document.getElementById("editEmailOriginal");
  const userModalTitle = document.getElementById("userModalTitle");

  const usersEmpty = document.getElementById("usersEmpty");
  const delUserEmail = document.getElementById("delUserEmail");
  const btnConfirmDelete = document.getElementById("btnConfirmDelete");

  let pendingDeleteEmail = null;

  function openNew() {
    if (userModalTitle) userModalTitle.textContent = "Nuevo usuario";
    if (editEmailOriginal) editEmailOriginal.value = "";
    userErr?.classList.add("d-none");
    userForm?.reset();
    [uName, uEmail, uPass, uRole].forEach(el => el?.classList.remove("is-invalid", "is-valid"));
    userModal?.show();
  }

  function openEdit(user) {
    if (userModalTitle) userModalTitle.textContent = "Editar usuario";
    userErr?.classList.add("d-none");

    if (editEmailOriginal) editEmailOriginal.value = user.email;
    if (uName) uName.value = user.name;
    if (uEmail) uEmail.value = user.email;
    if (uPass) uPass.value = user.pass; // demo
    if (uRole) uRole.value = user.role;

    [uName, uEmail, uPass, uRole].forEach(el => el?.classList.remove("is-invalid", "is-valid"));
    userModal?.show();
  }

  function renderUsers() {
    const users = getUsers();
    const q = (userSearch?.value || "").toLowerCase();

    const filtered = users.filter(u =>
      String(u.name || "").toLowerCase().includes(q) ||
      String(u.email || "").toLowerCase().includes(q) ||
      String(u.role || "").toLowerCase().includes(q)
    );

    usersBody.innerHTML = filtered.map(u => `
      <tr>
        <td class="fw-semibold">${u.name}</td>
        <td>${u.email}</td>
        <td><span class="badge text-bg-light border">${u.role}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" data-action="edit" data-email="${u.email}">Editar</button>
          <button class="btn btn-sm btn-outline-danger" data-action="del" data-email="${u.email}">Eliminar</button>
        </td>
      </tr>
    `).join("");

    if (users.length === 0) usersEmpty?.classList.remove("d-none");
    else usersEmpty?.classList.add("d-none");
  }

  btnNewUser?.addEventListener("click", openNew);

  btnUserClear?.addEventListener("click", () => {
    if (userSearch) userSearch.value = "";
    renderUsers();
  });

  userSearch?.addEventListener("input", renderUsers);

  usersBody.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    const email = btn.getAttribute("data-email");
    const action = btn.getAttribute("data-action");

    const users = getUsers();
    const user = users.find(x => x.email === email);
    if (!user) return;

    if (action === "edit") openEdit(user);
    if (action === "del") {
      pendingDeleteEmail = email;
      if (delUserEmail) delUserEmail.textContent = email;
      deleteModal?.show();
    }
  });

  btnConfirmDelete?.addEventListener("click", () => {
    if (!pendingDeleteEmail) return;

    if (String(pendingDeleteEmail).toLowerCase() === "admin@ferjer.com") {
      if (delUserEmail) delUserEmail.textContent = "admin@ferjer.com (no se puede eliminar en demo)";
      return;
    }

    const users = getUsers().filter(u => u.email !== pendingDeleteEmail);
    setUsers(users);
    pendingDeleteEmail = null;
    deleteModal?.hide();
    renderUsers();
  });

  userForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    userErr?.classList.add("d-none");

    let ok = true;
    if (!uName?.value.trim()) { uName?.classList.add("is-invalid"); ok = false; } else uName?.classList.remove("is-invalid");
    if (!uEmail?.value.includes("@")) { uEmail?.classList.add("is-invalid"); ok = false; } else uEmail?.classList.remove("is-invalid");
    if ((uPass?.value || "").length < 6) { uPass?.classList.add("is-invalid"); ok = false; } else uPass?.classList.remove("is-invalid");
    if (!uRole?.value) { uRole?.classList.add("is-invalid"); ok = false; } else uRole?.classList.remove("is-invalid");
    if (!ok) return;

    const users = getUsers();
    const isEdit = !!(editEmailOriginal?.value);

    const emailNew = String(uEmail.value || "").trim();
    const emailOld = String(editEmailOriginal?.value || "").trim();

    const emailExists = users.some(u =>
      String(u.email || "").trim().toLowerCase() === emailNew.toLowerCase() &&
      (!isEdit || String(u.email || "").trim().toLowerCase() !== emailOld.toLowerCase())
    );

    if (emailExists) {
      userErr?.classList.remove("d-none");
      return;
    }

    if (isEdit) {
      const idx = users.findIndex(u => String(u.email || "").trim().toLowerCase() === emailOld.toLowerCase());
      if (idx >= 0) {
        users[idx] = {
          name: String(uName.value || "").trim(),
          email: emailNew,
          pass: String(uPass.value || "").trim(),
          role: uRole.value
        };
      }
    } else {
      users.push({
        name: String(uName.value || "").trim(),
        email: emailNew,
        pass: String(uPass.value || "").trim(),
        role: uRole.value
      });
    }

    setUsers(users);
    userModal?.hide();
    renderUsers();
  });

  renderUsers();
});
