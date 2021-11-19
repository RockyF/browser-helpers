/**
 * Created by rockyl on 2020/11/20.
 */

/**
 * copyToClipboard
 * @description copy text to clipboard
 * @param {string} text - text to copy
 * @example Usage
 * copyToClipboard('hello')
 */
export function copyToClipboard(text: string): boolean {
	return copyText(text)
}

let fakeElem

function ensureFakeElem() {
	if (!fakeElem) {
		fakeElem = document.createElement('textarea')
		// Prevent zooming on iOS
		fakeElem.style.fontSize = '12pt'
		// Reset box model
		fakeElem.style.border = '0'
		fakeElem.style.padding = '0'
		fakeElem.style.margin = '0'
		// Move element out of screen horizontally
		fakeElem.style.position = 'absolute'
		// Move element to the same position vertically
		let yPosition = window.pageYOffset || document.documentElement.scrollTop
		fakeElem.style.top = `${yPosition}px`

		fakeElem.setAttribute('readonly', '')
	}
}

function select(element) {
	var selectedText

	if (element.nodeName === 'SELECT') {
		element.focus()

		selectedText = element.value
	} else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
		var isReadOnly = element.hasAttribute('readonly')

		if (!isReadOnly) {
			element.setAttribute('readonly', '')
		}

		element.select()
		element.setSelectionRange(0, element.value.length)

		if (!isReadOnly) {
			element.removeAttribute('readonly')
		}

		selectedText = element.value
	} else {
		if (element.hasAttribute('contenteditable')) {
			element.focus()
		}

		var selection = window.getSelection()
		var range = document.createRange()

		range.selectNodeContents(element)
		selection.removeAllRanges()
		selection.addRange(range)

		selectedText = selection.toString()
	}

	return selectedText
}

function copyText(text) {
	ensureFakeElem()

	fakeElem.value = text

	document.body.appendChild(fakeElem)

	let selectedText = select(fakeElem)

	let succeeded
	try {
		succeeded = document.execCommand('copy')
	} catch (err) {
		succeeded = false
	}

	document.body.removeChild(fakeElem)

	return succeeded
}
