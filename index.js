const path = require('path')
const url = require('url')
const fs = require('fs')

const mimes = JSON.parse(fs.readFileSync(path.join(__dirname, 'mimes.json')))

module.exports = (baseDir, indexFile) => {
	if (!baseDir) throw new Error('The required \'baseDir\' argument is missing for retra-static extension.')

	indexFile = typeof indexFile === 'string' ? indexFile : 'index.html'

	return (req, res, next) => {
		if (req.method !== 'GET') {
			next()
			return
		}

		let requestedPath = req.parsedUrl.pathname.replace(/\/.\.\//g, '')
		let requestedExt = path.extname(requestedPath)

		const filePath = path.join(baseDir, requestedPath)

		fs.stat(filePath, (err, stats) => {
			if (err) {
				next()
				return
			}

			if (stats.isFile()) {
				stats.mtime.setMilliseconds(0)
				if (stats.mtime <= new Date(req.headers['if-modified-since'])) {
					res.status(304)
					res.end()
				} else {
					fs.readFile(filePath, (err, data) => {
						if (err) {
							next()
						}
						else {
							res.status(200).header({
								'Content-Type': (mimes.hasOwnProperty(requestedExt) ? mimes[requestedExt] : 'application/octet-stream'),
								'Last-Modified': stats.mtime.toString()
							}).body(data).end()
						}
					})
				}
			}
			else {
				if (req.parsedUrl.pathname.charAt(req.parsedUrl.pathname.length - 1) !== '/') {
					res.status(302).header({
						'Location': req.parsedUrl.pathname + '/'
					}).end()
					return
				}
				else console.log('Not / ?')

				requestedPath = path.join(filePath, indexFile)
				requestedExt = path.extname(requestedPath)

				fs.readFile(requestedPath, (err, data) => {
					if (err) {
						next()
					}
					else {
						res.body(data).status(200).header({
							'Content-Type': (mimes.hasOwnProperty(requestedExt) ? mimes[requestedExt] : 'application/octet-stream'),
							'Last-Modified': stats.mtime.toString()
						}).end()
					}
				})
			}
		})
	}
}