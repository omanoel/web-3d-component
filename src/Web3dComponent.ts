import { html, css, LitElement, PropertyValues } from 'lit';
import { query } from 'lit/decorators.js';
import { MyWorld } from './story/my-world';

export class Web3dComponent extends LitElement {

  isLoading: boolean = true;

  @query('#web-3d-component-viewport')
  viewportElement!: HTMLDivElement;

  myWorld: MyWorld | undefined;

  handleTriggerEvent: (e: Event) => void;

  constructor() {
    super();
    this.handleTriggerEvent = this.triggerEvent.bind(this);
  }

  static get styles() {
    return css`
              #web-3d-component-viewport {
                  display: block;
                  width: 100%;
                  height: 100%;
              }
          `;
  }

  firstUpdated(_changedProperties: PropertyValues) {

    this.myWorld = new MyWorld(this.viewportElement);
    if (this.myWorld.isAvailable) {
      this.myWorld.render();
    }
    this.isLoading = false;
    this.requestUpdate();
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener('web-3d-component-event', this.handleTriggerEvent, false);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    document.removeEventListener('web-3d-component-event', this.handleTriggerEvent, false)
  }

  render() {
    const loading = this.isLoading ? html`<p>Loading...</p>` : html``;
    return html`
      <div id="web-3d-component-viewport"></div>
      ${loading}
    `;
  }

  triggerEvent(e: Event) {
    if (e && e instanceof CustomEvent && e.detail && e.detail.eventId) {
      const { eventId } = e.detail;
      this.myWorld?.triggerEvent(eventId);
    }
  }
} 