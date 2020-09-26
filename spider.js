var superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')

class Spider {
	constructor() {
		this.baseURL = ''
		this.blogs = []
	}

	async init() {
		var _this = this
		var data = fs.readFileSync('config.json', 'utf-8')
		this.baseURL = JSON.parse(data.toString()).blogURL
		superagent
			.get(this.baseURL)
			.then((res) => {
				// console.log(res.text)
				const $ = cheerio.load(res.text)
				var list = $('.article-list').find('.article-item-box')
				list.each(function () {
					// console.log(this)
					var href = $(this).find('a').attr('href')
					_this.blogs.push(href)
				})
			})
			.catch((e) => {
				console.log(e)
			})
	}

	visit() {
		this.blogs.map((item, index) => {
			superagent
				.get(item)
				.then((res) => {
					console.log('success')
				})
				.catch((e) => {
					console.log(e)
				})
		})
	}
}

var spider = new Spider()
!(async function () {
	await spider.init()
})()

setInterval(() => {
	console.log(spider.visit())
}, 30000)
