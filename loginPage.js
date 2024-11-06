class LoginPage {
    constructor(page) {
      this.page = page;
      this.emailInput = 'input[name="identification"]';
      this.passwordInput = 'input[name="password"]';
      this.submitButton = 'button[type="submit"]';
      this.successUrl = '/ghost/#/';
    }
  
    async navigateToLogin(url) {
      await this.page.goto(url);
    }
  
    async login(username, password) {
      await this.page.fill(this.emailInput, username);
      await this.page.fill(this.passwordInput, password);
      await this.page.click(this.submitButton);
      await this.page.waitForNavigation();
    }
  
    async screenshotLoginState(path) {
      await this.page.screenshot({ path: `${path}/01_login-filled.png` });
    }
  
    async screenshotLoginSuccess(path) {
      await this.page.screenshot({ path: `${path}/02_login-success.png` });
    }
  }
  
  module.exports = { LoginPage };
  