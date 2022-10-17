const Database = require('./db')
const createProffy = require('./createProffy')

Database.then(async (db) => {
    // inserir dados

    proffyValue = {
        name: "Albert Einstein",
        avatar: "https://www.revistabula.com/wp/wp-content/uploads/2019/10/albert_einstein.jpg",
        whatsapp: "1593698741",
        bio: "Albert Einstein (1879-1955) foi um físico alemão que desenvolveu a teoria da relatividade geral,um dos pilares da física moderna. Ele também descobriu a lei do efeito fotoelétrico e ganhou o Prêmio Nobel da Física, em 1921, por todas as suas contribuições importantes. Einstein foi professor em várias instituições de ensino superior, como a Universidade de Berna, na Suíça; a Universidade Carolina, em Praga; e o Instituto Federal de Tecnologia de Zurique",
    }

    classValue = {
        subject: 1,
        cost: "1000",
        // o proffy id virá pelo banco de dados
    }

    classScheduleValue = [
        //class_id virá pelo banco de dados, após cadastrarmos a class
        {
            weekday: 1,
            time_from: 720,
            time_to: 1220
        },
        {
            weekday: 0,
            time_from: 520,
            time_to: 1220
        }
    ]

    // await createProffy(db, { proffyValue, classValue, classScheduleValue })


    //todos os proffys
    const selectedProffys = await db.all("SELECT * FROM proffys")
    // console.log(selectedProffys)

    //consulta as classes de um determinado professor 
    //trazer junto os dados do professor 
    const selectClassesAndProffys = await db.all(`
        SELECT classes.*, proffys.*
        FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id)
        WHERE classes.proffy_id = 1;
    `)
    // console.log(selectClassesAndProffys)

    //o horário que a pessoa trabalha, por exemplo, é das 8h - 18h
    //o horário do time_from(8h) precisa ser antes menor ou igual ao horário solicitado
    //o time_to precisa ser acima 
    const selectClassesSchedules = await db.all(`
        SELECT class_schedule.*
        FROM class_schedule
        WHERE class_schedule.class_id = "1"
        AND class_schedule.weekday = "0"
        AND class_schedule.time_from <= "520"
        AND class_schedule.time_to > "720"
    `)
    console.log(selectClassesSchedules)
})