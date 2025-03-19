import {app} from './app'
import {SETTINGS} from './settings'
import {connectToDB} from "./db/mongo-db";

const startApp =async () => {
    const res = await connectToDB()

    if(!res) process.exit(1)
    console.log(process.env.NODE_ENV)
    app.listen(SETTINGS.PORT, () => {
        console.log('...server started in port ' + SETTINGS.PORT)
    })
}


startApp()