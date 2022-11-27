/* contact-form.js | https://github.com/Divlo/Contact-Form | Divlo | MIT License */
class ContactForm {
	constructor() {
		this.contactForm = document.getElementById('contact-form')
		this.buttonSend = document.getElementById('sendemail')
	}

	init() {
		document.addEventListener('DOMContentLoaded', () => {		
			if(typeof(this.buttonSend) !== 'undefined' && this.buttonSend !== null) {
				this.buttonSend.addEventListener('click', (event) => {
					event.preventDefault()
					const postdata = this.serialize(this.contactForm)

					// bootstrap input validation
					if (!this.contactForm.checkValidity()) {
						event.preventDefault()
						event.stopPropagation()
						this.setLoading(this.buttonSend)
						this.contactForm.classList.add('was-validated')
					} else {
						this.setLoading(this.buttonSend, 'success')
					}

					this.ajaxRequest('POST', './sendmail.php', postdata, (success, response) => {
						if (success) {
							const result = JSON.parse(response)
							if(result.isSuccess) {
								const toast = new bootstrap.Toast(document.querySelector('.toast'))
								setTimeout(() => {
									this.setLoading(this.buttonSend)
									this.contactForm.reset()
									this.contactForm.classList.remove('was-validated')
									toast.show()
								}, 1200)
							}
						}
					})
				})
			}
		})
	}

	setLoading(btnElem, status) {
		if (status == 'success') {
			btnElem.setAttribute('disabled', '')
			btnElem.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Please wait...`
		} else {
			btnElem.removeAttribute('disabled')
			btnElem.textContent = 'Send message'
		}
	}

	serialize(form) {
		return Array.from(
			new FormData(form),
			e => e.map(encodeURIComponent).join('=')
		).join('&')
	}

	ajaxRequest(method, url, data, functionResult) {
		const xmlhttp = new XMLHttpRequest()
		xmlhttp.open(method, url, true) // set true for async, false for sync request
		xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		xmlhttp.send(data) // or null, if no parameters are passed
		xmlhttp.onreadystatechange = function() {
			if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				functionResult(true, xmlhttp.responseText)
			} else {
				functionResult(false, "")
			}
		}
	}
}

new ContactForm().init()