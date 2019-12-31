const express = require('express')
const LanguageService = require('./language-service')
const { LinkedList } = require('../util/LinkedList')
const { requireAuth } = require('../middleware/jwt-auth')

const languageRouter = express.Router()
const jsonBodyParser = express.json()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {
    try {
      const nextWord = await LanguageService.getNextWord(
        req.app.get('db'),
        req.language.head
        );
        res.status(200)
        res.json(nextWord[0])
        next();
      } catch (error) {
        next(error);
      }
  })

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    const { guess }  = req.body;

    //checking if request body has the required field
    for(const field of [ 'guess']){
      if(!req.body[field]) {
        return res.status(400).send({ 
          error:  `Missing '${field}' in request body` 
        });
      }
    }

    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );

      console.log('words' + words);

      let list = LanguageService.populateLinkedList(
        words, 
        req.language
      );

      console.log('list words' + list.words);

      const head = list.head;

      //if guess is equal to translation in the database
      if(guess === translation) {
        correct = true;
        head.value.memory_value *=2;
        head.value.correct_count++;
        head.value.total_score++;
      }
      //if guess not equal to translation in the database
      else { 
        head.value.memory_value = 1;
        head.value.incorrect_count++;
      }

      list.remove(head.value)
      list.insertAt(head.value, head.value.memory_value)

      displayList(list); //for checking only - what list is displayed

    } catch(error) {
      next(error);
    }

  });


module.exports = languageRouter
