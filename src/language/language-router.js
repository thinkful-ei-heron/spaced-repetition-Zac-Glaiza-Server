const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const { displayList } = require('../util/linkedList')

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
      const nextWord = await LanguageService.getHead(
        req.app.get('db'),
        req.language.head
        );
        res.status(200)
        res.json({totalScore: req.language.total_score, ...nextWord})
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

    let list;
    try {

      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );

      let list = await LanguageService.populateLinkedList(
        words, 
        req.language
      );

      console.log('list' + list);

      const head = list.head;
      let  { translation } = head.value;
      let correct = false;

      //if guess is equal to translation in the database
      console.log('guess' + guess)
      console.log('translation' + translation)
      if(guess === translation) {
        correct = true;
        head.value.memory_value *=2;
        head.value.correct_count++;
        req.language.total_score++;
      }
      //if guess not equal to translation in the database
      else { 
        head.value.memory_value = 1;
        head.value.incorrect_count++;
      }

      list.remove(head.value)
      list.insertAt(head.value, head.value.memory_value + 1)

      await LanguageService.updateWords(
        req.app.get('db'),
        displayList(list),
        req.language.id,
        req.language.total_score
      );

      const nextWord = list.head.value;

      res.send({
        nextWord: nextWord.original,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        totalScore: req.language.total_score,
        answer: translation,
        isCorrect: correct

      })
      res.status(200).json(results);
      next();

    } catch(error) {
      next(error);
    }

  });


module.exports = languageRouter
