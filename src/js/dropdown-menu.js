/* global HTMLElement, customElements */

class DropdownMenu extends HTMLElement {
  constructor () {
    console.log('DropdownMenu constructor')
    super()
    this.toggleButton = this.querySelector('a')
    this.toggleButton.setAttribute('aria-expanded', 'false')
    this.menu = this.querySelector('ul')
    this.menuID = crypto.randomUUID()
    this.menu.setAttribute('id', this.menuID)
    this.toggleButton.setAttribute('aria-controls', this.menuID)
    this.toggleButton.addEventListener('click', (event) => {
      if (this.toggleButton.getAttribute('aria-expanded') === 'false') {
        this.toggleButton.setAttribute('aria-expanded', 'true')
      } else {
        this.toggleButton.setAttribute('aria-expanded', 'false')
      }
      event.preventDefault()
    })
  }

  connectedCallback () {
    document.addEventListener('click', (event) => {
      if (event.target !== this.toggleButton) {
        this.toggleButton.setAttribute('aria-expanded', 'false')
      }
    })
    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape') {
        this.toggleButton.setAttribute('aria-expanded', 'false')
      }
    })
  }
}

customElements.define('dropdown-menu', DropdownMenu)
