const { LinkedList } = require('../util/LinkedList');

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .orderBy('next', 'ascending')
      .where({ language_id })
  },

  getHead(db, head) {
    return db 
      .from('word')
      .select(
        'original',
        'correct_count',
        'incorrect_count',
      )
      .where('word.id', head)
      .leftJoin('language', 
        'word.id',
        'language.head',
      )
      .then( word => {
        return {
          nextWord: word[0].original,
          wordCorrectCount: word[0].correct_count,
          wordIncorrectCount: word[0].incorrect_count
        }
      })
  },

  populateLinkedList(list, language) {
    let sll = new LinkedList();
    let currNode = list.find(c => c.id === language.head);
    console.log('curr Node' + currNode.value);

    sll.insertLast(currNode);
    

    while(currNode !==null && currNode !== undefined) {
      console.log('original :'+ currNode.original)
      console.log('translation :'+ currNode.translation)
      currNode = list.find(c => c.id === currNode.next);
      sll.insertLast(currNode);
    }

    return sll;
    // let wordList = new LinkedList();
    // wordArr.forEach(word => {
     
    //   wordList.insertLast(word);
    //   wordList.printList(word.translation);
    // });
    // // console.log('word list' +wordList)
    // return wordList;
  },

  getNextWord(db, id) {
    return db
    .from('word')
    .select('original', 'language_id', 'correct_count', 'incorrect_count')
    .where({ id })
    .first()
  },

  updateWords(db, list, language_id, score){
    return db.transaction(async trx => {
      return Promise.all([
        trx('language')
          .where({ id: language_id})
          .update({
            total_score: score,
            head: list[0].id
          }),
          
          ...list.map((word, idx) => {
              let next;
              
              if(idx >= list.length) {
                word.next = null       
              }
              else {
                word.next = list[idx + 1].id
              }

              return trx('word')
              .where({ id: word.id })
              .update({
                ...word
              });
          })
      ]);
    }) ;
  }

}

module.exports = LanguageService
