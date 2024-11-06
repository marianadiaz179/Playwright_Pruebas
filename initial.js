// Importar Playwright
const playwright = require('playwright');
const fs = require('fs');  // Importar fs para verificar si la carpeta existe

const baseUrl = 'http://localhost:2368/ghost/'; // URL base
const editorUrl = 'http://localhost:2368/ghost/#/editor/post'; // URL para programar publicación
const scheduledUrl = 'http://localhost:2368/ghost/#/posts?type=scheduled'; // URL para publicaciones programadas
const settingsUrl = 'http://localhost:2368/ghost/#/settings'; // URL de configuración
const languageSettingsUrl = 'http://localhost:2368/ghost/#/settings/publication-language'; // URL de idioma de publicación
const membersPageUrl = 'http://localhost:2368/ghost/#/members';
const newMemberUrl = 'http://localhost:2368/ghost/#/members/new';

// Crear carpetas si no existen
const screenshotFolder = './screenshots';
const scenarioFolderPE1 = `${screenshotFolder}/PE1`;
const scenarioFolderPE2 = `${screenshotFolder}/PE2`;
const scenarioFolderPE3 = `${screenshotFolder}/PE3`;
const scenarioFolderPE4 = `${screenshotFolder}/PE4`;
const scenarioFolderPE5 = `${screenshotFolder}/PE5`;
const scenarioFolderPE6 = `${screenshotFolder}/PE6`;

if (!fs.existsSync(screenshotFolder)) {
  fs.mkdirSync(screenshotFolder);
}

if (!fs.existsSync(scenarioFolderPE1)) {
  fs.mkdirSync(scenarioFolderPE1);
}

if (!fs.existsSync(scenarioFolderPE2)) {
  fs.mkdirSync(scenarioFolderPE2);
}

if (!fs.existsSync(scenarioFolderPE3)) {
  fs.mkdirSync(scenarioFolderPE3);
}

if (!fs.existsSync(scenarioFolderPE4)) {
  fs.mkdirSync(scenarioFolderPE4);
}

if (!fs.existsSync(scenarioFolderPE5)) {
  fs.mkdirSync(scenarioFolderPE5);
}

if (!fs.existsSync(scenarioFolderPE6)) {
  fs.mkdirSync(scenarioFolderPE6);
}

(async () => {
  // Ejecución 1: Flujo con publicación programada (PE1)
  for (const browserType of ['chromium']) {
    console.log(`${browserType}-------------------------------------------`);

    // Lanzar el navegador y crear un nuevo contexto
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Escenario 1: Acceso y login
    console.log('Escenario 1: Acceso y login');
    await page.goto(baseUrl);

    await page.fill('input[name="identification"]', 'm.diaza2@uniandes.edu.co');
    await page.fill('input[name="password"]', 'M4r14n417*');

    // Captura después de rellenar el formulario pero antes de hacer clic en submit
    await page.screenshot({ path: `${scenarioFolderPE1}/01_login-filled.png` });

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Captura después de realizar el login y después de la navegación
    await page.screenshot({ path: `${scenarioFolderPE1}/02_login-success.png` });

    console.log('Login exitoso');

    // Escenario 2: Crear una nueva publicación
    console.log('Escenario 2: Crear una nueva publicación');
    await page.goto(editorUrl);
    await page.fill('textarea[placeholder="Post title"]', 'Mi nueva publicación');
    await page.screenshot({ path: `${scenarioFolderPE1}/03_post-title-filled.png` });

    const editorSelector = '.koenig-react-editor .koenig-lexical';
    await page.click(editorSelector); // Focalizar el editor
    await page.keyboard.type('Este es el contenido de la publicación.');
    await page.screenshot({ path: `${scenarioFolderPE1}/04_post-content-typed.png` });

    await page.click('button.gh-btn.gh-btn-editor.gh-publish-trigger');
    await page.waitForTimeout(3000); // Esperar para que la acción se complete
    await page.screenshot({ path: `${scenarioFolderPE1}/05_new-post-created.png` });
    console.log('Nueva publicación creada');

    // Escenario 3: Programar publicación con una hora adecuada
    console.log('Escenario 3: Programar publicación con hora adecuada');
    await page.click('div[data-test-setting="publish-at"] button.gh-publish-setting-title');
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${scenarioFolderPE1}/06_publish-setting-button-clicked.png` });

    await page.waitForTimeout(100);
    await page.click('div.gh-radio:has(div[data-test-radio="schedule"]) label');
    await page.screenshot({ path: `${scenarioFolderPE1}/07_schedule-radio-selected.png` });

    await page.waitForTimeout(100);
    await page.fill('input[data-test-date-time-picker-date-input]', '2024-11-10');
    await page.fill('input[data-test-date-time-picker-time-input]', '15:30');
    await page.screenshot({ path: `${scenarioFolderPE1}/08_date-time-filled.png` });

    await page.waitForTimeout(100);
    await page.click('button[data-test-button="continue"]');
    await page.screenshot({ path: `${scenarioFolderPE1}/09_continue-button-clicked.png` });

    await page.waitForTimeout(100);
    await page.waitForSelector('.gh-publish-cta .gh-btn-pulse', { state: 'visible', timeout: 5000 });

    await page.click('.gh-publish-cta .gh-btn-pulse', { force: true });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${scenarioFolderPE1}/10_post-scheduled.png` });

    console.log('Publicación programada y final review realizada');

    // Escenario 4: Revisar los posts programados
    console.log('Escenario 4: Revisar los posts programados');
    await page.click('button.gh-btn.gh-btn-primary.dismiss', { force: true });
    await page.waitForTimeout(1000);

    console.log('Revisando los posts programados...');
    await page.goto(scheduledUrl);
    await page.waitForTimeout(3000);

    await page.screenshot({ path: `${scenarioFolderPE1}/11_scheduled-posts.png` });

    console.log('Publicación programada revisada');

    // Cerrar el navegador
    await browser.close();
  }

  // Ejecución 2: Publicación programada con fecha y hora inválidas (PE2)
  for (const browserType of ['chromium']) {
    console.log(`${browserType}-------------------------------------------`);

    // Lanzar el navegador y crear un nuevo contexto
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Escenario 1: Acceso y login
    console.log('Escenario 1: Acceso y login');
    await page.goto(baseUrl);

    await page.fill('input[name="identification"]', 'm.diaza2@uniandes.edu.co');
    await page.fill('input[name="password"]', 'M4r14n417*');

    // Captura después de rellenar el formulario pero antes de hacer clic en submit
    await page.screenshot({ path: `${scenarioFolderPE2}/01_login-filled.png` });

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Captura después de realizar el login y después de la navegación
    await page.screenshot({ path: `${scenarioFolderPE2}/02_login-success.png` });

    console.log('Login exitoso');

    // Escenario 2: Crear una nueva publicación
    console.log('Escenario 2: Crear una nueva publicación');
    await page.goto(editorUrl);
    await page.fill('textarea[placeholder="Post title"]', 'Mi nueva publicación');
    await page.screenshot({ path: `${scenarioFolderPE2}/03_post-title-filled.png` });

    const editorSelector = '.koenig-react-editor .koenig-lexical';
    await page.click(editorSelector); // Focalizar el editor
    await page.keyboard.type('Este es el contenido de la publicación.');
    await page.screenshot({ path: `${scenarioFolderPE2}/04_post-content-typed.png` });

    await page.click('button.gh-btn.gh-btn-editor.gh-publish-trigger');
    await page.waitForTimeout(3000); // Esperar para que la acción se complete
    await page.screenshot({ path: `${scenarioFolderPE2}/05_new-post-created.png` });
    console.log('Nueva publicación creada');

    // Escenario 3: Programar publicación con una hora inválida
    console.log('Escenario 3: Programar publicación con hora inválida');
    await page.click('div[data-test-setting="publish-at"] button.gh-publish-setting-title');
    await page.waitForTimeout(100);
    await page.screenshot({ path: `${scenarioFolderPE2}/06_publish-setting-button-clicked.png` });

    await page.waitForTimeout(100);
    await page.click('div.gh-radio:has(div[data-test-radio="schedule"]) label');
    await page.screenshot({ path: `${scenarioFolderPE2}/07_schedule-radio-selected.png` });

    await page.waitForTimeout(100);
    await page.fill('input[data-test-date-time-picker-date-input]', '2024-11-10');
    await page.fill('input[data-test-date-time-picker-time-input]', '25:00'); // Hora inválida
    await page.screenshot({ path: `${scenarioFolderPE2}/08_invalid-date-time-filled.png` });

    await page.waitForTimeout(100);
    await page.click('button[data-test-button="continue"]');
    await page.screenshot({ path: `${scenarioFolderPE2}/09_continue-button-clicked-invalid.png` });

    console.log('Se intentó programar con hora inválida');

    // Cerrar el navegador
    await browser.close();
  }

  // Ejecución 3: Flujo de creación de miembro PE3
  for (const browserType of ['chromium']) {
    console.log(`${browserType}-------------------------------------------`);

    // Lanzar el navegador y crear un nuevo contexto
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Escenario 1: Acceso y login
    console.log('Escenario 1: Acceso y login');
    await page.goto(baseUrl);

    await page.fill('input[name="identification"]', 'm.diaza2@uniandes.edu.co');
    await page.fill('input[name="password"]', 'M4r14n417*');

    // Captura después de rellenar el formulario pero antes de hacer clic en submit
    await page.screenshot({ path: `${scenarioFolderPE3}/01_login-filled.png` });

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Captura después de realizar el login y después de la navegación
    await page.screenshot({ path: `${scenarioFolderPE3}/02_login-success.png` });

    console.log('Login exitoso');

    // Escenario 2: Acceso a la página de miembros
    console.log('Escenario 2: Accediendo a la página de miembros');
    await page.goto(membersPageUrl);

    // Captura antes de crear un nuevo miembro
    await page.screenshot({ path: `${scenarioFolderPE3}/03_members-list.png` });

    // Escenario 3: Selección de la opción "Nuevo miembro"
    console.log('Escenario 3: Selección del botón "New member"');
    await page.goto(newMemberUrl);

    // Escenario 4: Llenado del formulario de nuevo miembro
    console.log('Escenario 4: Llenado del formulario de nuevo miembro');
    await page.fill('input#member-name', 'Mariana Díaz');
    await page.fill('input#member-email', 'marianadiaz123@gmail.com');

    // Captura después de llenar el formulario
    await page.screenshot({ path: `${scenarioFolderPE3}/04_member-form-filled.png` });

    // Escenario 5: Guardar el nuevo miembro
    console.log('Escenario 3: Guardado del nuevo miembro');
    await page.click('button[data-test-button="save"]');
    console.log('Botón "Save" clickeado');
    await page.screenshot({ path: `${scenarioFolderPE3}/05_member-created.png` });

    // Escenario 6: Verificación de la creación del miembro
    console.log('Escenario 6: Verificación de la creación del miembro');
    await page.goto(membersPageUrl);
    await page.screenshot({ path: `${scenarioFolderPE3}/06_member-creation-verified.png` });

    // Cerrar el navegador
    await browser.close();
  }


  // Ejecución 4: Flujo de creación de miembro invalido PE4
  for (const browserType of ['chromium']) {
    console.log(`${browserType}-------------------------------------------`);

    // Lanzar el navegador y crear un nuevo contexto
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Escenario 1: Acceso y login
    console.log('Escenario 1: Acceso y login');
    await page.goto(baseUrl);

    await page.fill('input[name="identification"]', 'm.diaza2@uniandes.edu.co');
    await page.fill('input[name="password"]', 'M4r14n417*');

    // Captura después de rellenar el formulario pero antes de hacer clic en submit
    await page.screenshot({ path: `${scenarioFolderPE4}/01_login-filled.png` });

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Captura después de realizar el login y después de la navegación
    await page.screenshot({ path: `${scenarioFolderPE4}/02_login-success.png` });

    console.log('Login exitoso');

    // Escenario 2: Acceso a la página de miembros
    console.log('Escenario 2: Accediendo a la página de miembros');
    await page.goto(membersPageUrl);

    // Captura antes de crear un nuevo miembro
    await page.screenshot({ path: `${scenarioFolderPE4}/03_members-list.png` });

    // Escenario 3: Selección de la opción "Nuevo miembro"
    console.log('Escenario 3: Selección del botón "New member"');
    await page.goto(newMemberUrl);

    // Escenario 4: Llenado del formulario de nuevo miembro invalido
    console.log('Escenario 4: Llenado del formulario de nuevo miembro');
    await page.fill('input#member-name', 'Carlos Perez');
    await page.fill('input#member-email', 'test1234');
    await page.screenshot({ path: `${scenarioFolderPE4}/04_member-form-filled-invalid.png` });

    // Escenario 5: Guardar el nuevo miembro, fallo
    console.log('Escenario 5: Guardado del nuevo miembro');
    await page.click('button[data-test-button="save"]');
    console.log('Botón "Save" clickeado');
    await page.screenshot({ path: `${scenarioFolderPE4}/05_member-created-failed.png` });

    // Escenario 6: Actualización correo nuevo miembro
    console.log('Escenario 6: Arreglar el correo del formulario de nuevo miembro');
    await page.fill('input#member-email', 'carlos_perez1@gmail.com');
    await page.screenshot({ path: `${scenarioFolderPE4}/06_member-form-filled-fixed.png` });

    //Escenario 7: Guardar el nuevo miembro corregio
    console.log('Escenario 7: Guardar el nuevo miembro corregido');
    await page.click('button[data-test-button="save"]');
    await page.screenshot({ path: `${scenarioFolderPE4}/07_member-created-succesful.png` });

    // Escenario 8: Verificación de la creación del miembro
    console.log('Escenario 8: Verificación de la creación del miembro');
    await page.goto(membersPageUrl);
    await page.screenshot({ path: `${scenarioFolderPE4}/08_member-creation-verified.png` });

    // Cerrar el navegador
    await browser.close();
  }

  // Ejecución 5: Cambiar configuración de idioma valido
  for (const browserType of ['chromium']) {
    console.log(`${browserType}-------------------------------------------`);

    // Lanzar el navegador y crear un nuevo contexto
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Escenario: Acceso y login
    console.log('Escenario: Acceso y login');
    await page.goto(baseUrl);

    await page.fill('input[name="identification"]', 'm.diaza2@uniandes.edu.co');
    await page.fill('input[name="password"]', 'M4r14n417*');

    // Captura después de rellenar el formulario pero antes de hacer clic en submit
    await page.screenshot({ path: `${scenarioFolderPE5}/01_login-filled.png` });

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Captura después de realizar el login y después de la navegación
    await page.screenshot({ path: `${scenarioFolderPE5}/02_login-success.png` });

    console.log('Login exitoso');

    // Escenario 1: Ir a la configuración de la página
    console.log('Ir a la configuración de la página');
    await page.goto(settingsUrl);
    await page.screenshot({ path: `${scenarioFolderPE5}/03_settings-page.png` });
    await page.waitForTimeout(2000);

    // Escenario 2: Ir a la configuración del idioma
    console.log('Ir a la configuración de idioma');
    await page.goto(languageSettingsUrl);
    await page.screenshot({ path: `${scenarioFolderPE5}/04_language-settings-page.png` });
    await page.waitForTimeout(2000);

    // Escenario 3: Hacer clic en el botón de editar
    console.log('Haciendo clic en el botón "Edit"');
    await page.click('div[data-testid="publication-language"] button:has-text("Edit")');
    await page.screenshot({ path: `${scenarioFolderPE5}/05_edit-button-clicked.png` });

    // Escenario 4: Cambiar el idioma del sitio a "es"
    console.log('Cambiando el idioma a "es"');
    await page.fill('input[placeholder="Site language"]', 'es');
    await page.screenshot({ path: `${scenarioFolderPE5}/06_language-input-filled.png` });

    // Escenario 5: Hacer clic en el botón de "Guardar"
    console.log('Haciendo clic en el botón "Save"');
    await page.click('button.bg-green');
    await page.waitForTimeout(2000); // Esperar que el cambio se guarde
    await page.screenshot({ path: `${scenarioFolderPE5}/07_save-button-clicked.png` });

    console.log('Idioma cambiado exitosamente');

    // Cerrar el navegador
    await browser.close();
  }

  // Ejecución 6: Cambiar configuración de idioma invalido
  for (const browserType of ['chromium']) {
    console.log(`${browserType}-------------------------------------------`);

    // Lanzar el navegador y crear un nuevo contexto
    const browser = await playwright[browserType].launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Escenario: Acceso y login
    console.log('Escenario: Acceso y login');
    await page.goto(baseUrl);

    await page.fill('input[name="identification"]', 'm.diaza2@uniandes.edu.co');
    await page.fill('input[name="password"]', 'M4r14n417*');

    // Captura después de rellenar el formulario pero antes de hacer clic en submit
    await page.screenshot({ path: `${scenarioFolderPE6}/01_login-filled.png` });

    await page.click('button[type="submit"]');
    await page.waitForNavigation();

    // Captura después de realizar el login y después de la navegación
    await page.screenshot({ path: `${scenarioFolderPE6}/02_login-success.png` });

    console.log('Login exitoso');

    // Escenario 1: Ir a la configuración de la página
    console.log('Ir a la configuración de la página');
    await page.goto(settingsUrl);
    await page.screenshot({ path: `${scenarioFolderPE6}/03_settings-page.png` });
    await page.waitForTimeout(2000);

    // Escenario 2: Ir a la configuración del idioma
    console.log('Ir a la configuración de idioma');
    await page.goto(languageSettingsUrl);
    await page.screenshot({ path: `${scenarioFolderPE6}/04_language-settings-page.png` });
    await page.waitForTimeout(2000);

    // Escenario 3: Hacer clic en el botón de editar
    console.log('Haciendo clic en el botón "Edit"');
    await page.click('div[data-testid="publication-language"] button:has-text("Edit")');
    await page.screenshot({ path: `${scenarioFolderPE6}/05_edit-button-clicked.png` });

    // Escenario 4: Cambiar el idioma del sitio a "kw" invalido
    console.log('Cambiando el idioma a "kw" invalido');
    await page.fill('input[placeholder="Site language"]', 'kw');
    await page.screenshot({ path: `${scenarioFolderPE6}/06_language-input-filled-invalid.png` });

    // Escenario 5: Hacer clic en el botón de "Guardar"
    console.log('Haciendo clic en el botón "Save"');
    await page.click('button.bg-green');
    await page.waitForTimeout(2000); // Esperar que el cambio se guarde
    await page.screenshot({ path: `${scenarioFolderPE6}/07_save-button-clicked.png` });

    console.log('Idioma cambiado exitosamente');

    // Cerrar el navegador
    await browser.close();
  }
})();
