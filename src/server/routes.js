export default function () {
	const app = this

	app.get('/', (req, res) => {
		res.render('index.html')
	})
}
