// Courtesy of Ebenezer Don (2020) https://blog.logrocket.com/sentiment-analysis-node-js/

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require('natural')
const SpellCorrector = require('spelling-corrector')
const aposToLexForm = require('apos-to-lex-form')
const SW = require('stopword')

const spellCorrector = new SpellCorrector()
spellCorrector.loadDictionary()

module.exports.getSentiment = function (text) {
  // Pre-processing
  const lexedText = aposToLexForm(text) // [I'm, you're] -> [I am, you are]
  const casedText = lexedText.toLowerCase()
  const alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, ' ') // special chars/numbers can't convey sentiment

  // Tokenisation
  const tokenizer = new WordTokenizer()
  const tokenizedText = tokenizer.tokenize(alphaOnlyText)

  // Spelling corrections - removed to test speed implications
  /*tokenizedText.forEach((word, index) => {
    tokenizedText[index] = spellCorrector.correct(word)
  })*/

  // Remove stopwords (but, a, or, what)
  const filteredText = SW.removeStopwords(tokenizedText)

  // Sentiment analysis
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn')
  const analysis = analyzer.getSentiment(filteredText)

  return analysis // numeric polarity of sentiment (good = 3, bad = -3)
}
