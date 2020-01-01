const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
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
        'incorrect_count'
      )
      .where({ language_id });
  },

  getLanguageHead(db, language_id) {
    return db 
      .from('word')
      .select(
        'original',
        'correct_count',
        'incorrect_count',
        'total_score'
      )
      .join('language', 'language.head','=','word.id')
      .where({ language_id })
      .first();
  },

  getWordById(db, id) {
    return db
      .from('word')
      .select('id', 'original', 'translation', 'memory_value', 'correct_count', ' incorrect_count', 'next')
      .where({ id })
      .first();
  },

  updateWords(db, id, word){
    return db
    .from('word')
    .where({ id: id })
    .update(word);
  },

  updateLanguage(db, langId, lang) {
    return db
    .from('language')
    .where({ id: langId })
    .update(lang);
  }

};

module.exports = LanguageService;
