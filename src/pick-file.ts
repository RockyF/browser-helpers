/**
 * Created by rockyl on 2020/12/8.
 */

let input: any

/**
 * pickFile
 * @desc pick file(s)
 * @param accept - mime type
 * @example pick a image file
 * const files = await pickFile('image/*')
 * console.log('picked file：', files[0].name)
 */
export function pickFile(accept?: string): Promise<File[]> {
	return new Promise((resolve, reject) => {
		let picked = false
		if (!input) {
			input = document.createElement('input')
			input.type = 'file'
			input.style.visibility = 'hidden'
			input.style.position = 'absolute'
			input.style.left = '-9999px'
			document.body.appendChild(input)
		}
		if (accept) {
			input.accept = accept
		}

		input.addEventListener('change', onChange, {once: true})
		window.addEventListener('focus', onFocus, {once: true})
		input.click()

		function onChange(e) {
			let files = []
			for (let i = 0, li = input.files.length; i < li; i++) {
				const file = input.files[i]
				files.push(file)
			}
			input.files = null
			input.value = ''
			clear()
			picked = true
			resolve(files)
		}

		function onFocus() {
			setTimeout(() => {
				//console.log('focus', input.files)
				if (!picked && input.files.length === 0) {
					clear()
					reject('cancel')
				}
			}, 100)
		}

		function clear() {
			input.removeEventListener('change', onChange)
			window.removeEventListener('focus', onFocus)
		}
	})
}

/**
 * pickImage
 * @description pick a image
 * @example pick a image as dataUrl
 * const dataUrl = await pickImage()
 * console.log('image dataUrl:', dataUrl);  //data:image/jpeg;base64,sadghfowedfhgsoieufhg…
 */
export async function pickImage(): Promise<string> {
	const files = await pickFile('image/*')
	if (files.length > 0) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = function () {
				resolve(reader.result as string)
			}
			reader.onerror = function (e) {
				reject(e)
			}
			reader.readAsDataURL(files[0])
		})
	}
}

/**
 * pickText
 * @description pick a text
 * @param {string} [accept='text/*'] - mime type
 * @example pick a text
 * const text = await pickText()
 * console.log('text:', text);
 */
export async function pickText(accept: string = 'text/*'): Promise<string> {
	const files = await pickFile(accept)
	if (files.length > 0) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = function () {
				resolve(reader.result as string)
			}
			reader.onerror = function (e) {
				reject(e)
			}
			reader.readAsText(files[0])
		})
	}
}

/**
 * pickJson
 * @description pick a json object
 * @param {string} [accept='application/json'] - mime type
 * @example pick a json object
 * const json = await pickJson()
 * console.log('json object:', json);
 */
export async function pickJson(accept: string = 'application/json'): Promise<string> {
	const text = await pickText(accept)
	return JSON.parse(text)
}
