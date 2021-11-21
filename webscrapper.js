const puppeteer = require("puppeteer");

class SigaaScrapping {
    constructor() {
        this.url = "https://sig.ifc.edu.br/sigaa"
    }

    async init(username, password) {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(this.url);

        await page.type("input[name=\"user.login\"]", username)
        await page.type("input[name=\"user.senha\"]", password)

        await page.click("input[value=\"Entrar\"]");

        await page.waitForSelector("#rodape");
        
        const subjects = await this.getSubjects(page)

        const news = await this.getNews(page)
        const activities = await this.getActivities(page)

        await browser.close()

        return {
            subjects,
            news,
            activities
        }

        const name = await page.evaluate(() => {
            let username = document.querySelector("div#info-usuario > p.usuario > span");
            console.log(username)
            return username.innerText;
        });

        await browser.close();

        console.log(name)

    }

    async getNews(page) {
        const news = await page.evaluate(() => {
            const news_elements = document.querySelectorAll("#atualizacoes-turma > .rotator > table > tbody") 

            const news_array = []

            for (let n of news_elements) {
                let news_title = n.childNodes[0].innerText.replace(/(\n|\t)/g,'')
                news_title = news_title.replace(/ \([0-9][0-9][0-9][0-9]\)/, '')

                const [news_date, news_title_text] = news_title.split(' - ')

                const news_body_text = n.childNodes[2].innerText.replace(/(\n|\t)/g,'')

                news_array.push({title: news_title_text, body: news_body_text, date: news_date})
            }
            
            return news_array
        })

        return news
    }

    async getSubjects(page) {
        const subjects = await page.evaluate(() => {
            const subject_links = document.querySelectorAll("form[name^=\"form_acessarTurmaVirtual\"] > a")

            let subject_names = []
            for (let sub of subject_links) {
                subject_names.push(sub.innerText)
            }

            return subject_names
            
        })
        return subjects
    }

    async getActivities(page) {
        const activities = await page.evaluate(() => {
            let activities_elements = document.querySelectorAll("#avaliacao-portal > table > tbody > tr")
            activities_elements = Array.from(activities_elements).slice(1)

            let activities_array = []
            for (let a of activities_elements) {
                const activity_date = a.childNodes[3].innerText.replace(/ \(.*\)/, '')
                let activity_body = a.childNodes[5].innerText.split("\nQuestionário: ")
                if (activity_body.length == 1) {
                    activity_body = activity_body[0].split("\nTarefa: ")

                    if (activity_body.length == 1) {
                        activity_body = activity_body[0].split("\Avaliação: ")
                    }
                }

                const [activity_subject, activity_title] = activity_body

                activities_array.push({
                    subject: activity_subject,
                    title: activity_title,
                    date: activity_date
                })
            }

            return activities_array
        })
        return activities
    }
}

module.exports = SigaaScrapping

if (require.main === module) {
    const sigaa = new SigaaScrapping()
    sigaa.init('gtramontin', 'pedro13g')
}
