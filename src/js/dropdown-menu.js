/* global HTMLElement, customElements */

class DropdownMenu extends HTMLElement {
  constructor () {
    super()
    this.toggleButton = this.querySelector('.dropdown-menu-toggle-button')
    this.hideMenu()
    this.menu = this.querySelector('.dropdown-menu')
    this.menuItems = [...this.menu.querySelectorAll('[role="menuitem"]')]
    this.menuItems.forEach(item => item.setAttribute('tabindex', '-1'))
    this.menuID = crypto.randomUUID()
    this.menu.setAttribute('id', this.menuID)
    this.toggleButton.setAttribute('aria-controls', this.menuID)
    this.toggleButton.addEventListener('click', this)
    this.toggleButton.addEventListener('keydown', this)
    this.menu.addEventListener('keydown', this)
  }

  connectedCallback () {
    document.addEventListener('click', this)
  }

  disconnectedCallback () {
    document.removeEventListener('click', this)
  }

  handleEvent (event) {
    if (event.type === 'click') {
      this.handleClick(event)
    } else if (event.type === 'keydown') {
      this.handleKeydown(event)
    }
  }

  handleClick (event) {
    if (event.currentTarget === document && event.target !== this.toggleButton) {
      this.hideMenu()
    }
    if (event.currentTarget === this.toggleButton) {
      this.toggleMenu()
      event.preventDefault()
    }
  }

  handleKeydown (event) {
    switch (event.key) {
      case 'Escape':
        this.hideMenu()
        this.toggleButton.focus()
        event.preventDefault()
        break
      case 'ArrowDown':
        event.preventDefault()
        if (event.currentTarget === this.toggleButton) {
          this.showMenu()
          this.focusItem(0)
        } else {
          this.focusNextItem()
        }
        break
      case 'ArrowUp':
        event.preventDefault()
        if (event.currentTarget === this.toggleButton) {
          this.showMenu()
          this.focusItem(this.menuItems.length - 1)
        } else {
          this.focusPreviousItem()
        }
        break
      case 'Home':
        event.preventDefault()
        this.focusItem(0)
        break
      case 'End':
        event.preventDefault()
        this.focusItem(this.menuItems.length - 1)
        break
      case 'Tab':
        this.hideMenu()
        break
    }
  }

  get menuVisible () {
    return this.toggleButton.getAttribute('aria-expanded') === 'true'
  }

  get currentIndex () {
    return this.menuItems.indexOf(document.activeElement)
  }

  focusItem (index) {
    this.menuItems[index]?.focus()
  }

  focusNextItem () {
    const next = this.currentIndex < this.menuItems.length - 1
      ? this.currentIndex + 1
      : 0
    this.focusItem(next)
  }

  focusPreviousItem () {
    const previous = this.currentIndex > 0
      ? this.currentIndex - 1
      : this.menuItems.length - 1
    this.focusItem(previous)
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
      this.toggleButton.focus()
    } else {
      this.showMenu()
      this.focusItem(0)
    }
  }
}

customElements.define('dropdown-menu', DropdownMenu)
