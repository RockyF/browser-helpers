/**
 * Created by rockyl on 2022/4/21.
 */

export function file2DataUrl(file: File){
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = function () {
			resolve(reader.result as string)
		}
		reader.onerror = function (e) {
			reject(e)
		}
		reader.readAsDataURL(file)
	})
}
