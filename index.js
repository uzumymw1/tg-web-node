const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');



const token = '5702547846:AAH8Iag-C6uKmmQmyUotb-KkbY_dyKxMcsQ';
const webAppUrl = 'https://glowing-tarsier-34ed37.netlify.app'

const bot = new TelegramBot(token, {polling: true});

const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async(msg) => {
  const chatId = msg.chat.id;
  const title = "Let's get started 🍟";

  const text = msg.text;



 if (text == '/start') {
  await bot.sendMessage(chatId,title.bold() + " \n\nPlease tap the button below to order your perfect launch!", {
    reply_markup:
    {
       inline_keyboard:[

       [{text: 'Order Food',web_app:{url:webAppUrl}}]
      ]

    },    parse_mode: 'HTML'
 })

  }
  // send a message to the chat acknowledging receipt of their message


});

app.post('/web-data', async (req, res) => {
  const {queryId, products = [], totalPrice} = req.body;
  try {
      await bot.answerWebAppQuery(queryId, {
          type: 'article',
          id: queryId,
          title: 'Success',
          input_message_content: {
              message_text: `Your Order\n\n${products.map(item => item.title + ' '+ item.quantity  +  'x $' + (item.price * item.quantity).toFixed(2)).join('\n')}\n\nTotal $${totalPrice.toFixed(2)}`
          }
      })
      


       
  // send a message to the chat acknowledging receipt of their message


      return res.status(200).json({});
  } catch (e) {
      return res.status(500).json({})
  }
  
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))