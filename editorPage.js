class EditorPage {
    constructor(page) {
      this.page = page;
      this.titleInput = 'textarea[placeholder="Post title"]';
      this.editorSelector = '.koenig-react-editor .koenig-lexical';
      this.publishButton = 'button.gh-btn.gh-btn-editor.gh-publish-trigger';
      this.scheduleButton = 'div[data-test-setting="publish-at"] button.gh-publish-setting-title';
      this.scheduleRadioButton = 'div.gh-radio:has(div[data-test-radio="schedule"]) label';
      this.dateInput = 'input[data-test-date-time-picker-date-input]';
      this.timeInput = 'input[data-test-date-time-picker-time-input]';
      this.continueButton = 'button[data-test-button="continue"]';
      this.publishButtonFinal = '.gh-publish-cta .gh-btn-pulse';
    }
  
    async navigateToEditor(url) {
      await this.page.goto(url);
    }
  
    async createPost(title, content) {
      await this.page.fill(this.titleInput, title);
      await this.page.click(this.editorSelector);
      await this.page.keyboard.type(content);
    }
  
    async publishPost() {
      await this.page.click(this.publishButton);
    }
  
    async schedulePost(date, time) {
      await this.page.click(this.scheduleButton);
      await this.page.click(this.scheduleRadioButton);
      await this.page.fill(this.dateInput, date);
      await this.page.fill(this.timeInput, time);
      await this.page.click(this.continueButton);
      await this.page.click(this.publishButtonFinal, { force: true });
    }
  
    async screenshotPostState(path) {
      await this.page.screenshot({ path: `${path}/03_post-title-filled.png` });
      await this.page.screenshot({ path: `${path}/04_post-content-typed.png` });
      await this.page.screenshot({ path: `${path}/05_new-post-created.png` });
    }
  
    async screenshotScheduledPostState(path) {
      await this.page.screenshot({ path: `${path}/06_publish-setting-button-clicked.png` });
      await this.page.screenshot({ path: `${path}/07_schedule-radio-selected.png` });
      await this.page.screenshot({ path: `${path}/08_date-time-filled.png` });
      await this.page.screenshot({ path: `${path}/09_continue-button-clicked.png` });
      await this.page.screenshot({ path: `${path}/10_post-scheduled.png` });
    }
  }
  
  module.exports = { EditorPage };
  