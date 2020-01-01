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
      const nextWord = await LanguageService.getLanguageHead(
        req.app.get('db'),
        req.language.id
        );
        res.json({
          nextWord: nextWord.original,
          wordCorrectCount:  nextWord.correct_count,
          wordIncorrectCount: nextWord.incorrect_count,
          totalScore: nextWord.total_score
        });
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

    //getting head and total_score from getUsersLanguage
    let { head, total_score } = await LanguageService.getUsersLanguage(
      req.app.get('db'),
      req.user.id,
    )
    // console.log('head :' + head)

    //head is taken from getUsersLanguage
    let headValue = await LanguageService.getWordById(req.app.get('db'), head)
    // console.log('head value' + headValue)

    let nextWord = await LanguageService.getWordById(req.app.get('db'), headValue.next)
    // console.log('next word :' +nextWord)

    let results = {
      nextWord: nextWord.original,
      wordCorrectCount: nextWord.correct_count,
      wordIncorrectCount: nextWord.incorrect_count,
      totalScore: total_score,
      answer: headValue.translation,
      isCorrect: false
    }
    // console.log('answer :' + headValue.translation)
    // console.log('guess :' + guess)

    if(guess === headValue.translation) {
      console.log(' guess is correct')
      results.isCorrect = true;
      results.totalScore++;
      headValue.correct_count++;
      headValue.memory_value *= 2;
    } else {
      console.log(' guess is incorrect')
      headValue.incorrect_count++;
      headValue.memory_value = 1
    }

    //Identifying correct placemenet of word after user guess
    let currNode ={ ...headValue };
    let tempNode = null;
    let memoryVal = headValue.memory_value;
    let nxt = 0;

    while(currNode.next !== null && nxt <= memoryVal){
      tempNode = currNode;
      currNode = await LanguageService.getWordById(req.app.get('db'), currNode.next);
      nxt++;
    }

    let newHead = headValue.next;

    if(!currNode.next) {
      tempNode = currNode;
      headValue.next = null;
    } else {
      headValue.next = currNode.id;
    }

    tempNode.next = headValue.id;

    let updateLang = { head: newHead, total_score: results.totalScore};
    // console.log('update Language: ' + updateLang.head);
    
    // console.log('temp Node id: ' + tempNode.id);
    await LanguageService.updateWords(req.app.get('db'), tempNode.id, tempNode)
    await LanguageService.updateWords(req.app.get('db'), headValue.id, headValue)
    await LanguageService.updateLanguage(req.app.get('db'), req.language.id, updateLang);
  
    res.send(results);
  });


module.exports = languageRouter
