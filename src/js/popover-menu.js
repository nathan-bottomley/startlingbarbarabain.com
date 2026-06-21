/* globals HTMLElement, customElements */

class PopoverMenu extends HTMLElement {
  constructor () {
    super()
    const button = this.querySelector('button')
    const popover = this.querySelector('[popover]')

    button.setAttribute('aria-expanded', 'false')

    popover.addEventListener('toggle', (event) => {
      const isOpen = event.newState === 'open'
      button.setAttribute('aria-expanded', isOpen)
      if (isOpen) {
        popover.querySelector('a')?.focus()
      }
    })
  }
}

customElements.define('popover-menu', PopoverMenu)
