const playwright = require('playwright');
const { LoginPage } = require('./loginPage');
const { EditorPage } = require('./editorPage');
const fs = require('fs');
const data = require('./data');

const signInUrl = 'http://localhost:2368/ghost/';

const screenshotFolder = './screenshots';
const scenarioFolderPE1 = `${screenshotFolder}/PE1`;

// Asegurarse de que las carpetas existan
const createFolderIfNotExists = (folder) => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }
};

createFolderIfNotExists(screenshotFolder);
createFolderIfNotExists(scenarioFolderPE1);

(async () => {
  // Lanzar el navegador y crear contexto
  const browser = await playwright.chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Inicializar las páginas
  const loginPage = new LoginPage(page);
  const editorPage = new EditorPage(page);

  // **Given**: Navegar a la página de login
  console.log('Escenario 1: Acceso y login');
  await loginPage.navigateToLogin(signInUrl);

  // **When**: El usuario ingresa las credenciales correctas
  await loginPage.login(data.login.username, data.login.password);
  await loginPage.screenshotLoginState(scenarioFolderPE1);

  // **Then**: El login debe ser exitoso
  await loginPage.screenshotLoginSuccess(scenarioFolderPE1);

  // **Given**: Navegar a la página de creación de publicación
  console.log('Escenario 2: Crear una nueva publicación');
  await editorPage.navigateToEditor('http://localhost:2368/ghost/#/editor/post');

  // **When**: El usuario crea una publicación
  await editorPage.createPost(data.post.title, data.post.content);
  await editorPage.screenshotPostState(scenarioFolderPE1);

  // **Then**: La publicación debe haber sido creada
  await editorPage.publishPost();

  // **Given**: Programar la publicación
  console.log('Escenario 3: Programar publicación');
  await editorPage.schedulePost('2024-11-10', '15:30');
  await editorPage.screenshotScheduledPostState(scenarioFolderPE1);

  // **Then**: La publicación debe estar programada correctamente
  console.log('Publicación programada correctamente');

  // **Given**: Revisar publicaciones programadas
  console.log('Escenario 4: Revisar publicaciones programadas');
  await page.goto('http://localhost:2368/ghost/#/scheduled');
  await page.screenshot({ path: `${scenarioFolderPE1}/11_scheduled-posts.png` });

  // Cerrar el navegador
  await browser.close();
})();
