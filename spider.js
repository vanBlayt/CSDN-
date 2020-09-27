var superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')

class Spider {
	constructor() {
		this.baseURL = ''
		this.blogs = []
	}

	async init() {
		return new Promise((resolve, reject) => {
			var _this = this
			//读取文件博客地址
			var data = fs.readFileSync('config.json', 'utf-8')
			this.baseURL = JSON.parse(JSON.parse(JSON.stringify(data))).blogURL
			//获取博客列表的URL地址
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
					resolve(_this.baseURL)
				})
				.catch((e) => {
					console.log(e)
				})
		})
	}
    // 访问
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
spider.init().then(() => {
	setInterval(() => {
		spider.visit()
	}, 10000)
})
