const express = require('express');
const bodyParser = require('body-parser');
const { Client } = require('@line/bot-sdk');
const crypto = require('crypto');
const axios = require('axios');

const app = express();

const config = {
    channelAccessToken: 'CcQjWLunjS4MJhJjwG7IDdvD9/j7IBorhYuLnxZeIgAc7DG4Tfkfsggs0CP3vbmbPfKoXNFvcw568QxdxYUjNXn/zzCBy2nVvstdtlc8JaUjCSWsddYNEN42n+PTdcjTCS9TDvQlxqyo6HegIdOBZgdB04t89/1O/w1cDnyilFU=',
    channelSecret: 'e0dbdefec57cd9062e9a74d5627cb996',

};
const client = new Client(config);

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
    const events = req.body.events;

    events.forEach(async (event) => {
        if (event.type === 'message' && event.message.type === 'text') {
            const messageText = event.message.text;
            const replyToken = event.replyToken;
       

        
            if (messageText.toUpperCase() === 'ตรวจสอบ') {
                    const userID = event.source.userId;
                    const apiUrl = 'https://apikt.kthos.go.th/chkuserid?userid='+userID;
                    const apiResponse = await axios.get(apiUrl);
                    const dataFromApi = apiResponse.data;
                    // ใช้ forEach ในการลูปผ่านข้อมูล
                    let sumpin ;
                    let pinn;
                    dataFromApi.forEach(row => {
                        sumpin = `${row.sumpin}`;
                        pinn = `${row.pin}`;
                    });
                     // เช็คว่าลงทะเบียนยัง
                    if(sumpin === '1'){
                        // ส่งข้อความตอบกลับ LINE
                        try {
                            // ทำ GET request ไปยัง API
                            const apiUrl = 'https://apikt.kthos.go.th/faceid?face_pin='+pinn;
                            const apiResponse = await axios.get(apiUrl);
                            const dataFromApi = apiResponse.data;
                           
                             // ใช้ forEach ในการลูปผ่านข้อมูล
                             let messagess = `สแกนใบหน้าวันนี้ : ${dataFromApi.rowCount} ครั้ง`;
                             dataFromApi.rows.forEach(row => {
                                messagess += '\n-----------------------\n';
                                messagess += `รหัสเจ้าหน้าที่ : ${row.pin}`+'\n';
                                messagess += `ชื่อ : ${row.name} ${row.last_name}`+'\n';
                                messagess += `สถานที่สแกน : ${row.dev_alias}`+'\n';
                                messagess += `วันที่ เวลา : ${row.timee}`;
                            });
                            // ส่งข้อความตอบกลับ LINE
                            await client.replyMessage(replyToken, {
                                type: 'text',
                                text: messagess,
                            });
                        } catch (error) {
                            console.error('Error calling API:', error);
                            await client.replyMessage(replyToken, {
                                type: 'text',
                                text: 'Error API',
                            });
                        }
                    }else{
                         // ส่งข้อความตอบกลับ LINE
                         const userID = event.source.userId;
                         const md5Hash = crypto.createHash('md5').update('Kl0ngthom').digest('hex');
                         const md5Hash2 = crypto.createHash('md5').update('KTFaceID').digest('hex');
                         const UserUp = md5Hash+md5Hash2+userID;
         
                         const googleUrl = 'https://kthos.go.th/KTfaceid/faceregis.php?id='+UserUp;
                         const flexMessage = {
                             type: 'flex',
                             altText: 'Flex Message with Button',
                             contents: {
                                 type: 'bubble',
                                 hero: {
                                     type: 'image',
                                     url: 'https://ktconnect.jrsonline.org/img/p.png', // URL ของภาพ
                                     size: 'full',
                                     aspectRatio: '16:9',
                                     aspectMode: 'cover',
                                 },
                                 body: {
                                     type: 'box',
                                     layout: 'vertical',
                                     contents: [
                                         {
                                             type: 'button',
                                             action: {
                                                 type: 'uri',
                                                 label: 'คลิกลงทะเบียน',
                                                 uri: googleUrl,
                                             },
                                         },
                                     ],
                                 },
                             },
                         };    
                         // ส่ง Flex Message กลับไปยังผู้ใช้
                         await client.replyMessage(replyToken, flexMessage);
                    }
                    
            }
           
            


            if (messageText === 'คำถาม') {
                const userID = event.source.userId;
                const apiUrl = 'https://apikt.kthos.go.th/chkuserid?userid='+userID;
                const apiResponse = await axios.get(apiUrl);
                const dataFromApi = apiResponse.data;
                // ใช้ forEach ในการลูปผ่านข้อมูล
                let sumpin ;
                let pinn;
                dataFromApi.forEach(row => {
                    sumpin = `${row.sumpin}`;
                    pinn = `${row.pin}`;
                });
                const Profile = 'https://kthos.go.th/KTfaceid/index.php?pin='+pinn;

                // สร้าง Flex Message ที่มี 2 สไลด์
                const flexMessage = {
                    type: 'flex',
                    altText: 'This is a Flex Message',
                    contents: {
                        type: 'carousel',
                        contents: [
                            {
                                type: 'bubble',
                                hero: {
                                    type: 'image',
                                    url: 'https://kthos.go.th/KTfaceid/images/profile.jpg', // URL ของภาพ
                                    size: 'full',
                                    aspectRatio: '16:9',
                                    aspectMode: 'cover',
                                },
                                body: {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'button',
                                            action: {
                                                type: 'uri',
                                                label: 'เปิดโปรไฟล์',
                                                uri: Profile,
                                            },
                                        },
                                    ],
                                },
                            },
                            {
                                type: 'bubble',
                                hero: {
                                    type: 'image',
                                    url: 'https://kthos.go.th/KTfaceid/images/manual.jpg', // URL ของภาพ
                                    size: 'full',
                                    aspectRatio: '16:9',
                                    aspectMode: 'cover',
                                },
                                body: {
                                    type: 'box',
                                    layout: 'vertical',
                                    contents: [
                                        {
                                            type: 'button',
                                            action: {
                                                type: 'uri',
                                                label: 'เปิดอ่าน',
                                                uri: 'https://kthos.go.th/KTfaceid/manual.php',
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                };

                // ส่ง Flex Message ไปยังผู้ใช้ LINE
                client.replyMessage(replyToken, flexMessage)
                    .then(() => {
                        console.log('Flex Message sent successfully');
                    })
                    .catch((err) => {
                        console.error('Error sending Flex Message:', err);
                    });
            }






        }
    });

    res.json({});
});


app.get('/test', (req, res) => {
    res.json({status:'welcome to Test'})
});



app.get('/', (req, res) => {
    res.json({status:'welcome to Klongthom Hospital'})
});


const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

