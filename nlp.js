// Courtesy of Ebenezer Don (2020) https://blog.logrocket.com/sentiment-analysis-node-js/

const { WordTokenizer, SentimentAnalyzer, PorterStemmer } = require('natural')
const aposToLexForm = require('apos-to-lex-form')
const SW = require('stopword')

module.exports.getSentiment = function (text) {
  // Pre-processing
  const lexedText = aposToLexForm(text) // [I'm, you're] -> [I am, you are]
  const casedText = lexedText.toLowerCase()
  const alphaOnlyText = casedText.replace(/[^a-zA-Z\s]+/g, ' ') // special chars/numbers can't convey sentiment

  // Tokenisation
  const tokenizer = new WordTokenizer()
  const tokenizedText = tokenizer.tokenize(alphaOnlyText)

  // Remove stopwords (but, a, or, what)
  const filteredText = SW.removeStopwords(tokenizedText)

  // Sentiment analysis
  const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn')
  const analysis = analyzer.getSentiment(filteredText)

  return analysis // numeric polarity of sentiment (good = 1, bad = -1)
}
