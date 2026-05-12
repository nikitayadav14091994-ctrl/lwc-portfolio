import { LightningElement } from 'lwc';

export default class WelcomeToMyLWCPortfolio extends LightningElement {

  // Default value shown on load
  name = 'World';

  // Updates greeting as user types
  handleChange(event) {
    this.name = event.target.value;
  }
}