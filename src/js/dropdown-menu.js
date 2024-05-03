/* global HTMLElement, customElements */

class DropdownMenu extends HTMLElement {
  constructor () {
    super()
    this.toggleButton = this.querySelector('.dropdown-menu-toggle-button')
    this.hideMenu()
    this.menu = this.querySelector('.dropdown-menu')
    this.menuID = crypto.randomUUID()
    this.menu.setAttribute('id', this.menuID)
    this.toggleButton.setAttribute('aria-controls', this.menuID)
    this.toggleButton.addEventListener('click', this)
  }

  connectedCallback () {
    document.addEventListener('click', this)
    document.addEventListener('keyup', this)
  }

  disconnectedCallback () {
    document.removeEventListener('click', this)
    document.removeEventListener('keyup', this)
  }

  handleEvent (event) {
    if (event.currentTarget === document &&
        event.type === 'click' &&
        event.target !== this.toggleButton) {
      this.hideMenu()
    }
    if (event.currentTarget === this.toggleButton &&
        event.type === 'click' &&
        event.target === this.toggleButton) {
      this.toggleMenu()
      event.preventDefault()
    }
    if (event.type === 'keyup' && event.key === 'Escape') {
      this.hideMenu()
    }
  }

  get menuVisible () {
    return this.toggleButton.getAttribute('aria-expanded') === 'true'
  }

  showMenu () {
    this.toggleButton.setAttribute('aria-expanded', 'true')
  }

  hideMenu () {
    this.toggleButton.setAttribute('aria-expanded', 'false')
  }

  toggleMenu () {
    if (this.menuVisible) {
      this.hideMenu()
    } else {
      this.showMenu()
    }
  }
}

customElements.define('dropdown-menu', DropdownMenu)
