import { html, css, LitElement, PropertyValues } from 'lit';
import { query } from 'lit/decorators.js';
import { MyWorld } from './shared/my-world';

export class Web3dComponent extends LitElement {

  isLoading: boolean = true;

  @query('#web-3d-component-viewport')
  viewportElement!: HTMLDivElement;

  myWorld: MyWorld | undefined;

  static get styles() {
    return css`
              #web-3d-component-viewport {
                  display: block;
                  width: 100%;
                  height: 100%;
              }
          `;
  }

  async firstUpdated(_changedProperties: PropertyValues) {
    await new Promise(r => setTimeout(r, 0));

    this.myWorld = new MyWorld(this.viewportElement);
    if (this.myWorld.isAvailable) {
      this.myWorld.render();
    }
    this.isLoading = false;
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('web-3d-component-event', async (e: any) => {
      if (e && e.detail && e.detail.eventId) {
        const eventId = e.detail.eventId;
        this.myWorld?.triggerEvent(eventId);
      }
    });
  }

  render() {
    const loading = this.isLoading ? html`<p>Loading...</p>` : html``;
    return html`
      <div id="web-3d-component-viewport"></div>
      ${loading}
    `;
  }
} 