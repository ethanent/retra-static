const path = require('path')

const static = require(path.join(__dirname, '..'))

const w = require('whew')
const c = require('centra')
const Retra = require('retra')

const app = new Retra()

app.use(static(path.join(__dirname, 'test-static')))

app.add((req, res) => {
	res.status(404).end()
})

w.add('Getting a file', async (result) => {
	const res = await c('http://localhost:5137/mytext.txt').timeout(3000).send()

	result((await res.text()) === 'hello' && res.statusCode === 200)
})

w.add('Index file at base directory', async (result) => {
	const res = await c('http://localhost:5137/').timeout(3000).send()

	result((await res.text()) === 'index. hi.' && res.statusCode === 200)
})

w.add('Index file at non-base directory', async (result) => {
	const res = await c('http://localhost:5137/inner-directory/').timeout(3000).send()

	result((await res.text()) === 'index 2?' && res.statusCode === 200)
})

w.add('Non-existent file - Proper next()-ing', async (result) => {
	const res = await c('http://localhost:5137/doesNotExist').timeout(3000).send()

	result(res.statusCode === 404)
})

app.listen(5137, w.test)